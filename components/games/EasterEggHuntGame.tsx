"use client";

import { useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic } from "@/lib/gameAudio";

const W = 480, H = 520;

// ── Tuning ────────────────────────────────────────────────────────────────────
const EGG_HIT_RADIUS = 22;      // a touch more generous than spec's 20 for mobile
const CLICKS_PER_ROUND = 15;
const MAX_PARTICLES = 100;
const MAX_POPUPS = 10;
const MAX_MARKERS = 5;

type Phase = "menu" | "playing" | "round-complete" | "gameover";
type EggKind = "regular" | "patterned" | "golden";

interface Egg {
  x: number;
  y: number;
  kind: EggKind;
  color: string;           // base color (for regular + particles)
  patternColor: string;    // stripe/dot contrast
  found: boolean;
  revealT: number;         // 0 → 1 scale-up progress while being found
  glow: number;            // golden aura pulse
  pattern: 0 | 1;          // 0 = stripes, 1 = dots
}

interface Particle {
  active: boolean;
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: number;
}

interface ScorePopup {
  active: boolean;
  x: number; y: number;
  vy: number;
  life: number;
  text: string;
  color: string;
}

interface ClickMarker {
  active: boolean;
  x: number; y: number;
  life: number;
  maxLife: number;
  color: string;
  label: string;
  distance: number;
}

interface Flower {
  x: number; y: number;
  color: string;
  swayPhase: number;
  size: number;
}

interface Cloud {
  x: number; y: number;
  w: number; speed: number;
}

interface Bush {
  x: number; y: number;
  r: number;
}

interface Butterfly {
  t: number;
  cx: number; cy: number;
  ax: number; ay: number;
  fx: number; fy: number;
  color1: string;
  color2: string;
  phase: number;
}

interface GrassBlade {
  x: number; y: number;
  h: number;
  phase: number;
}

interface GameState {
  phase: Phase;
  round: number;
  score: number;
  displayScore: number;
  eggsFoundThisRound: number;
  totalEggsThisRound: number;
  timer: number;
  roundTime: number;
  clicksLeft: number;

  eggs: Egg[];

  particles: Particle[];
  popups: ScorePopup[];
  markers: ClickMarker[];

  flowers: Flower[];
  clouds: Cloud[];
  bushes: Bush[];
  butterflies: Butterfly[];
  grass: GrassBlade[];

  sunAngle: number;
  menuFloat: number;
  revealFlash: number;            // 0→1 after round complete, briefly reveals eggs
  bannerY: number;                // slide-in banner y offset
  t: number;                      // total elapsed time

  menuHover: boolean;
  nextHover: boolean;
  againHover: boolean;
  bestRound: number;
  bestScore: number;
  confetti: Particle[];
}

// ── Utility ───────────────────────────────────────────────────────────────────
function rand(min: number, max: number) { return min + Math.random() * (max - min); }
function randInt(min: number, max: number) { return Math.floor(rand(min, max + 1)); }
function clamp(v: number, a: number, b: number) { return v < a ? a : v > b ? b : v; }
function easeOutBack(t: number) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const PASTEL_EGGS = [
  { base: "#f8bbd0", pat: "#ffffff" }, // pink
  { base: "#bbdefb", pat: "#ffffff" }, // blue
  { base: "#fff59d", pat: "#f9a8d4" }, // yellow
  { base: "#c5e1a5", pat: "#ffffff" }, // green
  { base: "#d1c4e9", pat: "#fff8a8" }, // lavender
  { base: "#ffccbc", pat: "#ffffff" }, // peach
];

const FLOWER_COLORS = ["#f472b6", "#fde047", "#c084fc", "#ffffff", "#fb7185", "#facc15"];
const BUTTERFLY_COLORS = [
  ["#f472b6", "#a78bfa"],
  ["#facc15", "#f97316"],
  ["#60a5fa", "#c084fc"],
];

// ── Round config ──────────────────────────────────────────────────────────────
function getRoundConfig(round: number): { eggs: number; time: number } {
  if (round === 1) return { eggs: 6, time: 45 };
  if (round === 2) return { eggs: 8, time: 50 };
  if (round === 3) return { eggs: 10, time: 55 };
  if (round === 4) return { eggs: 12, time: 60 };
  return { eggs: 15, time: 60 };
}

// ── Pool helpers ──────────────────────────────────────────────────────────────
function createParticlePool(n: number): Particle[] {
  const pool: Particle[] = [];
  for (let i = 0; i < n; i++) {
    pool.push({
      active: false,
      x: 0, y: 0, vx: 0, vy: 0,
      life: 0, maxLife: 0, size: 0,
      color: "#fff", gravity: 0,
    });
  }
  return pool;
}
function createPopupPool(n: number): ScorePopup[] {
  const pool: ScorePopup[] = [];
  for (let i = 0; i < n; i++) {
    pool.push({ active: false, x: 0, y: 0, vy: 0, life: 0, text: "", color: "#fff" });
  }
  return pool;
}
function createMarkerPool(n: number): ClickMarker[] {
  const pool: ClickMarker[] = [];
  for (let i = 0; i < n; i++) {
    pool.push({ active: false, x: 0, y: 0, life: 0, maxLife: 0, color: "#fff", label: "", distance: 0 });
  }
  return pool;
}

function spawnParticle(pool: Particle[], x: number, y: number, vx: number, vy: number, life: number, size: number, color: string, gravity = 0) {
  for (let i = 0; i < pool.length; i++) {
    const p = pool[i];
    if (!p.active) {
      p.active = true;
      p.x = x; p.y = y;
      p.vx = vx; p.vy = vy;
      p.life = life; p.maxLife = life;
      p.size = size; p.color = color;
      p.gravity = gravity;
      return;
    }
  }
}

function spawnPopup(pool: ScorePopup[], x: number, y: number, text: string, color: string) {
  for (let i = 0; i < pool.length; i++) {
    const p = pool[i];
    if (!p.active) {
      p.active = true;
      p.x = x; p.y = y;
      p.vy = -60;
      p.life = 1.2;
      p.text = text;
      p.color = color;
      return;
    }
  }
}

function spawnMarker(pool: ClickMarker[], x: number, y: number, color: string, label: string, distance: number) {
  // Replace the oldest (lowest life) slot if all full
  let slot = -1;
  let minLife = Infinity;
  for (let i = 0; i < pool.length; i++) {
    if (!pool[i].active) { slot = i; break; }
    if (pool[i].life < minLife) { minLife = pool[i].life; slot = i; }
  }
  const m = pool[slot];
  m.active = true;
  m.x = x; m.y = y;
  m.life = 1.0; m.maxLife = 1.0;
  m.color = color;
  m.label = label;
  m.distance = distance;
}

// ── Scene setup ───────────────────────────────────────────────────────────────
function buildScene(s: GameState) {
  // Flowers
  s.flowers = [];
  for (let i = 0; i < 30; i++) {
    s.flowers.push({
      x: rand(10, W - 10),
      y: rand(H * 0.55, H - 20),
      color: FLOWER_COLORS[randInt(0, FLOWER_COLORS.length - 1)],
      swayPhase: rand(0, Math.PI * 2),
      size: rand(4, 7),
    });
  }
  // Clouds
  s.clouds = [
    { x: 80,  y: 50, w: 70, speed: 7 },
    { x: 220, y: 80, w: 55, speed: 5 },
    { x: 360, y: 40, w: 85, speed: 6 },
    { x: 450, y: 95, w: 60, speed: 8 },
  ];
  // Bushes
  s.bushes = [
    { x: 60,  y: H - 60, r: 36 },
    { x: 180, y: H - 55, r: 30 },
    { x: 320, y: H - 60, r: 40 },
    { x: 430, y: H - 55, r: 28 },
  ];
  // Butterflies
  s.butterflies = [];
  for (let i = 0; i < 3; i++) {
    const cols = BUTTERFLY_COLORS[i % BUTTERFLY_COLORS.length];
    s.butterflies.push({
      t: rand(0, Math.PI * 2),
      cx: rand(150, W - 150),
      cy: rand(H * 0.4, H * 0.7),
      ax: rand(70, 120),
      ay: rand(40, 70),
      fx: rand(0.3, 0.6),
      fy: rand(0.4, 0.8),
      color1: cols[0],
      color2: cols[1],
      phase: rand(0, Math.PI * 2),
    });
  }
  // Grass
  s.grass = [];
  for (let i = 0; i < 90; i++) {
    s.grass.push({
      x: rand(0, W),
      y: rand(H - 30, H - 2),
      h: rand(4, 10),
      phase: rand(0, Math.PI * 2),
    });
  }
}

// ── Egg placement ─────────────────────────────────────────────────────────────
function placeEggs(count: number): Egg[] {
  const eggs: Egg[] = [];
  const padX = 30, padTop = 110, padBot = 30;
  const minDist = 42;

  // Always exactly one golden
  const goldenIdx = randInt(0, count - 1);

  let attempts = 0;
  while (eggs.length < count && attempts < 400) {
    attempts++;
    const x = rand(padX, W - padX);
    const y = rand(padTop, H - padBot);
    let ok = true;
    for (const e of eggs) {
      const dx = e.x - x, dy = e.y - y;
      if (dx * dx + dy * dy < minDist * minDist) { ok = false; break; }
    }
    if (!ok) continue;

    const idx = eggs.length;
    let kind: EggKind;
    if (idx === goldenIdx) kind = "golden";
    else if (Math.random() < 0.4) kind = "patterned";
    else kind = "regular";

    const pastel = PASTEL_EGGS[randInt(0, PASTEL_EGGS.length - 1)];
    eggs.push({
      x, y,
      kind,
      color: kind === "golden" ? "#fde047" : pastel.base,
      patternColor: kind === "golden" ? "#f59e0b" : pastel.pat,
      found: false,
      revealT: 0,
      glow: 0,
      pattern: Math.random() < 0.5 ? 0 : 1,
    });
  }
  return eggs;
}

// ── Initial state ─────────────────────────────────────────────────────────────
function makeInitialState(): GameState {
  const s: GameState = {
    phase: "menu",
    round: 1,
    score: 0,
    displayScore: 0,
    eggsFoundThisRound: 0,
    totalEggsThisRound: 0,
    timer: 45,
    roundTime: 45,
    clicksLeft: CLICKS_PER_ROUND,
    eggs: [],
    particles: createParticlePool(MAX_PARTICLES),
    popups: createPopupPool(MAX_POPUPS),
    markers: createMarkerPool(MAX_MARKERS),
    flowers: [],
    clouds: [],
    bushes: [],
    butterflies: [],
    grass: [],
    sunAngle: 0,
    menuFloat: 0,
    revealFlash: 0,
    bannerY: -100,
    t: 0,
    menuHover: false,
    nextHover: false,
    againHover: false,
    bestRound: 1,
    bestScore: 0,
    confetti: createParticlePool(60),
  };
  buildScene(s);
  return s;
}

function beginRound(s: GameState, round: number) {
  const cfg = getRoundConfig(round);
  s.round = round;
  s.roundTime = cfg.time;
  s.timer = cfg.time;
  s.clicksLeft = CLICKS_PER_ROUND;
  s.eggs = placeEggs(cfg.eggs);
  s.eggsFoundThisRound = 0;
  s.totalEggsThisRound = cfg.eggs;
  s.revealFlash = 0;
  s.bannerY = -100;
  // Clear pools (safety)
  for (const p of s.particles) p.active = false;
  for (const p of s.popups) p.active = false;
  for (const m of s.markers) m.active = false;
}

// ── Distance → hint ───────────────────────────────────────────────────────────
function hotColdHint(d: number): { color: string; label: string } {
  if (d < 40)  return { color: "#ef4444", label: "🔥 Very Hot!" };
  if (d < 80)  return { color: "#f97316", label: "Hot!" };
  if (d < 120) return { color: "#facc15", label: "Warm" };
  if (d < 200) return { color: "#22d3ee", label: "Cool" };
  return { color: "#3b82f6", label: "❄️ Cold" };
}

// ── Drawing helpers ───────────────────────────────────────────────────────────
function drawSky(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#87ceeb");
  g.addColorStop(0.55, "#c5e9c9");
  g.addColorStop(1, "#a7d582");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function drawSun(ctx: CanvasRenderingContext2D, angle: number) {
  const cx = W - 60, cy = 60;
  ctx.save();
  ctx.translate(cx, cy);
  // Rays
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = "#fde68a";
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    const a = angle + (i * Math.PI) / 6;
    const r1 = 28, r2 = 42;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
    ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  // Sun body
  const sg = ctx.createRadialGradient(0, 0, 2, 0, 0, 28);
  sg.addColorStop(0, "#fff7c2");
  sg.addColorStop(1, "#fbbf24");
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawClouds(ctx: CanvasRenderingContext2D, clouds: Cloud[]) {
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  for (const c of clouds) {
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.w / 2, 13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x - c.w * 0.22, c.y + 4, c.w * 0.3, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x + c.w * 0.22, c.y + 5, c.w * 0.32, 11, 0, 0, Math.PI * 2); ctx.fill();
  }
}

function drawHills(ctx: CanvasRenderingContext2D) {
  // Back hills
  ctx.fillStyle = "#86d66f";
  ctx.beginPath();
  ctx.moveTo(0, 260);
  ctx.quadraticCurveTo(80,  220, 160, 255);
  ctx.quadraticCurveTo(240, 290, 320, 245);
  ctx.quadraticCurveTo(400, 205, W, 250);
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  ctx.fill();
  // Front hills (darker)
  ctx.fillStyle = "#6fbe56";
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.quadraticCurveTo(100, 290, 200, 320);
  ctx.quadraticCurveTo(300, 355, 400, 310);
  ctx.quadraticCurveTo(460, 290, W, 320);
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  ctx.fill();
}

function drawBushes(ctx: CanvasRenderingContext2D, bushes: Bush[]) {
  for (const b of bushes) {
    ctx.fillStyle = "#4b9f3c";
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.5, b.y + 4, b.r * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b.x + b.r * 0.5, b.y + 4, b.r * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5eb84a";
    ctx.beginPath();
    ctx.arc(b.x, b.y - 4, b.r, 0, Math.PI * 2);
    ctx.fill();
    // Highlight
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(b.x - 6, b.y - 10, b.r * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFlowers(ctx: CanvasRenderingContext2D, flowers: Flower[], t: number) {
  for (const f of flowers) {
    const sway = Math.sin(t * 1.6 + f.swayPhase) * 1.5;
    const fx = f.x + sway;
    const fy = f.y;
    // Stem
    ctx.strokeStyle = "#4b9f3c";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(f.x, f.y + f.size + 6);
    ctx.lineTo(fx, fy);
    ctx.stroke();
    // Petals
    ctx.fillStyle = f.color;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + t * 0.3;
      const px = fx + Math.cos(a) * f.size;
      const py = fy + Math.sin(a) * f.size;
      ctx.beginPath();
      ctx.arc(px, py, f.size * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    // Center
    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.arc(fx, fy, f.size * 0.42, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGrass(ctx: CanvasRenderingContext2D, grass: GrassBlade[], t: number) {
  ctx.strokeStyle = "#3e8e2c";
  ctx.lineWidth = 1.4;
  for (const b of grass) {
    const sway = Math.sin(t * 2 + b.phase) * 1.8;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x + sway, b.y - b.h);
    ctx.stroke();
  }
}

function drawButterfly(ctx: CanvasRenderingContext2D, bf: Butterfly, dt: number) {
  bf.t += dt;
  // Lissajous
  const x = bf.cx + Math.sin(bf.t * bf.fx) * bf.ax;
  const y = bf.cy + Math.sin(bf.t * bf.fy + bf.phase) * bf.ay;
  const wing = (Math.sin(bf.t * 14) + 1) * 0.5; // 0..1
  const wingW = 7 + wing * 4;
  const wingH = 9;

  ctx.save();
  ctx.translate(x, y);
  // Body
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(-0.8, -5, 1.6, 10);
  // Wings (V shape)
  ctx.fillStyle = bf.color1;
  ctx.beginPath();
  ctx.ellipse(-wingW * 0.6, -2, wingW, wingH, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = bf.color2;
  ctx.beginPath();
  ctx.ellipse(wingW * 0.6, -2, wingW, wingH, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // Wing spots
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath(); ctx.arc(-wingW * 0.6, -2, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(wingW * 0.6, -2, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawEgg(ctx: CanvasRenderingContext2D, e: Egg, t: number) {
  const scale = e.found ? easeOutBack(clamp(e.revealT, 0, 1)) : 1;
  const w = 14 * scale;
  const h = 18 * scale;

  ctx.save();
  ctx.translate(e.x, e.y);

  if (e.kind === "golden") {
    const glow = 0.6 + 0.4 * Math.sin(t * 3 + e.glow);
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 18 * glow;
  }

  // Egg body
  ctx.fillStyle = e.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pattern
  if (e.kind === "patterned" || e.kind === "golden") {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = e.patternColor;
    if (e.pattern === 0) {
      // Stripes
      for (let i = -3; i <= 3; i++) {
        ctx.fillRect(-w, i * 6 - 1.5, w * 2, 3);
      }
    } else {
      // Dots
      for (let iy = -2; iy <= 2; iy++) {
        for (let ix = -1; ix <= 1; ix++) {
          ctx.beginPath();
          ctx.arc(ix * 6, iy * 6, 1.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  // Highlight
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.ellipse(-w * 0.35, -h * 0.45, w * 0.28, h * 0.18, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // Outline
  ctx.strokeStyle = "rgba(0,0,0,0.22)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// ── Drawing: Scene ─────────────────────────────────────────────────────────────
function drawScene(ctx: CanvasRenderingContext2D, s: GameState, dt: number) {
  drawSky(ctx);
  drawSun(ctx, s.sunAngle);
  drawClouds(ctx, s.clouds);
  drawHills(ctx);
  drawBushes(ctx, s.bushes);
  drawFlowers(ctx, s.flowers, s.t);
  drawGrass(ctx, s.grass, s.t);
  for (const bf of s.butterflies) drawButterfly(ctx, bf, dt);
}

// ── Drawing: HUD ──────────────────────────────────────────────────────────────
function drawHUD(ctx: CanvasRenderingContext2D, s: GameState) {
  // Top bar background
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  roundRect(ctx, 8, 8, W - 16, 46, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(236,72,153,0.45)";
  ctx.lineWidth = 2;
  roundRect(ctx, 8, 8, W - 16, 46, 14);
  ctx.stroke();

  // Score (left)
  ctx.fillStyle = "#be185d";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("SCORE", 18, 22);
  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = "#831843";
  ctx.fillText(String(Math.floor(s.displayScore)), 18, 45);

  // Timer (center)
  const timerLow = s.timer <= 10;
  const tc = timerLow ? "#ef4444" : "#0369a1";
  ctx.textAlign = "center";
  ctx.font = "bold 11px sans-serif";
  ctx.fillStyle = "#334155";
  ctx.fillText("TIME", W / 2, 22);
  ctx.font = "bold 24px sans-serif";
  ctx.fillStyle = tc;
  if (timerLow) {
    const pulse = 0.5 + 0.5 * Math.sin(s.t * 8);
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 6 + pulse * 6;
  }
  ctx.fillText(String(Math.ceil(Math.max(0, s.timer))), W / 2, 46);
  ctx.shadowBlur = 0;

  // Clicks (right) — keep at W - 52 to clear fullscreen button
  ctx.textAlign = "right";
  ctx.font = "bold 11px sans-serif";
  ctx.fillStyle = "#334155";
  ctx.fillText("CLICKS", W - 52, 22);
  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = s.clicksLeft <= 3 ? "#ef4444" : "#0f766e";
  ctx.fillText(`🔍 ${s.clicksLeft}`, W - 52, 45);

  // Bottom eggs counter
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.86)";
  const bw = 170, bh = 28;
  roundRect(ctx, (W - bw) / 2, H - bh - 10, bw, bh, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(236,72,153,0.45)";
  ctx.lineWidth = 2;
  roundRect(ctx, (W - bw) / 2, H - bh - 10, bw, bh, 14);
  ctx.stroke();
  ctx.fillStyle = "#831843";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText(`🥚 Eggs found: ${s.eggsFoundThisRound}/${s.totalEggsThisRound}`, W / 2, H - 18);

  // Round label (under top bar)
  ctx.font = "bold 12px sans-serif";
  ctx.fillStyle = "#be185d";
  ctx.fillText(`Round ${s.round}`, W / 2, 68);
}

// ── Drawing: Effects (particles, popups, markers) ─────────────────────────────
function drawEffects(ctx: CanvasRenderingContext2D, s: GameState) {
  // Click markers
  for (const m of s.markers) {
    if (!m.active) continue;
    const p = 1 - (m.life / m.maxLife);
    const r = 8 + p * 44;
    const alpha = clamp(m.life / m.maxLife, 0, 1);
    ctx.globalAlpha = alpha * 0.75;
    ctx.strokeStyle = m.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
    ctx.stroke();
    // Inner dot
    ctx.globalAlpha = alpha;
    ctx.fillStyle = m.color;
    ctx.beginPath();
    ctx.arc(m.x, m.y, 3, 0, Math.PI * 2);
    ctx.fill();
    // Label
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    // Background pill
    const tw = ctx.measureText(m.label).width + 12;
    ctx.globalAlpha = alpha * 0.85;
    ctx.fillStyle = m.color;
    roundRect(ctx, m.x - tw / 2, m.y - 36, tw, 18, 9);
    ctx.fill();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(m.label, m.x, m.y - 23);
  }
  ctx.globalAlpha = 1;

  // Particles
  for (const p of s.particles) {
    if (!p.active) continue;
    const a = clamp(p.life / p.maxLife, 0, 1);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Popups
  for (const p of s.popups) {
    if (!p.active) continue;
    const a = clamp(p.life / 1.2, 0, 1);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 3;
    ctx.fillText(p.text, p.x, p.y);
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;
}

// ── Menu / Gameover screens ───────────────────────────────────────────────────
function drawMenu(ctx: CanvasRenderingContext2D, s: GameState, dt: number) {
  drawScene(ctx, s, dt);

  // Dim overlay
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(0, 0, W, H);

  // Floating egg emoji
  const float = Math.sin(s.menuFloat) * 8;
  ctx.font = "84px serif";
  ctx.textAlign = "center";
  ctx.fillText("🥚", W / 2, 170 + float);

  // Title
  ctx.font = "bold 34px sans-serif";
  ctx.fillStyle = "#be185d";
  ctx.shadowColor = "#fbcfe8";
  ctx.shadowBlur = 8;
  ctx.fillText("Easter Egg Hunt", W / 2, 240);
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.font = "15px sans-serif";
  ctx.fillStyle = "#831843";
  ctx.fillText("Find the hidden eggs —", W / 2, 270);
  ctx.fillText("hot & cold hints!", W / 2, 290);

  // Best badge
  if (s.bestScore > 0) {
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#4c1d95";
    ctx.fillText(`Best: ${s.bestScore} pts · Round ${s.bestRound}`, W / 2, 314);
  }

  // Play button
  const btnW = 200, btnH = 56;
  const btnX = (W - btnW) / 2;
  const btnY = 340;
  ctx.fillStyle = s.menuHover ? "#db2777" : "#ec4899";
  ctx.shadowColor = "#f472b6";
  ctx.shadowBlur = s.menuHover ? 22 : 12;
  roundRect(ctx, btnX, btnY, btnW, btnH, 28);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("▶  Play", W / 2, btnY + 36);

  // Tip
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("Tap to start · 15 clicks per round", W / 2, 430);
}

function drawRoundComplete(ctx: CanvasRenderingContext2D, s: GameState, dt: number) {
  // Scene + eggs still visible (possibly all revealed)
  drawScene(ctx, s, dt);

  // All eggs flash
  for (const e of s.eggs) {
    const flash = 0.5 + 0.5 * Math.sin(s.t * 6);
    ctx.globalAlpha = 0.6 + flash * 0.4;
    drawEgg(ctx, { ...e, found: true, revealT: 1 }, s.t);
  }
  ctx.globalAlpha = 1;

  drawEffects(ctx, s);

  // Dim
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(0, 0, W, H);

  // Banner
  const bw = 340, bh = 160;
  const bx = (W - bw) / 2;
  const by = s.bannerY;

  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 14;
  roundRect(ctx, bx, by, bw, bh, 22);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#ec4899";
  ctx.lineWidth = 3;
  roundRect(ctx, bx, by, bw, bh, 22);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.font = "bold 26px sans-serif";
  ctx.fillStyle = "#be185d";
  ctx.fillText("Round Complete!", W / 2, by + 42);

  ctx.font = "15px sans-serif";
  ctx.fillStyle = "#334155";
  ctx.fillText(`Eggs found: ${s.eggsFoundThisRound} / ${s.totalEggsThisRound}`, W / 2, by + 68);
  ctx.fillText(`Score: ${s.score}`, W / 2, by + 90);

  // Next button
  const btnW = 180, btnH = 42;
  const btnX = (W - btnW) / 2;
  const btnY = by + bh - 56;
  ctx.fillStyle = s.nextHover ? "#7c3aed" : "#8b5cf6";
  ctx.shadowColor = "#c084fc";
  ctx.shadowBlur = s.nextHover ? 18 : 10;
  roundRect(ctx, btnX, btnY, btnW, btnH, 21);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = "bold 17px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Next Round →", W / 2, btnY + 28);
}

function drawGameOver(ctx: CanvasRenderingContext2D, s: GameState, dt: number) {
  drawScene(ctx, s, dt);

  // Confetti
  for (const p of s.confetti) {
    if (!p.active) continue;
    const a = clamp(p.life / p.maxLife, 0, 1);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;

  // Dim
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.textAlign = "center";
  ctx.font = "bold 34px sans-serif";
  ctx.fillStyle = "#be185d";
  ctx.shadowColor = "#fbcfe8";
  ctx.shadowBlur = 10;
  ctx.fillText("Happy Easter!", W / 2, 130);
  ctx.shadowBlur = 0;

  // Score box
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#334155";
  ctx.fillText("Final Score", W / 2, 180);
  ctx.font = "bold 56px sans-serif";
  ctx.fillStyle = "#f59e0b";
  ctx.shadowColor = "#fde68a";
  ctx.shadowBlur = 12;
  ctx.fillText(String(s.score), W / 2, 240);
  ctx.shadowBlur = 0;

  ctx.font = "15px sans-serif";
  ctx.fillStyle = "#334155";
  ctx.fillText(`Reached Round ${s.round}`, W / 2, 275);

  if (s.score >= s.bestScore && s.score > 0) {
    ctx.font = "bold 14px sans-serif";
    ctx.fillStyle = "#7c3aed";
    ctx.fillText("🏆 New Best Score!", W / 2, 300);
  } else if (s.bestScore > 0) {
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Best: ${s.bestScore}`, W / 2, 300);
  }

  // Play Again button
  const btnW = 220, btnH = 56;
  const btnX = (W - btnW) / 2;
  const btnY = 330;
  ctx.fillStyle = s.againHover ? "#db2777" : "#ec4899";
  ctx.shadowColor = "#f472b6";
  ctx.shadowBlur = s.againHover ? 22 : 12;
  roundRect(ctx, btnX, btnY, btnW, btnH, 28);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("▶  Play Again", W / 2, btnY + 36);

  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("Tap to try again", W / 2, 430);
}

// ── Button rects (hit tests) ──────────────────────────────────────────────────
function menuButtonRect() {
  return { x: (W - 200) / 2, y: 340, w: 200, h: 56 };
}
function nextButtonRect(bannerY: number) {
  return { x: (W - 180) / 2, y: bannerY + 160 - 56, w: 180, h: 42 };
}
function againButtonRect() {
  return { x: (W - 220) / 2, y: 330, w: 220, h: 56 };
}
function inRect(x: number, y: number, r: { x: number; y: number; w: number; h: number }) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function EasterEggHuntGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const mRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const [phase, setPhase] = useState<Phase>("menu");

  function getCanvasXY(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  function startGame() {
    const s = stateRef.current!;
    s.score = 0;
    s.displayScore = 0;
    beginRound(s, 1);
    s.phase = "playing";
    setPhase("playing");
    if (!mRef.current) startMusic("happy");
  }

  function nextRound() {
    const s = stateRef.current!;
    beginRound(s, s.round + 1);
    s.phase = "playing";
    setPhase("playing");
    if (!mRef.current) startMusic("happy");
  }

  function spawnFindBurst(s: GameState, e: Egg) {
    const count = e.kind === "golden" ? 20 : 12;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + rand(-0.2, 0.2);
      const sp = rand(60, 160);
      spawnParticle(
        s.particles,
        e.x, e.y,
        Math.cos(a) * sp,
        Math.sin(a) * sp - 30,
        rand(0.6, 1.0),
        rand(2.5, 4.5),
        e.kind === "golden" ? "#fde047" : e.color,
        160
      );
    }
    // Sparkle ring
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      spawnParticle(
        s.particles,
        e.x + Math.cos(a) * 18, e.y + Math.sin(a) * 18,
        Math.cos(a) * 20, Math.sin(a) * 20,
        0.5, 2.2, "#ffffff", 0
      );
    }
  }

  function spawnConfetti(s: GameState) {
    const colors = ["#f472b6", "#facc15", "#60a5fa", "#a78bfa", "#4ade80", "#fb7185"];
    for (const p of s.confetti) p.active = false;
    for (let i = 0; i < s.confetti.length; i++) {
      spawnParticle(
        s.confetti,
        W / 2 + rand(-30, 30),
        H / 2 - 40,
        rand(-180, 180),
        rand(-260, -120),
        rand(1.6, 2.4),
        rand(3, 5),
        colors[randInt(0, colors.length - 1)],
        240
      );
    }
  }

  function goGameOver() {
    const s = stateRef.current!;
    s.phase = "gameover";
    if (s.score > s.bestScore) {
      s.bestScore = s.score;
      s.bestRound = s.round;
    } else if (s.score === s.bestScore && s.round > s.bestRound) {
      s.bestRound = s.round;
    }
    setPhase("gameover");
    spawnConfetti(s);
    stopMusic();
    if (!mRef.current) sfx.die();
  }

  function finishRound(s: GameState) {
    s.phase = "round-complete";
    setPhase("round-complete");
    s.bannerY = -160;
    s.revealFlash = 1;
    if (!mRef.current) sfx.levelUp();
    stopMusic();
  }

  function handleClickPlaying(s: GameState, x: number, y: number) {
    if (s.clicksLeft <= 0) return;

    // Find nearest egg
    let nearest: Egg | null = null;
    let nearestDist = Infinity;
    for (const e of s.eggs) {
      if (e.found) continue;
      const dx = e.x - x, dy = e.y - y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < nearestDist) { nearestDist = d; nearest = e; }
    }

    if (nearest && nearestDist < EGG_HIT_RADIUS) {
      // Found!
      nearest.found = true;
      nearest.revealT = 0;
      s.eggsFoundThisRound++;
      let pts = 10;
      if (nearest.kind === "patterned") pts = 20;
      if (nearest.kind === "golden") pts = 50;
      s.score += pts;
      spawnFindBurst(s, nearest);
      spawnPopup(
        s.popups,
        nearest.x, nearest.y - 24,
        `+${pts}`,
        nearest.kind === "golden" ? "#fde047" : "#ffffff"
      );
      if (!mRef.current) sfx.correct();

      // Check round complete
      if (s.eggsFoundThisRound >= s.totalEggsThisRound) {
        finishRound(s);
      }
    } else {
      // Miss — counts as a click
      s.clicksLeft--;
      const hint = nearest ? hotColdHint(nearestDist) : hotColdHint(999);
      spawnMarker(s.markers, x, y, hint.color, hint.label, nearestDist);
      if (!mRef.current) {
        // Pitch varies with heat
        const pitch = nearest
          ? clamp(1 - nearestDist / 300, 0.2, 1)
          : 0.2;
        const freq = 300 + pitch * 700;
        // Use pop but via osc directly isn't exposed; just call sfx.pop
        sfx.pop();
        // tap sound layered for heat feel
        if (pitch > 0.6) sfx.tap();
      }

      // Out of clicks?
      if (s.clicksLeft <= 0) {
        if (s.eggsFoundThisRound > 0) {
          // Still progresses if any eggs found — treat as round end
          goGameOver();
        } else {
          goGameOver();
        }
      }
    }
  }

  function handlePointerDown(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s) return;
    const { x, y } = getCanvasXY(canvas, clientX, clientY);

    if (s.phase === "menu") {
      if (inRect(x, y, menuButtonRect())) startGame();
      return;
    }
    if (s.phase === "gameover") {
      if (inRect(x, y, againButtonRect())) startGame();
      return;
    }
    if (s.phase === "round-complete") {
      // Wait until banner slid in at least partially
      if (s.bannerY > 0 && inRect(x, y, nextButtonRect(s.bannerY))) nextRound();
      return;
    }
    if (s.phase === "playing") {
      handleClickPlaying(s, x, y);
    }
  }

  function handlePointerMove(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s) return;
    const { x, y } = getCanvasXY(canvas, clientX, clientY);
    s.menuHover = s.phase === "menu" && inRect(x, y, menuButtonRect());
    s.againHover = s.phase === "gameover" && inRect(x, y, againButtonRect());
    s.nextHover = s.phase === "round-complete" && inRect(x, y, nextButtonRect(s.bannerY));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    if (!stateRef.current) stateRef.current = makeInitialState();

    let running = true;

    function update(dt: number) {
      const s = stateRef.current!;
      s.t += dt;
      s.sunAngle += dt * 0.25;
      s.menuFloat += dt * 2;

      // Clouds drift
      for (const c of s.clouds) {
        c.x -= c.speed * dt;
        if (c.x < -c.w) { c.x = W + c.w; c.y = 30 + Math.random() * 80; }
      }

      // Score count up
      if (s.displayScore < s.score) {
        s.displayScore = Math.min(s.score, s.displayScore + dt * 120);
      } else {
        s.displayScore = s.score;
      }

      // Particles update
      for (const p of s.particles) {
        if (!p.active) continue;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.gravity * dt;
        p.life -= dt;
        if (p.life <= 0) p.active = false;
      }
      // Confetti update
      for (const p of s.confetti) {
        if (!p.active) continue;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.gravity * dt;
        p.life -= dt;
        if (p.life <= 0) p.active = false;
      }
      // Popups
      for (const p of s.popups) {
        if (!p.active) continue;
        p.y += p.vy * dt;
        p.vy += 30 * dt;
        p.life -= dt;
        if (p.life <= 0) p.active = false;
      }
      // Markers
      for (const m of s.markers) {
        if (!m.active) continue;
        m.life -= dt * 1.1;
        if (m.life <= 0) m.active = false;
      }
      // Eggs reveal tween
      for (const e of s.eggs) {
        if (e.found && e.revealT < 1) {
          e.revealT = Math.min(1, e.revealT + dt * 2.6);
        }
        if (e.kind === "golden") e.glow += dt;
      }

      if (s.phase === "playing") {
        s.timer -= dt;
        if (s.timer <= 0) {
          s.timer = 0;
          goGameOver();
        }
      }

      if (s.phase === "round-complete") {
        // Slide banner in
        const target = (H - 160) / 2 - 30;
        s.bannerY += (target - s.bannerY) * Math.min(1, dt * 6);
        s.revealFlash = Math.max(0, s.revealFlash - dt * 0.3);
      }
    }

    function draw() {
      const s = stateRef.current!;

      if (s.phase === "menu") {
        drawMenu(ctx, s, lastDt);
        return;
      }

      drawScene(ctx, s, lastDt);

      // Draw found eggs
      for (const e of s.eggs) {
        if (e.found) drawEgg(ctx, e, s.t);
      }

      drawEffects(ctx, s);

      // HUD only in playing/round-complete
      if (s.phase === "playing" || s.phase === "round-complete") {
        drawHUD(ctx, s);
      }

      if (s.phase === "round-complete") {
        drawRoundComplete(ctx, s, lastDt);
      }

      if (s.phase === "gameover") {
        drawGameOver(ctx, s, lastDt);
      }
    }

    let lastDt = 0;

    function loop(timestamp: number) {
      if (!running) return;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;
      lastDt = dt;
      update(dt);
      draw();
      animRef.current = requestAnimationFrame(loop);
    }

    lastTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(loop);

    function onPointerDown(e: PointerEvent) {
      e.preventDefault();
      handlePointerDown(e.clientX, e.clientY);
    }
    function onPointerMove(e: PointerEvent) {
      handlePointerMove(e.clientX, e.clientY);
    }
    canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      stopMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mute sync
  useEffect(() => {
    if (muted) {
      stopMusic();
    } else {
      if (stateRef.current?.phase === "playing") {
        startMusic("happy");
      }
    }
  }, [muted]);

  return (
    <div
      className="flex flex-col gap-2 select-none"
      style={{
        width: "100%",
        maxWidth: "min(100%, calc(480/520 * (100dvh - 80px)))",
        margin: "0 auto",
      }}
    >
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-pink-400">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block touch-none"
          style={{ width: "100%", height: "auto", background: "#87ceeb" }}
        />
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={() => {
            const next = !muted;
            setMuted(next);
            mRef.current = next;
          }}
          className="text-xs px-3 py-1 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
        >
          {muted ? "🔇 Muted" : "🔊 Sound"}
        </button>
        {phase === "playing" && (
          <span className="text-xs text-gray-500">
            Hot = red · Cold = blue · Golden egg = +50!
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Tap to search for hidden Easter eggs!
      </p>
    </div>
  );
}
