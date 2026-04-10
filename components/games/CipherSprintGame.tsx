"use client";

/**
 * Cipher Sprint — cryptography decode challenge.
 *
 * A short word is encoded with a Caesar cipher (shift 1–12).
 * The shift value is shown. Tap/click each letter of the decoded word.
 * Score multiplier builds with consecutive correct decodes.
 * Timer pressure ramps up each round.
 *
 * Mechanic family: DISCOVERY + META (pattern recognition, alphabet arithmetic)
 * Target age: 11–14  firstAge() = 11 → 11+ bucket ✓
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

type Phase = "menu" | "playing" | "over";

// ── Word bank (common 3–6 letter words) ────────────────────────────────────

const WORDS = [
  "CAT","DOG","SUN","MAP","KEY","BOX","FLY","JAM","ZIP","GEM",
  "STAR","JUMP","FROG","QUIZ","LAMP","GRID","CAKE","WIND","FOLK","GLOW",
  "BRAIN","CHORD","FLUTE","GLOBE","PIXEL","STACK","TRACK","BLAZE","CRISP","DRAFT",
  "PLANET","SIGNAL","MIRROR","CHROME","FLIGHT","PUZZLE","BRIDGE","CLOVER","SPLASH","STREAM",
];

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function caesar(word: string, shift: number): string {
  return word.split("").map((ch) => {
    const i = ALPHA.indexOf(ch);
    return i === -1 ? ch : ALPHA[(i + shift) % 26];
  }).join("");
}

function decode(encoded: string, shift: number): string {
  return encoded.split("").map((ch) => {
    const i = ALPHA.indexOf(ch);
    return i === -1 ? ch : ALPHA[(i - shift + 26) % 26];
  }).join("");
}

// ── Round data ───────────────────────────────────────────────────────────────

interface Round {
  word: string;       // actual plain text
  encoded: string;    // cipher text
  shift: number;
  timeSec: number;    // seconds allowed
  options: string[];  // choices per position OR whole-word choice approach
}

function buildRound(roundNum: number): Round {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const shift = 1 + Math.floor(Math.random() * 12);
  const encoded = caesar(word, shift);
  const timeSec = Math.max(8, 22 - roundNum * 1.2);
  return { word, encoded, shift, timeSec, options: [] };
}

// Build distractor options for a given character position
function buildLetterChoices(correct: string): string[] {
  const choices = new Set<string>([correct]);
  while (choices.size < 5) {
    choices.add(ALPHA[Math.floor(Math.random() * 26)]);
  }
  // Shuffle
  return [...choices].sort(() => Math.random() - 0.5);
}

// ── localStorage ─────────────────────────────────────────────────────────────

function loadHi(): { score: number; streak: number } {
  try {
    const s = localStorage.getItem("ciphersprint_hi");
    if (s) return JSON.parse(s);
  } catch { /* no-op */ }
  return { score: 0, streak: 0 };
}
function saveHi(score: number, streak: number) {
  try { localStorage.setItem("ciphersprint_hi", JSON.stringify({ score, streak })); } catch { /* no-op */ }
}

// ── Colors ───────────────────────────────────────────────────────────────────

const SHIFT_COLORS: Record<number, string> = {
  1:  "#22c55e", 2:  "#84cc16", 3:  "#eab308",
  4:  "#f97316", 5:  "#ef4444", 6:  "#ec4899",
  7:  "#a855f7", 8:  "#6366f1", 9:  "#06b6d4",
  10: "#0ea5e9", 11: "#f43f5e", 12: "#7c3aed",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CipherSprintGame() {
  const [phase, setPhase]           = useState<Phase>("menu");
  const [round, setRound]           = useState<Round | null>(null);
  const [roundNum, setRoundNum]     = useState(0);
  const [score, setScore]           = useState(0);
  const [combo, setCombo]           = useState(1);
  const [maxCombo, setMaxCombo]     = useState(1);
  const [hi, setHi]                 = useState<{ score: number; streak: number }>({ score: 0, streak: 0 });
  const [timeLeft, setTimeLeft]     = useState(20);
  const [inputLetters, setInput]    = useState<string[]>([]);
  const [letterChoices, setChoices] = useState<string[][]>([]);
  const [shake, setShake]           = useState(false);
  const [flash, setFlash]           = useState<"correct" | "wrong" | null>(null);
  const [muted, setMuted]           = useState(false);
  const mutedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load hi-score on mount
  useEffect(() => { setHi(loadHi()); }, []);

  // ── Start ────────────────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    const rn = 1;
    const r  = buildRound(rn);
    const choices = r.word.split("").map((ch) => buildLetterChoices(ch));
    setRoundNum(rn);
    setRound(r);
    setChoices(choices);
    setInput([]);
    setScore(0);
    setCombo(1);
    setMaxCombo(1);
    setTimeLeft(Math.round(r.timeSec));
    setPhase("playing");
    if (!mutedRef.current) startMusic("quirky");
  }, []);

  // ── Timer ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== "playing") return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          // Time out — game over
          setPhase("over");
          stopMusic();
          if (!mutedRef.current) sfx.die();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, round]);

  // ── Handle letter tap ─────────────────────────────────────────────────────

  const handleLetterTap = useCallback(
    (posIdx: number, letter: string) => {
      if (!round || phase !== "playing") return;
      if (inputLetters[posIdx] !== undefined) return; // already placed

      const correctLetter = round.word[posIdx];
      if (letter !== correctLetter) {
        // Wrong letter
        if (!mutedRef.current) sfx.wrong();
        setShake(true);
        setFlash("wrong");
        setTimeout(() => { setShake(false); setFlash(null); }, 350);
        setCombo(1);
        return;
      }

      // Correct
      const newInput = [...inputLetters];
      newInput[posIdx] = letter;
      setInput(newInput);
      if (!mutedRef.current) sfx.correct();

      // Check if word complete
      const allFilled = round.word.split("").every((_, i) => newInput[i] !== undefined);
      if (allFilled) {
        if (timerRef.current) clearInterval(timerRef.current);
        // Score = word.length * combo * 10 + timeLeft bonus
        const wordScore = round.word.length * combo * 10 + timeLeft * 2;
        const newScore  = score + wordScore;
        const newCombo  = Math.min(combo + 1, 8);
        const newMax    = Math.max(maxCombo, newCombo);

        setScore(newScore);
        setCombo(newCombo);
        setMaxCombo(newMax);
        setFlash("correct");
        setTimeout(() => setFlash(null), 400);
        if (!mutedRef.current) {
          if (newCombo >= 4) sfx.combo();
          else sfx.levelUp();
        }

        // Build next round after brief pause
        setTimeout(() => {
          const rn = roundNum + 1;
          const r  = buildRound(rn);
          const choices = r.word.split("").map((ch) => buildLetterChoices(ch));
          setRoundNum(rn);
          setRound(r);
          setChoices(choices);
          setInput([]);
          setTimeLeft(Math.round(r.timeSec));
          if (!mutedRef.current) startMusic("quirky");
        }, 500);
      }
    },
    [round, phase, inputLetters, combo, maxCombo, score, timeLeft, roundNum]
  );

  // ── Game over persist ─────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === "over") {
      const saved = loadHi();
      if (score > saved.score || maxCombo > saved.streak) {
        const newHi = { score: Math.max(score, saved.score), streak: Math.max(maxCombo, saved.streak) };
        saveHi(newHi.score, newHi.streak);
        setHi(newHi);
      }
    }
  }, [phase, score, maxCombo]);

  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (phase === "playing") startMusic("quirky");
  };

  // ── Timer bar color ───────────────────────────────────────────────────────

  const timerPct = round ? Math.min(1, timeLeft / round.timeSec) : 1;
  const timerColor =
    timerPct > 0.5 ? "#22c55e" :
    timerPct > 0.25 ? "#eab308" : "#ef4444";

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col items-center gap-4 select-none w-full px-3 py-4"
      style={{ maxWidth: "min(100%, 480px)", margin: "0 auto", minHeight: "calc(100dvh - 80px)" }}
    >
      {/* ── Menu ── */}
      {phase === "menu" && (
        <div className="w-full flex flex-col items-center justify-center gap-5 rounded-2xl bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 p-8 text-white shadow-2xl border-2 border-purple-700 flex-1">
          <div className="text-6xl">🔐</div>
          <h2 className="text-4xl font-black text-center font-display text-purple-200">
            Cipher Sprint
          </h2>
          <p className="text-center text-white/75 text-sm max-w-xs leading-relaxed">
            Decode secret words using a <strong className="text-purple-300">Caesar cipher</strong>.
            A number tells you the shift — tap the correct letters before time runs out.
            Combos multiply your score.
          </p>
          <div className="text-xs text-gray-500 space-y-1 text-center">
            <p>e.g. Shift 3: <span className="font-mono text-gray-300">D = A, E = B, F = C…</span></p>
            <p>You see: <span className="font-mono text-purple-300">FDW</span> → you type: <span className="font-mono text-green-400">CAT</span></p>
          </div>
          {hi.score > 0 && (
            <div className="flex gap-4 text-xs">
              <span className="bg-black/30 px-3 py-1.5 rounded-full text-yellow-300 font-bold">Best score: {hi.score}</span>
              <span className="bg-black/30 px-3 py-1.5 rounded-full text-pink-300 font-bold">Best combo ×{hi.streak}</span>
            </div>
          )}
          <button
            onClick={startGame}
            className="mt-2 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-extrabold px-10 py-4 rounded-full text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px] min-w-[160px] touch-manipulation"
          >
            ▶ Start
          </button>
          <button onClick={toggleMute} className="text-xs px-4 py-2 bg-black/30 rounded-full min-h-[44px] touch-manipulation">
            {muted ? "🔇 Muted" : "🔊 Sound"}
          </button>
        </div>
      )}

      {/* ── Playing ── */}
      {phase === "playing" && round && (
        <div
          className={`w-full flex flex-col gap-4 rounded-2xl p-5 bg-gray-950 border-2 border-purple-800 shadow-2xl transition-all ${
            shake ? "animate-shake" : ""
          } ${flash === "correct" ? "border-green-500" : flash === "wrong" ? "border-red-500" : ""}`}
        >
          {/* HUD row */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-gray-400">Round {roundNum}</div>
            <div className="text-sm font-extrabold text-yellow-300">
              {score.toLocaleString()} pts
            </div>
            <div className="text-sm font-extrabold" style={{ color: combo >= 4 ? "#f43f5e" : "#a855f7" }}>
              ×{combo} combo
            </div>
            <button onClick={toggleMute} className="w-8 h-8 rounded-lg bg-gray-800 text-white text-sm flex items-center justify-center touch-manipulation">
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* Timer bar */}
          <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${timerPct * 100}%`, background: timerColor }}
            />
          </div>
          <div className="text-center text-xs text-gray-500">{timeLeft}s remaining</div>

          {/* Cipher info */}
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Shift</p>
            <span
              className="text-5xl font-black"
              style={{ color: SHIFT_COLORS[round.shift] ?? "#a855f7" }}
            >
              {round.shift}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              e.g. A → {ALPHA[round.shift % 26]} · Z → {ALPHA[(25 + round.shift) % 26]}
            </p>
          </div>

          {/* Encoded word */}
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Encoded message</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {round.encoded.split("").map((ch, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-xl bg-gray-800 border-2 border-gray-600 flex items-center justify-center font-black text-xl text-white font-mono"
                >
                  {ch}
                </div>
              ))}
            </div>
          </div>

          {/* Decoded so far */}
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Your decode</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {round.word.split("").map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-black text-xl font-mono transition-all ${
                    inputLetters[i]
                      ? "bg-green-800 border-green-500 text-green-200"
                      : "bg-gray-900 border-purple-800 text-transparent"
                  }`}
                >
                  {inputLetters[i] ?? "·"}
                </div>
              ))}
            </div>
          </div>

          {/* Per-position letter choice buttons */}
          <div className="flex flex-col gap-3">
            {round.word.split("").map((_, posIdx) => {
              const filled = inputLetters[posIdx] !== undefined;
              return (
                <div key={posIdx} className={`transition-opacity ${filled ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                  <p className="text-xs text-gray-600 mb-1 font-mono">
                    Position {posIdx + 1} — encoded <span className="text-purple-400">{round.encoded[posIdx]}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(letterChoices[posIdx] ?? []).map((letter) => (
                      <button
                        key={letter}
                        onClick={() => handleLetterTap(posIdx, letter)}
                        disabled={filled}
                        className="min-w-[52px] min-h-[52px] rounded-xl bg-indigo-900 hover:bg-indigo-700 active:bg-indigo-800 border-2 border-indigo-600 text-white font-black text-lg font-mono transition-colors touch-manipulation"
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Game Over ── */}
      {phase === "over" && (
        <div className="w-full flex flex-col items-center justify-center gap-5 rounded-2xl bg-gradient-to-br from-gray-950 to-purple-950 p-8 text-white shadow-2xl border-2 border-red-700 flex-1">
          <div className="text-5xl">⏱️</div>
          <h2 className="text-3xl font-black text-red-400">Time&apos;s Up!</h2>
          <div className="text-center space-y-1">
            <p className="text-xl font-bold">Score: <span className="text-yellow-300 font-black">{score.toLocaleString()}</span></p>
            <p className="text-sm text-gray-400">Rounds decoded: {roundNum - 1}</p>
            <p className="text-sm text-gray-400">Max combo: ×{maxCombo}</p>
          </div>
          {(score >= hi.score || maxCombo >= hi.streak) && score > 0 && (
            <p className="text-green-400 font-bold text-sm">New personal best!</p>
          )}
          <p className="text-xs text-gray-600">Best score: {hi.score.toLocaleString()} · Best combo: ×{hi.streak}</p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-full text-xl touch-manipulation min-h-[56px]"
          >
            Try Again
          </button>
          <a href="/games" className="text-gray-500 text-sm touch-manipulation min-h-[44px] flex items-center">
            All Games →
          </a>
        </div>
      )}
    </div>
  );
}
