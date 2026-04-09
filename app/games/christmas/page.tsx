import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data";
import GameCard from "@/components/GameCard";

export const metadata: Metadata = {
  title: "Christmas Games for Kids — Free Online | KidsLearnPlay",
  description:
    "Free Christmas games for kids! Fun Christmas party games, Christmas coloring pages and festive online games. No download, no signup — perfect for the festive season!",
};

// Themed games tagged for Christmas (populated when seasonal games ship)
const christmasGames = games.filter(
  (g) =>
    g.tags.includes("christmas") ||
    g.tags.includes("santa") ||
    g.tags.includes("festive")
);

// Hand-picked cozy/gentle favourites — different from Halloween/Easter curation
const CHRISTMAS_FAVOURITES = [
  "pattern-wizard",
  "memory-match-animals",
  "connect-the-dots",
  "colour-match",
  "maths-play",
  "word-spell",
];
const favouriteGames = CHRISTMAS_FAVOURITES.map((slug) =>
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

export default function ChristmasGamesPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-green-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-4xl mb-4">🎄 🎅 ⭐ 🎁</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Fun Christmas Games for Kids
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Keep the little ones entertained over the Christmas holidays! Free
            online games and coloring pages — no download needed.
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
        {christmasGames.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">
              🎄 Festive Christmas Games
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Themed games made just for Christmas — Santa, presents and
              snowy fun!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mb-12">
              {christmasGames.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          </>
        )}

        <h2 className="text-2xl font-bold text-white mb-2">
          Cosy Holiday Picks — Play Now for Free
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Calm, thinking-style games perfect for the cosy Christmas break —
          no batteries required.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {favouriteGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      {/* Christmas Coloring section */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Christmas Coloring Pages
        </h2>
        <div className="bg-green-950 border-2 border-red-500 rounded-xl p-6 text-center max-w-md mx-auto">
          <p className="text-5xl mb-3">🎄</p>
          <h3 className="text-xl font-bold mb-2">Christmas Coloring Pages</h3>
          <p className="text-gray-300 mb-4">
            Free printable Christmas coloring pages — Santa, snowmen, Christmas
            trees and more festive scenes!
          </p>
          <Link
            href="/coloring-pages/holidays"
            className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-500 transition-colors inline-block"
          >
            View Christmas Coloring Pages →
          </Link>
        </div>
      </section>

      {/* SEO copy */}
      <section className="bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8 text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Christmas Party Games for Kids
            </h2>
            <p className="mb-3">
              The school Christmas party or a festive get-together with cousins
              calls for games that get kids laughing and moving. Pass the Parcel
              is a perennial favourite — wrap a small gift in many layers, with a
              forfeit or sweet in each layer. Pin the Nose on Rudolph, musical
              Christmas chairs, and a Christmas-themed treasure hunt are equally
              easy to organise and guaranteed crowd-pleasers for all ages.
            </p>
            <p className="mb-3">
              For quieter moments — or when the weather keeps everyone indoors —
              our free online games are an instant activity that needs zero
              setup. Set up a shared screen for group play, or let each child
              take a turn on a tablet while the grown-ups enjoy a mince pie in
              peace.
            </p>
            <p>
              Mixing active party games with calm digital games gives a natural
              rhythm to a long Christmas day, helping manage energy levels and
              keep the magic going right through to bedtime.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Family Christmas Games
            </h2>
            <p className="mb-3">
              Christmas is one of the rare times when siblings of very different
              ages are all in the same room wanting to play together. Our games
              cover a wide age range — from toddler-friendly Animal Sounds and
              Shape Sorter, to more challenging arcade games that older kids and
              even adults enjoy. Everyone gets a turn, and nobody feels left out.
            </p>
            <p>
              For a true family challenge, try sitting together for a Snake or
              Brick Breaker session and see who can beat the high score. A
              little friendly competition is the perfect Christmas entertainment,
              and it costs nothing at all.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Free Christmas Activities — No Signup
            </h2>
            <p className="mb-3">
              Everything on KidsLearnPlay is completely free. No account needed,
              no subscription, no app to download. On Christmas Day when kids
              are bouncing with excitement and you need five minutes to yourself,
              just hand over a device and let them play instantly.
            </p>
            <p>
              All games run directly in any web browser — on phones, tablets,
              laptops and desktop computers. Whether you&apos;re at home or at
              a relative&apos;s house, the games are always just one tap away.
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
              🎄 Christmas Coloring Pages
            </Link>
            <Link
              href="/games/halloween"
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              🎃 Halloween Games
            </Link>
            <Link
              href="/games/easter"
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              🐣 Easter Games
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
