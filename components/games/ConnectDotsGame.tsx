"use client";

import { useState, useEffect } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

// Each picture: array of [x%, y%] positions for dots, plus the SVG path revealed when complete
const PICTURES = [
  {
    name: "Star",
    emoji: "⭐",
    dots: [
      [50, 5],   // 1 top
      [62, 35],  // 2 right-upper
      [95, 35],  // 3 far right
      [68, 57],  // 4 right-lower
      [80, 90],  // 5 bottom-right
      [50, 70],  // 6 bottom-center
      [20, 90],  // 7 bottom-left
      [32, 57],  // 8 left-lower
      [5,  35],  // 9 far left
      [38, 35],  // 10 left-upper
    ] as [number, number][],
    color: "stroke-yellow-400 fill-yellow-100",
  },
  {
    name: "House",
    emoji: "🏠",
    dots: [
      [50, 5],   // 1 roof peak
      [90, 40],  // 2 roof right
      [90, 95],  // 3 bottom right
      [10, 95],  // 4 bottom left
      [10, 40],  // 5 roof left
    ] as [number, number][],
    color: "stroke-blue-400 fill-blue-50",
  },
  {
    name: "Heart",
    emoji: "❤️",
    dots: [
      [50, 90],  // 1 bottom tip
      [10, 45],  // 2 left curve
      [10, 20],  // 3 left top
      [30, 10],  // 4 left hump top
      [50, 25],  // 5 center dip
      [70, 10],  // 6 right hump top
      [90, 20],  // 7 right top
      [90, 45],  // 8 right curve
    ] as [number, number][],
    color: "stroke-red-400 fill-red-50",
  },
];

export default function ConnectDotsGame() {
  const [picIdx, setPicIdx] = useState(0);
  const [next, setNext]     = useState(1); // next dot number to tap (1-indexed)
  const [lines, setLines]   = useState<[number, number][][]>([]);
  const [done, setDone]     = useState(false);
  const [muted, setMuted]   = useState(false);
  const [started, setStarted] = useState(false);

  const pic = PICTURES[picIdx];

  useEffect(() => {
    if (started && !muted) startMusic("calm");
    return () => stopMusic();
  }, [started, muted]);

  const toggleMute = () => {
    const n = !muted;
    setMuted(n);
    setGlobalMuted(n);
    if (n) stopMusic();
    else if (started) startMusic("calm");
  };

  function reset(idx = picIdx) {
    setPicIdx(idx);
    setNext(1);
    setLines([]);
    setDone(false);
    // Moving to a next/new picture feels like a level up
    if (started) sfx.levelUp();
  }

  function tapDot(i: number) { // i is 0-indexed
    if (done) return;
    if (!started) setStarted(true);
    if (i + 1 !== next) {
      // wrong-order tap
      sfx.wrong();
      return;
    }

    sfx.dotConnect();

    if (next > 1) {
      const prev = pic.dots[i - 1];
      const curr = pic.dots[i];
      setLines((l) => [...l, [prev, curr]]);
    }

    if (next === pic.dots.length) {
      // close the shape
      setLines((l) => [...l, [pic.dots[pic.dots.length - 1], pic.dots[0]]]);
      setDone(true);
      setTimeout(() => sfx.pictureReveal(), 200);
    }
    setNext((n) => n + 1);
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 max-w-lg mx-auto text-center select-none relative">
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute top-3 right-3 text-xs px-3 py-1 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors z-10"
      >
        {muted ? "🔇 Muted" : "🔊 Sound"}
      </button>

      <h2 className="text-2xl font-extrabold text-indigo-600 mb-1">✏️ Connect the Dots</h2>
      <p className="text-gray-500 text-sm mb-3">Tap the dots in order 1, 2, 3... to reveal the picture!</p>

      {/* Picture selector */}
      <div className="flex justify-center gap-2 mb-4">
        {PICTURES.map((p, i) => (
          <button key={p.name} onClick={() => reset(i)}
            className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${picIdx === i ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 hover:bg-indigo-50"}`}>
            {p.emoji} {p.name}
          </button>
        ))}
      </div>

      <div className="relative bg-white rounded-2xl shadow-inner" style={{ paddingBottom: "100%" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Draw lines */}
          {lines.map(([a, b], i) => (
            <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
              className={pic.color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ))}

          {/* Filled shape when done */}
          {done && (
            <polygon
              points={pic.dots.map(([x, y]) => `${x},${y}`).join(" ")}
              className={pic.color}
              strokeWidth="2.5"
              opacity="0.4"
            />
          )}

          {/* Dots */}
          {pic.dots.map(([x, y], i) => {
            const tapped = i + 1 < next;
            const isNext = i + 1 === next;
            return (
              <g key={i} onClick={() => tapDot(i)} style={{ cursor: "pointer" }}>
                <circle cx={x} cy={y} r="5"
                  className={tapped ? "fill-indigo-500" : isNext ? "fill-indigo-300" : "fill-gray-200"}
                  stroke={isNext ? "#6366f1" : "white"} strokeWidth="1.5"
                />
                <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                  fontSize="3.5" fontWeight="bold"
                  fill={tapped ? "white" : isNext ? "#4338ca" : "#9ca3af"}>
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {done && (
        <div className="mt-4 bg-white rounded-2xl p-4 border-2 border-indigo-200">
          <div className="text-4xl mb-1">{pic.emoji}</div>
          <p className="font-extrabold text-indigo-600">You drew a {pic.name}!</p>
          <button onClick={() => reset()} className="mt-2 px-5 py-2 bg-indigo-500 text-white rounded-full font-bold hover:bg-indigo-600 transition-colors text-sm">
            Try Again
          </button>
        </div>
      )}

      {!done && (
        <p className="mt-3 text-indigo-400 font-semibold text-sm">
          Tap dot <span className="text-indigo-600 text-lg font-extrabold">{next}</span> next
        </p>
      )}
    </div>
  );
}
