"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const BUBBLE_COLORS = [
  "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400",
  "bg-teal-400", "bg-blue-400", "bg-indigo-400", "bg-purple-400",
  "bg-pink-400", "bg-rose-400",
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type Bubble = {
  id: number;
  letter: string;
  color: string;
  x: number;
  y: number;
  popped: boolean;
};

function makeBubbles(letters: string[]): Bubble[] {
  return shuffle(letters).map((letter, i) => ({
    id: i,
    letter,
    color: BUBBLE_COLORS[i % BUBBLE_COLORS.length],
    x: 5 + (i % 6) * 15 + Math.random() * 5,
    y: 5 + Math.floor(i / 6) * 22 + Math.random() * 5,
    popped: false,
  }));
}

export default function BubblePopABCGame() {
  const [bubbles, setBubbles] = useState<Bubble[]>(() => makeBubbles(LETTERS));
  const [next, setNext] = useState(0); // index into LETTERS
  const [wrong, setWrong] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [muted, setMuted] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    return () => stopMusic();
  }, []);

  function toggleMute() {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setGlobalMuted(nextMuted);
    if (nextMuted) {
      stopMusic();
    } else if (startedRef.current) {
      startMusic("twinkle");
    }
  }

  const reset = useCallback(() => {
    setBubbles(makeBubbles(LETTERS));
    setNext(0);
    setWrong(null);
    setScore(0);
  }, []);

  function pop(bubble: Bubble) {
    if (bubble.popped) return;
    // Start music on first pop (browser autoplay policy)
    if (!startedRef.current && !muted) {
      startedRef.current = true;
      startMusic("twinkle");
    }
    sfx.bubbleBurst();
    if (bubble.letter === LETTERS[next]) {
      setBubbles((bs) => bs.map((b) => b.id === bubble.id ? { ...b, popped: true } : b));
      setNext((n) => n + 1);
      setScore((s) => s + 1);
      setWrong(null);
      sfx.letterPop();
      sfx.correct();
      if (next + 1 === LETTERS.length) {
        sfx.levelUp();
        sfx.sparkle();
      }
    } else {
      setWrong(bubble.id);
      sfx.wrong();
      setTimeout(() => setWrong(null), 600);
    }
  }

  const done = next === LETTERS.length;

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl p-5 max-w-lg mx-auto text-center select-none relative">
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute top-3 right-3 text-xs px-3 py-1 bg-white/90 border border-blue-200 text-blue-600 rounded-full hover:bg-blue-50 shadow-sm z-10"
      >
        {muted ? "🔇" : "🔊"}
      </button>
      <h2 className="text-2xl font-extrabold text-blue-600 mb-1">🫧 Bubble Pop ABCs</h2>
      <p className="text-gray-500 text-sm mb-1">Pop the bubbles in ABC order!</p>

      {!done ? (
        <>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white rounded-xl px-4 py-1 text-sm">
              <span className="text-gray-500">Next: </span>
              <span className="font-extrabold text-blue-600 text-xl">{LETTERS[next]}</span>
            </div>
            <div className="bg-white rounded-xl px-4 py-1 text-sm">
              <span className="text-gray-500">Score: </span>
              <span className="font-extrabold text-green-600 text-xl">{score}</span>
            </div>
          </div>

          <div className="relative bg-white/60 rounded-2xl" style={{ height: "380px" }}>
            {bubbles.map((b) => (
              <button
                key={b.id}
                onClick={() => pop(b)}
                style={{ left: `${b.x}%`, top: `${b.y}%`, position: "absolute" }}
                className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-white text-lg shadow-md transition-all
                  ${b.popped ? "opacity-0 scale-150 pointer-events-none" : ""}
                  ${wrong === b.id ? "animate-bounce bg-red-500" : b.color}
                  hover:scale-110 active:scale-95
                `}
              >
                {b.letter}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl p-8">
          <div className="text-6xl mb-3">🎊</div>
          <h3 className="text-2xl font-extrabold text-blue-600 mb-1">You know your ABCs!</h3>
          <p className="text-gray-500 mb-4">Amazing job popping all 26 bubbles!</p>
          <button onClick={reset} className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
