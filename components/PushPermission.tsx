"use client";

import { useState } from "react";

/**
 * Standalone push-notification opt-in button.
 * Drop anywhere. Does NOT auto-mount site-wide (too intrusive).
 *
 * Note: requires NEXT_PUBLIC_VAPID_PUBLIC_KEY env var to fully subscribe.
 * Without it, falls back to permission-only and skips subscription.
 */
export default function PushPermission() {
  const [state, setState] = useState<"idle" | "working" | "granted" | "denied" | "unsupported">(
    "idle"
  );

  const onClick = async () => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }

    setState("working");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapid) {
        // Permission granted but no VAPID key configured — that's fine for
        // the permission-only stage. Store a placeholder so the user sees
        // progress, and skip the server post.
        try {
          localStorage.setItem("jj_push_permission", "granted");
        } catch {
          /* ignore */
        }
        setState("granted");
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid),
      });

      try {
        localStorage.setItem("jj_push_subscription", JSON.stringify(sub));
      } catch {
        /* ignore */
      }

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      }).catch(() => {
        /* best effort */
      });

      setState("granted");
    } catch {
      setState("denied");
    }
  };

  if (state === "granted") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-emerald-700">
        🔔 You will hear about new games!
      </span>
    );
  }

  if (state === "unsupported") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-gray-500">
        Notifications not supported on this device.
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "working"}
      className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700 disabled:opacity-60"
    >
      🔔 {state === "working" ? "Asking..." : "Get notified about new games"}
    </button>
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw =
    typeof window === "undefined"
      ? Buffer.from(base64, "base64").toString("binary")
      : window.atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const output = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}
