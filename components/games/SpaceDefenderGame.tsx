"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

const W = 480, H = 500;
const PLAYER_W = 36, PLAYER_H = 28;
const BULLET_SPEED = 480;
const ENEMY_COLS = 10, ENEMY_ROWS = 4;
const ENEMY_W = 32, ENEMY_H = 22;

type Phase = "menu" | "playing" | "dead" | "gameOver" | "waveComplete";

interface Bullet  { x: number; y: number; vy: number; fromPlayer: boolean }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string }
interface Enemy   { x: number; y: number; alive: boolean; type: number; animT: number }
interface Bomb    { x: number; y: number } // enemy bomb

function makeWave(wave: number) {
  const enemies: Enemy[] = [];
  for (let r = 0; r < ENEMY_ROWS; r++) {
    for (let c = 0; c < ENEMY_COLS; c++) {
      enemies.push({
        x: 60 + c * 40,
        y: 50 + r * 36,
        alive: true,
        type: r < 1 ? 2 : r < 3 ? 1 : 0,
        animT: 0,
      });
    }
  }
  return enemies;
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export default function SpaceDefenderGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<any>(null);
  const keysRef   = useRef<Set<string>>(new Set());
  const [phase, setPhase] = useState<Phase>("menu");
  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave]   = useState(1);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  const initState = useCallback((w = 1) => ({
    playerX: W / 2,
    playerVx: 0,
    lives: 3,
    invincible: 0,
    score: 0,
    wave: w,
    enemies: makeWave(w),
    enemyDir: 1,
    enemyTimer: 0,
    enemyInterval: Math.max(0.08, 0.35 - w * 0.03),
    enemyDropY: 0,
    bullets: [] as Bullet[],
    bombs: [] as Bomb[],
    particles: [] as Particle[],
    shootCooldown: 0,
    enemyShootTimer: 0,
    phase: "playing" as Phase,
    stars: Array.from({ length: 80 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: Math.random() * 2 + 0.5, speed: Math.random() * 20 + 10 })),
    explosions: [] as { x: number; y: number; t: number }[],
  }), []);

  const spawnParticles = (state: any, x: number, y: number, color: string) => {
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 40 + Math.random() * 100;
      state.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0.6 + Math.random() * 0.4, size: 2 + Math.random() * 3, color });
    }
  };

  useEffect(() => {
    if (phase !== "playing") return;
    if (!mutedRef.current) startMusic("space");
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const onKeyDown = (e: KeyboardEvent) => { keysRef.current.add(e.code); e.preventDefault(); };
    const onKeyUp   = (e: KeyboardEvent) => { keysRef.current.delete(e.code); };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);

    if (!stateRef.current || stateRef.current.phase !== "playing") {
      stateRef.current = initState(wave);
    }

    let animId: number;
    let last = performance.now();

    const COLORS = ["#00ffcc", "#ff6b6b", "#ffd93d", "#ff9f43"];

    function draw(s: any) {
      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#050a1a");
      bg.addColorStop(1, "#0a1428");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (const star of s.stars) {
        ctx.fillStyle = `rgba(255,255,255,${0.4 + star.s * 0.3})`;
        ctx.beginPath(); ctx.arc(star.x, star.y, star.s * 0.6, 0, Math.PI * 2); ctx.fill();
      }

      // Enemies
      for (const e of s.enemies) {
        if (!e.alive) continue;
        const wobble = Math.sin(e.animT * 3) * 2;
        const color  = COLORS[e.type] ?? "#aaa";
        ctx.save();
        ctx.translate(e.x, e.y + wobble);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        if (e.type === 2) {
          // UFO style
          ctx.beginPath();
          ctx.ellipse(0, 0, 13, 7, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillRect(-6, -10, 12, 8);
          ctx.fillStyle = "#fff"; ctx.shadowBlur = 0;
          ctx.beginPath(); ctx.arc(0, -6, 3, 0, Math.PI * 2); ctx.fill();
        } else if (e.type === 1) {
          // Bug
          ctx.beginPath();
          ctx.moveTo(0, -10); ctx.lineTo(10, 8); ctx.lineTo(-10, 8); ctx.closePath(); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.shadowBlur = 0;
          ctx.fillRect(-8, -4, 4, 4); ctx.fillRect(4, -4, 4, 4);
        } else {
          // Classic invader
          ctx.fillRect(-10, -6, 20, 12);
          ctx.fillRect(-13, -2, 5, 8);
          ctx.fillRect(8, -2, 5, 8);
          ctx.fillRect(-7, -10, 5, 5);
          ctx.fillRect(2, -10, 5, 5);
          ctx.fillStyle = "#050a1a"; ctx.shadowBlur = 0;
          ctx.fillRect(-6, -3, 4, 5); ctx.fillRect(2, -3, 4, 5);
        }
        ctx.restore();
      }

      // Player bullets
      for (const b of s.bullets) {
        ctx.fillStyle = b.fromPlayer ? "#00ffff" : "#ff4444";
        ctx.shadowColor = b.fromPlayer ? "#00ffff" : "#ff4444";
        ctx.shadowBlur = 10;
        ctx.fillRect(b.x - 2, b.y - 8, 4, 12);
      }
      ctx.shadowBlur = 0;

      // Bombs (enemy projectiles)
      for (const b of s.bombs) {
        ctx.fillStyle = "#ff4444";
        ctx.shadowColor = "#ff4444"; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Particles
      for (const p of s.particles) {
        const alpha = p.life;
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      }

      // Player ship
      const px = s.playerX;
      const py = H - 36;
      const flicker = s.invincible > 0 && Math.floor(s.invincible * 10) % 2 === 0;
      if (!flicker) {
        ctx.save();
        ctx.translate(px, py);
        // Engine glow
        ctx.fillStyle = "#ff6600"; ctx.shadowColor = "#ff6600"; ctx.shadowBlur = 14;
        ctx.fillRect(-6, 12, 12, 8);
        // Body
        ctx.fillStyle = "#00ccff"; ctx.shadowColor = "#00ccff"; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(18, 16); ctx.lineTo(-18, 16); ctx.closePath(); ctx.fill();
        // Cockpit
        ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(0, -2, 6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // HUD
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px monospace";
      ctx.fillText(`SCORE: ${s.score}`, 10, 20);
      ctx.fillText(`WAVE ${s.wave}`, W / 2 - 30, 20);
      ctx.textAlign = "right";
      ctx.fillText(`HI: ${Math.max(hiScore, s.score)}`, W - 52, 20);
      ctx.textAlign = "left";
      // Lives
      for (let i = 0; i < s.lives; i++) {
        ctx.fillStyle = "#00ccff";
        ctx.beginPath();
        ctx.moveTo(10 + i * 22, H - 12);
        ctx.lineTo(20 + i * 22, H - 4);
        ctx.lineTo(0 + i * 22, H - 4);
        ctx.closePath(); ctx.fill();
      }

      // Enemy count warning
      const alive = s.enemies.filter((e: Enemy) => e.alive).length;
      if (alive <= 5) {
        ctx.fillStyle = `rgba(255,80,80,${0.5 + Math.sin(Date.now() / 200) * 0.5})`;
        ctx.font = "bold 12px monospace";
        ctx.fillText("⚠ DANGER", W / 2 - 34, H - 6);
      }
    }

    function update(dt: number, s: any) {
      const keys = keysRef.current;

      // Stars
      for (const star of s.stars) {
        star.y += star.speed * dt;
        if (star.y > H) star.y = 0;
      }

      // Player movement
      const acc = 800, friction = 0.1;
      if (keys.has("ArrowLeft") || keys.has("KeyA"))  s.playerVx -= acc * dt;
      if (keys.has("ArrowRight") || keys.has("KeyD")) s.playerVx += acc * dt;
      s.playerVx *= Math.pow(friction, dt);
      s.playerX = Math.max(20, Math.min(W - 20, s.playerX + s.playerVx * dt));

      // Shooting
      s.shootCooldown -= dt;
      if ((keys.has("Space") || keys.has("ArrowUp")) && s.shootCooldown <= 0) {
        s.bullets.push({ x: s.playerX, y: H - 50, vy: -BULLET_SPEED, fromPlayer: true });
        s.shootCooldown = 0.18;
        if (!mutedRef.current) sfx.shoot();
      }

      // Move bullets
      s.bullets = s.bullets.filter((b: Bullet) => b.y > -10 && b.y < H + 10);
      for (const b of s.bullets) b.y += b.vy * dt;
      for (const b of s.bombs)   b.y += 250 * dt;
      s.bombs = s.bombs.filter((b: Bomb) => b.y < H);

      // Enemy animation
      for (const e of s.enemies) if (e.alive) e.animT += dt;

      // Enemy march
      s.enemyTimer -= dt;
      if (s.enemyTimer <= 0) {
        s.enemyTimer = s.enemyInterval;
        const alive = s.enemies.filter((e: Enemy) => e.alive);
        if (!alive.length) return;
        const minX = Math.min(...alive.map((e: Enemy) => e.x));
        const maxX = Math.max(...alive.map((e: Enemy) => e.x));
        if ((s.enemyDir === 1 && maxX > W - 30) || (s.enemyDir === -1 && minX < 30)) {
          s.enemyDir *= -1;
          for (const e of s.enemies) e.y += 18;
        } else {
          for (const e of s.enemies) e.x += s.enemyDir * 18;
        }
      }

      // Enemy shooting
      s.enemyShootTimer -= dt;
      if (s.enemyShootTimer <= 0) {
        s.enemyShootTimer = Math.max(0.4, 1.5 - s.wave * 0.1);
        const alive = s.enemies.filter((e: Enemy) => e.alive);
        if (alive.length) {
          const shooter = alive[Math.floor(Math.random() * alive.length)];
          s.bombs.push({ x: shooter.x, y: shooter.y + 12 });
        }
      }

      // Collision: player bullet → enemy
      for (const b of s.bullets) {
        if (!b.fromPlayer) continue;
        for (const e of s.enemies) {
          if (!e.alive) continue;
          if (Math.abs(b.x - e.x) < 14 && Math.abs(b.y - e.y) < 12) {
            e.alive = false;
            b.y = -999;
            const colors = ["#00ffcc", "#ff6b6b", "#ffd93d"];
            spawnParticles(s, e.x, e.y, colors[e.type] ?? "#fff");
            s.score += (e.type + 1) * 10 * s.wave;
            if (!mutedRef.current) sfx.enemyHit();
          }
        }
      }

      // Collision: bomb → player
      if (s.invincible <= 0) {
        for (let i = s.bombs.length - 1; i >= 0; i--) {
          const b = s.bombs[i];
          if (Math.abs(b.x - s.playerX) < 18 && Math.abs(b.y - (H - 36)) < 20) {
            s.bombs.splice(i, 1);
            s.lives--;
            s.invincible = 2;
            spawnParticles(s, s.playerX, H - 36, "#00ccff");
            if (!mutedRef.current) sfx.playerHit();
            if (s.lives <= 0) { s.phase = "gameOver"; if (!mutedRef.current) sfx.die(); }
          }
        }
      }
      s.invincible = Math.max(0, s.invincible - dt);

      // Enemies reached bottom
      for (const e of s.enemies) {
        if (e.alive && e.y > H - 60 && s.phase === "playing") {
          s.phase = "gameOver";
          if (!mutedRef.current) sfx.die();
        }
      }

      // Wave complete
      if (!s.enemies.some((e: Enemy) => e.alive) && s.phase === "playing") {
        s.phase = "waveComplete";
        if (!mutedRef.current) sfx.levelUp();
      }

      // Particles
      for (const p of s.particles) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vx *= 0.92; p.vy *= 0.92;
        p.life -= dt;
      }
      s.particles = s.particles.filter((p: Particle) => p.life > 0);
    }

    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = stateRef.current;
      if (!s) return;
      update(dt, s);
      draw(s);
      if (s.phase === "playing") {
        animId = requestAnimationFrame(loop);
      } else {
        setScore(s.score);
        setLives(s.lives);
        if (s.score > hiScore) setHiScore(s.score);
        setPhase(s.phase);
      }
    }
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      stopMusic();
    };
  }, [phase, wave]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (phase === "playing") startMusic("space");
  };

  function handleStart() { stateRef.current = initState(1); setWave(1); setScore(0); setLives(3); setPhase("playing"); }
  function handleNextWave() { const w = wave + 1; setWave(w); stateRef.current = initState(w); stateRef.current.score = score; stateRef.current.lives = lives; setPhase("playing"); }

  // Touch controls
  const touchLeft  = () => keysRef.current.add("ArrowLeft");
  const touchRight = () => keysRef.current.add("ArrowRight");
  const touchShoot = () => keysRef.current.add("Space");
  const touchEnd   = () => { keysRef.current.delete("ArrowLeft"); keysRef.current.delete("ArrowRight"); keysRef.current.delete("Space"); };

  return (
    <div className="flex flex-col gap-2 select-none" style={{ width: "100%", maxWidth: "min(100%, calc(100dvh - 80px))", margin: "0 auto" }}>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-900">
        <canvas ref={canvasRef} width={W} height={H} className="block" style={{ width: "100%", height: "auto", background: "#050a1a" }} />

        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white text-lg flex items-center justify-center z-20 border border-cyan-500/50"
        >
          {muted ? "🔇" : "🔊"}
        </button>

        {phase === "menu" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <div className="text-6xl mb-3">👾</div>
            <h2 className="text-3xl font-extrabold text-cyan-400 mb-1 tracking-widest">SPACE DEFENDER</h2>
            <p className="text-gray-400 text-sm mb-2">Destroy all aliens before they land!</p>
            <p className="text-gray-500 text-xs mb-6">← → to move · SPACE to shoot</p>
            <button onClick={handleStart} className="px-8 py-3 bg-cyan-500 text-white font-extrabold rounded-full text-lg hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/40">
              PLAY
            </button>
          </div>
        )}

        {phase === "waveComplete" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-2xl font-extrabold text-yellow-400 mb-1">WAVE {wave} CLEAR!</h2>
            <p className="text-cyan-300 text-lg font-bold mb-4">Score: {score}</p>
            <button onClick={handleNextWave} className="px-8 py-3 bg-yellow-400 text-black font-extrabold rounded-full hover:bg-yellow-300 transition-colors">
              NEXT WAVE →
            </button>
          </div>
        )}

        {(phase === "dead" || phase === "gameOver") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85">
            <div className="text-5xl mb-2">💥</div>
            <h2 className="text-2xl font-extrabold text-red-400 mb-1">GAME OVER</h2>
            <p className="text-white text-lg font-bold mb-1">Score: {score}</p>
            <p className="text-yellow-300 text-sm mb-5">Best: {hiScore}</p>
            <button onClick={handleStart} className="px-8 py-3 bg-red-500 text-white font-extrabold rounded-full hover:bg-red-400 transition-colors">
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div className="flex gap-3 md:hidden">
        <button onPointerDown={touchLeft} onPointerUp={touchEnd} className="w-16 h-16 bg-indigo-800 text-white text-2xl rounded-xl active:bg-indigo-600">◀</button>
        <button onPointerDown={touchShoot} onPointerUp={touchEnd} className="w-16 h-16 bg-cyan-600 text-white text-lg font-bold rounded-xl active:bg-cyan-400">🔫</button>
        <button onPointerDown={touchRight} onPointerUp={touchEnd} className="w-16 h-16 bg-indigo-800 text-white text-2xl rounded-xl active:bg-indigo-600">▶</button>
      </div>
      <p className="text-xs text-gray-400 hidden md:block">Arrow keys / WASD to move · Space to shoot</p>
    </div>
  );
}
