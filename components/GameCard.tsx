import Link from "next/link";
import type { Game } from "@/lib/data";
import { getGameVisual } from "@/lib/gameVisuals";

type Props = {
  game: Game;
  /** Card size — affects hero emoji size. Default "md". */
  size?: "sm" | "md" | "lg";
};

/**
 * Color-code an ageRange string into a kid-friendly bucket.
 *  2–4  → green   (toddler)
 *  5–7  → yellow  (early elementary)
 *  8–10 → blue    (elementary)
 *  11+  → purple  (tween)
 */
function ageBucket(ageRange: string) {
  const first = parseInt(ageRange.match(/\d+/)?.[0] ?? "5", 10);
  if (first <= 4) return { color: "bg-green-400", ring: "ring-green-200", label: "Little kids" };
  if (first <= 7) return { color: "bg-yellow-400", ring: "ring-yellow-200", label: "Early elementary" };
  if (first <= 10) return { color: "bg-blue-400", ring: "ring-blue-200", label: "Elementary" };
  return { color: "bg-purple-400", ring: "ring-purple-200", label: "Tweens" };
}

/**
 * Kid-friendly game tile.
 *
 * Kids don't read — they recognise characters and colours. This card leads
 * with a huge hero emoji on a saturated gradient, surrounds it with floating
 * sparkle decorations, and keeps text to an absolute minimum (title only).
 *
 * The whole card bounces gently on hover and the hero emoji rotates — so
 * even without reading, children can tell it's interactive.
 */
export default function GameCard({ game, size = "md" }: Props) {
  const visual = getGameVisual(game.slug);
  const bucket = ageBucket(game.ageRange);

  const heroSize =
    size === "lg" ? "text-[6rem] sm:text-[8rem]" :
    size === "sm" ? "text-5xl sm:text-7xl" :
    "text-6xl sm:text-7xl md:text-8xl";

  const cardHeight =
    size === "lg" ? "h-56 sm:h-72" :
    size === "sm" ? "h-36 sm:h-44" :
    "h-48 sm:h-56 md:h-60";

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group block focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-400 rounded-3xl"
      aria-label={`Play ${game.title}`}
    >
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${visual.gradient} ${cardHeight} shadow-lg transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-2xl group-hover:-rotate-1 group-active:scale-95`}
      >
        {/* Floating sparkle decorations */}
        <span className="absolute top-3 left-3 text-2xl sm:text-3xl opacity-90 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-12 pointer-events-none" aria-hidden="true">
          {visual.sparkles[0]}
        </span>
        <span className="absolute top-5 right-4 text-xl sm:text-2xl opacity-80 transition-transform duration-500 group-hover:translate-y-1 group-hover:-rotate-12 pointer-events-none" aria-hidden="true">
          {visual.sparkles[1]}
        </span>
        {visual.sparkles[2] && (
          <span className="absolute bottom-14 left-5 text-lg sm:text-xl opacity-80 transition-transform duration-500 group-hover:translate-x-1 group-hover:rotate-12 pointer-events-none" aria-hidden="true">
            {visual.sparkles[2]}
          </span>
        )}

        {/* Age badge — colored dot + age range, readable at a glance */}
        <span
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/95 text-gray-900 pl-2 pr-3 py-1 rounded-full shadow text-sm font-bold"
          title={`${bucket.label} · Age ${game.ageRange}`}
          aria-label={`Age ${game.ageRange}, ${bucket.label}`}
        >
          <span className={`w-3 h-3 rounded-full ${bucket.color} ring-2 ${bucket.ring}`} aria-hidden="true" />
          {game.ageRange}
        </span>

        {/* Huge hero emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`${heroSize} drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
            aria-hidden="true"
          >
            {visual.hero}
          </span>
        </div>

        {/* Title bar at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 pt-8 pb-3">
          <h3 className="text-white font-extrabold text-base sm:text-lg leading-tight drop-shadow-md line-clamp-2">
            {game.title}
          </h3>
        </div>

        {/* Play indicator — appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-white/95 text-purple-700 rounded-full px-5 py-2 font-extrabold text-sm shadow-xl">
            ▶ Play!
          </div>
        </div>
      </div>
    </Link>
  );
}
