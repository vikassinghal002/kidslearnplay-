"use client";

/**
 * useGameState — phase machine + score/lives/highscore with localStorage.
 *
 * Phases: "title" | "playing" | "paused" | "gameover" | "levelClear" | "gameWin"
 *
 * Usage:
 *   const g = useGameState({ storageKey: "snakeBest" });
 *   g.start();                // title -> playing
 *   g.pause(); g.resume();    // playing <-> paused
 *   g.gameOver();             // -> gameover + persist high score if beaten
 *   g.addScore(10);           // score += 10, highScore auto-updates
 *   g.setLives(3);
 *   if (g.phase === "playing") ...
 *
 * The returned `ref` is a stable React ref whose `.current` always holds the
 * latest phase/score/lives. Use it inside RAF tick callbacks so you don't have
 * to re-subscribe the loop when values change. React state (`phase`, `score`,
 * `lives`, `highScore`) is provided for rendering overlays / HUD.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type GamePhase =
  | "title"
  | "playing"
  | "paused"
  | "gameover"
  | "levelClear"
  | "gameWin";

export interface GameStateSnapshot {
  phase: GamePhase;
  score: number;
  lives: number;
  highScore: number;
  level: number;
}

export interface UseGameStateOptions {
  /** localStorage key for persisting the high score. Omit to disable persistence. */
  storageKey?: string;
  /** Initial lives (default 3). Games that don't track lives can ignore this. */
  initialLives?: number;
  /** Initial phase (default "title"). */
  initialPhase?: GamePhase;
  /** Initial level (default 1). */
  initialLevel?: number;
}

function readHighScore(key: string | undefined): number {
  if (!key || typeof window === "undefined") return 0;
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return 0;
    const n = parseInt(stored, 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function writeHighScore(key: string | undefined, value: number) {
  if (!key || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    /* ignore quota / private mode errors */
  }
}

export function useGameState(options: UseGameStateOptions = {}) {
  const {
    storageKey,
    initialLives = 3,
    initialPhase = "title",
    initialLevel = 1,
  } = options;

  const [phase, setPhase] = useState<GamePhase>(initialPhase);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(initialLives);
  const [level, setLevel] = useState(initialLevel);
  const [highScore, setHighScore] = useState(0);

  // Load high score once on mount
  useEffect(() => {
    setHighScore(readHighScore(storageKey));
  }, [storageKey]);

  // Stable ref snapshot for RAF loops that should not re-subscribe on re-render
  const ref = useRef<GameStateSnapshot>({
    phase: initialPhase,
    score: 0,
    lives: initialLives,
    highScore: 0,
    level: initialLevel,
  });
  ref.current.phase = phase;
  ref.current.score = score;
  ref.current.lives = lives;
  ref.current.highScore = highScore;
  ref.current.level = level;

  const resetStats = useCallback(() => {
    setScore(0);
    setLives(initialLives);
    setLevel(initialLevel);
  }, [initialLives, initialLevel]);

  const start = useCallback(() => {
    resetStats();
    setPhase("playing");
  }, [resetStats]);

  const restart = start;

  const pause = useCallback(() => {
    setPhase((p) => (p === "playing" ? "paused" : p));
  }, []);

  const resume = useCallback(() => {
    setPhase((p) => (p === "paused" ? "playing" : p));
  }, []);

  const togglePause = useCallback(() => {
    setPhase((p) => (p === "playing" ? "paused" : p === "paused" ? "playing" : p));
  }, []);

  const gameOver = useCallback(() => {
    setPhase("gameover");
    setScore((s) => {
      setHighScore((hs) => {
        if (s > hs) {
          writeHighScore(storageKey, s);
          return s;
        }
        return hs;
      });
      return s;
    });
  }, [storageKey]);

  const levelClear = useCallback(() => setPhase("levelClear"), []);
  const gameWin = useCallback(() => {
    setPhase("gameWin");
    setScore((s) => {
      setHighScore((hs) => {
        if (s > hs) {
          writeHighScore(storageKey, s);
          return s;
        }
        return hs;
      });
      return s;
    });
  }, [storageKey]);

  const addScore = useCallback(
    (delta: number) => {
      setScore((s) => {
        const next = Math.max(0, s + delta);
        if (next > ref.current.highScore) {
          setHighScore(next);
          writeHighScore(storageKey, next);
        }
        return next;
      });
    },
    [storageKey],
  );

  const loseLife = useCallback(() => {
    setLives((l) => {
      const next = l - 1;
      if (next <= 0) {
        // Defer gameOver so callers can call loseLife() in the same tick
        // without racing phase transitions.
        setTimeout(() => {
          setPhase("gameover");
        }, 0);
        return 0;
      }
      return next;
    });
  }, []);

  const nextLevel = useCallback(() => {
    setLevel((l) => l + 1);
    setPhase("playing");
  }, []);

  const backToTitle = useCallback(() => {
    resetStats();
    setPhase("title");
  }, [resetStats]);

  return useMemo(
    () => ({
      // state
      phase,
      score,
      lives,
      level,
      highScore,
      ref,
      // transitions
      start,
      restart,
      pause,
      resume,
      togglePause,
      gameOver,
      levelClear,
      gameWin,
      nextLevel,
      backToTitle,
      // mutators
      addScore,
      setScore,
      setLives,
      loseLife,
      setLevel,
      setPhase,
    }),
    [
      phase,
      score,
      lives,
      level,
      highScore,
      start,
      restart,
      pause,
      resume,
      togglePause,
      gameOver,
      levelClear,
      gameWin,
      nextLevel,
      backToTitle,
      addScore,
      loseLife,
    ],
  );
}

export type GameStateApi = ReturnType<typeof useGameState>;
