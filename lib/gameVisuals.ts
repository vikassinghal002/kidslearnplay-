// Per-game visual config. Kids don't read — they respond to colourful
// characters and icons. Every game gets a big hero emoji, a unique
// gradient background and 2-3 decorative sparkle emojis.

export type GameVisual = {
  hero: string;      // the big character / icon
  gradient: string;  // Tailwind gradient classes applied to the card background
  sparkles: string[]; // 2-3 small decorative emojis sprinkled around
};

// Fallback so any new game still renders nicely until a custom visual is added.
export const defaultVisual: GameVisual = {
  hero: "🎮",
  gradient: "from-purple-500 via-pink-500 to-orange-400",
  sparkles: ["⭐", "✨", "💫"],
};

export const gameVisuals: Record<string, GameVisual> = {
  // ── Math Games ───────────────────────────────────────────
  "maths-play":              { hero: "🔢", gradient: "from-indigo-500 via-purple-500 to-pink-500", sparkles: ["➕", "✖️", "➖"] },
  "math-quiz":               { hero: "🧮", gradient: "from-blue-500 via-cyan-500 to-teal-400",     sparkles: ["⏱️", "💯", "⭐"] },
  "times-tables-challenge":  { hero: "⚡", gradient: "from-yellow-400 via-orange-500 to-red-500",   sparkles: ["🔥", "💪", "🏆"] },
  "multiplication-blast":    { hero: "🚀", gradient: "from-purple-600 via-fuchsia-500 to-pink-500",  sparkles: ["💥", "🪐", "✨"] },
  "math-addition":           { hero: "➕", gradient: "from-emerald-500 via-teal-500 to-cyan-500",   sparkles: ["🌟", "💚", "🎯"] },
  "math-subtraction":        { hero: "➖", gradient: "from-rose-500 via-red-500 to-orange-500",      sparkles: ["💖", "🎯", "✨"] },
  "counting-game":           { hero: "⭐", gradient: "from-amber-400 via-yellow-400 to-orange-400",  sparkles: ["🌟", "✨", "💫"] },

  // ── Toddler Games ────────────────────────────────────────
  "shape-sorter":            { hero: "🔷", gradient: "from-teal-400 via-cyan-500 to-blue-500",      sparkles: ["🔶", "🟣", "🟢"] },
  "colour-match":            { hero: "🌈", gradient: "from-pink-400 via-purple-400 to-yellow-300",  sparkles: ["🎨", "💗", "💜"] },
  "animal-sounds":           { hero: "🦁", gradient: "from-orange-400 via-amber-400 to-yellow-400",  sparkles: ["🐯", "🐘", "🐸"] },
  "bubble-pop-abc":          { hero: "🫧", gradient: "from-cyan-300 via-sky-400 to-blue-500",       sparkles: ["🔤", "💙", "✨"] },
  "connect-the-dots":        { hero: "✏️", gradient: "from-pink-400 via-purple-500 to-indigo-500",   sparkles: ["1️⃣", "2️⃣", "3️⃣"] },

  // ── Educational Games ────────────────────────────────────
  "alphabet-match":          { hero: "🔤", gradient: "from-cyan-400 via-blue-500 to-indigo-500",    sparkles: ["🅰️", "🅱️", "✨"] },
  "memory-match-animals":    { hero: "🐰", gradient: "from-green-400 via-emerald-500 to-teal-500",   sparkles: ["🐶", "🐱", "🐼"] },
  "word-spell":              { hero: "📖", gradient: "from-blue-500 via-indigo-500 to-purple-500",   sparkles: ["🔤", "✍️", "⭐"] },
  "pattern-wizard":          { hero: "🔮", gradient: "from-purple-500 via-fuchsia-500 to-pink-500",  sparkles: ["✨", "🌟", "💫"] },
  "sorting-frenzy":          { hero: "🎯", gradient: "from-red-500 via-orange-500 to-yellow-500",    sparkles: ["📦", "🎁", "⚡"] },
  "story-adventure":         { hero: "📚", gradient: "from-amber-500 via-orange-500 to-red-500",     sparkles: ["🗺️", "🏰", "✨"] },

  // ── Arcade Games ─────────────────────────────────────────
  "space-defender":          { hero: "🚀", gradient: "from-indigo-700 via-purple-700 to-blue-800",   sparkles: ["👾", "🛸", "⭐"] },
  "brick-breaker":           { hero: "🧱", gradient: "from-rose-500 via-red-500 to-orange-500",       sparkles: ["⚡", "💥", "🎯"] },
  "dino-run":                { hero: "🦖", gradient: "from-lime-500 via-green-500 to-emerald-600",    sparkles: ["🌵", "🦕", "🌋"] },
  "snake":                   { hero: "🐍", gradient: "from-green-500 via-emerald-500 to-teal-600",    sparkles: ["🍎", "⭐", "💎"] },

  // ── Seasonal Games ───────────────────────────────────────
  "pumpkin-smash":           { hero: "🎃", gradient: "from-orange-600 via-orange-500 to-purple-900",  sparkles: ["👻", "🦇", "🕷️"] },
  "present-catcher":         { hero: "🎁", gradient: "from-red-600 via-rose-500 to-green-600",        sparkles: ["🎄", "⭐", "❄️"] },
  "easter-egg-hunt":         { hero: "🥚", gradient: "from-pink-400 via-purple-400 to-yellow-300",    sparkles: ["🐰", "🌸", "🌷"] },
};

export function getGameVisual(slug: string): GameVisual {
  return gameVisuals[slug] ?? defaultVisual;
}
