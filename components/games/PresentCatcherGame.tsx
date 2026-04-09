"use client";

import { useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic } from "@/lib/gameAudio";

// ────────────────────────────────────────────────────────────────────────────
// Canvas + gameplay constants
// ────────────────────────────────────────────────────────────────────────────
const W = 480;
const H = 520;
const ROUND_TIME = 60;
const GROUND_H = 70;
const GROUND_Y = H - GROUND_H;
const ELF_Y = GROUND_Y - 18;
const CATCH_W = 60;
const CATCH_H = 22;

// Entity kinds
const K_PRESENT = 0;
const K_GOLDEN = 1;
const K_CANDY = 2;
const K_STAR = 3;
const K_COAL = 4;
const K_SNOWBALL = 5;

const GOOD_KINDS = new Set([K_PRESENT, K_GOLDEN, K_CANDY, K_STAR]);

type Phase = "menu" | "playing" | "gameover";

// ────────────────────────────────────────────────────────────────────────────
// Pooled entities — all declared as mutable, zero allocations in rAF loop
// ────────────────────────────────────────────────────────────────────────────
interface Entity {
  active: boolean;
  kind: number;
  x: number;
  y: number;
  vy: number;
  vx: number;
  rot: number;
  rotSpeed: number;
  sway: number;
  life: number; // time alive (for zigzag etc)
  startX: number;
}

interface Snowflake {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  phase: number;
}

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface ScorePopup {
  active: boolean;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

interface TwinkleStar {
  x: number;
  y: number;
  r: number;
  phase: number;
  freq: number;
}

interface Mountain {
  x: number;
  w: number;
  h: number;
}

interface GameState {
  phase: Phase;
  score: number;
  displayedScore: number;
  bestScore: number;
  lives: number;
  timer: number;
  // Elf
  elfX: number;
  elfTargetX: number;
  elfVx: number;
  elfWalkT: number;
  // Combo / speed boost
  combo: number;
  maxCombo: number;
  speedBoost: number; // seconds remaining
  // Spawning
  spawnTimer: number;
  spawnRate: number;
  elapsed: number;
  // Effects
  flashTimer: number;
  shakeTimer: number;
  shakeMag: number;
  heartPulse: number;
  comboFlash: number;
  // Santa sleigh
  santaX: number;
  santaTimer: number; // countdown until next santa flyover
  santaActive: boolean;
  santaTrail: { x: number; y: number; life: number }[];
  // Pools
  entities: Entity[];
  particles: Particle[];
  popups: ScorePopup[];
  snowflakes: Snowflake[];
  stars: TwinkleStar[];
  mountainsFar: Mountain[];
  mountainsNear: Mountain[];
  // Input
  pointerDown: boolean;
  pointerX: number;
  keyLeft: boolean;
  keyRight: boolean;
  // UI state
  menuHover: boolean;
  gameoverHover: boolean;
}

// ────────────────────────────────────────────────────────────────────────────
// Pool sizes
// ────────────────────────────────────────────────────────────────────────────
const POOL_ENTITIES = 20;
const POOL_PARTICLES = 100;
const POOL_POPUPS = 10;
const POOL_SNOWFLAKES = 80;
const NUM_STARS = 30;

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
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

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points = 5
) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function makeInitialState(bestScore = 0): GameState {
  // Pooled entities
  const entities: Entity[] = [];
  for (let i = 0; i < POOL_ENTITIES; i++) {
    entities.push({
      active: false,
      kind: 0,
      x: 0,
      y: 0,
      vy: 0,
      vx: 0,
      rot: 0,
      rotSpeed: 0,
      sway: 0,
      life: 0,
      startX: 0,
    });
  }

  const particles: Particle[] = [];
  for (let i = 0; i < POOL_PARTICLES; i++) {
    particles.push({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0,
      color: "#fff",
      size: 2,
    });
  }

  const popups: ScorePopup[] = [];
  for (let i = 0; i < POOL_POPUPS; i++) {
    popups.push({
      active: false,
      x: 0,
      y: 0,
      text: "",
      color: "#fff",
      life: 0,
      maxLife: 0,
    });
  }

  const snowflakes: Snowflake[] = [];
  for (let i = 0; i < POOL_SNOWFLAKES; i++) {
    snowflakes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.5 + Math.random() * 2,
      vy: 15 + Math.random() * 40,
      vx: -6 + Math.random() * 12,
      phase: Math.random() * Math.PI * 2,
    });
  }

  const stars: TwinkleStar[] = [];
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: Math.random() * W,
      y: 10 + Math.random() * (H * 0.55),
      r: 0.6 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      freq: 1 + Math.random() * 2.5,
    });
  }

  // Parallax mountains
  const mountainsFar: Mountain[] = [];
  let mx = -20;
  while (mx < W + 60) {
    const w = 60 + Math.random() * 80;
    mountainsFar.push({ x: mx, w, h: 55 + Math.random() * 25 });
    mx += w * 0.7;
  }
  const mountainsNear: Mountain[] = [];
  mx = -30;
  while (mx < W + 60) {
    const w = 90 + Math.random() * 110;
    mountainsNear.push({ x: mx, w, h: 70 + Math.random() * 40 });
    mx += w * 0.7;
  }

  return {
    phase: "menu",
    score: 0,
    displayedScore: 0,
    bestScore,
    lives: 3,
    timer: ROUND_TIME,
    elfX: W / 2,
    elfTargetX: W / 2,
    elfVx: 0,
    elfWalkT: 0,
    combo: 0,
    maxCombo: 0,
    speedBoost: 0,
    spawnTimer: 0.9,
    spawnRate: 0.9,
    elapsed: 0,
    flashTimer: 0,
    shakeTimer: 0,
    shakeMag: 0,
    heartPulse: 0,
    comboFlash: 0,
    santaX: -120,
    santaTimer: 4,
    santaActive: false,
    santaTrail: [],
    entities,
    particles,
    popups,
    snowflakes,
    stars,
    mountainsFar,
    mountainsNear,
    pointerDown: false,
    pointerX: 0,
    keyLeft: false,
    keyRight: false,
    menuHover: false,
    gameoverHover: false,
  };
}

function resetRound(s: GameState) {
  s.score = 0;
  s.displayedScore = 0;
  s.lives = 3;
  s.timer = ROUND_TIME;
  s.elfX = W / 2;
  s.elfTargetX = W / 2;
  s.elfVx = 0;
  s.combo = 0;
  s.maxCombo = 0;
  s.speedBoost = 0;
  s.spawnTimer = 0.9;
  s.spawnRate = 0.9;
  s.elapsed = 0;
  s.flashTimer = 0;
  s.shakeTimer = 0;
  s.shakeMag = 0;
  s.heartPulse = 0;
  s.comboFlash = 0;
  s.santaX = -120;
  s.santaTimer = 4;
  s.santaActive = false;
  s.santaTrail.length = 0;
  for (const e of s.entities) e.active = false;
  for (const p of s.particles) p.active = false;
  for (const p of s.popups) p.active = false;
}

// ────────────────────────────────────────────────────────────────────────────
// Pool spawners — find first inactive slot, NO allocations
// ────────────────────────────────────────────────────────────────────────────
function spawnEntity(s: GameState) {
  let e: Entity | null = null;
  for (const ent of s.entities) {
    if (!ent.active) {
      e = ent;
      break;
    }
  }
  if (!e) return;

  // Roll distribution: 50% present, 15% star, 10% candy, 10% coal, 10% snowball, 5% golden
  const r = Math.random();
  let kind: number;
  if (r < 0.5) kind = K_PRESENT;
  else if (r < 0.65) kind = K_STAR;
  else if (r < 0.75) kind = K_CANDY;
  else if (r < 0.85) kind = K_COAL;
  else if (r < 0.95) kind = K_SNOWBALL;
  else kind = K_GOLDEN;

  const x = 24 + Math.random() * (W - 48);
  e.active = true;
  e.kind = kind;
  e.x = x;
  e.startX = x;
  e.y = -24;
  e.vx = 0;
  e.rot = 0;
  e.rotSpeed = 0;
  e.sway = Math.random() * Math.PI * 2;
  e.life = 0;

  switch (kind) {
    case K_PRESENT:
      e.vy = 80;
      e.rotSpeed = (Math.random() - 0.5) * 1.2;
      break;
    case K_GOLDEN:
      e.vy = 140;
      e.rotSpeed = (Math.random() - 0.5) * 1.8;
      break;
    case K_CANDY:
      e.vy = 95;
      e.rotSpeed = 4 + Math.random() * 2;
      break;
    case K_STAR:
      e.vy = 90;
      break;
    case K_COAL:
      e.vy = 100;
      break;
    case K_SNOWBALL:
      e.vy = 90;
      e.rotSpeed = (Math.random() - 0.5) * 2;
      break;
  }
}

function spawnParticle(
  s: GameState,
  x: number,
  y: number,
  vx: number,
  vy: number,
  life: number,
  color: string,
  size: number
) {
  for (const p of s.particles) {
    if (!p.active) {
      p.active = true;
      p.x = x;
      p.y = y;
      p.vx = vx;
      p.vy = vy;
      p.life = life;
      p.maxLife = life;
      p.color = color;
      p.size = size;
      return;
    }
  }
}

function spawnPopup(s: GameState, x: number, y: number, text: string, color: string) {
  for (const p of s.popups) {
    if (!p.active) {
      p.active = true;
      p.x = x;
      p.y = y;
      p.text = text;
      p.color = color;
      p.life = 1.1;
      p.maxLife = 1.1;
      return;
    }
  }
}

function spawnSparkleBurst(s: GameState, x: number, y: number, color: string, count = 10) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const sp = 80 + Math.random() * 120;
    spawnParticle(s, x, y, Math.cos(a) * sp, Math.sin(a) * sp - 30, 0.6 + Math.random() * 0.4, color, 2 + Math.random() * 2);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Update + draw
// ────────────────────────────────────────────────────────────────────────────
function updateGame(s: GameState, dt: number, muted: boolean) {
  s.elapsed += dt;

  // Timer
  s.timer -= dt;
  if (s.timer <= 0) {
    s.timer = 0;
    s.phase = "gameover";
    s.bestScore = Math.max(s.bestScore, s.score);
    stopMusic();
    if (!muted) sfx.die();
    return;
  }

  // Difficulty ramp — spawn rate from 0.9 → 0.5 over 60s
  const t01 = Math.min(1, s.elapsed / 60);
  s.spawnRate = 0.9 - 0.4 * t01;

  // Spawn tick
  s.spawnTimer -= dt;
  if (s.spawnTimer <= 0) {
    spawnEntity(s);
    s.spawnTimer = s.spawnRate * (0.85 + Math.random() * 0.3);
  }

  // Speed boost timer
  if (s.speedBoost > 0) s.speedBoost = Math.max(0, s.speedBoost - dt);

  // Displayed score counts up
  if (s.displayedScore < s.score) {
    const diff = s.score - s.displayedScore;
    s.displayedScore = Math.min(s.score, s.displayedScore + Math.max(1, diff * 6 * dt));
  } else if (s.displayedScore > s.score) {
    s.displayedScore = s.score;
  }

  // Effects countdown
  if (s.flashTimer > 0) s.flashTimer = Math.max(0, s.flashTimer - dt);
  if (s.shakeTimer > 0) s.shakeTimer = Math.max(0, s.shakeTimer - dt);
  if (s.heartPulse > 0) s.heartPulse = Math.max(0, s.heartPulse - dt);
  if (s.comboFlash > 0) s.comboFlash = Math.max(0, s.comboFlash - dt);

  // ── Elf movement ────────────────────────────────────────────────────────
  const boosted = s.speedBoost > 0;
  const maxSpeed = boosted ? 520 : 340;
  const accel = boosted ? 2600 : 1800;

  let desired = 0;
  if (s.pointerDown) {
    desired = s.pointerX - s.elfX;
    // Smooth approach — scale to speed based on distance
    const want = Math.max(-maxSpeed, Math.min(maxSpeed, desired * 8));
    s.elfVx += (want - s.elfVx) * Math.min(1, accel * dt * 0.004);
  } else {
    let dir = 0;
    if (s.keyLeft) dir -= 1;
    if (s.keyRight) dir += 1;
    if (dir !== 0) {
      s.elfVx += dir * accel * dt;
      if (s.elfVx > maxSpeed) s.elfVx = maxSpeed;
      if (s.elfVx < -maxSpeed) s.elfVx = -maxSpeed;
    } else {
      // Ease-out to zero
      const decel = accel * 1.4 * dt;
      if (s.elfVx > 0) s.elfVx = Math.max(0, s.elfVx - decel);
      else if (s.elfVx < 0) s.elfVx = Math.min(0, s.elfVx + decel);
    }
  }

  s.elfX += s.elfVx * dt;
  if (s.elfX < 30) {
    s.elfX = 30;
    s.elfVx = 0;
  }
  if (s.elfX > W - 30) {
    s.elfX = W - 30;
    s.elfVx = 0;
  }

  // Walk bob
  if (Math.abs(s.elfVx) > 20) {
    s.elfWalkT += dt * (6 + Math.abs(s.elfVx) * 0.01);
  }

  // ── Entities ────────────────────────────────────────────────────────────
  const catchLeft = s.elfX - CATCH_W / 2;
  const catchRight = s.elfX + CATCH_W / 2;
  const catchTop = ELF_Y - 4;
  const catchBottom = ELF_Y + CATCH_H;

  for (const e of s.entities) {
    if (!e.active) continue;
    e.life += dt;

    // Per-kind motion
    switch (e.kind) {
      case K_PRESENT:
        e.x = e.startX + Math.sin(e.life * 1.4 + e.sway) * 10;
        e.rot += e.rotSpeed * dt;
        break;
      case K_GOLDEN:
        e.x = e.startX + Math.sin(e.life * 2.5 + e.sway) * 6;
        e.rot += e.rotSpeed * dt;
        // Sparkle trail
        if (Math.random() < 0.6) {
          spawnParticle(
            s,
            e.x + (Math.random() - 0.5) * 16,
            e.y + 4,
            (Math.random() - 0.5) * 20,
            -10 - Math.random() * 20,
            0.5 + Math.random() * 0.3,
            "#fde047",
            1.5 + Math.random() * 1.5
          );
        }
        break;
      case K_CANDY:
        e.rot += e.rotSpeed * dt;
        break;
      case K_STAR:
        e.x = e.startX + Math.sin(e.life * 3.5 + e.sway) * 22;
        break;
      case K_COAL:
        // Shake offset applied at draw time; use rotSpeed for shake seed
        e.rot = (Math.random() - 0.5) * 0.3;
        break;
      case K_SNOWBALL:
        e.x = e.startX + Math.sin(e.life * 2 + e.sway) * 8;
        e.rot += e.rotSpeed * dt;
        break;
    }

    e.y += e.vy * dt;

    // Catch test — use a radius per entity
    const er = 14;
    if (
      e.y + er >= catchTop &&
      e.y - er <= catchBottom &&
      e.x + er >= catchLeft &&
      e.x - er <= catchRight
    ) {
      handleCatch(s, e, muted);
      e.active = false;
      continue;
    }

    // Off screen — missed
    if (e.y > H + 30) {
      e.active = false;
      if (GOOD_KINDS.has(e.kind)) {
        // missed a good item: break combo silently
        s.combo = 0;
      }
    }
  }

  // ── Particles ───────────────────────────────────────────────────────────
  for (const p of s.particles) {
    if (!p.active) continue;
    p.life -= dt;
    if (p.life <= 0) {
      p.active = false;
      continue;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 180 * dt; // gravity
  }

  // ── Popups ──────────────────────────────────────────────────────────────
  for (const p of s.popups) {
    if (!p.active) continue;
    p.life -= dt;
    if (p.life <= 0) {
      p.active = false;
      continue;
    }
    p.y -= 40 * dt;
  }

  // ── Snowflakes (recirculating) ──────────────────────────────────────────
  for (const sf of s.snowflakes) {
    sf.y += sf.vy * dt;
    sf.x += sf.vx * dt + Math.sin(sf.phase + s.elapsed * 2) * dt * 6;
    if (sf.y > H + 4) {
      sf.y = -4;
      sf.x = Math.random() * W;
    }
    if (sf.x < -8) sf.x = W + 4;
    if (sf.x > W + 8) sf.x = -4;
  }

  // ── Mountains parallax ──────────────────────────────────────────────────
  for (const m of s.mountainsFar) {
    m.x -= 4 * dt;
    if (m.x + m.w < -20) m.x = W + 20;
  }
  for (const m of s.mountainsNear) {
    m.x -= 8 * dt;
    if (m.x + m.w < -20) m.x = W + 20;
  }

  // ── Santa sleigh flyover every 15s ──────────────────────────────────────
  s.santaTimer -= dt;
  if (!s.santaActive && s.santaTimer <= 0) {
    s.santaActive = true;
    s.santaX = -120;
    s.santaTimer = 15;
  }
  if (s.santaActive) {
    s.santaX += 100 * dt;
    if (s.santaTrail.length < 40 && Math.random() < 0.5) {
      s.santaTrail.push({ x: s.santaX - 10, y: 48 + Math.sin(s.santaX * 0.03) * 8, life: 1 });
    }
    if (s.santaX > W + 140) {
      s.santaActive = false;
    }
  }
  for (let i = s.santaTrail.length - 1; i >= 0; i--) {
    const t = s.santaTrail[i];
    t.life -= dt * 0.8;
    if (t.life <= 0) s.santaTrail.splice(i, 1);
  }
}

function handleCatch(s: GameState, e: Entity, muted: boolean) {
  let pts = 0;
  let color = "#fff";
  let isGood = true;

  switch (e.kind) {
    case K_PRESENT:
      pts = 10;
      color = "#ef4444";
      break;
    case K_GOLDEN:
      pts = 50;
      color = "#fde047";
      break;
    case K_CANDY:
      pts = 15;
      color = "#f87171";
      break;
    case K_STAR:
      pts = 25;
      color = "#fbbf24";
      break;
    case K_SNOWBALL:
      pts = -5;
      color = "#e0f2fe";
      isGood = false;
      break;
    case K_COAL:
      pts = 0;
      color = "#6b7280";
      isGood = false;
      break;
  }

  if (e.kind === K_COAL) {
    // Lose a life
    s.lives -= 1;
    s.combo = 0;
    s.flashTimer = 0.2;
    s.shakeTimer = 0.2;
    s.shakeMag = 4;
    s.heartPulse = 0.5;
    if (!muted) sfx.wrong();
    // Dark smoke burst
    spawnSparkleBurst(s, e.x, e.y, "#4b5563", 12);
    if (s.lives <= 0) {
      s.phase = "gameover";
      s.bestScore = Math.max(s.bestScore, s.score);
      stopMusic();
      if (!muted) sfx.die();
    }
    return;
  }

  if (e.kind === K_SNOWBALL) {
    s.score = Math.max(0, s.score + pts);
    s.combo = 0;
    if (!muted) sfx.pop();
    spawnSparkleBurst(s, e.x, e.y, color, 8);
    spawnPopup(s, e.x, e.y, `${pts}`, "#93c5fd");
    return;
  }

  // Good catch
  s.score += pts;
  if (isGood) {
    s.combo += 1;
    if (s.combo > s.maxCombo) s.maxCombo = s.combo;
    if (s.combo > 0 && s.combo % 5 === 0) {
      s.speedBoost = 10;
      s.comboFlash = 0.6;
      if (!muted) sfx.levelUp();
    }
  }
  if (!muted) {
    if (e.kind === K_GOLDEN) sfx.coin();
    else if (e.kind === K_STAR) sfx.correct();
    else sfx.coin();
  }
  spawnSparkleBurst(s, e.x, e.y, color, 10);
  spawnPopup(s, e.x, e.y, `+${pts}`, color);
}

// ── Drawing ─────────────────────────────────────────────────────────────────
function drawBackground(ctx: CanvasRenderingContext2D, s: GameState, t: number) {
  // Sky gradient
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#0c1e3d");
  g.addColorStop(1, "#1e3a5f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Twinkling stars
  for (const st of s.stars) {
    const a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * st.freq + st.phase));
    ctx.globalAlpha = a;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Moon
  ctx.fillStyle = "rgba(241,245,249,0.95)";
  ctx.shadowColor = "#e0f2fe";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(W - 64, 58, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  // Moon crater shadow
  ctx.fillStyle = "rgba(148,163,184,0.6)";
  ctx.beginPath();
  ctx.arc(W - 58, 54, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(W - 70, 64, 3, 0, Math.PI * 2);
  ctx.fill();

  // Parallax mountains — far
  ctx.fillStyle = "#233b5e";
  for (const m of s.mountainsFar) {
    const baseY = GROUND_Y - 12;
    ctx.beginPath();
    ctx.moveTo(m.x, baseY);
    ctx.lineTo(m.x + m.w / 2, baseY - m.h);
    ctx.lineTo(m.x + m.w, baseY);
    ctx.closePath();
    ctx.fill();
    // Snow cap
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.moveTo(m.x + m.w / 2 - m.h * 0.2, baseY - m.h * 0.78);
    ctx.lineTo(m.x + m.w / 2, baseY - m.h);
    ctx.lineTo(m.x + m.w / 2 + m.h * 0.2, baseY - m.h * 0.78);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#233b5e";
  }

  // Near mountains
  ctx.fillStyle = "#152640";
  for (const m of s.mountainsNear) {
    const baseY = GROUND_Y - 4;
    ctx.beginPath();
    ctx.moveTo(m.x, baseY);
    ctx.lineTo(m.x + m.w * 0.45, baseY - m.h);
    ctx.lineTo(m.x + m.w, baseY);
    ctx.closePath();
    ctx.fill();
    // Snow cap
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.moveTo(m.x + m.w * 0.45 - m.h * 0.25, baseY - m.h * 0.75);
    ctx.lineTo(m.x + m.w * 0.45, baseY - m.h);
    ctx.lineTo(m.x + m.w * 0.45 + m.h * 0.2, baseY - m.h * 0.78);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#152640";
  }
}

function drawSanta(ctx: CanvasRenderingContext2D, s: GameState) {
  if (!s.santaActive) return;
  // Trail
  for (const tr of s.santaTrail) {
    ctx.globalAlpha = tr.life * 0.35;
    ctx.fillStyle = "#fca5a5";
    ctx.beginPath();
    ctx.arc(tr.x, tr.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const x = s.santaX;
  const y = 48 + Math.sin(x * 0.03) * 8;

  // Reindeer (simple)
  ctx.fillStyle = "#92400e";
  ctx.fillRect(x - 42, y - 2, 14, 8);
  ctx.fillRect(x - 30, y - 2, 14, 8);
  // Antlers
  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 36, y - 2);
  ctx.lineTo(x - 38, y - 8);
  ctx.moveTo(x - 36, y - 2);
  ctx.lineTo(x - 34, y - 8);
  ctx.stroke();
  // Red nose (Rudolph)
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(x - 43, y + 3, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(x - 43, y + 3, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Sleigh
  ctx.fillStyle = "#dc2626";
  roundRect(ctx, x - 14, y - 6, 26, 12, 4);
  ctx.fill();
  // Gold trim
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(x - 14, y + 4, 26, 2);
  // Santa
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(x - 4, y - 14, 10, 10);
  // Santa hat
  ctx.fillStyle = "#b91c1c";
  ctx.beginPath();
  ctx.moveTo(x - 4, y - 14);
  ctx.lineTo(x + 6, y - 14);
  ctx.lineTo(x + 4, y - 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x + 4, y - 21, 1.6, 0, Math.PI * 2);
  ctx.fill();
  // Santa face
  ctx.fillStyle = "#fcd7a0";
  ctx.fillRect(x - 2, y - 11, 6, 4);
  // Beard
  ctx.fillStyle = "#fff";
  ctx.fillRect(x - 3, y - 8, 8, 3);
}

function drawGround(ctx: CanvasRenderingContext2D) {
  // Snow ground gradient
  const g = ctx.createLinearGradient(0, GROUND_Y, 0, H);
  g.addColorStop(0, "#e0f2fe");
  g.addColorStop(1, "#cbd5e1");
  ctx.fillStyle = g;
  ctx.fillRect(0, GROUND_Y, W, GROUND_H);

  // Snow lumps
  ctx.fillStyle = "#f8fafc";
  const lumps = [
    [30, GROUND_Y + 2, 22, 8],
    [90, GROUND_Y + 4, 30, 10],
    [160, GROUND_Y + 2, 20, 7],
    [230, GROUND_Y + 5, 34, 11],
    [310, GROUND_Y + 2, 24, 8],
    [390, GROUND_Y + 4, 26, 9],
    [450, GROUND_Y + 3, 22, 8],
  ];
  for (const [lx, ly, lw, lh] of lumps) {
    ctx.beginPath();
    ctx.ellipse(lx, ly, lw, lh, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pine trees
  drawPineTree(ctx, 55, GROUND_Y - 4);
  drawPineTree(ctx, W - 55, GROUND_Y - 4);
}

function drawPineTree(ctx: CanvasRenderingContext2D, x: number, baseY: number) {
  // Trunk
  ctx.fillStyle = "#78350f";
  ctx.fillRect(x - 3, baseY - 6, 6, 8);
  // Layers
  ctx.fillStyle = "#166534";
  ctx.beginPath();
  ctx.moveTo(x - 16, baseY - 6);
  ctx.lineTo(x + 16, baseY - 6);
  ctx.lineTo(x, baseY - 22);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 13, baseY - 16);
  ctx.lineTo(x + 13, baseY - 16);
  ctx.lineTo(x, baseY - 30);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 10, baseY - 24);
  ctx.lineTo(x + 10, baseY - 24);
  ctx.lineTo(x, baseY - 38);
  ctx.closePath();
  ctx.fill();
  // Snow on branches
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillRect(x - 14, baseY - 7, 28, 1.5);
  ctx.fillRect(x - 11, baseY - 17, 22, 1.5);
  ctx.fillRect(x - 8, baseY - 25, 16, 1.5);
  // Star topper
  ctx.fillStyle = "#fbbf24";
  ctx.shadowColor = "#fde047";
  ctx.shadowBlur = 5;
  drawStar(ctx, x, baseY - 42, 3, 1.3, 5);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawSnowflakes(ctx: CanvasRenderingContext2D, s: GameState) {
  ctx.fillStyle = "#fff";
  for (const sf of s.snowflakes) {
    ctx.globalAlpha = 0.6 + sf.r / 4;
    ctx.beginPath();
    ctx.arc(sf.x, sf.y, sf.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawElf(ctx: CanvasRenderingContext2D, s: GameState) {
  const bob = Math.abs(s.elfVx) > 20 ? Math.sin(s.elfWalkT) * 1.5 : 0;
  const x = s.elfX;
  const y = ELF_Y + bob;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(x, GROUND_Y + 10, 18, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sack (behind body)
  ctx.fillStyle = "#b45309";
  roundRect(ctx, x - CATCH_W / 2, y, CATCH_W, CATCH_H, 6);
  ctx.fill();
  // Sack shadow / crease
  ctx.fillStyle = "#92400e";
  ctx.fillRect(x - CATCH_W / 2, y + CATCH_H - 5, CATCH_W, 5);
  // Sack rim / opening
  ctx.fillStyle = "#fef3c7";
  ctx.fillRect(x - CATCH_W / 2 + 2, y - 2, CATCH_W - 4, 4);
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(x - CATCH_W / 2 + 2, y, CATCH_W - 4, 1);

  // Body (green)
  ctx.fillStyle = "#16a34a";
  roundRect(ctx, x - 10, y - 22, 20, 20, 4);
  ctx.fill();
  // Belt
  ctx.fillStyle = "#78350f";
  ctx.fillRect(x - 10, y - 6, 20, 3);
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(x - 2, y - 6, 4, 3);

  // Head
  ctx.fillStyle = "#fcd7a0";
  ctx.beginPath();
  ctx.arc(x, y - 30, 7, 0, Math.PI * 2);
  ctx.fill();
  // Ear
  ctx.beginPath();
  ctx.moveTo(x + 6, y - 30);
  ctx.lineTo(x + 11, y - 33);
  ctx.lineTo(x + 6, y - 27);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 6, y - 30);
  ctx.lineTo(x - 11, y - 33);
  ctx.lineTo(x - 6, y - 27);
  ctx.closePath();
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#111";
  ctx.fillRect(x - 3, y - 31, 1.5, 1.5);
  ctx.fillRect(x + 1.5, y - 31, 1.5, 1.5);
  // Smile
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y - 28, 2, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Hat (red with white fur trim)
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.moveTo(x - 8, y - 35);
  ctx.lineTo(x + 8, y - 35);
  ctx.lineTo(x + 4, y - 46);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillRect(x - 9, y - 36, 18, 3);
  ctx.beginPath();
  ctx.arc(x + 4, y - 47, 1.7, 0, Math.PI * 2);
  ctx.fill();

  // Arms holding sack
  ctx.fillStyle = "#16a34a";
  ctx.fillRect(x - 14, y - 12, 5, 10);
  ctx.fillRect(x + 9, y - 12, 5, 10);
  ctx.fillStyle = "#fcd7a0";
  ctx.fillRect(x - 15, y - 3, 5, 4);
  ctx.fillRect(x + 10, y - 3, 5, 4);

  // Legs (simple bob)
  ctx.fillStyle = "#78350f";
  const legOff = Math.abs(s.elfVx) > 20 ? Math.sin(s.elfWalkT) * 2 : 0;
  ctx.fillRect(x - 7, y + CATCH_H, 4, 6 + legOff);
  ctx.fillRect(x + 3, y + CATCH_H, 4, 6 - legOff);

  // Speed boost glow
  if (s.speedBoost > 0) {
    ctx.strokeStyle = "rgba(253,224,71,0.7)";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    roundRect(ctx, x - CATCH_W / 2 - 3, y - 3, CATCH_W + 6, CATCH_H + 6, 8);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawEntity(ctx: CanvasRenderingContext2D, e: Entity, t: number) {
  ctx.save();
  switch (e.kind) {
    case K_PRESENT: {
      ctx.translate(e.x, e.y);
      ctx.rotate(e.rot);
      // Use a deterministic color based on startX
      const colors = ["#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#f97316"];
      const col = colors[Math.floor(Math.abs(e.startX) * 7) % colors.length];
      ctx.fillStyle = col;
      roundRect(ctx, -12, -12, 24, 24, 2);
      ctx.fill();
      // Ribbon
      ctx.fillStyle = "#fde047";
      ctx.fillRect(-12, -3, 24, 6);
      ctx.fillRect(-3, -12, 6, 24);
      // Bow
      ctx.beginPath();
      ctx.ellipse(-4, -12, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(4, -12, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case K_GOLDEN: {
      ctx.translate(e.x, e.y);
      ctx.rotate(e.rot);
      ctx.shadowColor = "#fde047";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#fbbf24";
      roundRect(ctx, -14, -14, 28, 28, 3);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fde047";
      ctx.fillRect(-14, -4, 28, 8);
      ctx.fillRect(-4, -14, 8, 28);
      // Shiny bow
      ctx.fillStyle = "#fffbeb";
      ctx.beginPath();
      ctx.ellipse(-5, -14, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(5, -14, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case K_CANDY: {
      ctx.translate(e.x, e.y);
      ctx.rotate(e.rot);
      // Cane shape — rectangle body + curve at top
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(0, -6);
      ctx.quadraticCurveTo(0, -14, 7, -14);
      ctx.stroke();
      // Red stripes
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-3, 8);
      ctx.lineTo(3, 5);
      ctx.moveTo(-3, 3);
      ctx.lineTo(3, 0);
      ctx.moveTo(-3, -2);
      ctx.lineTo(3, -5);
      ctx.moveTo(-2, -8);
      ctx.lineTo(4, -11);
      ctx.stroke();
      break;
    }
    case K_STAR: {
      ctx.translate(e.x, e.y);
      // Radial glow
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 22);
      grad.addColorStop(0, "rgba(253,224,71,0.9)");
      grad.addColorStop(1, "rgba(253,224,71,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
      // Star body
      ctx.fillStyle = "#fde047";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 8;
      drawStar(ctx, 0, 0, 12, 5, 5);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Inner highlight
      ctx.fillStyle = "#fffbeb";
      drawStar(ctx, -1, -1, 6, 2.5, 5);
      ctx.fill();
      break;
    }
    case K_COAL: {
      const shakeX = (Math.random() - 0.5) * 2.5;
      const shakeY = (Math.random() - 0.5) * 2.5;
      ctx.translate(e.x + shakeX, e.y + shakeY);
      ctx.fillStyle = "#1f2937";
      ctx.strokeStyle = "#6b7280";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-12, -6);
      ctx.lineTo(-6, -12);
      ctx.lineTo(6, -10);
      ctx.lineTo(12, -4);
      ctx.lineTo(10, 6);
      ctx.lineTo(3, 12);
      ctx.lineTo(-8, 10);
      ctx.lineTo(-13, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Highlights
      ctx.fillStyle = "#4b5563";
      ctx.beginPath();
      ctx.arc(-4, -3, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(5, 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case K_SNOWBALL: {
      ctx.translate(e.x, e.y);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.arc(1, 2, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e0f2fe";
      ctx.beginPath();
      ctx.arc(-3, -3, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, s: GameState) {
  for (const p of s.particles) {
    if (!p.active) continue;
    const a = Math.max(0, Math.min(1, p.life / p.maxLife));
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawPopups(ctx: CanvasRenderingContext2D, s: GameState) {
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  for (const p of s.popups) {
    if (!p.active) continue;
    const a = Math.max(0, Math.min(1, p.life / p.maxLife));
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 3;
    ctx.fillText(p.text, p.x, p.y);
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;
}

function drawHUD(ctx: CanvasRenderingContext2D, s: GameState, t: number) {
  // Score (top-left)
  ctx.textAlign = "left";
  ctx.font = "bold 12px sans-serif";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText("SCORE", 14, 20);
  ctx.font = "bold 24px sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = 4;
  ctx.fillText(String(Math.floor(s.displayedScore)), 14, 44);
  ctx.shadowBlur = 0;

  // Timer (top-center)
  const timePulse = s.timer <= 10 ? 0.6 + 0.4 * Math.sin(t * 8) : 1;
  const timeColor = s.timer <= 10 ? "#ef4444" : "#f1f5f9";
  ctx.textAlign = "center";
  ctx.font = "bold 12px sans-serif";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText("TIME", W / 2, 20);
  ctx.font = "bold 26px sans-serif";
  ctx.fillStyle = timeColor;
  ctx.globalAlpha = timePulse;
  if (s.timer <= 10) {
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 8;
  }
  ctx.fillText(String(Math.ceil(s.timer)), W / 2, 46);
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;

  // Lives (top-right) — 3 hearts at W - 52 minimum
  const heartRight = W - 52;
  const heartSpacing = 16;
  const heartY = 26;
  for (let i = 0; i < 3; i++) {
    const hx = heartRight - (2 - i) * heartSpacing;
    const filled = i < s.lives;
    const losing = i === s.lives && s.heartPulse > 0;
    let scale = 1;
    if (losing) {
      const p = s.heartPulse / 0.5;
      scale = 1 + p * 1.2;
    }
    drawHeart(ctx, hx, heartY, 6 * scale, filled, losing ? 1 - s.heartPulse / 0.5 : filled ? 1 : 0.25);
  }

  // Combo indicator (center)
  if (s.combo >= 2) {
    const pulse = 1 + 0.15 * Math.sin(t * 6);
    ctx.save();
    ctx.translate(W / 2, 80);
    ctx.scale(pulse, pulse);
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#fde047";
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 6;
    ctx.textAlign = "center";
    ctx.fillText(`x${s.combo} COMBO!`, 0, 0);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // Speed boost banner
  if (s.speedBoost > 0) {
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#fde047";
    ctx.textAlign = "center";
    ctx.fillText(`⚡ SPEED BOOST ${Math.ceil(s.speedBoost)}s`, W / 2, 100);
  }
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  filled: boolean,
  alpha: number
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = filled ? "#ef4444" : "#475569";
  ctx.strokeStyle = "#7f1d1d";
  ctx.lineWidth = 1;
  ctx.beginPath();
  const top = cy - size * 0.6;
  ctx.moveTo(cx, cy + size * 0.8);
  ctx.bezierCurveTo(cx - size * 1.6, cy - size * 0.4, cx - size * 0.6, top - size, cx, cy - size * 0.2);
  ctx.bezierCurveTo(cx + size * 0.6, top - size, cx + size * 1.6, cy - size * 0.4, cx, cy + size * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// ── Menu + game over screens ────────────────────────────────────────────────
function drawMenu(ctx: CanvasRenderingContext2D, s: GameState, t: number) {
  drawBackground(ctx, s, t);
  drawSnowflakes(ctx, s);
  drawGround(ctx);

  // Bouncing present emoji
  const bounce = Math.abs(Math.sin(t * 3)) * 16;
  ctx.font = "72px serif";
  ctx.textAlign = "center";
  ctx.fillText("🎁", W / 2, 150 - bounce);

  // Title
  ctx.font = "bold 36px sans-serif";
  ctx.fillStyle = "#fef3c7";
  ctx.shadowColor = "#dc2626";
  ctx.shadowBlur = 14;
  ctx.fillText("Present Catcher", W / 2, 210);
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.font = "15px sans-serif";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText("Catch presents, avoid coal!", W / 2, 240);

  // Best score
  if (s.bestScore > 0) {
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`Best: ${s.bestScore}`, W / 2, 266);
  }

  // Play button (festive red/green pulse)
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);
  const btnW = 200, btnH = 58;
  const btnX = (W - btnW) / 2;
  const btnY = 300;
  const r = Math.floor(220 + pulse * 35);
  const g = Math.floor(38 + (1 - pulse) * 80);
  ctx.fillStyle = s.menuHover ? `rgb(${r},${g + 20},${38 + pulse * 40})` : `rgb(${r},${g},38)`;
  ctx.shadowColor = "#22c55e";
  ctx.shadowBlur = 14 + pulse * 10;
  roundRect(ctx, btnX, btnY, btnW, btnH, 29);
  ctx.fill();
  ctx.shadowBlur = 0;
  // Button border
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 3;
  roundRect(ctx, btnX, btnY, btnW, btnH, 29);
  ctx.stroke();

  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("▶  Play", W / 2, btnY + 37);

  // Hint
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#64748b";
  ctx.fillText("Arrow keys / drag to move", W / 2, 390);
}

function drawGameOver(ctx: CanvasRenderingContext2D, s: GameState, t: number) {
  drawBackground(ctx, s, t);
  drawSnowflakes(ctx, s);
  drawGround(ctx);

  // Dark overlay
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.textAlign = "center";
  ctx.font = "bold 32px sans-serif";
  ctx.fillStyle = "#fef3c7";
  ctx.shadowColor = "#dc2626";
  ctx.shadowBlur = 12;
  ctx.fillText(s.lives <= 0 ? "Out of Lives!" : "Time's Up!", W / 2, 110);
  ctx.shadowBlur = 0;

  // Score
  ctx.font = "15px sans-serif";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText("Your Score", W / 2, 150);
  ctx.font = "bold 64px sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = 14;
  ctx.fillText(String(s.score), W / 2, 220);
  ctx.shadowBlur = 0;

  // Grade
  const grade = s.score >= 500 ? "SS" : s.score >= 350 ? "S" : s.score >= 220 ? "A" : s.score >= 120 ? "B" : "C";
  const gradeColor =
    grade === "SS" ? "#fde047" : grade === "S" ? "#a855f7" : grade === "A" ? "#22c55e" : grade === "B" ? "#38bdf8" : "#94a3b8";
  ctx.font = "bold 28px sans-serif";
  ctx.fillStyle = gradeColor;
  ctx.shadowColor = gradeColor;
  ctx.shadowBlur = 10;
  ctx.fillText(`Grade: ${grade}`, W / 2, 256);
  ctx.shadowBlur = 0;

  if (s.score >= s.bestScore && s.score > 0) {
    ctx.font = "bold 14px sans-serif";
    ctx.fillStyle = "#22d3ee";
    ctx.fillText("🏆 New Best!", W / 2, 280);
  } else {
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`Best: ${s.bestScore}`, W / 2, 280);
  }

  // Play Again button
  const btnW = 220, btnH = 56;
  const btnX = (W - btnW) / 2;
  const btnY = 310;
  ctx.fillStyle = s.gameoverHover ? "#16a34a" : "#22c55e";
  ctx.shadowColor = "#22c55e";
  ctx.shadowBlur = s.gameoverHover ? 20 : 12;
  roundRect(ctx, btnX, btnY, btnW, btnH, 28);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "#0c1e3d";
  ctx.fillText("▶  Play Again", W / 2, btnY + 36);

  if (s.score > 100) {
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#f87171";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 6;
    ctx.fillText("Merry Christmas!", W / 2, H - 24);
    ctx.shadowBlur = 0;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// React component
// ────────────────────────────────────────────────────────────────────────────
export default function PresentCatcherGame() {
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
    const s = stateRef.current;
    if (!s) return;
    resetRound(s);
    s.phase = "playing";
    setPhase("playing");
    if (!mRef.current) startMusic("happy");
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d")!;

    if (!stateRef.current) {
      stateRef.current = makeInitialState(0);
    }

    let running = true;

    function loop(timestamp: number) {
      if (!running) return;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      const s = stateRef.current!;
      const t = timestamp / 1000;

      if (s.phase === "playing") {
        updateGame(s, dt, mRef.current);
        if ((s.phase as Phase) === "gameover") {
          setPhase("gameover");
        }
      }

      // Determine camera shake
      let shakeX = 0;
      let shakeY = 0;
      if (s.shakeTimer > 0) {
        const amt = (s.shakeTimer / 0.2) * s.shakeMag;
        shakeX = (Math.random() - 0.5) * 2 * amt;
        shakeY = (Math.random() - 0.5) * 2 * amt;
      }

      ctx2d.save();
      ctx2d.translate(shakeX, shakeY);

      if (s.phase === "menu") {
        drawMenu(ctx2d, s, t);
      } else if (s.phase === "playing") {
        drawBackground(ctx2d, s, t);
        drawSanta(ctx2d, s);
        drawSnowflakes(ctx2d, s);
        drawGround(ctx2d);

        // Entities
        for (const e of s.entities) {
          if (e.active) drawEntity(ctx2d, e, t);
        }

        drawParticles(ctx2d, s);
        drawElf(ctx2d, s);
        drawPopups(ctx2d, s);
        drawHUD(ctx2d, s, t);

        // Red flash overlay (coal hit)
        if (s.flashTimer > 0) {
          ctx2d.fillStyle = `rgba(239,68,68,${(s.flashTimer / 0.2) * 0.35})`;
          ctx2d.fillRect(0, 0, W, H);
        }
      } else {
        drawGameOver(ctx2d, s, t);
      }

      ctx2d.restore();

      animRef.current = requestAnimationFrame(loop);
    }

    lastTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(loop);

    // ── Input ────────────────────────────────────────────────────────────
    function onPointerDown(e: PointerEvent) {
      e.preventDefault();
      const s = stateRef.current;
      if (!s || !canvas) return;
      const { x, y } = getCanvasXY(canvas, e.clientX, e.clientY);

      if (s.phase === "menu") {
        const btnW = 200, btnH = 58;
        const btnX = (W - btnW) / 2;
        const btnY = 300;
        if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
          startGame();
        }
        return;
      }
      if (s.phase === "gameover") {
        const btnW = 220, btnH = 56;
        const btnX = (W - btnW) / 2;
        const btnY = 310;
        if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
          startGame();
        }
        return;
      }
      if (s.phase === "playing") {
        s.pointerDown = true;
        s.pointerX = x;
      }
    }

    function onPointerMove(e: PointerEvent) {
      const s = stateRef.current;
      if (!s || !canvas) return;
      const { x, y } = getCanvasXY(canvas, e.clientX, e.clientY);

      if (s.phase === "menu") {
        const btnW = 200, btnH = 58;
        const btnX = (W - btnW) / 2;
        const btnY = 300;
        s.menuHover = x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
      } else if (s.phase === "gameover") {
        const btnW = 220, btnH = 56;
        const btnX = (W - btnW) / 2;
        const btnY = 310;
        s.gameoverHover = x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
      } else if (s.phase === "playing" && s.pointerDown) {
        s.pointerX = x;
      }
    }

    function onPointerUp() {
      const s = stateRef.current;
      if (!s) return;
      s.pointerDown = false;
    }

    function onKeyDown(e: KeyboardEvent) {
      const s = stateRef.current;
      if (!s) return;
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        s.keyLeft = true;
        e.preventDefault();
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        s.keyRight = true;
        e.preventDefault();
      } else if (e.code === "Space" || e.code === "Enter") {
        if (s.phase === "menu" || s.phase === "gameover") {
          e.preventDefault();
          startGame();
        }
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      const s = stateRef.current;
      if (!s) return;
      if (e.code === "ArrowLeft" || e.code === "KeyA") s.keyLeft = false;
      else if (e.code === "ArrowRight" || e.code === "KeyD") s.keyRight = false;
    }

    canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerup", onPointerUp, { passive: true });
    canvas.addEventListener("pointercancel", onPointerUp, { passive: true });
    canvas.addEventListener("pointerleave", onPointerUp, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
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
        maxWidth: "min(100%, calc(520/480 * (100dvh - 80px)))",
        margin: "0 auto",
      }}
    >
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-red-700">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block touch-none"
          style={{ width: "100%", height: "auto", background: "#0c1e3d" }}
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
          <span className="text-xs text-gray-500">Catch good gifts, avoid coal!</span>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Arrow keys / A-D or drag · Catch presents, avoid coal!
      </p>
    </div>
  );
}
