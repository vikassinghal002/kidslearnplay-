"use client";

import { useState, useCallback } from "react";

type Shape = "circle" | "square" | "triangle" | "star" | "heart" | "diamond";

const SHAPES: { shape: Shape; emoji: string; label: string; color: string; bg: string }[] = [
  { shape: "circle",   emoji: "⭕", label: "Circle",   color: "text-red-500",    bg: "bg-red-50    border-red-300"    },
  { shape: "square",   emoji: "🟦", label: "Square",   color: "text-blue-500",   bg: "bg-blue-50   border-blue-300"   },
  { shape: "triangle", emoji: "🔺", label: "Triangle", color: "text-yellow-500", bg: "bg-yellow-50 border-yellow-300" },
  { shape: "star",     emoji: "⭐", label: "Star",     color: "text-orange-500", bg: "bg-orange-50 border-orange-300" },
  { shape: "heart",    emoji: "❤️", label: "Heart",    color: "text-pink-500",   bg: "bg-pink-50   border-pink-300"   },
  { shape: "diamond",  emoji: "💎", label: "Diamond",  color: "text-purple-500", bg: "bg-purple-50 border-purple-300" },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

export default function ShapeSorterGame() {
  const [queue, setQueue]     = useState<Shape[]>(() => shuffle(SHAPES.map((s) => s.shape)));
  const [matched, setMatched] = useState<Set<Shape>>(new Set());
  const [wrong, setWrong]     = useState<Shape | null>(null);
  const [score, setScore]     = useState(0);

  const current = queue[0] ?? null;
  const currentInfo = SHAPES.find((s) => s.shape === current);

  const reset = useCallback(() => {
    setQueue(shuffle(SHAPES.map((s) => s.shape)));
    setMatched(new Set());
    setWrong(null);
    setScore(0);
  }, []);

  function tryDrop(target: Shape) {
    if (!current) return;
    if (target === current) {
      const newMatched = new Set([...matched, current]);
      setMatched(newMatched);
      setQueue((q) => q.slice(1));
      setScore((s) => s + 1);
      setWrong(null);
    } else {
      setWrong(target);
      setTimeout(() => setWrong(null), 600);
    }
  }

  const done = queue.length === 0;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 max-w-lg mx-auto text-center select-none">
      <h2 className="text-2xl font-extrabold text-purple-600 mb-1">🔷 Shape Sorter</h2>
      <p className="text-gray-500 text-sm mb-4">Click the matching shape hole!</p>

      {done ? (
        <div className="bg-white rounded-2xl p-8">
          <div className="text-6xl mb-3">🌟</div>
          <h3 className="text-2xl font-extrabold text-purple-600 mb-1">All shapes sorted!</h3>
          <p className="text-gray-500 mb-4">You matched {score} shapes perfectly!</p>
          <button onClick={reset} className="px-6 py-2 bg-purple-500 text-white rounded-full font-bold hover:bg-purple-600 transition-colors">
            Play Again
          </button>
        </div>
      ) : (
        <>
          {/* Current shape to sort */}
          <div className="mb-5">
            <p className="text-gray-500 text-xs mb-2">Sort this shape:</p>
            <div className={`inline-flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 ${currentInfo?.bg} shadow-md`}>
              <span className="text-5xl">{currentInfo?.emoji}</span>
              <span className={`text-xs font-bold mt-1 ${currentInfo?.color}`}>{currentInfo?.label}</span>
            </div>
          </div>

          {/* Shape holes */}
          <div className="grid grid-cols-3 gap-3">
            {SHAPES.map((s) => {
              const isMatched = matched.has(s.shape);
              const isWrong   = wrong === s.shape;
              return (
                <button
                  key={s.shape}
                  onClick={() => !isMatched && tryDrop(s.shape)}
                  disabled={isMatched}
                  className={`rounded-2xl border-2 p-3 flex flex-col items-center gap-1 transition-all
                    ${isMatched ? "bg-green-50 border-green-300 opacity-60" : isWrong ? "bg-red-50 border-red-400 animate-bounce" : `${s.bg} hover:scale-105 active:scale-95`}
                  `}
                >
                  <span className={`text-3xl ${isMatched ? "grayscale opacity-50" : ""}`}>
                    {isMatched ? "✅" : s.emoji}
                  </span>
                  <span className={`text-xs font-semibold ${isMatched ? "text-gray-400" : s.color}`}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 text-sm text-gray-400">
            {score}/{SHAPES.length} sorted
          </div>
        </>
      )}
    </div>
  );
}
