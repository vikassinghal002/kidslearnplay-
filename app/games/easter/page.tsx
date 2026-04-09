import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data";
import GameCard from "@/components/GameCard";

export const metadata: Metadata = {
  title: "Easter Games for Kids — Free Online | KidsLearnPlay",
  description:
    "Free Easter games for kids! Fun Easter activities, Easter coloring pages and spring games online. No download, no signup — perfect for Easter weekend!",
};

// Themed games tagged for Easter (populated when seasonal games ship)
const easterGames = games.filter(
  (g) =>
    g.tags.includes("easter") ||
    g.tags.includes("spring") ||
    g.tags.includes("bunny")
);

// Hand-picked bright, bouncy toddler-leaning favourites — distinct from Halloween/Christmas picks
const EASTER_FAVOURITES = [
  "bubble-pop-abc",
  "shape-sorter",
  "animal-sounds",
  "counting-game",
  "alphabet-match",
  "story-adventure",
];
const favouriteGames = EASTER_FAVOURITES.map((slug) =>
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

export default function EasterGamesPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-4xl mb-4">🐣 🐰 🌷 🥚</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Easter Games for Kids
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Hoppy Easter! Free online Easter games and activities for kids — no
            download needed.
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
        {easterGames.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">
              🐣 Spring Easter Games
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Themed games made just for Easter — bunnies, eggs and
              springtime fun!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mb-12">
              {easterGames.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          </>
        )}

        <h2 className="text-2xl font-bold text-white mb-2">
          Easter Weekend Favourites — Play Free
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Bright, bouncy games perfect for the Easter holidays — ideal for
          little ones while the egg hunt warms up.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {favouriteGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      {/* Easter Coloring section */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Easter Coloring Pages
        </h2>
        <div className="bg-purple-950 border-2 border-yellow-400 rounded-xl p-6 text-center max-w-md mx-auto">
          <p className="text-5xl mb-3">🥚</p>
          <h3 className="text-xl font-bold mb-2">Easter Coloring Pages</h3>
          <p className="text-gray-300 mb-4">
            Free printable Easter coloring pages — Easter bunnies, decorated
            eggs, spring chicks and more!
          </p>
          <Link
            href="/coloring-pages/holidays"
            className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors inline-block"
          >
            View Easter Coloring Pages →
          </Link>
        </div>
      </section>

      {/* SEO copy */}
      <section className="bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8 text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Easter Games for Kids
            </h2>
            <p className="mb-3">
              Easter weekend is one of the best long weekends of the year for
              families — four whole days to relax, be creative and spend time
              together. Online games are a brilliant way to entertain children
              during the quieter parts of the day, especially for little ones
              who wake up at dawn buzzing with excitement before the Easter egg
              hunt has even started.
            </p>
            <p className="mb-3">
              Our games cover a wide range of ages and interests. Toddlers and
              preschoolers will love Animal Sounds, Shape Sorter and Bubble Pop
              ABCs — gentle, colourful activities with instant feedback. Older
              kids can challenge themselves with arcade games like Dino Run and
              Brick Breaker, or practice their maths with Times Tables Challenge.
            </p>
            <p>
              All games run instantly in any browser — so whether you&apos;re at
              home or visiting family over the Easter break, entertainment is
              always one tap away.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Easter Egg Hunt Ideas
            </h2>
            <p className="mb-3">
              An Easter egg hunt is the highlight of the weekend for most kids,
              but a little creativity makes it even more memorable. Try a
              glow-in-the-dark hunt after dark using plastic eggs with small
              torch batteries inside, or a clue-based treasure hunt where each
              found egg contains a riddle leading to the next hiding spot.
            </p>
            <p className="mb-3">
              For rainy Easter mornings (let&apos;s be honest, it happens), an
              indoor hunt works just as well — hide eggs around the living room
              and kitchen and watch kids scramble with their baskets. You can
              even run a digital warm-up: let the kids play a few online games
              first, then announce the hunt starts when they beat their high
              score.
            </p>
            <p>
              After the hunt, our Easter coloring pages give children a calm
              creative activity to enjoy while the grown-ups tidy up the
              chocolate chaos.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Free Easter Activities Online
            </h2>
            <p className="mb-3">
              Every game and coloring page on KidsLearnPlay is completely free.
              No account needed, no subscription, no app to download — just open
              any page and start playing or printing right away.
            </p>
            <p>
              Our free Easter activities work on any device, so kids can play on
              a phone, tablet, laptop or desktop. Perfect for the school
              holidays when screen time is a little more relaxed and you want
              something genuinely fun and age-appropriate at your fingertips.
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
              🥚 Easter Coloring Pages
            </Link>
            <Link
              href="/games/halloween"
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              🎃 Halloween Games
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
