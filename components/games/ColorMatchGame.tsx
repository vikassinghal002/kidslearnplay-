"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

const COLORS = [
  { name: "Red",    bg: "bg-red-500",    light: "bg-red-100",    border: "border-red-400",    text: "text-red-600"    },
  { name: "Blue",   bg: "bg-blue-500",   light: "bg-blue-100",   border: "border-blue-400",   text: "text-blue-600"   },
  { name: "Yellow", bg: "bg-yellow-400", light: "bg-yellow-100", border: "border-yellow-400", text: "text-yellow-600" },
  { name: "Green",  bg: "bg-green-500",  light: "bg-green-100",  border: "border-green-400",  text: "text-green-600"  },
  { name: "Purple", bg: "bg-purple-500", light: "bg-purple-100", border: "border-purple-400", text: "text-purple-600" },
  { name: "Orange", bg: "bg-orange-400", light: "bg-orange-100", border: "border-orange-400", text: "text-orange-600" },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

export default function ColorMatchGame() {
  const [queue, setQueue]   = useState<string[]>(() => shuffle([...COLORS.map((c) => c.name), ...COLORS.map((c) => c.name)]).slice(0, 10));
  const [score, setScore]   = useState(0);
  const [wrong, setWrong]   = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [done, setDone]     = useState(false);
  const [muted, setMuted]   = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    return () => stopMusic();
  }, []);

  function ensureMusic() {
    if (!startedRef.current && !muted) {
      startedRef.current = true;
      startMusic("playful");
    }
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setGlobalMuted(next);
    if (next) {
      stopMusic();
    } else if (startedRef.current) {
      startMusic("playful");
    }
  }

  const reset = useCallback(() => {
    setQueue(shuffle([...COLORS.map((c) => c.name), ...COLORS.map((c) => c.name)]).slice(0, 10));
    setScore(0);
    setWrong(null);
    setStreak(0);
    setDone(false);
  }, []);

  const current = COLORS.find((c) => c.name === queue[0]);

  function guess(name: string) {
    if (!current) return;
    ensureMusic();
    sfx.tap();
    if (name === current.name) {
      const newQueue = queue.slice(1);
      const newStreak = streak + 1;
      setScore((s) => s + 1);
      setStreak(newStreak);
      setWrong(null);
      sfx.correct();
      // Streak milestones
      if (newStreak === 3) sfx.sparkle();
      else if (newStreak >= 5 && newStreak % 5 === 0) sfx.levelUp();
      if (newQueue.length === 0) {
        setDone(true);
        sfx.levelUp();
        sfx.sparkle();
      } else {
        setQueue(newQueue);
      }
    } else {
      setWrong(name);
      setStreak(0);
      sfx.wrong();
      setTimeout(() => setWrong(null), 600);
    }
  }

  const total = 10;

  return (
    <div className="bg-gradient-to-br from-red-50 to-yellow-50 rounded-2xl p-5 max-w-lg mx-auto text-center select-none relative">
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute top-3 right-3 text-xs px-3 py-1 bg-white/90 border border-orange-200 text-orange-600 rounded-full hover:bg-orange-50 shadow-sm z-10"
      >
        {muted ? "🔇" : "🔊"}
      </button>
      <h2 className="text-2xl font-extrabold text-orange-600 mb-1">🎨 Colour Match</h2>
      <p className="text-gray-500 text-sm mb-4">Tap the bucket that matches the colour!</p>

      {done ? (
        <div className="bg-white rounded-2xl p-8">
          <div className="text-6xl mb-3">🎨</div>
          <h3 className="text-2xl font-extrabold text-orange-600 mb-1">You're a colour master!</h3>
          <p className="text-gray-500 mb-4">Score: {score}/{total}</p>
          <button onClick={reset} className="px-6 py-2 bg-orange-400 text-white rounded-full font-bold hover:bg-orange-500 transition-colors">
            Play Again
          </button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="flex justify-center gap-4 mb-5 text-sm">
            <div className="bg-white rounded-xl px-4 py-1">
              <span className="text-gray-400">Score </span>
              <span className="font-extrabold text-orange-500">{score}/{total}</span>
            </div>
            <div className="bg-white rounded-xl px-4 py-1">
              <span className="text-gray-400">Streak </span>
              <span className="font-extrabold text-yellow-500">{streak} 🔥</span>
            </div>
          </div>

          {/* Colour splat to identify */}
          {current && (
            <div className="mb-6 flex flex-col items-center">
              <p className="text-gray-500 text-xs mb-2">What colour is this?</p>
              <div className={`w-24 h-24 rounded-full ${current.bg} shadow-lg border-4 border-white`} />
            </div>
          )}

          {/* Colour buckets */}
          <div className="grid grid-cols-3 gap-3">
            {COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => guess(c.name)}
                className={`rounded-2xl border-2 p-3 flex flex-col items-center gap-1 transition-all hover:scale-105 active:scale-95
                  ${wrong === c.name ? "bg-red-50 border-red-400 animate-bounce" : `${c.light} ${c.border}`}
                `}
              >
                <div className={`w-10 h-10 rounded-full ${c.bg} shadow`} />
                <span className={`text-xs font-bold ${c.text}`}>{c.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
