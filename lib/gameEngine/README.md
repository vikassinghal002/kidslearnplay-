# JiggyJoy Game Engine

A tiny, opinionated engine for building canvas-2D kids' games on JiggyJoy.
Everything is vanilla React 19 + Canvas 2D + Web Audio — no dependencies.

## What you get

| Import | Purpose |
|---|---|
| `useGameLoop` | RAF loop with pause/resume, delta time, tick callback |
| `useGameState` | Phase machine (title / playing / paused / gameover / levelClear / gameWin), score, lives, level, localStorage-backed high score |
| `useCanvas` | Canvas sizing helpers + ui_game_config wrapper style |
| `useGameInput` | Unified keyboard + pointer + swipe, customisable key bindings |
| `GameHUD` | Shared mute / pause button row |
| `GameOverlay` | Shared title / paused / gameover / levelClear / gameWin overlay |
| `sfx`, `music` | Procedural Web Audio with global mute (`setMuted(true)`) |
| `ParticleSystem` | Pooled particles: `burst`, `dust`, `sparkle`, `scoreText` |

All are re-exported from `@/lib/gameEngine`.

## Minimal game skeleton (~60 lines)

```tsx
"use client";
import { useRef, useState, useEffect } from "react";
import {
  useGameLoop, useGameState, useGameInput,
  GameHUD, GameOverlay, sfx, music, setMuted,
  ParticleSystem,
} from "@/lib/gameEngine";

const W = 480, H = 480;

export default function MyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fx = useRef(new ParticleSystem(50));
  const player = useRef({ x: 240, y: 240 });
  const [muted, setMutedState] = useState(false);

  const g = useGameState({ storageKey: "jiggy.mygame.best" });
  const input = useGameInput({
    canvasRef, drawW: W, drawH: H,
    bindings: {
      up: ["ArrowUp"], down: ["ArrowDown"],
      left: ["ArrowLeft"], right: ["ArrowRight"],
      action: ["Space"],
    },
  });

  useEffect(() => { setMuted(muted); }, [muted]);
  useEffect(() => {
    if (g.phase === "playing") music.start("happy"); else music.stop();
  }, [g.phase]);

  useGameLoop((dt) => {
    if (g.ref.current.phase === "playing") {
      if (input.pressed.up)    player.current.y -= 200 * dt;
      if (input.pressed.down)  player.current.y += 200 * dt;
      if (input.pressed.left)  player.current.x -= 200 * dt;
      if (input.pressed.right) player.current.x += 200 * dt;
      if (input.consumeJustPressed("action")) { sfx.jump(); g.addScore(1); }
    }
    fx.current.update(dt);

    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#4ade80";
    ctx.beginPath(); ctx.arc(player.current.x, player.current.y, 14, 0, Math.PI * 2); ctx.fill();
    fx.current.draw(ctx);

    ctx.fillStyle = "#fff"; ctx.font = "bold 14px sans-serif";
    ctx.fillText(`SCORE ${g.ref.current.score}`, 8, 18);
  });

  return (
    <div className="flex flex-col gap-2 select-none"
      style={{ width: "100%", maxWidth: "min(100%, calc(100dvh - 80px))", margin: "0 auto" }}>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-green-900">
        <canvas ref={canvasRef} width={W} height={H} className="block"
          style={{ width: "100%", height: "auto", background: "#0f172a" }} />
        <GameOverlay phase={g.phase} title="MY GAME" emoji="🎮"
          score={g.score} highScore={g.highScore}
          onStart={g.start} onRestart={g.restart}
          accentClass="text-green-400"
          buttonClass="bg-green-500 hover:bg-green-400 shadow-green-500/40"
          hint="Arrow keys to move · Space to jump" />
      </div>
      <GameHUD phase={g.phase} muted={muted}
        onToggleMute={() => setMutedState(m => !m)}
        onTogglePause={g.togglePause}
        hint="Arrow keys · Swipe on mobile" />
    </div>
  );
}
```

Register in `components/games/GameLoader.tsx`:

```tsx
const MyGame = dynamic(() => import("./MyGame"), { ssr: false });
// add MyGame to the `components` record
```

…and add an entry in `lib/data.ts` (`component: "MyGame"`).

## Rules to follow

1. **Read state from `g.ref.current` inside the tick** — not from the React
   state. The ref is mutated in place so the tick closure stays stable.
2. **Call `setMuted(muted)` from an effect** whenever your mute state
   changes. All sfx/music go through this global flag.
3. **Start music on `"playing"`, stop it anywhere else** via a phase effect.
4. **Follow `ui_game_config.md`** for canvas sizing — the wrapper `maxWidth`
   formula is `calc(W/H * (100dvh - 80px))`.
5. **Keep the canvas intrinsic size (`<canvas width height>`) fixed.**
   Do not set it from JS unless you opt into DPR scaling in `useCanvas`.
6. **Particles are pooled.** Call `fx.current.burst(...)` anywhere; the pool
   size you pass to `new ParticleSystem(N)` is the hard cap.
7. **Don't break the public game API.** `GameLoader.tsx` still imports a
   default-exported component with no props.

## What's intentionally NOT in the engine (yet)

- **Sprite/asset loading** — all current games draw with Canvas 2D primitives.
  When we add sprite atlases, that goes in `assets.ts`.
- **Physics** — Snake/PumpkinSmash don't need a physics engine and pulling in
  a dep would bloat the bundle. Games that need AABB collision (SuperJumper)
  still roll their own.
- **Screen shake** — each game has subtly different needs (magnitude,
  trauma-based decay, etc.). It's 5 lines of code, not worth abstracting.
- **Pause on visibility change / blur** — implement per-game when needed;
  some games want to keep running (e.g. idle demo reels).
- **Save games / progression beyond high score** — if a game needs this,
  write a game-specific localStorage helper.

Keep the engine small. When in doubt, add features to games, not to the engine.
