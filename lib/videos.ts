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
