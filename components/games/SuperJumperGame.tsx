"use client";
import { useEffect, useRef, useCallback } from "react";

// ── Canvas dimensions ──────────────────────────────────────────────────────
const CW = 480, CH = 320;
const GRAVITY    = 0.55;
const JUMP_FORCE = -12.5;
const MOVE_SPEED = 3.8;
const LEVEL_W    = 5200;

// ── Types ──────────────────────────────────────────────────────────────────
interface Rect  { x: number; y: number; w: number; h: number; }
interface Enemy { x: number; y: number; w: number; h: number; vx: number; vy: number; alive: boolean; stomped: boolean; stompTimer: number; onGround: boolean; }
interface Coin  { x: number; y: number; collected: boolean; frame: number; }
interface Cloud { x: number; y: number; r: number; speed: number; }

function overlap(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ── Level data ─────────────────────────────────────────────────────────────
const PLATFORMS: Rect[] = [
  // === ZONE 1: gentle start ===
  { x: 0,    y: 272, w: 740,  h: 48 },
  { x: 200,  y: 216, w: 96,   h: 16 },
  { x: 380,  y: 192, w: 96,   h: 16 },
  { x: 560,  y: 216, w: 96,   h: 16 },

  // === ZONE 2 (gap 740-840) ===
  { x: 840,  y: 272, w: 680,  h: 48 },
  { x: 900,  y: 208, w: 112,  h: 16 },
  { x: 1080, y: 176, w: 96,   h: 16 },
  { x: 1260, y: 208, w: 96,   h: 16 },
  { x: 1400, y: 240, w: 80,   h: 16 },

  // === ZONE 3 (gap 1520-1640) ===
  { x: 1640, y: 272, w: 560,  h: 48 },
  { x: 1700, y: 200, w: 80,   h: 16 },
  { x: 1860, y: 168, w: 96,   h: 16 },
  { x: 2040, y: 200, w: 96,   h: 16 },

  // === ZONE 4 (gap 2200-2320) ===
  { x: 2320, y: 272, w: 560,  h: 48 },
  { x: 2380, y: 208, w: 80,   h: 16 },
  { x: 2520, y: 176, w: 80,   h: 16 },
  { x: 2660, y: 144, w: 80,   h: 16 },
  { x: 2800, y: 176, w: 80,   h: 16 },

  // === ZONE 5 (gap 2880-3000) ===
  { x: 3000, y: 272, w: 720,  h: 48 },
  { x: 3060, y: 208, w: 96,   h: 16 },
  { x: 3240, y: 176, w: 96,   h: 16 },
  { x: 3440, y: 208, w: 96,   h: 16 },
  { x: 3600, y: 240, w: 80,   h: 16 },

  // === ZONE 6 (gap 3720-3840) — final run ===
  { x: 3840, y: 272, w: LEVEL_W - 3840, h: 48 },
  { x: 3900, y: 208, w: 96,   h: 16 },
  { x: 4080, y: 176, w: 96,   h: 16 },
  { x: 4260, y: 208, w: 96,   h: 16 },
  { x: 4500, y: 240, w: 80,   h: 16 },
];

function makeCoin(x: number, y: number): Coin { return { x, y, collected: false, frame: 0 }; }
function makeEnemy(x: number): Enemy {
  return { x, y: 232, w: 32, h: 32, vx: -1.2, vy: 0, alive: true, stomped: false, stompTimer: 0, onGround: false };
}

const COIN_DEFS: [number, number][] = [
  // Zone 1
  [120,240],[155,240],[190,240], [210,185],[245,185],[280,185],
  [390,162],[425,162], [570,185],[605,185],
  // Zone 2
  [860,240],[895,240], [910,178],[945,178],[980,178],
  [1085,146],[1120,146],[1155,146], [1265,178],[1300,178],
  // Zone 3
  [1660,240],[1695,240],[1730,240],
  [1705,170],[1740,170], [1865,138],[1900,138],[1935,138],
  // Zone 4
  [2335,240],[2370,240],[2405,240],
  [2385,178],[2420,178], [2525,146],[2560,146],
  [2665,114],[2700,114], [2805,146],[2840,146],
  // Zone 5
  [3010,240],[3045,240],
  [3065,178],[3100,178],[3135,178],
  [3245,146],[3280,146], [3445,178],[3480,178],
  // Zone 6
  [3850,240],[3885,240],[3920,240],
  [3905,178],[3940,178], [4085,146],[4120,146],
  [4265,178],[4300,178], [4510,210],[4545,210],
];

const ENEMY_DEFS: number[] = [
  350, 600, 950, 1180, 1320,
  1750, 1980, 2120,
  2450, 2610, 2820,
  3090, 3340, 3550,
  3960, 4200, 4400,
];

// ── Drawing helpers ────────────────────────────────────────────────────────
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

// ── Main component ─────────────────────────────────────────────────────────
export default function SuperJumperGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<{
    phase: "title" | "playing" | "gameover" | "win";
    px: number; py: number; pvx: number; pvy: number;
    onGround: boolean; facing: number; animTick: number;
    lives: number; score: number; invincible: number;
    camX: number;
    enemies: Enemy[];
    coins: Coin[];
    clouds: Cloud[];
    keys: Record<string, boolean>;
    touchLeft: boolean; touchRight: boolean; touchJump: boolean;
    justJumped: boolean;
    flagReached: boolean;
    frame: number;
  }>({
    phase: "title",
    px: 60, py: 232, pvx: 0, pvy: 0,
    onGround: false, facing: 1, animTick: 0,
    lives: 3, score: 0, invincible: 0,
    camX: 0,
    enemies: ENEMY_DEFS.map(makeEnemy),
    coins: COIN_DEFS.map(([x, y]) => makeCoin(x, y)),
    clouds: Array.from({ length: 12 }, (_, i) => ({
      x: i * 440 + 80, y: 30 + Math.random() * 60, r: 32 + Math.random() * 28, speed: 0.2 + Math.random() * 0.15,
    })),
    keys: {},
    touchLeft: false, touchRight: false, touchJump: false,
    justJumped: false,
    flagReached: false,
    frame: 0,
  });
  const rafRef = useRef<number>(0);

  function resetGame() {
    const s = stateRef.current;
    s.phase = "playing";
    s.px = 60; s.py = 232; s.pvx = 0; s.pvy = 0;
    s.onGround = false; s.facing = 1; s.animTick = 0;
    s.lives = 3; s.score = 0; s.invincible = 0;
    s.camX = 0;
    s.enemies = ENEMY_DEFS.map(makeEnemy);
    s.coins = COIN_DEFS.map(([x, y]) => makeCoin(x, y));
    s.flagReached = false;
    s.frame = 0;
  }

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    s.frame++;

    // ── UPDATE ─────────────────────────────────────────────────────────
    if (s.phase === "playing") {
      const left  = s.keys["ArrowLeft"]  || s.keys["a"] || s.keys["A"] || s.touchLeft;
      const right = s.keys["ArrowRight"] || s.keys["d"] || s.keys["D"] || s.touchRight;
      const jump  = s.keys["ArrowUp"] || s.keys["w"] || s.keys["W"] || s.keys[" "] || s.touchJump;

      // Horizontal
      if (left)  { s.pvx = -MOVE_SPEED; s.facing = -1; }
      else if (right) { s.pvx =  MOVE_SPEED; s.facing =  1; }
      else { s.pvx *= 0.7; }

      // Jump
      if (jump && s.onGround && !s.justJumped) {
        s.pvy = JUMP_FORCE;
        s.onGround = false;
        s.justJumped = true;
      }
      if (!jump) s.justJumped = false;

      // Gravity
      s.pvy += GRAVITY;
      if (s.pvy > 16) s.pvy = 16;

      // Move X, collide platforms
      s.px += s.pvx;
      s.px = Math.max(0, Math.min(s.px, LEVEL_W - 28));
      const pRect: Rect = { x: s.px, y: s.py, w: 28, h: 36 };
      for (const pl of PLATFORMS) {
        if (overlap(pRect, pl)) {
          if (s.pvx > 0) s.px = pl.x - 28;
          else if (s.pvx < 0) s.px = pl.x + pl.w;
          s.pvx = 0;
        }
      }

      // Move Y, collide platforms
      s.py += s.pvy;
      s.onGround = false;
      const pRectY: Rect = { x: s.px + 2, y: s.py, w: 24, h: 36 };
      for (const pl of PLATFORMS) {
        if (overlap(pRectY, pl)) {
          if (s.pvy > 0) {
            s.py = pl.y - 36;
            s.pvy = 0;
            s.onGround = true;
          } else if (s.pvy < 0) {
            s.py = pl.y + pl.h;
            s.pvy = 0;
          }
        }
      }

      // Fall into pit
      if (s.py > CH + 60) {
        s.lives--;
        if (s.lives <= 0) { s.phase = "gameover"; }
        else { s.px = 60; s.py = 232; s.pvx = 0; s.pvy = 0; s.invincible = 120; s.camX = 0; }
      }

      // Camera
      const targetCam = s.px - CW / 3;
      s.camX += (targetCam - s.camX) * 0.12;
      s.camX = Math.max(0, Math.min(s.camX, LEVEL_W - CW));

      // Coins
      for (const c of s.coins) {
        if (!c.collected) {
          c.frame++;
          const cr: Rect = { x: c.x - 8, y: c.y - 8, w: 16, h: 16 };
          if (overlap(pRect, cr)) { c.collected = true; s.score += 10; }
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

        // Enemy physics
        e.vy += GRAVITY;
        e.x  += e.vx;
        e.y  += e.vy;
        e.onGround = false;
        const er: Rect = { x: e.x, y: e.y, w: e.w, h: e.h };

        for (const pl of PLATFORMS) {
          if (overlap({ x: e.x, y: e.y, w: e.w, h: e.h }, pl)) {
            if (e.vy > 0 && e.y + e.h - e.vy <= pl.y + 4) {
              e.y = pl.y - e.h; e.vy = 0; e.onGround = true;
            } else if (e.vy < 0) {
              e.y = pl.y + pl.h; e.vy = 0;
            } else {
              e.vx = -e.vx; e.x += e.vx * 2;
            }
          }
        }

        // Fall off world
        if (e.y > CH + 80) { e.alive = false; continue; }

        // Patrol turn at platform edges
        if (e.onGround) {
          let edgeAhead = true;
          for (const pl of PLATFORMS) {
            const checkX = e.vx > 0 ? e.x + e.w + 4 : e.x - 4;
            if (checkX >= pl.x && checkX <= pl.x + pl.w && Math.abs((e.y + e.h) - pl.y) < 8) {
              edgeAhead = false; break;
            }
          }
          if (edgeAhead) e.vx = -e.vx;
        }

        // Player-enemy collision
        if (s.invincible <= 0 && overlap(pRect, er)) {
          // Stomp from above?
          const playerBottom = s.py + 36;
          const prevBottom   = playerBottom - s.pvy;
          if (prevBottom <= e.y + 8 && s.pvy > 0) {
            e.stomped = true; e.stompTimer = 30;
            s.pvy = JUMP_FORCE * 0.6;
            s.score += 50;
          } else {
            // Hit player
            s.lives--;
            s.invincible = 120;
            if (s.lives <= 0) s.phase = "gameover";
            else { s.pvx = s.facing * -3; s.pvy = -6; }
          }
        }
      }

      if (s.invincible > 0) s.invincible--;

      // Win flag at end
      const flagX = LEVEL_W - 100;
      if (s.px + 28 >= flagX && !s.flagReached) {
        s.flagReached = true;
        s.score += 500;
        s.phase = "win";
      }

      s.animTick++;
    }

    // ── DRAW ───────────────────────────────────────────────────────────
    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, CH);
    sky.addColorStop(0, "#87CEEB");
    sky.addColorStop(1, "#c9e8ff");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CW, CH);

    // Clouds
    for (const cl of s.clouds) {
      if (s.phase === "playing") cl.x -= cl.speed;
      if (cl.x + cl.r * 2 < 0) cl.x = CW + cl.r;
      const cx = cl.x - (s.phase === "playing" ? s.camX * 0.15 : 0);
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.beginPath();
      ctx.arc(cx, cl.y, cl.r, 0, Math.PI * 2);
      ctx.arc(cx + cl.r * 0.7, cl.y - cl.r * 0.3, cl.r * 0.7, 0, Math.PI * 2);
      ctx.arc(cx - cl.r * 0.6, cl.y - cl.r * 0.2, cl.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    if (s.phase === "playing" || s.phase === "gameover" || s.phase === "win") {
      ctx.save();
      ctx.translate(-Math.round(s.camX), 0);

      // Platforms
      for (const pl of PLATFORMS) {
        // Body
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(pl.x, pl.y + (pl.h > 24 ? 8 : 0), pl.w, pl.h - (pl.h > 24 ? 8 : 0));
        // Green top
        ctx.fillStyle = "#2d8a2d";
        ctx.fillRect(pl.x, pl.y, pl.w, pl.h > 24 ? 10 : 8);
        // Highlight
        ctx.fillStyle = "#4db84d";
        ctx.fillRect(pl.x, pl.y, pl.w, 3);
        // Brick pattern on tall platforms
        if (pl.h >= 40) {
          ctx.fillStyle = "#7a3a0a";
          for (let bx = pl.x; bx < pl.x + pl.w; bx += 48) {
            ctx.fillRect(bx, pl.y + 16, 1, pl.h - 16);
          }
          ctx.fillRect(pl.x, pl.y + 28, pl.w, 2);
        }
      }

      // Coins
      for (const c of s.coins) {
        if (c.collected) continue;
        const scaleX = Math.cos(c.frame * 0.1);
        const w = Math.abs(scaleX) * 12 + 2;
        ctx.fillStyle = "#FFD700";
        ctx.strokeStyle = "#cc9900";
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, c.x - w / 2, c.y - 9, w, 18, 3);
        ctx.fill(); ctx.stroke();
        // Shine
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        drawRoundRect(ctx, c.x - w / 2 + 1, c.y - 7, Math.max(1, w / 3), 8, 1);
        ctx.fill();
      }

      // Flag at end
      const flagX = LEVEL_W - 100;
      ctx.fillStyle = "#888";
      ctx.fillRect(flagX + 12, 140, 4, 136);
      ctx.fillStyle = "#ff3333";
      ctx.beginPath();
      ctx.moveTo(flagX + 16, 140);
      ctx.lineTo(flagX + 48, 155);
      ctx.lineTo(flagX + 16, 170);
      ctx.closePath();
      ctx.fill();
      ctx.font = "20px serif";
      ctx.fillText("🏁", flagX, 285);

      // Enemies
      for (const e of s.enemies) {
        if (!e.alive) continue;
        const ex = Math.round(e.x), ey = Math.round(e.y);
        if (e.stomped) {
          // Flattened
          ctx.fillStyle = "#cc2200";
          ctx.fillRect(ex, ey + 24, e.w, 8);
          continue;
        }
        // Body
        ctx.fillStyle = "#cc2200";
        ctx.beginPath();
        ctx.ellipse(ex + 16, ey + 22, 15, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        // Head / cap
        ctx.fillStyle = "#8B2500";
        ctx.beginPath();
        ctx.arc(ex + 16, ey + 14, 13, Math.PI, Math.PI * 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = "white";
        ctx.beginPath(); ctx.arc(ex + 11, ey + 13, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + 21, ey + 13, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = e.vx < 0 ? "#111" : "#111";
        // Angry pupils lean toward direction of travel
        const pupilOff = e.vx < 0 ? -1 : 1;
        ctx.beginPath(); ctx.arc(ex + 11 + pupilOff, ey + 14, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + 21 + pupilOff, ey + 14, 2, 0, Math.PI * 2); ctx.fill();
        // Feet (walking animation)
        const footOff = Math.sin(s.frame * 0.25) * 4;
        ctx.fillStyle = "#8B2500";
        ctx.fillRect(ex + 4, ey + 28 + footOff, 8, 6);
        ctx.fillRect(ex + 20, ey + 28 - footOff, 8, 6);
      }

      // Player
      if (s.phase === "playing" || s.invincible % 6 < 3) {
        const px = Math.round(s.px), py = Math.round(s.py);
        ctx.save();
        if (s.facing === -1) {
          ctx.translate(px + 14, 0);
          ctx.scale(-1, 1);
          ctx.translate(-14, 0);
        }

        // Shadow
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.beginPath();
        ctx.ellipse(px + 14, py + 37, 12, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs (walking animation)
        const legSwing = s.onGround && (s.pvx !== 0) ? Math.sin(s.animTick * 0.3) * 5 : 0;
        ctx.fillStyle = "#1a56db";
        ctx.fillRect(px + 4,  py + 24, 9, 14 + legSwing);
        ctx.fillRect(px + 15, py + 24, 9, 14 - legSwing);
        // Shoes
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(px + 2,  py + 36 + legSwing,  12, 6);
        ctx.fillRect(px + 14, py + 36 - legSwing, 12, 6);

        // Body
        ctx.fillStyle = "#e83e3e";
        ctx.fillRect(px + 2, py + 14, 24, 14);
        // Overalls strap
        ctx.fillStyle = "#1a56db";
        ctx.fillRect(px + 8,  py + 14, 6, 10);
        ctx.fillRect(px + 14, py + 14, 6, 10);

        // Arms
        const armSwing = s.onGround && (s.pvx !== 0) ? Math.sin(s.animTick * 0.3) * 4 : 0;
        ctx.fillStyle = "#e83e3e";
        ctx.fillRect(px - 4, py + 14 + armSwing, 8, 8);
        ctx.fillRect(px + 24, py + 14 - armSwing, 8, 8);

        // Head/skin
        ctx.fillStyle = "#FDBCB4";
        ctx.fillRect(px + 4, py + 2, 20, 16);
        // Mustache
        ctx.fillStyle = "#4a2800";
        ctx.fillRect(px + 6,  py + 13, 7, 3);
        ctx.fillRect(px + 15, py + 13, 7, 3);
        // Eye
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(px + 16, py + 7, 4, 4);
        ctx.fillStyle = "white";
        ctx.fillRect(px + 17, py + 7, 2, 2);

        // Hat
        ctx.fillStyle = "#cc0000";
        ctx.fillRect(px + 2,  py + 2,  24, 5);
        ctx.fillRect(px + 6,  py - 6,  16, 10);
        ctx.fillStyle = "#fff";
        ctx.fillRect(px + 10, py - 4,  8,  3);

        ctx.restore();
      }

      ctx.restore(); // un-translate camera
    }

    // ── HUD ─────────────────────────────────────────────────────────────
    if (s.phase === "playing") {
      // Lives
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      drawRoundRect(ctx, 6, 6, 90, 28, 6); ctx.fill();
      ctx.font = "bold 13px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.fillText(`❤️ × ${s.lives}`, 14, 25);

      // Score
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      drawRoundRect(ctx, CW - 110, 6, 104, 28, 6); ctx.fill();
      ctx.fillStyle = "#FFD700";
      ctx.textAlign = "right";
      ctx.fillText(`🪙 ${s.score}`, CW - 10, 25);
      ctx.textAlign = "left";

      // Progress bar
      const pct = Math.min(s.px / (LEVEL_W - 200), 1);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(CW / 2 - 70, 10, 140, 8);
      ctx.fillStyle = "#4ade80";
      ctx.fillRect(CW / 2 - 70, 10, 140 * pct, 8);
      ctx.fillStyle = "#fff";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🏁", CW / 2 + 70, 18);
      ctx.textAlign = "left";
    }

    // ── OVERLAYS ────────────────────────────────────────────────────────
    if (s.phase === "title") {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, CW, CH);
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("🎮 Super Jumper", CW / 2, 90);
      ctx.fillStyle = "#fff";
      ctx.font = "15px sans-serif";
      ctx.fillText("Collect coins · Stomp enemies · Reach the flag!", CW / 2, 126);
      ctx.font = "13px sans-serif";
      ctx.fillStyle = "#ccc";
      ctx.fillText("← → Arrow keys / A D to move   ↑ / Space to jump", CW / 2, 154);
      ctx.fillText("On mobile: use the buttons below", CW / 2, 174);
      // Blinking start
      if (Math.floor(s.frame / 25) % 2 === 0) {
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText("Tap / Press any key to start!", CW / 2, 220);
      }
      ctx.textAlign = "left";
    }

    if (s.phase === "gameover") {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, CW, CH);
      ctx.textAlign = "center";
      ctx.fillStyle = "#ff4444";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("Game Over", CW / 2, 110);
      ctx.fillStyle = "#FFD700";
      ctx.font = "18px sans-serif";
      ctx.fillText(`Score: ${s.score}`, CW / 2, 150);
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText("Tap / Press any key to try again", CW / 2, 185);
      ctx.textAlign = "left";
    }

    if (s.phase === "win") {
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(0, 0, CW, CH);
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 34px sans-serif";
      ctx.fillText("🏆 You Win!", CW / 2, 100);
      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.fillText(`Final Score: ${s.score}`, CW / 2, 140);
      ctx.font = "13px sans-serif";
      ctx.fillStyle = "#ccc";
      ctx.fillText("Tap / Press any key to play again", CW / 2, 175);
      ctx.textAlign = "left";
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const s = stateRef.current;

    const onKey = (e: KeyboardEvent, down: boolean) => {
      s.keys[e.key] = down;
      if (down && (s.phase === "title" || s.phase === "gameover" || s.phase === "win")) {
        resetGame();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
      onKey(e, true);
    };
    const onKeyUp   = (e: KeyboardEvent) => onKey(e, false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  // ── Touch controls ────────────────────────────────────────────────────
  function setTouch(field: "touchLeft" | "touchRight" | "touchJump", val: boolean) {
    const s = stateRef.current;
    s[field] = val;
    if (val && (s.phase === "title" || s.phase === "gameover" || s.phase === "win")) {
      resetGame();
    }
  }

  const btn = "select-none touch-none active:opacity-70 transition-opacity flex items-center justify-center rounded-2xl text-white font-bold text-xl shadow-lg";

  return (
    <div className="flex flex-col items-center w-full">
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        className="w-full max-w-[480px] rounded-xl border-2 border-gray-700 block"
        style={{ imageRendering: "pixelated", touchAction: "none" }}
      />

      {/* Mobile controls */}
      <div className="flex items-center justify-between w-full max-w-[480px] mt-3 px-2 gap-2">
        <div className="flex gap-2">
          <button
            className={`${btn} w-14 h-14 bg-gray-700/80`}
            onPointerDown={() => setTouch("touchLeft", true)}
            onPointerUp={() => setTouch("touchLeft", false)}
            onPointerLeave={() => setTouch("touchLeft", false)}
          >◀</button>
          <button
            className={`${btn} w-14 h-14 bg-gray-700/80`}
            onPointerDown={() => setTouch("touchRight", true)}
            onPointerUp={() => setTouch("touchRight", false)}
            onPointerLeave={() => setTouch("touchRight", false)}
          >▶</button>
        </div>
        <button
          className={`${btn} w-20 h-14 bg-blue-600`}
          onPointerDown={() => setTouch("touchJump", true)}
          onPointerUp={() => setTouch("touchJump", false)}
          onPointerLeave={() => setTouch("touchJump", false)}
        >JUMP</button>
      </div>
    </div>
  );
}
