"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "menu" | "playing" | "launching" | "finished";

interface Word {
  word: string;
  vowel: string;
  emoji: string;
}

// Curated CVC words with picture emoji for preschool phonics
const WORDS: Word[] = [
  { word: "cat", vowel: "a", emoji: "🐱" },
  { word: "dog", vowel: "o", emoji: "🐶" },
  { word: "pig", vowel: "i", emoji: "🐷" },
  { word: "bus", vowel: "u", emoji: "🚌" },
  { word: "bed", vowel: "e", emoji: "🛏️" },
  { word: "sun", vowel: "u", emoji: "☀️" },
  { word: "bat", vowel: "a", emoji: "🦇" },
  { word: "fox", vowel: "o", emoji: "🦊" },
  { word: "hen", vowel: "e", emoji: "🐔" },
  { word: "bug", vowel: "u", emoji: "🐛" },
  { word: "cup", vowel: "u", emoji: "🥤" },
  { word: "rat", vowel: "a", emoji: "🐀" },
  { word: "log", vowel: "o", emoji: "🪵" },
  { word: "fig", vowel: "i", emoji: "🍇" },
  { word: "leg", vowel: "e", emoji: "🦵" },
  { word: "hat", vowel: "a", emoji: "🎩" },
  { word: "mop", vowel: "o", emoji: "🧹" },
  { word: "web", vowel: "e", emoji: "🕸️" },
  { word: "nut", vowel: "u", emoji: "🥜" },
  { word: "pot", vowel: "o", emoji: "🍯" },
];

const VOWELS = ["a", "e", "i", "o", "u"];
const WORDS_PER_LEVEL = 10;
const TOTAL_LEVELS = 3;

function pickWords(n: number): Word[] {
  const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReadingRocketGame() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState<Word[]>(() => pickWords(WORDS_PER_LEVEL));
  const [wordIdx, setWordIdx] = useState(0);
  const [fuel, setFuel] = useState(0); // 0..100
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "right" | "wrong">("none");
  const [picked, setPicked] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (phase === "playing") startMusic("twinkle");
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && !mutedRef.current) {
      startMusic("twinkle");
    }
    return () => {
      stopMusic();
    };
  }, [phase]);

  const startGame = useCallback(() => {
    setLevel(1);
    setWords(pickWords(WORDS_PER_LEVEL));
    setWordIdx(0);
    setFuel(0);
    setScore(0);
    setFeedback("none");
    setPicked(null);
    setPhase("playing");
    if (!mutedRef.current) sfx.click();
  }, []);

  const handlePick = useCallback(
    (vowel: string) => {
      if (feedback !== "none" || phase !== "playing") return;
      setPicked(vowel);
      if (!mutedRef.current) sfx.letterPop();

      const current = words[wordIdx];
      const correct = vowel === current.vowel;
      if (correct) {
        setScore((s) => s + 1);
        setFeedback("right");
        setFuel((f) => Math.min(100, f + 20));
        if (!mutedRef.current) sfx.correct();
      } else {
        setFeedback("wrong");
        if (!mutedRef.current) sfx.wrong();
      }

      setTimeout(() => {
        setFeedback("none");
        setPicked(null);
        // Check fuel milestone or next word
        setFuel((currentFuel) => {
          if (currentFuel >= 100) {
            // Launch!
            setPhase("launching");
            if (!mutedRef.current) sfx.levelUp();
            setTimeout(() => {
              setLevel((lv) => {
                const next = lv + 1;
                if (next > TOTAL_LEVELS) {
                  setPhase("finished");
                  setBest((b) => Math.max(b, score + (correct ? 1 : 0)));
                  stopMusic();
                  return lv;
                }
                // New level
                setWords(pickWords(WORDS_PER_LEVEL));
                setWordIdx(0);
                setFuel(0);
                setPhase("playing");
                return next;
              });
            }, 2000);
            return currentFuel;
          }
          return currentFuel;
        });
        if (wordIdx + 1 < words.length) {
          setWordIdx((i) => i + 1);
        } else {
          // Ran out of words — reshuffle
          setWords(pickWords(WORDS_PER_LEVEL));
          setWordIdx(0);
        }
      }, 700);
    },
    [feedback, phase, wordIdx, words, score]
  );

  const currentWord = words[wordIdx];
  const wordWithBlank = currentWord
    ? currentWord.word[0].toUpperCase() + "_" + currentWord.word[2].toUpperCase()
    : "";

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
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-6 text-white shadow-2xl border-2 border-pink-300 flex-1">
          <div className="text-6xl">🚀</div>
          <h2 className="text-3xl font-extrabold text-center drop-shadow">Reading Rocket</h2>
          <p className="text-center text-white/90 text-sm max-w-xs">
            Pick the missing vowel to fill the rocket's fuel! When the tank is full, blast off! 3 levels.
          </p>
          {best > 0 && (
            <p className="text-xs bg-black/30 px-3 py-1 rounded-full">Best score: {best}</p>
          )}
          <button
            onClick={startGame}
            className="bg-yellow-300 text-purple-900 font-extrabold px-8 py-4 rounded-full text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px] min-w-[160px]"
          >
            🚀 Launch
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

      {(phase === "playing" || phase === "launching") && currentWord && (
        <div
          className={`w-full flex flex-col gap-3 rounded-2xl p-4 shadow-2xl border-2 border-purple-500 flex-1 transition-colors ${
            feedback === "right" ? "bg-green-100" : feedback === "wrong" ? "bg-red-100" : "bg-gradient-to-b from-indigo-100 to-purple-100"
          }`}
        >
          {/* HUD */}
          <div className="flex items-center justify-between text-sm">
            <div className="font-bold text-purple-800">
              Level <span className="text-2xl">{level}</span>/{TOTAL_LEVELS}
            </div>
            <div className="font-bold text-purple-800">
              Score <span className="text-2xl">{score}</span>
            </div>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-xs px-3 py-2 bg-purple-200 text-purple-900 rounded-full min-h-[40px]"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* Rocket + fuel */}
          <div className="flex items-stretch gap-3">
            <div className="relative flex-1 flex items-center justify-center bg-gradient-to-b from-sky-200 to-indigo-300 rounded-xl p-3 overflow-hidden">
              <div
                className={`text-7xl transition-transform duration-1000 ${
                  phase === "launching" ? "-translate-y-48" : ""
                }`}
              >
                🚀
              </div>
              {phase === "launching" && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-4xl animate-pulse">
                  🔥💨
                </div>
              )}
            </div>
            {/* Fuel gauge */}
            <div className="w-10 flex flex-col items-center">
              <span className="text-xs font-bold text-purple-800 mb-1">FUEL</span>
              <div className="flex-1 w-8 bg-white rounded-full border-2 border-purple-600 overflow-hidden flex flex-col-reverse">
                <div
                  className="w-full bg-gradient-to-t from-orange-500 via-yellow-400 to-red-500 transition-all duration-500"
                  style={{ height: `${fuel}%` }}
                />
              </div>
              <span className="text-xs font-bold text-purple-800 mt-1">{fuel}%</span>
            </div>
          </div>

          {phase === "playing" && (
            <>
              {/* Word display */}
              <div className="flex items-center justify-center gap-4 bg-white/80 rounded-xl p-3 shadow-inner">
                <span className="text-6xl">{currentWord.emoji}</span>
                <span className="text-5xl font-extrabold text-purple-900 tracking-widest">
                  {wordWithBlank}
                </span>
              </div>

              <p className="text-center text-lg font-bold text-purple-900">
                Pick the missing vowel!
              </p>

              {/* Vowel buttons */}
              <div className="grid grid-cols-5 gap-2">
                {VOWELS.map((v) => {
                  const isPicked = picked === v;
                  const isCorrect = feedback !== "none" && v === currentWord.vowel;
                  const isWrongPick = feedback === "wrong" && isPicked;
                  return (
                    <button
                      key={v}
                      onClick={() => handlePick(v)}
                      disabled={feedback !== "none"}
                      className={`min-h-[64px] rounded-xl text-3xl font-extrabold border-2 transition-all shadow-md active:scale-95 ${
                        isCorrect
                          ? "bg-green-400 border-green-700 text-white"
                          : isWrongPick
                          ? "bg-red-400 border-red-700 text-white"
                          : "bg-white border-purple-400 text-purple-700 hover:bg-purple-100"
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {phase === "launching" && (
            <p className="text-center text-2xl font-extrabold text-purple-900 animate-pulse">
              🚀 Blast off! 🚀
            </p>
          )}
        </div>
      )}

      {phase === "finished" && (
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-700 p-6 text-white shadow-2xl border-2 border-pink-300 flex-1">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-extrabold">Mission Complete!</h2>
          <p className="text-xl">
            Score: <span className="font-extrabold text-4xl">{score}</span>
          </p>
          <p className="text-sm">Best: {Math.max(best, score)}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={startGame}
              className="bg-yellow-300 text-purple-900 font-extrabold px-6 py-4 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px]"
            >
              🚀 Launch Again
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
