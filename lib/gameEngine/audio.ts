"use client";

/**
 * gameEngine/audio — thin wrapper around lib/gameAudio that adds a global
 * mute toggle and the canonical SFX names used across JiggyJoy games.
 *
 * The underlying Web Audio synth lives in lib/gameAudio.ts (see that file for
 * oscillator details). This module re-exports the same SFX map with a few
 * extra aliases and a `music` namespace so games can just do:
 *
 *   import { sfx, music } from "@/lib/gameEngine";
 *   sfx.jump();
 *   music.start("happy");
 *
 * Global mute: call `setMuted(true)` once and every subsequent sfx/music call
 * becomes a no-op until muted is cleared. This removes the `if (!muted)`
 * boilerplate that every game currently has.
 */

import {
  sfx as rawSfx,
  startMusic as rawStartMusic,
  stopMusic as rawStopMusic,
  stopAllSounds as rawStopAllSounds,
} from "@/lib/gameAudio";

type SfxFn = () => void;
type SfxMap = Record<string, SfxFn>;

let muted = false;

export function setMuted(value: boolean) {
  muted = value;
  if (muted) rawStopMusic();
}

export function isMuted(): boolean {
  return muted;
}

export function toggleMuted(): boolean {
  setMuted(!muted);
  return muted;
}

// Proxy the raw sfx map so every call short-circuits when muted.
function wrapSfx(raw: Record<string, SfxFn>): SfxMap {
  const out: SfxMap = {};
  for (const [name, fn] of Object.entries(raw)) {
    out[name] = () => {
      if (muted) return;
      fn();
    };
  }
  // Canonical aliases used by the engine skeleton / docs
  out.stomp = out.stomp || out.enemyHit || rawSfx.enemyHit;
  out.hit = out.hit || out.playerHit || rawSfx.playerHit;
  out.win = out.win || out.levelUp || rawSfx.levelUp;
  out.burst = out.burst || out.powerUp || rawSfx.powerUp;
  // Re-wrap the aliases under the mute guard
  for (const alias of ["stomp", "hit", "win", "burst"]) {
    const original = out[alias];
    out[alias] = () => {
      if (muted) return;
      original();
    };
  }
  return out;
}

export const sfx = wrapSfx(rawSfx as unknown as Record<string, SfxFn>) as {
  shoot: SfxFn;
  enemyHit: SfxFn;
  playerHit: SfxFn;
  brickHit: SfxFn;
  paddleHit: SfxFn;
  wallHit: SfxFn;
  powerUp: SfxFn;
  jump: SfxFn;
  die: SfxFn;
  eat: SfxFn;
  levelUp: SfxFn;
  correct: SfxFn;
  wrong: SfxFn;
  pop: SfxFn;
  click: SfxFn;
  coin: SfxFn;
  tap: SfxFn;
  /* canonical aliases */
  stomp: SfxFn;
  hit: SfxFn;
  win: SfxFn;
  burst: SfxFn;
};

export type MusicTheme = "space" | "happy" | "adventure";

export const music = {
  start(theme: MusicTheme) {
    if (muted) return;
    rawStartMusic(theme);
  },
  stop() {
    rawStopMusic();
  },
};

/**
 * Kills every sound immediately — music chain, scheduled oscillators, the lot.
 * Call this from the game container's unmount effect so audio doesn't leak
 * into the page the kid just navigated to.
 */
export function stopAll() {
  rawStopAllSounds();
}
