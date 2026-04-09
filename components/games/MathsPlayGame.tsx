"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

type Op = "+" | "-" | "×";

function generateQuestion(op: Op) {
  if (op === "+") {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    return { a, b, op, answer: a + b };
  }
  if (op === "-") {
    const b = Math.floor(Math.random() * 15) + 1;
    const a = b + Math.floor(Math.random() * 15) + 1;
    return { a, b, op, answer: a - b };
  }
  // multiplication
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, op, answer: a * b };
}

function generateChoices(answer: number) {
  const choices = new Set([answer]);
  while (choices.size < 4) {
    choices.add(answer + Math.floor(Math.random() * 10) - 5);
  }
  return [...choices].sort(() => Math.random() - 0.5);
}

function newRound(op: Op) {
  const q = generateQuestion(op);
  return { question: q, choices: generateChoices(q.answer) };
}

export default function MathsPlayGame() {
  const [op, setOp] = useState<Op>("+");
  const [{ question, choices }, setRound] = useState(() => newRound("+"));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [total, setTotal] = useState(0);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const [started, setStarted] = useState(false);

  // Start music once the user interacts (respects autoplay policy). Stop on unmount.
  useEffect(() => {
    if (started && !muted) startMusic("quirky");
    return () => stopMusic();
  }, [started, muted]);

  const nextQuestion = useCallback((newOp: Op = op) => {
    setRound(newRound(newOp));
    setFeedback(null);
  }, [op]);

  const handleOp = (newOp: Op) => {
    if (!mutedRef.current) sfx.click();
    if (!started) setStarted(true);
    setOp(newOp);
    nextQuestion(newOp);
  };

  const handleAnswer = (choice: number) => {
    if (feedback) return;
    if (!started) setStarted(true);
    if (!mutedRef.current) sfx.tap();
    setTotal((t) => t + 1);
    if (choice === question.answer) {
      setFeedback("correct");
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        if (!mutedRef.current) {
          if (next > 0 && next % 3 === 0) sfx.combo();
          else sfx.correct();
        }
        return next;
      });
    } else {
      setFeedback("wrong");
      if (!mutedRef.current) sfx.wrong();
      setStreak(0);
    }
    setTimeout(() => nextQuestion(), 1200);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (started) startMusic("quirky");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 text-center max-w-lg mx-auto relative">
      {/* Mute button — top-right, matches BrickBreaker style */}
      <button
        onClick={toggleMute}
        className="absolute top-3 right-3 text-xs px-3 py-1 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors z-10"
      >
        {muted ? "🔇 Muted" : "🔊 Sound"}
      </button>

      {/* Mode selector */}
      <div className="flex gap-2 justify-center mb-6">
        {(["+", "-", "×"] as Op[]).map((o) => (
          <button
            key={o}
            onClick={() => handleOp(o)}
            className={`px-5 py-2 rounded-full font-bold text-lg transition-colors ${
              op === o
                ? "bg-purple-600 text-white shadow"
                : "bg-white text-gray-700 hover:bg-purple-50"
            }`}
          >
            {o}
          </button>
        ))}
      </div>

      {/* Score */}
      <div className="flex justify-center gap-6 mb-6 text-sm">
        <div className="bg-white rounded-xl px-4 py-2">
          <span className="text-gray-500">Score</span>
          <div className="font-extrabold text-purple-600 text-xl">{score}/{total}</div>
        </div>
        <div className="bg-white rounded-xl px-4 py-2">
          <span className="text-gray-500">Streak</span>
          <div className="font-extrabold text-orange-500 text-xl">{streak} 🔥</div>
        </div>
      </div>

      {/* Question */}
      <div
        className={`bg-white rounded-2xl py-8 px-6 mb-6 shadow-sm transition-colors ${
          feedback === "correct" ? "bg-green-50 border-2 border-green-300" :
          feedback === "wrong" ? "bg-red-50 border-2 border-red-300" : ""
        }`}
      >
        <div className="text-5xl font-extrabold text-gray-900">
          {question.a} {question.op} {question.b} = ?
        </div>
        {feedback === "correct" && (
          <div className="text-green-600 font-bold text-lg mt-2">Correct! 🎉</div>
        )}
        {feedback === "wrong" && (
          <div className="text-red-600 font-bold text-lg mt-2">
            The answer is {question.answer}
          </div>
        )}
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handleAnswer(choice)}
            disabled={!!feedback}
            className={`py-4 rounded-xl text-2xl font-extrabold transition-colors ${
              feedback && choice === question.answer
                ? "bg-green-500 text-white"
                : feedback && choice !== question.answer
                ? "bg-gray-100 text-gray-400"
                : "bg-white hover:bg-purple-100 text-gray-800 shadow-sm"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
