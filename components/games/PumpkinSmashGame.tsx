"use client";

/**
 * PumpkinSmashGame — refactored to use @/lib/gameEngine.
 *
 * All the custom art (haunted skyline, pumpkin/ghost/bat sprites, lightning,
 * fog) is preserved verbatim. The engine handles the RAF loop, phase machine,
 * pointer input, mute, music, and high-score persistence.
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
} from "@/lib/gameEngine";

// ─── Constants ────────────────────────────────────────────────────────────────
const W = 480;
const H = 520;
const ROUND_TIME = 60;
const GRID_COLS = 3;
const GRID_ROWS = 3;

const HOLE_AREA_TOP = 180;
const HOLE_W = 110;
const HOLE_H = 40;
const HOLE_SPACING_X = 140;
const HOLE_SPACING_Y = 95;
const GRID_ORIGIN_X = W / 2 - HOLE_SPACING_X;
const GRID_ORIGIN_Y = HOLE_AREA_TOP;

const ENTITY_RADIUS = 38;

const SPAWN_START = 1.4;
const SPAWN_END = 0.7;

const GOLDEN_INTERVAL = 15;

const COMBO_THRESHOLD = 3;
const COMBO_DURATION = 5;

type EntityKind = "pumpkin" | "ghost" | "bat" | "golden";

interface Entity {
  active: boolean;
  kind: EntityKind;
  holeIndex: number;
  x: number;
  y: number;
  age: number;
  lifetime: number;
  state: "emerging" | "visible" | "hiding" | "smashed";
  scale: number;
  smashed: boolean;
  wobblePhase: number;
}

interface Cloud {
  x: number;
  y: number;
  w: number;
  speed: number;
  alpha: number;
}

interface FogBlob {
  x: number;
  y: number;
  rx: number;
  ry: number;
  speed: number;
  alpha: number;
}

interface Hole {
  cx: number;
  cy: number;
}

interface PumpkinState {
  displayedScore: number;
  timer: number;
  elapsed: number;
  spawnCooldown: number;
  goldenTimer: number;
  streak: number;
  comboActive: boolean;
  comboTimer: number;
  entities: (Entity | null)[];
  holes: Hole[];
  shakeTime: number;
  shakeMagX: number;
  shakeMagY: number;
  lightningTimer: number;
  lightningFlash: number;
  moonAngle: number;
  clouds: Cloud[];
  fog: FogBlob[];
  menuHover: boolean;
  gameoverHover: boolean;
}

// ─── Easing ───────────────────────────────────────────────────────────────────
function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
function easeInBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
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

function makeHoles(): Hole[] {
  const holes: Hole[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      holes.push({
        cx: GRID_ORIGIN_X + col * HOLE_SPACING_X,
        cy: GRID_ORIGIN_Y + row * HOLE_SPACING_Y,
      });
    }
  }
  return holes;
}

function makeEntity(): Entity {
  return {
    active: false,
    kind: "pumpkin",
    holeIndex: -1,
    x: 0,
    y: 0,
    age: 0,
    lifetime: 0,
    state: "emerging",
    scale: 0,
    smashed: false,
    wobblePhase: 0,
  };
}

function lifetimeFor(kind: EntityKind): number {
  switch (kind) {
    case "pumpkin":
      return 1.2;
    case "ghost":
      return 1.0;
    case "bat":
      return 0.9;
    case "golden":
      return 0.8;
  }
}

function pointsFor(kind: EntityKind): number {
  switch (kind) {
    case "pumpkin":
      return 10;
    case "ghost":
      return 20;
    case "bat":
      return -3;
    case "golden":
      return 30;
  }
}

function colorsForKind(kind: EntityKind): [string, string] {
  switch (kind) {
    case "pumpkin":
      return ["#ff9a3c", "#ffd166"];
    case "ghost":
      return ["#ffffff", "#a9f0ff"];
    case "bat":
      return ["#5b2a86", "#c792ea"];
    case "golden":
      return ["#ffe066", "#fff3a0"];
  }
}

function gradeFor(score: number): { label: string; color: string } {
  if (score >= 500) return { label: "SS", color: "#ffd700" };
  if (score >= 380) return { label: "S", color: "#fbbf24" };
  if (score >= 260) return { label: "A", color: "#22d3ee" };
  if (score >= 150) return { label: "B", color: "#a3e635" };
  return { label: "C", color: "#94a3b8" };
}

function initPumpkinState(): PumpkinState {
  const entities: (Entity | null)[] = new Array(GRID_ROWS * GRID_COLS).fill(null);
  for (let i = 0; i < entities.length; i++) entities[i] = makeEntity();

  const clouds: Cloud[] = [
    { x: 80, y: 40, w: 110, speed: 10, alpha: 0.18 },
    { x: 260, y: 70, w: 140, speed: 7, alpha: 0.14 },
    { x: 420, y: 30, w: 90, speed: 12, alpha: 0.2 },
  ];

  const fog: FogBlob[] = [];
  for (let i = 0; i < 6; i++) {
    fog.push({
      x: Math.random() * W,
      y: H - 70 + Math.random() * 40,
      rx: 80 + Math.random() * 60,
      ry: 18 + Math.random() * 10,
      speed: 8 + Math.random() * 10,
      alpha: 0.08 + Math.random() * 0.06,
    });
  }

  return {
    displayedScore: 0,
    timer: ROUND_TIME,
    elapsed: 0,
    spawnCooldown: SPAWN_START,
    goldenTimer: GOLDEN_INTERVAL,
    streak: 0,
    comboActive: false,
    comboTimer: 0,
    entities,
    holes: makeHoles(),
    shakeTime: 0,
    shakeMagX: 0,
    shakeMagY: 0,
    lightningTimer: 12 + Math.random() * 4,
    lightningFlash: 0,
    moonAngle: 0,
    clouds,
    fog,
    menuHover: false,
    gameoverHover: false,
  };
}

export default function PumpkinSmashGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<PumpkinState>(initPumpkinState());
  const particlesRef = useRef(new ParticleSystem(80));
  const popupsRef = useRef(new ParticleSystem(16));
  const [muted, setMutedState] = useState(false);

  // Configure popup font once
  useEffect(() => {
    popupsRef.current.textFont = "bold 22px sans-serif";
  }, []);

  const g = useGameState({ storageKey: "pumpkinSmashBest" });

  const input = useGameInput({
    canvasRef,
    drawW: W,
    drawH: H,
    bindings: {},
  });

  useEffect(() => {
    setEngineMuted(muted);
  }, [muted]);

  // Music + reset on phase transitions
  const prevPhaseRef = useRef(g.phase);
  useEffect(() => {
    const prev = prevPhaseRef.current;
    if (g.phase === "playing" && prev !== "playing") {
      // Fresh game state
      stateRef.current = initPumpkinState();
      particlesRef.current.clear();
      popupsRef.current.clear();
      music.start("adventure");
    } else if (g.phase !== "playing" && prev === "playing") {
      music.stop();
    }
    if (g.phase === "gameover" && prev !== "gameover") {
      sfx.die();
    }
    prevPhaseRef.current = g.phase;
  }, [g.phase]);

  // ── Spawn an entity ─────────────────────────────────────────────────────
  const spawnEntity = useCallback((s: PumpkinState) => {
    const emptyIndices: number[] = [];
    for (let i = 0; i < s.entities.length; i++) {
      const e = s.entities[i]!;
      if (!e.active) emptyIndices.push(i);
    }
    if (emptyIndices.length === 0) return;
    const holeIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const e = s.entities[holeIdx]!;

    const goldenReady = s.goldenTimer <= 0;
    let kind: EntityKind;
    if (goldenReady) {
      kind = "golden";
      s.goldenTimer = GOLDEN_INTERVAL;
    } else {
      const r = Math.random();
      if (r < 0.55 / 0.98) kind = "pumpkin";
      else if (r < (0.55 + 0.25) / 0.98) kind = "ghost";
      else kind = "bat";
    }

    const hole = s.holes[holeIdx];
    e.active = true;
    e.kind = kind;
    e.holeIndex = holeIdx;
    e.x = hole.cx;
    e.y = hole.cy;
    e.age = 0;
    e.lifetime = lifetimeFor(kind);
    e.state = "emerging";
    e.scale = 0;
    e.smashed = false;
    e.wobblePhase = Math.random() * Math.PI * 2;
  }, []);

  const triggerShake = useCallback((s: PumpkinState, mag = 3, time = 0.1) => {
    s.shakeTime = time;
    s.shakeMagX = mag;
    s.shakeMagY = mag;
  }, []);

  const smashEntity = useCallback(
    (s: PumpkinState, e: Entity) => {
      if (e.state === "smashed" || e.state === "hiding") return;
      e.smashed = true;
      e.state = "smashed";
      e.age = 0;

      const points = pointsFor(e.kind);
      const [c1, c2] = colorsForKind(e.kind);

      if (e.kind === "bat") {
        s.streak = 0;
        if (s.comboActive) {
          s.comboActive = false;
          s.comboTimer = 0;
        }
        g.addScore(points);
        sfx.wrong();
        triggerShake(s, 4, 0.12);
        particlesRef.current.burst(e.x, e.y, c1, 4, 160, 0.7);
        particlesRef.current.burst(e.x, e.y, c2, 4, 160, 0.7);
        popupsRef.current.scoreText(e.x, e.y - 20, `${points}`, "#ef4444");
      } else {
        s.streak += 1;
        if (s.streak >= COMBO_THRESHOLD) {
          s.comboActive = true;
          s.comboTimer = COMBO_DURATION;
        }
        const mult = s.comboActive ? 2 : 1;
        const gained = points * mult;
        g.addScore(gained);
        if (e.kind === "pumpkin") sfx.pop();
        else if (e.kind === "ghost") sfx.correct();
        else if (e.kind === "golden") sfx.coin();
        triggerShake(s, 3, 0.1);
        particlesRef.current.burst(e.x, e.y, c1, 4, 160, 0.7);
        particlesRef.current.burst(e.x, e.y, c2, 4, 160, 0.7);
        const popColor =
          e.kind === "golden"
            ? "#fde047"
            : e.kind === "ghost"
              ? "#a9f0ff"
              : "#fb923c";
        popupsRef.current.scoreText(e.x, e.y - 20, `+${gained}`, popColor);
      }
    },
    [g, triggerShake],
  );

  // ── Update ──────────────────────────────────────────────────────────────
  const update = useCallback(
    (s: PumpkinState, dt: number) => {
      // Ambient
      s.moonAngle += dt * 0.1;
      for (const c of s.clouds) {
        c.x -= c.speed * dt;
        if (c.x + c.w < -20) {
          c.x = W + 40;
          c.y = 20 + Math.random() * 80;
        }
      }
      for (const f of s.fog) {
        f.x -= f.speed * dt;
        if (f.x + f.rx < -40) {
          f.x = W + f.rx;
          f.y = H - 70 + Math.random() * 40;
        }
      }

      particlesRef.current.update(dt);
      popupsRef.current.update(dt);

      if (g.ref.current.phase !== "playing") return;

      s.timer -= dt;
      s.elapsed += dt;
      if (s.timer <= 0) {
        s.timer = 0;
        g.gameOver();
        return;
      }

      const score = g.ref.current.score;
      if (s.displayedScore < score) {
        const diff = score - s.displayedScore;
        s.displayedScore += Math.ceil(Math.max(diff * dt * 6, 1));
        if (s.displayedScore > score) s.displayedScore = score;
      } else if (s.displayedScore > score) {
        const diff = s.displayedScore - score;
        s.displayedScore -= Math.ceil(Math.max(diff * dt * 6, 1));
        if (s.displayedScore < score) s.displayedScore = score;
      }

      if (s.comboActive) {
        s.comboTimer -= dt;
        if (s.comboTimer <= 0) {
          s.comboActive = false;
          s.comboTimer = 0;
        }
      }

      if (s.shakeTime > 0) {
        s.shakeTime -= dt;
        if (s.shakeTime < 0) s.shakeTime = 0;
      }

      s.lightningTimer -= dt;
      if (s.lightningTimer <= 0) {
        s.lightningFlash = 1;
        s.lightningTimer = 10 + Math.random() * 5;
        sfx.wallHit();
      }
      if (s.lightningFlash > 0) {
        s.lightningFlash = Math.max(0, s.lightningFlash - dt * 10);
      }

      s.goldenTimer -= dt;

      const progress = s.elapsed / ROUND_TIME;
      const currentSpawnRate =
        SPAWN_START + (SPAWN_END - SPAWN_START) * Math.min(1, progress);
      s.spawnCooldown -= dt;
      if (s.spawnCooldown <= 0) {
        spawnEntity(s);
        s.spawnCooldown = currentSpawnRate * (0.85 + Math.random() * 0.3);
      }

      const EMERGE_TIME = 0.2;
      const HIDE_TIME = 0.2;
      const SMASH_TIME = 0.25;
      for (const e of s.entities) {
        if (!e || !e.active) continue;
        e.age += dt;
        e.wobblePhase += dt * 6;

        if (e.state === "smashed") {
          const t = Math.min(1, e.age / SMASH_TIME);
          e.scale = 1 - t;
          if (t >= 1) {
            e.active = false;
            e.state = "emerging";
          }
          continue;
        }

        if (e.state === "emerging") {
          const t = Math.min(1, e.age / EMERGE_TIME);
          e.scale = Math.max(0, easeOutBack(t));
          if (t >= 1) {
            e.state = "visible";
            e.scale = 1;
            e.age = 0;
          }
          continue;
        }

        if (e.state === "visible") {
          e.scale = 1;
          if (e.age >= e.lifetime) {
            e.state = "hiding";
            e.age = 0;
            if (e.kind !== "bat") {
              s.streak = 0;
              if (s.comboActive) {
                s.comboActive = false;
                s.comboTimer = 0;
              }
            }
          }
          continue;
        }

        if (e.state === "hiding") {
          const t = Math.min(1, e.age / HIDE_TIME);
          e.scale = Math.max(0, 1 - easeInBack(t));
          if (t >= 1) {
            e.active = false;
            e.state = "emerging";
          }
        }
      }
    },
    [g, spawnEntity],
  );

  // ── Draw helpers ────────────────────────────────────────────────────────
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, s: PumpkinState) => {
    const gg = ctx.createLinearGradient(0, 0, 0, H);
    gg.addColorStop(0, "#1a0a2e");
    gg.addColorStop(1, "#16213e");
    ctx.fillStyle = gg;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.65)";
    const stars: [number, number, number][] = [
      [30, 30, 1.2], [80, 55, 0.8], [150, 25, 1], [220, 60, 0.7],
      [300, 20, 1.1], [370, 50, 0.9], [440, 28, 1.3], [60, 90, 0.7],
      [200, 95, 1], [340, 110, 0.8], [420, 130, 1], [120, 140, 0.9], [270, 150, 0.8],
    ];
    for (const [sx, sy, sr] of stars) {
      const tw = 0.5 + 0.5 * Math.sin(s.elapsed * 2 + sx * 0.1);
      ctx.globalAlpha = 0.4 + tw * 0.4;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Moon
    const moonX = W - 60;
    const moonY = 60;
    const moonR = 22;
    ctx.save();
    ctx.translate(moonX, moonY);
    ctx.rotate(s.moonAngle);
    ctx.fillStyle = "#f5f5dc";
    ctx.shadowColor = "#fde68a";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, moonR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(7, -3, moonR * 0.95, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();

    for (const c of s.clouds) {
      ctx.fillStyle = `rgba(210,190,230,${c.alpha})`;
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.w / 2, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x - c.w * 0.2, c.y + 4, c.w * 0.3, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x + c.w * 0.2, c.y + 4, c.w * 0.3, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Skyline
    ctx.fillStyle = "#0b0618";
    ctx.beginPath();
    ctx.moveTo(0, H - 80);
    ctx.quadraticCurveTo(60, H - 110, 140, H - 90);
    ctx.quadraticCurveTo(220, H - 70, 300, H - 100);
    ctx.quadraticCurveTo(380, H - 125, 480, H - 90);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // Haunted house
    ctx.fillStyle = "#0a0514";
    const hx = 60;
    const hy = H - 160;
    ctx.fillRect(hx, hy, 52, 52);
    ctx.beginPath();
    ctx.moveTo(hx - 4, hy);
    ctx.lineTo(hx + 26, hy - 28);
    ctx.lineTo(hx + 56, hy);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(hx + 38, hy - 18, 8, 18);
    ctx.fillStyle = "#fcd34d";
    ctx.globalAlpha = 0.85;
    ctx.fillRect(hx + 8, hy + 12, 8, 10);
    ctx.fillRect(hx + 34, hy + 12, 8, 10);
    ctx.fillStyle = "#3a1b4a";
    ctx.globalAlpha = 1;
    ctx.fillRect(hx + 20, hy + 30, 12, 22);

    const graves: [number, number, number, number][] = [
      [170, H - 90, 18, 24], [210, H - 82, 14, 18], [260, H - 95, 20, 28],
      [320, H - 85, 14, 20], [360, H - 95, 16, 24], [420, H - 88, 14, 20],
      [20, H - 85, 14, 20],
    ];
    ctx.fillStyle = "#0a0514";
    for (const [gx, gy, gw, gh] of graves) {
      ctx.beginPath();
      ctx.moveTo(gx, gy + gh);
      ctx.lineTo(gx, gy + 6);
      ctx.quadraticCurveTo(gx + gw / 2, gy - 6, gx + gw, gy + 6);
      ctx.lineTo(gx + gw, gy + gh);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = "#0a0514";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(430, H - 90); ctx.lineTo(430, H - 155);
    ctx.moveTo(430, H - 145); ctx.lineTo(415, H - 165);
    ctx.moveTo(430, H - 135); ctx.lineTo(448, H - 160);
    ctx.moveTo(430, H - 125); ctx.lineTo(445, H - 140);
    ctx.stroke();
    ctx.lineWidth = 1;
  }, []);

  const drawFog = useCallback((ctx: CanvasRenderingContext2D, s: PumpkinState) => {
    for (const f of s.fog) {
      ctx.fillStyle = `rgba(200,190,220,${f.alpha})`;
      ctx.beginPath();
      ctx.ellipse(f.x, f.y, f.rx, f.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const drawHoles = useCallback((ctx: CanvasRenderingContext2D, s: PumpkinState) => {
    for (const h of s.holes) {
      ctx.fillStyle = "#2d1b47";
      ctx.beginPath();
      ctx.ellipse(h.cx, h.cy + 20, HOLE_W / 2 + 4, HOLE_H / 2 + 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#080312";
      ctx.beginPath();
      ctx.ellipse(h.cx, h.cy + 22, HOLE_W / 2, HOLE_H / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(180,140,220,0.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(h.cx, h.cy + 19, HOLE_W / 2, HOLE_H / 2, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
    }
  }, []);

  const drawPumpkin = useCallback((ctx: CanvasRenderingContext2D, golden = false) => {
    const r = ENTITY_RADIUS;
    if (golden) {
      ctx.shadowColor = "#ffe066";
      ctx.shadowBlur = 24;
    } else {
      ctx.shadowColor = "#ff6a00";
      ctx.shadowBlur = 10;
    }
    const body = golden ? "#f4c430" : "#f97316";
    const bodyDark = golden ? "#d4a017" : "#c2410c";
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = bodyDark;
    ctx.beginPath();
    ctx.ellipse(-r * 0.5, 0, r * 0.3, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(r * 0.5, 0, r * 0.3, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(-r * 0.22, 0, r * 0.22, r * 0.88, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(r * 0.22, 0, r * 0.22, r * 0.88, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#3f6212";
    ctx.fillRect(-5, -r * 0.95, 10, 10);
    ctx.fillStyle = "#65a30d";
    ctx.beginPath();
    ctx.ellipse(8, -r * 0.85, 7, 3, -0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = golden ? "#422006" : "#1c0c03";
    ctx.beginPath(); ctx.moveTo(-14, -6); ctx.lineTo(-4, -6); ctx.lineTo(-9, 4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(4, -6); ctx.lineTo(14, -6); ctx.lineTo(9, 4); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-18, 12); ctx.lineTo(-12, 18); ctx.lineTo(-8, 12); ctx.lineTo(-2, 18);
    ctx.lineTo(4, 12); ctx.lineTo(10, 18); ctx.lineTo(16, 12); ctx.lineTo(18, 22); ctx.lineTo(-18, 22);
    ctx.closePath(); ctx.fill();

    if (golden) {
      ctx.fillStyle = "#fff";
      ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.arc(-18, -18, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(16, -22, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }, []);

  const drawGhost = useCallback((ctx: CanvasRenderingContext2D) => {
    const r = ENTITY_RADIUS;
    ctx.globalAlpha = 0.85;
    ctx.shadowColor = "#c0f0ff";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#f5faff";
    ctx.beginPath();
    ctx.arc(0, -5, r * 0.75, Math.PI, 0, false);
    ctx.lineTo(r * 0.75, r * 0.6);
    const waves = 4;
    for (let i = 0; i < waves; i++) {
      const x1 = r * 0.75 - ((i + 0.5) / waves) * r * 1.5;
      const y1 = r * 0.8;
      const x2 = r * 0.75 - ((i + 1) / waves) * r * 1.5;
      const y2 = r * 0.5;
      ctx.quadraticCurveTo(x1, y1, x2, y2);
    }
    ctx.lineTo(-r * 0.75, -5);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#1f2937";
    ctx.beginPath(); ctx.ellipse(-10, -8, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(10, -8, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 5, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }, []);

  const drawBat = useCallback((ctx: CanvasRenderingContext2D) => {
    const r = ENTITY_RADIUS;
    ctx.shadowColor = "#7c3aed";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#1f0a2e";
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.35, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, -r * 0.1);
    ctx.quadraticCurveTo(-r * 0.9, -r * 0.5, -r * 1.0, r * 0.1);
    ctx.lineTo(-r * 0.8, r * 0.1);
    ctx.quadraticCurveTo(-r * 0.7, r * 0.25, -r * 0.55, r * 0.1);
    ctx.quadraticCurveTo(-r * 0.45, r * 0.25, -r * 0.3, r * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(r * 0.3, -r * 0.1);
    ctx.quadraticCurveTo(r * 0.9, -r * 0.5, r * 1.0, r * 0.1);
    ctx.lineTo(r * 0.8, r * 0.1);
    ctx.quadraticCurveTo(r * 0.7, r * 0.25, r * 0.55, r * 0.1);
    ctx.quadraticCurveTo(r * 0.45, r * 0.25, r * 0.3, r * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.moveTo(-6, -r * 0.4); ctx.lineTo(-3, -r * 0.6); ctx.lineTo(0, -r * 0.38); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(6, -r * 0.4); ctx.lineTo(3, -r * 0.6); ctx.lineTo(0, -r * 0.38); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(-4, -4, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(4, -4, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-3, 2, 1.5, 4);
    ctx.fillRect(1.5, 2, 1.5, 4);
  }, []);

  const drawEntity = useCallback(
    (ctx: CanvasRenderingContext2D, e: Entity) => {
      if (!e.active || e.scale <= 0) return;
      ctx.save();
      let yOff = 0;
      let xOff = 0;
      if (e.kind === "ghost") yOff = Math.sin(e.wobblePhase) * 4;
      else if (e.kind === "bat") xOff = Math.sin(e.wobblePhase * 1.4) * 6;
      else if (e.kind === "golden") yOff = Math.sin(e.wobblePhase * 0.8) * 3;

      const hole = { cx: e.x, cy: e.y + 22 };
      ctx.beginPath();
      ctx.rect(0, 0, W, hole.cy + HOLE_H / 2 - 4);
      ctx.clip();

      ctx.translate(e.x + xOff, e.y + yOff);
      ctx.scale(e.scale, e.scale);

      if (e.kind === "pumpkin") drawPumpkin(ctx);
      else if (e.kind === "ghost") drawGhost(ctx);
      else if (e.kind === "bat") drawBat(ctx);
      else if (e.kind === "golden") drawPumpkin(ctx, true);

      ctx.restore();
    },
    [drawPumpkin, drawGhost, drawBat],
  );

  const drawHUD = useCallback(
    (ctx: CanvasRenderingContext2D, s: PumpkinState) => {
      ctx.textAlign = "left";
      ctx.font = "bold 12px sans-serif";
      ctx.fillStyle = "#fbbf24";
      ctx.fillText("SCORE", 14, 20);
      ctx.font = "bold 26px sans-serif";
      ctx.fillStyle = "#fff7d6";
      ctx.shadowColor = "#ff9a3c";
      ctx.shadowBlur = 6;
      ctx.fillText(String(s.displayedScore), 14, 46);
      ctx.shadowBlur = 0;

      const t = Math.ceil(s.timer);
      const critical = s.timer <= 10;
      ctx.textAlign = "center";
      ctx.font = "bold 12px sans-serif";
      ctx.fillStyle = critical ? "#fca5a5" : "#e9d5ff";
      ctx.fillText("TIME", W / 2, 20);
      const pulse = critical ? 1 + 0.15 * Math.abs(Math.sin(s.elapsed * 6)) : 1;
      ctx.font = `bold ${Math.floor(32 * pulse)}px sans-serif`;
      ctx.fillStyle = critical ? "#ef4444" : "#f8fafc";
      ctx.shadowColor = critical ? "#ef4444" : "#a855f7";
      ctx.shadowBlur = critical ? 14 : 6;
      ctx.fillText(String(t), W / 2, 50);
      ctx.shadowBlur = 0;

      if (s.comboActive) {
        ctx.textAlign = "right";
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#fde68a";
        ctx.fillText("COMBO", W - 52, 20);
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#fbbf24";
        ctx.shadowColor = "#fde047";
        ctx.shadowBlur = 10;
        ctx.fillText("x2!", W - 52, 42);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(253,224,71,0.25)";
        ctx.fillRect(W - 102, 50, 50, 3);
        ctx.fillStyle = "#fde047";
        ctx.fillRect(W - 102, 50, 50 * (s.comboTimer / COMBO_DURATION), 3);
      } else if (s.streak > 0) {
        ctx.textAlign = "right";
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("STREAK", W - 52, 20);
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#e2e8f0";
        ctx.fillText(String(s.streak), W - 52, 42);
      }

      const barY = 62;
      const barW = W - 32;
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      roundRect(ctx, 16, barY, barW, 4, 2);
      ctx.fill();
      ctx.fillStyle = critical ? "#ef4444" : "#a855f7";
      roundRect(ctx, 16, barY, barW * (s.timer / ROUND_TIME), 4, 2);
      ctx.fill();
    },
    [],
  );

  const drawMenu = useCallback((ctx: CanvasRenderingContext2D, s: PumpkinState) => {
    ctx.fillStyle = "rgba(10, 5, 25, 0.65)";
    ctx.fillRect(0, 0, W, H);

    const bounce = Math.sin(s.elapsed * 3) * 8;
    ctx.textAlign = "center";
    ctx.font = "86px serif";
    ctx.fillText("🎃", W / 2, 170 + bounce);

    ctx.font = "bold 36px sans-serif";
    ctx.fillStyle = "#ff9a3c";
    ctx.shadowColor = "#ff6a00";
    ctx.shadowBlur = 16;
    ctx.fillText("Pumpkin Smash", W / 2, 230);
    ctx.shadowBlur = 0;

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#e9d5ff";
    ctx.fillText("Smash pumpkins, catch ghosts,", W / 2, 260);
    ctx.fillText("avoid bats!", W / 2, 280);

    const best = g.ref.current.highScore;
    if (best > 0) {
      ctx.font = "13px sans-serif";
      ctx.fillStyle = "#a78bfa";
      ctx.fillText(`Best: ${best}`, W / 2, 305);
    }

    const glow = 10 + Math.abs(Math.sin(s.elapsed * 2.5)) * 14;
    const btnW = 200;
    const btnH = 60;
    const btnX = (W - btnW) / 2;
    const btnY = 340;
    ctx.fillStyle = s.menuHover ? "#fb923c" : "#f97316";
    ctx.shadowColor = "#fb923c";
    ctx.shadowBlur = glow;
    roundRect(ctx, btnX, btnY, btnW, btnH, 30);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#1a0a2e";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("▶  Play", W / 2, btnY + 38);

    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#c4b5fd";
    ctx.fillText("🎃 +10   👻 +20   🦇 -3   ⭐ +30", W / 2, 430);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px sans-serif";
    ctx.fillText("60 seconds · Chain hits for x2 combo", W / 2, 452);

    ctx.fillStyle = "#64748b";
    ctx.font = "11px sans-serif";
    ctx.fillText("Tap the Play button to start", W / 2, 480);
  }, [g]);

  const drawGameOver = useCallback((ctx: CanvasRenderingContext2D, s: PumpkinState) => {
    ctx.fillStyle = "rgba(10, 5, 25, 0.78)";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.font = "240px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("💀", W / 2, H / 2 + 80 + Math.sin(s.elapsed) * 6);
    ctx.restore();

    ctx.textAlign = "center";
    ctx.font = "bold 32px sans-serif";
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 12;
    ctx.fillText("Time's Up!", W / 2, 100);
    ctx.shadowBlur = 0;

    const score = g.ref.current.score;
    const grade = gradeFor(score);
    ctx.font = "bold 80px sans-serif";
    ctx.fillStyle = grade.color;
    ctx.shadowColor = grade.color;
    ctx.shadowBlur = 18;
    ctx.fillText(grade.label, W / 2, 185);
    ctx.shadowBlur = 0;

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Final Score", W / 2, 215);
    ctx.font = "bold 52px sans-serif";
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#ff9a3c";
    ctx.shadowBlur = 8;
    ctx.fillText(String(score), W / 2, 265);
    ctx.shadowBlur = 0;

    const best = g.ref.current.highScore;
    if (score >= best && score > 0) {
      ctx.font = "bold 15px sans-serif";
      ctx.fillStyle = "#22d3ee";
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 6 + Math.abs(Math.sin(s.elapsed * 4)) * 4;
      ctx.fillText("🏆 New High Score!", W / 2, 295);
      ctx.shadowBlur = 0;
    } else {
      ctx.font = "14px sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText(`Best: ${best}`, W / 2, 295);
    }

    const btnW = 220;
    const btnH = 56;
    const btnX = (W - btnW) / 2;
    const btnY = 335;
    const glow = 10 + Math.abs(Math.sin(s.elapsed * 2.5)) * 12;
    ctx.fillStyle = s.gameoverHover ? "#fb923c" : "#f97316";
    ctx.shadowColor = "#fb923c";
    ctx.shadowBlur = glow;
    roundRect(ctx, btnX, btnY, btnW, btnH, 28);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#1a0a2e";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("▶  Play Again", W / 2, btnY + 36);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Tap to try again", W / 2, 420);
  }, [g]);

  const render = useCallback(
    (ctx: CanvasRenderingContext2D, s: PumpkinState) => {
      let sx = 0;
      let sy = 0;
      if (s.shakeTime > 0) {
        sx = (Math.random() * 2 - 1) * s.shakeMagX;
        sy = (Math.random() * 2 - 1) * s.shakeMagY;
      }
      ctx.save();
      ctx.translate(sx, sy);
      drawBackground(ctx, s);
      drawHoles(ctx, s);
      for (const e of s.entities) if (e) drawEntity(ctx, e);
      drawFog(ctx, s);
      particlesRef.current.draw(ctx);
      popupsRef.current.draw(ctx);
      ctx.restore();

      if (g.ref.current.phase === "playing") drawHUD(ctx, s);

      if (s.lightningFlash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${s.lightningFlash * 0.6})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (g.ref.current.phase === "title") drawMenu(ctx, s);
      else if (g.ref.current.phase === "gameover") drawGameOver(ctx, s);
    },
    [drawBackground, drawHoles, drawEntity, drawFog, drawHUD, drawMenu, drawGameOver, g],
  );

  // Pointer helpers
  function pointInPlayButton(x: number, y: number, phase: string): boolean {
    if (phase === "title") {
      const btnW = 200, btnH = 60;
      const btnX = (W - btnW) / 2, btnY = 340;
      return x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
    }
    if (phase === "gameover") {
      const btnW = 220, btnH = 56;
      const btnX = (W - btnW) / 2, btnY = 335;
      return x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
    }
    return false;
  }

  // Main loop
  useGameLoop((dt) => {
    const s = stateRef.current;
    update(s, dt);

    // Input — handle tap
    if (input.consumeTap()) {
      const px = input.pointer.x ?? 0;
      const py = input.pointer.y ?? 0;
      const phase = g.ref.current.phase;
      if (phase === "title") {
        if (pointInPlayButton(px, py, "title")) g.start();
      } else if (phase === "gameover") {
        if (pointInPlayButton(px, py, "gameover")) g.restart();
      } else if (phase === "playing") {
        for (let i = 0; i < s.entities.length; i++) {
          const e = s.entities[i];
          if (!e || !e.active || e.state === "smashed" || e.state === "hiding") continue;
          const dx = px - e.x;
          const dy = py - (e.y - 6);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= ENTITY_RADIUS * 1.05) {
            smashEntity(s, e);
            return;
          }
        }
      }
    }

    // Hover state for button glow
    const px = input.pointer.x ?? -1;
    const py = input.pointer.y ?? -1;
    const phase = g.ref.current.phase;
    if (phase === "title") {
      s.menuHover = pointInPlayButton(px, py, "title");
      s.gameoverHover = false;
    } else if (phase === "gameover") {
      s.gameoverHover = pointInPlayButton(px, py, "gameover");
      s.menuHover = false;
    } else {
      s.menuHover = false;
      s.gameoverHover = false;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    render(ctx, s);
  });

  const wrapperStyle = useMemo(
    () => ({
      width: "100%",
      maxWidth: "min(100%, calc(480/520 * (100dvh - 80px)))",
      margin: "0 auto",
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-2 select-none" style={wrapperStyle}>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-700">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block touch-none"
          style={{ width: "100%", height: "auto", background: "#1a0a2e" }}
        />
      </div>

      <GameHUD
        phase={g.phase}
        muted={muted}
        onToggleMute={() => setMutedState((m) => !m)}
        hint="Tap to smash · 60 seconds · SS rank awaits!"
      >
        {g.phase === "playing" && (
          <span className="text-xs text-gray-500">
            Chain hits for a x2 combo · avoid the bats!
          </span>
        )}
      </GameHUD>
    </div>
  );
}
