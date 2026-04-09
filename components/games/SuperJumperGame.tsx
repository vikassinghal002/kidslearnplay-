"use client";
import { useEffect, useRef, useCallback, useState } from "react";

// ============================================================
// CONSTANTS
// ============================================================
const CW = 512, CH = 320;

// Physics
const GRAVITY       = 0.55;
const JUMP_VELOCITY = -11.5;
const MOVE_ACCEL    = 0.55;
const MOVE_FRICTION = 0.80;
const MAX_MOVE      = 3.8;
const MAX_FALL      = 14;
const COYOTE_FRAMES = 6;
const JUMP_BUFFER   = 8;
const JUMP_CUT_MULT = 0.45;    // variable jump height

// Player dimensions
const PLAYER_W = 26;
const PLAYER_H = 38;

// ============================================================
// TYPES
// ============================================================
interface Rect { x: number; y: number; w: number; h: number; }

interface Player {
  x: number; y: number; vx: number; vy: number;
  onGround: boolean;
  facing: number;
  coyote: number;
  jumpBuffer: number;
  jumping: boolean;
  invincible: number;
  walkFrame: number;
  alive: boolean;
  deathTimer: number;
}

type EnemyType = "walker" | "flyer";

interface Enemy {
  x: number; y: number; vx: number; vy: number;
  w: number; h: number;
  type: EnemyType;
  alive: boolean;
  stomped: boolean;
  stompTimer: number;
  onGround: boolean;
  walkFrame: number;
  patrolMin: number;
  patrolMax: number;
  baseY: number;
}

interface Coin {
  x: number; y: number;
  collected: boolean;
  frame: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
  type: "sparkle" | "dust" | "coinPop" | "stomp" | "score";
  text?: string;
}

interface Cloud { x: number; y: number; r: number; speed: number; }

interface Theme {
  skyTop: string; skyBottom: string;
  mountain: string; hill: string;
  platformTop: string; platformBody: string; platformEdge: string;
  brickHighlight: string;
  cloudColor: string;
  groundStripe: string;
  platformPattern: "brick" | "stone" | "grass";
}

interface LevelDef {
  name: string;
  width: number;
  playerStart: { x: number; y: number };
  theme: Theme;
  platforms: Rect[];
  enemies: { x: number; y: number; type: EnemyType; patrol: number }[];
  coins: [number, number][];
  flagX: number;
}

// ============================================================
// LEVEL DATA
// ============================================================

const THEMES: Record<string, Theme> = {
  plains: {
    skyTop: "#5eb8ff", skyBottom: "#c9e8ff",
    mountain: "#6a7f9e", hill: "#3f8f3f",
    platformTop: "#2d8a2d", platformBody: "#8B4513", platformEdge: "#5a2d08",
    brickHighlight: "#4db84d", cloudColor: "rgba(255,255,255,0.9)",
    groundStripe: "#1e5f1e", platformPattern: "grass",
  },
  forest: {
    skyTop: "#ffa0b4", skyBottom: "#ffd4c0",
    mountain: "#854d75", hill: "#6d3a60",
    platformTop: "#8b4b9c", platformBody: "#5a2d3d", platformEdge: "#3a1828",
    brickHighlight: "#b266c2", cloudColor: "rgba(255,220,200,0.85)",
    groundStripe: "#3a1828", platformPattern: "brick",
  },
  castle: {
    skyTop: "#2a1e50", skyBottom: "#4a3890",
    mountain: "#3a2d60", hill: "#5a4880",
    platformTop: "#8080a0", platformBody: "#505070", platformEdge: "#2d2d40",
    brickHighlight: "#a0a0c0", cloudColor: "rgba(180,180,220,0.7)",
    groundStripe: "#303040", platformPattern: "stone",
  },
};

const LEVELS: LevelDef[] = [
  // ────────────────────────────────────────────────
  // LEVEL 1: GREEN PLAINS — gentle intro
  // ────────────────────────────────────────────────
  {
    name: "Green Plains",
    width: 4800,
    playerStart: { x: 60, y: 200 },
    theme: THEMES.plains,
    flagX: 4680,
    platforms: [
      { x: 0,    y: 272, w: 720,  h: 48 },
      { x: 200,  y: 216, w: 96,   h: 16 },
      { x: 380,  y: 184, w: 96,   h: 16 },
      { x: 560,  y: 216, w: 96,   h: 16 },

      { x: 840,  y: 272, w: 640,  h: 48 },
      { x: 880,  y: 208, w: 112,  h: 16 },
      { x: 1060, y: 176, w: 96,   h: 16 },
      { x: 1240, y: 208, w: 96,   h: 16 },
      { x: 1380, y: 240, w: 80,   h: 16 },

      { x: 1600, y: 272, w: 520,  h: 48 },
      { x: 1680, y: 200, w: 80,   h: 16 },
      { x: 1820, y: 168, w: 96,   h: 16 },
      { x: 1980, y: 200, w: 96,   h: 16 },

      { x: 2240, y: 272, w: 560,  h: 48 },
      { x: 2300, y: 208, w: 80,   h: 16 },
      { x: 2440, y: 176, w: 80,   h: 16 },
      { x: 2580, y: 144, w: 80,   h: 16 },
      { x: 2720, y: 176, w: 80,   h: 16 },

      { x: 2920, y: 272, w: 720,  h: 48 },
      { x: 2980, y: 208, w: 96,   h: 16 },
      { x: 3160, y: 176, w: 96,   h: 16 },
      { x: 3360, y: 208, w: 96,   h: 16 },
      { x: 3520, y: 240, w: 80,   h: 16 },

      { x: 3760, y: 272, w: LEVELS_WIDTH_END_1(), h: 48 },
      { x: 3820, y: 208, w: 96,   h: 16 },
      { x: 4000, y: 176, w: 96,   h: 16 },
      { x: 4180, y: 208, w: 96,   h: 16 },
      { x: 4420, y: 240, w: 80,   h: 16 },
    ],
    enemies: [
      { x: 360,  y: 240, type: "walker", patrol: 200 },
      { x: 620,  y: 240, type: "walker", patrol: 100 },
      { x: 940,  y: 240, type: "walker", patrol: 150 },
      { x: 1180, y: 240, type: "walker", patrol: 100 },
      { x: 1320, y: 240, type: "walker", patrol: 130 },
      { x: 1720, y: 240, type: "walker", patrol: 180 },
      { x: 1950, y: 240, type: "walker", patrol: 140 },
      { x: 2360, y: 240, type: "walker", patrol: 180 },
      { x: 2640, y: 130, type: "flyer",  patrol: 160 },
      { x: 2820, y: 240, type: "walker", patrol: 140 },
      { x: 3080, y: 240, type: "walker", patrol: 180 },
      { x: 3340, y: 240, type: "walker", patrol: 180 },
      { x: 3500, y: 130, type: "flyer",  patrol: 180 },
      { x: 3900, y: 240, type: "walker", patrol: 140 },
      { x: 4120, y: 240, type: "walker", patrol: 180 },
      { x: 4320, y: 240, type: "walker", patrol: 180 },
    ],
    coins: [
      [120,240],[155,240],[190,240],[225,240],
      [210,185],[245,185],[280,185],
      [390,152],[425,152],[460,152],
      [570,185],[605,185],[640,185],
      [860,240],[895,240],[930,240],
      [910,178],[945,178],[980,178],
      [1080,146],[1115,146],[1150,146],
      [1265,178],[1300,178],
      [1395,210],
      [1660,240],[1695,240],[1730,240],
      [1700,170],[1735,170],
      [1825,138],[1860,138],[1895,138],
      [1995,170],[2030,170],
      [2270,240],[2305,240],[2340,240],
      [2320,178],[2355,178],
      [2460,146],[2495,146],
      [2600,114],[2635,114],[2670,114],
      [2740,146],[2775,146],
      [2960,240],[2995,240],
      [3000,178],[3035,178],[3070,178],
      [3180,146],[3215,146],
      [3380,178],[3415,178],
      [3540,210],[3575,210],
      [3790,240],[3825,240],[3860,240],
      [3840,178],[3875,178],
      [4020,146],[4055,146],[4090,146],
      [4200,178],[4235,178],
      [4440,210],[4475,210],[4510,210],[4545,210],
    ],
  },
  // ────────────────────────────────────────────────
  // LEVEL 2: MUSHROOM FOREST — more jumping
  // ────────────────────────────────────────────────
  {
    name: "Mushroom Forest",
    width: 5200,
    playerStart: { x: 60, y: 200 },
    theme: THEMES.forest,
    flagX: 5080,
    platforms: [
      { x: 0,    y: 272, w: 520,  h: 48 },
      { x: 160,  y: 208, w: 80,   h: 16 },
      { x: 300,  y: 168, w: 80,   h: 16 },
      { x: 440,  y: 208, w: 80,   h: 16 },

      { x: 620,  y: 272, w: 320,  h: 48 },
      { x: 680,  y: 200, w: 80,   h: 16 },
      { x: 820,  y: 160, w: 80,   h: 16 },

      { x: 1040, y: 272, w: 280,  h: 48 },
      { x: 1060, y: 192, w: 72,   h: 16 },
      { x: 1180, y: 152, w: 72,   h: 16 },

      { x: 1420, y: 272, w: 400,  h: 48 },
      { x: 1460, y: 200, w: 80,   h: 16 },
      { x: 1600, y: 160, w: 80,   h: 16 },
      { x: 1740, y: 200, w: 80,   h: 16 },

      { x: 1920, y: 272, w: 360,  h: 48 },
      { x: 1960, y: 184, w: 80,   h: 16 },
      { x: 2100, y: 144, w: 80,   h: 16 },
      { x: 2240, y: 184, w: 80,   h: 16 },

      { x: 2380, y: 272, w: 360,  h: 48 },
      { x: 2420, y: 200, w: 72,   h: 16 },
      { x: 2540, y: 160, w: 72,   h: 16 },
      { x: 2660, y: 200, w: 72,   h: 16 },

      { x: 2820, y: 272, w: 320,  h: 48 },
      { x: 2840, y: 184, w: 72,   h: 16 },
      { x: 2960, y: 144, w: 72,   h: 16 },
      { x: 3080, y: 184, w: 72,   h: 16 },

      { x: 3240, y: 272, w: 400,  h: 48 },
      { x: 3280, y: 208, w: 80,   h: 16 },
      { x: 3420, y: 168, w: 80,   h: 16 },
      { x: 3560, y: 208, w: 80,   h: 16 },

      { x: 3720, y: 272, w: 360,  h: 48 },
      { x: 3760, y: 184, w: 80,   h: 16 },
      { x: 3900, y: 144, w: 80,   h: 16 },
      { x: 4040, y: 184, w: 80,   h: 16 },

      { x: 4180, y: 272, w: 360,  h: 48 },
      { x: 4220, y: 200, w: 80,   h: 16 },
      { x: 4360, y: 160, w: 80,   h: 16 },
      { x: 4500, y: 200, w: 80,   h: 16 },

      { x: 4620, y: 272, w: 580,  h: 48 },
      { x: 4700, y: 208, w: 80,   h: 16 },
      { x: 4840, y: 176, w: 80,   h: 16 },
      { x: 4980, y: 208, w: 80,   h: 16 },
    ],
    enemies: [
      { x: 320,  y: 240, type: "walker", patrol: 160 },
      { x: 460,  y: 240, type: "walker", patrol: 60 },
      { x: 720,  y: 240, type: "walker", patrol: 160 },
      { x: 860,  y: 140, type: "flyer",  patrol: 160 },
      { x: 1160, y: 240, type: "walker", patrol: 120 },
      { x: 1240, y: 130, type: "flyer",  patrol: 180 },
      { x: 1500, y: 240, type: "walker", patrol: 280 },
      { x: 1680, y: 140, type: "flyer",  patrol: 200 },
      { x: 1980, y: 240, type: "walker", patrol: 240 },
      { x: 2160, y: 130, type: "flyer",  patrol: 200 },
      { x: 2460, y: 240, type: "walker", patrol: 220 },
      { x: 2600, y: 140, type: "flyer",  patrol: 160 },
      { x: 2880, y: 240, type: "walker", patrol: 180 },
      { x: 3020, y: 130, type: "flyer",  patrol: 180 },
      { x: 3300, y: 240, type: "walker", patrol: 260 },
      { x: 3480, y: 150, type: "flyer",  patrol: 200 },
      { x: 3800, y: 240, type: "walker", patrol: 220 },
      { x: 3960, y: 130, type: "flyer",  patrol: 200 },
      { x: 4280, y: 240, type: "walker", patrol: 220 },
      { x: 4440, y: 140, type: "flyer",  patrol: 180 },
      { x: 4720, y: 240, type: "walker", patrol: 240 },
      { x: 4880, y: 160, type: "flyer",  patrol: 200 },
    ],
    coins: [
      [180,178],[215,178],[250,178],
      [320,138],[355,138],
      [460,178],[495,178],
      [700,170],[735,170],
      [840,130],[875,130],[910,130],
      [1080,162],[1115,162],
      [1200,122],[1235,122],[1270,122],
      [1480,170],[1515,170],[1550,170],
      [1620,130],[1655,130],[1690,130],
      [1760,170],[1795,170],
      [1980,154],[2015,154],
      [2120,114],[2155,114],[2190,114],
      [2260,154],[2295,154],
      [2440,170],[2475,170],
      [2560,130],[2595,130],[2630,130],
      [2680,170],[2715,170],
      [2860,154],[2895,154],
      [2980,114],[3015,114],[3050,114],
      [3100,154],[3135,154],
      [3300,178],[3335,178],
      [3440,138],[3475,138],[3510,138],
      [3580,178],[3615,178],
      [3780,154],[3815,154],
      [3920,114],[3955,114],[3990,114],
      [4060,154],[4095,154],
      [4240,170],[4275,170],
      [4380,130],[4415,130],[4450,130],
      [4520,170],[4555,170],
      [4720,178],[4755,178],
      [4860,146],[4895,146],[4930,146],
      [5000,178],[5035,178],
    ],
  },
  // ────────────────────────────────────────────────
  // LEVEL 3: SKY CASTLE — hardest
  // ────────────────────────────────────────────────
  {
    name: "Sky Castle",
    width: 5600,
    playerStart: { x: 60, y: 200 },
    theme: THEMES.castle,
    flagX: 5480,
    platforms: [
      { x: 0,    y: 272, w: 360,  h: 48 },
      { x: 120,  y: 200, w: 72,   h: 16 },
      { x: 240,  y: 160, w: 72,   h: 16 },

      { x: 460,  y: 272, w: 200,  h: 48 },
      { x: 480,  y: 192, w: 64,   h: 16 },
      { x: 580,  y: 152, w: 64,   h: 16 },

      { x: 760,  y: 272, w: 200,  h: 48 },
      { x: 780,  y: 184, w: 64,   h: 16 },
      { x: 880,  y: 144, w: 64,   h: 16 },

      { x: 1060, y: 272, w: 200,  h: 48 },
      { x: 1080, y: 192, w: 64,   h: 16 },
      { x: 1180, y: 152, w: 64,   h: 16 },

      { x: 1360, y: 272, w: 240,  h: 48 },
      { x: 1380, y: 192, w: 64,   h: 16 },
      { x: 1480, y: 152, w: 64,   h: 16 },

      { x: 1700, y: 272, w: 240,  h: 48 },
      { x: 1720, y: 184, w: 64,   h: 16 },
      { x: 1820, y: 144, w: 64,   h: 16 },

      { x: 2040, y: 272, w: 240,  h: 48 },
      { x: 2060, y: 192, w: 64,   h: 16 },
      { x: 2160, y: 152, w: 64,   h: 16 },

      { x: 2380, y: 272, w: 240,  h: 48 },
      { x: 2400, y: 192, w: 64,   h: 16 },
      { x: 2500, y: 152, w: 64,   h: 16 },

      { x: 2720, y: 272, w: 240,  h: 48 },
      { x: 2740, y: 184, w: 64,   h: 16 },
      { x: 2840, y: 144, w: 64,   h: 16 },

      { x: 3060, y: 272, w: 240,  h: 48 },
      { x: 3080, y: 192, w: 64,   h: 16 },
      { x: 3180, y: 152, w: 64,   h: 16 },

      { x: 3400, y: 272, w: 240,  h: 48 },
      { x: 3420, y: 184, w: 64,   h: 16 },
      { x: 3520, y: 144, w: 64,   h: 16 },

      { x: 3740, y: 272, w: 240,  h: 48 },
      { x: 3760, y: 192, w: 64,   h: 16 },
      { x: 3860, y: 152, w: 64,   h: 16 },

      { x: 4080, y: 272, w: 280,  h: 48 },
      { x: 4100, y: 192, w: 64,   h: 16 },
      { x: 4200, y: 152, w: 64,   h: 16 },
      { x: 4300, y: 112, w: 64,   h: 16 },

      { x: 4440, y: 272, w: 280,  h: 48 },
      { x: 4460, y: 184, w: 64,   h: 16 },
      { x: 4560, y: 144, w: 64,   h: 16 },

      { x: 4800, y: 272, w: 800,  h: 48 },
      { x: 4840, y: 208, w: 80,   h: 16 },
      { x: 4980, y: 176, w: 80,   h: 16 },
      { x: 5120, y: 144, w: 80,   h: 16 },
      { x: 5260, y: 176, w: 80,   h: 16 },
    ],
    enemies: [
      { x: 160,  y: 170, type: "walker", patrol: 140 },
      { x: 300,  y: 240, type: "walker", patrol: 80 },
      { x: 500,  y: 240, type: "walker", patrol: 150 },
      { x: 620,  y: 140, type: "flyer",  patrol: 200 },
      { x: 780,  y: 240, type: "walker", patrol: 160 },
      { x: 920,  y: 130, type: "flyer",  patrol: 200 },
      { x: 1100, y: 240, type: "walker", patrol: 150 },
      { x: 1220, y: 130, type: "flyer",  patrol: 180 },
      { x: 1420, y: 240, type: "walker", patrol: 170 },
      { x: 1550, y: 130, type: "flyer",  patrol: 200 },
      { x: 1760, y: 240, type: "walker", patrol: 170 },
      { x: 1900, y: 130, type: "flyer",  patrol: 200 },
      { x: 2100, y: 240, type: "walker", patrol: 170 },
      { x: 2220, y: 130, type: "flyer",  patrol: 200 },
      { x: 2440, y: 240, type: "walker", patrol: 170 },
      { x: 2560, y: 130, type: "flyer",  patrol: 200 },
      { x: 2780, y: 240, type: "walker", patrol: 170 },
      { x: 2900, y: 130, type: "flyer",  patrol: 200 },
      { x: 3120, y: 240, type: "walker", patrol: 170 },
      { x: 3260, y: 130, type: "flyer",  patrol: 200 },
      { x: 3460, y: 240, type: "walker", patrol: 170 },
      { x: 3600, y: 130, type: "flyer",  patrol: 200 },
      { x: 3800, y: 240, type: "walker", patrol: 170 },
      { x: 3940, y: 130, type: "flyer",  patrol: 200 },
      { x: 4140, y: 240, type: "walker", patrol: 170 },
      { x: 4280, y: 130, type: "flyer",  patrol: 200 },
      { x: 4500, y: 240, type: "walker", patrol: 200 },
      { x: 4640, y: 130, type: "flyer",  patrol: 200 },
      { x: 4880, y: 240, type: "walker", patrol: 240 },
      { x: 5040, y: 130, type: "flyer",  patrol: 240 },
      { x: 5300, y: 240, type: "walker", patrol: 240 },
    ],
    coins: [
      [140,170],[175,170],
      [260,130],[295,130],
      [500,162],[535,162],
      [600,122],[635,122],
      [800,154],[835,154],
      [900,114],[935,114],
      [1100,162],[1135,162],
      [1200,122],[1235,122],
      [1400,162],[1435,162],
      [1500,122],[1535,122],
      [1740,154],[1775,154],
      [1840,114],[1875,114],
      [2080,162],[2115,162],
      [2180,122],[2215,122],
      [2420,162],[2455,162],
      [2520,122],[2555,122],
      [2760,154],[2795,154],
      [2860,114],[2895,114],
      [3100,162],[3135,162],
      [3200,122],[3235,122],
      [3440,154],[3475,154],
      [3540,114],[3575,114],
      [3780,162],[3815,162],
      [3880,122],[3915,122],
      [4120,162],[4155,162],
      [4220,122],[4255,122],
      [4320,82],[4355,82],
      [4480,154],[4515,154],
      [4580,114],[4615,114],
      [4860,178],[4895,178],
      [5000,146],[5035,146],
      [5140,114],[5175,114],[5210,114],
      [5280,146],[5315,146],
    ],
  },
];

function LEVELS_WIDTH_END_1() { return 4800 - 3760; }

// ============================================================
// AUDIO SYSTEM
// ============================================================

class AudioSystem {
  ctx: AudioContext | null = null;
  enabled = true;
  musicInterval: number | null = null;
  musicStep = 0;

  init() {
    if (this.ctx) return;
    try {
      const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      this.ctx = new AC();
    } catch {
      /* no audio */
    }
  }

  resume() {
    if (this.ctx?.state === "suspended") this.ctx.resume();
  }

  setEnabled(v: boolean) {
    this.enabled = v;
    if (!v) this.stopMusic();
  }

  private tone(freq: number, duration: number, type: OscillatorType = "square", volume = 0.08, delay = 0) {
    if (!this.ctx || !this.enabled) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  private sweep(from: number, to: number, duration: number, type: OscillatorType = "square", volume = 0.08) {
    if (!this.ctx || !this.enabled) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(to, t0 + duration);
    gain.gain.setValueAtTime(volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  jump()    { this.sweep(380, 780, 0.12, "square",   0.08); }
  coin()    { this.tone(988, 0.06, "square", 0.1); this.tone(1319, 0.1, "square", 0.1, 0.05); }
  stomp()   { this.sweep(260, 60, 0.15, "sawtooth", 0.12); }
  hit()     { this.sweep(520, 100, 0.3, "sawtooth", 0.1); }
  death()   {
    this.tone(523, 0.12, "triangle", 0.14);
    this.tone(415, 0.12, "triangle", 0.14, 0.12);
    this.tone(330, 0.35, "triangle", 0.14, 0.24);
  }
  levelClear() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => this.tone(n, 0.18, "square", 0.12, i * 0.1));
  }
  gameWin() {
    const notes = [523, 659, 784, 1047, 1319, 1568];
    notes.forEach((n, i) => this.tone(n, 0.2, "square", 0.14, i * 0.12));
  }

  // Simple 8-step bass loop for background music
  startMusic(theme: "plains" | "forest" | "castle") {
    if (!this.ctx || !this.enabled || this.musicInterval !== null) return;
    const melodies: Record<string, number[]> = {
      plains: [523, 659, 784, 659, 523, 659, 784, 988],
      forest: [440, 523, 659, 523, 440, 523, 659, 523],
      castle: [330, 392, 523, 392, 330, 392, 523, 659],
    };
    const melody = melodies[theme];
    this.musicStep = 0;
    const playNote = () => {
      if (!this.enabled) return;
      const n = melody[this.musicStep % melody.length];
      this.tone(n, 0.18, "triangle", 0.05);
      this.musicStep++;
    };
    playNote();
    this.musicInterval = window.setInterval(playNote, 260);
  }

  stopMusic() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

// ============================================================
// HELPERS
// ============================================================

function overlap(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

// ============================================================
// COMPONENT
// ============================================================

export default function SuperJumperGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const audioRef = useRef(new AudioSystem());

  const stateRef = useRef<{
    phase: "title" | "playing" | "levelClear" | "gameover" | "gameWin";
    levelIdx: number;
    player: Player;
    enemies: Enemy[];
    coins: Coin[];
    particles: Particle[];
    clouds: Cloud[];
    camX: number; camShake: number;
    lives: number; score: number;
    keys: Record<string, boolean>;
    touch: { left: boolean; right: boolean; jump: boolean };
    phaseTimer: number;
    frame: number;
  }>({
    phase: "title",
    levelIdx: 0,
    player: makePlayer(60, 200),
    enemies: [],
    coins: [],
    particles: [],
    clouds: Array.from({ length: 14 }, (_, i) => ({
      x: i * 380 + 80,
      y: 20 + Math.random() * 90,
      r: 30 + Math.random() * 30,
      speed: 0.15 + Math.random() * 0.15,
    })),
    camX: 0, camShake: 0,
    lives: 3, score: 0,
    keys: {},
    touch: { left: false, right: false, jump: false },
    phaseTimer: 0,
    frame: 0,
  });

  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  function makePlayer(x: number, y: number): Player {
    return {
      x, y, vx: 0, vy: 0,
      onGround: false, facing: 1,
      coyote: 0, jumpBuffer: 0, jumping: false,
      invincible: 0, walkFrame: 0, alive: true, deathTimer: 0,
    };
  }

  function loadLevel(idx: number) {
    const s = stateRef.current;
    const lvl = LEVELS[idx];
    s.levelIdx = idx;
    s.player = makePlayer(lvl.playerStart.x, lvl.playerStart.y);
    s.enemies = lvl.enemies.map(e => ({
      x: e.x, y: e.y, vx: -1.3, vy: 0,
      w: e.type === "flyer" ? 30 : 30,
      h: e.type === "flyer" ? 22 : 30,
      type: e.type,
      alive: true, stomped: false, stompTimer: 0,
      onGround: false, walkFrame: 0,
      patrolMin: e.x - e.patrol / 2,
      patrolMax: e.x + e.patrol / 2,
      baseY: e.y,
    }));
    s.coins = lvl.coins.map(([x, y]) => ({ x, y, collected: false, frame: Math.random() * 30 }));
    s.particles = [];
    s.camX = 0;
    s.camShake = 0;
    s.phaseTimer = 0;
  }

  function startGame() {
    const s = stateRef.current;
    s.lives = 3;
    s.score = 0;
    s.phase = "playing";
    loadLevel(0);
    audioRef.current.init();
    audioRef.current.resume();
    audioRef.current.startMusic("plains");
  }

  function spawnParticles(type: Particle["type"], x: number, y: number, count: number, text?: string) {
    const s = stateRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      const color = type === "coinPop" ? "#FFD700" :
                    type === "stomp"   ? "#ff6633" :
                    type === "sparkle" ? "#ffff99" : "#ffffff";
      s.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === "coinPop" ? 2 : 0),
        life: type === "score" ? 60 : 30,
        maxLife: type === "score" ? 60 : 30,
        color, size: 2 + Math.random() * 2,
        type, text,
      });
    }
  }

  function spawnScoreText(x: number, y: number, text: string) {
    const s = stateRef.current;
    s.particles.push({
      x, y, vx: 0, vy: -1,
      life: 50, maxLife: 50,
      color: "#ffff66", size: 12,
      type: "score", text,
    });
  }

  // ============================================================
  // MAIN LOOP
  // ============================================================

  const tick = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) { rafRef.current = requestAnimationFrame(tick); return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;
    s.frame++;

    if (lastTimeRef.current === 0) lastTimeRef.current = time;
    lastTimeRef.current = time;

    // ============================================================
    // UPDATE
    // ============================================================

    const lvl = LEVELS[s.levelIdx];

    if (s.phase === "playing" && !paused) {
      const p = s.player;
      const keys = s.keys;
      const touch = s.touch;

      // Input
      const leftIn  = keys["ArrowLeft"]  || keys["a"] || keys["A"] || touch.left;
      const rightIn = keys["ArrowRight"] || keys["d"] || keys["D"] || touch.right;
      const jumpIn  = keys["ArrowUp"] || keys["w"] || keys["W"] || keys[" "] || touch.jump;

      if (p.alive) {
        // Horizontal movement
        if (leftIn)  { p.vx -= MOVE_ACCEL; p.facing = -1; }
        if (rightIn) { p.vx += MOVE_ACCEL; p.facing =  1; }
        if (!leftIn && !rightIn) p.vx *= MOVE_FRICTION;
        p.vx = Math.max(-MAX_MOVE, Math.min(MAX_MOVE, p.vx));
        if (Math.abs(p.vx) < 0.1) p.vx = 0;

        // Jump buffering
        if (jumpIn && !p.jumping) { p.jumpBuffer = JUMP_BUFFER; p.jumping = true; }
        if (!jumpIn) p.jumping = false;
        if (p.jumpBuffer > 0) p.jumpBuffer--;

        // Coyote time
        if (p.onGround) p.coyote = COYOTE_FRAMES;
        else if (p.coyote > 0) p.coyote--;

        // Jump
        if (p.jumpBuffer > 0 && p.coyote > 0) {
          p.vy = JUMP_VELOCITY;
          p.coyote = 0;
          p.jumpBuffer = 0;
          p.onGround = false;
          audioRef.current.jump();
          spawnParticles("dust", p.x + PLAYER_W / 2, p.y + PLAYER_H, 4);
        }

        // Variable jump height
        if (!jumpIn && p.vy < 0) p.vy *= JUMP_CUT_MULT;

        // Gravity
        p.vy += GRAVITY;
        if (p.vy > MAX_FALL) p.vy = MAX_FALL;

        // Move X + collide
        p.x += p.vx;
        p.x = Math.max(0, Math.min(p.x, lvl.width - PLAYER_W));
        for (const pl of lvl.platforms) {
          const r: Rect = { x: p.x, y: p.y, w: PLAYER_W, h: PLAYER_H };
          if (overlap(r, pl)) {
            if (p.vx > 0) p.x = pl.x - PLAYER_W;
            else if (p.vx < 0) p.x = pl.x + pl.w;
            p.vx = 0;
          }
        }

        // Move Y + collide
        p.y += p.vy;
        const wasOnGround = p.onGround;
        p.onGround = false;
        for (const pl of lvl.platforms) {
          const r: Rect = { x: p.x, y: p.y, w: PLAYER_W, h: PLAYER_H };
          if (overlap(r, pl)) {
            if (p.vy > 0) {
              p.y = pl.y - PLAYER_H;
              p.vy = 0;
              p.onGround = true;
            } else if (p.vy < 0) {
              p.y = pl.y + pl.h;
              p.vy = 0;
            }
          }
        }

        // Landing dust
        if (p.onGround && !wasOnGround && p.vy === 0) {
          spawnParticles("dust", p.x + PLAYER_W / 2, p.y + PLAYER_H, 3);
        }

        // Walk animation
        if (p.onGround && Math.abs(p.vx) > 0.5) p.walkFrame += 0.25;
        else p.walkFrame = 0;

        // Fall into pit
        if (p.y > CH + 100) {
          p.alive = false;
          p.deathTimer = 60;
          audioRef.current.death();
          audioRef.current.stopMusic();
        }

        // Invincibility
        if (p.invincible > 0) p.invincible--;

        // Reached flag?
        if (p.x + PLAYER_W >= lvl.flagX) {
          s.score += 500;
          s.phase = "levelClear";
          s.phaseTimer = 120;
          audioRef.current.levelClear();
          audioRef.current.stopMusic();
        }
      } else {
        // Dying animation
        p.vy += GRAVITY * 0.7;
        p.y += p.vy;
        p.deathTimer--;
        if (p.deathTimer <= 0) {
          s.lives--;
          if (s.lives <= 0) {
            s.phase = "gameover";
            s.phaseTimer = 180;
          } else {
            loadLevel(s.levelIdx);
            s.phase = "playing";
            audioRef.current.startMusic(
              s.levelIdx === 0 ? "plains" : s.levelIdx === 1 ? "forest" : "castle"
            );
          }
        }
      }

      // Enemies
      for (const e of s.enemies) {
        if (!e.alive) continue;
        if (e.stomped) {
          e.stompTimer--;
          if (e.stompTimer <= 0) e.alive = false;
          continue;
        }

        if (e.type === "walker") {
          e.vy += GRAVITY;
          e.x += e.vx;
          e.y += e.vy;
          e.onGround = false;

          // Collide with platforms
          for (const pl of lvl.platforms) {
            const r: Rect = { x: e.x, y: e.y, w: e.w, h: e.h };
            if (overlap(r, pl)) {
              // Y resolution
              if (e.vy > 0 && e.y + e.h - e.vy <= pl.y + 2) {
                e.y = pl.y - e.h; e.vy = 0; e.onGround = true;
              } else if (e.vy < 0 && e.y - e.vy >= pl.y + pl.h - 2) {
                e.y = pl.y + pl.h; e.vy = 0;
              } else {
                // X collision (hit wall)
                if (e.vx > 0) e.x = pl.x - e.w;
                else if (e.vx < 0) e.x = pl.x + pl.w;
                e.vx = -e.vx;
              }
            }
          }

          // Patrol range turn
          if (e.x < e.patrolMin) { e.x = e.patrolMin; e.vx = Math.abs(e.vx); }
          if (e.x + e.w > e.patrolMax) { e.x = e.patrolMax - e.w; e.vx = -Math.abs(e.vx); }

          // Edge turn-around (don't walk off platforms)
          if (e.onGround) {
            let edgeAhead = true;
            const checkX = e.vx > 0 ? e.x + e.w + 2 : e.x - 2;
            for (const pl of lvl.platforms) {
              if (checkX >= pl.x && checkX <= pl.x + pl.w && Math.abs((e.y + e.h) - pl.y) < 4) {
                edgeAhead = false;
                break;
              }
            }
            if (edgeAhead) e.vx = -e.vx;
          }

          if (e.y > CH + 80) e.alive = false;

          e.walkFrame += 0.2;
        } else {
          // Flyer: horizontal back-and-forth with gentle sine wave
          e.x += e.vx;
          if (e.x < e.patrolMin) { e.x = e.patrolMin; e.vx = Math.abs(e.vx); }
          if (e.x + e.w > e.patrolMax) { e.x = e.patrolMax - e.w; e.vx = -Math.abs(e.vx); }
          e.y = e.baseY + Math.sin(s.frame * 0.04 + e.x * 0.01) * 12;
          e.walkFrame += 0.3;
        }

        // Player-enemy collision
        if (p.alive && p.invincible <= 0) {
          const pr: Rect = { x: p.x, y: p.y, w: PLAYER_W, h: PLAYER_H };
          const er: Rect = { x: e.x, y: e.y, w: e.w, h: e.h };
          if (overlap(pr, er)) {
            // Stomp: player moving down and feet above enemy center
            if (p.vy > 1 && (p.y + PLAYER_H - p.vy) <= e.y + 6) {
              e.stomped = true; e.stompTimer = 30;
              p.vy = JUMP_VELOCITY * 0.7;
              s.score += 100;
              audioRef.current.stomp();
              spawnParticles("stomp", e.x + e.w / 2, e.y + e.h / 2, 8);
              spawnScoreText(e.x + e.w / 2, e.y - 4, "+100");
              s.camShake = 4;
            } else {
              p.invincible = 120;
              s.camShake = 6;
              audioRef.current.hit();
              // Knockback
              p.vx = p.x < e.x ? -4 : 4;
              p.vy = -6;
              s.lives--;
              if (s.lives <= 0) {
                p.alive = false;
                p.deathTimer = 60;
                audioRef.current.death();
                audioRef.current.stopMusic();
              } else {
                // Respawn at start of level after brief invincibility
                // (simpler: just apply invincibility and continue)
              }
            }
          }
        }
      }

      // Coins
      for (const c of s.coins) {
        if (c.collected) continue;
        c.frame += 0.15;
        const pr: Rect = { x: p.x, y: p.y, w: PLAYER_W, h: PLAYER_H };
        const cr: Rect = { x: c.x - 8, y: c.y - 10, w: 16, h: 20 };
        if (p.alive && overlap(pr, cr)) {
          c.collected = true;
          s.score += 10;
          audioRef.current.coin();
          spawnParticles("coinPop", c.x, c.y, 6);
        }
      }

      // Particles
      for (const pt of s.particles) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += pt.type === "score" ? 0 : 0.2;
        pt.life--;
      }
      s.particles = s.particles.filter(pt => pt.life > 0);

      // Camera follow with smoothing
      const targetCam = p.x - CW / 2 + PLAYER_W / 2;
      s.camX += (targetCam - s.camX) * 0.1;
      s.camX = Math.max(0, Math.min(s.camX, lvl.width - CW));

      // Camera shake decay
      if (s.camShake > 0) s.camShake *= 0.85;

      // Clouds
      for (const cl of s.clouds) {
        cl.x -= cl.speed;
        if (cl.x + cl.r * 2 < 0) cl.x = lvl.width + cl.r;
      }
    }
    else if (s.phase === "levelClear") {
      s.phaseTimer--;
      if (s.phaseTimer <= 0) {
        if (s.levelIdx + 1 < LEVELS.length) {
          loadLevel(s.levelIdx + 1);
          s.phase = "playing";
          const t = s.levelIdx === 0 ? "plains" : s.levelIdx === 1 ? "forest" : "castle";
          audioRef.current.startMusic(t);
        } else {
          s.phase = "gameWin";
          s.phaseTimer = 300;
          audioRef.current.gameWin();
        }
      }
    }
    else if (s.phase === "gameover" || s.phase === "gameWin") {
      if (s.phaseTimer > 0) s.phaseTimer--;
    }

    // ============================================================
    // DRAW
    // ============================================================

    const shakeX = s.camShake > 0.5 ? (Math.random() - 0.5) * s.camShake * 2 : 0;
    const shakeY = s.camShake > 0.5 ? (Math.random() - 0.5) * s.camShake * 2 : 0;

    // Sky gradient
    const theme = lvl.theme;
    const sky = ctx.createLinearGradient(0, 0, 0, CH);
    sky.addColorStop(0, theme.skyTop);
    sky.addColorStop(1, theme.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CW, CH);

    // Mountains (parallax layer 1)
    ctx.fillStyle = theme.mountain;
    const camP1 = s.camX * 0.2;
    for (let i = 0; i < 8; i++) {
      const mx = i * 280 - (camP1 % 280);
      ctx.beginPath();
      ctx.moveTo(mx, 220);
      ctx.lineTo(mx + 140, 80);
      ctx.lineTo(mx + 280, 220);
      ctx.closePath();
      ctx.fill();
      // Snow cap
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.moveTo(mx + 120, 110);
      ctx.lineTo(mx + 140, 80);
      ctx.lineTo(mx + 160, 110);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = theme.mountain;
    }

    // Hills (parallax layer 2)
    ctx.fillStyle = theme.hill;
    const camP2 = s.camX * 0.4;
    for (let i = 0; i < 10; i++) {
      const hx = i * 220 - (camP2 % 220);
      ctx.beginPath();
      ctx.ellipse(hx + 110, 270, 150, 70, 0, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    // Clouds
    for (const cl of s.clouds) {
      const cx = cl.x - s.camX * 0.3;
      if (cx + cl.r * 3 < 0 || cx - cl.r > CW) continue;
      ctx.fillStyle = theme.cloudColor;
      ctx.beginPath();
      ctx.arc(cx, cl.y, cl.r, 0, Math.PI * 2);
      ctx.arc(cx + cl.r * 0.7, cl.y - cl.r * 0.3, cl.r * 0.7, 0, Math.PI * 2);
      ctx.arc(cx - cl.r * 0.6, cl.y - cl.r * 0.2, cl.r * 0.6, 0, Math.PI * 2);
      ctx.arc(cx + cl.r * 1.3, cl.y + cl.r * 0.1, cl.r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // World space
    ctx.save();
    ctx.translate(-Math.round(s.camX + shakeX), -Math.round(shakeY));

    // Platforms
    for (const pl of lvl.platforms) {
      // Skip off-screen
      if (pl.x + pl.w < s.camX - 32 || pl.x > s.camX + CW + 32) continue;

      // Body
      ctx.fillStyle = theme.platformBody;
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);

      // Top strip
      ctx.fillStyle = theme.platformTop;
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h > 24 ? 12 : 8);

      // Top highlight
      ctx.fillStyle = theme.brickHighlight;
      ctx.fillRect(pl.x, pl.y, pl.w, 3);

      // Edge shadow
      ctx.fillStyle = theme.platformEdge;
      ctx.fillRect(pl.x, pl.y + pl.h - 3, pl.w, 3);
      ctx.fillRect(pl.x, pl.y, 2, pl.h);
      ctx.fillRect(pl.x + pl.w - 2, pl.y, 2, pl.h);

      // Pattern on tall ground platforms
      if (pl.h >= 40) {
        if (theme.platformPattern === "brick") {
          ctx.fillStyle = theme.platformEdge;
          for (let by = pl.y + 14; by < pl.y + pl.h - 2; by += 10) {
            ctx.fillRect(pl.x + 2, by, pl.w - 4, 1);
            const offset = ((by - pl.y) / 10) % 2 === 0 ? 0 : 20;
            for (let bx = pl.x + offset; bx < pl.x + pl.w; bx += 40) {
              ctx.fillRect(bx, by - 9, 1, 9);
            }
          }
        } else if (theme.platformPattern === "stone") {
          ctx.fillStyle = theme.platformEdge;
          for (let by = pl.y + 14; by < pl.y + pl.h - 2; by += 14) {
            for (let bx = pl.x + 2; bx < pl.x + pl.w; bx += 24) {
              ctx.strokeStyle = theme.platformEdge;
              ctx.lineWidth = 1;
              ctx.strokeRect(bx, by, 22, 12);
            }
          }
        } else {
          // Grass pattern: dirt dots
          ctx.fillStyle = theme.platformEdge;
          for (let by = pl.y + 20; by < pl.y + pl.h - 4; by += 16) {
            for (let bx = pl.x + 10; bx < pl.x + pl.w - 10; bx += 24) {
              ctx.fillRect(bx, by, 3, 3);
            }
          }
        }
      }
    }

    // Coins
    for (const c of s.coins) {
      if (c.collected) continue;
      if (c.x < s.camX - 20 || c.x > s.camX + CW + 20) continue;
      const scaleX = Math.cos(c.frame);
      const w = Math.abs(scaleX) * 14 + 2;
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(c.x, c.y + 12, 6, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Coin body
      ctx.fillStyle = scaleX > 0 ? "#FFD700" : "#cc9900";
      drawRoundRect(ctx, c.x - w / 2, c.y - 10, w, 20, 3);
      ctx.fill();
      ctx.strokeStyle = "#806000";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Shine
      if (scaleX > 0.3) {
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillRect(c.x - w / 2 + 2, c.y - 8, Math.max(1, w / 3), 10);
      }
    }

    // Flag
    {
      const fx = lvl.flagX;
      ctx.fillStyle = "#999";
      ctx.fillRect(fx + 14, 110, 4, 170);
      // Flag wave
      ctx.fillStyle = "#ff3333";
      const wave = Math.sin(s.frame * 0.1) * 2;
      ctx.beginPath();
      ctx.moveTo(fx + 18, 110);
      ctx.lineTo(fx + 58 + wave, 128);
      ctx.lineTo(fx + 18, 146);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffff66";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("★", fx + 30, 134);
      // Base
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(fx + 16, 108, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Enemies
    for (const e of s.enemies) {
      if (!e.alive) continue;
      if (e.x + e.w < s.camX - 20 || e.x > s.camX + CW + 20) continue;
      const ex = Math.round(e.x), ey = Math.round(e.y);

      if (e.stomped) {
        ctx.fillStyle = "#cc2200";
        ctx.fillRect(ex, ey + e.h - 6, e.w, 6);
        ctx.fillStyle = "#8B2500";
        ctx.fillRect(ex + 2, ey + e.h - 4, e.w - 4, 2);
        continue;
      }

      if (e.type === "walker") {
        // Body (red mushroom-like creature)
        ctx.fillStyle = "#cc2200";
        ctx.beginPath();
        ctx.ellipse(ex + e.w / 2, ey + 20, 14, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        // Cap
        ctx.fillStyle = "#8B2500";
        ctx.beginPath();
        ctx.arc(ex + e.w / 2, ey + 12, 13, Math.PI, Math.PI * 2);
        ctx.fill();
        // Cap spots
        ctx.fillStyle = "#ffccaa";
        ctx.beginPath();
        ctx.arc(ex + 8, ey + 6, 2.5, 0, Math.PI * 2);
        ctx.arc(ex + 22, ey + 6, 2.5, 0, Math.PI * 2);
        ctx.arc(ex + 15, ey + 3, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ex + 10, ey + 13, 4, 0, Math.PI * 2);
        ctx.arc(ex + 20, ey + 13, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#111";
        const pupilOff = e.vx < 0 ? -1.5 : 1.5;
        ctx.beginPath();
        ctx.arc(ex + 10 + pupilOff, ey + 13, 2, 0, Math.PI * 2);
        ctx.arc(ex + 20 + pupilOff, ey + 13, 2, 0, Math.PI * 2);
        ctx.fill();
        // Angry eyebrows
        ctx.strokeStyle = "#3a0a00";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ex + 6, ey + 8); ctx.lineTo(ex + 13, ey + 11);
        ctx.moveTo(ex + 17, ey + 11); ctx.lineTo(ex + 24, ey + 8);
        ctx.stroke();
        // Feet (walking animation)
        const footOff = Math.sin(e.walkFrame) * 3;
        ctx.fillStyle = "#3a0a00";
        ctx.fillRect(ex + 4, ey + 26 + footOff, 8, 5);
        ctx.fillRect(ex + 18, ey + 26 - footOff, 8, 5);
      } else {
        // Flyer: bat-like enemy
        const flap = Math.sin(e.walkFrame) * 6;
        // Body
        ctx.fillStyle = "#4a1a5c";
        ctx.beginPath();
        ctx.ellipse(ex + 15, ey + 12, 9, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Wings
        ctx.fillStyle = "#2d0f3a";
        ctx.beginPath();
        ctx.moveTo(ex + 15, ey + 10);
        ctx.quadraticCurveTo(ex - 2, ey + 4 - flap, ex - 4, ey + 12 - flap);
        ctx.quadraticCurveTo(ex + 5, ey + 14, ex + 15, ey + 12);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(ex + 15, ey + 10);
        ctx.quadraticCurveTo(ex + 32, ey + 4 - flap, ex + 34, ey + 12 - flap);
        ctx.quadraticCurveTo(ex + 25, ey + 14, ex + 15, ey + 12);
        ctx.closePath();
        ctx.fill();
        // Eyes (red glowing)
        ctx.fillStyle = "#ff3333";
        ctx.beginPath();
        ctx.arc(ex + 12, ey + 10, 1.5, 0, Math.PI * 2);
        ctx.arc(ex + 18, ey + 10, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Fangs
        ctx.fillStyle = "#fff";
        ctx.fillRect(ex + 13, ey + 14, 1, 3);
        ctx.fillRect(ex + 16, ey + 14, 1, 3);
      }
    }

    // Player
    const p = s.player;
    if (p.alive || p.deathTimer > 0) {
      if (!p.alive || p.invincible % 6 < 3 || p.invincible === 0) {
        const px = Math.round(p.x), py = Math.round(p.y);
        ctx.save();
        if (p.facing === -1) {
          ctx.translate(px + PLAYER_W / 2, 0);
          ctx.scale(-1, 1);
          ctx.translate(-PLAYER_W / 2, 0);
        } else {
          ctx.translate(px, 0);
        }

        // Shadow
        if (p.alive) {
          ctx.fillStyle = "rgba(0,0,0,0.2)";
          ctx.beginPath();
          ctx.ellipse(PLAYER_W / 2, py + PLAYER_H + 1, 11, 3, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Legs
        const legSwing = p.onGround && Math.abs(p.vx) > 0.5 ? Math.sin(p.walkFrame * Math.PI) * 4 : 0;
        ctx.fillStyle = "#1a3eb8";
        ctx.fillRect(3, py + 24, 8, 12 + legSwing);
        ctx.fillRect(15, py + 24, 8, 12 - legSwing);
        // Shoes
        ctx.fillStyle = "#5a2f0c";
        ctx.fillRect(1, py + 34 + legSwing, 12, 5);
        ctx.fillRect(13, py + 34 - legSwing, 12, 5);

        // Torso (red shirt)
        ctx.fillStyle = "#e83e3e";
        ctx.fillRect(2, py + 14, 22, 12);

        // Overalls (blue straps)
        ctx.fillStyle = "#1a3eb8";
        ctx.fillRect(6, py + 14, 5, 10);
        ctx.fillRect(15, py + 14, 5, 10);
        // Button
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(8, py + 19, 2, 2);
        ctx.fillRect(17, py + 19, 2, 2);

        // Arms
        const armSwing = p.onGround && Math.abs(p.vx) > 0.5 ? Math.sin(p.walkFrame * Math.PI + Math.PI) * 3 : 0;
        ctx.fillStyle = "#e83e3e";
        ctx.fillRect(-2, py + 14 + armSwing, 6, 10);
        ctx.fillRect(22, py + 14 - armSwing, 6, 10);
        // Hands
        ctx.fillStyle = "#f0c0a0";
        ctx.fillRect(-2, py + 22 + armSwing, 6, 4);
        ctx.fillRect(22, py + 22 - armSwing, 6, 4);

        // Head
        ctx.fillStyle = "#f0c0a0";
        ctx.fillRect(4, py + 2, 18, 14);
        // Ear
        ctx.fillRect(3, py + 8, 2, 4);

        // Mustache
        ctx.fillStyle = "#4a2800";
        ctx.fillRect(5, py + 12, 7, 3);
        ctx.fillRect(13, py + 12, 7, 3);
        // Nose
        ctx.fillStyle = "#d89880";
        ctx.fillRect(11, py + 9, 4, 4);

        // Eye
        ctx.fillStyle = "#fff";
        ctx.fillRect(14, py + 6, 4, 4);
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(15, py + 6, 2, 4);

        // Hat
        ctx.fillStyle = "#cc0000";
        ctx.fillRect(2, py + 2, 22, 4);
        ctx.fillRect(6, py - 5, 14, 8);
        // Hat logo circle
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(13, py, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#cc0000";
        ctx.font = "bold 7px sans-serif";
        ctx.fillText("J", 10.5, py + 2.5);

        ctx.restore();
      }
    }

    // Particles
    for (const pt of s.particles) {
      const alpha = pt.life / pt.maxLife;
      if (pt.type === "score" && pt.text) {
        ctx.fillStyle = `rgba(255,255,100,${alpha})`;
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.lineWidth = 3;
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.strokeText(pt.text, pt.x, pt.y);
        ctx.fillText(pt.text, pt.x, pt.y);
        ctx.textAlign = "left";
      } else {
        ctx.fillStyle = pt.color.startsWith("rgb") ? pt.color : pt.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    ctx.restore();

    // ============================================================
    // HUD
    // ============================================================

    if (s.phase === "playing" || s.phase === "levelClear") {
      // Lives
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      drawRoundRect(ctx, 8, 8, 86, 26, 6);
      ctx.fill();
      ctx.font = "bold 14px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.fillText(`♥ × ${s.lives}`, 16, 26);

      // Score
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      drawRoundRect(ctx, CW - 128, 8, 120, 26, 6);
      ctx.fill();
      ctx.fillStyle = "#FFD700";
      ctx.textAlign = "right";
      ctx.fillText(`🪙 ${String(s.score).padStart(5, "0")}`, CW - 14, 26);
      ctx.textAlign = "left";

      // Level name
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      drawRoundRect(ctx, CW / 2 - 80, 8, 160, 26, 6);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`LEVEL ${s.levelIdx + 1} — ${lvl.name}`, CW / 2, 25);

      // Progress bar
      const pct = Math.min(p.x / (lvl.width - 200), 1);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      drawRoundRect(ctx, CW / 2 - 70, 40, 140, 6, 3);
      ctx.fill();
      ctx.fillStyle = "#4ade80";
      drawRoundRect(ctx, CW / 2 - 70, 40, 140 * pct, 6, 3);
      ctx.fill();

      ctx.textAlign = "left";
    }

    // ============================================================
    // OVERLAYS
    // ============================================================

    if (s.phase === "title") {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, CW, CH);

      // Animated title
      ctx.textAlign = "center";
      const titleY = 90 + Math.sin(s.frame * 0.05) * 3;
      ctx.fillStyle = "#FFD700";
      ctx.strokeStyle = "#5a2d00";
      ctx.lineWidth = 4;
      ctx.font = "bold 42px sans-serif";
      ctx.strokeText("SUPER JUMPER", CW / 2, titleY);
      ctx.fillText("SUPER JUMPER", CW / 2, titleY);

      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText("A Platform Adventure", CW / 2, titleY + 22);

      ctx.fillStyle = "#aaa";
      ctx.font = "12px sans-serif";
      ctx.fillText("← → / A D  to move", CW / 2, 170);
      ctx.fillText("↑ / Space / W  to jump", CW / 2, 186);
      ctx.fillText("Stomp enemies · Collect coins · Reach the flag", CW / 2, 202);
      ctx.fillText(`${LEVELS.length} levels · Audio & mobile controls`, CW / 2, 218);

      if (Math.floor(s.frame / 25) % 2 === 0) {
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText("▶ Tap / Press any key to START", CW / 2, 260);
      }

      ctx.textAlign = "left";
    }

    if (s.phase === "levelClear") {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, CW, CH);
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText(`LEVEL ${s.levelIdx + 1} CLEAR!`, CW / 2, 130);
      ctx.fillStyle = "#fff";
      ctx.font = "18px sans-serif";
      ctx.fillText(`Score: ${s.score}`, CW / 2, 165);
      ctx.font = "14px sans-serif";
      ctx.fillStyle = "#4ade80";
      if (s.levelIdx + 1 < LEVELS.length) {
        ctx.fillText(`Next: ${LEVELS[s.levelIdx + 1].name}`, CW / 2, 195);
      }
      ctx.textAlign = "left";
    }

    if (s.phase === "gameover") {
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(0, 0, CW, CH);
      ctx.textAlign = "center";
      ctx.fillStyle = "#ff4444";
      ctx.font = "bold 40px sans-serif";
      ctx.fillText("GAME OVER", CW / 2, 110);
      ctx.fillStyle = "#FFD700";
      ctx.font = "20px sans-serif";
      ctx.fillText(`Final Score: ${s.score}`, CW / 2, 150);
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText("Tap / press any key to try again", CW / 2, 190);
      ctx.textAlign = "left";
    }

    if (s.phase === "gameWin") {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, CW, CH);
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 38px sans-serif";
      ctx.fillText("🏆 YOU WIN! 🏆", CW / 2, 100);
      ctx.fillStyle = "#fff";
      ctx.font = "22px sans-serif";
      ctx.fillText(`Final Score: ${s.score}`, CW / 2, 140);
      ctx.fillStyle = "#4ade80";
      ctx.font = "14px sans-serif";
      ctx.fillText("You beat all 3 levels!", CW / 2, 165);
      ctx.fillStyle = "#aaa";
      ctx.fillText("Tap / press any key to play again", CW / 2, 200);
      ctx.textAlign = "left";
    }

    if (paused && s.phase === "playing") {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, CW, CH);
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("⏸ PAUSED", CW / 2, CH / 2);
      ctx.textAlign = "left";
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [paused]);

  // ============================================================
  // KEYBOARD + LIFECYCLE
  // ============================================================

  useEffect(() => {
    const s = stateRef.current;

    const keyDown = (e: KeyboardEvent) => {
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
      s.keys[e.key] = true;
      audioRef.current.init();
      audioRef.current.resume();
      if (s.phase === "title") {
        startGame();
      } else if (s.phase === "gameover" || s.phase === "gameWin") {
        if (s.phaseTimer <= 0) {
          s.phase = "title";
        }
      }
    };
    const keyUp = (e: KeyboardEvent) => { s.keys[e.key] = false; };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      cancelAnimationFrame(rafRef.current);
      audioRef.current.stopMusic();
    };
  }, [tick]);

  useEffect(() => {
    audioRef.current.setEnabled(soundOn);
  }, [soundOn]);

  // Touch control helper
  function setTouch(field: "left" | "right" | "jump", v: boolean) {
    const s = stateRef.current;
    s.touch[field] = v;
    if (v) {
      audioRef.current.init();
      audioRef.current.resume();
      if (s.phase === "title") startGame();
      else if ((s.phase === "gameover" || s.phase === "gameWin") && s.phaseTimer <= 0) {
        s.phase = "title";
      }
    }
  }

  const btn =
    "select-none touch-none active:scale-90 transition-transform " +
    "flex items-center justify-center rounded-2xl text-white font-bold shadow-lg";

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top bar with sound + pause */}
      <div className="flex items-center justify-between w-full max-w-[512px] mb-2 px-1">
        <button
          onClick={() => setSoundOn(v => !v)}
          className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors select-none"
        >
          {soundOn ? "🔊 Sound" : "🔇 Muted"}
        </button>
        <button
          onClick={() => setPaused(v => !v)}
          className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors select-none"
        >
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        className="w-full max-w-[512px] rounded-xl border-2 border-gray-700 block shadow-2xl"
        style={{ imageRendering: "pixelated", touchAction: "none", aspectRatio: `${CW}/${CH}` }}
      />

      {/* Mobile controls */}
      <div className="flex items-center justify-between w-full max-w-[512px] mt-3 px-2 gap-2">
        <div className="flex gap-2">
          <button
            className={`${btn} w-16 h-16 bg-gray-700/90 text-2xl`}
            onPointerDown={(e) => { e.preventDefault(); setTouch("left", true); }}
            onPointerUp={(e) => { e.preventDefault(); setTouch("left", false); }}
            onPointerCancel={() => setTouch("left", false)}
            onPointerLeave={() => setTouch("left", false)}
          >◀</button>
          <button
            className={`${btn} w-16 h-16 bg-gray-700/90 text-2xl`}
            onPointerDown={(e) => { e.preventDefault(); setTouch("right", true); }}
            onPointerUp={(e) => { e.preventDefault(); setTouch("right", false); }}
            onPointerCancel={() => setTouch("right", false)}
            onPointerLeave={() => setTouch("right", false)}
          >▶</button>
        </div>
        <button
          className={`${btn} w-24 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-lg`}
          onPointerDown={(e) => { e.preventDefault(); setTouch("jump", true); }}
          onPointerUp={(e) => { e.preventDefault(); setTouch("jump", false); }}
          onPointerCancel={() => setTouch("jump", false)}
          onPointerLeave={() => setTouch("jump", false)}
        >JUMP</button>
      </div>
    </div>
  );
}
