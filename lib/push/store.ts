// ─── Push subscription store ─────────────────────────────────────────────────
//
// SWAP-ME-FOR-VERCEL-KV-IN-PRODUCTION.
//
// This is an intentionally dumb, in-memory `Map` of push subscriptions keyed
// by endpoint. It is fine for local development and for smoke-testing the
// `/api/push/send` fan-out end-to-end on a single long-running Node process.
//
// It is NOT fine for production on Vercel (or any other serverless host)
// because:
//
//   1. The Map lives inside a single serverless instance. Every cold start
//      throws away every subscription. Two concurrent requests can even hit
//      two different instances and see different maps.
//   2. There is no persistence. A deploy / a crash / an idle scale-to-zero
//      all wipe the data.
//   3. There is no indexing, TTL, or dead-letter handling for expired
//      endpoints (410 Gone).
//
// Production swap-in options, in order of preference:
//
//   - Vercel KV            (Redis, same vendor as the host — lowest friction)
//   - Upstash Redis        (if you're not on Vercel)
//   - Supabase / Postgres  (if you want SQL & easy inspection)
//
// The shape of this module is deliberately tiny (one exported `Map`) so the
// swap is a ~20-line PR: replace the Map operations in the route handlers
// with KV `hset` / `hgetall` / `hdel` and delete this file.
//
// See `lib/push/README.md` for the full migration plan.

/**
 * The in-memory subscription store.
 *
 * Key: the push subscription's `endpoint` URL (guaranteed unique per device).
 * Value: the full `PushSubscriptionJSON` (includes `keys.p256dh` and
 *        `keys.auth`, which `web-push` needs to encrypt payloads).
 */
export const subscriptions: Map<string, PushSubscriptionJSON> = new Map();
