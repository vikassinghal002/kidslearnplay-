"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function createDeck() {
  // Pick 6 random letters for 6 pairs = 12 cards
  const picked = [...LETTERS].sort(() => Math.random() - 0.5).slice(0, 6);
  const cards = [...picked.map((l) => ({ id: l + "-upper", letter: l, type: "upper" as const })),
                 ...picked.map((l) => ({ id: l + "-lower", letter: l, type: "lower" as const }))];
  return cards.sort(() => Math.random() - 0.5).map((c, i) => ({ ...c, index: i, flipped: false, matched: false }));
}

type Card = ReturnType<typeof createDeck>[number];

export default function AlphabetMatchGame() {
  const [deck, setDeck] = useState<Card[]>(createDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [muted, setMuted] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    return () => stopMusic();
  }, []);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setGlobalMuted(next);
    if (next) {
      stopMusic();
    } else if (startedRef.current) {
      startMusic("twinkle");
    }
  }

  const reset = () => {
    setDeck(createDeck());
    setSelected([]);
    setScore(0);
    setMoves(0);
  };

  const handleFlip = useCallback((index: number) => {
    if (selected.length === 2) return;
    if (deck[index].flipped || deck[index].matched) return;

    // Start music on first flip (browser autoplay policy)
    if (!startedRef.current && !muted) {
      startedRef.current = true;
      startMusic("twinkle");
    }

    sfx.cardFlip();

    const newDeck = deck.map((c, i) => i === index ? { ...c, flipped: true } : c);
    const newSelected = [...selected, index];

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected;
      if (newDeck[a].letter === newDeck[b].letter && newDeck[a].type !== newDeck[b].type) {
        // Match!
        const matched = newDeck.map((c, i) =>
          i === a || i === b ? { ...c, matched: true } : c
        );
        setDeck(matched);
        setScore((s) => s + 1);
        setSelected([]);
        sfx.cardMatch();
        if (matched.every((c) => c.matched)) {
          sfx.levelUp();
        }
      } else {
        setDeck(newDeck);
        setSelected(newSelected);
        sfx.wrong();
        setTimeout(() => {
          setDeck((d) => d.map((c, i) =>
            (i === a || i === b) && !d[i].matched ? { ...c, flipped: false } : c
          ));
          setSelected([]);
        }, 900);
      }
    } else {
      setDeck(newDeck);
      setSelected(newSelected);
    }
  }, [deck, selected, muted]);

  const allMatched = deck.every((c) => c.matched);

  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 text-center max-w-lg mx-auto relative">
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute top-3 right-3 text-xs px-3 py-1 bg-white/90 border border-green-200 text-green-600 rounded-full hover:bg-green-50 shadow-sm z-10"
      >
        {muted ? "🔇" : "🔊"}
      </button>
      <div className="flex justify-between mb-4 text-sm">
        <div className="bg-white rounded-xl px-4 py-2">
          <span className="text-gray-500">Pairs found</span>
          <div className="font-extrabold text-green-600 text-xl">{score}/6</div>
        </div>
        <div className="bg-white rounded-xl px-4 py-2">
          <span className="text-gray-500">Moves</span>
          <div className="font-extrabold text-gray-700 text-xl">{moves}</div>
        </div>
        <button
          onClick={reset}
          className="bg-white rounded-xl px-4 py-2 text-purple-600 font-semibold hover:bg-purple-50 transition-colors text-sm self-center"
        >
          🔄 New Game
        </button>
      </div>

      {allMatched ? (
        <div className="bg-white rounded-2xl py-10 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-2xl font-extrabold text-gray-900 mb-2">You did it!</h3>
          <p className="text-gray-500 mb-4">Completed in {moves} moves</p>
          <button onClick={reset} className="px-6 py-2 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700">
            Play Again
          </button>
        </div>
      ) : (
        <>
          <p className="text-gray-600 text-sm mb-4">Match each uppercase letter with its lowercase letter!</p>
          <div className="grid grid-cols-4 gap-2">
            {deck.map((card) => (
              <button
                key={card.id}
                onClick={() => handleFlip(card.index)}
                className={`aspect-square rounded-xl text-xl font-extrabold transition-all ${
                  card.matched
                    ? "bg-green-400 text-white"
                    : card.flipped
                    ? "bg-purple-500 text-white"
                    : "bg-white text-transparent hover:bg-purple-50 shadow-sm"
                }`}
              >
                {card.flipped || card.matched
                  ? card.type === "upper"
                    ? card.letter
                    : card.letter.toLowerCase()
                  : "?"}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
