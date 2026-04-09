// Visual config for Pinterest pin generation.
//
// Pin images are 1000x1500 vertical cards assembled in `app/pin/.../route.tsx`.
// This module centralises the gradient + hero emoji + decorative sparkles
// for each content type so pins look on-brand and eye-catching.
//
// For games we reuse `lib/gameVisuals.ts` directly. For coloring + worksheets
// we derive a visual from the category / subject / tags.

import type { ColoringCategory, ColoringPage, Worksheet } from "@/lib/data";
import { getGameVisual, type GameVisual } from "@/lib/gameVisuals";

export type PinVisual = {
  hero: string;      // big hero emoji
  gradient: string;  // CSS linear-gradient (NOT tailwind) — ImageResponse can't use tailwind
  sparkles: string[]; // decorative emoji
  badge: string;     // top badge text ("FREE PRINTABLE", etc.)
};

// ─── Gradient palette ─────────────────────────────────────────────────────────
// Hand-tuned for high contrast + Pinterest-friendliness. Each is a 3-stop
// linear gradient at 135deg for a natural diagonal flow.

const GRADIENTS = {
  purpleSunset:  "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)",
  oceanSky:      "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%)",
  mintForest:    "linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #0ea5e9 100%)",
  sunburst:      "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)",
  roseBerry:     "linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #8b5cf6 100%)",
  bubblegum:     "linear-gradient(135deg, #f472b6 0%, #a78bfa 50%, #fbbf24 100%)",
  candy:         "linear-gradient(135deg, #fb7185 0%, #f472b6 50%, #c084fc 100%)",
  autumn:        "linear-gradient(135deg, #f97316 0%, #eab308 50%, #dc2626 100%)",
  lagoon:        "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)",
  meadow:        "linear-gradient(135deg, #84cc16 0%, #10b981 50%, #14b8a6 100%)",
  halloween:     "linear-gradient(135deg, #ea580c 0%, #7c2d12 50%, #581c87 100%)",
  christmas:     "linear-gradient(135deg, #dc2626 0%, #16a34a 50%, #b91c1c 100%)",
  easter:        "linear-gradient(135deg, #f9a8d4 0%, #c4b5fd 50%, #fde68a 100%)",
  mandalaGold:   "linear-gradient(135deg, #92400e 0%, #d97706 50%, #fbbf24 100%)",
  zenCalm:       "linear-gradient(135deg, #64748b 0%, #94a3b8 50%, #cbd5e1 100%)",
  fantasy:       "linear-gradient(135deg, #9333ea 0%, #6366f1 50%, #0ea5e9 100%)",
  space:         "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)",
} as const;

// ─── Coloring category → pin visual ───────────────────────────────────────────

const COLORING_CATEGORY_VISUALS: Record<string, Omit<PinVisual, "badge">> = {
  // Curated categories (match slugs in lib/data.ts)
  "animal-mandalas":   { hero: "🦁", gradient: GRADIENTS.mandalaGold, sparkles: ["🐾", "✨", "🌟"] },
  "floral-mandalas":   { hero: "🌸", gradient: GRADIENTS.roseBerry,   sparkles: ["🌺", "🌷", "✨"] },
  "bold-easy":         { hero: "😌", gradient: GRADIENTS.zenCalm,     sparkles: ["🌼", "💆", "☁️"] },
  "cozy-animals":      { hero: "🦊", gradient: GRADIENTS.autumn,      sparkles: ["🍂", "☕", "🏡"] },
  "fantasy":           { hero: "🧚", gradient: GRADIENTS.fantasy,     sparkles: ["✨", "🌙", "⭐"] },
  "zodiac":            { hero: "♈", gradient: GRADIENTS.space,       sparkles: ["✨", "🌟", "🔮"] },
  "dog-breeds":        { hero: "🐕", gradient: GRADIENTS.sunburst,    sparkles: ["🦴", "🐾", "❤️"] },
  "cat-breeds":        { hero: "🐈", gradient: GRADIENTS.candy,       sparkles: ["🐾", "🐟", "💖"] },
  "horses":            { hero: "🐎", gradient: GRADIENTS.meadow,      sparkles: ["🌾", "🏇", "🌻"] },
  "birds":             { hero: "🦜", gradient: GRADIENTS.lagoon,      sparkles: ["🪶", "🌿", "✨"] },
  "ocean":             { hero: "🐠", gradient: GRADIENTS.lagoon,      sparkles: ["🐚", "🌊", "✨"] },
  "dinosaurs":         { hero: "🦖", gradient: GRADIENTS.meadow,      sparkles: ["🌋", "🌴", "🦕"] },
  // Bulk categories
  "animals":           { hero: "🐾", gradient: GRADIENTS.meadow,      sparkles: ["🦊", "🐻", "🐰"] },
  "mandalas":          { hero: "🔮", gradient: GRADIENTS.mandalaGold, sparkles: ["✨", "🌟", "💫"] },
  "holidays":          { hero: "🎉", gradient: GRADIENTS.candy,       sparkles: ["🎁", "🎊", "⭐"] },
  "nature":            { hero: "🌿", gradient: GRADIENTS.meadow,      sparkles: ["🌸", "🌻", "🦋"] },
  "educational":       { hero: "📚", gradient: GRADIENTS.oceanSky,    sparkles: ["✏️", "🔤", "➕"] },
  "vehicles":          { hero: "🚗", gradient: GRADIENTS.sunburst,    sparkles: ["🚀", "🚁", "🏎️"] },
  "characters":        { hero: "🦸", gradient: GRADIENTS.roseBerry,   sparkles: ["⭐", "💫", "✨"] },
  "general":           { hero: "🎨", gradient: GRADIENTS.purpleSunset, sparkles: ["✏️", "🖍️", "✨"] },
  // Seasonal
  "halloween":         { hero: "🎃", gradient: GRADIENTS.halloween,   sparkles: ["👻", "🦇", "🕷️"] },
  "christmas":         { hero: "🎄", gradient: GRADIENTS.christmas,   sparkles: ["🎁", "❄️", "⭐"] },
  "easter":            { hero: "🐣", gradient: GRADIENTS.easter,      sparkles: ["🥚", "🐰", "🌷"] },
};

const DEFAULT_COLORING_VISUAL: Omit<PinVisual, "badge"> = {
  hero: "🎨",
  gradient: GRADIENTS.purpleSunset,
  sparkles: ["🖍️", "✏️", "✨"],
};

export function getColoringCategoryVisual(categorySlug: string): Omit<PinVisual, "badge"> {
  return COLORING_CATEGORY_VISUALS[categorySlug] ?? DEFAULT_COLORING_VISUAL;
}

// Look at a specific coloring page (tags + slug) to see if we can override
// the category visual with something more specific. For example a
// "unicorn-coloring-pages" slug under `fantasy` should prefer a unicorn hero.
export function getColoringPageVisual(page: ColoringPage, category?: ColoringCategory): PinVisual {
  const base = getColoringCategoryVisual(page.category);
  // Slug-based overrides for common hero emojis
  const slugLower = page.slug.toLowerCase();
  const tagStr = page.tags.join(" ").toLowerCase();
  const searchable = `${slugLower} ${tagStr} ${page.title.toLowerCase()}`;

  const overrides: Array<[RegExp, string]> = [
    [/unicorn/,    "🦄"],
    [/dragon/,     "🐉"],
    [/mermaid/,    "🧜"],
    [/fairy/,      "🧚"],
    [/dinosaur|dino|t[-\s]?rex/, "🦖"],
    [/butterfly/,  "🦋"],
    [/cat|kitten/, "🐱"],
    [/dog|puppy/,  "🐶"],
    [/lion/,       "🦁"],
    [/tiger/,      "🐯"],
    [/elephant/,   "🐘"],
    [/horse|pony/, "🐴"],
    [/bear/,       "🐻"],
    [/fox/,        "🦊"],
    [/bunny|rabbit/, "🐰"],
    [/owl/,        "🦉"],
    [/bird/,       "🐦"],
    [/fish/,       "🐟"],
    [/turtle/,     "🐢"],
    [/dolphin/,    "🐬"],
    [/whale/,      "🐳"],
    [/rose/,       "🌹"],
    [/sunflower/,  "🌻"],
    [/lotus/,      "🪷"],
    [/flower|botanical|floral/, "🌸"],
    [/mandala/,    "🔮"],
    [/halloween|pumpkin|ghost/, "🎃"],
    [/christmas|santa|reindeer/, "🎄"],
    [/easter|egg/, "🥚"],
    [/star|space|galaxy/, "⭐"],
    [/princess/,   "👸"],
    [/car|truck|vehicle/, "🚗"],
    [/robot/,      "🤖"],
  ];

  let hero = base.hero;
  for (const [re, emoji] of overrides) {
    if (re.test(searchable)) {
      hero = emoji;
      break;
    }
  }

  // Optional: use the category's icon if nothing more specific
  if (hero === base.hero && category?.icon) {
    hero = category.icon;
  }

  return {
    ...base,
    hero,
    badge: "FREE PRINTABLE",
  };
}

// ─── Worksheet → pin visual ───────────────────────────────────────────────────

const WORKSHEET_SUBJECT_VISUALS: Record<string, Omit<PinVisual, "badge">> = {
  Math:    { hero: "🔢", gradient: GRADIENTS.oceanSky,     sparkles: ["➕", "➖", "✖️"] },
  Writing: { hero: "✏️", gradient: GRADIENTS.bubblegum,    sparkles: ["🔤", "📝", "✨"] },
  Reading: { hero: "📖", gradient: GRADIENTS.mintForest,   sparkles: ["🔤", "📚", "⭐"] },
  Art:     { hero: "🎨", gradient: GRADIENTS.roseBerry,    sparkles: ["🖍️", "🌈", "✨"] },
  Science: { hero: "🔬", gradient: GRADIENTS.lagoon,       sparkles: ["🧪", "🌱", "⚗️"] },
};

const DEFAULT_WORKSHEET_VISUAL: Omit<PinVisual, "badge"> = {
  hero: "📄",
  gradient: GRADIENTS.oceanSky,
  sparkles: ["✏️", "⭐", "✨"],
};

export function getWorksheetVisual(ws: Worksheet): PinVisual {
  const base = WORKSHEET_SUBJECT_VISUALS[ws.subject] ?? DEFAULT_WORKSHEET_VISUAL;
  const searchable = `${ws.slug} ${ws.title} ${ws.tags.join(" ")}`.toLowerCase();

  // Slug overrides
  let hero = base.hero;
  if (/multiplication|times.?table/.test(searchable)) hero = "✖️";
  else if (/addition|add/.test(searchable)) hero = "➕";
  else if (/subtraction|subtract/.test(searchable)) hero = "➖";
  else if (/trac/.test(searchable)) hero = "✏️";
  else if (/alphabet|letter/.test(searchable)) hero = "🔤";
  else if (/number/.test(searchable)) hero = "🔢";
  else if (/count/.test(searchable)) hero = "⭐";
  else if (/shape/.test(searchable)) hero = "🔷";
  else if (/rhym|sight.?word/.test(searchable)) hero = "📖";
  else if (/color.?by.?number/.test(searchable)) hero = "🖍️";
  else if (/pattern/.test(searchable)) hero = "🔶";

  return {
    ...base,
    hero,
    badge: "FREE PRINTABLE",
  };
}

// ─── Game → pin visual ───────────────────────────────────────────────────────

export function getGamePinVisual(slug: string): PinVisual {
  const v: GameVisual = getGameVisual(slug);
  // Convert the tailwind gradient class string to a real CSS gradient.
  // We don't need 1:1 fidelity — we just need something pretty and matching.
  // Instead of parsing the tailwind string we pick a GRADIENTS preset based
  // on the first colour keyword.
  const g = v.gradient.toLowerCase();
  let gradient: string = GRADIENTS.purpleSunset;
  if (g.includes("indigo") || g.includes("blue"))        gradient = GRADIENTS.oceanSky;
  else if (g.includes("purple") && g.includes("pink"))   gradient = GRADIENTS.purpleSunset;
  else if (g.includes("pink") && g.includes("fuchsia"))  gradient = GRADIENTS.roseBerry;
  else if (g.includes("purple") && g.includes("fuchsia")) gradient = GRADIENTS.roseBerry;
  else if (g.includes("green") || g.includes("emerald") || g.includes("lime") || g.includes("teal")) gradient = GRADIENTS.meadow;
  else if (g.includes("cyan") || g.includes("sky"))      gradient = GRADIENTS.lagoon;
  else if (g.includes("yellow") || g.includes("amber"))  gradient = GRADIENTS.sunburst;
  else if (g.includes("orange") && g.includes("purple")) gradient = GRADIENTS.halloween;
  else if (g.includes("red") && g.includes("green"))     gradient = GRADIENTS.christmas;
  else if (g.includes("orange") || g.includes("red") || g.includes("rose")) gradient = GRADIENTS.sunburst;
  else if (g.includes("pink") && g.includes("purple"))   gradient = GRADIENTS.candy;

  return {
    hero: v.hero,
    gradient,
    sparkles: v.sparkles,
    badge: "FREE ONLINE GAME",
  };
}
