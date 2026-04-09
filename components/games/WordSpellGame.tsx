"use client";

import { useState, useCallback, useEffect } from "react";

// ─── Word bank ────────────────────────────────────────────────────────────────

const LEVELS: { label: string; words: { word: string; emoji: string; hint: string }[] }[] = [
  {
    label: "Easy (3 letters)",
    words: [
      { word: "CAT", emoji: "🐱", hint: "A fluffy pet that says meow" },
      { word: "DOG", emoji: "🐶", hint: "A loyal pet that barks" },
      { word: "SUN", emoji: "☀️", hint: "It shines in the sky" },
      { word: "HAT", emoji: "🎩", hint: "You wear this on your head" },
      { word: "BEE", emoji: "🐝", hint: "It makes honey and buzzes" },
      { word: "CUP", emoji: "☕", hint: "You drink from this" },
      { word: "BAT", emoji: "🦇", hint: "A flying animal of the night" },
      { word: "EGG", emoji: "🥚", hint: "A bird lays this" },
      { word: "BUS", emoji: "🚌", hint: "A big yellow vehicle for school" },
      { word: "ANT", emoji: "🐜", hint: "A tiny insect that lives in colonies" },
    ],
  },
  {
    label: "Medium (4 letters)",
    words: [
      { word: "BIRD", emoji: "🐦", hint: "It has wings and can fly" },
      { word: "FROG", emoji: "🐸", hint: "It jumps and says ribbit" },
      { word: "STAR", emoji: "⭐", hint: "It twinkles in the night sky" },
      { word: "FISH", emoji: "🐟", hint: "It swims in the water" },
      { word: "CAKE", emoji: "🎂", hint: "You eat this on your birthday" },
      { word: "DUCK", emoji: "🦆", hint: "It swims and says quack" },
      { word: "BEAR", emoji: "🐻", hint: "A big furry animal that loves honey" },
      { word: "MOON", emoji: "🌙", hint: "It glows in the night sky" },
      { word: "TREE", emoji: "🌳", hint: "It has leaves and a trunk" },
      { word: "LION", emoji: "🦁", hint: "The king of the jungle" },
    ],
  },
  {
    label: "Hard (5 letters)",
    words: [
      { word: "TIGER", emoji: "🐯", hint: "An orange cat with black stripes" },
      { word: "HORSE", emoji: "🐴", hint: "You can ride this animal" },
      { word: "SHARK", emoji: "🦈", hint: "A big fish with sharp teeth" },
      { word: "WHALE", emoji: "🐳", hint: "The biggest animal in the ocean" },
      { word: "BUNNY", emoji: "🐰", hint: "A fluffy animal with long ears" },
      { word: "CAMEL", emoji: "🐪", hint: "It has humps and lives in the desert" },
      { word: "CLOUD", emoji: "☁️", hint: "It floats in the sky and brings rain" },
      { word: "SNAKE", emoji: "🐍", hint: "A long reptile with no legs" },
      { word: "EAGLE", emoji: "🦅", hint: "A big bird with sharp talons" },
      { word: "PIANO", emoji: "🎹", hint: "A musical instrument with black and white keys" },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type State = "playing" | "correct" | "wrong" | "complete";

export default function WordSpellGame() {
  const [levelIdx, setLevelIdx]   = useState(0);
  const [wordIdx, setWordIdx]     = useState(0);
  const [wordOrder, setWordOrder] = useState<number[]>(() => shuffle(LEVELS[0].words.map((_, i) => i)));
  const [tiles, setTiles]         = useState<string[]>([]);
  const [answer, setAnswer]       = useState<string[]>([]);
  const [state, setState]         = useState<State>("playing");
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [hintShown, setHintShown] = useState(false);

  const level  = LEVELS[levelIdx];
  const entry  = level.words[wordOrder[wordIdx]];

  // Build tiles whenever the entry changes
  useEffect(() => {
    setTiles(shuffle(entry.word.split("")));
    setAnswer([]);
    setState("playing");
    setHintShown(false);
  }, [levelIdx, wordIdx, wordOrder]);

  const reset = useCallback((lIdx = levelIdx) => {
    setLevelIdx(lIdx);
    setWordIdx(0);
    setWordOrder(shuffle(LEVELS[lIdx].words.map((_, i) => i)));
    setScore(0);
    setStreak(0);
  }, [levelIdx]);

  function pickTile(idx: number) {
    if (state !== "playing") return;
    const letter = tiles[idx];
    setTiles((t) => t.filter((_, i) => i !== idx));
    setAnswer((a) => [...a, letter]);
  }

  function removeLetter(idx: number) {
    if (state !== "playing") return;
    const letter = answer[idx];
    setAnswer((a) => a.filter((_, i) => i !== idx));
    setTiles((t) => [...t, letter]);
  }

  function checkAnswer() {
    if (answer.length !== entry.word.length) return;
    const guess = answer.join("");
    if (guess === entry.word) {
      setState("correct");
      setScore((s) => s + 1 + streak);
      setStreak((s) => s + 1);
      setTimeout(next, 1400);
    } else {
      setState("wrong");
      setStreak(0);
      setTimeout(() => {
        setTiles(shuffle(entry.word.split("")));
        setAnswer([]);
        setState("playing");
      }, 1200);
    }
  }

  function next() {
    if (wordIdx + 1 >= level.words.length) {
      setState("complete");
    } else {
      setWordIdx((i) => i + 1);
    }
  }

  const progress = wordIdx / level.words.length;

  // ── Complete screen ─────────────────────────────────────────────────────────
  if (state === "complete") return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-6 max-w-lg mx-auto text-center">
      <div className="text-6xl mb-3">🏆</div>
      <h3 className="text-2xl font-extrabold text-amber-700 mb-1">Level Complete!</h3>
      <p className="text-gray-600 mb-1">Score: <span className="font-bold text-amber-600">{score}</span></p>
      {levelIdx < LEVELS.length - 1 ? (
        <div className="flex gap-3 justify-center mt-4">
          <button onClick={() => reset(levelIdx)} className="px-5 py-2 bg-white border border-amber-300 text-amber-700 rounded-full font-bold hover:bg-amber-50">
            Retry Level
          </button>
          <button onClick={() => reset(levelIdx + 1)} className="px-5 py-2 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600">
            Next Level →
          </button>
        </div>
      ) : (
        <div>
          <p className="text-amber-600 font-bold mb-3">You completed all levels! 🎊</p>
          <button onClick={() => reset(0)} className="px-6 py-2 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600">
            Play Again
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 max-w-lg mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-extrabold text-amber-700">📝 Word Spell</h2>
        <div className="flex gap-2 text-sm">
          <span className="bg-white rounded-xl px-3 py-1 font-bold text-amber-600">Score: {score}</span>
          {streak > 1 && <span className="bg-orange-100 rounded-xl px-3 py-1 font-bold text-orange-600">{streak}🔥</span>}
        </div>
      </div>

      {/* Level tabs */}
      <div className="flex gap-1 mb-4">
        {LEVELS.map((l, i) => (
          <button key={i} onClick={() => reset(i)}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition-colors ${levelIdx === i ? "bg-amber-500 text-white" : "bg-white text-amber-700 hover:bg-amber-50"}`}>
            {i === 0 ? "Easy" : i === 1 ? "Medium" : "Hard"}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div className="bg-amber-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* Word card */}
      <div className={`rounded-2xl p-5 text-center mb-4 border-2 transition-colors ${
        state === "correct" ? "bg-green-50 border-green-300" :
        state === "wrong"   ? "bg-red-50 border-red-300" :
                              "bg-white border-amber-200"
      }`}>
        <div className="text-7xl mb-2">{entry.emoji}</div>
        {hintShown && <p className="text-gray-500 text-xs mb-2 italic">{entry.hint}</p>}
        {state === "correct" && <p className="text-green-600 font-extrabold text-lg">✅ Correct! +{1 + Math.max(0, streak - 1)} pts</p>}
        {state === "wrong"   && <p className="text-red-500 font-bold">Try again! 💪</p>}

        {/* Answer slots */}
        <div className="flex justify-center gap-2 mt-3">
          {Array.from({ length: entry.word.length }).map((_, i) => (
            <button
              key={i}
              onClick={() => answer[i] && removeLetter(i)}
              className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-extrabold text-lg transition-all
                ${answer[i] ? "bg-amber-100 border-amber-400 text-amber-800 hover:bg-red-50 hover:border-red-300" : "bg-gray-50 border-dashed border-gray-300 text-transparent"}
              `}
            >
              {answer[i] || "_"}
            </button>
          ))}
        </div>
      </div>

      {/* Letter tiles */}
      <div className="flex flex-wrap justify-center gap-2 mb-4 min-h-[48px]">
        {tiles.map((letter, i) => (
          <button
            key={i}
            onClick={() => pickTile(i)}
            className="w-11 h-11 rounded-xl bg-amber-500 text-white font-extrabold text-xl shadow-md hover:bg-amber-600 active:scale-90 transition-all"
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setHintShown(true)}
          disabled={hintShown}
          className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-full text-sm font-semibold hover:bg-amber-50 disabled:opacity-40"
        >
          💡 Hint
        </button>
        <button
          onClick={checkAnswer}
          disabled={answer.length !== entry.word.length || state !== "playing"}
          className="px-5 py-2 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 disabled:opacity-40 transition-colors"
        >
          Check ✓
        </button>
        <button
          onClick={() => { setTiles(shuffle(entry.word.split(""))); setAnswer([]); setState("playing"); }}
          className="px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-full text-sm font-semibold hover:bg-gray-50"
        >
          🔄 Clear
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-3">Word {wordIdx + 1} of {level.words.length}</p>
    </div>
  );
}
