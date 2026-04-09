"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { sfx, startMusic, stopMusic } from "@/lib/gameAudio";

const W = 480, H = 520;
const PADDLE_W = 80, PADDLE_H = 12;
const BALL_R = 8;
const COLS = 10, ROWS = 6;
const BRICK_W = 44, BRICK_H = 18, BRICK_PAD = 2;
const BRICK_OFFSET_X = 10, BRICK_OFFSET_Y = 60;

type Phase = "menu" | "playing" | "paused" | "levelComplete" | "gameOver" | "win";

interface Ball  { x: number; y: number; vx: number; vy: number; active: boolean }
interface Brick { hp: number; maxHp: number; x: number; y: number; color: string; powerUp: string | null }
interface PowerUp { x: number; y: number; vy: number; type: string }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string }

const LEVEL_PATTERNS: number[][] = [
  // Level 1
  [0,1,1,1,1,1,1,1,1,0, 1,2,2,2,2,2,2,2,2,1, 0,1,1,1,1,1,1,1,1,0, 1,1,1,1,1,1,1,1,1,1, 0,1,1,1,1,1,1,1,1,0, 0,0,1,1,1,1,1,1,0,0],
  // Level 2
  [2,0,2,0,2,0,2,0,2,0, 1,2,1,2,1,2,1,2,1,2, 2,1,2,1,2,1,2,1,2,1, 1,2,1,2,1,2,1,2,1,2, 2,0,2,0,2,0,2,0,2,0, 0,1,0,1,0,1,0,1,0,1],
  // Level 3 — heart
  [0,0,1,1,0,0,1,1,0,0, 0,1,2,2,1,1,2,2,1,0, 1,2,3,3,2,2,3,3,2,1, 1,2,3,3,3,3,3,3,2,1, 0,1,2,3,3,3,3,2,1,0, 0,0,1,2,3,3,2,1,0,0],
  // Level 4 — diamond hard
  [0,0,0,0,2,2,0,0,0,0, 0,0,0,2,3,3,2,0,0,0, 0,0,2,3,3,3,3,2,0,0, 0,2,3,3,3,3,3,3,2,0, 0,0,2,3,3,3,3,2,0,0, 0,0,0,2,3,3,2,0,0,0],
  // Level 5 — full hard
  [3,3,3,3,3,3,3,3,3,3, 3,2,2,2,2,2,2,2,2,3, 2,2,3,3,3,3,3,3,2,2, 2,3,3,2,2,2,2,3,3,2, 1,2,2,3,3,3,3,2,2,1, 1,1,2,2,3,3,2,2,1,1],
];

const HP_COLORS: Record<number, string> = {
  0: "transparent",
  1: "#60d394",
  2: "#4ecdc4",
  3: "#ff6b6b",
};
const POWER_UP_TYPES = ["wide", "laser", "slow", "extra"];
const POWER_UP_COLORS: Record<string, string> = { wide: "#ffd93d", laser: "#ff6b6b", slow: "#4ecdc4", extra: "#c77dff" };

function makeBricks(level: number): Brick[] {
  const pattern = LEVEL_PATTERNS[Math.min(level, LEVEL_PATTERNS.length - 1)];
  const bricks: Brick[] = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const hp = pattern[r * COLS + c] ?? 0;
    if (hp === 0) continue;
    const hasPowerUp = Math.random() < 0.08;
    bricks.push({
      hp, maxHp: hp,
      x: BRICK_OFFSET_X + c * (BRICK_W + BRICK_PAD),
      y: BRICK_OFFSET_Y + r * (BRICK_H + BRICK_PAD),
      color: HP_COLORS[hp] ?? "#aaa",
      powerUp: hasPowerUp ? POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)] : null,
    });
  }
  return bricks;
}

export default function BrickBreakerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<any>(null);
  const keysRef   = useRef<Set<string>>(new Set());
  const mouseXRef = useRef<number>(W / 2);
  const [phase, setPhase]   = useState<Phase>("menu");
  const [score, setScore]   = useState(0);
  const [lives, setLives]   = useState(3);
  const [level, setLevel]   = useState(1);
  const [hiScore, setHiScore] = useState(0);
  const [muted, setMuted]   = useState(false);

  const initState = useCallback((lv = 1, sc = 0, li = 3) => ({
    paddleX: W / 2,
    balls: [{ x: W / 2, y: H - 80, vx: 200, vy: -320, active: true }] as Ball[],
    bricks: makeBricks(lv - 1),
    powerUps: [] as PowerUp[],
    particles: [] as Particle[],
    score: sc,
    lives: li,
    level: lv,
    paddleWidth: PADDLE_W,
    laserMode: 0,
    slowMode: 0,
    phase: "playing" as Phase,
    launched: false,
    laserCooldown: 0,
  }), []);

  function spawnParticles(s: any, x: number, y: number, color: string) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      s.particles.push({ x, y, vx: Math.cos(a) * (30 + Math.random() * 60), vy: Math.sin(a) * (30 + Math.random() * 60), life: 0.4, color });
    }
  }

  useEffect(() => {
    if (phase !== "playing") return;
    if (!muted) startMusic("happy");
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const onKeyDown = (e: KeyboardEvent) => { keysRef.current.add(e.code); if (["Space","ArrowLeft","ArrowRight"].includes(e.code)) e.preventDefault(); };
    const onKeyUp   = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    const onMouseMove = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouseXRef.current = (e.clientX - r.left) * (W / r.width); };
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); const r = canvas.getBoundingClientRect(); mouseXRef.current = (e.touches[0].clientX - r.left) * (W / r.width); };
    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); const r = canvas.getBoundingClientRect(); mouseXRef.current = (e.touches[0].clientX - r.left) * (W / r.width); const s = stateRef.current; if (s && !s.launched) s.launched = true; };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });

    if (!stateRef.current || stateRef.current.phase !== "playing") stateRef.current = initState(level, score, lives);

    let animId: number, last = performance.now();

    function draw(s: any) {
      // BG
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#1a0533"); bg.addColorStop(1, "#0d1b2a");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Bricks
      for (const b of s.bricks) {
        if (b.hp <= 0) continue;
        const alpha = 0.7 + (b.hp / b.maxHp) * 0.3;
        ctx.fillStyle = b.color; ctx.globalAlpha = alpha;
        ctx.shadowColor = b.color; ctx.shadowBlur = 6;
        ctx.fillRect(b.x, b.y, BRICK_W, BRICK_H);
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
        // HP dots
        if (b.maxHp > 1) {
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          for (let i = 0; i < b.hp; i++) ctx.fillRect(b.x + 4 + i * 6, b.y + 6, 4, 4);
        }
        // Power-up indicator
        if (b.powerUp) { ctx.fillStyle = POWER_UP_COLORS[b.powerUp]; ctx.fillRect(b.x + BRICK_W - 8, b.y + 2, 6, 6); }
      }

      // Power-ups
      for (const p of s.powerUps) {
        ctx.fillStyle = POWER_UP_COLORS[p.type] ?? "#fff";
        ctx.shadowColor = POWER_UP_COLORS[p.type] ?? "#fff"; ctx.shadowBlur = 10;
        ctx.fillRect(p.x - 12, p.y - 8, 24, 16);
        ctx.fillStyle = "#fff"; ctx.shadowBlur = 0; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(p.type.toUpperCase(), p.x, p.y + 3);
        ctx.textAlign = "left";
      }

      // Paddle
      const pw = s.paddleWidth;
      const px = Math.max(pw / 2, Math.min(W - pw / 2, s.paddleX));
      const py = H - 32;
      const pg = ctx.createLinearGradient(px - pw / 2, py, px + pw / 2, py + PADDLE_H);
      pg.addColorStop(0, s.laserMode > 0 ? "#ff6b6b" : "#00d4ff");
      pg.addColorStop(1, s.laserMode > 0 ? "#ff0000" : "#0066ff");
      ctx.fillStyle = pg; ctx.shadowColor = s.laserMode > 0 ? "#ff6b6b" : "#00d4ff"; ctx.shadowBlur = 15;
      ctx.beginPath(); ctx.roundRect(px - pw / 2, py, pw, PADDLE_H, 6); ctx.fill();
      ctx.shadowBlur = 0;

      // Balls
      for (const b of s.balls) {
        if (!b.active) continue;
        ctx.beginPath(); ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff"; ctx.shadowColor = "#aaffff"; ctx.shadowBlur = 16; ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Particles
      for (const p of s.particles) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // HUD
      ctx.fillStyle = "#fff"; ctx.font = "bold 13px monospace";
      ctx.fillText(`SCORE ${s.score}`, 8, 18);
      ctx.fillText(`LEVEL ${s.level}`, W / 2 - 28, 18);
      ctx.textAlign = "right"; ctx.fillText(`BEST ${hiScore}`, W - 52, 18); ctx.textAlign = "left";
      for (let i = 0; i < s.lives; i++) { ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(10 + i * 18, H - 12, 5, 0, Math.PI * 2); ctx.fill(); }

      if (!s.launched) { ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillText("Click or press SPACE to launch", W/2, H/2+40); ctx.textAlign = "left"; }
    }

    function update(dt: number, s: any) {
      const keys = keysRef.current;
      // Paddle
      const speed = 520;
      if (keys.has("ArrowLeft") || keys.has("KeyA")) s.paddleX -= speed * dt;
      if (keys.has("ArrowRight") || keys.has("KeyD")) s.paddleX += speed * dt;
      s.paddleX = Math.max(s.paddleWidth / 2, Math.min(W - s.paddleWidth / 2, lerp(s.paddleX, mouseXRef.current, 0.2)));

      const pw = s.paddleWidth;
      const px = Math.max(pw / 2, Math.min(W - pw / 2, s.paddleX));
      const py = H - 32;

      // Launch
      if (!s.launched && (keys.has("Space") || keys.has("KeyZ"))) { s.launched = true; if (!muted) sfx.shoot(); }

      // Power-up timers
      s.laserMode = Math.max(0, s.laserMode - dt);
      s.slowMode  = Math.max(0, s.slowMode  - dt);
      s.laserCooldown = Math.max(0, s.laserCooldown - dt);

      // Auto-laser shoot
      if (s.laserMode > 0 && s.laserCooldown <= 0) {
        s.laserCooldown = 0.3;
        s.balls.push({ x: px - 20, y: py - 5, vx: 0, vy: -600, active: true });
        s.balls.push({ x: px + 20, y: py - 5, vx: 0, vy: -600, active: true });
        if (!muted) sfx.shoot();
      }

      for (const ball of s.balls) {
        if (!ball.active) continue;
        const spd = s.slowMode > 0 ? 0.5 : 1;
        if (!s.launched && s === stateRef.current) { ball.x = px; continue; }
        ball.x += ball.vx * dt * spd;
        ball.y += ball.vy * dt * spd;

        // Wall bounce
        if (ball.x < BALL_R) { ball.vx = Math.abs(ball.vx); if (!muted) sfx.wallHit(); }
        if (ball.x > W - BALL_R) { ball.vx = -Math.abs(ball.vx); if (!muted) sfx.wallHit(); }
        if (ball.y < BALL_R) { ball.vy = Math.abs(ball.vy); if (!muted) sfx.wallHit(); }

        // Paddle bounce
        if (ball.y + BALL_R >= py && ball.y - BALL_R <= py + PADDLE_H && ball.x >= px - pw / 2 - BALL_R && ball.x <= px + pw / 2 + BALL_R) {
          const relX = (ball.x - px) / (pw / 2);
          const angle = relX * (Math.PI / 3);
          const speed2 = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
          ball.vx = Math.sin(angle) * speed2;
          ball.vy = -Math.abs(Math.cos(angle) * speed2);
          if (!muted) sfx.paddleHit();
        }

        // Lost
        if (ball.y > H + 10) ball.active = false;

        // Brick collision
        for (const b of s.bricks) {
          if (b.hp <= 0) continue;
          if (ball.x + BALL_R > b.x && ball.x - BALL_R < b.x + BRICK_W && ball.y + BALL_R > b.y && ball.y - BALL_R < b.y + BRICK_H) {
            const fromLeft  = Math.abs(ball.x + BALL_R - b.x);
            const fromRight = Math.abs(ball.x - BALL_R - (b.x + BRICK_W));
            const fromTop   = Math.abs(ball.y + BALL_R - b.y);
            const fromBot   = Math.abs(ball.y - BALL_R - (b.y + BRICK_H));
            const minSide   = Math.min(fromLeft, fromRight, fromTop, fromBot);
            if (s.laserMode <= 0) {
              if (minSide === fromTop || minSide === fromBot) ball.vy *= -1;
              else ball.vx *= -1;
            }
            b.hp--;
            if (!muted) sfx.brickHit();
            spawnParticles(s, b.x + BRICK_W/2, b.y + BRICK_H/2, b.color);
            const pts = (b.maxHp) * 10 * s.level;
            s.score += pts;
            if (b.hp <= 0 && b.powerUp) {
              s.powerUps.push({ x: b.x + BRICK_W / 2, y: b.y, vy: 120, type: b.powerUp });
            }
            break;
          }
        }
      }

      // Remove inactive laser balls
      if (s.laserMode > 0) s.balls = s.balls.filter((b: Ball) => b.active || b.vy !== -600);

      // Check all balls lost
      if (s.launched && s.balls.every((b: Ball) => !b.active)) {
        s.lives--;
        if (!muted) sfx.die();
        if (s.lives <= 0) { s.phase = "gameOver"; return; }
        s.launched = false;
        s.balls = [{ x: px, y: py - BALL_R - 2, vx: 200, vy: -320, active: true }];
        s.laserMode = 0;
      }

      // Power-ups falling
      for (const p of s.powerUps) p.y += p.vy * dt;
      for (const p of s.powerUps) {
        if (p.y >= py && p.y <= py + PADDLE_H && p.x >= px - pw / 2 && p.x <= px + pw / 2) {
          if (p.type === "wide")  s.paddleWidth = Math.min(140, s.paddleWidth + 30);
          if (p.type === "laser") s.laserMode = 8;
          if (p.type === "slow")  s.slowMode  = 5;
          if (p.type === "extra") { s.lives++; }
          if (!muted) sfx.powerUp();
          p.y = H + 100;
        }
      }
      s.powerUps = s.powerUps.filter((p: PowerUp) => p.y < H + 50);

      // Particles
      for (const p of s.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 2.5; }
      s.particles = s.particles.filter((p: Particle) => p.life > 0);

      // Level complete
      if (s.bricks.every((b: Brick) => b.hp <= 0)) {
        if (!muted) sfx.levelUp();
        s.phase = "levelComplete";
      }
    }

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const s = stateRef.current; if (!s) return;
      update(dt, s); draw(s);
      if (s.phase === "playing") animId = requestAnimationFrame(loop);
      else { setScore(s.score); setLives(s.lives); if (s.score > hiScore) setHiScore(s.score); setPhase(s.phase); stopMusic(); }
    }
    animId = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(animId); stopMusic(); window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); canvas.removeEventListener("mousemove", onMouseMove); canvas.removeEventListener("touchmove", onTouchMove); canvas.removeEventListener("touchstart", onTouchStart); };
  }, [phase, level]);

  function handleClick(e: React.MouseEvent) {
    const s = stateRef.current; if (!s) return;
    if (!s.launched) { s.launched = true; if (!muted) sfx.shoot(); }
  }

  function handleStart() { stateRef.current = initState(1); setLevel(1); setScore(0); setLives(3); setPhase("playing"); }
  function handleNext()  { const l = level + 1; if (l > 5) { setPhase("win"); return; } setLevel(l); stateRef.current = initState(l, score, lives); setPhase("playing"); }

  return (
    <div className="flex flex-col gap-2 select-none" style={{ width: "100%", maxWidth: "min(100%, calc(100dvh - 80px))", margin: "0 auto" }}>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-900">
        <canvas ref={canvasRef} width={W} height={H} className="block cursor-none" style={{ width: "100%", height: "auto" }} onClick={handleClick} />

        {phase === "menu" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <div className="text-6xl mb-3">🧱</div>
            <h2 className="text-3xl font-extrabold text-purple-400 mb-1 tracking-widest">BRICK BREAKER</h2>
            <p className="text-gray-400 text-sm mb-2">Break all the bricks!</p>
            <p className="text-gray-500 text-xs mb-2">Mouse to move paddle · Click to launch</p>
            <p className="text-gray-500 text-xs mb-6">Catch power-ups for special abilities!</p>
            <button onClick={handleStart} className="px-8 py-3 bg-purple-500 text-white font-extrabold rounded-full text-lg hover:bg-purple-400 transition-colors shadow-lg">PLAY</button>
          </div>
        )}
        {phase === "levelComplete" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <div className="text-5xl mb-2">⭐</div>
            <h2 className="text-2xl font-extrabold text-yellow-400">LEVEL {level} CLEAR!</h2>
            <p className="text-purple-300 text-lg font-bold mb-4">Score: {score}</p>
            <button onClick={handleNext} className="px-8 py-3 bg-yellow-400 text-black font-extrabold rounded-full hover:bg-yellow-300">{level < 5 ? "NEXT LEVEL →" : "YOU WIN! 🏆"}</button>
          </div>
        )}
        {phase === "gameOver" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85">
            <div className="text-5xl mb-2">💔</div>
            <h2 className="text-2xl font-extrabold text-red-400">GAME OVER</h2>
            <p className="text-white text-lg mb-1">Score: {score}</p>
            <p className="text-yellow-300 text-sm mb-4">Best: {hiScore}</p>
            <button onClick={handleStart} className="px-8 py-3 bg-red-500 text-white font-extrabold rounded-full hover:bg-red-400">TRY AGAIN</button>
          </div>
        )}
        {phase === "win" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85">
            <div className="text-6xl mb-3">🏆</div>
            <h2 className="text-2xl font-extrabold text-yellow-400 mb-1">YOU BEAT ALL 5 LEVELS!</h2>
            <p className="text-white text-lg mb-1">Final Score: {score}</p>
            <button onClick={handleStart} className="mt-3 px-8 py-3 bg-yellow-400 text-black font-extrabold rounded-full">PLAY AGAIN</button>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setMuted(!muted)} className="text-xs px-3 py-1 bg-gray-700 text-white rounded-full hover:bg-gray-600">{muted ? "🔇 Muted" : "🔊 Sound"}</button>
      </div>
      <p className="text-xs text-gray-400">Move mouse to control paddle · Click to launch ball</p>
    </div>
  );
}
