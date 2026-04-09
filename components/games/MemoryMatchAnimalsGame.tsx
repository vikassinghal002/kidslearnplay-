"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

const ANIMAL_PAIRS = [
  "🐱", "🐶", "🐮", "🐷", "🐸", "🐧",
  "🦊", "🐼", "🦁", "🐨", "🐯", "🦋",
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

function makeDeck(pairs: number = 6) {
  const chosen = shuffle(ANIMAL_PAIRS).slice(0, pairs);
  return shuffle([...chosen, ...chosen]).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

type Card = ReturnType<typeof makeDeck>[number];

export default function MemoryMatchAnimalsGame() {
  const [pairs, setPairs]   = useState(6);
  const [deck, setDeck]     = useState<Card[]>(() => makeDeck(6));
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves]   = useState(0);
  const [score, setScore]   = useState(0);
  const [locked, setLocked] = useState(false);
  const [muted, setMuted]   = useState(false);
  const [started, setStarted] = useState(false);
  const winTriggered = useRef(false);

  useEffect(() => {
    if (started && !muted) startMusic("happy");
    return () => stopMusic();
  }, [started, muted]);

  const toggleMute = () => {
    const n = !muted;
    setMuted(n);
    setGlobalMuted(n);
    if (n) stopMusic();
    else if (started) startMusic("happy");
  };

  const reset = useCallback((p = pairs) => {
    setDeck(makeDeck(p));
    setSelected([]);
    setMoves(0);
    setScore(0);
    setLocked(false);
    winTriggered.current = false;
  }, [pairs]);

  function setPairCount(p: number) {
    sfx.click();
    setPairs(p);
    reset(p);
  }

  function flip(id: number) {
    if (locked) return;
    const card = deck[id];
    if (card.flipped || card.matched) return;
    if (selected.length === 2) return;

    if (!started) setStarted(true);
    sfx.cardFlip();

    const newDeck = deck.map((c) => c.id === id ? { ...c, flipped: true } : c);
    const newSelected = [...selected, id];

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected;
      if (newDeck[a].emoji === newDeck[b].emoji) {
        const matched = newDeck.map((c) => c.id === a || c.id === b ? { ...c, matched: true } : c);
        setDeck(matched);
        setScore((s) => s + 1);
        setSelected([]);
        setTimeout(() => sfx.cardMatch(), 120);
      } else {
        setDeck(newDeck);
        setSelected(newSelected);
        setLocked(true);
        setTimeout(() => {
          sfx.wrong();
          setDeck((d) => d.map((c) => (c.id === a || c.id === b) && !d[c.id].matched ? { ...c, flipped: false } : c));
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    } else {
      setDeck(newDeck);
      setSelected(newSelected);
    }
  }

  const allMatched = deck.every((c) => c.matched);
  const cols = pairs <= 6 ? 4 : 6;

  // Trigger win sfx once
  useEffect(() => {
    if (allMatched && started && !winTriggered.current) {
      winTriggered.current = true;
      sfx.levelUp();
      setTimeout(() => sfx.sparkle(), 300);
    }
  }, [allMatched, started]);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-5 max-w-lg mx-auto text-center select-none relative">
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute top-3 right-3 text-xs px-3 py-1 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors z-10"
      >
        {muted ? "🔇 Muted" : "🔊 Sound"}
      </button>

      <h2 className="text-2xl font-extrabold text-green-700 mb-1">🐾 Memory Match</h2>
      <p className="text-gray-500 text-sm mb-3">Flip cards to find matching animal pairs!</p>

      {/* Difficulty */}
      <div className="flex justify-center gap-2 mb-4">
        {[6, 8, 12].map((p) => (
          <button key={p} onClick={() => setPairCount(p)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${pairs === p ? "bg-green-600 text-white" : "bg-white text-green-700 hover:bg-green-50"}`}>
            {p === 6 ? "Easy" : p === 8 ? "Medium" : "Hard"}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-4 mb-4 text-sm">
        <div className="bg-white rounded-xl px-3 py-1">
          <span className="text-gray-400">Pairs </span>
          <span className="font-extrabold text-green-600">{score}/{pairs}</span>
        </div>
        <div className="bg-white rounded-xl px-3 py-1">
          <span className="text-gray-400">Moves </span>
          <span className="font-extrabold text-gray-700">{moves}</span>
        </div>
        <button onClick={() => { sfx.click(); reset(); }} className="bg-white px-3 py-1 rounded-xl text-green-700 font-semibold hover:bg-green-50 text-xs">
          🔄 New
        </button>
      </div>

      {allMatched ? (
        <div className="bg-white rounded-2xl p-8">
          <div className="text-5xl mb-2">🎉</div>
          <h3 className="text-xl font-extrabold text-green-700 mb-1">You found them all!</h3>
          <p className="text-gray-500 mb-4">{moves} moves</p>
          <button onClick={() => { sfx.click(); reset(); }} className="px-5 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors">
            Play Again
          </button>
        </div>
      ) : (
        <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {deck.map((card) => (
            <button
              key={card.id}
              onClick={() => flip(card.id)}
              className={`aspect-square rounded-xl text-2xl font-extrabold flex items-center justify-center transition-all
                ${card.matched ? "bg-green-300 scale-95" : card.flipped ? "bg-white shadow-md scale-105" : "bg-green-500 hover:bg-green-400 active:scale-95"}
              `}
            >
              {card.flipped || card.matched ? card.emoji : "❓"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
