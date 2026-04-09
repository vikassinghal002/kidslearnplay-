"use client";

/**
 * useCanvas — canvas sizing + DPR hook.
 *
 * Follows the ui_game_config.md sizing rules:
 *   - Intrinsic drawing resolution = W × H (passed in).
 *   - CSS size is controlled by the wrapper div (maxWidth: W/H * (100dvh - 80px)).
 *   - The `wrapperStyle` returned here produces the correct wrapper sizing.
 *   - DPR scaling is OPT-IN (scaleForDpr): most JiggyJoy games set
 *     `canvas.width = W` and rely on CSS stretching — DPR scaling is only
 *     useful when you want pixel-perfect text. Enable per game.
 *
 * Usage:
 *   const { canvasRef, ctx, wrapperStyle } = useCanvas({ width: 480, height: 520 });
 *   <div style={wrapperStyle}>
 *     <canvas ref={canvasRef} width={480} height={520} />
 *   </div>
 */

import { useCallback, useEffect, useMemo, useRef, type CSSProperties } from "react";

export interface UseCanvasOptions {
  width: number;
  height: number;
  /** Background colour (applied via canvas style attribute if omitted from CSS). */
  background?: string;
  /** If true, scale the drawing buffer by devicePixelRatio for crisp text. Default false. */
  scaleForDpr?: boolean;
}

export interface UseCanvasResult {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Returns a 2D context. Safe to call every frame. */
  getContext: () => CanvasRenderingContext2D | null;
  /** Style object for the outer wrapper div (enforces ui_game_config sizing). */
  wrapperStyle: CSSProperties;
  /** Style object for the `<canvas>` element. */
  canvasStyle: CSSProperties;
  width: number;
  height: number;
}

export function useCanvas(options: UseCanvasOptions): UseCanvasResult {
  const { width, height, background, scaleForDpr = false } = options;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const getContext = useCallback((): CanvasRenderingContext2D | null => {
    if (ctxRef.current) return ctxRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctxRef.current = ctx;
    return ctx;
  }, []);

  // Optional DPR handling — redraws by scaling the drawing buffer so text is
  // crisp on retina displays. Most games pass (W, H) directly to the canvas
  // attributes and rely on CSS scaling, which is fine for pixel art games
  // but blurs text. Opt in per-game.
  useEffect(() => {
    if (!scaleForDpr) return;
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxRef.current = ctx;
    }
  }, [width, height, scaleForDpr]);

  // maxWidth follows the ui_game_config formula: W/H * (100dvh - 80px)
  const wrapperStyle = useMemo<CSSProperties>(
    () => ({
      width: "100%",
      maxWidth: `min(100%, calc(${width / height} * (100dvh - 80px)))`,
      margin: "0 auto",
    }),
    [width, height],
  );

  const canvasStyle = useMemo<CSSProperties>(
    () => ({
      width: "100%",
      height: "auto",
      display: "block",
      ...(background ? { background } : {}),
    }),
    [background],
  );

  return { canvasRef, getContext, wrapperStyle, canvasStyle, width, height };
}

/**
 * Convert a client pointer event coordinate to canvas drawing-resolution
 * coordinates. Handles CSS stretching and DPR correctly when the canvas
 * intrinsic W/H differs from its rendered size.
 */
export function clientToCanvas(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
  drawW: number,
  drawH: number,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * drawW,
    y: ((clientY - rect.top) / rect.height) * drawH,
  };
}
