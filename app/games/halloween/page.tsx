import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data";
import GameCard from "@/components/GameCard";

export const metadata: Metadata = {
  title: "Halloween Games for Kids — Free Online | KidsLearnPlay",
  description:
    "Free Halloween games for kids! Spooky fun online games, Halloween party games and Halloween coloring pages. No download, no signup — perfect for Halloween parties!",
};

// Themed games tagged for Halloween (populated when seasonal games ship)
const halloweenGames = games.filter(
  (g) =>
    g.tags.includes("halloween") ||
    g.tags.includes("spooky") ||
    g.tags.includes("pumpkin")
);

// Hand-picked "also great at Halloween" arcade/puzzle favourites
// so the page never feels empty and doesn't duplicate other seasonal hubs
const HALLOWEEN_FAVOURITES = [
  "space-defender",
  "brick-breaker",
  "snake",
  "dino-run",
  "pattern-wizard",
  "memory-match-animals",
];
const favouriteGames = HALLOWEEN_FAVOURITES.map((slug) =>
  games.find((g) => g.slug === slug)
).filter((g): g is NonNullable<typeof g> => Boolean(g));

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

const gameEmojis: Record<string, string> = {
  "Math Games": "🔢",
  "Educational Games": "📚",
  "Toddler Games": "🧸",
  "Arcade Games": "🎮",
  "Coloring Games": "🎨",
};

export default function HalloweenGamesPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-4xl mb-4">🎃 👻 🕷️ 🦇</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Halloween Games for Kids
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Spooky fun for little trick-or-treaters! Free Halloween games and
            coloring pages — no download needed.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <span className="bg-white/20 rounded-full px-4 py-1.5">
              ✓ 100% Free
            </span>
            <span className="bg-white/20 rounded-full px-4 py-1.5">
              ✓ No Signup
            </span>
            <span className="bg-white/20 rounded-full px-4 py-1.5">
              ✓ Works on Any Device
            </span>
          </div>
        </div>
      </section>

      {/* Games grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {halloweenGames.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">
              🎃 Spooky Halloween Games
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Themed games made just for Halloween — pumpkins, ghosts and
              fang-tastic fun!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mb-12">
              {halloweenGames.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          </>
        )}

        <h2 className="text-2xl font-bold text-white mb-2">
          Play While You Wait for Trick-or-Treating!
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Kid-favourite arcade and puzzle games that feel right at home on
          Halloween night.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {favouriteGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      {/* Halloween Coloring section */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Halloween Coloring Pages
        </h2>
        <div className="bg-orange-950 border-2 border-orange-500 rounded-xl p-6 text-center max-w-md mx-auto">
          <p className="text-5xl mb-3">🎃</p>
          <h3 className="text-xl font-bold mb-2">Halloween Coloring Pages</h3>
          <p className="text-gray-300 mb-4">
            Free printable Halloween coloring pages — witches, ghosts, pumpkins
            and more!
          </p>
          <Link
            href="/coloring-pages/holidays"
            className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-400 transition-colors inline-block"
          >
            View Halloween Coloring Pages →
          </Link>
        </div>
      </section>

      {/* SEO copy */}
      <section className="bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8 text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Halloween Party Games for Kids
            </h2>
            <p className="mb-3">
              Halloween party games are one of the best ways to keep a room full
              of excited kids entertained between the costumes and the candy.
              Classic favourites like pumpkin bowling (use a small pumpkin to
              knock down plastic bottle pins), mummy wrap (teams race to wrap a
              friend in toilet paper), and apple bobbing have delighted children
              for generations — and they require almost no preparation.
            </p>
            <p className="mb-3">
              For indoor Halloween parties, our free online games make a perfect
              digital game station. Set up a tablet or laptop in the corner and
              let kids take turns playing while the group rotates through
              activities. It keeps younger siblings happily occupied while older
              kids are out trick-or-treating.
            </p>
            <p>
              Mixing classic party games with digital games gives kids the best
              of both worlds — physical fun with friends plus a quiet wind-down
              activity they can enjoy independently at any time during the
              Halloween evening.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Free Halloween Games — No Signup Required
            </h2>
            <p className="mb-3">
              Every game on KidsLearnPlay is completely free — no account, no
              subscription, no credit card. On a busy Halloween night, the last
              thing parents need is to fill in forms or set up passwords just so
              a child can play a game for ten minutes.
            </p>
            <p>
              All games run directly in your web browser on any device — phone,
              tablet, laptop or desktop. Just tap Play and the fun begins
              instantly, even on a slow connection.
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
              href="/coloring-pages/holidays"
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              🎃 Halloween Coloring Pages
            </Link>
            <Link
              href="/games/christmas"
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              🎄 Christmas Games
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
