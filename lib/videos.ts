// ─── Video data layer ────────────────────────────────────────────────────────
//
// This file is the SINGLE SOURCE OF TRUTH for every YouTube video that
// JiggyJoy has published. Adding a new video should be a 30-second edit:
//
//   1. Record / upload your video to the JiggyJoy YouTube channel.
//   2. Copy the YouTube ID from the URL (the bit after `?v=`).
//      Example URL:  https://www.youtube.com/watch?v=dQw4w9WgXcQ
//      The ID:       dQw4w9WgXcQ
//   3. Add a new entry to the `videos` array below — or, for the placeholders
//      that ship with this scaffold, just REPLACE the `youtubeId` field.
//      EVERYTHING else (slug, title, description, related links, thumbnails)
//      is already wired up.
//
// IMPORTANT: every entry below currently uses `PLACEHOLDER_xxx` as its
// YouTube ID. The site builds and renders fine with these placeholders, but
// the embedded player will obviously not play anything until you swap in
// a real ID. Search this file for `PLACEHOLDER_` to find every entry that
// still needs a real ID.
//
// To create a new video from scratch (after the placeholders are gone), copy
// any existing entry as a template — only the slug, title and youtubeId are
// strictly required.

export type VideoKind =
  | "gameplay"      // someone playing one of our games
  | "tutorial"     // how-to / explainer
  | "speedpaint"   // time-lapse coloring
  | "compilation"  // best-of / round-up
  | "short";       // YouTube Short (< 60s, vertical)

export type RelatedType = "game" | "coloring" | "worksheet" | null;

export type Video = {
  /** URL slug — also used as the React key. Must be unique. */
  id: string;
  /** YouTube video ID (the bit after `?v=`). REPLACE PLACEHOLDER_xxx values. */
  youtubeId: string;
  /** Display title. Should match (or be very close to) the title on YouTube. */
  title: string;
  /** Short description shown on the video card and in JSON-LD. */
  description: string;
  /** ISO 8601 date the video was published. */
  publishedAt: string;
  /** Length of the video in seconds. */
  durationSec: number;
  /** What kind of video this is — used by the filter tabs on /videos. */
  kind: VideoKind;
  /** Slug of the related game / coloring page / worksheet, if any. */
  relatedSlug: string | null;
  /** Which content type the related slug belongs to. */
  relatedType: RelatedType;
  /**
   * Which auto-generated thumbnail variant to use as a fallback if the
   * YouTube thumbnail isn't available yet. The actual thumbnail is rendered
   * by `app/thumbnail/games/[slug]/route.tsx` (or coloring/worksheet variant)
   * and pulls visuals from `lib/gameVisuals.ts` / `lib/pinVisuals.ts`.
   */
  thumbnailVariant: "auto" | "youtube";
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format a duration in seconds as ISO 8601 (e.g. "PT3M42S") for VideoObject
 * structured data. YouTube and Google use this format for `duration`.
 */
export function durationToISO8601(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  let out = "PT";
  if (h) out += `${h}H`;
  if (m) out += `${m}M`;
  if (s || (!h && !m)) out += `${s}S`;
  return out;
}

/**
 * Format a duration in seconds as a human-readable mm:ss (or h:mm:ss) string.
 * Used on video cards.
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Returns the canonical YouTube thumbnail URL for a given video ID.
 * `maxresdefault` is 1280x720; YouTube has it for ~99% of uploads.
 */
export function youtubeThumbnailUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
}

/**
 * Returns true if a YouTube ID is still a placeholder. Useful for hiding
 * embeds until a real ID is filled in.
 */
export function isPlaceholderVideo(v: Video): boolean {
  return v.youtubeId.startsWith("PLACEHOLDER_");
}

// ─── The video catalogue ──────────────────────────────────────────────────────
//
// 6 starter entries — replace each `youtubeId: "PLACEHOLDER_..."` with the
// real ID once the video has been uploaded. Slugs / titles / related links
// are all chosen to match games that already exist in `lib/data.ts` so the
// /videos page renders meaningfully even before the channel exists.

export const videos: Video[] = [
  {
    id: "snake-game-walkthrough",
    youtubeId: "PLACEHOLDER_SNAKE_WALKTHROUGH", // TODO: replace with real ID
    title: "How to Beat Snake — Tips & Tricks (JiggyJoy)",
    description:
      "Watch a full playthrough of the classic Snake game on JiggyJoy. Learn beginner strategies, how to grow your snake fast, and how to avoid crashing into yourself!",
    publishedAt: "2025-01-15",
    durationSec: 312,
    kind: "gameplay",
    relatedSlug: "snake",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "super-jumper-level-1-guide",
    youtubeId: "PLACEHOLDER_SUPER_JUMPER_GUIDE", // TODO: replace with real ID
    title: "Super Jumper — Full Level 1 Walkthrough",
    description:
      "A complete walkthrough of Super Jumper Level 1 on JiggyJoy. See every coin location, every enemy stomp and how to reach the flag with a perfect score.",
    publishedAt: "2025-01-22",
    durationSec: 425,
    kind: "gameplay",
    relatedSlug: "super-jumper",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "maths-play-times-tables-tutorial",
    youtubeId: "PLACEHOLDER_MATHS_PLAY_TUTORIAL", // TODO: replace with real ID
    title: "Learn Times Tables Fast with Maths Play",
    description:
      "Tutorial: how to use the free Maths Play game on JiggyJoy to master your times tables. Includes tips for kids who are just starting out and a parent's quick guide.",
    publishedAt: "2025-02-03",
    durationSec: 287,
    kind: "tutorial",
    relatedSlug: "maths-play",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "dino-run-high-score",
    youtubeId: "PLACEHOLDER_DINO_RUN_RUN", // TODO: replace with real ID
    title: "Dino Run — How I Got the High Score",
    description:
      "Watch a full speed run of Dino Run on JiggyJoy! Learn the timing for double jumps, when to duck under birds, and how to survive past 1,000 points.",
    publishedAt: "2025-02-12",
    durationSec: 198,
    kind: "gameplay",
    relatedSlug: "dino-run",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "space-defender-boss-tips",
    youtubeId: "PLACEHOLDER_SPACE_DEFENDER", // TODO: replace with real ID
    title: "Space Defender — Boss Wave Tips for Kids",
    description:
      "Quick tutorial showing kids how to survive the boss waves in Space Defender on JiggyJoy. Learn the dodge patterns and the best moments to fire!",
    publishedAt: "2025-02-20",
    durationSec: 156,
    kind: "tutorial",
    relatedSlug: "space-defender",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "brick-breaker-power-ups",
    youtubeId: "PLACEHOLDER_BRICK_BREAKER", // TODO: replace with real ID
    title: "Brick Breaker — All 5 Power-Ups Explained",
    description:
      "A short Brick Breaker tutorial showing every power-up: wide paddle, laser, slow motion, multi-ball and extra life. Free to play on JiggyJoy.",
    publishedAt: "2025-03-01",
    durationSec: 142,
    kind: "short",
    relatedSlug: "brick-breaker",
    relatedType: "game",
    thumbnailVariant: "auto",
  },

  // ─── Expanded catalogue (2025 batch) ──────────────────────────────────────
  // 10 more gameplay entries ↓
  {
    id: "maths-play-walkthrough",
    youtubeId: "PLACEHOLDER_MATHS_PLAY_WALKTHROUGH",
    title: "Maths Play Full Walkthrough — Every Mode Explained",
    description:
      "A complete tour of Maths Play on JiggyJoy. Covers addition, subtraction and multiplication modes plus how to beat your own high score.",
    publishedAt: "2025-03-08",
    durationSec: 368,
    kind: "gameplay",
    relatedSlug: "maths-play",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "multiplication-blast-high-score",
    youtubeId: "PLACEHOLDER_MULT_BLAST_HS",
    title: "Multiplication Blast — Beating My High Score",
    description:
      "Watch me try to clear the whole sky in Multiplication Blast without missing a single asteroid. Tips for fast mental multiplication included.",
    publishedAt: "2025-03-15",
    durationSec: 244,
    kind: "gameplay",
    relatedSlug: "multiplication-blast",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "times-tables-challenge-tips",
    youtubeId: "PLACEHOLDER_TIMES_TABLES_TIPS",
    title: "Times Tables Challenge — Tips to Beat the Clock",
    description:
      "Real gameplay of the 30-second Times Tables Challenge with commentary on how to answer faster without making mistakes.",
    publishedAt: "2025-03-22",
    durationSec: 221,
    kind: "gameplay",
    relatedSlug: "times-tables-challenge",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "pumpkin-smash-halloween",
    youtubeId: "PLACEHOLDER_PUMPKIN_SMASH",
    title: "Pumpkin Smash — Halloween High Score Run",
    description:
      "A spooky-but-friendly Halloween playthrough of Pumpkin Smash. Great seasonal pick for kids aged 4 and up.",
    publishedAt: "2025-04-02",
    durationSec: 189,
    kind: "gameplay",
    relatedSlug: "pumpkin-smash",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "present-catcher-christmas",
    youtubeId: "PLACEHOLDER_PRESENT_CATCHER",
    title: "Present Catcher — Christmas Gameplay",
    description:
      "Catch every falling present and avoid the coal in this festive JiggyJoy Christmas game. Perfect for the holidays.",
    publishedAt: "2025-04-10",
    durationSec: 167,
    kind: "gameplay",
    relatedSlug: "present-catcher",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "color-match-speedrun",
    youtubeId: "PLACEHOLDER_COLOR_MATCH_SR",
    title: "Colour Match Speedrun — Toddler Game Tips",
    description:
      "A super-quick speedrun of Colour Match on JiggyJoy — great for toddlers learning their first colours.",
    publishedAt: "2025-04-18",
    durationSec: 134,
    kind: "gameplay",
    relatedSlug: "colour-match",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "shape-sorter-toddler",
    youtubeId: "PLACEHOLDER_SHAPE_SORTER",
    title: "Shape Sorter — Toddler Gameplay & Tips",
    description:
      "Watch Shape Sorter in action — a friendly first game for 2 to 5 year olds learning circles, squares, triangles and more.",
    publishedAt: "2025-04-26",
    durationSec: 178,
    kind: "gameplay",
    relatedSlug: "shape-sorter",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "animal-sounds-toddler",
    youtubeId: "PLACEHOLDER_ANIMAL_SOUNDS",
    title: "Animal Sounds — 12 Animals Gameplay",
    description:
      "Meet every animal in the JiggyJoy Animal Sounds game and hear the sound each one makes. A fun first game for tiny learners.",
    publishedAt: "2025-05-03",
    durationSec: 205,
    kind: "gameplay",
    relatedSlug: "animal-sounds",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "memory-match-animals-tips",
    youtubeId: "PLACEHOLDER_MEMORY_MATCH",
    title: "Memory Match Animals — Tips for Every Level",
    description:
      "How to clear easy, medium and hard mode in Memory Match Animals on JiggyJoy. Great concentration practice for 3 to 7 year olds.",
    publishedAt: "2025-05-11",
    durationSec: 263,
    kind: "gameplay",
    relatedSlug: "memory-match-animals",
    relatedType: "game",
    thumbnailVariant: "auto",
  },
  {
    id: "pattern-wizard-puzzle-tips",
    youtubeId: "PLACEHOLDER_PATTERN_WIZARD",
    title: "Pattern Wizard — Puzzle Solving Tips",
    description:
      "Tips for recognising AB, ABBA and ABCBA patterns in Pattern Wizard. Level-by-level commentary for parents and kids.",
    publishedAt: "2025-05-18",
    durationSec: 298,
    kind: "gameplay",
    relatedSlug: "pattern-wizard",
    relatedType: "game",
    thumbnailVariant: "auto",
  },

  // 5 more tutorials ↓
  {
    id: "how-to-teach-times-tables",
    youtubeId: "PLACEHOLDER_TEACH_TIMES_TABLES",
    title: "How to Teach Times Tables (Without Tears)",
    description:
      "A practical guide for parents on teaching multiplication facts using games, stories and short daily practice. No boring flashcards.",
    publishedAt: "2025-05-26",
    durationSec: 412,
    kind: "tutorial",
    relatedSlug: null,
    relatedType: null,
    thumbnailVariant: "auto",
  },
  {
    id: "fun-ways-to-learn-addition",
    youtubeId: "PLACEHOLDER_FUN_ADDITION",
    title: "5 Fun Ways to Learn Addition at Home",
    description:
      "Five simple, screen-friendly activities parents can use to make early addition stick. Works great for 4 to 7 year olds.",
    publishedAt: "2025-06-02",
    durationSec: 327,
    kind: "tutorial",
    relatedSlug: null,
    relatedType: null,
    thumbnailVariant: "auto",
  },
  {
    id: "helping-preschoolers-count",
    youtubeId: "PLACEHOLDER_PRESCHOOL_COUNT",
    title: "Helping Preschoolers Count from 1 to 20",
    description:
      "Gentle strategies for counting with preschoolers — finger games, songs and short free online games that reinforce number sense.",
    publishedAt: "2025-06-09",
    durationSec: 284,
    kind: "tutorial",
    relatedSlug: null,
    relatedType: null,
    thumbnailVariant: "auto",
  },
  {
    id: "kindergarten-math-basics",
    youtubeId: "PLACEHOLDER_KINDER_MATH",
    title: "Kindergarten Math Basics — What to Cover This Year",
    description:
      "A parent-friendly overview of the core math concepts taught in kindergarten: counting, sorting, shapes, comparing quantities and early addition.",
    publishedAt: "2025-06-16",
    durationSec: 359,
    kind: "tutorial",
    relatedSlug: null,
    relatedType: null,
    thumbnailVariant: "auto",
  },
  {
    id: "learning-phonics-through-play",
    youtubeId: "PLACEHOLDER_PHONICS_PLAY",
    title: "Learning Phonics Through Play",
    description:
      "How to build early reading skills through letter games, sound-matching and daily read-alouds. Includes free online activities you can try right now.",
    publishedAt: "2025-06-23",
    durationSec: 301,
    kind: "tutorial",
    relatedSlug: null,
    relatedType: null,
    thumbnailVariant: "auto",
  },

  // 5 more speedpaints ↓
  {
    id: "halloween-coloring-speedpaint",
    youtubeId: "PLACEHOLDER_HALLOWEEN_SPEEDPAINT",
    title: "Halloween Coloring Speedpaint — Pumpkins & Bats",
    description:
      "A relaxing time-lapse of the JiggyJoy Halloween coloring page — pumpkins, bats and a spooky full moon, all coloured in under 5 minutes.",
    publishedAt: "2025-07-01",
    durationSec: 298,
    kind: "speedpaint",
    relatedSlug: "holidays",
    relatedType: "coloring",
    thumbnailVariant: "auto",
  },
  {
    id: "dinosaur-coloring-timelapse",
    youtubeId: "PLACEHOLDER_DINO_COLOR",
    title: "Dinosaur Coloring Time-Lapse",
    description:
      "Watch a JiggyJoy dinosaur coloring page come to life in a speedy time-lapse. Great inspiration for kids before they print and colour their own.",
    publishedAt: "2025-07-07",
    durationSec: 252,
    kind: "speedpaint",
    relatedSlug: "animals",
    relatedType: "coloring",
    thumbnailVariant: "auto",
  },
  {
    id: "unicorn-coloring-art",
    youtubeId: "PLACEHOLDER_UNICORN_COLOR",
    title: "Unicorn Coloring Art — Speedpaint",
    description:
      "A sparkly unicorn coloring page from JiggyJoy painted in a relaxing time-lapse. Perfect colour inspiration for fans of magical creatures.",
    publishedAt: "2025-07-14",
    durationSec: 276,
    kind: "speedpaint",
    relatedSlug: "fantasy",
    relatedType: "coloring",
    thumbnailVariant: "auto",
  },
  {
    id: "mandala-coloring-relaxing",
    youtubeId: "PLACEHOLDER_MANDALA_RELAX",
    title: "Mandala Coloring — Relaxing Speedpaint",
    description:
      "A calming animal-mandala speedpaint using JiggyJoy's printable coloring pages. Background music and gentle colour choices.",
    publishedAt: "2025-07-21",
    durationSec: 342,
    kind: "speedpaint",
    relatedSlug: "animal-mandalas",
    relatedType: "coloring",
    thumbnailVariant: "auto",
  },
  {
    id: "pokemon-coloring-speedpaint",
    youtubeId: "PLACEHOLDER_POKEMON_COLOR",
    title: "Character Coloring Speedpaint — Fan Favourites",
    description:
      "A fan-favourite character speedpaint using JiggyJoy's free printable coloring pages. Bright colours and smooth shading.",
    publishedAt: "2025-07-28",
    durationSec: 265,
    kind: "speedpaint",
    relatedSlug: "characters",
    relatedType: "coloring",
    thumbnailVariant: "auto",
  },

  // 4 more compilations ↓
  {
    id: "5-best-math-games-for-kids",
    youtubeId: "PLACEHOLDER_BEST_MATH_GAMES",
    title: "5 Best Free Math Games for Kids (2025)",
    description:
      "A round-up of JiggyJoy's most popular free math games — from Maths Play to Multiplication Blast and Times Tables Challenge.",
    publishedAt: "2025-08-04",
    durationSec: 348,
    kind: "compilation",
    relatedSlug: null,
    relatedType: null,
    thumbnailVariant: "auto",
  },
  {
    id: "top-toddler-games-2025",
    youtubeId: "PLACEHOLDER_TOP_TODDLER",
    title: "Top Toddler Games of 2025",
    description:
      "The best JiggyJoy games for 2 to 5 year olds — Shape Sorter, Animal Sounds, Colour Match, Bubble Pop ABCs and more.",
    publishedAt: "2025-08-11",
    durationSec: 319,
    kind: "compilation",
    relatedSlug: null,
    relatedType: null,
    thumbnailVariant: "auto",
  },
  {
    id: "halloween-games-compilation",
    youtubeId: "PLACEHOLDER_HALLOWEEN_COMP",
    title: "Halloween Games Compilation",
    description:
      "Every spooky-but-friendly Halloween game on JiggyJoy in one quick round-up video. Safe for kids of all ages.",
    publishedAt: "2025-08-18",
    durationSec: 287,
    kind: "compilation",
    relatedSlug: null,
    relatedType: null,
    thumbnailVariant: "auto",
  },
  {
    id: "best-free-games-5-year-olds",
    youtubeId: "PLACEHOLDER_BEST_5_YO",
    title: "Best Free Games for 5 Year Olds",
    description:
      "A handpicked compilation of JiggyJoy's best free online games for 5 year olds — covering counting, patterns, sorting and more.",
    publishedAt: "2025-08-25",
    durationSec: 305,
    kind: "compilation",
    relatedSlug: null,
    relatedType: null,
    thumbnailVariant: "auto",
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getVideoBySlug(slug: string): Video | undefined {
  return videos.find((v) => v.id === slug);
}

/** All videos that feature a specific game (by game slug). */
export function getVideosForGame(slug: string): Video[] {
  return videos.filter((v) => v.relatedType === "game" && v.relatedSlug === slug);
}

/** All videos that feature a specific coloring page (by coloring slug). */
export function getVideosForColoring(slug: string): Video[] {
  return videos.filter((v) => v.relatedType === "coloring" && v.relatedSlug === slug);
}

/** All videos that feature a specific worksheet (by worksheet slug). */
export function getVideosForWorksheet(slug: string): Video[] {
  return videos.filter((v) => v.relatedType === "worksheet" && v.relatedSlug === slug);
}

/** All videos of a particular kind (gameplay, tutorial, etc). */
export function getVideosByKind(kind: VideoKind): Video[] {
  return videos.filter((v) => v.kind === kind);
}

/** Most recent N videos, sorted by publishedAt date (newest first). */
export function getLatestVideos(n: number = 10): Video[] {
  return [...videos]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, n);
}

/** Returns 3 videos related to the given one (same kind preferred). */
export function getRelatedVideos(currentId: string, n: number = 3): Video[] {
  const current = getVideoBySlug(currentId);
  if (!current) return [];
  // First prefer same-kind, then fall back to anything else.
  const sameKind = videos.filter(
    (v) => v.id !== currentId && v.kind === current.kind,
  );
  const others = videos.filter(
    (v) => v.id !== currentId && v.kind !== current.kind,
  );
  return [...sameKind, ...others].slice(0, n);
}

// ─── Friendly labels for the kind filter tabs ────────────────────────────────

export const VIDEO_KIND_LABELS: Record<VideoKind, string> = {
  gameplay: "Gameplay",
  tutorial: "Tutorials",
  speedpaint: "Speed-paints",
  compilation: "Compilations",
  short: "Shorts",
};
