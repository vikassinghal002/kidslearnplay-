"use client";

/**
 * GameHUD — shared HUD overlay rendered as absolutely-positioned HTML on top
 * of the canvas. This is the non-canvas HUD (sound toggle, pause button). The
 * in-canvas HUD (score, timer text) is game-specific and drawn by the game.
 *
 * The reason we split: games need to draw score/timer inside the canvas so
 * they scale with the game resolution and don't jump around during resize,
 * but the mute / pause buttons are better as real DOM elements for
 * accessibility (focus, keyboard, screenreader).
 *
 * Layout follows ui_game_config.md: a thin row of pill-shaped buttons below
 * the canvas. Pass any subset of showPause / showMute / showFullscreen to
 * opt out. Fullscreen is usually handled by GameScreen already, but games
 * rendered standalone (storybook / debug) may want the engine to provide it.
 */

import type { GamePhase } from "./useGameState";

interface GameHUDProps {
  /** Current phase — used to toggle pause button label. */
  phase: GamePhase;
  /** Is audio muted? */
  muted: boolean;
  /** Called when the sound button is clicked. */
  onToggleMute: () => void;
  /** Called when the pause button is clicked. Omit to hide. */
  onTogglePause?: () => void;
  /** Hint text shown to the right (e.g. "Arrow keys to move · Swipe on mobile"). */
  hint?: string;
  /** Extra className for the HUD row. */
  className?: string;
  /** Optional slot for extra buttons. */
  children?: React.ReactNode;
}

export function GameHUD({
  phase,
  muted,
  onToggleMute,
  onTogglePause,
  hint,
  className = "",
  children,
}: GameHUDProps) {
  const canPause = phase === "playing" || phase === "paused";
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex gap-2 items-center flex-wrap">
        <button
          type="button"
          onClick={onToggleMute}
          className="text-xs px-3 py-1 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
          aria-pressed={muted}
        >
          {muted ? "🔇 Muted" : "🔊 Sound"}
        </button>

        {onTogglePause && canPause && (
          <button
            type="button"
            onClick={onTogglePause}
            className="text-xs px-3 py-1 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
          >
            {phase === "paused" ? "▶ Resume" : "⏸ Pause"}
          </button>
        )}

        {children}
      </div>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
