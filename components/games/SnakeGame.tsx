"use client";

/**
 * SnakeGame — refactored to use @/lib/gameEngine.
 *
 * Behaviour is identical to the original standalone version: same grid, same
 * food types and scoring, same swipe + WASD + arrow input, same HUD layout.
 * The engine handles: RAF loop, phase machine, high-score persistence,
 * pointer/swipe input, music/mute, and particle pooling.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useGameLoop,
  useGameState,
  useGameInput,
  sfx,
  music,
  setMuted as setEngineMuted,
  ParticleSystem,
  GameHUD,
  GameOverlay,
} from "@/lib/gameEngine";

const GRID = 20;
const CELL = 24;
const W = GRID * CELL;
const H = GRID * CELL;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface Food {
  x: number;
  y: number;
  type: "normal" | "bonus" | "super";
  timer: number;
}
interface Segment {
  x: number;
  y: number;
}

const FOOD_COLORS: Record<string, string> = {
  normal: "#f87171",
  bonus: "#fbbf24",
  super: "#c084fc",
};
const FOOD_POINTS: Record<string, number> = { normal: 10, bonus: 30, super: 60 };
// ms per step, indexed by level (1..10)
const SPEED_TABLE = [0, 150, 130, 110, 90, 75, 62, 52, 43, 36, 30];

interface SnakeState {
  snake: Segment[];
  dir: Dir;
  foods: Food[];
  steps: number;
  stepAccum: number;
  growing: number;
  bonusTimer: number;
}

function randCell(snake: Segment[]) {
  let x = 0;
  let y = 0;
  do {
    x = Math.floor(Math.random() * GRID);
    y = Math.floor(Math.random() * GRID);
  } while (snake.some((s) => s.x === x && s.y === y));
  return { x, y };
}

function initState(): SnakeState {
  const snake: Segment[] = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  return {
    snake,
    dir: "RIGHT",
    foods: [{ ...randCell(snake), type: "normal", timer: 0 }],
    steps: 0,
    stepAccum: 0,
    growing: 0,
    bonusTimer: 0,
  };
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<SnakeState>(initState());
  const dirQRef = useRef<Dir[]>([]);
  const particlesRef = useRef(new ParticleSystem(80));
  const [muted, setMutedState] = useState(false);

  const g = useGameState({ storageKey: "jiggy.snake.best" });

  const input = useGameInput({
    canvasRef,
    drawW: W,
    drawH: H,
    bindings: {
      up: ["ArrowUp", "KeyW"],
      down: ["ArrowDown", "KeyS"],
      left: ["ArrowLeft", "KeyA"],
      right: ["ArrowRight", "KeyD"],
    },
  });

  // Mute sync — engine keeps a global mute flag so sfx / music calls become
  // no-ops when muted is true.
  useEffect(() => {
    setEngineMuted(muted);
  }, [muted]);

  // Start/stop music on phase change
  useEffect(() => {
    if (g.phase === "playing") music.start("happy");
    else music.stop();
  }, [g.phase]);

  // Reset snake when phase enters "playing" from not-playing
  const prevPhaseRef = useRef(g.phase);
  useEffect(() => {
    if (g.phase === "playing" && prevPhaseRef.current !== "playing") {
      stateRef.current = initState();
      dirQRef.current = [];
      particlesRef.current.clear();
    }
    prevPhaseRef.current = g.phase;
  }, [g.phase]);

  const pushDir = useCallback((d: Dir) => {
    const q = dirQRef.current;
    const opp: Record<Dir, Dir> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };
    const last: Dir = q.length ? q[q.length - 1] : stateRef.current.dir;
    if (d !== opp[last] && q.length < 2) q.push(d);
  }, []);

  // Step: advance snake one grid cell
  const step = useCallback(
    (s: SnakeState) => {
      if (dirQRef.current.length) s.dir = dirQRef.current.shift()!;
      const head = s.snake[0];
      const dx = s.dir === "LEFT" ? -1 : s.dir === "RIGHT" ? 1 : 0;
      const dy = s.dir === "UP" ? -1 : s.dir === "DOWN" ? 1 : 0;
      const nx = (head.x + dx + GRID) % GRID;
      const ny = (head.y + dy + GRID) % GRID;

      // Self collision
      if (s.snake.some((seg) => seg.x === nx && seg.y === ny)) {
        sfx.die();
        g.gameOver();
        return;
      }

      s.snake.unshift({ x: nx, y: ny });
      if (s.growing > 0) s.growing--;
      else s.snake.pop();

      // Food
      for (let i = s.foods.length - 1; i >= 0; i--) {
        const f = s.foods[i];
        if (f.x === nx && f.y === ny) {
          const pts = FOOD_POINTS[f.type] * g.ref.current.level;
          g.addScore(pts);
          s.growing += f.type === "super" ? 4 : f.type === "bonus" ? 2 : 1;
          s.steps++;
          if (f.type === "super") sfx.levelUp();
          else if (f.type === "bonus") sfx.powerUp();
          else sfx.eat();
          particlesRef.current.burst(
            nx * CELL + CELL / 2,
            ny * CELL + CELL / 2,
            FOOD_COLORS[f.type],
            12,
            60,
            0.6,
          );
          s.foods.splice(i, 1);
          const newLevel = Math.min(10, 1 + Math.floor(s.steps / 5));
          if (newLevel > g.ref.current.level) {
            g.setLevel(newLevel);
            sfx.levelUp();
          }
          s.foods.push({ ...randCell(s.snake), type: "normal", timer: 0 });
          break;
        }
      }

      s.bonusTimer--;
      if (s.bonusTimer <= 0) {
        s.bonusTimer = 30 + Math.floor(Math.random() * 20);
        if (s.foods.length < 3) {
          const type = Math.random() < 0.3 ? "super" : "bonus";
          s.foods.push({ ...randCell(s.snake), type, timer: 120 });
        }
      }
      for (const f of s.foods) {
        if (f.type !== "normal") {
          f.timer--;
          if (f.timer <= 0) s.foods = s.foods.filter((ff) => ff !== f);
        }
      }
    },
    [g],
  );

  const draw = useCallback(
    (s: SnakeState) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += CELL) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += CELL) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Snake
      const len = s.snake.length;
      s.snake.forEach((seg, i) => {
        const t = 1 - i / len;
        const h = 140 - i * 1.2;
        ctx.fillStyle = `hsl(${h}, 90%, ${55 + t * 20}%)`;
        ctx.shadowColor = i === 0 ? "#4ade80" : i < 3 ? "#22c55e" : "transparent";
        ctx.shadowBlur = i === 0 ? 14 : i < 3 ? 6 : 0;
        const pad = i === 0 ? 1 : 2;
        ctx.beginPath();
        ctx.roundRect(
          seg.x * CELL + pad,
          seg.y * CELL + pad,
          CELL - pad * 2,
          CELL - pad * 2,
          4,
        );
        ctx.fill();
        if (i === 0) {
          ctx.fillStyle = "#fff";
          ctx.shadowBlur = 0;
          const ex = s.dir === "LEFT" ? -3 : s.dir === "RIGHT" ? 3 : 0;
          const ey = s.dir === "UP" ? -3 : s.dir === "DOWN" ? 3 : 0;
          const ox1 = s.dir === "UP" || s.dir === "DOWN" ? -3 : 0;
          const oy1 = s.dir === "LEFT" || s.dir === "RIGHT" ? -3 : 0;
          const ox2 = s.dir === "UP" || s.dir === "DOWN" ? 3 : 0;
          const oy2 = s.dir === "LEFT" || s.dir === "RIGHT" ? 3 : 0;
          ctx.beginPath();
          ctx.arc(
            seg.x * CELL + CELL / 2 + ex + ox1,
            seg.y * CELL + CELL / 2 + ey + oy1,
            3,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          ctx.beginPath();
          ctx.arc(
            seg.x * CELL + CELL / 2 + ex + ox2,
            seg.y * CELL + CELL / 2 + ey + oy2,
            3,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          ctx.fillStyle = "#111";
          ctx.beginPath();
          ctx.arc(
            seg.x * CELL + CELL / 2 + ex + ox1,
            seg.y * CELL + CELL / 2 + ey + oy1,
            1.5,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          ctx.beginPath();
          ctx.arc(
            seg.x * CELL + CELL / 2 + ex + ox2,
            seg.y * CELL + CELL / 2 + ey + oy2,
            1.5,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      });
      ctx.shadowBlur = 0;

      // Food
      for (const f of s.foods) {
        const pulse = f.type !== "normal" ? Math.sin(Date.now() / 200) * 3 : 0;
        const fc = f.x * CELL + CELL / 2;
        const fy = f.y * CELL + CELL / 2;
        ctx.fillStyle = FOOD_COLORS[f.type];
        ctx.shadowColor = FOOD_COLORS[f.type];
        ctx.shadowBlur = 15 + pulse;
        ctx.beginPath();
        ctx.arc(fc, fy, 7 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (f.type !== "normal" && f.timer < 40) {
          ctx.globalAlpha = f.timer / 40;
          ctx.fillStyle = "#fff";
          ctx.font = "bold 9px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(String(Math.ceil(f.timer / 10)), fc, fy - 12);
          ctx.globalAlpha = 1;
          ctx.textAlign = "left";
        }
      }

      particlesRef.current.draw(ctx);

      // HUD (in-canvas)
      const snap = g.ref.current;
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 13px monospace";
      ctx.fillText(`SCORE ${snap.score}`, 8, 16);
      ctx.textAlign = "center";
      ctx.fillText(`LEVEL ${snap.level}`, W / 2, 16);
      ctx.textAlign = "left";
      ctx.textAlign = "right";
      ctx.fillText(`BEST ${snap.highScore}`, W - 52, 16);
      ctx.textAlign = "left";
      ctx.fillStyle = "#64748b";
      ctx.font = "11px monospace";
      ctx.fillText(`LENGTH ${s.snake.length}`, 8, H - 6);

      // Speed indicator
      ctx.fillStyle = "#4ade80";
      const barW = Math.min(100, snap.level * 10);
      ctx.fillRect(W / 2 - 50, H - 10, barW, 6);
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      ctx.strokeRect(W / 2 - 50, H - 10, 100, 6);
    },
    [g],
  );

  // Main RAF tick
  useGameLoop(
    (dt) => {
      const s = stateRef.current;

      // Handle input edges
      if (input.consumeJustPressed("up")) pushDir("UP");
      if (input.consumeJustPressed("down")) pushDir("DOWN");
      if (input.consumeJustPressed("left")) pushDir("LEFT");
      if (input.consumeJustPressed("right")) pushDir("RIGHT");
      const sw = input.consumeSwipe();
      if (sw) pushDir(sw.toUpperCase() as Dir);

      if (g.ref.current.phase === "playing") {
        const spd = SPEED_TABLE[Math.min(10, g.ref.current.level)];
        s.stepAccum += dt * 1000;
        while (s.stepAccum >= spd && g.ref.current.phase === "playing") {
          s.stepAccum -= spd;
          step(s);
        }
      }

      particlesRef.current.update(dt);
      draw(s);
    },
    { running: true },
  );

  const wrapperStyle = useMemo(
    () => ({
      width: "100%",
      maxWidth: "min(100%, calc(100dvh - 80px))",
      margin: "0 auto",
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-2 select-none" style={wrapperStyle}>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-green-900">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block"
          style={{ width: "100%", height: "auto", background: "#0f172a" }}
        />
        <GameOverlay
          phase={g.phase === "playing" ? "playing" : g.phase === "gameover" ? "gameover" : "title"}
          title="SNAKE"
          emoji="🐍"
          score={g.score}
          highScore={g.highScore}
          level={g.level}
          onStart={g.start}
          onRestart={g.restart}
          accentClass="text-green-400"
          buttonClass="bg-green-500 hover:bg-green-400 shadow-green-500/40"
          subtitle="🍎 = 10 · ⭐ = 30 · 💎 = 60"
          hint="Arrow keys / WASD · Swipe on mobile"
        />
      </div>
      <GameHUD
        phase={g.phase}
        muted={muted}
        onToggleMute={() => setMutedState((m) => !m)}
        hint="Arrow keys to move · Swipe on mobile · Collect ⭐💎 for bonus points!"
      />
    </div>
  );
}
