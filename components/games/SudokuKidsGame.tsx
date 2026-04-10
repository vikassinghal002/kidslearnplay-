"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx, startMusic, stopMusic, setGlobalMuted } from "@/lib/gameAudio";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "menu" | "playing" | "finished";

// 5 hardcoded 4x4 sudoku puzzles — each solution satisfies row/col/2x2 box.
const VALID_PUZZLES: { puzzle: number[][]; solution: number[][] }[] = [
  {
    // Solution: [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]]
    puzzle: [
      [1, 0, 0, 4],
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [4, 0, 0, 1],
    ],
    solution: [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ],
  },
  {
    // Solution: [[2,1,3,4],[3,4,1,2],[1,2,4,3],[4,3,2,1]]
    puzzle: [
      [0, 1, 3, 0],
      [3, 0, 0, 2],
      [0, 0, 4, 0],
      [4, 3, 0, 1],
    ],
    solution: [
      [2, 1, 3, 4],
      [3, 4, 1, 2],
      [1, 2, 4, 3],
      [4, 3, 2, 1],
    ],
  },
  {
    // Solution: [[4,3,2,1],[1,2,3,4],[3,4,1,2],[2,1,4,3]]
    puzzle: [
      [4, 0, 2, 0],
      [0, 2, 0, 4],
      [3, 0, 1, 0],
      [0, 1, 0, 3],
    ],
    solution: [
      [4, 3, 2, 1],
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
    ],
  },
  {
    // Solution: [[1,2,3,4],[3,4,2,1],[2,1,4,3],[4,3,1,2]]
    puzzle: [
      [0, 2, 0, 4],
      [3, 0, 2, 0],
      [0, 1, 0, 3],
      [4, 0, 1, 0],
    ],
    solution: [
      [1, 2, 3, 4],
      [3, 4, 2, 1],
      [2, 1, 4, 3],
      [4, 3, 1, 2],
    ],
  },
  {
    // Solution: [[2,3,1,4],[1,4,2,3],[3,2,4,1],[4,1,3,2]]
    puzzle: [
      [0, 3, 1, 0],
      [1, 0, 0, 3],
      [0, 0, 4, 0],
      [4, 1, 0, 2],
    ],
    solution: [
      [2, 3, 1, 4],
      [1, 4, 2, 3],
      [3, 2, 4, 1],
      [4, 1, 3, 2],
    ],
  },
];

type CellState = {
  value: number; // 0 = empty
  fixed: boolean; // given, can't change
};

function clonePuzzle(idx: number): CellState[][] {
  const p = VALID_PUZZLES[idx % VALID_PUZZLES.length].puzzle;
  return p.map((row) => row.map((v) => ({ value: v, fixed: v !== 0 })));
}

// Check if placing `num` at (r,c) would conflict
function hasConflict(grid: CellState[][], r: number, c: number, num: number): boolean {
  for (let i = 0; i < 4; i++) {
    if (i !== c && grid[r][i].value === num) return true;
    if (i !== r && grid[i][c].value === num) return true;
  }
  const br = Math.floor(r / 2) * 2;
  const bc = Math.floor(c / 2) * 2;
  for (let dr = 0; dr < 2; dr++) {
    for (let dc = 0; dc < 2; dc++) {
      const rr = br + dr, cc = bc + dc;
      if ((rr !== r || cc !== c) && grid[rr][cc].value === num) return true;
    }
  }
  return false;
}

function isComplete(grid: CellState[][]): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c].value === 0) return false;
    }
  }
  // Validate all rows/cols/boxes
  for (let i = 0; i < 4; i++) {
    const row = new Set<number>();
    const col = new Set<number>();
    for (let j = 0; j < 4; j++) {
      row.add(grid[i][j].value);
      col.add(grid[j][i].value);
    }
    if (row.size !== 4 || col.size !== 4) return false;
  }
  for (let br = 0; br < 2; br++) {
    for (let bc = 0; bc < 2; bc++) {
      const box = new Set<number>();
      for (let dr = 0; dr < 2; dr++) {
        for (let dc = 0; dc < 2; dc++) {
          box.add(grid[br * 2 + dr][bc * 2 + dc].value);
        }
      }
      if (box.size !== 4) return false;
    }
  }
  return true;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SudokuKidsGame() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [grid, setGrid] = useState<CellState[][]>(() => clonePuzzle(0));
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [invalidCell, setInvalidCell] = useState<{ r: number; c: number } | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    setGlobalMuted(next);
    if (next) stopMusic();
    else if (phase === "playing") startMusic("calm");
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && !mutedRef.current) {
      startMusic("calm");
    }
    return () => {
      stopMusic();
    };
  }, [phase]);

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 500);
    return () => clearInterval(interval);
  }, [phase, startTime]);

  const startGame = useCallback(() => {
    setPuzzleIdx(0);
    setGrid(clonePuzzle(0));
    setSelected(null);
    setInvalidCell(null);
    setStartTime(Date.now());
    setElapsed(0);
    setPhase("playing");
    if (!mutedRef.current) sfx.click();
  }, []);

  const nextPuzzle = useCallback(() => {
    setPuzzleIdx((i) => {
      const ni = (i + 1) % VALID_PUZZLES.length;
      setGrid(clonePuzzle(ni));
      setSelected(null);
      setInvalidCell(null);
      setStartTime(Date.now());
      setElapsed(0);
      setPhase("playing");
      if (!mutedRef.current) sfx.click();
      return ni;
    });
  }, []);

  const handleCellTap = useCallback(
    (r: number, c: number) => {
      if (grid[r][c].fixed) return;
      if (!mutedRef.current) sfx.click();
      setSelected({ r, c });
    },
    [grid]
  );

  const handleNumTap = useCallback(
    (num: number) => {
      if (!selected) return;
      const { r, c } = selected;
      if (grid[r][c].fixed) return;

      if (hasConflict(grid, r, c, num)) {
        if (!mutedRef.current) sfx.wrong();
        setInvalidCell({ r, c });
        setTimeout(() => setInvalidCell(null), 400);
        return;
      }

      const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
      newGrid[r][c].value = num;
      setGrid(newGrid);
      if (!mutedRef.current) sfx.correct();

      if (isComplete(newGrid)) {
        const finalTime = Math.floor((Date.now() - startTime) / 1000);
        setElapsed(finalTime);
        setBestTime((bt) => (bt === null ? finalTime : Math.min(bt, finalTime)));
        setPhase("finished");
        stopMusic();
        if (!mutedRef.current) sfx.levelUp();
      }
    },
    [selected, grid, startTime]
  );

  const handleClear = useCallback(() => {
    if (!selected) return;
    const { r, c } = selected;
    if (grid[r][c].fixed) return;
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    newGrid[r][c].value = 0;
    setGrid(newGrid);
    if (!mutedRef.current) sfx.click();
  }, [selected, grid]);

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
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-600 to-green-700 p-6 text-white shadow-2xl border-2 border-teal-300 flex-1">
          <div className="text-6xl">🧩</div>
          <h2 className="text-3xl font-extrabold text-center drop-shadow">Sudoku Kids</h2>
          <p className="text-center text-white/90 text-sm max-w-xs">
            A friendly 4×4 sudoku for kids. Fill every row, column and box with 1-4. No repeats!
          </p>
          {bestTime !== null && (
            <p className="text-xs bg-black/30 px-3 py-1 rounded-full">Best time: {bestTime}s</p>
          )}
          <button
            onClick={startGame}
            className="bg-yellow-300 text-emerald-900 font-extrabold px-8 py-4 rounded-full text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px] min-w-[160px]"
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
        <div className="w-full flex flex-col gap-3 rounded-2xl bg-gradient-to-b from-teal-50 to-emerald-100 p-4 shadow-2xl border-2 border-teal-500 flex-1">
          {/* HUD */}
          <div className="flex items-center justify-between text-sm">
            <div className="font-bold text-emerald-800">
              Puzzle <span className="text-2xl">{puzzleIdx + 1}</span>/{VALID_PUZZLES.length}
            </div>
            <div className="font-bold text-emerald-800">
              ⏱ <span className="text-2xl">{elapsed}s</span>
            </div>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-xs px-3 py-2 bg-emerald-200 text-emerald-900 rounded-full min-h-[40px]"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* Grid */}
          <div className="flex items-center justify-center">
            <div
              className="grid grid-cols-4 gap-[2px] bg-emerald-900 p-[3px] rounded-xl shadow-lg"
              style={{ width: "min(100%, 320px)" }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const isSelected = selected?.r === r && selected?.c === c;
                  const isInvalid = invalidCell?.r === r && invalidCell?.c === c;
                  // Thicker borders between boxes
                  const borderR = c === 1 ? "border-r-4 border-r-emerald-900" : "";
                  const borderB = r === 1 ? "border-b-4 border-b-emerald-900" : "";
                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellTap(r, c)}
                      disabled={cell.fixed}
                      className={`aspect-square flex items-center justify-center text-3xl font-extrabold rounded-sm transition-colors ${borderR} ${borderB} ${
                        cell.fixed
                          ? "bg-emerald-200 text-emerald-900"
                          : isInvalid
                          ? "bg-red-400 text-white animate-pulse"
                          : isSelected
                          ? "bg-yellow-300 text-emerald-900 ring-4 ring-yellow-500"
                          : "bg-white text-blue-700 hover:bg-yellow-100"
                      }`}
                      style={{ minWidth: 44, minHeight: 44 }}
                    >
                      {cell.value === 0 ? "" : cell.value}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <p className="text-center text-xs text-emerald-800">
            Tap a blank cell, then tap a number below
          </p>

          {/* Number pad */}
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => handleNumTap(n)}
                disabled={!selected}
                className="min-h-[56px] rounded-xl text-3xl font-extrabold border-2 bg-white border-emerald-500 text-emerald-700 hover:bg-emerald-100 active:scale-95 shadow-md disabled:opacity-50"
              >
                {n}
              </button>
            ))}
            <button
              onClick={handleClear}
              disabled={!selected}
              className="min-h-[56px] rounded-xl text-lg font-extrabold border-2 bg-white border-gray-500 text-gray-700 hover:bg-gray-100 active:scale-95 shadow-md disabled:opacity-50"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {phase === "finished" && (
        <div className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 text-white shadow-2xl border-2 border-teal-300 flex-1">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-extrabold">Solved!</h2>
          <p className="text-xl">
            Time: <span className="font-extrabold text-4xl">{elapsed}s</span>
          </p>
          {bestTime !== null && <p className="text-sm">Best time: {bestTime}s</p>}
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={nextPuzzle}
              className="bg-yellow-300 text-emerald-900 font-extrabold px-6 py-4 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform min-h-[56px]"
            >
              ▶ Next Puzzle
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
