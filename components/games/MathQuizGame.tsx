"use client";

import { useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic } from "@/lib/gameAudio";

const W = 480, H = 480;
const QUESTIONS_PER_ROUND = 10;
const TIME_PER_QUESTION = 8; // seconds

type Phase = "menu" | "playing" | "gameover";
type Op = "+" | "-" | "×";

interface Question {
  a: number;
  b: number;
  op: Op;
  answer: number;
}

// Numpad button definition
interface NumpadBtn {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const MAX_SCORE = QUESTIONS_PER_ROUND * (10 + TIME_PER_QUESTION * 2); // 10 + max 16 speed bonus ≈ 120

interface GameState {
  phase: Phase;
  score: number;
  bestScore: number;
  questionIndex: number; // 0-based, current question
  question: Question;
  input: string; // digits typed so far
  timer: number; // seconds remaining
  flashColor: string | null;
  flashTimer: number;
  answeredQuestions: { correct: boolean }[];
  menuHover: boolean;
  gameoverHover: boolean;
  hoverBtn: string | null; // label of hovered numpad button
}

// ─── Question generation ─────────────────────────────────────────────────────

type Difficulty = "easy" | "medium" | "hard";

function cycledDifficulty(index: number): Difficulty {
  const cycle: Difficulty[] = ["easy", "medium", "hard"];
  return cycle[index % cycle.length];
}

function generateQuestion(index: number): Question {
  const ops: Op[] = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const diff = cycledDifficulty(index);

  if (op === "+") {
    const max = diff === "easy" ? 10 : diff === "medium" ? 50 : 500;
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    return { a, b, op, answer: a + b };
  }
  if (op === "-") {
    const max = diff === "easy" ? 10 : diff === "medium" ? 50 : 500;
    const b = Math.floor(Math.random() * max) + 1;
    const a = b + Math.floor(Math.random() * max) + 1;
    return { a, b, op, answer: a - b };
  }
  // multiplication
  const max = diff === "easy" ? 5 : diff === "medium" ? 10 : 12;
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * max) + 1;
  return { a, b, op, answer: a * b };
}

function getGrade(score: number): { grade: string; color: string } {
  const pct = (score / MAX_SCORE) * 100;
  if (pct >= 90) return { grade: "A", color: "#22c55e" };
  if (pct >= 70) return { grade: "B", color: "#84cc16" };
  if (pct >= 50) return { grade: "C", color: "#f59e0b" };
  if (pct >= 30) return { grade: "D", color: "#f97316" };
  return { grade: "F", color: "#ef4444" };
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

function buildNumpad(): NumpadBtn[] {
  const btns: NumpadBtn[] = [];
  const bw = 100, bh = 52, gap = 10;
  const totalW = bw * 3 + gap * 2;
  const startX = (W - totalW) / 2;
  const startY = 280;

  // Digits 1–9
  const digits = ["1","2","3","4","5","6","7","8","9"];
  digits.forEach((d, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    btns.push({
      label: d,
      x: startX + col * (bw + gap),
      y: startY + row * (bh + gap),
      w: bw,
      h: bh,
    });
  });

  // Bottom row: backspace (←), 0, enter (✓)
  const bottomY = startY + 3 * (bh + gap);
  btns.push({ label: "←", x: startX, y: bottomY, w: bw, h: bh });
  btns.push({ label: "0", x: startX + bw + gap, y: bottomY, w: bw, h: bh });
  btns.push({ label: "✓", x: startX + 2 * (bw + gap), y: bottomY, w: bw, h: bh });

  return btns;
}

const NUMPAD_BTNS = buildNumpad();

function hitBtn(x: number, y: number, btn: NumpadBtn) {
  return x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h;
}

// ─── Drawing functions ───────────────────────────────────────────────────────

function drawMenu(ctx: CanvasRenderingContext2D, state: GameState, t: number) {
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, W, H);

  const pulse = 0.5 + 0.5 * Math.sin(t * 2);

  ctx.font = "60px serif";
  ctx.textAlign = "center";
  ctx.fillText("🧮", W / 2, 105);

  ctx.font = "bold 30px sans-serif";
  ctx.fillStyle = "#a855f7";
  ctx.shadowColor = "#a855f7";
  ctx.shadowBlur = 8 + pulse * 10;
  ctx.fillText("Math Quiz", W / 2, 155);
  ctx.fillText("Challenge", W / 2, 190);
  ctx.shadowBlur = 0;

  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("10 questions · 8 seconds each", W / 2, 224);

  if (state.bestScore > 0) {
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Best: ${state.bestScore}`, W / 2, 250);
  }

  const btnW = 200, btnH = 54;
  const btnX = (W - btnW) / 2;
  const btnY = 278;
  ctx.fillStyle = state.menuHover ? "#9333ea" : "#a855f7";
  ctx.shadowColor = "#a855f7";
  ctx.shadowBlur = state.menuHover ? 24 : 12;
  roundRect(ctx, btnX, btnY, btnW, btnH, 27);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("▶  Play", W / 2, btnY + 35);

  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("Tap the number pad or use keyboard", W / 2, 362);
}

function drawPlaying(ctx: CanvasRenderingContext2D, state: GameState, t: number) {
  // Background with optional flash
  if (state.flashColor && state.flashTimer > 0) {
    ctx.fillStyle = state.flashColor;
  } else {
    ctx.fillStyle = "#0d1117";
  }
  ctx.fillRect(0, 0, W, H);

  // ── HUD bar ────────────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(13,17,23,0.85)";
  ctx.fillRect(0, 0, W, 56);

  // Question number (left)
  ctx.textAlign = "left";
  ctx.font = "bold 13px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("QUESTION", 16, 20);
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "#a855f7";
  ctx.fillText(`${state.questionIndex + 1} / ${QUESTIONS_PER_ROUND}`, 16, 44);

  // Score (right, W-52 to avoid fullscreen button)
  ctx.textAlign = "right";
  ctx.font = "bold 13px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("SCORE", W - 52, 20);
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "#a855f7";
  ctx.fillText(String(state.score), W - 52, 44);

  // Countdown bar
  const barW = W - 32;
  const barH = 6;
  const barX = 16;
  const barY = 58;
  const ratio = Math.max(0, state.timer / TIME_PER_QUESTION);
  const timerColor = ratio > 0.5 ? "#a855f7" : ratio > 0.25 ? "#f97316" : "#ef4444";
  ctx.fillStyle = "#1e293b";
  roundRect(ctx, barX, barY, barW, barH, 3);
  ctx.fill();
  ctx.fillStyle = timerColor;
  roundRect(ctx, barX, barY, barW * ratio, barH, 3);
  ctx.fill();

  // Timer seconds (center above bar)
  ctx.textAlign = "center";
  ctx.font = "bold 11px sans-serif";
  ctx.fillStyle = timerColor;
  ctx.fillText(`${Math.ceil(state.timer)}s`, W / 2, 54);

  // ── Question ────────────────────────────────────────────────────────────────
  const qText = `${state.question.a} ${state.question.op} ${state.question.b} = ?`;
  ctx.font = "bold 42px sans-serif";
  ctx.fillStyle = "#f8fafc";
  ctx.textAlign = "center";
  ctx.shadowColor = "#a855f7";
  ctx.shadowBlur = 4;
  ctx.fillText(qText, W / 2, 152);
  ctx.shadowBlur = 0;

  // ── Answer display ──────────────────────────────────────────────────────────
  const ansBoxW = 260, ansBoxH = 54;
  const ansBoxX = (W - ansBoxW) / 2;
  const ansBoxY = 172;
  ctx.fillStyle = "#1e293b";
  ctx.strokeStyle = "#a855f7";
  ctx.lineWidth = 2;
  roundRect(ctx, ansBoxX, ansBoxY, ansBoxW, ansBoxH, 10);
  ctx.fill();
  ctx.stroke();
  ctx.font = "bold 28px sans-serif";
  ctx.fillStyle = state.input ? "#ffffff" : "#475569";
  ctx.textAlign = "center";
  ctx.fillText(state.input || "...", W / 2, ansBoxY + 37);

  // ── Number pad ─────────────────────────────────────────────────────────────
  for (const btn of NUMPAD_BTNS) {
    const isHover = state.hoverBtn === btn.label;
    const isSubmit = btn.label === "✓";
    const isBack = btn.label === "←";

    ctx.fillStyle = isSubmit
      ? (isHover ? "#7c3aed" : "#6d28d9")
      : isBack
      ? (isHover ? "#374151" : "#1f2937")
      : (isHover ? "#2d3748" : "#1a2030");

    ctx.strokeStyle = isSubmit ? "#a855f7" : (isHover ? "#6b7280" : "#374151");
    ctx.lineWidth = isSubmit ? 2 : 1;

    roundRect(ctx, btn.x, btn.y, btn.w, btn.h, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = isSubmit || isBack ? "bold 20px sans-serif" : "bold 22px sans-serif";
    ctx.fillStyle = isSubmit ? "#e9d5ff" : "#e2e8f0";
    ctx.textAlign = "center";
    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2 + 8);
  }
}

function drawGameOver(ctx: CanvasRenderingContext2D, state: GameState, t: number) {
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, W, H);

  const { grade, color } = getGrade(state.score);

  ctx.textAlign = "center";
  ctx.font = "bold 28px sans-serif";
  ctx.fillStyle = "#f8fafc";
  ctx.fillText("Quiz Complete!", W / 2, 72);

  // Grade badge
  ctx.font = "bold 80px sans-serif";
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.fillText(grade, W / 2, 162);
  ctx.shadowBlur = 0;

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Your Score", W / 2, 194);
  ctx.font = "bold 40px sans-serif";
  ctx.fillStyle = "#a855f7";
  ctx.fillText(String(state.score), W / 2, 236);

  if (state.score >= state.bestScore && state.score > 0) {
    ctx.font = "bold 14px sans-serif";
    ctx.fillStyle = "#22d3ee";
    ctx.fillText("🏆 New Best Score!", W / 2, 262);
  } else if (state.bestScore > 0) {
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Best: ${state.bestScore}`, W / 2, 262);
  }

  const correct = state.answeredQuestions.filter((q) => q.correct).length;
  ctx.font = "13px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(`${correct} / ${QUESTIONS_PER_ROUND} correct`, W / 2, 284);

  const btnW = 220, btnH = 50;
  const btnX = (W - btnW) / 2;
  const btnY = 304;
  ctx.fillStyle = state.gameoverHover ? "#9333ea" : "#a855f7";
  ctx.shadowColor = "#a855f7";
  ctx.shadowBlur = state.gameoverHover ? 24 : 12;
  roundRect(ctx, btnX, btnY, btnW, btnH, 25);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = "bold 18px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("▶  Play Again", W / 2, btnY + 33);

  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("Tap or click to try again", W / 2, 384);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MathQuizGame() {
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
    const q = generateQuestion(0);
    stateRef.current = {
      phase: "playing",
      score: 0,
      bestScore: best,
      questionIndex: 0,
      question: q,
      input: "",
      timer: TIME_PER_QUESTION,
      flashColor: null,
      flashTimer: 0,
      answeredQuestions: [],
      menuHover: false,
      gameoverHover: false,
      hoverBtn: null,
    };
    setPhase("playing");
    if (!mRef.current) startMusic("happy");
  }

  function submitAnswer(s: GameState) {
    if (s.phase !== "playing") return;
    const userAnswer = parseInt(s.input, 10);
    const correct = !isNaN(userAnswer) && userAnswer === s.question.answer;
    const timeBonus = correct ? Math.floor(s.timer) * 2 : 0;

    if (correct) {
      s.score += 10 + timeBonus;
      s.flashColor = "rgba(34,197,94,0.25)";
      s.flashTimer = 0.4;
      if (!mRef.current) sfx.correct();
    } else {
      s.flashColor = "rgba(239,68,68,0.25)";
      s.flashTimer = 0.4;
      if (!mRef.current) sfx.wrong();
    }

    s.answeredQuestions.push({ correct });
    s.input = "";

    if (s.questionIndex + 1 >= QUESTIONS_PER_ROUND) {
      // Round over
      setTimeout(() => {
        const cur = stateRef.current;
        if (!cur) return;
        cur.phase = "gameover";
        cur.bestScore = Math.max(cur.bestScore, cur.score);
        setPhase("gameover");
        stopMusic();
        if (!mRef.current) sfx.levelUp();
      }, 420);
    } else {
      setTimeout(() => {
        const cur = stateRef.current;
        if (!cur || cur.phase !== "playing") return;
        cur.questionIndex += 1;
        cur.question = generateQuestion(cur.questionIndex);
        cur.timer = TIME_PER_QUESTION;
        cur.input = "";
      }, 420);
    }
  }

  function handleNumpadInput(label: string) {
    const s = stateRef.current;
    if (!s || s.phase !== "playing") return;
    if (label === "✓") {
      submitAnswer(s);
    } else if (label === "←") {
      s.input = s.input.slice(0, -1);
    } else if (/^[0-9]$/.test(label)) {
      if (s.input.length < 5) {
        s.input += label;
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
      const btnW = 220, btnH = 50;
      const btnX = (W - btnW) / 2;
      const btnY = 304;
      if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
        startGame();
      }
      return;
    }

    if (s.phase === "playing") {
      for (const btn of NUMPAD_BTNS) {
        if (hitBtn(x, y, btn)) {
          if (!mRef.current) sfx.tap();
          handleNumpadInput(btn.label);
          return;
        }
      }
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
      const btnW = 220, btnH = 50;
      const btnX = (W - btnW) / 2;
      const btnY = 304;
      s.gameoverHover = x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH;
      s.menuHover = false;
    } else if (s.phase === "playing") {
      let found: string | null = null;
      for (const btn of NUMPAD_BTNS) {
        if (hitBtn(x, y, btn)) { found = btn.label; break; }
      }
      s.hoverBtn = found;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d")!;

    if (!stateRef.current) {
      stateRef.current = {
        phase: "menu",
        score: 0,
        bestScore: 0,
        questionIndex: 0,
        question: generateQuestion(0),
        input: "",
        timer: TIME_PER_QUESTION,
        flashColor: null,
        flashTimer: 0,
        answeredQuestions: [],
        menuHover: false,
        gameoverHover: false,
        hoverBtn: null,
      };
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
        s.timer -= dt;
        if (s.timer <= 0) {
          s.timer = 0;
          // Timeout — mark wrong and advance
          s.flashColor = "rgba(239,68,68,0.25)";
          s.flashTimer = 0.4;
          if (!mRef.current) sfx.wrong();
          s.answeredQuestions.push({ correct: false });
          s.input = "";

          if (s.questionIndex + 1 >= QUESTIONS_PER_ROUND) {
            s.phase = "gameover";
            s.bestScore = Math.max(s.bestScore, s.score);
            setPhase("gameover");
            stopMusic();
            if (!mRef.current) sfx.levelUp();
          } else {
            s.questionIndex += 1;
            s.question = generateQuestion(s.questionIndex);
            s.timer = TIME_PER_QUESTION;
          }
        }

        if (s.flashTimer > 0) {
          s.flashTimer = Math.max(0, s.flashTimer - dt);
          if (s.flashTimer <= 0) s.flashColor = null;
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

    // ── Pointer events ───────────────────────────────────────────────────────
    function onPointerDown(e: PointerEvent) {
      e.preventDefault();
      handlePointerDown(e.clientX, e.clientY);
    }
    function onPointerMove(e: PointerEvent) {
      handlePointerMove(e.clientX, e.clientY);
    }

    // ── Keyboard events ──────────────────────────────────────────────────────
    function onKeyDown(e: KeyboardEvent) {
      const s = stateRef.current;
      if (!s || s.phase !== "playing") return;
      if (e.key >= "0" && e.key <= "9") {
        handleNumpadInput(e.key);
      } else if (e.key === "Backspace" || e.key === "Delete") {
        handleNumpadInput("←");
      } else if (e.key === "Enter" || e.key === "Return") {
        handleNumpadInput("✓");
      }
    }

    canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
      stopMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-violet-800">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block touch-none"
          style={{ width: "100%", height: "auto", background: "#0d1117" }}
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
            Speed bonus: answer fast to score extra points!
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Tap numbers or use keyboard · 10 questions · Race the clock!
      </p>
    </div>
  );
}
