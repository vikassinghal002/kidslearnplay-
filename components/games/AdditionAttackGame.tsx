"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "menu" | "playing" | "finished";

interface Asteroid {
  id: number;
  x: number;      // 0..1 across width
  y: number;      // 0..1 down height
  value: number;  // number shown
  speed: number;  // per-frame fraction of height
  correct: boolean;
  hit?: boolean;
}

interface Question {
  a: number;
  b: number;
  answer: number;
}

const TOTAL_ROUNDS = 15;
const START_LIVES = 3;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeQuestion(roundIdx: number): Question {
  // Difficulty ramps: 0-4 single digit, 5-9 up to 20, 10-14 up to 50
  const max = roundIdx < 5 ? 9 : roundIdx < 10 ? 20 : 50;
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * max) + 1;
  return { a, b, answer: a + b };
}

function makeAsteroids(question: Question, roundIdx: number, nextIdRef: { v: number }): Asteroid[] {
  const count = roundIdx < 4 ? 3 : 4;
  const baseSpeed = 0.0012 + roundIdx * 0.00018; // per frame
  const values = new Set<number>([question.answer]);
  while (values.size < count) {
    const delta = (Math.floor(Math.random() * 6) + 1) * (Math.random() < 0.5 ? -1 : 1);
    const v = question.answer + delta;
    if (v > 0 && v !== question.answer) values.add(v);
  }
  const arr = Array.from(values).sort(() => Math.random() - 0.5);
  // Spread horizontally
  return arr.map((v, i) => ({
    id: nextIdRef.v++,
    x: (i + 0.5) / count,
    y: -0.1 - Math.random() * 0.2,
    value: v,
    speed: baseSpeed * (0.9 + Math.random() * 0.3),
    correct: v === question.answer,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdditionAttackGame() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [question, setQuestion] = useState<Question>(() => makeQuestion(0));
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [flash, setFlash] = useState<"none" | "right" | "wrong">("none");
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const nextIdRef = useRef({ v: 1 });
  const advancingRef = useRef(false);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (phase === "playing") startMusic("space");
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && !mutedRef.current) {
      startMusic("space");
    }
    return () => {
      stopMusic();
    };
  }, [phase]);

  // Game loop — move asteroids
  useEffect(() => {
    if (phase !== "playing") return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;
      setAsteroids((prev) => {
        const moved = prev.map((a) => ({ ...a, y: a.y + a.speed * (dt / 16.67) }));
        // Check if correct asteroid escaped
        const correctEscaped = moved.find((a) => a.correct && a.y > 1.05);
        if (correctEscaped && !advancingRef.current) {
          advancingRef.current = true;
          if (!mutedRef.current) sfx.die();
          setFlash("wrong");
          setLives((l) => l - 1);
          setTimeout(() => {
            setFlash("none");
            nextRound();
          }, 600);
        }
        return moved;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, roundIdx]);

  // Handle lives reaching 0
  useEffect(() => {
    if (phase === "playing" && lives <= 0) {
      setPhase("finished");
      stopMusic();
      setBest((b) => Math.max(b, score));
      if (!mutedRef.current) sfx.die();
    }
  }, [lives, phase, score]);

  const startGame = useCallback(() => {
    const q = makeQuestion(0);
    nextIdRef.current.v = 1;
    advancingRef.current = false;
    setQuestion(q);
    setAsteroids(makeAsteroids(q, 0, nextIdRef.current));
    setRoundIdx(0);
    setScore(0);
    setLives(START_LIVES);
    setFlash("none");
    setPhase("playing");
    if (!mutedRef.current) sfx.click();
  }, []);

  const nextRound = useCallback(() => {
    setRoundIdx((i) => {
      const ni = i + 1;
      if (ni >= TOTAL_ROUNDS) {
        setPhase("finished");
        stopMusic();
        setBest((b) => Math.max(b, score));
        if (!mutedRef.current) sfx.levelUp();
        return i;
      }
      const q = makeQuestion(ni);
      setQuestion(q);
      setAsteroids(makeAsteroids(q, ni, nextIdRef.current));
      advancingRef.current = false;
      return ni;
    });
  }, [score]);

  const handleTap = useCallback(
    (a: Asteroid) => {
      if (advancingRef.current) return;
      if (!mutedRef.current) sfx.shoot();
      if (a.correct) {
        advancingRef.current = true;
        setScore((s) => s + 1);
        setFlash("right");
        if (!mutedRef.current) sfx.correct();
        setAsteroids((prev) => prev.map((x) => (x.id === a.id ? { ...x, hit: true } : x)));
        setTimeout(() => {
          setFlash("none");
          nextRound();
        }, 500);
      } else {
        advancingRef.current = true;
        setFlash("wrong");
        setLives((l) => l - 1);
        if (!mutedRef.current) sfx.wrong();
        setTimeout(() => {
          setFlash("none");
          nextRound();
        }, 500);
      }
    },
    [nextRound]
  );

  // ─── Render ────────────────────────────────────────────────────────────────
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
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-6 text-white shadow-2xl border-2 border-indigo-500 flex-1">
          <div className="text-6xl">☄️</div>
          <h2 className="text-3xl font-extrabold text-center drop-shadow">Addition Attack</h2>
          <p className="text-center text-white/90 text-sm max-w-xs">
            Tap the asteroid with the correct sum before it reaches the ground! 15 rounds, 3 lives.
          </p>
          {best > 0 && (
            <p className="text-xs bg-black/40 px-3 py-1 rounded-full">Best: {best} / {TOTAL_ROUNDS}</p>
          )}
          <button
            onClick={startGame}
            className="bg-cyan-400 text-indigo-900 font-extrabold px-8 py-4 rounded-full text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px] min-w-[160px]"
          >
            ▶ Launch
          </button>
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="text-xs px-3 py-2 bg-black/40 rounded-full min-h-[40px]"
          >
            {muted ? "🔇 Muted" : "🔊 Sound"}
          </button>
        </div>
      )}

      {phase === "playing" && (
        <div
          className={`w-full flex flex-col gap-3 rounded-2xl p-3 shadow-2xl border-2 border-indigo-500 flex-1 transition-colors ${
            flash === "right" ? "bg-green-900" : flash === "wrong" ? "bg-red-900" : "bg-gradient-to-b from-indigo-950 via-purple-950 to-black"
          }`}
        >
          {/* HUD */}
          <div className="flex items-center justify-between text-sm text-white">
            <div className="font-bold">
              Round <span className="text-2xl text-cyan-300">{roundIdx + 1}</span>/{TOTAL_ROUNDS}
            </div>
            <div className="font-bold">
              {"❤️".repeat(Math.max(0, lives))}
            </div>
            <div className="font-bold">
              Score <span className="text-2xl text-yellow-300">{score}</span>
            </div>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-xs px-2 py-1 bg-white/20 rounded-full min-h-[40px]"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* Question */}
          <div className="text-center text-white">
            <p className="text-3xl font-extrabold tracking-wide drop-shadow">
              {question.a} + {question.b} = ?
            </p>
          </div>

          {/* Play field */}
          <div className="relative flex-1 min-h-[340px] w-full rounded-xl overflow-hidden border-2 border-indigo-800 bg-[radial-gradient(ellipse_at_top,#1e1b4b,#050816)]">
            {/* stars */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-70"
                style={{
                  left: `${(i * 53) % 100}%`,
                  top: `${(i * 37) % 100}%`,
                }}
              />
            ))}
            {asteroids.map((a) => (
              <button
                key={a.id}
                onClick={() => handleTap(a)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 text-white text-2xl font-extrabold shadow-lg transition-transform ${
                  a.hit
                    ? "bg-green-500 border-green-300 scale-125"
                    : "bg-gradient-to-br from-gray-500 to-gray-800 border-gray-300 hover:scale-110 active:scale-95"
                }`}
                style={{
                  left: `${a.x * 100}%`,
                  top: `${a.y * 100}%`,
                  minWidth: 56,
                  minHeight: 56,
                }}
              >
                {a.value}
              </button>
            ))}
            {/* Ground line */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-red-700/60" />
          </div>
        </div>
      )}

      {phase === "finished" && (
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-900 p-6 text-white shadow-2xl border-2 border-indigo-300 flex-1">
          <div className="text-6xl">{lives > 0 ? "🏆" : "💥"}</div>
          <h2 className="text-3xl font-extrabold">{lives > 0 ? "Victory!" : "Game Over"}</h2>
          <p className="text-xl">
            Score: <span className="font-extrabold text-4xl text-cyan-300">{score}</span> / {TOTAL_ROUNDS}
          </p>
          <p className="text-sm">Best: {Math.max(best, score)} / {TOTAL_ROUNDS}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={startGame}
              className="bg-cyan-400 text-indigo-900 font-extrabold px-6 py-4 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px]"
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
