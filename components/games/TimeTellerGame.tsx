"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "menu" | "playing" | "finished";
type Precision = "hour" | "half" | "quarter";

interface Round {
  hours: number; // 1-12
  minutes: number; // 0, 15, 30, 45 (or 0/30 etc. depending on precision)
  choices: string[]; // "3:15"
  answer: string;
  precision: Precision;
}

const ROUNDS_PER_GAME = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(h: number, m: number): string {
  return `${h}:${m.toString().padStart(2, "0")}`;
}

function precisionForRound(idx: number): Precision {
  if (idx < 3) return "hour";
  if (idx < 6) return "half";
  return "quarter";
}

function allowedMinutes(precision: Precision): number[] {
  if (precision === "hour") return [0];
  if (precision === "half") return [0, 30];
  return [0, 15, 30, 45];
}

function makeRound(index: number): Round {
  const precision = precisionForRound(index);
  const mins = allowedMinutes(precision);
  const hours = Math.floor(Math.random() * 12) + 1; // 1..12
  const minutes = mins[Math.floor(Math.random() * mins.length)];
  const answer = formatTime(hours, minutes);

  // Build 3 distractors close to the answer
  const set = new Set<string>([answer]);
  let attempts = 0;
  while (set.size < 4 && attempts < 50) {
    attempts++;
    // Distractor strategies: different hour, different minute
    const strategy = Math.random();
    let h = hours;
    let m = minutes;
    if (strategy < 0.5) {
      // Shift hour by ±1 or ±2
      const delta = [1, -1, 2, -2][Math.floor(Math.random() * 4)];
      h = ((hours - 1 + delta + 12) % 12) + 1;
    } else {
      // Pick a different minute from the precision set (or a close one)
      const pool = precision === "hour" ? [0, 15, 30, 45] : allowedMinutes(precision);
      const other = pool.filter((x) => x !== minutes);
      if (other.length > 0) {
        m = other[Math.floor(Math.random() * other.length)];
      } else {
        h = ((hours - 1 + 1) % 12) + 1;
      }
    }
    const candidate = formatTime(h, m);
    if (candidate !== answer) set.add(candidate);
  }
  // Fallback fill
  let fill = 1;
  while (set.size < 4) {
    const h = ((hours - 1 + fill) % 12) + 1;
    set.add(formatTime(h, minutes));
    fill++;
  }

  const choices = Array.from(set).sort(() => Math.random() - 0.5);
  return { hours, minutes, choices, answer, precision };
}

// ─── Analog clock SVG ─────────────────────────────────────────────────────────

function AnalogClock({ hours, minutes }: { hours: number; minutes: number }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 100;

  // Hour hand: 1 hour = 30°, plus minute contribution
  const hourAngle = ((hours % 12) + minutes / 60) * 30 - 90; // degrees, 0 = 12 o'clock
  const minuteAngle = (minutes / 60) * 360 - 90;

  const hourRad = (hourAngle * Math.PI) / 180;
  const minuteRad = (minuteAngle * Math.PI) / 180;

  const hourLen = r * 0.55;
  const minuteLen = r * 0.82;

  const hourX = cx + hourLen * Math.cos(hourRad);
  const hourY = cy + hourLen * Math.sin(hourRad);
  const minX = cx + minuteLen * Math.cos(minuteRad);
  const minY = cy + minuteLen * Math.sin(minuteRad);

  // Hour marks
  const marks = [];
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x1 = cx + (r - 8) * Math.cos(angle);
    const y1 = cy + (r - 8) * Math.sin(angle);
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    marks.push(
      <line
        key={`m${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#1e3a8a"
        strokeWidth={3}
        strokeLinecap="round"
      />
    );
    // Hour numbers
    const nx = cx + (r - 22) * Math.cos(angle);
    const ny = cy + (r - 22) * Math.sin(angle);
    marks.push(
      <text
        key={`n${i}`}
        x={nx}
        y={ny + 5}
        textAnchor="middle"
        fontSize={16}
        fontWeight="bold"
        fill="#1e3a8a"
      >
        {i}
      </text>
    );
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] h-auto">
      {/* Face */}
      <circle cx={cx} cy={cy} r={r + 6} fill="#fef3c7" stroke="#92400e" strokeWidth={4} />
      <circle cx={cx} cy={cy} r={r} fill="#fffbeb" stroke="#1e3a8a" strokeWidth={3} />
      {marks}
      {/* Hour hand */}
      <line
        x1={cx}
        y1={cy}
        x2={hourX}
        y2={hourY}
        stroke="#1e3a8a"
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1={cx}
        y1={cy}
        x2={minX}
        y2={minY}
        stroke="#dc2626"
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* Center */}
      <circle cx={cx} cy={cy} r={6} fill="#1e3a8a" />
      <circle cx={cx} cy={cy} r={3} fill="#fef3c7" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TimeTellerGame() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [round, setRound] = useState<Round>(() => makeRound(0));
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "right" | "wrong">("none");
  const [picked, setPicked] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const tickRef = useRef<number | null>(null);
  const [tickPulse, setTickPulse] = useState(0);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (phase === "playing") startMusic("calm");
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && !mutedRef.current) {
      startMusic("calm");
    }
    return () => {
      stopMusic();
    };
  }, [phase]);

  // Ticking sound every second during play
  useEffect(() => {
    if (phase !== "playing") return;
    tickRef.current = window.setInterval(() => {
      setTickPulse((p) => p + 1);
      if (!mutedRef.current) sfx.tap();
    }, 1000);
    return () => {
      if (tickRef.current !== null) window.clearInterval(tickRef.current);
    };
  }, [phase]);

  const startGame = useCallback(() => {
    setRound(makeRound(0));
    setRoundIdx(0);
    setScore(0);
    setFeedback("none");
    setPicked(null);
    setPhase("playing");
    if (!mutedRef.current) sfx.click();
  }, []);

  const handlePick = useCallback(
    (choice: string) => {
      if (feedback !== "none") return;
      setPicked(choice);
      if (!mutedRef.current) sfx.click();
      const correct = choice === round.answer;
      if (correct) {
        setScore((s) => s + 1);
        setFeedback("right");
        if (!mutedRef.current) sfx.correct();
      } else {
        setFeedback("wrong");
        if (!mutedRef.current) sfx.wrong();
      }
      setTimeout(() => {
        setFeedback("none");
        setPicked(null);
        if (roundIdx + 1 >= ROUNDS_PER_GAME) {
          setPhase("finished");
          stopMusic();
          setBest((b) => Math.max(b, correct ? score + 1 : score));
          if (!mutedRef.current) sfx.levelUp();
        } else {
          setRoundIdx((i) => i + 1);
          setRound(makeRound(roundIdx + 1));
        }
      }, 800);
    },
    [feedback, round.answer, roundIdx, score]
  );

  const precisionLabel = useMemo(() => {
    if (round.precision === "hour") return "To the hour";
    if (round.precision === "half") return "To the half hour";
    return "To the quarter hour";
  }, [round.precision]);

  return (
    <div
      className="flex flex-col items-center gap-3 select-none w-full px-3 py-3"
      style={{
        maxWidth: "min(100%, 540px)",
        margin: "0 auto",
        minHeight: "calc(100dvh - 80px)",
      }}
    >
      {phase === "menu" && (
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white shadow-2xl border-2 border-sky-300 flex-1">
          <div className="text-6xl">🕰️</div>
          <h2 className="text-3xl font-extrabold text-center drop-shadow">Time Teller</h2>
          <p className="text-center text-white/95 text-sm max-w-xs">
            Read the clock and pick the right time. Starts easy (hours) and gets trickier (half &
            quarter hours).
          </p>
          {best > 0 && (
            <p className="text-xs bg-black/25 px-3 py-1 rounded-full">Best: {best} / {ROUNDS_PER_GAME}</p>
          )}
          <button
            onClick={startGame}
            className="bg-white text-indigo-700 font-extrabold px-8 py-4 rounded-full text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px] min-w-[160px]"
          >
            ▶ Play
          </button>
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="text-xs px-3 py-2 bg-black/30 rounded-full min-h-[40px]"
          >
            {muted ? "🔇 Muted" : "🔊 Sound"}
          </button>
        </div>
      )}

      {phase === "playing" && (
        <div className="w-full flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-100 p-4 shadow-2xl border-2 border-sky-300 flex-1">
          {/* HUD */}
          <div className="flex items-center justify-between text-sm">
            <div className="font-bold text-indigo-700">
              Round <span className="text-2xl">{roundIdx + 1}</span>/{ROUNDS_PER_GAME}
            </div>
            <div className="font-bold text-green-700">
              Score <span className="text-2xl">{score}</span>
            </div>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-xs px-3 py-2 bg-sky-200 text-sky-900 rounded-full min-h-[40px]"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          <div className="text-center text-xs font-bold uppercase tracking-wider text-indigo-500">
            {precisionLabel}
          </div>

          {/* Clock */}
          <div
            className={`flex items-center justify-center rounded-xl p-3 transition-colors ${
              feedback === "right"
                ? "bg-green-200"
                : feedback === "wrong"
                ? "bg-red-200"
                : "bg-white/80"
            }`}
            style={{ transform: `scale(${1 + (tickPulse % 2) * 0.005})` }}
          >
            <AnalogClock hours={round.hours} minutes={round.minutes} />
          </div>

          <p className="text-center text-lg font-bold text-indigo-900">
            What time is it?
          </p>

          {/* Choices */}
          <div className="grid grid-cols-2 gap-3">
            {round.choices.map((c) => {
              const isPicked = picked === c;
              const isCorrect = feedback !== "none" && c === round.answer;
              const isWrongPick = feedback === "wrong" && isPicked;
              return (
                <button
                  key={c}
                  onClick={() => handlePick(c)}
                  disabled={feedback !== "none"}
                  className={`min-h-[64px] rounded-xl text-2xl font-extrabold border-2 transition-all shadow-md active:scale-95 ${
                    isCorrect
                      ? "bg-green-400 border-green-700 text-white"
                      : isWrongPick
                      ? "bg-red-400 border-red-700 text-white"
                      : "bg-white border-indigo-400 text-indigo-700 hover:bg-indigo-100"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === "finished" && (
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-6 text-white shadow-2xl border-2 border-indigo-300 flex-1">
          <div className="text-6xl">⏰🏆</div>
          <h2 className="text-3xl font-extrabold">Time's Up!</h2>
          <p className="text-xl">
            Score: <span className="font-extrabold text-4xl">{score}</span> / {ROUNDS_PER_GAME}
          </p>
          <p className="text-sm">Best: {Math.max(best, score)} / {ROUNDS_PER_GAME}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={startGame}
              className="bg-white text-indigo-700 font-extrabold px-6 py-4 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px]"
            >
              ▶ Play Again
            </button>
            <a
              href="/games"
              className="bg-black/30 text-white font-bold px-6 py-4 rounded-full text-lg shadow-lg hover:bg-black/40 transition-colors min-h-[56px] inline-flex items-center"
            >
              🏠 Home
            </a>
          </div>
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="text-xs px-3 py-2 bg-black/30 rounded-full min-h-[40px]"
          >
            {muted ? "🔇 Muted" : "🔊 Sound"}
          </button>
        </div>
      )}
    </div>
  );
}
