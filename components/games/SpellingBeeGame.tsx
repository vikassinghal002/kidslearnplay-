"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

// ─── Dolch / Fry sight word list with emoji ──────────────────────────────────

const WORDS: { word: string; emoji: string }[] = [
  { word: "SUN", emoji: "☀️" },
  { word: "CAT", emoji: "🐱" },
  { word: "DOG", emoji: "🐶" },
  { word: "RED", emoji: "🟥" },
  { word: "BED", emoji: "🛏️" },
  { word: "BUS", emoji: "🚌" },
  { word: "CAR", emoji: "🚗" },
  { word: "BOX", emoji: "📦" },
  { word: "CUP", emoji: "☕" },
  { word: "HAT", emoji: "🎩" },
  { word: "KEY", emoji: "🔑" },
  { word: "PIG", emoji: "🐷" },
  { word: "FISH", emoji: "🐟" },
  { word: "BIRD", emoji: "🐦" },
  { word: "BOOK", emoji: "📖" },
  { word: "CAKE", emoji: "🎂" },
  { word: "STAR", emoji: "⭐" },
  { word: "TREE", emoji: "🌳" },
  { word: "MOON", emoji: "🌙" },
  { word: "FROG", emoji: "🐸" },
  { word: "DUCK", emoji: "🦆" },
  { word: "APPLE", emoji: "🍎" },
  { word: "HOUSE", emoji: "🏠" },
  { word: "CLOCK", emoji: "🕒" },
  { word: "SMILE", emoji: "😊" },
];

const TIME_PER_WORD = 30;

type Phase = "menu" | "playing" | "finished";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Tile {
  id: number;
  letter: string;
  used: boolean;
}

function makeTiles(word: string): Tile[] {
  const letters = word.split("");
  const scrambled = shuffle(letters);
  // Ensure scramble is different from solved word when possible
  if (scrambled.join("") === word && word.length > 1) {
    // Simple swap
    [scrambled[0], scrambled[1]] = [scrambled[1], scrambled[0]];
  }
  return scrambled.map((letter, id) => ({ id, letter, used: false }));
}

export default function SpellingBeeGame() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [wordOrder, setWordOrder] = useState<number[]>(() => shuffle(WORDS.map((_, i) => i)));
  const [wordIdx, setWordIdx] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [answer, setAnswer] = useState<{ tileId: number; letter: string }[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timer, setTimer] = useState(TIME_PER_WORD);
  const [feedback, setFeedback] = useState<"none" | "right" | "wrong" | "timeout">("none");
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const current = WORDS[wordOrder[wordIdx]];
  const TOTAL_WORDS = 10;

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (phase === "playing") startMusic("happy");
  }, [phase]);

  // Music lifecycle
  useEffect(() => {
    if (phase === "playing" && !mutedRef.current) {
      startMusic("happy");
    }
    return () => {
      stopMusic();
    };
  }, [phase]);

  // Setup new word
  const setupWord = useCallback((idx: number, order: number[]) => {
    const w = WORDS[order[idx]];
    setTiles(makeTiles(w.word));
    setAnswer([]);
    setTimer(TIME_PER_WORD);
    setFeedback("none");
  }, []);

  const startGame = useCallback(() => {
    const order = shuffle(WORDS.map((_, i) => i));
    setWordOrder(order);
    setWordIdx(0);
    setScore(0);
    setupWord(0, order);
    setPhase("playing");
    if (!mutedRef.current) sfx.click();
  }, [setupWord]);

  const advanceToNextWord = useCallback(
    (newScore: number) => {
      const nextIdx = wordIdx + 1;
      if (nextIdx >= TOTAL_WORDS) {
        setPhase("finished");
        stopMusic();
        setBest((b) => Math.max(b, newScore));
        if (!mutedRef.current) sfx.levelUp();
      } else {
        setWordIdx(nextIdx);
        setupWord(nextIdx, wordOrder);
      }
    },
    [setupWord, wordIdx, wordOrder]
  );

  // Tick timer
  useEffect(() => {
    if (phase !== "playing" || feedback !== "none") return;
    if (timer <= 0) {
      setFeedback("timeout");
      if (!mutedRef.current) sfx.die();
      const newScore = score;
      window.setTimeout(() => advanceToNextWord(newScore), 900);
      return;
    }
    timerRef.current = window.setTimeout(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [timer, phase, feedback, score, advanceToNextWord]);

  const tapTile = useCallback(
    (tileId: number) => {
      if (feedback !== "none") return;
      const tile = tiles.find((t) => t.id === tileId);
      if (!tile || tile.used) return;
      if (!mutedRef.current) sfx.letterPop();
      setTiles((ts) => ts.map((t) => (t.id === tileId ? { ...t, used: true } : t)));
      const newAnswer = [...answer, { tileId, letter: tile.letter }];
      setAnswer(newAnswer);

      // Check if complete
      if (newAnswer.length === current.word.length) {
        const built = newAnswer.map((a) => a.letter).join("");
        if (built === current.word) {
          setFeedback("right");
          if (!mutedRef.current) sfx.wordComplete();
          const newScore = score + 1;
          setScore(newScore);
          window.setTimeout(() => advanceToNextWord(newScore), 900);
        } else {
          setFeedback("wrong");
          if (!mutedRef.current) sfx.wrong();
          // Reset tiles after delay so the child can try again
          window.setTimeout(() => {
            setAnswer([]);
            setTiles(makeTiles(current.word));
            setFeedback("none");
          }, 900);
        }
      }
    },
    [feedback, tiles, answer, current.word, score, advanceToNextWord]
  );

  const undoLast = useCallback(() => {
    if (feedback !== "none" || answer.length === 0) return;
    const last = answer[answer.length - 1];
    setAnswer((a) => a.slice(0, -1));
    setTiles((ts) => ts.map((t) => (t.id === last.tileId ? { ...t, used: false } : t)));
    if (!mutedRef.current) sfx.click();
  }, [feedback, answer]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col items-center gap-3 select-none w-full px-3 py-3"
      style={{
        maxWidth: "min(100%, 560px)",
        margin: "0 auto",
        minHeight: "calc(100dvh - 80px)",
      }}
    >
      {phase === "menu" && (
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 p-6 text-white shadow-2xl border-2 border-yellow-300 flex-1">
          <div className="text-7xl">🐝</div>
          <h2 className="text-3xl font-extrabold text-center drop-shadow">Spelling Bee</h2>
          <p className="text-center text-white/95 text-sm max-w-xs">
            Look at the picture and spell the word! 30 seconds per word, 10 words total. Buzz buzz!
          </p>
          {best > 0 && (
            <p className="text-xs bg-black/25 px-3 py-1 rounded-full">Best: {best} / {TOTAL_WORDS}</p>
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
              Word <span className="text-2xl">{wordIdx + 1}</span>/{TOTAL_WORDS}
            </div>
            <div
              className={`font-extrabold text-2xl ${
                timer <= 5 ? "text-red-600 animate-pulse" : timer <= 10 ? "text-orange-600" : "text-slate-700"
              }`}
            >
              ⏱ {timer}s
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

          {/* Picture + bee mascot */}
          <div
            className={`flex items-center justify-center gap-2 rounded-xl p-4 transition-colors ${
              feedback === "right"
                ? "bg-green-200"
                : feedback === "wrong"
                ? "bg-red-200"
                : feedback === "timeout"
                ? "bg-slate-300"
                : "bg-white/80"
            }`}
          >
            <div className="text-4xl">🐝</div>
            <div className="text-7xl">{current.emoji}</div>
          </div>

          {/* Answer slots */}
          <div className="flex gap-2 justify-center flex-wrap">
            {current.word.split("").map((_, i) => {
              const slot = answer[i];
              return (
                <div
                  key={i}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 border-dashed flex items-center justify-center text-3xl font-extrabold transition-colors ${
                    slot
                      ? "bg-amber-400 border-amber-700 text-white"
                      : "bg-white/60 border-amber-500 text-amber-700"
                  }`}
                >
                  {slot?.letter ?? ""}
                </div>
              );
            })}
          </div>

          {/* Letter tiles */}
          <div className="flex gap-2 justify-center flex-wrap">
            {tiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => tapTile(tile.id)}
                disabled={tile.used || feedback !== "none"}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-3xl font-extrabold shadow-md active:scale-95 transition-all ${
                  tile.used
                    ? "bg-amber-100 border-amber-200 text-amber-300 cursor-not-allowed"
                    : "bg-white border-amber-500 text-amber-800 hover:bg-amber-100"
                }`}
              >
                {tile.used ? "" : tile.letter}
              </button>
            ))}
          </div>

          {/* Undo */}
          <div className="flex justify-center">
            <button
              onClick={undoLast}
              disabled={feedback !== "none" || answer.length === 0}
              className="px-5 py-2 bg-slate-300 text-slate-800 font-bold rounded-full text-sm min-h-[44px] disabled:opacity-40"
            >
              ↶ Undo
            </button>
          </div>

          {feedback === "timeout" && (
            <div className="text-center font-bold text-red-700">Time's up! Answer: {current.word}</div>
          )}
          {feedback === "wrong" && (
            <div className="text-center font-bold text-red-700">Try again!</div>
          )}
          {feedback === "right" && (
            <div className="text-center font-bold text-green-700">Bzzzzt! Correct!</div>
          )}
        </div>
      )}

      {phase === "finished" && (
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-2xl border-2 border-amber-300 flex-1">
          <div className="text-6xl">🏆🐝</div>
          <h2 className="text-3xl font-extrabold">Spelling Champion!</h2>
          <p className="text-xl">
            Score: <span className="font-extrabold text-4xl">{score}</span> / {TOTAL_WORDS}
          </p>
          <p className="text-sm">Best: {Math.max(best, score)} / {TOTAL_WORDS}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={startGame}
              className="bg-white text-amber-700 font-extrabold px-6 py-4 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px]"
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
