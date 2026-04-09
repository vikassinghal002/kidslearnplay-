"use client";

import { useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic } from "@/lib/gameAudio";

const W = 480, H = 500;
const MAX_LIVES = 3;
const ASTEROID_COUNT = 6;
const SPEED_BONUS_THRESHOLD = 2; // seconds

type Phase = "menu" | "playing" | "gameover";

interface Question {
  a: number;
  b: number;
  answer: number;
}

interface Asteroid {
  x: number;
  y: number;
  radius: number;
  speed: number;
  value: number;
  wobble: number; // phase offset for shape wobble
  flashColor: string | null;
  flashTimer: number;
}

interface GameState {
  phase: Phase;
  score: number;
  bestScore: number;
  lives: number;
  correctCount: number;
  question: Question;
  asteroids: Asteroid[];
  questionStartTime: number;
  menuHover: boolean;
  gameoverHover: boolean;
}

function getDifficultyRange(correctCount: number): [number, number] {
  if (correctCount < 10) return [1, 5];
  return [1, 12];
}

function generateQuestion(correctCount: number, prev: Question | null): Question {
  const [min, max] = getDifficultyRange(correctCount);
  let a: number, b: number;
  let attempts = 0;
  do {
    a = Math.floor(Math.random() * (max - min + 1)) + min;
    b = Math.floor(Math.random() * (max - min + 1)) + min;
    attempts++;
  } while (prev && a === prev.a && b === prev.b && attempts < 10);
  return { a, b, answer: a * b };
}

function spawnAsteroid(correctAnswer: number, includeAnswer: boolean, existingValues: number[]): Asteroid {
  let value: number;
  if (includeAnswer) {
    value = correctAnswer;
  } else {
    // Wrong answer — nearby but not equal
    let candidate: number;
    let tries = 0;
    do {
      const delta = Math.floor(Math.random() * 8) + 1;
      const sign = Math.random() < 0.5 ? 1 : -1;
      candidate = Math.max(1, correctAnswer + sign * delta);
      tries++;
    } while ((candidate === correctAnswer || existingValues.includes(candidate)) && tries < 30);
    value = candidate;
  }
  return {
    x: 40 + Math.random() * (W - 80),
    y: -40 - Math.random() * 80,
    radius: 28 + Math.floor(Math.random() * 12),
    speed: 0.3 + Math.random() * 0.5,
    value,
    wobble: Math.random() * Math.PI * 2,
    flashColor: null,
    flashTimer: 0,
  };
}

function makeAsteroids(question: Question): Asteroid[] {
  const asteroids: Asteroid[] = [];
  // First asteroid always holds the correct answer
  const first = spawnAsteroid(question.answer, true, []);
  asteroids.push(first);
  const values = [question.answer];
  // Space them out vertically at start
  for (let i = 1; i < ASTEROID_COUNT; i++) {
    const a = spawnAsteroid(question.answer, false, values);
    a.y = -40 - i * 70;
    values.push(a.value);
    asteroids.push(a);
  }
  return asteroids;
}

function makeInitialState(bestScore = 0): GameState {
  const question = generateQuestion(0, null);
  return {
    phase: "menu",
    score: 0,
    bestScore,
    lives: MAX_LIVES,
    correctCount: 0,
    question,
    asteroids: makeAsteroids(question),
    questionStartTime: 0,
    menuHover: false,
    gameoverHover: false,
  };
}

// ─── Draw helpers ────────────────────────────────────────────────────────────

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

function drawStars(ctx: CanvasRenderingContext2D, t: number) {
  const stars = [
    [40, 30], [120, 80], [200, 20], [300, 60], [420, 35], [70, 150],
    [160, 190], [260, 130], [380, 170], [450, 110], [30, 260], [90, 300],
    [180, 240], [280, 290], [370, 220], [430, 280], [50, 380], [140, 420],
    [230, 370], [340, 400], [460, 360], [100, 450], [200, 460], [15, 100],
    [320, 10], [470, 480], [240, 500], [410, 490],
  ];
  for (const [sx, sy] of stars) {
    const twinkle = 0.4 + 0.3 * Math.sin(t * 2 + sx * 0.1);
    ctx.globalAlpha = twinkle;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }
  ctx.globalAlpha = 1;
}

function drawAsteroid(ctx: CanvasRenderingContext2D, a: Asteroid, isCorrect: boolean, t: number) {
  const { x, y, radius, value, wobble, flashColor, flashTimer } = a;

  ctx.save();

  // Cyan glow for correct asteroid
  if (isCorrect) {
    ctx.shadowColor = "#00ccff";
    ctx.shadowBlur = 18 + 6 * Math.sin(t * 3 + wobble);
  }

  // Flash overlay takes priority
  if (flashColor && flashTimer > 0) {
    ctx.fillStyle = flashColor;
    ctx.shadowColor = flashColor;
    ctx.shadowBlur = 24;
  } else {
    ctx.fillStyle = "#4a3728";
  }

  // Rough circle using 8-point polygon with slight wobble
  ctx.beginPath();
  const pts = 8;
  for (let i = 0; i < pts; i++) {
    const angle = (i / pts) * Math.PI * 2;
    const r = radius + 4 * Math.sin(angle * 2.5 + wobble + t * 0.6);
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // Border
  ctx.strokeStyle = (flashColor && flashTimer > 0) ? flashColor : (isCorrect ? "#00aadd" : "#8b6914");
  ctx.lineWidth = isCorrect ? 2.5 : 1.5;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Number
  ctx.font = `bold ${radius > 32 ? 18 : 15}px sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(value), x, y);
  ctx.textBaseline = "alphabetic";

  ctx.restore();
}

function drawMenu(ctx: CanvasRenderingContext2D, state: GameState, t: number) {
  ctx.fillStyle = "#000510";
  ctx.fillRect(0, 0, W, H);
  drawStars(ctx, t);

  const pulse = 0.5 + 0.5 * Math.sin(t * 2);

  ctx.font = "60px serif";
  ctx.textAlign = "center";
  ctx.fillText("🚀", W / 2, 105);

  ctx.font = "bold 30px sans-serif";
  ctx.fillStyle = "#00ccff";
  ctx.shadowColor = "#00ccff";
  ctx.shadowBlur = 8 + pulse * 10;
  ctx.fillText("Multiplication", W / 2, 158);
  ctx.fillText("Blast", W / 2, 192);
  ctx.shadowBlur = 0;

  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Shoot the correct answer!", W / 2, 226);

  if (state.bestScore > 0) {
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Best: ${state.bestScore}`, W / 2, 252);
  }

  const btnW = 200, btnH = 54;
  const btnX = (W - btnW) / 2;
  const btnY = 278;
  ctx.fillStyle = state.menuHover ? "#00aadd" : "#00ccff";
  ctx.shadowColor = "#00ccff";
  ctx.shadowBlur = state.menuHover ? 24 : 12;
  roundRect(ctx, btnX, btnY, btnW, btnH, 27);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "#000510";
  ctx.fillText("▶  Play", W / 2, btnY + 35);

  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("Tap or click to start", W / 2, 368);
}

function drawPlaying(ctx: CanvasRenderingContext2D, state: GameState, t: number) {
  ctx.fillStyle = "#000510";
  ctx.fillRect(0, 0, W, H);
  drawStars(ctx, t);

  // ── Asteroids ──────────────────────────────────────────────────────────────
  for (const a of state.asteroids) {
    drawAsteroid(ctx, a, a.value === state.question.answer, t);
  }

  // ── HUD overlay (semi-transparent bar at top) ─────────────────────────────
  ctx.fillStyle = "rgba(0,5,16,0.75)";
  ctx.fillRect(0, 0, W, 60);

  // Question (center)
  ctx.textAlign = "center";
  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#00ccff";
  ctx.shadowBlur = 4;
  ctx.fillText(`${state.question.a} × ${state.question.b} = ?`, W / 2, 36);
  ctx.shadowBlur = 0;

  // Score (left)
  ctx.textAlign = "left";
  ctx.font = "bold 13px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("SCORE", 16, 20);
  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = "#00ccff";
  ctx.fillText(String(state.score), 16, 44);

  // Lives (right) — kept at W-52 to avoid fullscreen button overlap
  ctx.textAlign = "right";
  ctx.font = "bold 13px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("LIVES", W - 52, 20);
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#ef4444";
  const hearts = "❤️".repeat(state.lives) + "🖤".repeat(MAX_LIVES - state.lives);
  ctx.fillText(hearts, W - 52, 44);
}

function drawGameOver(ctx: CanvasRenderingContext2D, state: GameState, t: number) {
  ctx.fillStyle = "#000510";
  ctx.fillRect(0, 0, W, H);
  drawStars(ctx, t);

  ctx.textAlign = "center";
  ctx.font = "bold 32px sans-serif";
  ctx.fillStyle = "#ef4444";
  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = 10;
  ctx.fillText("Game Over!", W / 2, 110);
  ctx.shadowBlur = 0;

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Your Score", W / 2, 158);
  ctx.font = "bold 64px sans-serif";
  ctx.fillStyle = "#00ccff";
  ctx.shadowColor = "#00ccff";
  ctx.shadowBlur = 12;
  ctx.fillText(String(state.score), W / 2, 228);
  ctx.shadowBlur = 0;

  if (state.score >= state.bestScore && state.score > 0) {
    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#22d3ee";
    ctx.fillText("🏆 New Best Score!", W / 2, 260);
  } else {
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Best: ${state.bestScore}`, W / 2, 260);
  }

  ctx.font = "13px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(`Correct: ${state.correctCount}`, W / 2, 284);

  const btnW = 220, btnH = 54;
  const btnX = (W - btnW) / 2;
  const btnY = 308;
  ctx.fillStyle = state.gameoverHover ? "#00aadd" : "#00ccff";
  ctx.shadowColor = "#00ccff";
  ctx.shadowBlur = state.gameoverHover ? 24 : 12;
  roundRect(ctx, btnX, btnY, btnW, btnH, 27);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = "bold 19px sans-serif";
  ctx.fillStyle = "#000510";
  ctx.fillText("▶  Play Again", W / 2, btnY + 35);

  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("Tap or click to try again", W / 2, 392);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MultiplicationBlastGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [muted, setMuted] = useState(false);
  const mRef = useRef(false);
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
    const best = stateRef.current?.bestScore ?? 0;
    const q = generateQuestion(0, null);
    stateRef.current = {
      phase: "playing",
      score: 0,
      bestScore: best,
      lives: MAX_LIVES,
      correctCount: 0,
      question: q,
      asteroids: makeAsteroids(q),
      questionStartTime: performance.now() / 1000,
      menuHover: false,
      gameoverHover: false,
    };
    setPhase("playing");
    if (!mRef.current) startMusic("space");
  }

  function nextQuestion(s: GameState) {
    const newQ = generateQuestion(s.correctCount, s.question);
    s.question = newQ;
    s.asteroids = makeAsteroids(newQ);
    s.questionStartTime = performance.now() / 1000;
  }

  function handleAsteroidClick(x: number, y: number) {
    const s = stateRef.current;
    if (!s || s.phase !== "playing") return;

    for (const a of s.asteroids) {
      const dx = x - a.x;
      const dy = y - a.y;
      if (Math.sqrt(dx * dx + dy * dy) <= a.radius + 6) {
        const now = performance.now() / 1000;
        const elapsed = now - s.questionStartTime;

        if (a.value === s.question.answer) {
          let pts = 10;
          if (elapsed < SPEED_BONUS_THRESHOLD) pts += 5;
          s.score += pts;
          s.correctCount += 1;
          a.flashColor = "rgba(0,255,128,0.9)";
          a.flashTimer = 0.25;
          if (!mRef.current) sfx.correct();
          // Delay new question so flash is visible
          setTimeout(() => {
            if (stateRef.current?.phase === "playing") {
              nextQuestion(stateRef.current);
            }
          }, 280);
        } else {
          s.lives -= 1;
          a.flashColor = "rgba(255,60,60,0.9)";
          a.flashTimer = 0.3;
          if (!mRef.current) sfx.wrong();
          if (s.lives <= 0) {
            s.lives = 0;
            s.phase = "gameover";
            s.bestScore = Math.max(s.bestScore, s.score);
            setPhase("gameover");
            stopMusic();
            if (!mRef.current) sfx.die();
          }
        }
        return;
      }
    }
  }

  function handlePointerDown(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s) return;
    const { x, y } = getCanvasXY(canvas, clientX, clientY);

    if (s.phase === "menu") {
      const btnW = 200, btnH = 54;
      const btnX = (W - btnW) / 2;
      const btnY = 278;
      if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
        startGame();
      }
      return;
    }

    if (s.phase === "gameover") {
      const btnW = 220, btnH = 54;
      const btnX = (W - btnW) / 2;
      const btnY = 308;
      if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
        startGame();
      }
      return;
    }

    if (s.phase === "playing") {
      handleAsteroidClick(x, y);
    }
  }

  function handlePointerMove(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s) return;
    const { x, y } = getCanvasXY(canvas, clientX, clientY);

    if (s.phase === "menu") {
      const btnW = 200, btnH = 54;
      const btnX = (W - btnW) / 2;
      const btnY = 278;
      s.menuHover = x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
      s.gameoverHover = false;
    } else if (s.phase === "gameover") {
      const btnW = 220, btnH = 54;
      const btnX = (W - btnW) / 2;
      const btnY = 308;
      s.gameoverHover = x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
      s.menuHover = false;
    }
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

      // ── Update ────────────────────────────────────────────────────────────
      if (s.phase === "playing") {
        for (const a of s.asteroids) {
          a.y += a.speed;

          if (a.flashTimer > 0) {
            a.flashTimer = Math.max(0, a.flashTimer - dt);
            if (a.flashTimer <= 0) a.flashColor = null;
          }

          // Respawn if asteroid exits bottom
          if (a.y > H + a.radius) {
            const values = s.asteroids.map((b) => b.value);
            const correctInPlay = s.asteroids.some((b) => b !== a && b.value === s.question.answer);
            const shouldBeAnswer = !correctInPlay && a.value !== s.question.answer;
            const refreshed = spawnAsteroid(s.question.answer, shouldBeAnswer, values.filter((v) => v !== a.value));
            a.x = refreshed.x;
            a.y = refreshed.y;
            a.speed = refreshed.speed;
            a.radius = refreshed.radius;
            a.value = refreshed.value;
            a.wobble = refreshed.wobble;
            a.flashColor = null;
            a.flashTimer = 0;
          }
        }
      }

      // ── Draw ──────────────────────────────────────────────────────────────
      if (s.phase === "menu") {
        drawMenu(ctx2d, s, t);
      } else if (s.phase === "playing") {
        drawPlaying(ctx2d, s, t);
      } else {
        drawGameOver(ctx2d, s, t);
      }

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

  useEffect(() => {
    if (muted) {
      stopMusic();
    } else {
      if (stateRef.current?.phase === "playing") {
        startMusic("space");
      }
    }
  }, [muted]);

  return (
    <div
      className="flex flex-col gap-2 select-none"
      style={{
        width: "100%",
        maxWidth: "min(100%, calc(100dvh - 80px))",
        margin: "0 auto",
      }}
    >
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-cyan-800">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block touch-none"
          style={{ width: "100%", height: "auto", background: "#000510" }}
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
            Tap the right asteroid — cyan glow = correct answer!
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Click the correct asteroid · 3 lives · Tables to 12!
      </p>
    </div>
  );
}
