/**
 * Admin-only push fan-out.
 *
 * POST /api/push/send
 *   headers: x-admin-token: <PUSH_ADMIN_TOKEN>
 *   body:    { title: string, body: string, url?: string, tag?: string }
 *
 * Iterates the in-memory subscription Map (`lib/push/store.ts`) and sends a
 * WebPush notification to every entry using the `web-push` library.
 *
 * Env required:
 *   - NEXT_PUBLIC_VAPID_PUBLIC_KEY
 *   - VAPID_PRIVATE_KEY
 *   - VAPID_SUBJECT            (e.g. "mailto:hello@jiggyjoy.com")
 *   - PUSH_ADMIN_TOKEN         (shared secret; the CLI sends this as a header)
 *
 * If any VAPID env var is missing, this endpoint returns a 500 with a helpful
 * hint INSTEAD of crashing the serverless function. That lets the /videos
 * page and the rest of the site build & run even when push isn't configured.
 */

import webpush, { type WebPushError } from "web-push";
import { subscriptions } from "@/lib/push/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SendBody = {
  title?: unknown;
  body?: unknown;
  url?: unknown;
  tag?: unknown;
};

export async function POST(request: Request): Promise<Response> {
  // ── 1. Admin auth ────────────────────────────────────────────────────────
  const adminToken = process.env.PUSH_ADMIN_TOKEN;
  if (!adminToken) {
    return Response.json(
      {
        ok: false,
        error: "PUSH_ADMIN_TOKEN not configured",
        hint: "Set PUSH_ADMIN_TOKEN in .env.local. See lib/push/README.md.",
      },
      { status: 500 },
    );
  }
  const providedToken = request.headers.get("x-admin-token");
  if (providedToken !== adminToken) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // ── 2. VAPID config ──────────────────────────────────────────────────────
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT;
  if (!vapidPublic || !vapidPrivate || !vapidSubject) {
    return Response.json(
      {
        ok: false,
        error: "VAPID keys not configured",
        hint: "See lib/push/README.md",
      },
      { status: 500 },
    );
  }
  try {
    webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);
  } catch (err) {
    return Response.json(
      {
        ok: false,
        error: "invalid VAPID configuration",
        detail: err instanceof Error ? err.message : String(err),
        hint: "See lib/push/README.md",
      },
      { status: 500 },
    );
  }

  // ── 3. Parse payload ─────────────────────────────────────────────────────
  let raw: SendBody;
  try {
    raw = (await request.json()) as SendBody;
  } catch {
    return Response.json({ ok: false, error: "invalid JSON body" }, { status: 400 });
  }

  const title = typeof raw.title === "string" ? raw.title : null;
  const body = typeof raw.body === "string" ? raw.body : null;
  if (!title || !body) {
    return Response.json(
      { ok: false, error: "missing title or body" },
      { status: 400 },
    );
  }
  const url = typeof raw.url === "string" ? raw.url : "/";
  const tag = typeof raw.tag === "string" ? raw.tag : undefined;

  const payload = JSON.stringify({ title, body, url, tag });

  // ── 4. Fan out ──────────────────────────────────────────────────────────
  let sent = 0;
  let failed = 0;
  const deadEndpoints: string[] = [];

  const entries = Array.from(subscriptions.entries());
  await Promise.all(
    entries.map(async ([endpoint, sub]) => {
      try {
        // web-push's types want a strict PushSubscription shape; the stored
        // PushSubscriptionJSON is compatible at runtime.
        await webpush.sendNotification(
          sub as unknown as webpush.PushSubscription,
          payload,
        );
        sent += 1;
      } catch (err) {
        failed += 1;
        const status = (err as WebPushError)?.statusCode;
        if (status === 404 || status === 410) {
          // Gone — remove dead subscription.
          deadEndpoints.push(endpoint);
        }
        // eslint-disable-next-line no-console
        console.warn("[push] send failed", {
          endpoint,
          status,
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }),
  );

  for (const ep of deadEndpoints) subscriptions.delete(ep);

  return Response.json({
    ok: true,
    sent,
    failed,
    pruned: deadEndpoints.length,
    remaining: subscriptions.size,
  });
}

export async function GET(): Promise<Response> {
  return Response.json({
    ok: true,
    message:
      "POST { title, body, url?, tag? } with header x-admin-token to fan out a push to every subscribed device.",
    subscriberCount: subscriptions.size,
  });
}
