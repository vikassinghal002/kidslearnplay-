"use client";

import { useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic } from "@/lib/gameAudio";

const W = 480, H = 240;
const GROUND_Y = H - 44;
const GRAVITY   = 1800;
const JUMP_VY   = -620;

type Phase = "idle" | "playing" | "dead";

interface Obstacle { x: number; y?: number; w: number; h: number; type: "cactus" | "bird" }
interface Cloud    { x: number; y: number; w: number; speed: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string }

export default function DinoRunGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<any>(null);
  const [phase, setPhase]     = useState<Phase>("idle");
  const [score, setScore]     = useState(0);
  const [hiScore, setHiScore] = useState(0);
  const [muted, setMuted]     = useState(false);

  function initState() {
    return {
      dinoX: 70, dinoY: GROUND_Y, dinoVy: 0,
      dinoFrame: 0, dinoFrameT: 0,
      onGround: true, jumping: false, doubleJumped: false,
      obstacles: [] as Obstacle[],
      clouds: [{ x: 100, y: 30, w: 70, speed: 25 }, { x: 280, y: 55, w: 50, speed: 18 }, { x: 420, y: 20, w: 90, speed: 20 }] as Cloud[],
      particles: [] as Particle[],
      spawnTimer: 1.2,
      speed: 260, score: 0, dist: 0,
      phase: "playing" as Phase,
      day: true, dayT: 0, nightFade: 0,
      stars: Array.from({ length: 30 }, () => ({ x: Math.random() * W, y: Math.random() * (GROUND_Y - 20), r: Math.random() * 1.5 + 0.5 })),
      groundOffset: 0,
    };
  }

  function spawnDust(s: any) {
    for (let i = 0; i < 4; i++) {
      s.particles.push({ x: s.dinoX - 10, y: GROUND_Y + 16, vx: -30 - Math.random() * 40, vy: -20 - Math.random() * 30, life: 0.4, color: "#aaa" });
    }
  }

  useEffect(() => {
    if (phase !== "playing") return;
    if (!muted) startMusic("adventure");
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function jump(s: any) {
      if (s.onGround) { s.dinoVy = JUMP_VY; s.onGround = false; s.jumping = true; if (!muted) sfx.jump(); spawnDust(s); }
      else if (!s.doubleJumped) { s.dinoVy = JUMP_VY * 0.85; s.doubleJumped = true; if (!muted) sfx.jump(); }
    }

    const onKey = (e: KeyboardEvent) => { if (["Space","ArrowUp","KeyW"].includes(e.code)) { e.preventDefault(); if (stateRef.current?.phase === "playing") jump(stateRef.current); } };
    const onTouch = () => { if (stateRef.current?.phase === "playing") jump(stateRef.current); };
    window.addEventListener("keydown", onKey, { passive: false });
    canvas.addEventListener("pointerdown", onTouch);

    stateRef.current = initState();
    let animId: number, last = performance.now();

    function drawDino(s: any, dead = false) {
      const x = s.dinoX, y = s.dinoY;
      const t = s.dinoFrameT;
      const leg1 = s.onGround ? Math.sin(t * 12) * 6 : 0;
      const leg2 = s.onGround ? Math.sin(t * 12 + Math.PI) * 6 : 0;

      ctx.save();
      if (dead) { ctx.globalAlpha = 0.5; ctx.translate(x, y + 2); }
      else ctx.translate(x, y);

      // Body
      ctx.fillStyle = "#4ade80"; ctx.shadowColor = "#22c55e"; ctx.shadowBlur = 8;
      ctx.fillRect(-14, -28, 28, 28); // torso
      // Head
      ctx.fillRect(-10, -46, 22, 20);
      // Eye
      ctx.fillStyle = "#111"; ctx.shadowBlur = 0; ctx.fillRect(2, -42, 5, 5);
      ctx.fillStyle = "#fff"; ctx.fillRect(3, -43, 2, 2);
      // Tail
      ctx.fillStyle = "#4ade80"; ctx.shadowColor = "#22c55e"; ctx.shadowBlur = 4;
      ctx.fillRect(-22, -22, 10, 8); ctx.fillRect(-28, -18, 8, 6); ctx.fillRect(-32, -14, 6, 4);
      // Legs
      ctx.shadowBlur = 0; ctx.fillStyle = "#22c55e";
      ctx.fillRect(-10, 0, 8, 10 + leg1);
      ctx.fillRect(2, 0, 8, 10 + leg2);
      // Arms
      ctx.fillRect(10, -26, 6, s.onGround ? 8 : 14);

      ctx.restore();
    }

    function drawObstacle(o: Obstacle) {
      ctx.fillStyle = "#16a34a"; ctx.shadowColor = "#166534"; ctx.shadowBlur = 6;
      if (o.type === "cactus") {
        // trunk
        ctx.fillRect(o.x + o.w / 2 - 5, GROUND_Y - o.h + 8, 10, o.h - 8);
        // arms
        ctx.fillRect(o.x + o.w / 2 - 14, GROUND_Y - o.h / 2 + 5, 10, o.h / 3);
        ctx.fillRect(o.x + o.w / 2 + 4, GROUND_Y - o.h / 2, 10, o.h / 3);
        // tips
        ctx.fillRect(o.x + o.w / 2 - 16, GROUND_Y - o.h / 2 - 4, 8, 10);
        ctx.fillRect(o.x + o.w / 2 + 8, GROUND_Y - o.h / 2 - 8, 8, 14);
      } else {
        // bird
        const by = o.y ?? GROUND_Y - 56;
        ctx.fillStyle = "#dc2626"; ctx.shadowColor = "#991b1b";
        ctx.fillRect(o.x, by - 8, o.w, 12);
        const wing = Math.sin(Date.now() / 80) * 6;
        ctx.fillRect(o.x + 5, by - 14 - wing, o.w - 10, 8);
        ctx.fillRect(o.x + 5, by + 4 + wing / 2, o.w - 10, 6);
        ctx.fillStyle = "#fbbf24"; ctx.fillRect(o.x + o.w - 8, by - 5, 10, 5);
        ctx.fillStyle = "#fff"; ctx.fillRect(o.x + o.w - 12, by - 10, 4, 4);
        ctx.fillStyle = "#111"; ctx.fillRect(o.x + o.w - 11, by - 9, 2, 2);
      }
      ctx.shadowBlur = 0;
    }

    function draw(s: any) {
      const nightAlpha = s.nightFade;

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      if (s.day) {
        sky.addColorStop(0, `rgba(135,206,235,${1 - nightAlpha * 0.9})`);
        sky.addColorStop(1, `rgba(200,230,240,${1 - nightAlpha * 0.7})`);
      } else {
        sky.addColorStop(0, `rgba(10,15,40,${0.3 + nightAlpha * 0.7})`);
        sky.addColorStop(1, `rgba(20,30,60,${0.3 + nightAlpha * 0.5})`);
      }
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, GROUND_Y);

      // Stars (night)
      if (nightAlpha > 0.3) {
        for (const st of s.stars) {
          ctx.globalAlpha = (nightAlpha - 0.3) / 0.7 * (0.5 + Math.sin(Date.now() / 700 + st.x) * 0.3);
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Sun / Moon
      if (s.day) {
        ctx.fillStyle = `rgba(255,220,80,${1 - nightAlpha})`; ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 20;
        ctx.beginPath(); ctx.arc(W - 60, 40, 22, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = `rgba(240,240,200,${nightAlpha})`; ctx.shadowColor = "#fffff0"; ctx.shadowBlur = 15;
        ctx.beginPath(); ctx.arc(W - 60, 40, 18, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Clouds
      for (const c of s.clouds) {
        ctx.fillStyle = `rgba(255,255,255,${0.9 - nightAlpha * 0.5})`;
        ctx.beginPath(); ctx.ellipse(c.x, c.y, c.w / 2, 14, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(c.x - c.w * 0.2, c.y + 4, c.w * 0.3, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(c.x + c.w * 0.2, c.y + 4, c.w * 0.3, 10, 0, 0, Math.PI * 2); ctx.fill();
      }

      // Ground
      ctx.fillStyle = s.day ? "#86efac" : "#4ade80";
      ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
      ctx.fillStyle = s.day ? "#4ade80" : "#22c55e";
      ctx.fillRect(0, GROUND_Y, W, 4);
      // Ground lines
      ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 1;
      for (let gx = (-s.groundOffset % 40); gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, GROUND_Y + 2); ctx.lineTo(gx, GROUND_Y + 6); ctx.stroke(); }

      // Obstacles
      for (const o of s.obstacles) drawObstacle(o);

      // Particles (dust)
      for (const p of s.particles) {
        ctx.globalAlpha = p.life * 1.5;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Dino
      drawDino(s, s.phase === "dead");

      // HUD
      ctx.fillStyle = s.day ? "#1f2937" : "#e5e7eb";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "right"; ctx.fillText(`${Math.floor(s.score)}`, W - 10, 22);
      ctx.textAlign = "left"; ctx.fillText(`BEST ${hiScore}`, 10, 22);

      if (s.phase === "idle" || s.phase === "dead") {
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(W/2 - 80, H/2 - 20, 160, 36);
        ctx.fillStyle = "#fff"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(s.phase === "dead" ? "PRESS SPACE / TAP to restart" : "PRESS SPACE / TAP to start", W/2, H/2 + 3);
        ctx.textAlign = "left";
      }
    }

    function update(dt: number, s: any) {
      s.dist += dt * s.speed;
      s.score += dt * s.speed / 5;
      s.speed = Math.min(600, 260 + s.dist * 0.03);
      s.groundOffset += s.speed * dt;
      s.dinoFrameT += dt;

      // Day/night cycle every 40 seconds
      s.dayT += dt;
      const cycle = 40;
      const progress = (s.dayT % cycle) / cycle;
      if (progress < 0.5) { s.nightFade = Math.max(0, (progress - 0.4) / 0.1); s.day = true; }
      else { s.day = false; s.nightFade = Math.min(1, 1 - (progress - 0.9) / 0.1); }

      // Dino physics
      if (!s.onGround) {
        s.dinoVy += GRAVITY * dt;
        s.dinoY += s.dinoVy * dt;
        if (s.dinoY >= GROUND_Y) { s.dinoY = GROUND_Y; s.dinoVy = 0; s.onGround = true; s.jumping = false; s.doubleJumped = false; spawnDust(s); }
      }

      // Clouds
      for (const c of s.clouds) { c.x -= c.speed * dt; if (c.x < -100) { c.x = W + 80; c.y = 15 + Math.random() * 50; } }

      // Obstacles
      s.spawnTimer -= dt;
      if (s.spawnTimer <= 0) {
        const isBird = s.speed > 400 && Math.random() < 0.3;
        const h = isBird ? 16 : 30 + Math.random() * 30;
        const birdY = GROUND_Y - 40 - Math.random() * 30;
        s.obstacles.push({ x: W + 10, w: isBird ? 36 : 18 + Math.random() * 14, h, type: isBird ? "bird" : "cactus", y: birdY });
        s.spawnTimer = 0.6 + Math.random() * 1.2 - s.speed * 0.001;
      }
      for (const o of s.obstacles) o.x -= s.speed * dt;
      s.obstacles = s.obstacles.filter((o: Obstacle) => o.x > -60);

      // Collision
      const dx = 14, dy = 26;
      for (const o of s.obstacles) {
        const oy = o.type === "bird" ? (o.y ?? GROUND_Y - 56) : GROUND_Y - o.h;
        if (s.dinoX + dx > o.x + 4 && s.dinoX - dx < o.x + o.w - 4 && s.dinoY - dy < oy + o.h - 4 && s.dinoY + 2 > oy + 4) {
          if (!muted) sfx.die();
          s.phase = "dead";
          return;
        }
      }

      // Milestone sounds
      if (Math.floor(s.score) % 100 === 0 && Math.floor(s.score) > 0 && Math.floor(s.score) !== Math.floor(s.score - dt * s.speed / 5)) {
        if (!muted) sfx.coin();
      }

      // Particles
      for (const p of s.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 100 * dt; p.life -= dt * 2; }
      s.particles = s.particles.filter((p: Particle) => p.life > 0);
    }

    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const s = stateRef.current; if (!s) return;
      if (s.phase === "playing") update(dt, s);
      draw(s);
      if (s.phase !== "dead") { animId = requestAnimationFrame(loop); }
      else { const sc = Math.floor(s.score); setScore(sc); if (sc > hiScore) setHiScore(sc); setPhase("dead"); stopMusic(); }
    }
    animId = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(animId); stopMusic(); window.removeEventListener("keydown", onKey); canvas.removeEventListener("pointerdown", onTouch); };
  }, [phase]);

  function handleRestart() { stateRef.current = null; setPhase("idle"); setTimeout(() => setPhase("playing"), 50); }
  function handleStart() { setPhase("playing"); }

  return (
    <div className="flex flex-col gap-2 select-none" style={{ width: "100%", maxWidth: "min(100%, calc(2 * (100dvh - 80px)))", margin: "0 auto" }}>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border-2 border-green-800">
        <canvas ref={canvasRef} width={W} height={H} className="block" style={{ width: "100%", height: "auto", background: "#87ceeb" }}
          onClick={() => {
            if (phase === "idle") handleStart();
            else if (phase === "dead") handleRestart();
          }}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={() => setMuted(!muted)} className="text-xs px-3 py-1 bg-gray-700 text-white rounded-full hover:bg-gray-600">{muted ? "🔇 Muted" : "🔊 Sound"}</button>
      </div>
      <p className="text-xs text-gray-400">Space / Tap to jump · Double-jump available!</p>
    </div>
  );
}
