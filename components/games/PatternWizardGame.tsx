"use client";

import { useState, useCallback, useEffect } from "react";

// ─── Pattern engine ───────────────────────────────────────────────────────────

const ITEMS = [
  { id: "🔴", label: "Red Circle",    bg: "bg-red-100",    border: "border-red-400"    },
  { id: "🔵", label: "Blue Circle",   bg: "bg-blue-100",   border: "border-blue-400"   },
  { id: "🟡", label: "Yellow Circle", bg: "bg-yellow-100", border: "border-yellow-400" },
  { id: "🟢", label: "Green Circle",  bg: "bg-green-100",  border: "border-green-400"  },
  { id: "🟣", label: "Purple Circle", bg: "bg-purple-100", border: "border-purple-400" },
  { id: "🟠", label: "Orange Circle", bg: "bg-orange-100", border: "border-orange-400" },
  { id: "⭐", label: "Star",          bg: "bg-yellow-50",  border: "border-yellow-300" },
  { id: "❤️", label: "Heart",         bg: "bg-pink-100",   border: "border-pink-400"   },
];

type Pattern = { unit: string[]; shown: number; blanks: number };

// Pattern templates: each is a unit to repeat
const PATTERN_TEMPLATES: Pattern[] = [
  // Level 1 — simple AB
  { unit: [0, 1].map(String),     shown: 4, blanks: 1 },
  // Level 2 — ABC
  { unit: [0, 1, 2].map(String),  shown: 6, blanks: 1 },
  // Level 3 — AAB
  { unit: [0, 0, 1].map(String),  shown: 6, blanks: 1 },
  // Level 4 — AABB
  { unit: [0, 0, 1, 1].map(String), shown: 8, blanks: 2 },
  // Level 5 — ABAC
  { unit: [0, 1, 0, 2].map(String), shown: 8, blanks: 2 },
  // Level 6 — ABCD
  { unit: [0, 1, 2, 3].map(String), shown: 8, blanks: 2 },
  // Level 7 — ABBA
  { unit: [0, 1, 1, 0].map(String), shown: 8, blanks: 2 },
  // Level 8 — ABCBA
  { unit: [0, 1, 2, 1, 0].map(String), shown: 10, blanks: 2 },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

function makeRound(template: Pattern, usedItems: typeof ITEMS) {
  // Pick items for the unit indices
  const indices = [...new Set(template.unit.map(Number))];
  const picked  = shuffle(usedItems).slice(0, indices.length);
  const itemMap: Record<number, typeof ITEMS[0]> = {};
  indices.forEach((n, i) => { itemMap[n] = picked[i]; });

  // Build the full sequence
  const full: typeof ITEMS[0][] = [];
  while (full.length < template.shown + template.blanks) {
    for (const idx of template.unit) {
      if (full.length < template.shown + template.blanks) full.push(itemMap[Number(idx)]);
    }
  }

  // Blanks are the last `blanks` items
  const shown   = full.slice(0, template.shown);
  const answers = full.slice(template.shown, template.shown + template.blanks);

  // Choices: correct answers + distractors
  const distractors = usedItems.filter((it) => !answers.find((a) => a.id === it.id)).slice(0, 4 - answers.length);
  const choices = shuffle([...answers, ...distractors]).slice(0, Math.max(4, answers.length + 2));

  return { shown, answers, choices, template };
}

export default function PatternWizardGame() {
  const [level, setLevel]       = useState(0);
  const [round, setRound]       = useState(0);
  const [roundData, setRoundData] = useState(() => makeRound(PATTERN_TEMPLATES[0], ITEMS));
  const [selected, setSelected] = useState<typeof ITEMS[0][]>([]);
  const [state, setState]       = useState<"playing" | "correct" | "wrong" | "complete">("playing");
  const [score, setScore]       = useState(0);
  const [streak, setStreak]     = useState(0);
  const ROUNDS_PER_LEVEL = 5;

  const newRound = useCallback((lvl = level) => {
    const template = PATTERN_TEMPLATES[Math.min(lvl, PATTERN_TEMPLATES.length - 1)];
    setRoundData(makeRound(template, ITEMS));
    setSelected([]);
    setState("playing");
  }, [level]);

  useEffect(() => { newRound(level); }, [level]);

  function pickChoice(item: typeof ITEMS[0]) {
    if (state !== "playing") return;
    const needed = roundData.answers.length;
    const next = [...selected, item];

    if (next.length < needed) {
      setSelected(next);
      return;
    }

    // Check full answer
    const correct = next.every((s, i) => s.id === roundData.answers[i].id);
    setSelected(next);
    if (correct) {
      setState("correct");
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
      setTimeout(() => {
        if (round + 1 >= ROUNDS_PER_LEVEL) {
          setState("complete");
        } else {
          setRound((r) => r + 1);
          newRound(level);
        }
      }, 1300);
    } else {
      setState("wrong");
      setStreak(0);
      setTimeout(() => {
        setSelected([]);
        setState("playing");
      }, 1200);
    }
  }

  if (state === "complete") return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl p-8 max-w-lg mx-auto text-center">
      <div className="text-6xl mb-3">🧙</div>
      <h3 className="text-2xl font-extrabold text-purple-700">Level {level + 1} Complete!</h3>
      <p className="text-gray-600 mb-4">Score: <span className="font-bold text-purple-600">{score}</span></p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => { setScore(0); setRound(0); setStreak(0); setLevel(0); newRound(0); setState("playing"); }}
          className="px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-full font-bold hover:bg-purple-50 text-sm">
          Start Over
        </button>
        {level < PATTERN_TEMPLATES.length - 1 && (
          <button onClick={() => { setRound(0); setLevel((l) => l + 1); setState("playing"); }}
            className="px-5 py-2 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700">
            Next Level →
          </button>
        )}
      </div>
    </div>
  );

  const blanksNeeded = roundData.answers.length;

  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 max-w-lg mx-auto select-none">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-extrabold text-purple-700">🧙 Pattern Wizard</h2>
        <div className="flex gap-2 text-sm">
          <span className="bg-white rounded-xl px-3 py-1 font-bold text-purple-600">Score: {score}</span>
          {streak > 1 && <span className="bg-purple-100 rounded-xl px-3 py-1 font-bold text-purple-500">{streak}🔥</span>}
        </div>
      </div>

      {/* Level indicator */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500 font-medium">Level {level + 1}</span>
        <div className="flex gap-1">
          {Array.from({ length: ROUNDS_PER_LEVEL }).map((_, i) => (
            <div key={i} className={`w-4 h-2 rounded-full ${i < round ? "bg-purple-500" : i === round ? "bg-purple-300" : "bg-gray-200"}`} />
          ))}
        </div>
        <span className="text-xs text-gray-500 ml-auto">Round {round + 1}/{ROUNDS_PER_LEVEL}</span>
      </div>

      {/* Pattern sequence */}
      <div className={`bg-white rounded-2xl p-4 mb-4 border-2 transition-colors ${
        state === "correct" ? "border-green-300 bg-green-50" :
        state === "wrong"   ? "border-red-300 bg-red-50" :
                              "border-purple-100"
      }`}>
        <p className="text-xs text-gray-400 mb-3 text-center font-medium uppercase tracking-wide">What comes next?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {roundData.shown.map((item, i) => (
            <div key={i} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl ${item.bg} ${item.border}`}>
              {item.id}
            </div>
          ))}
          {Array.from({ length: blanksNeeded }).map((_, i) => (
            <div key={`blank-${i}`} className={`w-12 h-12 rounded-xl border-2 border-dashed flex items-center justify-center text-xl transition-all
              ${selected[i] ? `${selected[i].bg} ${selected[i].border}` : "border-gray-300 bg-gray-50"}
            `}>
              {selected[i]?.id ?? "?"}
            </div>
          ))}
        </div>
        {state === "correct" && <p className="text-center text-green-600 font-bold mt-2">✅ Correct!</p>}
        {state === "wrong"   && <p className="text-center text-red-500 font-bold mt-2">Not quite — try again!</p>}
      </div>

      {/* Choices */}
      <p className="text-xs text-center text-gray-500 mb-2">Tap to fill in the blanks:</p>
      <div className="grid grid-cols-4 gap-2">
        {roundData.choices.map((item, i) => (
          <button
            key={i}
            onClick={() => pickChoice(item)}
            disabled={state !== "playing"}
            className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 text-2xl transition-all hover:scale-105 active:scale-95
              ${item.bg} ${item.border}
              ${state !== "playing" ? "opacity-50" : ""}
            `}
          >
            {item.id}
            <span className="text-[10px] font-medium text-gray-500 leading-tight">{item.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-3">
        {blanksNeeded > 1 ? `Fill ${blanksNeeded} blanks in order` : "Fill in the blank"}
      </p>
    </div>
  );
}
