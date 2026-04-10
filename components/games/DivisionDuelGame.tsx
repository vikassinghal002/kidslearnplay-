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

const WIN_SCORE = 5;
const TIMER_MS = 6000; // time per question

function makeRound(playerWins: number): Round {
  // Difficulty ramps with score
  const maxB = 6 + Math.min(6, playerWins);
  const b = Math.floor(Math.random() * (maxB - 1)) + 2; // 2..maxB
  const answer = Math.floor(Math.random() * 10) + 1; // 1..10
  const a = b * answer;

  const set = new Set<number>([answer]);
  while (set.size < 4) {
    const delta = Math.floor(Math.random() * 6) - 3;
    const v = answer + delta;
    if (v > 0 && v !== answer) set.add(v);
  }
  const choices = Array.from(set).sort(() => Math.random() - 0.5);
  return { a, b, answer, choices };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DivisionDuelGame() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [round, setRound] = useState<Round>(() => makeRound(0));
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "right" | "wrong" | "timeout">("none");
  const [picked, setPicked] = useState<number | null>(null);
  const [timerPct, setTimerPct] = useState(0);
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
    else if (phase === "playing") startMusic("quest");
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && !mutedRef.current) {
      startMusic("quest");
    }
    return () => {
      stopMusic();
    };
  }, [phase]);

  // Timer loop
  useEffect(() => {
    if (phase !== "playing" || feedback !== "none") return;
    roundStartRef.current = performance.now();
    roundLockedRef.current = false;
    setTimerPct(0);

    const tick = () => {
      const elapsed = performance.now() - roundStartRef.current;
      const pct = Math.min(1, elapsed / TIMER_MS);
      setTimerPct(pct);
      if (pct >= 1 && !roundLockedRef.current) {
        roundLockedRef.current = true;
        setFeedback("timeout");
        setCpuScore((c) => c + 1);
        if (!mutedRef.current) sfx.wrong();
        setTimeout(() => advanceRound(), 800);
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
    // Check win/loss after state updates using functional updates
    setPlayerScore((ps) => {
      setCpuScore((cs) => {
        if (ps >= WIN_SCORE || cs >= WIN_SCORE) {
          setPhase("finished");
          stopMusic();
          setBest((b) => Math.max(b, ps));
          if (ps >= WIN_SCORE) {
            if (!mutedRef.current) sfx.levelUp();
          } else {
            if (!mutedRef.current) sfx.die();
          }
        } else {
          setRound(makeRound(ps));
        }
        return cs;
      });
      return ps;
    });
  }, []);

  const startGame = useCallback(() => {
    setRound(makeRound(0));
    setPlayerScore(0);
    setCpuScore(0);
    setFeedback("none");
    setPicked(null);
    setTimerPct(0);
    setPhase("playing");
    if (!mutedRef.current) sfx.click();
  }, []);

  const handlePick = useCallback(
    (choice: number) => {
      if (feedback !== "none" || roundLockedRef.current) return;
      roundLockedRef.current = true;
      setPicked(choice);
      if (!mutedRef.current) sfx.click();
      const correct = choice === round.answer;
      if (correct) {
        setPlayerScore((s) => s + 1);
        setFeedback("right");
        if (!mutedRef.current) sfx.correct();
      } else {
        setCpuScore((s) => s + 1);
        setFeedback("wrong");
        if (!mutedRef.current) sfx.wrong();
      }
      setTimeout(() => advanceRound(), 700);
    },
    [feedback, round.answer, advanceRound]
  );

  const playerWon = playerScore >= WIN_SCORE;

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
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-red-700 via-orange-700 to-amber-700 p-6 text-white shadow-2xl border-2 border-red-300 flex-1">
          <div className="text-6xl">⚔️</div>
          <h2 className="text-3xl font-extrabold text-center drop-shadow">Division Duel</h2>
          <p className="text-center text-white/90 text-sm max-w-xs">
            Beat the CPU timer! Answer division problems before the bar fills. First to 5 wins the duel.
          </p>
          {best > 0 && (
            <p className="text-xs bg-black/40 px-3 py-1 rounded-full">Best player score: {best}</p>
          )}
          <button
            onClick={startGame}
            className="bg-yellow-300 text-red-900 font-extrabold px-8 py-4 rounded-full text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px] min-w-[160px]"
          >
            ⚔️ Begin Duel
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
        <div className="w-full flex flex-col gap-3 rounded-2xl bg-gradient-to-b from-amber-100 to-red-100 p-4 shadow-2xl border-2 border-red-500 flex-1">
          {/* HUD — scores */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col items-center bg-blue-500 text-white rounded-xl px-3 py-2 min-w-[80px]">
              <span className="text-lg">🧒 You</span>
              <span className="text-3xl font-extrabold">{playerScore}</span>
            </div>
            <div className="text-2xl font-extrabold text-red-700">VS</div>
            <div className="flex flex-col items-center bg-red-600 text-white rounded-xl px-3 py-2 min-w-[80px]">
              <span className="text-lg">🤖 CPU</span>
              <span className="text-3xl font-extrabold">{cpuScore}</span>
            </div>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-xs px-2 py-2 bg-red-200 text-red-900 rounded-full min-h-[40px]"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* CPU timer bar */}
          <div className="w-full bg-white rounded-full h-4 border-2 border-red-600 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-700 transition-none"
              style={{ width: `${timerPct * 100}%` }}
            />
          </div>

          {/* Question */}
          <div
            className={`flex items-center justify-center rounded-xl p-6 transition-colors ${
              feedback === "right"
                ? "bg-green-200"
                : feedback === "wrong" || feedback === "timeout"
                ? "bg-red-200"
                : "bg-white/90"
            }`}
          >
            <p className="text-4xl sm:text-5xl font-extrabold text-red-800">
              {round.a} ÷ {round.b} = ?
            </p>
          </div>

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
                      : "bg-white border-red-400 text-red-700 hover:bg-red-100"
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
        <div
          className={`w-full flex flex-col items-center justify-center gap-4 rounded-2xl p-6 text-white shadow-2xl border-2 flex-1 ${
            playerWon
              ? "bg-gradient-to-br from-green-600 to-emerald-800 border-green-300"
              : "bg-gradient-to-br from-red-700 to-gray-900 border-red-300"
          }`}
        >
          <div className="text-6xl">{playerWon ? "🏆" : "💀"}</div>
          <h2 className="text-3xl font-extrabold">{playerWon ? "Victory!" : "Defeated!"}</h2>
          <p className="text-xl">
            You: {playerScore} · CPU: {cpuScore}
          </p>
          <p className="text-sm">Best player score: {Math.max(best, playerScore)}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={startGame}
              className="bg-white text-red-700 font-extrabold px-6 py-4 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px]"
            >
              ⚔️ Rematch
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
