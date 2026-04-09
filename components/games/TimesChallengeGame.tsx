"use client";

import { useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic } from "@/lib/gameAudio";

const W = 480, H = 480;
const ROUND_TIME = 30;
const SPEED_BONUS_THRESHOLD = 3; // seconds

type Phase = "menu" | "playing" | "gameover";

interface Question {
  a: number;
  b: number;
  answer: number;
}

interface ButtonRect {
  x: number;
  y: number;
  w: number;
  h: number;
  value: number;
}

interface GameState {
  phase: Phase;
  score: number;
  bestScore: number;
  streak: number;
  correctCount: number;
  timer: number;
  question: Question;
  choices: number[];
  lastPhase: Phase;
  flashColor: string | null;
  flashTimer: number;
  questionStartTime: number;
  prevQuestion: Question | null;
  hoverBtn: number; // index of hovered answer button (-1 = none)
  menuHover: boolean;
  gameoverHover: boolean;
}

function getDifficultyRange(correctCount: number): [number, number] {
  if (correctCount < 5) return [1, 5];
  if (correctCount < 10) return [1, 8];
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

function generateChoices(answer: number, max: number): number[] {
  const set = new Set<number>([answer]);
  let attempts = 0;
  while (set.size < 4 && attempts < 100) {
    attempts++;
    const delta = Math.floor(Math.random() * 8) + 1;
    const sign = Math.random() < 0.5 ? 1 : -1;
    const candidate = answer + sign * delta;
    if (candidate > 0 && candidate !== answer) {
      set.add(candidate);
    }
  }
  // Fill if needed with known-wrong values
  let extra = 1;
  while (set.size < 4) {
    if (answer + extra !== answer) set.add(answer + extra);
    extra++;
  }
  // Shuffle
  return [...set].sort(() => Math.random() - 0.5);
}

function makeInitialState(bestScore = 0): GameState {
  const question = generateQuestion(0, null);
  const [, max] = getDifficultyRange(0);
  return {
    phase: "menu",
    score: 0,
    bestScore,
    streak: 0,
    correctCount: 0,
    timer: ROUND_TIME,
    question,
    choices: generateChoices(question.answer, max),
    lastPhase: "menu",
    flashColor: null,
    flashTimer: 0,
    questionStartTime: 0,
    prevQuestion: null,
    hoverBtn: -1,
    menuHover: false,
    gameoverHover: false,
  };
}

function getButtonRects(): ButtonRect[] {
  // 2x2 grid, centered horizontally
  const btnW = 190, btnH = 60, gap = 12;
  const totalW = btnW * 2 + gap;
  const startX = (W - totalW) / 2;
  const startY = 300;
  return [
    { x: startX,          y: startY,          w: btnW, h: btnH, value: 0 },
    { x: startX + btnW + gap, y: startY,       w: btnW, h: btnH, value: 0 },
    { x: startX,          y: startY + btnH + gap, w: btnW, h: btnH, value: 0 },
    { x: startX + btnW + gap, y: startY + btnH + gap, w: btnW, h: btnH, value: 0 },
  ];
}

function hitTest(x: number, y: number, rect: ButtonRect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

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
  // Static star field using deterministic positions from a seed pattern
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  const stars = [
    [40,30],[120,80],[200,20],[300,60],[420,35],[70,150],[160,190],[260,130],
    [380,170],[450,110],[30,260],[90,300],[180,240],[280,290],[370,220],
    [430,280],[50,380],[140,420],[230,370],[340,400],[460,360],[100,450],
    [200,460],[330,470],[400,440],[15,100],[480,200],[240,350],[320,10],
  ];
  for (const [sx, sy] of stars) {
    const twinkle = 0.4 + 0.3 * Math.sin(t * 2 + sx * 0.1);
    ctx.globalAlpha = twinkle;
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }
  ctx.globalAlpha = 1;
}

function drawMenu(ctx: CanvasRenderingContext2D, state: GameState, t: number) {
  // Background
  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(0, 0, W, H);
  drawStars(ctx, t);

  // Animated glow pulse
  const pulse = 0.5 + 0.5 * Math.sin(t * 2);

  // Title emoji
  ctx.font = "64px serif";
  ctx.textAlign = "center";
  ctx.fillText("🔢", W / 2, 110);

  // Title
  ctx.font = "bold 28px sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = 8 + pulse * 8;
  ctx.fillText("Times Tables", W / 2, 158);
  ctx.fillText("Challenge", W / 2, 192);
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Race the clock · 30 seconds per round", W / 2, 225);

  // Best score
  if (state.bestScore > 0) {
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Best: ${state.bestScore}`, W / 2, 252);
  }

  // Play button
  const btnW = 200, btnH = 54;
  const btnX = (W - btnW) / 2;
  const btnY = 280;
  ctx.fillStyle = state.menuHover ? "#f59e0b" : "#fbbf24";
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = state.menuHover ? 20 : 10;
  roundRect(ctx, btnX, btnY, btnW, btnH, 27);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "#0a0a1a";
  ctx.fillText("▶  Play", W / 2, btnY + 35);

  // Hint
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("Tap or click to start", W / 2, 370);
}

function drawPlaying(ctx: CanvasRenderingContext2D, state: GameState, t: number) {
  // Background
  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(0, 0, W, H);
  drawStars(ctx, t);

  // Flash overlay
  if (state.flashColor && state.flashTimer > 0) {
    ctx.fillStyle = state.flashColor;
    ctx.fillRect(0, 0, W, H);
  }

  // ── HUD ──────────────────────────────────────────────────────────────────
  // Score (left)
  ctx.font = "bold 14px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.textAlign = "left";
  ctx.fillText("SCORE", 16, 22);
  ctx.font = "bold 24px sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.fillText(String(state.score), 16, 48);

  // Streak (center)
  ctx.textAlign = "center";
  ctx.font = "bold 13px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("STREAK", W / 2, 22);
  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = state.streak >= 3 ? "#f97316" : "#e2e8f0";
  ctx.fillText(state.streak > 0 ? `${state.streak} 🔥` : "0", W / 2, 48);

  // Timer (right) — keep text at W-52 to avoid fullscreen button overlap
  const timerColor = state.timer <= 10 ? "#ef4444" : state.timer <= 20 ? "#f97316" : "#22d3ee";
  ctx.textAlign = "right";
  ctx.font = "bold 14px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("TIME", W - 52, 22);
  ctx.font = "bold 28px sans-serif";
  ctx.fillStyle = timerColor;
  if (state.timer <= 10) {
    ctx.shadowColor = timerColor;
    ctx.shadowBlur = 6;
  }
  ctx.fillText(String(Math.ceil(state.timer)), W - 52, 50);
  ctx.shadowBlur = 0;

  // Timer bar
  const barW = W - 32;
  const barH = 6;
  const barX = 16;
  const barY = 58;
  ctx.fillStyle = "#1e293b";
  roundRect(ctx, barX, barY, barW, barH, 3);
  ctx.fill();
  const ratio = Math.max(0, state.timer / ROUND_TIME);
  ctx.fillStyle = timerColor;
  roundRect(ctx, barX, barY, barW * ratio, barH, 3);
  ctx.fill();

  // Divider
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(16, 70, W - 32, 1);

  // Difficulty label
  const [, max] = getDifficultyRange(state.correctCount);
  const diffLabel = max <= 5 ? "Easy" : max <= 8 ? "Medium" : "Hard";
  const diffColor = max <= 5 ? "#22c55e" : max <= 8 ? "#f97316" : "#ef4444";
  ctx.textAlign = "center";
  ctx.font = "11px sans-serif";
  ctx.fillStyle = diffColor;
  ctx.fillText(`${diffLabel} · Tables 1–${max}`, W / 2, 84);

  // ── Question ─────────────────────────────────────────────────────────────
  const qText = `${state.question.a} × ${state.question.b} = ?`;
  ctx.font = "bold 52px sans-serif";
  ctx.fillStyle = "#f8fafc";
  ctx.textAlign = "center";
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = 4;
  ctx.fillText(qText, W / 2, 210);
  ctx.shadowBlur = 0;

  // Smaller hint under question
  ctx.font = "13px sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("Choose the correct answer", W / 2, 238);

  // ── Answer buttons ────────────────────────────────────────────────────────
  const rects = getButtonRects();
  rects.forEach((r, i) => {
    r.value = state.choices[i];
    const isHovered = state.hoverBtn === i;
    // Button background
    ctx.fillStyle = isHovered ? "#1e3a5f" : "#0f172a";
    ctx.strokeStyle = isHovered ? "#fbbf24" : "#334155";
    ctx.lineWidth = isHovered ? 2 : 1.5;
    roundRect(ctx, r.x, r.y, r.w, r.h, 12);
    ctx.fill();
    ctx.stroke();

    // Button value
    ctx.font = "bold 26px sans-serif";
    ctx.fillStyle = isHovered ? "#fbbf24" : "#e2e8f0";
    ctx.textAlign = "center";
    ctx.fillText(String(r.value), r.x + r.w / 2, r.y + r.h / 2 + 9);
  });
}

function drawGameOver(ctx: CanvasRenderingContext2D, state: GameState, t: number) {
  // Background
  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(0, 0, W, H);
  drawStars(ctx, t);

  // Title
  ctx.textAlign = "center";
  ctx.font = "bold 32px sans-serif";
  ctx.fillStyle = "#ef4444";
  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = 10;
  ctx.fillText("Time's Up!", W / 2, 110);
  ctx.shadowBlur = 0;

  // Score
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Your Score", W / 2, 155);
  ctx.font = "bold 64px sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = 12;
  ctx.fillText(String(state.score), W / 2, 225);
  ctx.shadowBlur = 0;

  // Best score
  if (state.score >= state.bestScore && state.score > 0) {
    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#22d3ee";
    ctx.fillText("🏆 New Best Score!", W / 2, 255);
  } else {
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Best: ${state.bestScore}`, W / 2, 255);
  }

  // Streak info
  if (state.streak > 0) {
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#f97316";
    ctx.fillText(`Streak: ${state.streak} 🔥`, W / 2, 278);
  }

  // Play Again button
  const btnW = 220, btnH = 54;
  const btnX = (W - btnW) / 2;
  const btnY = 305;
  ctx.fillStyle = state.gameoverHover ? "#f59e0b" : "#fbbf24";
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = state.gameoverHover ? 20 : 10;
  roundRect(ctx, btnX, btnY, btnW, btnH, 27);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = "bold 19px sans-serif";
  ctx.fillStyle = "#0a0a1a";
  ctx.fillText("▶  Play Again", W / 2, btnY + 35);

  // Hint
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("Tap or click to try again", W / 2, 390);
}

export default function TimesChallengeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [muted, setMuted] = useState(false);
  const mRef = useRef(false);
  // Expose phase to React for mute button label only
  const [phase, setPhase] = useState<Phase>("menu");

  // ── Canvas coordinate helper (accounts for CSS scaling) ──────────────────
  function getCanvasXY(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  // ── Start a new game ──────────────────────────────────────────────────────
  function startGame() {
    const best = stateRef.current?.bestScore ?? 0;
    const q = generateQuestion(0, null);
    const [, max] = getDifficultyRange(0);
    stateRef.current = {
      phase: "playing",
      score: 0,
      bestScore: best,
      streak: 0,
      correctCount: 0,
      timer: ROUND_TIME,
      question: q,
      choices: generateChoices(q.answer, max),
      lastPhase: "menu",
      flashColor: null,
      flashTimer: 0,
      questionStartTime: performance.now() / 1000,
      prevQuestion: null,
      hoverBtn: -1,
      menuHover: false,
      gameoverHover: false,
    };
    setPhase("playing");
    if (!mRef.current) startMusic("happy");
  }

  // ── Handle answer selection ───────────────────────────────────────────────
  function handleAnswer(choiceIndex: number) {
    const s = stateRef.current;
    if (!s || s.phase !== "playing") return;

    const chosen = s.choices[choiceIndex];
    const now = performance.now() / 1000;
    const elapsed = now - s.questionStartTime;

    if (chosen === s.question.answer) {
      let points = 10;
      if (elapsed < SPEED_BONUS_THRESHOLD) points += 5;
      s.score += points;
      s.streak += 1;
      s.correctCount += 1;
      s.flashColor = "rgba(0,255,0,0.3)";
      s.flashTimer = 0.3;
      if (!mRef.current) sfx.correct();
    } else {
      s.score = Math.max(0, s.score - 5);
      s.streak = 0;
      s.flashColor = "rgba(255,0,0,0.3)";
      s.flashTimer = 0.3;
      if (!mRef.current) sfx.wrong();
    }

    // Next question
    const nextQ = generateQuestion(s.correctCount, s.question);
    const [, max] = getDifficultyRange(s.correctCount);
    s.prevQuestion = s.question;
    s.question = nextQ;
    s.choices = generateChoices(nextQ.answer, max);
    s.questionStartTime = now;
    s.hoverBtn = -1;
  }

  // ── Hit test for pointer events ───────────────────────────────────────────
  function handlePointerDown(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s) return;

    const { x, y } = getCanvasXY(canvas, clientX, clientY);

    if (s.phase === "menu") {
      // Play button
      const btnW = 200, btnH = 54;
      const btnX = (W - btnW) / 2;
      const btnY = 280;
      if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
        startGame();
      }
      return;
    }

    if (s.phase === "gameover") {
      const btnW = 220, btnH = 54;
      const btnX = (W - btnW) / 2;
      const btnY = 305;
      if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
        startGame();
      }
      return;
    }

    if (s.phase === "playing") {
      const rects = getButtonRects();
      rects.forEach((r, i) => {
        r.value = s.choices[i];
        if (hitTest(x, y, r)) {
          handleAnswer(i);
        }
      });
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
      const btnY = 280;
      s.menuHover = x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
      s.gameoverHover = false;
      s.hoverBtn = -1;
      return;
    }

    if (s.phase === "gameover") {
      const btnW = 220, btnH = 54;
      const btnX = (W - btnW) / 2;
      const btnY = 305;
      s.gameoverHover = x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
      s.menuHover = false;
      s.hoverBtn = -1;
      return;
    }

    if (s.phase === "playing") {
      const rects = getButtonRects();
      let found = -1;
      rects.forEach((r, i) => {
        r.value = s.choices[i];
        if (hitTest(x, y, r)) found = i;
      });
      s.hoverBtn = found;
      s.menuHover = false;
      s.gameoverHover = false;
    }
  }

  // ── RAF game loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d")!;

    // Initialise state
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

      // ── Update ──────────────────────────────────────────────────────────
      if (s.phase === "playing") {
        s.timer -= dt;
        if (s.timer <= 0) {
          s.timer = 0;
          s.phase = "gameover";
          s.bestScore = Math.max(s.bestScore, s.score);
          setPhase("gameover");
          stopMusic();
          if (!mRef.current) sfx.die();
        }
      }

      if (s.flashTimer > 0) {
        s.flashTimer = Math.max(0, s.flashTimer - dt);
        if (s.flashTimer <= 0) s.flashColor = null;
      }

      // ── Draw ────────────────────────────────────────────────────────────
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

    // ── Event listeners ──────────────────────────────────────────────────
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

  // ── Mute sync ──────────────────────────────────────────────────────────────
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
        maxWidth: "min(100%, calc(100dvh - 80px))",
        margin: "0 auto",
      }}
    >
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-700">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block touch-none"
          style={{ width: "100%", height: "auto", background: "#0a0a1a" }}
        />
      </div>

      {/* Below-canvas controls */}
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
            Score climbs fast — speed bonuses for quick answers!
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Tap an answer · Race the clock!
      </p>
    </div>
  );
}
