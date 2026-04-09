"use client";

/**
 * GameOverlay — absolute-positioned overlay for title / paused / gameover /
 * levelClear / gameWin phases. Placed inside the canvas wrapper so it sits
 * right on top of the canvas and auto-scales with it.
 *
 * Only renders when phase is not "playing" — during gameplay the overlay is
 * invisible so the canvas gets all the pointer events.
 *
 * Games can customise via props OR pass `customContent` per phase to fully
 * override the body for that phase (useful when the title screen has a
 * legend, grading, etc.).
 *
 * Usage:
 *   <GameOverlay
 *     phase={g.phase}
 *     title="Snake"
 *     emoji="🐍"
 *     score={g.score}
 *     highScore={g.highScore}
 *     onStart={g.start}
 *     onResume={g.resume}
 *     onRestart={g.restart}
 *     accentClass="text-green-400"
 *     buttonClass="bg-green-500 hover:bg-green-400 shadow-green-500/40"
 *   />
 */

import type { ReactNode } from "react";
import type { GamePhase } from "./useGameState";

export interface GameOverlayProps {
  phase: GamePhase;
  title: string;
  /** Emoji or icon shown above the title. */
  emoji?: string;
  /** Shown on the title screen below the title. */
  subtitle?: string;
  score?: number;
  highScore?: number;
  level?: number;
  onStart?: () => void;
  onResume?: () => void;
  onRestart?: () => void;
  onNextLevel?: () => void;
  onBackToTitle?: () => void;
  /** Tailwind class for the title text colour. */
  accentClass?: string;
  /** Tailwind classes applied to primary buttons. */
  buttonClass?: string;
  /** Override body content per phase (replaces default body, keeps title). */
  customContent?: Partial<Record<GamePhase, ReactNode>>;
  /** Extra hint text shown on the title screen. */
  hint?: string;
}

export function GameOverlay({
  phase,
  title,
  emoji,
  subtitle,
  score,
  highScore,
  level,
  onStart,
  onResume,
  onRestart,
  onNextLevel,
  onBackToTitle,
  accentClass = "text-purple-400",
  buttonClass = "bg-purple-500 hover:bg-purple-400 shadow-purple-500/40",
  customContent,
  hint,
}: GameOverlayProps) {
  if (phase === "playing") return null;

  const showScore = score !== undefined;
  const showHigh = highScore !== undefined && highScore > 0;
  const showLevel = level !== undefined && level > 1;

  let body: ReactNode = null;
  let primary: ReactNode = null;

  if (customContent?.[phase]) {
    body = customContent[phase];
  }

  switch (phase) {
    case "title":
      if (!body) {
        body = (
          <>
            {subtitle && <p className="text-gray-300 text-sm mb-1">{subtitle}</p>}
            {showHigh && <p className="text-yellow-300 text-sm mb-1">Best: {highScore}</p>}
            {hint && <p className="text-gray-500 text-xs mb-5">{hint}</p>}
          </>
        );
      }
      primary = onStart && (
        <button
          type="button"
          onClick={onStart}
          className={`px-8 py-3 text-white font-extrabold rounded-full text-lg transition-colors shadow-lg ${buttonClass}`}
        >
          PLAY
        </button>
      );
      break;

    case "paused":
      if (!body) {
        body = <p className="text-gray-300 text-sm mb-5">Game paused</p>;
      }
      primary = onResume && (
        <button
          type="button"
          onClick={onResume}
          className={`px-8 py-3 text-white font-extrabold rounded-full text-lg transition-colors shadow-lg ${buttonClass}`}
        >
          ▶ RESUME
        </button>
      );
      break;

    case "gameover":
      if (!body) {
        body = (
          <>
            {showScore && (
              <p className="text-white text-xl font-bold mb-1">
                Score: {score}
                {showLevel && ` • Level: ${level}`}
              </p>
            )}
            {showHigh && <p className="text-yellow-300 text-sm mb-5">Best: {highScore}</p>}
          </>
        );
      }
      primary = onRestart && (
        <button
          type="button"
          onClick={onRestart}
          className={`px-8 py-3 text-white font-extrabold rounded-full text-lg transition-colors shadow-lg ${buttonClass}`}
        >
          PLAY AGAIN
        </button>
      );
      break;

    case "levelClear":
      if (!body) {
        body = (
          <>
            <p className="text-green-300 text-xl font-bold mb-1">Level {level} cleared!</p>
            {showScore && <p className="text-white text-sm mb-5">Score: {score}</p>}
          </>
        );
      }
      primary = onNextLevel && (
        <button
          type="button"
          onClick={onNextLevel}
          className={`px-8 py-3 text-white font-extrabold rounded-full text-lg transition-colors shadow-lg ${buttonClass}`}
        >
          NEXT LEVEL →
        </button>
      );
      break;

    case "gameWin":
      if (!body) {
        body = (
          <>
            <p className="text-yellow-300 text-2xl font-extrabold mb-1">🏆 You win!</p>
            {showScore && <p className="text-white text-lg mb-1">Score: {score}</p>}
            {showHigh && <p className="text-yellow-300 text-sm mb-5">Best: {highScore}</p>}
          </>
        );
      }
      primary = onRestart && (
        <button
          type="button"
          onClick={onRestart}
          className={`px-8 py-3 text-white font-extrabold rounded-full text-lg transition-colors shadow-lg ${buttonClass}`}
        >
          PLAY AGAIN
        </button>
      );
      break;
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center px-4">
      {emoji && <div className="text-6xl mb-3">{emoji}</div>}
      <h2 className={`text-3xl font-extrabold mb-2 tracking-widest ${accentClass}`}>
        {title}
      </h2>
      {body}
      {primary}
      {onBackToTitle && phase !== "title" && (
        <button
          type="button"
          onClick={onBackToTitle}
          className="mt-3 text-xs text-gray-400 hover:text-gray-200 underline"
        >
          Back to title
        </button>
      )}
    </div>
  );
}
