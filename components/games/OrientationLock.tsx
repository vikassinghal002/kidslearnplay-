"use client";

import { useEffect, useState } from "react";

/**
 * OrientationLock — shows a friendly "turn your device" overlay on top of
 * a game that only plays well in landscape.
 *
 * Design rules (Genius Gamer × Maya):
 *  - Only activates on mobile/tablet portrait (≤ 1023px width + portrait).
 *  - Never blocks desktop — desktop users see the game immediately.
 *  - Never *forces* — kids can always tap "Play anyway", because some
 *    parents hold phones in weird ways and we will not hold a child
 *    hostage over a UX preference. See also: CSS screen.orientation.lock()
 *    is flaky across iOS Safari, so we use a CSS overlay instead.
 *  - Huge icon, two words of instruction — ages 5+ must understand it
 *    without reading. The phone icon literally rotates to show them what
 *    to do.
 *  - Respects prefers-reduced-motion (animations pause via globals.css).
 */
export default function OrientationLock({ children }: { children: React.ReactNode }) {
  const [needsRotate, setNeedsRotate] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const portraitMq = window.matchMedia("(orientation: portrait)");
    const smallMq = window.matchMedia("(max-width: 1023px)");

    const check = () => {
      setNeedsRotate(portraitMq.matches && smallMq.matches);
    };

    check();

    // Both listeners — orientation flips and window resizes
    portraitMq.addEventListener("change", check);
    smallMq.addEventListener("change", check);
    window.addEventListener("resize", check);

    return () => {
      portraitMq.removeEventListener("change", check);
      smallMq.removeEventListener("change", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  // Reset the "play anyway" dismissal every time we rotate back *out* of
  // portrait, so if they flip portrait again the nag returns.
  useEffect(() => {
    if (!needsRotate) setDismissed(false);
  }, [needsRotate]);

  return (
    <div className="relative w-full h-full">
      {children}

      {needsRotate && !dismissed && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-sm px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rotate-title"
        >
          <div className="max-w-sm text-center text-white">
            {/* Rotating phone icon — draws the kid's eye to the action */}
            <div className="mb-6 flex items-center justify-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <span
                  className="text-7xl animate-bounce-slow inline-block"
                  style={{ animation: "rotatePhone 2.5s ease-in-out infinite" }}
                  aria-hidden="true"
                >
                  📱
                </span>
              </div>
            </div>

            <h2 id="rotate-title" className="font-display text-3xl sm:text-4xl font-extrabold mb-3 leading-tight drop-shadow">
              Turn your device!
            </h2>
            <p className="text-base sm:text-lg text-white/90 font-semibold mb-8 leading-snug">
              This game plays best in <span className="text-yellow-300">landscape mode</span>.
              Rotate sideways to play.
            </p>

            <button
              onClick={() => setDismissed(true)}
              className="inline-block bg-white text-purple-700 hover:bg-purple-50 active:bg-purple-100 font-extrabold text-base sm:text-lg px-8 py-4 rounded-full shadow-xl border-2 border-white/60 transition-colors touch-manipulation"
            >
              Play anyway
            </button>

            <p className="mt-5 text-xs sm:text-sm text-white/70 font-medium">
              Tip: unlock your phone&rsquo;s rotation lock in Control Centre
            </p>
          </div>

          {/* Scoped keyframes for the phone rotate animation. Not worth
              adding to globals.css since it's only used here. */}
          <style>{`
            @keyframes rotatePhone {
              0%, 15%      { transform: rotate(0deg); }
              40%, 60%     { transform: rotate(-90deg); }
              85%, 100%    { transform: rotate(0deg); }
            }
            @media (prefers-reduced-motion: reduce) {
              [style*="rotatePhone"] { animation: none !important; transform: rotate(-90deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
