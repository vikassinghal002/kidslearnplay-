import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data";
import GameCard from "@/components/GameCard";

export const metadata: Metadata = {
  title: "Free Educational Games for Kids",
  description:
    "Free online educational games for kids — math games, coloring games, alphabet games and more. Fun learning games for preschool, kindergarten and primary school.",
  keywords: [
    "educational games for kids",
    "free kids games",
    "maths play",
    "math games for kids",
    "learning games",
    "online games for kids",
    "coloring games",
  ],
};

const categoryEmojis: Record<string, string> = {
  "Arcade Games":      "🕹️",
  "Toddler Games":     "🧸",
  "Educational Games": "📚",
  "Math Games":        "🔢",
  "Coloring Games":    "🎨",
};

const categories = [...new Set(games.map((g) => g.category))];

export default function GamesHubPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            🎮 Free Kids Games
          </h1>
          <p className="text-lg text-white/90">
            Fun educational games for kids — learn maths, letters, colours and more through play.
            All games are free, no download needed!
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {categories.map((cat) => {
          const catGames = games.filter((g) => g.category === cat);
          return (
            <div key={cat} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span>{categoryEmojis[cat] ?? "🎯"}</span>
                <span>{cat}</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {catGames.map((game) => (
                  <GameCard key={game.slug} game={game} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* SEO block */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About Our Free Kids Games</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            KidsLearnPlay offers a growing library of <strong>free educational games for kids</strong>.
            Our games are designed to make learning fun — covering math, reading, spelling, shapes,
            and creative arts. All games run directly in your browser with no app download required.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our most popular section is{" "}
            <Link href="/games/maths-play" className="text-purple-600 hover:underline font-medium">
              Maths Play
            </Link>
            , a complete maths playground covering addition, subtraction, multiplication and
            counting — perfect for primary school children aged 5–10.
          </p>
        </div>
      </section>
    </div>
  );
}
