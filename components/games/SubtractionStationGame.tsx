"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "menu" | "playing" | "finished";

interface Round {
  a: number;
  b: number;
  answer: number;
  choices: number[];
}

const TOTAL_ROUNDS = 12;

function makeRound(idx: number): Round {
  // Difficulty ramps: early rounds max 10, later up to 20
  const max = idx < 4 ? 10 : idx < 8 ? 15 : 20;
  const a = Math.floor(Math.random() * (max - 1)) + 2; // 2..max
  const b = Math.floor(Math.random() * a); // 0..a-1
  const answer = a - b;

  const set = new Set<number>([answer]);
  while (set.size < 4) {
    const delta = Math.floor(Math.random() * 6) - 3;
    const v = answer + delta;
    if (v >= 0 && v <= 30) set.add(v);
  }
  const choices = Array.from(set).sort(() => Math.random() - 0.5);
  return { a, b, answer, choices };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubtractionStationGame() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [round, setRound] = useState<Round>(() => makeRound(0));
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "right" | "wrong">("none");
  const [picked, setPicked] = useState<number | null>(null);
  const [puff, setPuff] = useState(false);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (phase === "playing") startMusic("playful");
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && !mutedRef.current) {
      startMusic("playful");
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
    (choice: number) => {
      if (feedback !== "none") return;
      setPicked(choice);
      if (!mutedRef.current) sfx.click();
      const correct = choice === round.answer;
      if (correct) {
        setScore((s) => s + 1);
        setFeedback("right");
        setPuff(true);
        if (!mutedRef.current) sfx.correct();
      } else {
        setFeedback("wrong");
        if (!mutedRef.current) sfx.wrong();
      }

      setTimeout(() => {
        setFeedback("none");
        setPicked(null);
        setPuff(false);
        if (roundIdx + 1 >= TOTAL_ROUNDS) {
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
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-700 p-6 text-white shadow-2xl border-2 border-sky-200 flex-1">
          <div className="text-6xl">🚂</div>
          <h2 className="text-3xl font-extrabold text-center drop-shadow">Subtraction Station</h2>
          <p className="text-center text-white/90 text-sm max-w-xs">
            All aboard! Pick the right passenger-number to solve each subtraction problem. 12 rounds.
          </p>
          {best > 0 && (
            <p className="text-xs bg-black/30 px-3 py-1 rounded-full">Best: {best} / {TOTAL_ROUNDS}</p>
          )}
          <button
            onClick={startGame}
            className="bg-yellow-300 text-blue-900 font-extrabold px-8 py-4 rounded-full text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px] min-w-[160px]"
          >
            ▶ Start Train
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
        <div className="w-full flex flex-col gap-3 rounded-2xl bg-gradient-to-b from-sky-200 to-sky-400 p-4 shadow-2xl border-2 border-sky-500 flex-1">
          {/* HUD */}
          <div className="flex items-center justify-between text-sm">
            <div className="font-bold text-blue-900">
              Car <span className="text-2xl">{roundIdx + 1}</span>/{TOTAL_ROUNDS}
            </div>
            <div className="font-bold text-blue-900">
              Score <span className="text-2xl">{score}</span>
            </div>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-xs px-3 py-2 bg-blue-200 text-blue-900 rounded-full min-h-[40px]"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* Train SVG */}
          <div
            className={`flex items-center justify-center rounded-xl p-3 transition-colors ${
              feedback === "right" ? "bg-green-200" : feedback === "wrong" ? "bg-red-200" : "bg-white/70"
            }`}
          >
            <svg viewBox="0 0 320 140" className="w-full max-w-[320px] h-auto">
              {/* Smoke puffs */}
              {puff && (
                <>
                  <circle cx="50" cy="20" r="10" fill="#e5e7eb" />
                  <circle cx="65" cy="10" r="8" fill="#d1d5db" />
                  <circle cx="35" cy="12" r="8" fill="#f3f4f6" />
                </>
              )}
              {/* Engine */}
              <rect x="30" y="50" width="70" height="50" rx="6" fill="#dc2626" stroke="#7f1d1d" strokeWidth="3" />
              <rect x="50" y="30" width="30" height="25" fill="#991b1b" stroke="#7f1d1d" strokeWidth="3" />
              <circle cx="65" cy="25" r="6" fill="#fbbf24" />
              <circle cx="50" cy="105" r="10" fill="#1f2937" stroke="#000" strokeWidth="2" />
              <circle cx="85" cy="105" r="10" fill="#1f2937" stroke="#000" strokeWidth="2" />
              {/* Car with equation */}
              <rect x="115" y="45" width="180" height="60" rx="8" fill="#fbbf24" stroke="#78350f" strokeWidth="3" />
              <text x="205" y="85" textAnchor="middle" fontSize="28" fontWeight="900" fill="#78350f">
                {round.a} − {round.b} = ?
              </text>
              <circle cx="140" cy="110" r="10" fill="#1f2937" stroke="#000" strokeWidth="2" />
              <circle cx="270" cy="110" r="10" fill="#1f2937" stroke="#000" strokeWidth="2" />
              {/* Track */}
              <line x1="0" y1="125" x2="320" y2="125" stroke="#78350f" strokeWidth="4" />
            </svg>
          </div>

          <p className="text-center text-sm font-bold text-blue-900">
            Tap the passenger with the correct answer!
          </p>

          {/* Choices — passenger buttons */}
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
                  className={`min-h-[72px] rounded-full text-3xl font-extrabold border-2 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                    isCorrect
                      ? "bg-green-400 border-green-700 text-white"
                      : isWrongPick
                      ? "bg-red-400 border-red-700 text-white"
                      : "bg-white border-blue-400 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  <span className="text-2xl">🧑</span>
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === "finished" && (
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 p-6 text-white shadow-2xl border-2 border-sky-300 flex-1">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-extrabold">End of the Line!</h2>
          <p className="text-xl">
            Score: <span className="font-extrabold text-4xl">{score}</span> / {TOTAL_ROUNDS}
          </p>
          <p className="text-sm">Best: {Math.max(best, score)} / {TOTAL_ROUNDS}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={startGame}
              className="bg-yellow-300 text-blue-900 font-extrabold px-6 py-4 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px]"
            >
              ▶ Play Again
            </button>
            <a
              href="/games"
              className="bg-black/40 text-white font-bold px-6 py-4 rounded-full text-lg shadow-lg hover:bg-black/60 transition-colors min-h-[56px] inline-flex items-center"
            >
              🏠 Home
            </a>
          </div>
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="text-xs px-3 py-2 bg-black/40 rounded-full min-h-[40px]"
          >
            {muted ? "🔇 Muted" : "🔊 Sound"}
          </button>
        </div>
      )}
    </div>
  );
}
