"use client";

/**
 * Stack Attack — precision timing game.
 *
 * A moving platform slides across the screen. Tap/click/Space to drop it.
 * The overlap with the platform below becomes your next platform.
 * Miss completely → game over. Build as high as you can.
 *
 * Mechanic family: TIMING + SPATIAL
 * Target age: 11–14 (and adults — literally the same mechanic as "Stack" mobile)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

const W = 400;
const H = 520;
const PLATFORM_H = 22;
const INITIAL_W = 240;
const MIN_W = 18;          // game over threshold
const BASE_SPEED = 180;    // px/sec initial speed
const SPEED_INC = 12;      // added per level
const STACK_VISIBLE = 7;   // how many past blocks show on screen

type Phase = "menu" | "playing" | "over";

interface Block {
  x: number;
  w: number;
  y: number;     // canvas y of top edge
  color: string;
}

const COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#ec4899",
  "#f43f5e", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6",
];

function getColor(level: number): string {
  return COLORS[level % COLORS.length];
}

function loadHi(): number {
  try { return parseInt(localStorage.getItem("stackattack_hi") ?? "0", 10) || 0; }
  catch { return 0; }
}
function saveHi(s: number) {
  try { localStorage.setItem("stackattack_hi", String(s)); } catch { /* no-op */ }
}

export default function StackAttackGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<{
    blocks: Block[];
    slider: { x: number; w: number; dir: number; speed: number };
    level: number;
    animId: number;
    last: number;
    phase: Phase;
    reducedMotion: boolean;
  } | null>(null);

  const [phase, setPhase] = useState<Phase>("menu");
  const [score, setScore]   = useState(0);
  const [hi, setHi]         = useState<number>(0);
  const [muted, setMuted]   = useState(false);
  const mutedRef = useRef(false);

  // Load hi-score once on mount
  useEffect(() => { setHi(loadHi()); }, []);

  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // ── Init ───────────────────────────────────────────────────────────────
  function buildInitState(): NonNullable<typeof stateRef.current> {
    const baseY = H - PLATFORM_H - 10;
    const baseBlock: Block = {
      x: (W - INITIAL_W) / 2,
      w: INITIAL_W,
      y: baseY,
      color: COLORS[0],
    };
    return {
      blocks: [baseBlock],
      slider: {
        x: 0,
        w: INITIAL_W,
        dir: 1,
        speed: BASE_SPEED,
      },
      level: 1,
      animId: 0,
      last: 0,
      phase: "playing",
      reducedMotion,
    };
  }

  // ── Drop logic ─────────────────────────────────────────────────────────
  const drop = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.phase !== "playing") return;

    const top   = s.blocks[s.blocks.length - 1];
    const sl    = s.slider;

    // Overlap
    const overlapLeft  = Math.max(top.x, sl.x);
    const overlapRight = Math.min(top.x + top.w, sl.x + sl.w);
    const overlap      = overlapRight - overlapLeft;

    if (overlap <= 0) {
      // Miss — game over
      s.phase = "over";
      if (!mutedRef.current) sfx.die();
      return;
    }

    if (!mutedRef.current) {
      const pct = overlap / top.w;
      if (pct > 0.95) sfx.levelUp();   // perfect
      else sfx.correct();
    }

    const newW = Math.max(overlap, 0);
    const newX = overlapLeft;
    const newY = top.y - PLATFORM_H - 2;
    const newColor = getColor(s.level);

    const newBlock: Block = { x: newX, w: newW, y: newY, color: newColor };
    s.blocks.push(newBlock);

    // Scroll blocks down
    const shift = top.y - (H - PLATFORM_H - 10 - (PLATFORM_H + 2) * (s.blocks.length - 1));
    if (s.blocks.length > 1) {
      // keep bottom anchored — shift all blocks down so the stack stays visible
      const stackBottom = H - PLATFORM_H - 10;
      const idealTopY   = stackBottom - (s.blocks.length - 1) * (PLATFORM_H + 2);
      const currentTopY = s.blocks[s.blocks.length - 1].y;
      const delta       = currentTopY - idealTopY;
      if (delta !== 0) {
        for (const b of s.blocks) b.y += delta;
      }
    }

    s.level++;
    // New slider — same width as new block, speed increases
    s.slider = {
      x: 0,
      w: newW,
      dir: 1,
      speed: Math.min(BASE_SPEED + s.level * SPEED_INC, 520),
    };

    setScore(s.level - 1);
  }, []);

  // ── Game loop ─────────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function draw() {
      const s = stateRef.current;
      if (!s) return;

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0f0a2a");
      bg.addColorStop(1, "#1a0f3a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Grid lines (faint)
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }

      // Placed blocks
      const visible = s.blocks.slice(-STACK_VISIBLE);
      for (const b of visible) {
        // Glow
        ctx.shadowColor = b.color;
        ctx.shadowBlur  = 12;
        ctx.fillStyle   = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, PLATFORM_H, 4);
        ctx.fill();
        // Highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle  = "rgba(255,255,255,0.18)";
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, 5, 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Moving slider
      if (s.phase === "playing") {
        const sl = s.slider;
        const sliderY = s.blocks[s.blocks.length - 1].y - (PLATFORM_H + 2);
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur  = 20;
        ctx.fillStyle   = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(sl.x, sliderY, sl.w, PLATFORM_H, 4);
        ctx.fill();
        ctx.shadowBlur  = 0;
        ctx.fillStyle   = "rgba(255,255,255,0.15)";
        ctx.beginPath();
        ctx.roundRect(sl.x, sliderY, sl.w, 5, 2);
        ctx.fill();
      }

      // HUD
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font      = "bold 16px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`Level ${s.level - 1}`, 12, 26);
      ctx.textAlign = "right";
      ctx.fillText(`Best ${Math.max(hi, s.level - 1)}`, W - 12, 26);
      ctx.textAlign = "left";

      // Speed indicator bar
      const pct = Math.min((s.slider.speed - BASE_SPEED) / (520 - BASE_SPEED), 1);
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(12, 34, 100, 5);
      const barColor = pct < 0.5 ? "#22c55e" : pct < 0.8 ? "#eab308" : "#ef4444";
      ctx.fillStyle = barColor;
      ctx.fillRect(12, 34, 100 * pct, 5);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "10px monospace";
      ctx.fillText("SPEED", 12, 50);
    }

    function update(dt: number) {
      const s = stateRef.current;
      if (!s || s.phase !== "playing") return;
      const sl = s.slider;
      sl.x += sl.dir * sl.speed * dt;
      if (sl.x + sl.w >= W) { sl.x = W - sl.w; sl.dir = -1; }
      if (sl.x <= 0)         { sl.x = 0;        sl.dir = 1;  }
    }

    function loop(now: number) {
      const s = stateRef.current;
      if (!s) return;
      const dt = Math.min((now - (s.last || now)) / 1000, 0.05);
      s.last = now;
      if (s.phase === "playing") {
        if (!s.reducedMotion) update(dt);
        draw();
        s.animId = requestAnimationFrame(loop);
      } else {
        draw();
        // Push state out to React
        const finalScore = s.level - 1;
        setScore(finalScore);
        const newHi = Math.max(finalScore, loadHi());
        if (newHi > loadHi()) saveHi(newHi);
        setHi(newHi);
        setPhase("over");
      }
    }

    const st = stateRef.current;
    if (st) {
      st.last = performance.now();
      st.animId = requestAnimationFrame(loop);
    }
  }, [hi]);

  // ── Start game ────────────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    stateRef.current = buildInitState();
    setScore(0);
    setPhase("playing");
    if (!mutedRef.current) startMusic("adventure");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Launch loop when phase switches to playing
  useEffect(() => {
    if (phase !== "playing") return;
    startLoop();
    return () => {
      if (stateRef.current) cancelAnimationFrame(stateRef.current.animId);
      stopMusic();
    };
  }, [phase, startLoop]);

  // ── Input ─────────────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      drop();
    }
  }, [drop]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (phase === "playing") startMusic("adventure");
  };

  return (
    <div
      className="flex flex-col items-center gap-3 select-none w-full px-3 py-3"
      style={{ maxWidth: "min(100%, 440px)", margin: "0 auto" }}
    >
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-700">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block w-full h-auto touch-manipulation"
          style={{ background: "#0f0a2a" }}
          onClick={phase === "playing" ? drop : undefined}
        />

        {/* Mute button */}
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white text-lg flex items-center justify-center z-20 border border-indigo-500/50 touch-manipulation"
        >
          {muted ? "🔇" : "🔊"}
        </button>

        {/* Menu overlay */}
        {phase === "menu" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 gap-4 px-6">
            <div className="text-6xl">🧱</div>
            <h2 className="text-3xl font-extrabold text-white tracking-widest text-center font-display">
              STACK ATTACK
            </h2>
            <p className="text-gray-300 text-sm text-center max-w-xs">
              Tap to drop each block. The overlap becomes your next platform.
              Miss? Game over. How high can you stack?
            </p>
            {hi > 0 && (
              <p className="text-yellow-300 font-bold text-sm">Best: {hi} levels</p>
            )}
            <button
              onClick={handleStart}
              className="mt-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-extrabold rounded-full text-xl transition-colors shadow-lg shadow-indigo-600/40 touch-manipulation min-h-[56px]"
            >
              PLAY
            </button>
            <p className="text-gray-500 text-xs">Tap canvas · Space · Enter</p>
          </div>
        )}

        {/* Game over overlay */}
        {phase === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 gap-4 px-6">
            <div className="text-5xl">💥</div>
            <h2 className="text-2xl font-extrabold text-red-400">MISSED!</h2>
            <p className="text-white text-lg font-bold">
              {score === 0 ? "No blocks stacked" : `${score} level${score !== 1 ? "s" : ""} high`}
            </p>
            <p className="text-yellow-300 font-bold">Best: {hi}</p>
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-full text-lg transition-colors touch-manipulation min-h-[56px]"
            >
              TRY AGAIN
            </button>
            <a href="/games" className="text-gray-400 hover:text-gray-200 text-sm touch-manipulation min-h-[44px] flex items-center">
              All Games →
            </a>
          </div>
        )}
      </div>

      {/* Tap button for mobile (large, always visible during play) */}
      {phase === "playing" && (
        <button
          onPointerDown={drop}
          className="w-full max-w-xs py-5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-800 text-white font-extrabold text-2xl rounded-2xl shadow-xl shadow-indigo-600/30 touch-manipulation min-h-[72px]"
          aria-label="Drop block"
        >
          TAP TO DROP
        </button>
      )}

      {phase === "playing" && (
        <p className="text-xs text-gray-400 hidden md:block">Space or Enter to drop</p>
      )}
    </div>
  );
}
