/**
 * Push subscription endpoint.
 *
 * POST   { subscription: PushSubscriptionJSON }        → store in the map
 * DELETE { endpoint: string } (or a full subscription) → remove from the map
 *
 * Both return `{ ok: true, count: subscriptions.size }` on success.
 *
 * NOTE: storage is the in-memory Map in `lib/push/store.ts`. That module has
 * a big comment block explaining why this must be swapped for Vercel KV /
 * Upstash / Supabase before production.
 */

import { subscriptions } from "@/lib/push/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubscribeBody = {
  subscription?: PushSubscriptionJSON;
  // Legacy: older PushPermission.tsx posts the subscription as the top-level
  // body. We accept either shape so we don't break the existing client.
  endpoint?: string;
};

function extractSubscription(body: unknown): PushSubscriptionJSON | null {
  if (!body || typeof body !== "object") return null;
  const b = body as SubscribeBody & Record<string, unknown>;

  // Shape 1: { subscription: {...} }
  if (b.subscription && typeof b.subscription === "object" && "endpoint" in b.subscription) {
    return b.subscription as PushSubscriptionJSON;
  }

  // Shape 2: the body IS the subscription.
  if ("endpoint" in b && typeof b.endpoint === "string") {
    return b as unknown as PushSubscriptionJSON;
  }

  return null;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const sub = extractSubscription(body);

    if (!sub || !sub.endpoint) {
      return Response.json(
        { ok: false, error: "invalid subscription — expected { subscription: PushSubscriptionJSON } or a raw PushSubscription" },
        { status: 400 },
      );
    }

    subscriptions.set(sub.endpoint, sub);

    // eslint-disable-next-line no-console
    console.log("[push] subscribed", {
      endpoint: sub.endpoint,
      total: subscriptions.size,
      receivedAt: new Date().toISOString(),
    });

    return Response.json({ ok: true, count: subscriptions.size });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[push] subscribe failed", err);
    return Response.json({ ok: false, error: "bad request" }, { status: 400 });
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => ({}));
    const sub = extractSubscription(body);
    const endpoint =
      sub?.endpoint ?? (typeof (body as { endpoint?: unknown })?.endpoint === "string"
        ? (body as { endpoint: string }).endpoint
        : null);

    if (!endpoint) {
      return Response.json(
        { ok: false, error: "missing endpoint" },
        { status: 400 },
      );
    }

    const existed = subscriptions.delete(endpoint);

    // eslint-disable-next-line no-console
    console.log("[push] unsubscribed", {
      endpoint,
      existed,
      total: subscriptions.size,
    });

    return Response.json({ ok: true, count: subscriptions.size, removed: existed });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[push] unsubscribe failed", err);
    return Response.json({ ok: false, error: "bad request" }, { status: 400 });
  }
}

export async function GET(): Promise<Response> {
  return Response.json({
    ok: true,
    count: subscriptions.size,
    message: "POST a PushSubscription JSON to subscribe, DELETE to unsubscribe.",
  });
}
