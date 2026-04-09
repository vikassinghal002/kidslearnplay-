"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

function generateRound() {
  const count = Math.floor(Math.random() * 9) + 1; // 1–9
  const wrong1 = count === 1 ? 2 : count - 1;
  const wrong2 = count === 9 ? 8 : count + 1;
  const choices = [count, wrong1, wrong2].sort(() => Math.random() - 0.5);
  return { count, choices };
}

export default function CountingGame() {
  const [round, setRound] = useState(generateRound);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const tapCounter = useRef(0);

  // Start music once the player interacts (respects autoplay policy)
  useEffect(() => {
    if (started && !muted) startMusic("twinkle");
    return () => stopMusic();
  }, [started, muted]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (started) startMusic("twinkle");
  };

  const next = useCallback(() => {
    setRound(generateRound());
    setFeedback(null);
  }, []);

  const handleAnswer = (choice: number) => {
    if (feedback) return;
    if (!started) setStarted(true);
    // Alternate count/tap feedback on each press
    tapCounter.current += 1;
    if (tapCounter.current % 2 === 0) sfx.tap();
    else sfx.count();

    setTotal((t) => t + 1);
    if (choice === round.count) {
      setFeedback("correct");
      setScore((s) => s + 1);
      sfx.correct();
      setTimeout(() => sfx.sparkle(), 180);
      // Every 5 correct answers feels like a "level up"
      setTimeout(() => {
        if ((score + 1) % 5 === 0) {
          sfx.levelUp();
          setTimeout(() => sfx.pictureReveal(), 220);
        }
      }, 400);
    } else {
      setFeedback("wrong");
      sfx.wrong();
    }
    setTimeout(next, 1200);
  };

  const stars = "⭐".repeat(round.count);

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 text-center max-w-lg mx-auto relative">
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute top-3 right-3 text-xs px-3 py-1 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors z-10"
      >
        {muted ? "🔇 Muted" : "🔊 Sound"}
      </button>

      <div className="flex justify-center gap-4 mb-6 text-sm">
        <div className="bg-white rounded-xl px-4 py-2">
          <span className="text-gray-500">Score</span>
          <div className="font-extrabold text-orange-500 text-xl">{score}/{total}</div>
        </div>
      </div>

      <p className="text-gray-600 mb-3 font-medium">How many stars do you see?</p>

      <div
        className={`bg-white rounded-2xl py-8 px-4 mb-6 shadow-sm text-4xl leading-loose tracking-wide transition-colors ${
          feedback === "correct" ? "border-2 border-green-300" :
          feedback === "wrong" ? "border-2 border-red-300" : ""
        }`}
      >
        {stars}
        {feedback === "correct" && <div className="text-green-600 font-bold text-lg mt-2">Great counting! 🎉</div>}
        {feedback === "wrong" && <div className="text-red-600 font-bold text-lg mt-2">Try again! It was {round.count}</div>}
      </div>

      <div className="flex gap-3 justify-center">
        {round.choices.map((c) => (
          <button
            key={c}
            onClick={() => handleAnswer(c)}
            disabled={!!feedback}
            className={`w-20 h-20 rounded-2xl text-3xl font-extrabold shadow-sm transition-colors ${
              feedback && c === round.count ? "bg-green-500 text-white" :
              feedback ? "bg-gray-100 text-gray-400" :
              "bg-white hover:bg-yellow-100 text-gray-800"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
