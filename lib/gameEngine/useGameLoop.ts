"use client";

/**
 * useGameLoop — requestAnimationFrame hook with pause/resume + delta time.
 *
 * Usage:
 *   useGameLoop((dt) => { update(dt); draw(); }, { running: phase === "playing" });
 *
 * - `dt` is in seconds, clamped to max 50ms so tab-switching does not explode physics.
 * - The tick callback is stored in a ref so callers can close over latest state
 *   without re-subscribing the RAF loop on every render.
 * - Pass `running: false` to pause the loop; flip back to resume (delta time is
 *   reset on resume so pause doesn't cause a jump).
 */

import { useEffect, useRef } from "react";

export type GameLoopTick = (dt: number, now: number) => void;

export interface UseGameLoopOptions {
  /** When false, the RAF loop is stopped. Default: true. */
  running?: boolean;
  /** Maximum delta (seconds) passed to the tick. Default: 0.05 (50ms). */
  maxDelta?: number;
}

export function useGameLoop(tick: GameLoopTick, options: UseGameLoopOptions = {}) {
  const { running = true, maxDelta = 0.05 } = options;
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    if (!running) return;
    if (typeof window === "undefined") return;

    let rafId = 0;
    let last = performance.now();
    let cancelled = false;

    const frame = (now: number) => {
      if (cancelled) return;
      const dt = Math.min((now - last) / 1000, maxDelta);
      last = now;
      try {
        tickRef.current(dt, now);
      } catch (err) {
        // Don't let a single-frame error kill the RAF loop silently in dev.
        // Log and continue; if the error is persistent the user will see it.
        // eslint-disable-next-line no-console
        console.error("[gameEngine] tick error", err);
      }
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [running, maxDelta]);
}
