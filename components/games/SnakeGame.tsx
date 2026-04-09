"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { sfx, startMusic, stopMusic } from "@/lib/gameAudio";

const GRID = 20, CELL = 24;
const W = GRID * CELL, H = GRID * CELL;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Phase = "menu" | "playing" | "dead";

interface Food { x: number; y: number; type: "normal" | "bonus" | "super"; timer: number }
interface Segment { x: number; y: number }

const FOOD_COLORS: Record<string, string>  = { normal: "#f87171", bonus: "#fbbf24", super: "#c084fc" };
const FOOD_EMOJIS: Record<string, string>  = { normal: "🍎", bonus: "⭐", super: "💎" };
const FOOD_POINTS: Record<string, number>  = { normal: 10, bonus: 30, super: 60 };
const SPEED_TABLE = [0, 150, 130, 110, 90, 75, 62, 52, 43, 36, 30]; // ms per step by level

function randCell(snake: Segment[]) {
  let x = 0, y = 0;
  do { x = Math.floor(Math.random() * GRID); y = Math.floor(Math.random() * GRID); }
  while (snake.some(s => s.x === x && s.y === y));
  return { x, y };
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<any>(null);
  const dirQRef   = useRef<Dir[]>([]);
  const [phase, setPhase]     = useState<Phase>("menu");
  const [score, setScore]     = useState(0);
  const [hiScore, setHiScore] = useState(0);
  const [level, setLevel]     = useState(1);
  const [muted, setMuted]     = useState(false);

  const initState = useCallback(() => {
    const snake: Segment[] = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    return {
      snake, dir: "RIGHT" as Dir, nextDir: "RIGHT" as Dir,
      foods: [{ ...randCell(snake), type: "normal" as const, timer: 0 }] as Food[],
      score: 0, level: 1, steps: 0,
      phase: "playing" as Phase,
      stepTimer: 0,
      particles: [] as any[],
      growing: 0,
      bonusTimer: 0,
    };
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    if (!muted) startMusic("happy");
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { ArrowUp: "UP", KeyW: "UP", ArrowDown: "DOWN", KeyS: "DOWN", ArrowLeft: "LEFT", KeyA: "LEFT", ArrowRight: "RIGHT", KeyD: "RIGHT" };
      const d = map[e.code]; if (!d) return;
      e.preventDefault();
      const q = dirQRef.current;
      const last: Dir = (q.length ? q[q.length - 1] : stateRef.current?.dir) ?? "RIGHT";
      const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (d !== opp[last] && q.length < 2) q.push(d);
    };
    window.addEventListener("keydown", onKey, { passive: false });
    stateRef.current = initState();
    dirQRef.current = [];

    let animId: number, last = performance.now();

    function step(s: any) {
      // Consume queued direction
      if (dirQRef.current.length) { s.dir = dirQRef.current.shift()!; }

      const head = s.snake[0];
      const dx = s.dir === "LEFT" ? -1 : s.dir === "RIGHT" ? 1 : 0;
      const dy = s.dir === "UP"   ? -1 : s.dir === "DOWN"  ? 1 : 0;
      const nx = (head.x + dx + GRID) % GRID;
      const ny = (head.y + dy + GRID) % GRID;

      // Self collision
      if (s.snake.some((seg: Segment) => seg.x === nx && seg.y === ny)) { s.phase = "dead"; if (!muted) sfx.die(); return; }

      s.snake.unshift({ x: nx, y: ny });
      if (s.growing > 0) s.growing--; else s.snake.pop();

      // Food
      for (let i = s.foods.length - 1; i >= 0; i--) {
        const f = s.foods[i];
        if (f.x === nx && f.y === ny) {
          const pts = FOOD_POINTS[f.type] * s.level;
          s.score += pts;
          s.growing += f.type === "super" ? 4 : f.type === "bonus" ? 2 : 1;
          s.steps++;
          if (!muted) { if (f.type === "super") sfx.levelUp(); else if (f.type === "bonus") sfx.powerUp(); else sfx.eat(); }
          // Particles
          for (let j = 0; j < 12; j++) {
            const angle = (j / 12) * Math.PI * 2;
            s.particles.push({ x: nx * CELL + CELL/2, y: ny * CELL + CELL/2, vx: Math.cos(angle) * 60, vy: Math.sin(angle) * 60, life: 0.6, color: FOOD_COLORS[f.type] });
          }
          s.foods.splice(i, 1);
          // Level up
          const newLevel = Math.min(10, 1 + Math.floor(s.steps / 5));
          if (newLevel > s.level) { s.level = newLevel; if (!muted) sfx.levelUp(); }
          // Spawn new food
          s.foods.push({ ...randCell(s.snake), type: "normal", timer: 0 });
          break;
        }
      }

      // Bonus food spawner
      s.bonusTimer--;
      if (s.bonusTimer <= 0) {
        s.bonusTimer = 30 + Math.floor(Math.random() * 20);
        if (s.foods.length < 3) {
          const type = Math.random() < 0.3 ? "super" : "bonus";
          s.foods.push({ ...randCell(s.snake), type, timer: 120 });
        }
      }
      // Expire bonus foods
      for (const f of s.foods) { if (f.type !== "normal") { f.timer--; if (f.timer <= 0) s.foods = s.foods.filter((ff: Food) => ff !== f); } }
    }

    function draw(s: any) {
      // Background
      ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, W, H);
      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += CELL) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += CELL) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Snake
      const len = s.snake.length;
      s.snake.forEach((seg: Segment, i: number) => {
        const t = 1 - i / len;
        const h = 140 - i * 1.2; // hue shift green→teal
        ctx.fillStyle = `hsl(${h}, 90%, ${55 + t * 20}%)`; // bright: 55–75% lightness
        ctx.shadowColor = i === 0 ? "#4ade80" : i < 3 ? "#22c55e" : "transparent";
        ctx.shadowBlur  = i === 0 ? 14 : i < 3 ? 6 : 0;
        const pad = i === 0 ? 1 : 2;
        ctx.beginPath();
        ctx.roundRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 4);
        ctx.fill();
        // Head eyes
        if (i === 0) {
          ctx.fillStyle = "#fff"; ctx.shadowBlur = 0;
          const ex = s.dir === "LEFT" ? -3 : s.dir === "RIGHT" ? 3 : 0;
          const ey = s.dir === "UP" ? -3 : s.dir === "DOWN" ? 3 : 0;
          ctx.beginPath(); ctx.arc(seg.x * CELL + CELL/2 + ex + (s.dir === "UP" || s.dir === "DOWN" ? -3 : 0),
            seg.y * CELL + CELL/2 + ey + (s.dir === "LEFT" || s.dir === "RIGHT" ? -3 : 0), 3, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(seg.x * CELL + CELL/2 + ex + (s.dir === "UP" || s.dir === "DOWN" ? 3 : 0),
            seg.y * CELL + CELL/2 + ey + (s.dir === "LEFT" || s.dir === "RIGHT" ? 3 : 0), 3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#111";
          ctx.beginPath(); ctx.arc(seg.x * CELL + CELL/2 + ex + (s.dir === "UP" || s.dir === "DOWN" ? -3 : 0),
            seg.y * CELL + CELL/2 + ey + (s.dir === "LEFT" || s.dir === "RIGHT" ? -3 : 0), 1.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(seg.x * CELL + CELL/2 + ex + (s.dir === "UP" || s.dir === "DOWN" ? 3 : 0),
            seg.y * CELL + CELL/2 + ey + (s.dir === "LEFT" || s.dir === "RIGHT" ? 3 : 0), 1.5, 0, Math.PI * 2); ctx.fill();
        }
      });
      ctx.shadowBlur = 0;

      // Food
      for (const f of s.foods) {
        const pulse = f.type !== "normal" ? Math.sin(Date.now() / 200) * 3 : 0;
        const fc = f.x * CELL + CELL / 2, fy = f.y * CELL + CELL / 2;
        ctx.fillStyle = FOOD_COLORS[f.type];
        ctx.shadowColor = FOOD_COLORS[f.type]; ctx.shadowBlur = 15 + pulse;
        ctx.beginPath(); ctx.arc(fc, fy, 7 + pulse, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        // Fading bonus timer
        if (f.type !== "normal" && f.timer < 40) {
          ctx.globalAlpha = f.timer / 40;
          ctx.fillStyle = "#fff"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
          ctx.fillText(String(Math.ceil(f.timer / 10)), fc, fy - 12);
          ctx.globalAlpha = 1; ctx.textAlign = "left";
        }
      }

      // Particles
      for (const p of s.particles) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // HUD
      ctx.fillStyle = "#e2e8f0"; ctx.font = "bold 13px monospace";
      ctx.fillText(`SCORE ${s.score}`, 8, 16);
      ctx.textAlign = "center"; ctx.fillText(`LEVEL ${s.level}`, W / 2, 16); ctx.textAlign = "left";
      ctx.textAlign = "right"; ctx.fillText(`BEST ${hiScore}`, W - 52, 16); ctx.textAlign = "left";
      // Length
      ctx.fillStyle = "#64748b"; ctx.font = "11px monospace";
      ctx.fillText(`LENGTH ${s.snake.length}`, 8, H - 6);

      // Speed indicator
      ctx.fillStyle = "#4ade80"; const barW = Math.min(100, s.level * 10);
      ctx.fillRect(W / 2 - 50, H - 10, barW, 6); ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1; ctx.strokeRect(W / 2 - 50, H - 10, 100, 6);
    }

    const speed = () => SPEED_TABLE[Math.min(10, stateRef.current?.level ?? 1)];
    let stepInterval = speed();
    let stepAccum = 0;

    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const s = stateRef.current; if (!s) return;
      stepAccum += dt * 1000;
      const spd = SPEED_TABLE[Math.min(10, s.level)];
      while (stepAccum >= spd && s.phase === "playing") { stepAccum -= spd; step(s); }
      // Particles
      for (const p of s.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 2; }
      s.particles = s.particles.filter((p: any) => p.life > 0);
      draw(s);
      if (s.phase === "playing") animId = requestAnimationFrame(loop);
      else { setScore(s.score); setLevel(s.level); if (s.score > hiScore) setHiScore(s.score); setPhase("dead"); stopMusic(); }
    }
    animId = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(animId); stopMusic(); window.removeEventListener("keydown", onKey); };
  }, [phase]);

  function handleStart() { dirQRef.current = []; stateRef.current = null; setPhase("playing"); }

  // Swipe controls
  const touchStart = useRef<{x:number;y:number}|null>(null);
  function onTouchStart(e: React.TouchEvent) { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const dir: Dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "RIGHT" : "LEFT") : (dy > 0 ? "DOWN" : "UP");
    const s = stateRef.current; if (!s) return;
    const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    const last: Dir = dirQRef.current.length ? dirQRef.current[dirQRef.current.length - 1] : s.dir;
    if (dir !== opp[last] && dirQRef.current.length < 2) dirQRef.current.push(dir);
    touchStart.current = null;
  }

  return (
    <div className="flex flex-col gap-2 select-none" style={{ width: "100%", maxWidth: "min(100%, calc(100dvh - 80px))", margin: "0 auto" }}>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-green-900">
        <canvas ref={canvasRef} width={W} height={H} className="block" style={{ width: "100%", height: "auto", background: "#0f172a" }}
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        />
        {(phase === "menu" || phase === "dead") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <div className="text-6xl mb-3">🐍</div>
            <h2 className="text-3xl font-extrabold text-green-400 mb-1 tracking-widest">SNAKE</h2>
            {phase === "dead" && <p className="text-white text-xl font-bold mb-1">Score: {score} • Level: {level}</p>}
            <p className="text-yellow-300 text-sm mb-1">Best: {hiScore}</p>
            <p className="text-gray-400 text-xs mb-2">🍎 = 10pts · ⭐ = 30pts · 💎 = 60pts</p>
            <p className="text-gray-500 text-xs mb-5">Arrow keys / WASD · Swipe on mobile</p>
            <button onClick={handleStart} className="px-8 py-3 bg-green-500 text-white font-extrabold rounded-full text-lg hover:bg-green-400 transition-colors shadow-lg shadow-green-500/40">
              {phase === "dead" ? "PLAY AGAIN" : "PLAY"}
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setMuted(!muted)} className="text-xs px-3 py-1 bg-gray-700 text-white rounded-full hover:bg-gray-600">{muted ? "🔇 Muted" : "🔊 Sound"}</button>
      </div>
      <p className="text-xs text-gray-400">Arrow keys to move · Swipe on mobile · Collect ⭐💎 for bonus points!</p>
    </div>
  );
}
