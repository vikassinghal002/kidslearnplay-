"use client";

import { useMemo, useState } from "react";
import type { Game } from "@/lib/data";
import GameCard from "@/components/GameCard";

type Bucket = "all" | "2-4" | "5-7" | "8-10" | "11+";

const BUCKETS: { id: Bucket; label: string; emoji: string; dot: string; ring: string }[] = [
  { id: "all",  label: "All ages",    emoji: "🌈", dot: "bg-purple-500", ring: "ring-purple-200" },
  { id: "2-4",  label: "Ages 2–4",    emoji: "🧸", dot: "bg-green-400",  ring: "ring-green-200" },
  { id: "5-7",  label: "Ages 5–7",    emoji: "⭐", dot: "bg-yellow-400", ring: "ring-yellow-200" },
  { id: "8-10", label: "Ages 8–10",   emoji: "🎯", dot: "bg-blue-400",   ring: "ring-blue-200" },
  { id: "11+",  label: "Tweens 11+",  emoji: "🚀", dot: "bg-purple-400", ring: "ring-purple-200" },
];

/** Parse first digit out of "3-5", "5+", "Ages 4-6" etc. */
function firstAge(ageRange: string): number {
  return parseInt(ageRange.match(/\d+/)?.[0] ?? "5", 10);
}

function inBucket(game: Game, bucket: Bucket): boolean {
  if (bucket === "all") return true;
  const a = firstAge(game.ageRange);
  if (bucket === "2-4")  return a >= 2 && a <= 4;
  if (bucket === "5-7")  return a >= 5 && a <= 7;
  if (bucket === "8-10") return a >= 8 && a <= 10;
  if (bucket === "11+")  return a >= 11;
  return true;
}

type Props = {
  games: Game[];
  categoryEmojis: Record<string, string>;
};

export default function GamesAgeFilter({ games, categoryEmojis }: Props) {
  const [bucket, setBucket] = useState<Bucket>("all");

  const filtered = useMemo(() => games.filter((g) => inBucket(g, bucket)), [games, bucket]);

  const categories = useMemo(
    () => Array.from(new Set(filtered.map((g) => g.category))),
    [filtered]
  );

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Chip strip */}
      <div
        role="tablist"
        aria-label="Filter games by age"
        className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-4 px-4 scrollbar-none"
      >
        {BUCKETS.map((b) => {
          const active = bucket === b.id;
          return (
            <button
              key={b.id}
              role="tab"
              aria-selected={active}
              onClick={() => setBucket(b.id)}
              className={`flex items-center gap-2 shrink-0 px-5 py-3 rounded-full font-bold text-base transition-all border-2 ${
                active
                  ? "bg-purple-600 text-white border-purple-600 shadow-lg scale-[1.03]"
                  : "bg-white text-gray-800 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
              }`}
            >
              <span className="text-xl" aria-hidden="true">{b.emoji}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${b.dot} ring-2 ${b.ring}`} aria-hidden="true" />
              <span>{b.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filtered results grouped by category */}
      {categories.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-lg font-semibold">No games yet for this age group — try another.</p>
        </div>
      ) : (
        categories.map((cat) => {
          const catGames = filtered.filter((g) => g.category === cat);
          return (
            <div key={cat} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span>{categoryEmojis[cat] ?? "🎯"}</span>
                <span>{cat}</span>
                <span className="text-sm font-semibold text-gray-500 ml-2">
                  {catGames.length} {catGames.length === 1 ? "game" : "games"}
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {catGames.map((game) => (
                  <GameCard key={game.slug} game={game} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
