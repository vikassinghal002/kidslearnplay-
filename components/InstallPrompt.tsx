"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const VISIT_KEY = "jj_visit_count";
const DISMISS_KEY = "jj_install_dismissed_at";
const IOS_DISMISS_KEY = "jj_ios_install_dismissed_at";
const DISMISS_DAYS = 30;

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS Safari exposes navigator.standalone; everyone else uses display-mode
  const nav = window.navigator as Navigator & { standalone?: boolean };
  if (nav.standalone) return true;
  if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
  return false;
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const iOS = /iPad|iPhone|iPod/.test(ua);
  // iPad on iOS 13+ reports as Mac; detect via touch support
  const iPadOS =
    navigator.platform === "MacIntel" &&
    typeof (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints === "number" &&
    ((navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints ?? 0) > 1;
  return iOS || iPadOS;
}

function dismissedRecently(key: string): boolean {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const when = parseInt(raw, 10);
    if (!Number.isFinite(when)) return false;
    const ageDays = (Date.now() - when) / (1000 * 60 * 60 * 24);
    return ageDays < DISMISS_DAYS;
  } catch {
    return false;
  }
}

function trackGtag(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    try {
      w.gtag("event", event, params || {});
    } catch {
      /* noop */
    }
  }
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosShow, setIosShow] = useState(false);

  // Bump visit counter on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return; // already installed

    try {
      const raw = localStorage.getItem(VISIT_KEY);
      const n = raw ? parseInt(raw, 10) || 0 : 0;
      localStorage.setItem(VISIT_KEY, String(n + 1));
    } catch {
      /* ignore */
    }
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      setDeferred(evt);

      try {
        const n = parseInt(localStorage.getItem(VISIT_KEY) || "0", 10) || 0;
        if (n >= 3 && !dismissedRecently(DISMISS_KEY)) {
          setShow(true);
        }
      } catch {
        setShow(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    const onInstalled = () => {
      setShow(false);
      setDeferred(null);
      trackGtag("pwa_installed");
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler as EventListener);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // iOS: no beforeinstallprompt, so show separate banner
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;
    if (!isIOS()) return;

    try {
      const n = parseInt(localStorage.getItem(VISIT_KEY) || "0", 10) || 0;
      if (n >= 3 && !dismissedRecently(IOS_DISMISS_KEY)) {
        setIosShow(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const onInstall = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        trackGtag("pwa_install_accepted");
      } else {
        trackGtag("pwa_install_dismissed");
        try {
          localStorage.setItem(DISMISS_KEY, String(Date.now()));
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
    } finally {
      setDeferred(null);
      setShow(false);
    }
  };

  const onDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setShow(false);
    trackGtag("pwa_install_banner_dismissed");
  };

  const onIosDismiss = () => {
    try {
      localStorage.setItem(IOS_DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setIosShow(false);
    trackGtag("pwa_ios_banner_dismissed");
  };

  if (show) {
    return (
      <div
        role="dialog"
        aria-label="Install JiggyJoy"
        style={{
          position: "fixed",
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 9999,
          background: "#ffffff",
          color: "#1f2937",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          maxWidth: 560,
          margin: "0 auto",
          border: "1px solid #ede9fe",
        }}
      >
        <div style={{ fontSize: 22, lineHeight: 1 }} aria-hidden>
          📱
        </div>
        <div style={{ flex: 1, fontSize: 14, lineHeight: 1.35 }}>
          <strong style={{ display: "block", color: "#7c3aed" }}>Install JiggyJoy</strong>
          <span>Play offline, no ads!</span>
        </div>
        <button
          onClick={onInstall}
          style={{
            background: "#7c3aed",
            color: "white",
            border: 0,
            borderRadius: 999,
            padding: "8px 14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Install
        </button>
        <button
          onClick={onDismiss}
          aria-label="Dismiss install prompt"
          style={{
            background: "transparent",
            border: 0,
            color: "#6b7280",
            padding: 6,
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          ×
        </button>
      </div>
    );
  }

  if (iosShow) {
    return (
      <div
        role="dialog"
        aria-label="Add JiggyJoy to Home Screen"
        style={{
          position: "fixed",
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 9999,
          background: "#ffffff",
          color: "#1f2937",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          maxWidth: 560,
          margin: "0 auto",
          border: "1px solid #ede9fe",
        }}
      >
        <div style={{ fontSize: 22, lineHeight: 1 }} aria-hidden>
          📱
        </div>
        <div style={{ flex: 1, fontSize: 13, lineHeight: 1.35 }}>
          <strong style={{ display: "block", color: "#7c3aed" }}>Install JiggyJoy</strong>
          <span>Tap Share then Add to Home Screen.</span>
        </div>
        <button
          onClick={onIosDismiss}
          aria-label="Dismiss"
          style={{
            background: "transparent",
            border: 0,
            color: "#6b7280",
            padding: 6,
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          ×
        </button>
      </div>
    );
  }

  return null;
}
