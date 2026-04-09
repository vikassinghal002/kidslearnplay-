"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORY_SETS = [
  {
    name: "Animals vs Food vs Vehicles",
    categories: [
      { id: "animals",  label: "Animals",  emoji: "🐾", color: "bg-green-500",  light: "bg-green-50",  border: "border-green-400",  items: ["🐱","🐶","🐮","🐷","🐸","🐧","🦊","🐼","🦁","🐯","🐨","🦋","🐝","🐙","🦀"] },
      { id: "food",     label: "Food",     emoji: "🍎", color: "bg-red-500",    light: "bg-red-50",    border: "border-red-400",    items: ["🍎","🍕","🍦","🍪","🎂","🍗","🥕","🌮","🍓","🍔","🍉","🧁","🍩","🥐","🥦"] },
      { id: "vehicles", label: "Vehicles", emoji: "🚗", color: "bg-blue-500",   light: "bg-blue-50",   border: "border-blue-400",   items: ["🚗","🚌","🚂","✈️","🚁","🚀","🚢","🚲","🏎️","🚒","🚛","🛸","⛵","🚑","🚜"] },
    ],
  },
  {
    name: "Land vs Sea vs Sky",
    categories: [
      { id: "land", label: "Land",  emoji: "🌳", color: "bg-lime-600",   light: "bg-lime-50",   border: "border-lime-400",   items: ["🐘","🦁","🐯","🐻","🦊","🐺","🦌","🐴","🐮","🦒","🐗","🦔","🐇","🦝","🐆"] },
      { id: "sea",  label: "Sea",   emoji: "🌊", color: "bg-cyan-500",   light: "bg-cyan-50",   border: "border-cyan-400",   items: ["🐟","🦈","🐬","🐋","🐙","🦑","🦀","🦞","🐠","🦐","🐡","🦭","🐊","🐚","🦑"] },
      { id: "sky",  label: "Sky",   emoji: "☁️", color: "bg-sky-500",    light: "bg-sky-50",    border: "border-sky-400",    items: ["🦅","🦆","🦉","🦚","🦜","🐦","🦋","🪁","✈️","🚀","🛸","🪂","🦗","🐝","🦟"] },
    ],
  },
  {
    name: "Big vs Small",
    categories: [
      { id: "big",   label: "Big Things",   emoji: "🐘", color: "bg-indigo-500", light: "bg-indigo-50", border: "border-indigo-400", items: ["🐘","🦒","🐋","🦏","🏔️","🌊","🏙️","✈️","🚢","🏛️","🎡","🌋","⛺","🚀","🐊"] },
      { id: "small", label: "Small Things", emoji: "🐜", color: "bg-pink-500",   light: "bg-pink-50",   border: "border-pink-400",   items: ["🐜","🐛","🦗","🐌","🐞","🐝","🪲","🦟","🍄","🌸","🍀","🌱","🧊","💊","🔑"] },
    ],
  },
];

type FallingItem = { id: number; emoji: string; category: string; x: number; speed: number; y: number };

let nextId = 0;

export default function SortingFrenzyGame() {
  const [setIdx, setSetIdx]         = useState(0);
  const [running, setRunning]       = useState(false);
  const [items, setItems]           = useState<FallingItem[]>([]);
  const [score, setScore]           = useState(0);
  const [missed, setMissed]         = useState(0);
  const [timeLeft, setTimeLeft]     = useState(60);
  const [flash, setFlash]           = useState<{ cat: string; ok: boolean } | null>(null);
  const [gameOver, setGameOver]     = useState(false);
  const [speedMult, setSpeedMult]   = useState(1);
  const [streak, setStreak]         = useState(0);
  const [muted, setMuted]           = useState(false);
  const mutedRef = useRef(false);
  const prevSpeedTierRef = useRef(1);
  const arenaRef = useRef<HTMLDivElement>(null);

  const catSet = CATEGORY_SETS[setIdx];

  // Background music — starts on phase transition to "playing", stops on cleanup
  useEffect(() => {
    if (running && !muted) startMusic("adventure");
    return () => stopMusic();
  }, [running, muted]);

  // Level up SFX when speed tier crosses a new threshold (every +0.3 speedMult)
  useEffect(() => {
    const tier = Math.floor((speedMult - 1) / 0.3) + 1;
    if (tier > prevSpeedTierRef.current && running) {
      prevSpeedTierRef.current = tier;
      if (!mutedRef.current) sfx.levelUp();
    }
  }, [speedMult, running]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (running) startMusic("adventure");
  };

  // Spawn items
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const allItems = catSet.categories.flatMap((c) => c.items.map((emoji) => ({ emoji, category: c.id })));
      const chosen = allItems[Math.floor(Math.random() * allItems.length)];
      const x = 5 + Math.random() * 75;
      setItems((prev) => [...prev, { id: nextId++, emoji: chosen.emoji, category: chosen.category, x, speed: 0.4 * speedMult, y: 0 }]);
    }, Math.max(600, 1500 - score * 3));
    return () => clearInterval(interval);
  }, [running, catSet, score, speedMult]);

  // Move items down
  useEffect(() => {
    if (!running) return;
    const raf = setInterval(() => {
      setItems((prev) => {
        const next: FallingItem[] = [];
        let newMissed = 0;
        for (const item of prev) {
          const newY = item.y + item.speed;
          if (newY > 90) { newMissed++; }
          else next.push({ ...item, y: newY });
        }
        if (newMissed > 0) {
          setMissed((m) => m + newMissed);
          setStreak(0);
          if (!mutedRef.current) sfx.wallHit();
        }
        return next;
      });
    }, 50);
    return () => clearInterval(raf);
  }, [running]);

  // Game-over on misses
  useEffect(() => {
    if (missed >= 5) endGame();
  }, [missed]);

  // Timer
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { endGame(); return 0; }
        return t - 1;
      });
      // Speed up every 15s
      setSpeedMult((s) => s + 0.05);
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  function endGame() {
    setRunning(false);
    setGameOver(true);
    if (!mutedRef.current) sfx.die();
    stopMusic();
  }

  function startGame(sIdx = setIdx) {
    setSetIdx(sIdx);
    setItems([]);
    setScore(0);
    setMissed(0);
    setTimeLeft(60);
    setGameOver(false);
    setSpeedMult(1);
    setStreak(0);
    prevSpeedTierRef.current = 1;
    setRunning(true);
  }

  function sortItem(itemId: number, catId: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (!item) return prev;
      const correct = item.category === catId;
      setFlash({ cat: catId, ok: correct });
      setTimeout(() => setFlash(null), 400);
      if (correct) {
        setScore((s) => s + 10);
        setStreak((s) => {
          const next = s + 1;
          if (!mutedRef.current) {
            sfx.sortDrop();
            if (next > 0 && next % 5 === 0) sfx.combo();
            else sfx.correct();
          }
          return next;
        });
      } else {
        setMissed((m) => m + 1);
        setStreak(0);
        if (!mutedRef.current) sfx.wrong();
      }
      return prev.filter((i) => i.id !== itemId);
    });
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-4 max-w-lg mx-auto select-none relative">
      {/* Mute button — top-right */}
      <button
        onClick={toggleMute}
        className="absolute top-3 right-3 text-xs px-3 py-1 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors z-10"
      >
        {muted ? "🔇 Muted" : "🔊 Sound"}
      </button>

      <div className="flex items-center justify-between mb-3 pr-24">
        <h2 className="text-xl font-extrabold text-gray-800">🌪️ Sorting Frenzy</h2>
        {running && (
          <div className="flex gap-2 text-sm flex-wrap">
            <span className="bg-green-100 text-green-700 rounded-xl px-3 py-1 font-bold">{score} pts</span>
            <span className={`rounded-xl px-3 py-1 font-bold ${timeLeft < 15 ? "bg-red-100 text-red-600 animate-pulse" : "bg-white text-gray-700"}`}>⏱ {timeLeft}s</span>
            <span className="bg-red-50 text-red-500 rounded-xl px-3 py-1 font-bold">❌ {missed}/5</span>
          </div>
        )}
      </div>

      {!running && !gameOver && (
        <div className="text-center py-4">
          <p className="text-gray-600 text-sm mb-4">Sort falling items into the right buckets before they hit the ground! You get 5 misses.</p>

          {/* Category set picker */}
          <div className="flex flex-col gap-2 mb-5">
            {CATEGORY_SETS.map((s, i) => (
              <button key={i} onClick={() => setSetIdx(i)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-colors ${setIdx === i ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-200"}`}>
                {s.name}
              </button>
            ))}
          </div>

          <button onClick={() => startGame(setIdx)} className="px-8 py-3 bg-indigo-600 text-white rounded-full font-extrabold text-lg hover:bg-indigo-700 transition-colors shadow-md">
            Start! 🌪️
          </button>
        </div>
      )}

      {gameOver && (
        <div className="text-center py-6">
          <div className="text-5xl mb-2">{score >= 100 ? "🏆" : score >= 50 ? "🥈" : "🎯"}</div>
          <h3 className="text-xl font-extrabold text-gray-800 mb-1">{missed >= 5 ? "Too many missed!" : "Time's up!"}</h3>
          <p className="text-2xl font-extrabold text-indigo-600 mb-1">{score} points</p>
          <p className="text-gray-500 text-sm mb-4">Sorted: {score / 10} items correctly</p>
          <button onClick={() => startGame(setIdx)} className="px-6 py-2 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700">
            Play Again
          </button>
        </div>
      )}

      {running && (
        <>
          {/* Falling arena */}
          <div ref={arenaRef} className="relative bg-white rounded-xl overflow-hidden mb-3" style={{ height: "260px" }}>
            {/* Missed indicator */}
            <div className="absolute top-2 left-2 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-sm ${i < missed ? "opacity-100" : "opacity-20"}`}>❌</span>
              ))}
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                style={{ left: `${item.x}%`, top: `${item.y}%`, position: "absolute", transform: "translateX(-50%)" }}
                className="text-3xl cursor-pointer hover:scale-110 transition-transform drop-shadow"
                onClick={() => {
                  // Show a mini picker on click
                }}
              >
                {item.emoji}
              </div>
            ))}

            {items.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
                Items incoming...
              </div>
            )}
          </div>

          {/* Sort buckets */}
          <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${catSet.categories.length}, 1fr)` }}>
            {catSet.categories.map((cat) => (
              <div key={cat.id} className={`rounded-xl border-2 p-2 transition-colors ${flash?.cat === cat.id ? (flash.ok ? "bg-green-200 border-green-500" : "bg-red-200 border-red-500") : `${cat.light} ${cat.border}`}`}>
                <p className="text-center font-bold text-xs text-gray-700 mb-2">{cat.emoji} {cat.label}</p>
                <div className="flex flex-wrap gap-1 justify-center min-h-[32px]">
                  {/* Items near the bottom that belong to this category can be clicked here */}
                  {items.filter((it) => it.y > 60).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => sortItem(item.id, cat.id)}
                      className={`text-2xl hover:scale-110 active:scale-90 transition-transform rounded-lg p-0.5 ${cat.light}`}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-2">
            Click an item in a bucket to sort it!
          </p>
        </>
      )}
    </div>
  );
}
