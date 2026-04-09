"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "menu" | "playing" | "finished";

const ROUNDS_PER_GAME = 10;

const COINS = [
  { name: "penny", value: 1, emoji: "🪙", color: "#b45309", label: "1¢" },
  { name: "nickel", value: 5, emoji: "🪙", color: "#64748b", label: "5¢" },
  { name: "dime", value: 10, emoji: "🪙", color: "#94a3b8", label: "10¢" },
  { name: "quarter", value: 25, emoji: "🪙", color: "#78350f", label: "25¢" },
];

function pickTarget(index: number): number {
  // Ramp difficulty: small targets early, bigger later
  const maxMultiplier = index < 3 ? 20 : index < 6 ? 50 : 99;
  const min = index < 3 ? 5 : 10;
  let value = Math.floor(Math.random() * (maxMultiplier - min + 1)) + min;
  // Ensure it's achievable with our coins (always true for 1-99 since we have pennies)
  return value;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MoneyMatchGame() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [roundIdx, setRoundIdx] = useState(0);
  const [target, setTarget] = useState<number>(() => pickTarget(0));
  const [sum, setSum] = useState(0);
  const [picked, setPicked] = useState<number[]>([]); // coin values tapped
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "right" | "over">("none");
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
    setRoundIdx(0);
    setTarget(pickTarget(0));
    setSum(0);
    setPicked([]);
    setScore(0);
    setFeedback("none");
    setPhase("playing");
    if (!mutedRef.current) sfx.click();
  }, []);

  const nextRound = useCallback(
    (newScore: number) => {
      if (roundIdx + 1 >= ROUNDS_PER_GAME) {
        setPhase("finished");
        stopMusic();
        setBest((b) => Math.max(b, newScore));
        if (!mutedRef.current) sfx.levelUp();
      } else {
        setRoundIdx((i) => i + 1);
        setTarget(pickTarget(roundIdx + 1));
        setSum(0);
        setPicked([]);
        setFeedback("none");
      }
    },
    [roundIdx]
  );

  const tapCoin = useCallback(
    (value: number) => {
      if (feedback !== "none") return;
      const newSum = sum + value;
      const newPicked = [...picked, value];
      setSum(newSum);
      setPicked(newPicked);
      if (!mutedRef.current) sfx.coin();

      if (newSum === target) {
        setFeedback("right");
        if (!mutedRef.current) sfx.correct();
        const newScore = score + 1;
        setScore(newScore);
        setTimeout(() => nextRound(newScore), 700);
      } else if (newSum > target) {
        setFeedback("over");
        if (!mutedRef.current) sfx.wrong();
        // Reset after short pause
        setTimeout(() => {
          setSum(0);
          setPicked([]);
          setFeedback("none");
        }, 700);
      }
    },
    [feedback, sum, picked, target, score, nextRound]
  );

  const undoLast = useCallback(() => {
    if (feedback !== "none" || picked.length === 0) return;
    const last = picked[picked.length - 1];
    setPicked((p) => p.slice(0, -1));
    setSum((s) => s - last);
    if (!mutedRef.current) sfx.click();
  }, [feedback, picked]);

  const resetCoins = useCallback(() => {
    if (feedback !== "none") return;
    setPicked([]);
    setSum(0);
    if (!mutedRef.current) sfx.click();
  }, [feedback]);

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
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 p-6 text-white shadow-2xl border-2 border-yellow-300 flex-1">
          <div className="text-6xl">💰</div>
          <h2 className="text-3xl font-extrabold text-center drop-shadow">Money Match</h2>
          <p className="text-center text-white/95 text-sm max-w-xs">
            Tap the coins to make the target amount. Count pennies, nickels, dimes and quarters!
          </p>
          {best > 0 && (
            <p className="text-xs bg-black/20 px-3 py-1 rounded-full">Best: {best} / {ROUNDS_PER_GAME}</p>
          )}
          <button
            onClick={startGame}
            className="bg-white text-amber-700 font-extrabold px-8 py-4 rounded-full text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px] min-w-[160px]"
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
        <div className="w-full flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-100 p-4 shadow-2xl border-2 border-amber-300 flex-1">
          {/* HUD */}
          <div className="flex items-center justify-between text-sm">
            <div className="font-bold text-amber-700">
              Round <span className="text-2xl">{roundIdx + 1}</span>/{ROUNDS_PER_GAME}
            </div>
            <div className="font-bold text-green-700">
              Score <span className="text-2xl">{score}</span>
            </div>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-xs px-3 py-2 bg-amber-200 text-amber-900 rounded-full min-h-[40px]"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* Target */}
          <div
            className={`rounded-xl p-4 text-center transition-colors ${
              feedback === "right"
                ? "bg-green-200 border-2 border-green-600"
                : feedback === "over"
                ? "bg-red-200 border-2 border-red-600"
                : "bg-white/90 border-2 border-amber-400"
            }`}
          >
            <div className="text-xs uppercase tracking-wider text-amber-700 font-bold">Make</div>
            <div className="text-5xl font-extrabold text-amber-900">{target}¢</div>
            <div className="text-sm mt-1 text-slate-700">
              So far:{" "}
              <span className={sum > target ? "text-red-700 font-bold" : "font-bold"}>{sum}¢</span>
            </div>
          </div>

          {/* Coins row */}
          <div className="grid grid-cols-4 gap-2">
            {COINS.map((coin) => (
              <button
                key={coin.name}
                onClick={() => tapCoin(coin.value)}
                disabled={feedback !== "none"}
                className="flex flex-col items-center gap-1 bg-white rounded-xl p-2 border-2 border-amber-400 shadow-md active:scale-95 hover:bg-amber-50 transition-all min-h-[80px]"
              >
                <div className="text-3xl">🪙</div>
                <div className="text-xs font-bold text-amber-800">{coin.label}</div>
                <div className="text-[10px] text-slate-500">{coin.name}</div>
              </button>
            ))}
          </div>

          {/* Picked coins preview */}
          <div className="min-h-[48px] rounded-xl bg-white/70 border border-amber-300 p-2 flex flex-wrap gap-1 items-center justify-center">
            {picked.length === 0 && (
              <span className="text-xs text-slate-500">Tap coins above to add them up</span>
            )}
            {picked.map((v, i) => (
              <span
                key={i}
                className="bg-amber-200 text-amber-900 font-bold text-xs rounded-full px-2 py-1"
              >
                {v}¢
              </span>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={undoLast}
              disabled={feedback !== "none" || picked.length === 0}
              className="px-4 py-2 bg-slate-300 text-slate-800 font-bold rounded-full text-sm min-h-[44px] disabled:opacity-40"
            >
              ↶ Undo
            </button>
            <button
              onClick={resetCoins}
              disabled={feedback !== "none" || picked.length === 0}
              className="px-4 py-2 bg-red-200 text-red-800 font-bold rounded-full text-sm min-h-[44px] disabled:opacity-40"
            >
              ✕ Reset
            </button>
          </div>
        </div>
      )}

      {phase === "finished" && (
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-2xl border-2 border-green-300 flex-1">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-extrabold">Money Master!</h2>
          <p className="text-xl">
            Score: <span className="font-extrabold text-4xl">{score}</span> / {ROUNDS_PER_GAME}
          </p>
          <p className="text-sm">Best: {Math.max(best, score)} / {ROUNDS_PER_GAME}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={startGame}
              className="bg-white text-emerald-700 font-extrabold px-6 py-4 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px]"
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
