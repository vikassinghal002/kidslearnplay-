"use client";

/**
 * useGameInput — unified keyboard + pointer + touch/swipe input hook.
 *
 * Returns a stable ref-like object with the *current* input state. Read
 * it from inside your RAF tick — it mutates in place (no re-renders).
 *
 * Keyboard:
 *   - `pressed` — currently-held keys by logical name (e.g. "up", "action")
 *   - `justPressed` — edge-triggered; cleared after every tick you consume it
 *
 * Pointer:
 *   - `pointer.x/y` — canvas-space coordinates (null until first event)
 *   - `pointer.down` — true while primary button is held
 *   - `pointer.tap` — single-frame true on press; consume via `consumeTap()`
 *
 * Swipe:
 *   - `swipe.direction` — "up" | "down" | "left" | "right" on release; consume
 *     with `consumeSwipe()` to clear.
 *
 * Usage:
 *   const input = useGameInput({
 *     canvasRef,
 *     drawW: 480, drawH: 480,
 *     bindings: {
 *       up:    ["ArrowUp", "KeyW"],
 *       down:  ["ArrowDown", "KeyS"],
 *       left:  ["ArrowLeft", "KeyA"],
 *       right: ["ArrowRight", "KeyD"],
 *       action:["Space", "Enter"],
 *     },
 *   });
 *   // inside tick:
 *   if (input.pressed.up) player.y -= 2;
 *   if (input.consumeJustPressed("action")) player.jump();
 *   const swipe = input.consumeSwipe();
 *   if (swipe === "left") snake.turn("LEFT");
 */

import { useEffect, useMemo, useRef } from "react";

export type KeyBindings = Record<string, string[]>;

export interface UseGameInputOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Drawing resolution width (for pointer coordinate translation). */
  drawW: number;
  /** Drawing resolution height. */
  drawH: number;
  /** Map of logical action → array of KeyboardEvent.code values. */
  bindings?: KeyBindings;
  /** Swipe threshold in CSS pixels (default 20). */
  swipeThreshold?: number;
  /** If true, calls preventDefault on handled keys. Default true. */
  preventDefault?: boolean;
}

export interface GameInput {
  /** Logical actions currently held. */
  pressed: Record<string, boolean>;
  /** Edge-triggered "just pressed" actions — call consumeJustPressed to read+clear. */
  justPressed: Record<string, boolean>;
  consumeJustPressed: (action: string) => boolean;
  /** Current pointer state. */
  pointer: {
    x: number | null;
    y: number | null;
    down: boolean;
    tap: boolean;
  };
  consumeTap: () => boolean;
  /** Swipe direction since last consumption, or null. */
  swipe: { direction: "up" | "down" | "left" | "right" | null };
  consumeSwipe: () => "up" | "down" | "left" | "right" | null;
}

export function useGameInput(options: UseGameInputOptions): GameInput {
  const {
    canvasRef,
    drawW,
    drawH,
    bindings = {},
    swipeThreshold = 20,
    preventDefault = true,
  } = options;

  // Stable mutable state object — same identity across renders.
  const stateRef = useRef<GameInput | null>(null);
  if (!stateRef.current) {
    stateRef.current = {
      pressed: {},
      justPressed: {},
      consumeJustPressed: (action: string) => {
        const s = stateRef.current!;
        if (s.justPressed[action]) {
          s.justPressed[action] = false;
          return true;
        }
        return false;
      },
      pointer: { x: null, y: null, down: false, tap: false },
      consumeTap: () => {
        const s = stateRef.current!;
        if (s.pointer.tap) {
          s.pointer.tap = false;
          return true;
        }
        return false;
      },
      swipe: { direction: null },
      consumeSwipe: () => {
        const s = stateRef.current!;
        const d = s.swipe.direction;
        s.swipe.direction = null;
        return d;
      },
    };
  }

  // Build reverse lookup: KeyboardEvent.code → logical action. Recompute on
  // bindings change only — bindings are usually constant per game.
  const codeToAction = useMemo(() => {
    const map: Record<string, string> = {};
    for (const action of Object.keys(bindings)) {
      for (const code of bindings[action]) {
        map[code] = action;
      }
    }
    return map;
  }, [bindings]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const state = stateRef.current!;

    const onKeyDown = (e: KeyboardEvent) => {
      const action = codeToAction[e.code];
      if (!action) return;
      if (preventDefault) e.preventDefault();
      if (!state.pressed[action]) {
        state.justPressed[action] = true;
      }
      state.pressed[action] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const action = codeToAction[e.code];
      if (!action) return;
      state.pressed[action] = false;
    };

    window.addEventListener("keydown", onKeyDown, { passive: !preventDefault });
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [codeToAction, preventDefault]);

  // Pointer + touch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const state = stateRef.current!;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    const toCanvas = (cx: number, cy: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((cx - rect.left) / rect.width) * drawW,
        y: ((cy - rect.top) / rect.height) * drawH,
      };
    };

    const onPointerDown = (e: PointerEvent) => {
      if (preventDefault) e.preventDefault();
      const p = toCanvas(e.clientX, e.clientY);
      state.pointer.x = p.x;
      state.pointer.y = p.y;
      state.pointer.down = true;
      state.pointer.tap = true;
      touchStartX = e.clientX;
      touchStartY = e.clientY;
      touchStartTime = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = toCanvas(e.clientX, e.clientY);
      state.pointer.x = p.x;
      state.pointer.y = p.y;
    };

    const onPointerUp = (e: PointerEvent) => {
      state.pointer.down = false;
      // Evaluate swipe direction
      const dx = e.clientX - touchStartX;
      const dy = e.clientY - touchStartY;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      const dur = performance.now() - touchStartTime;
      if (dur < 600 && (adx > swipeThreshold || ady > swipeThreshold)) {
        state.swipe.direction =
          adx > ady ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown, { passive: !preventDefault });
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerup", onPointerUp, { passive: true });
    canvas.addEventListener("pointercancel", onPointerUp, { passive: true });

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, [canvasRef, drawW, drawH, swipeThreshold, preventDefault]);

  return stateRef.current!;
}
