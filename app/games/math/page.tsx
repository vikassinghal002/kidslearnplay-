import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data";
import GameCard from "@/components/GameCard";

export const metadata: Metadata = {
  title: "Free Math Games for Kids — Play Online | JiggyJoy",
  description:
    "Fun free math games for kids! Practice times tables, addition, subtraction and multiplication with our free online math games. No download, no signup.",
};

const mathGames = games.filter((g) => g.category === "Math Games");

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

export default function MathGamesHubPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-4xl mb-4">🔢</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Free Math Games for Kids
          </h1>
          <p className="text-lg text-white/85 mb-8 max-w-xl mx-auto">
            Practice times tables, addition and more with our free online math
            games. No download, no signup — 100% free!
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <span className="bg-white/15 rounded-full px-4 py-1.5">
              ✓ 100% Free
            </span>
            <span className="bg-white/15 rounded-full px-4 py-1.5">
              ✓ No Signup
            </span>
            <span className="bg-white/15 rounded-full px-4 py-1.5">
              ✓ Works on Any Device
            </span>
          </div>
        </div>
      </section>

      {/* Games grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Play Math Games Free
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {mathGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      {/* SEO copy */}
      <section className="bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8 text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Why Math Games Help Kids Learn
            </h2>
            <p className="mb-3">
              Research consistently shows that children learn best when they are
              engaged and having fun. Math games transform abstract concepts like
              addition and multiplication into interactive challenges that kids
              want to repeat — and repetition is exactly what builds lasting
              maths fluency.
            </p>
            <p className="mb-3">
              When children play math games, they practice mental arithmetic at
              their own pace without the pressure of a timed test. Each correct
              answer gives an instant reward, building confidence with every
              round. Over time this positive reinforcement turns "I can't do
              maths" into "I love maths."
            </p>
            <p>
              Our math games align with primary school curriculum goals covering
              counting, number recognition, addition, subtraction and
              multiplication — making them a perfect complement to classroom
              learning and homework practice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Times Tables Games
            </h2>
            <p>
              One of the most searched topics for parents is times tables games.
              Our Times Tables Challenge gives kids 30 seconds to answer as many
              multiplication questions as they can — building speed and
              confidence. Regular short sessions are far more effective than
              long, infrequent study, and our game format makes those daily
              sessions something kids actually look forward to.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Free Math Games — No Strings Attached
            </h2>
            <p>
              Every math game on JiggyJoy is completely free. No
              subscription, no in-app purchases, no account required. Just click
              play and start learning. Our games run directly in any modern web
              browser on phones, tablets and computers — so kids can practice
              wherever they are.
            </p>
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className="py-10 px-4 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-white mb-4">Explore More</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/games/kindergarten"
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              🎒 Kindergarten Games
            </Link>
            <Link
              href="/worksheets"
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              📄 Free Worksheets
            </Link>
            <Link
              href="/games"
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              🎮 All Games
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
