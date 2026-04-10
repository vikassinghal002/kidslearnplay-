/**
 * JiggyJoy Game Engine — barrel export.
 *
 * Games import from `@/lib/gameEngine`:
 *
 *   import {
 *     useGameLoop, useGameState, useCanvas, useGameInput,
 *     GameHUD, GameOverlay, sfx, music, ParticleSystem,
 *   } from "@/lib/gameEngine";
 *
 * Everything in here is opinionated for JiggyJoy's canvas-2D + Web-Audio
 * kid-friendly games. See README.md in this folder for a minimal game skeleton.
 */

export { useGameLoop } from "./useGameLoop";
export type { GameLoopTick, UseGameLoopOptions } from "./useGameLoop";

export { useGameState } from "./useGameState";
export type {
  GamePhase,
  GameStateApi,
  GameStateSnapshot,
  UseGameStateOptions,
} from "./useGameState";

export { useCanvas, clientToCanvas } from "./useCanvas";
export type { UseCanvasOptions, UseCanvasResult } from "./useCanvas";

export { useGameInput } from "./useGameInput";
export type { GameInput, KeyBindings, UseGameInputOptions } from "./useGameInput";

export { sfx, music, setMuted, isMuted, toggleMuted, stopAll } from "./audio";
export type { MusicTheme } from "./audio";

export { ParticleSystem } from "./particles";
export type { Particle, ParticleKind } from "./particles";

export { GameHUD } from "./GameHUD";
export { GameOverlay } from "./GameOverlay";
export type { GameOverlayProps } from "./GameOverlay";
