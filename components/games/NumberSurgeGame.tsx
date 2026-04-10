"use client";

/**
 * Number Surge — strategic merge puzzle (2048 mechanics, original presentation).
 *
 * Slide tiles in 4 directions. Matching tiles merge and double.
 * Reach 2048 to win; keep playing to go beyond.
 * A new tile spawns after every valid move.
 *
 * Mechanic family: STRATEGY / META (forward-planning, risk-reward)
 * Target age: 11–14  firstAge() = 11  → 11+ bucket ✓
 */

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { sfx, setGlobalMuted } from "@/lib/gameAudio";

type Phase = "menu" | "playing" | "won" | "over";

type Grid = (number | null)[][];

// ── Tile palette ─────────────────────────────────────────────────────────────

function tileStyle(v: number | null): { bg: string; fg: string; size: string } {
  if (!v) return { bg: "bg-gray-800", fg: "text-gray-700", size: "text-2xl" };
  const map: Record<number, { bg: string; fg: string }> = {
    2:    { bg: "bg-indigo-900",  fg: "text-indigo-200" },
    4:    { bg: "bg-indigo-700",  fg: "text-indigo-100" },
    8:    { bg: "bg-purple-700",  fg: "text-purple-100" },
    16:   { bg: "bg-purple-500",  fg: "text-white" },
    32:   { bg: "bg-pink-600",    fg: "text-white" },
    64:   { bg: "bg-pink-500",    fg: "text-white" },
    128:  { bg: "bg-rose-500",    fg: "text-white" },
    256:  { bg: "bg-orange-500",  fg: "text-white" },
    512:  { bg: "bg-amber-500",   fg: "text-white" },
    1024: { bg: "bg-yellow-400",  fg: "text-gray-900" },
    2048: { bg: "bg-gradient-to-br from-yellow-300 to-amber-500", fg: "text-gray-900" },
  };
  const style = map[v] ?? { bg: "bg-white", fg: "text-gray-900" };
  const size =
    v >= 1000 ? "text-lg font-black" :
    v >= 100  ? "text-2xl font-black" :
               "text-3xl font-black";
  return { ...style, size };
}

// ── Grid helpers ──────────────────────────────────────────────────────────────

function emptyGrid(): Grid {
  return Array.from({ length: 4 }, () => [null, null, null, null]);
}

function clone(g: Grid): Grid {
  return g.map((row) => [...row]);
}

function spawnTile(g: Grid): Grid {
  const empties: [number, number][] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      if (g[r][c] === null) empties.push([r, c]);
  if (!empties.length) return g;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  const ng = clone(g);
  ng[r][c] = Math.random() < 0.85 ? 2 : 4;
  return ng;
}

/** Merge a single row left. Returns { row, gained }. */
function mergeRow(row: (number | null)[]): { row: (number | null)[]; gained: number } {
  const vals = row.filter((v): v is number => v !== null);
  let gained = 0;
  const merged: (number | null)[] = [];
  let i = 0;
  while (i < vals.length) {
    if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
      const sum = vals[i] * 2;
      merged.push(sum);
      gained += sum;
      i += 2;
    } else {
      merged.push(vals[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(null);
  return { row: merged, gained };
}

type Direction = "left" | "right" | "up" | "down";

function slide(g: Grid, dir: Direction): { grid: Grid; gained: number; moved: boolean } {
  let gained = 0;
  let ng = clone(g);
  const moved_cells: boolean[] = [];

  if (dir === "left") {
    for (let r = 0; r < 4; r++) {
      const { row, gained: g2 } = mergeRow(ng[r]);
      const oldStr = JSON.stringify(ng[r]);
      ng[r] = row;
      moved_cells.push(JSON.stringify(row) !== oldStr);
      gained += g2;
    }
  } else if (dir === "right") {
    for (let r = 0; r < 4; r++) {
      const rev = [...ng[r]].reverse();
      const { row, gained: g2 } = mergeRow(rev);
      const merged = [...row].reverse() as (number | null)[];
      const oldStr = JSON.stringify(ng[r]);
      ng[r] = merged;
      moved_cells.push(JSON.stringify(merged) !== oldStr);
      gained += g2;
    }
  } else if (dir === "up") {
    for (let c = 0; c < 4; c++) {
      const col = ng.map((row) => row[c]);
      const { row, gained: g2 } = mergeRow(col);
      const oldStr = JSON.stringify(col);
      moved_cells.push(JSON.stringify(row) !== oldStr);
      for (let r = 0; r < 4; r++) ng[r][c] = row[r];
      gained += g2;
    }
  } else {
    for (let c = 0; c < 4; c++) {
      const col = ng.map((row) => row[c]).reverse();
      const { row, gained: g2 } = mergeRow(col);
      const merged = [...row].reverse() as (number | null)[];
      const oldStr = JSON.stringify(ng.map((row) => row[c]));
      moved_cells.push(JSON.stringify(merged) !== oldStr);
      for (let r = 0; r < 4; r++) ng[r][c] = merged[r];
      gained += g2;
    }
  }

  const moved = moved_cells.some(Boolean);
  return { grid: ng, gained, moved };
}

function hasMax(g: Grid, n: number): boolean {
  return g.some((row) => row.some((v) => v !== null && v >= n));
}

function noMovesLeft(g: Grid): boolean {
  // Any empty cell?
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      if (g[r][c] === null) return false;
  // Any adjacent merge possible?
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = g[r][c];
      if (c + 1 < 4 && g[r][c + 1] === v) return false;
      if (r + 1 < 4 && g[r + 1][c] === v) return false;
    }
  }
  return true;
}

// ── localStorage ─────────────────────────────────────────────────────────────

function loadHi(): number {
  try { return parseInt(localStorage.getItem("numbersurge_hi") ?? "0", 10) || 0; } catch { return 0; }
}
function saveHi(n: number) {
  try { localStorage.setItem("numbersurge_hi", String(n)); } catch { /* no-op */ }
}

// ── State / Reducer ───────────────────────────────────────────────────────────

type State = {
  phase: Phase;
  grid: Grid;
  score: number;
  hi: number;
  wonBefore: boolean;  // so "keep playing" works
};

type Action =
  | { type: "start" }
  | { type: "move"; dir: Direction }
  | { type: "keep_playing" }
  | { type: "restart" };

function init(): State {
  const hi = loadHi();
  return { phase: "menu", grid: emptyGrid(), score: 0, hi, wonBefore: false };
}

function freshGrid(): Grid {
  let g = emptyGrid();
  g = spawnTile(g);
  g = spawnTile(g);
  return g;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
    case "restart":
      return { ...state, phase: "playing", grid: freshGrid(), score: 0, wonBefore: false };

    case "keep_playing":
      return { ...state, phase: "playing", wonBefore: true };

    case "move": {
      if (state.phase !== "playing") return state;
      const { grid, gained, moved } = slide(state.grid, action.dir);
      if (!moved) return state;
      const newGrid = spawnTile(grid);
      const newScore = state.score + gained;
      const newHi = Math.max(newScore, state.hi);
      if (newHi > state.hi) saveHi(newHi);

      let phase: Phase = "playing";
      if (!state.wonBefore && hasMax(newGrid, 2048)) phase = "won";
      else if (noMovesLeft(newGrid)) phase = "over";

      return { ...state, grid: newGrid, score: newScore, hi: newHi, phase };
    }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NumberSurgeGame() {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const [muted, setMuted]   = useState(false);
  const mutedRef = useRef(false);

  // Swipe tracking
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // ── Keyboard ────────────────────────────────────────────────────────────────
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowLeft: "left",  KeyA: "left",
        ArrowRight: "right", KeyD: "right",
        ArrowUp: "up",      KeyW: "up",
        ArrowDown: "down",  KeyS: "down",
      };
      const dir = map[e.code];
      if (dir) {
        e.preventDefault();
        if (state.phase === "playing") {
          dispatch({ type: "move", dir });
          if (!mutedRef.current) sfx.click();
        }
      }
    },
    [state.phase]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Play sfx on score change
  const prevScore = useRef(0);
  useEffect(() => {
    if (state.score > prevScore.current && !mutedRef.current) {
      const delta = state.score - prevScore.current;
      if (delta >= 2048) sfx.levelUp();
      else if (delta >= 128) sfx.correct();
      else sfx.tap();
    }
    prevScore.current = state.score;
  }, [state.score]);

  // ── Swipe ───────────────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || state.phase !== "playing") return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    const dir: Direction =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0 ? "right" : "left"
        : dy > 0 ? "down" : "up";
    dispatch({ type: "move", dir });
    if (!mutedRef.current) sfx.click();
  };

  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    setGlobalMuted(next);
  };

  return (
    <div
      className="flex flex-col items-center gap-4 select-none w-full px-3 py-4"
      style={{ maxWidth: "min(100%, 480px)", margin: "0 auto" }}
    >
      {state.phase === "menu" && (
        <div className="w-full flex flex-col items-center gap-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 text-white shadow-2xl border-2 border-indigo-500">
          <div className="text-5xl">🔢</div>
          <h2 className="text-4xl font-black tracking-tight font-display">Number Surge</h2>
          <p className="text-center text-white/80 text-sm max-w-xs leading-relaxed">
            Slide tiles to merge matching numbers. Reach <strong className="text-yellow-300">2048</strong> to win — then keep going for the best score. Swipe or use arrow keys.
          </p>
          {state.hi > 0 && (
            <p className="text-xs bg-black/30 px-4 py-1.5 rounded-full text-yellow-300 font-bold">
              Best score: {state.hi.toLocaleString()}
            </p>
          )}
          <button
            onClick={() => dispatch({ type: "start" })}
            className="bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white font-extrabold px-10 py-4 rounded-full text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px] min-w-[160px] touch-manipulation"
          >
            Play
          </button>
          <button onClick={toggleMute} className="text-xs px-4 py-2 bg-black/30 rounded-full min-h-[44px] touch-manipulation">
            {muted ? "🔇 Muted" : "🔊 Sound"}
          </button>
        </div>
      )}

      {(state.phase === "playing" || state.phase === "won" || state.phase === "over") && (
        <>
          {/* Score bar */}
          <div className="w-full flex items-center justify-between px-1">
            <div className="flex gap-3">
              <div className="bg-indigo-900 border border-indigo-700 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Score</p>
                <p className="text-xl font-black text-white">{state.score.toLocaleString()}</p>
              </div>
              <div className="bg-indigo-900/60 border border-indigo-800 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest">Best</p>
                <p className="text-xl font-black text-indigo-300">{state.hi.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-xl bg-indigo-900/60 border border-indigo-700 text-white flex items-center justify-center touch-manipulation"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? "🔇" : "🔊"}
              </button>
              <button
                onClick={() => dispatch({ type: "restart" })}
                className="px-3 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold border border-indigo-500 touch-manipulation min-h-[44px]"
              >
                New
              </button>
            </div>
          </div>

          {/* Grid */}
          <div
            className="w-full rounded-2xl p-3 bg-gray-900 border-2 border-indigo-800 shadow-2xl"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="grid grid-cols-4 gap-2.5">
              {state.grid.map((row, r) =>
                row.map((val, c) => {
                  const { bg, fg, size } = tileStyle(val);
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`aspect-square rounded-xl flex items-center justify-center ${bg} ${fg} ${size} transition-all duration-100`}
                      style={{ minHeight: 64 }}
                    >
                      {val ?? ""}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Arrow pad for touch */}
          <div className="grid grid-cols-3 gap-2 w-40">
            <div />
            <button
              onClick={() => { dispatch({ type: "move", dir: "up" }); if (!mutedRef.current) sfx.click(); }}
              className="aspect-square rounded-xl bg-indigo-800 hover:bg-indigo-700 active:bg-indigo-600 text-white text-xl flex items-center justify-center touch-manipulation"
              aria-label="Up"
            >▲</button>
            <div />
            <button
              onClick={() => { dispatch({ type: "move", dir: "left" }); if (!mutedRef.current) sfx.click(); }}
              className="aspect-square rounded-xl bg-indigo-800 hover:bg-indigo-700 active:bg-indigo-600 text-white text-xl flex items-center justify-center touch-manipulation"
              aria-label="Left"
            >◀</button>
            <button
              onClick={() => { dispatch({ type: "move", dir: "down" }); if (!mutedRef.current) sfx.click(); }}
              className="aspect-square rounded-xl bg-indigo-800 hover:bg-indigo-700 active:bg-indigo-600 text-white text-xl flex items-center justify-center touch-manipulation"
              aria-label="Down"
            >▼</button>
            <button
              onClick={() => { dispatch({ type: "move", dir: "right" }); if (!mutedRef.current) sfx.click(); }}
              className="aspect-square rounded-xl bg-indigo-800 hover:bg-indigo-700 active:bg-indigo-600 text-white text-xl flex items-center justify-center touch-manipulation"
              aria-label="Right"
            >▶</button>
          </div>

          <p className="text-xs text-gray-500 hidden md:block">Arrow keys or WASD · Swipe on touch</p>
        </>
      )}

      {/* Win overlay */}
      {state.phase === "won" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={(e) => e.stopPropagation()}>
          <div className="bg-gradient-to-br from-yellow-400 to-amber-600 text-gray-900 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl max-w-xs mx-4 border-4 border-yellow-200">
            <div className="text-6xl">🏆</div>
            <h2 className="text-3xl font-black">You Hit 2048!</h2>
            <p className="text-center font-semibold">Score: <span className="font-black text-2xl">{state.score.toLocaleString()}</span></p>
            <button
              onClick={() => dispatch({ type: "keep_playing" })}
              className="px-8 py-4 bg-gray-900 text-yellow-300 font-extrabold rounded-full text-lg shadow-lg touch-manipulation min-h-[56px]"
            >
              Keep Going →
            </button>
            <button
              onClick={() => dispatch({ type: "restart" })}
              className="text-sm font-bold underline touch-manipulation"
            >
              New Game
            </button>
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {state.phase === "over" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-gradient-to-br from-gray-800 to-indigo-950 text-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl max-w-xs mx-4 border-2 border-indigo-700">
            <div className="text-5xl">😤</div>
            <h2 className="text-2xl font-black text-red-400">Board Full!</h2>
            <p className="font-bold">Score: <span className="text-2xl font-black">{state.score.toLocaleString()}</span></p>
            <p className="text-yellow-300 text-sm font-bold">Best: {state.hi.toLocaleString()}</p>
            <button
              onClick={() => dispatch({ type: "restart" })}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-full text-lg touch-manipulation min-h-[56px]"
            >
              Try Again
            </button>
            <a href="/games" className="text-gray-400 text-sm touch-manipulation">All Games →</a>
          </div>
        </div>
      )}
    </div>
  );
}
