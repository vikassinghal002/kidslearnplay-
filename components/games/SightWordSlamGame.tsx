"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "menu" | "playing" | "finished";

const SIGHT_WORDS = [
  "the", "and", "was", "said", "they", "what",
  "have", "with", "this", "that", "then", "here",
  "some", "come", "from", "your", "when", "will",
  "make", "like", "look", "want", "where", "very",
];

const START_LIVES = 3;
const TOTAL_ROUNDS = 20;

interface RoundData {
  grid: string[]; // 6 words in grid
  target: string; // prompt
  timeLimit: number; // ms
}

function makeRound(idx: number): RoundData {
  const shuffled = [...SIGHT_WORDS].sort(() => Math.random() - 0.5);
  const grid = shuffled.slice(0, 6);
  const target = grid[Math.floor(Math.random() * grid.length)];
  // Speed ramps: start 2500ms, end 1200ms
  const timeLimit = Math.max(1200, 2500 - idx * 65);
  return { grid, target, timeLimit };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SightWordSlamGame() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [round, setRound] = useState<RoundData>(() => makeRound(0));
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [timerPct, setTimerPct] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "right" | "wrong">("none");
  const [picked, setPicked] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const roundStartRef = useRef<number>(0);
  const roundLockedRef = useRef(false);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (phase === "playing") startMusic("quirky");
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && !mutedRef.current) {
      startMusic("quirky");
    }
    return () => {
      stopMusic();
    };
  }, [phase]);

  // Timer + auto-advance
  useEffect(() => {
    if (phase !== "playing" || feedback !== "none") return;
    roundStartRef.current = performance.now();
    roundLockedRef.current = false;
    setTimerPct(0);

    const tick = () => {
      const elapsed = performance.now() - roundStartRef.current;
      const pct = Math.min(1, elapsed / round.timeLimit);
      setTimerPct(pct);
      if (pct >= 1 && !roundLockedRef.current) {
        roundLockedRef.current = true;
        setFeedback("wrong");
        setLives((l) => l - 1);
        if (!mutedRef.current) sfx.wrong();
        setTimeout(() => advanceRound(), 500);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round, feedback]);

  const advanceRound = useCallback(() => {
    setFeedback("none");
    setPicked(null);
    setRoundIdx((i) => {
      const ni = i + 1;
      if (ni >= TOTAL_ROUNDS) {
        setPhase("finished");
        stopMusic();
        setBest((b) => Math.max(b, score));
        if (!mutedRef.current) sfx.levelUp();
        return i;
      }
      setRound(makeRound(ni));
      return ni;
    });
  }, [score]);

  // Game over on lives 0
  useEffect(() => {
    if (phase === "playing" && lives <= 0) {
      setPhase("finished");
      stopMusic();
      setBest((b) => Math.max(b, score));
      if (!mutedRef.current) sfx.die();
    }
  }, [lives, phase, score]);

  const startGame = useCallback(() => {
    setRound(makeRound(0));
    setRoundIdx(0);
    setScore(0);
    setLives(START_LIVES);
    setFeedback("none");
    setPicked(null);
    setTimerPct(0);
    setPhase("playing");
    if (!mutedRef.current) sfx.click();
  }, []);

  const handlePick = useCallback(
    (word: string) => {
      if (feedback !== "none" || roundLockedRef.current) return;
      roundLockedRef.current = true;
      setPicked(word);
      if (!mutedRef.current) sfx.pop();
      const correct = word === round.target;
      if (correct) {
        setScore((s) => s + 1);
        setFeedback("right");
        if (!mutedRef.current) sfx.correct();
      } else {
        setFeedback("wrong");
        setLives((l) => l - 1);
        if (!mutedRef.current) sfx.wrong();
      }
      setTimeout(() => advanceRound(), 500);
    },
    [feedback, round.target, advanceRound]
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
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-700 p-6 text-white shadow-2xl border-2 border-fuchsia-300 flex-1">
          <div className="text-6xl">👆</div>
          <h2 className="text-3xl font-extrabold text-center drop-shadow">Sight Word Slam</h2>
          <p className="text-center text-white/90 text-sm max-w-xs">
            Tap the right sight word fast! Speed ramps up with each round. 3 lives, 20 rounds.
          </p>
          {best > 0 && (
            <p className="text-xs bg-black/30 px-3 py-1 rounded-full">Best: {best}</p>
          )}
          <button
            onClick={startGame}
            className="bg-yellow-300 text-purple-900 font-extrabold px-8 py-4 rounded-full text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px] min-w-[160px]"
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
        <div
          className={`w-full flex flex-col gap-3 rounded-2xl p-4 shadow-2xl border-2 border-purple-500 flex-1 transition-colors ${
            feedback === "right" ? "bg-green-100" : feedback === "wrong" ? "bg-red-100" : "bg-gradient-to-b from-fuchsia-50 to-purple-100"
          }`}
        >
          {/* HUD */}
          <div className="flex items-center justify-between text-sm">
            <div className="font-bold text-purple-800">
              Round <span className="text-2xl">{roundIdx + 1}</span>/{TOTAL_ROUNDS}
            </div>
            <div className="font-bold text-red-600">{"❤️".repeat(Math.max(0, lives))}</div>
            <div className="font-bold text-purple-800">
              Score <span className="text-2xl">{score}</span>
            </div>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-xs px-2 py-2 bg-purple-200 text-purple-900 rounded-full min-h-[40px]"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* Target */}
          <div className="bg-white/90 rounded-xl p-4 shadow-inner text-center">
            <p className="text-xs text-purple-600 font-bold uppercase mb-1">Tap</p>
            <p className="text-5xl font-extrabold text-purple-900">{round.target}</p>
          </div>

          {/* Timer bar */}
          <div className="w-full bg-white rounded-full h-3 border-2 border-purple-600 overflow-hidden shadow-inner">
            <div
              className={`h-full transition-none ${
                timerPct < 0.6 ? "bg-green-500" : timerPct < 0.85 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${(1 - timerPct) * 100}%` }}
            />
          </div>

          {/* 3×2 grid of word cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
            {round.grid.map((w) => {
              const isPicked = picked === w;
              const isCorrect = feedback !== "none" && w === round.target;
              const isWrongPick = feedback === "wrong" && isPicked;
              return (
                <button
                  key={w}
                  onClick={() => handlePick(w)}
                  disabled={feedback !== "none"}
                  className={`min-h-[72px] rounded-2xl text-2xl font-extrabold border-2 transition-all shadow-md active:scale-95 ${
                    isCorrect
                      ? "bg-green-400 border-green-700 text-white scale-105"
                      : isWrongPick
                      ? "bg-red-400 border-red-700 text-white"
                      : "bg-gradient-to-br from-white to-purple-100 border-purple-400 text-purple-700 hover:from-purple-50 hover:to-purple-200"
                  }`}
                >
                  {w}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === "finished" && (
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-fuchsia-700 to-purple-900 p-6 text-white shadow-2xl border-2 border-fuchsia-300 flex-1">
          <div className="text-6xl">{lives > 0 ? "🏆" : "💥"}</div>
          <h2 className="text-3xl font-extrabold">{lives > 0 ? "Slammed!" : "Game Over"}</h2>
          <p className="text-xl">
            Score: <span className="font-extrabold text-4xl">{score}</span>
          </p>
          <p className="text-sm">Best: {Math.max(best, score)}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={startGame}
              className="bg-yellow-300 text-purple-900 font-extrabold px-6 py-4 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px]"
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
