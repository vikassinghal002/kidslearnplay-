# Web Push — JiggyJoy

This folder is the home for the push-notification backend. Today only the
client-side opt-in and a stub subscribe route exist:

- `components/PushPermission.tsx` — user-interaction button, asks permission,
  subscribes via `PushManager`, posts the subscription to
  `/api/push/subscribe`.
- `app/api/push/subscribe/route.ts` — stub handler. Logs subscriptions.

To actually _send_ pushes you still need the server pieces below.

## 1. Generate VAPID keys

VAPID (Voluntary Application Server Identification) keys identify your server
to push services (FCM, Mozilla autopush, Windows Push). You need one keypair,
generated once, and kept forever.

```bash
npx web-push generate-vapid-keys
```

Output:

```
Public Key:  BN4...long base64url...
Private Key: abc...base64url...
```

## 2. Store the keys

Put them in Vercel project env vars (Settings → Environment Variables):

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` — the public key. Prefixed `NEXT_PUBLIC_` so
  the browser can read it from `components/PushPermission.tsx`.
- `VAPID_PRIVATE_KEY` — private key. Server-only.
- `VAPID_SUBJECT` — a `mailto:` URL or site URL, e.g. `mailto:hello@jiggyjoy.com`.

Never commit the private key.

## 3. Subscription storage

The stub route logs subscriptions but throws them away. To send pushes later
you need persistent storage. Suggested options:

- **Vercel KV** (Redis) — simplest, same vendor as hosting. Store each
  subscription under `push:sub:<hash(endpoint)>`.
- **Supabase** — free tier, Postgres. Table `push_subscriptions(endpoint text
  primary key, p256dh text, auth text, created_at timestamptz default now())`.

Update `app/api/push/subscribe/route.ts` to upsert into whichever store you
pick. Also add a `DELETE` handler so clients can unsubscribe.

## 4. Server-side sender (sample, do NOT run today)

Install `web-push` only when you're ready to ship the sender:

```bash
npm install web-push
```

```ts
// app/api/push/send/route.ts (future)
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  // 1. auth check — only admin may trigger sends
  // 2. load all subs from your KV / Supabase
  // 3. for each, webpush.sendNotification(sub, JSON.stringify({
  //      title: "New game unlocked!",
  //      body: "Play Dino Run now on JiggyJoy.",
  //      url: "/games/dino-run?utm_source=push"
  //    }))
  // 4. on 410/404, delete the dead subscription from storage
  return Response.json({ ok: true });
}
```

You will also need a `message` handler in `public/sw.js` to actually display
the notification when it arrives:

```js
// append to public/sw.js when you ship push
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "JiggyJoy";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body,
      icon: "/icon",
      badge: "/icon",
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(clients.openWindow(url));
});
```

## 5. Rate limiting / cadence

Kids-app push etiquette: at most 1–2 pushes per week, never during school
hours in the user's timezone. Track last-sent-at per subscription to enforce.

## 6. Checklist to go live

- [ ] Generate VAPID keys, add env vars
- [ ] Pick storage (Vercel KV recommended)
- [ ] Swap the stub route for real upsert
- [ ] Add `push` + `notificationclick` handlers to `public/sw.js`
- [ ] Build admin-only `app/api/push/send/route.ts`
- [ ] Test on Android Chrome, desktop Chrome, desktop Edge, Firefox
- [ ] iOS Safari: only works if the user installs the PWA to home screen
      AND is on iOS 16.4+
