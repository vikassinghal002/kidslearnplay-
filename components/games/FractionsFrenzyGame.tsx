"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "menu" | "playing" | "finished";

interface Round {
  numerator: number;
  denominator: number;
  choices: string[]; // as "a/b" strings
  answer: string;
}

const ROUNDS_PER_GAME = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function fractionKey(n: number, d: number): string {
  return `${n}/${d}`;
}

function makeRound(index: number): Round {
  // Difficulty ramps: rounds 0-2 denominators 2-4, 3-5: 2-6, 6-9: 2-8
  const maxD = index < 3 ? 4 : index < 6 ? 6 : 8;
  const denominator = Math.floor(Math.random() * (maxD - 1)) + 2; // 2..maxD
  const numerator = Math.floor(Math.random() * (denominator - 1)) + 1; // 1..denominator-1

  const answer = fractionKey(numerator, denominator);

  // Build 3 distractors
  const set = new Set<string>([answer]);
  let attempts = 0;
  while (set.size < 4 && attempts < 50) {
    attempts++;
    const d2 = Math.floor(Math.random() * (maxD - 1)) + 2;
    const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
    const key = fractionKey(n2, d2);
    // Skip if equivalent to answer (e.g. 2/4 vs 1/2)
    const simKey = (() => {
      const g = gcd(n2, d2);
      return `${n2 / g}/${d2 / g}`;
    })();
    const simAns = (() => {
      const g = gcd(numerator, denominator);
      return `${numerator / g}/${denominator / g}`;
    })();
    if (simKey === simAns) continue;
    set.add(key);
  }
  // Fallback — ensure we have 4
  let fill = 1;
  while (set.size < 4) {
    set.add(`${fill}/${denominator + fill}`);
    fill++;
  }

  const choices = Array.from(set).sort(() => Math.random() - 0.5);
  return { numerator, denominator, choices, answer };
}

// Build SVG path for a pie slice from angle a1 to a2 (radians)
function slicePath(cx: number, cy: number, r: number, a1: number, a2: number): string {
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2);
  const y2 = cy + r * Math.sin(a2);
  const largeArc = a2 - a1 > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FractionsFrenzyGame() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [round, setRound] = useState<Round>(() => makeRound(0));
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "right" | "wrong">("none");
  const [picked, setPicked] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  // Sync muted
  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (phase === "playing") startMusic("quirky");
  }, [phase]);

  // Start music / cleanup
  useEffect(() => {
    if (phase === "playing" && !mutedRef.current) {
      startMusic("quirky");
    }
    return () => {
      stopMusic();
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

      // Advance after short delay
      setTimeout(() => {
        setFeedback("none");
        setPicked(null);
        if (roundIdx + 1 >= ROUNDS_PER_GAME) {
          setPhase("finished");
          stopMusic();
          setBest((b) => {
            const nb = Math.max(b, correct ? score + 1 : score);
            return nb;
          });
          if (!mutedRef.current) sfx.levelUp();
        } else {
          setRoundIdx((i) => i + 1);
          setRound(makeRound(roundIdx + 1));
        }
      }, 700);
    },
    [feedback, round.answer, roundIdx, score]
  );

  // ─── Render SVG pie ─────────────────────────────────────────────────────────
  const R = 90;
  const CX = 100;
  const CY = 100;
  const slices = [];
  const { numerator, denominator } = round;
  for (let i = 0; i < denominator; i++) {
    const a1 = (i / denominator) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / denominator) * Math.PI * 2 - Math.PI / 2;
    const filled = i < numerator;
    slices.push(
      <path
        key={i}
        d={slicePath(CX, CY, R, a1, a2)}
        fill={filled ? "#f97316" : "#fef3c7"}
        stroke="#78350f"
        strokeWidth={2}
      />
    );
  }

  // ─── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col items-center gap-3 select-none w-full px-3 py-3"
      style={{
        maxWidth: "min(100%, 520px)",
        margin: "0 auto",
        minHeight: "calc(100dvh - 80px)",
      }}
    >
      {phase === "menu" && (
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 p-6 text-white shadow-2xl border-2 border-orange-300 flex-1">
          <div className="text-6xl">🍕</div>
          <h2 className="text-3xl font-extrabold text-center drop-shadow">Fractions Frenzy</h2>
          <p className="text-center text-white/90 text-sm max-w-xs">
            Look at the pizza! What fraction is shaded? Pick the matching fraction. 10 rounds.
          </p>
          {best > 0 && (
            <p className="text-xs bg-black/20 px-3 py-1 rounded-full">Best: {best} / {ROUNDS_PER_GAME}</p>
          )}
          <button
            onClick={startGame}
            className="bg-white text-orange-600 font-extrabold px-8 py-4 rounded-full text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px] min-w-[160px]"
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
        <div className="w-full flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100 p-4 shadow-2xl border-2 border-orange-300 flex-1">
          {/* HUD */}
          <div className="flex items-center justify-between text-sm">
            <div className="font-bold text-orange-700">
              Round <span className="text-2xl">{roundIdx + 1}</span>/{ROUNDS_PER_GAME}
            </div>
            <div className="font-bold text-pink-700">
              Score <span className="text-2xl">{score}</span>
            </div>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-xs px-3 py-2 bg-orange-200 text-orange-900 rounded-full min-h-[40px]"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* Pie chart */}
          <div
            className={`flex items-center justify-center rounded-xl p-3 transition-colors ${
              feedback === "right"
                ? "bg-green-200"
                : feedback === "wrong"
                ? "bg-red-200"
                : "bg-white/70"
            }`}
          >
            <svg viewBox="0 0 200 200" className="w-full max-w-[240px] h-auto">
              {slices}
            </svg>
          </div>

          <p className="text-center text-lg font-bold text-orange-900">
            What fraction is shaded?
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
                  className={`min-h-[64px] rounded-xl text-3xl font-extrabold border-2 transition-all shadow-md active:scale-95 ${
                    isCorrect
                      ? "bg-green-400 border-green-700 text-white"
                      : isWrongPick
                      ? "bg-red-400 border-red-700 text-white"
                      : "bg-white border-orange-400 text-orange-700 hover:bg-orange-100"
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
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 p-6 text-white shadow-2xl border-2 border-pink-300 flex-1">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-extrabold">Finished!</h2>
          <p className="text-xl">
            Score: <span className="font-extrabold text-4xl">{score}</span> / {ROUNDS_PER_GAME}
          </p>
          <p className="text-sm">Best: {Math.max(best, score)} / {ROUNDS_PER_GAME}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={startGame}
              className="bg-white text-purple-700 font-extrabold px-6 py-4 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px]"
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
