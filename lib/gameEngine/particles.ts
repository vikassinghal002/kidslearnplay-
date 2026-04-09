/**
 * particles — reusable particle system with object pooling.
 *
 * Uses a preallocated pool so spawning particles never allocates memory
 * during gameplay (important for smooth RAF loops on mobile).
 *
 * Preset spawners cover the common JiggyJoy game needs:
 *   - burst     — radial explosion (enemy defeat, pumpkin smash)
 *   - dust      — small puff (jump / land / step)
 *   - sparkle   — upward shimmer (coin / powerup collect)
 *   - scoreText — floating "+10" popup
 *
 * Usage:
 *   const fx = new ParticleSystem(100);
 *   fx.burst(x, y, "#ff9a3c");
 *   fx.update(dt);
 *   fx.draw(ctx);
 */

export type ParticleKind = "dot" | "text";

export interface Particle {
  active: boolean;
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  gravity: number;
  text: string;
}

function makeParticle(): Particle {
  return {
    active: false,
    kind: "dot",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 1,
    color: "#ffffff",
    size: 3,
    gravity: 0,
    text: "",
  };
}

export class ParticleSystem {
  readonly pool: Particle[];
  readonly capacity: number;
  /** Default font for scoreText particles. */
  textFont: string = "bold 18px sans-serif";

  constructor(capacity = 100) {
    this.capacity = capacity;
    this.pool = new Array(capacity);
    for (let i = 0; i < capacity; i++) this.pool[i] = makeParticle();
  }

  /** Free all particles immediately. */
  clear() {
    for (const p of this.pool) p.active = false;
  }

  private acquire(): Particle | null {
    for (const p of this.pool) if (!p.active) return p;
    return null;
  }

  /** Radial burst — `count` particles fanning outward from (x, y). */
  burst(
    x: number,
    y: number,
    color: string,
    count = 10,
    speed = 140,
    life = 0.6,
  ) {
    for (let i = 0; i < count; i++) {
      const p = this.acquire();
      if (!p) return;
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const spd = speed * (0.7 + Math.random() * 0.5);
      p.active = true;
      p.kind = "dot";
      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * spd;
      p.vy = Math.sin(angle) * spd;
      p.life = life + Math.random() * 0.2;
      p.maxLife = p.life;
      p.color = color;
      p.size = 2 + Math.random() * 3;
      p.gravity = 300;
    }
  }

  /** Small puff of dust — typically on jump/land. */
  dust(x: number, y: number, color = "#cbd5e1", count = 5) {
    for (let i = 0; i < count; i++) {
      const p = this.acquire();
      if (!p) return;
      p.active = true;
      p.kind = "dot";
      p.x = x + (Math.random() - 0.5) * 6;
      p.y = y;
      p.vx = (Math.random() - 0.5) * 40;
      p.vy = -20 - Math.random() * 30;
      p.life = 0.35 + Math.random() * 0.15;
      p.maxLife = p.life;
      p.color = color;
      p.size = 2 + Math.random() * 2;
      p.gravity = 0;
    }
  }

  /** Upward shimmer — coin or powerup collect. */
  sparkle(x: number, y: number, color = "#fde047", count = 8) {
    for (let i = 0; i < count; i++) {
      const p = this.acquire();
      if (!p) return;
      p.active = true;
      p.kind = "dot";
      p.x = x + (Math.random() - 0.5) * 10;
      p.y = y + (Math.random() - 0.5) * 10;
      p.vx = (Math.random() - 0.5) * 60;
      p.vy = -60 - Math.random() * 60;
      p.life = 0.5 + Math.random() * 0.3;
      p.maxLife = p.life;
      p.color = color;
      p.size = 2 + Math.random() * 2;
      p.gravity = 40;
    }
  }

  /** Floating score popup — "+10" text that rises and fades. */
  scoreText(x: number, y: number, text: string, color = "#fde047") {
    const p = this.acquire();
    if (!p) return;
    p.active = true;
    p.kind = "text";
    p.x = x;
    p.y = y;
    p.vx = 0;
    p.vy = -40;
    p.life = 0.7;
    p.maxLife = 0.7;
    p.color = color;
    p.size = 0;
    p.gravity = 0;
    p.text = text;
  }

  update(dt: number) {
    for (const p of this.pool) {
      if (!p.active) continue;
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) p.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    let lastTextSetup = false;
    for (const p of this.pool) {
      if (!p.active) continue;
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      if (p.kind === "text") {
        if (!lastTextSetup) {
          ctx.font = this.textFont;
          ctx.textAlign = "center";
          lastTextSetup = true;
        }
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fillText(p.text, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    if (lastTextSetup) ctx.textAlign = "left";
  }
}
