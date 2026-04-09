/**
 * Push subscription stub.
 *
 * Accepts a JSON PushSubscription body, logs it server-side, returns 200.
 * Replace the log with real storage (Vercel KV, Supabase, etc.) before
 * actually sending pushes. See `lib/push/README.md` for the full plan.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const sub = await request.json();

    if (!sub || typeof sub !== "object" || !("endpoint" in sub)) {
      return Response.json({ ok: false, error: "invalid subscription" }, { status: 400 });
    }

    // TODO: persist to real store. For now, just log.
    // eslint-disable-next-line no-console
    console.log("[push] new subscription", {
      endpoint: (sub as { endpoint: string }).endpoint,
      receivedAt: new Date().toISOString(),
    });

    return Response.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[push] subscribe failed", err);
    return Response.json({ ok: false, error: "bad request" }, { status: 400 });
  }
}

export async function GET(): Promise<Response> {
  return Response.json({ ok: true, message: "POST a PushSubscription JSON to this endpoint." });
}
