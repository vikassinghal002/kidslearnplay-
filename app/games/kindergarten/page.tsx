import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data";
import GameCard from "@/components/GameCard";

export const metadata: Metadata = {
  title: "Free Kindergarten Games Online — Play & Learn | JiggyJoy",
  description:
    "Free online kindergarten games! Letters, numbers, counting and shapes games for 3–6 year olds. No download, no signup — safe learning fun for little ones.",
};

const kindergartenGames = games.filter(
  (g) =>
    g.ageRange.startsWith("1") ||
    g.ageRange.startsWith("2") ||
    g.ageRange.startsWith("3") ||
    g.ageRange.startsWith("4") ||
    g.ageRange.startsWith("5") ||
    g.difficulty === "easy"
);

const categoryEmojis: Record<string, string> = {
  "Arcade Games": "🕹️",
  "Toddler Games": "🧸",
  "Educational Games": "📚",
  "Math Games": "🔢",
  "Coloring Games": "🎨",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

export default function KindergartenGamesHubPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-3xl mb-4 tracking-widest">🔤 🔢 🎨 🌟</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Free Kindergarten Games
          </h1>
          <p className="text-lg text-white/85 mb-8 max-w-xl mx-auto">
            Fun online learning games for 3–6 year olds. Letters, numbers,
            counting, shapes and more — designed to make learning feel like
            play!
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <span className="bg-white/15 rounded-full px-4 py-1.5">
              ✓ Safe for Kids
            </span>
            <span className="bg-white/15 rounded-full px-4 py-1.5">
              ✓ 100% Free
            </span>
            <span className="bg-white/15 rounded-full px-4 py-1.5">
              ✓ No Signup Needed
            </span>
          </div>
        </div>
      </section>

      {/* Age filter pills (decorative) */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-2">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-emerald-700/60 text-emerald-200 border border-emerald-600/40 cursor-default select-none">
            Ages 2–4
          </span>
          <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-teal-700/60 text-teal-200 border border-teal-600/40 cursor-default select-none">
            Ages 4–6
          </span>
          <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-cyan-700/60 text-cyan-200 border border-cyan-600/40 cursor-default select-none">
            Ages 5–8
          </span>
        </div>
      </section>

      {/* Games grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {kindergartenGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      {/* SEO copy */}
      <section className="bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8 text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Online Games for Kindergartners
            </h2>
            <p className="mb-3">
              The kindergarten years are a critical window for building
              foundational skills. Children aged 3–6 learn most effectively
              through play, and the right educational games can make an enormous
              difference in early literacy and numeracy. Our kindergarten games
              are designed with bright visuals, simple controls and short
              sessions that match a young child's natural attention span.
            </p>
            <p>
              Every game on this page is free, works on tablets and phones, and
              requires no registration. Parents can hand a device to their child
              and feel confident the experience is safe and appropriate.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Alphabet &amp; Reading Games
            </h2>
            <p className="mb-3">
              Learning the alphabet is one of the biggest milestones of the
              kindergarten year. Our Alphabet Match game turns letter recognition
              into a memory card challenge, while Bubble Pop ABCs lets children
              pop letter bubbles in order — making phonics practice feel like a
              game rather than a lesson.
            </p>
            <p>
              For children beginning to spell, Word Spell shows a picture and
              asks kids to arrange letter tiles to form the word — building both
              vocabulary and spelling skills in a low-pressure, interactive way.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Number &amp; Counting Games
            </h2>
            <p className="mb-3">
              Counting Stars introduces number recognition and counting up to 10
              through a simple star-counting activity. Connect the Dots builds
              number sequencing as children tap numbered dots to reveal a
              surprise picture. Both games are perfectly pitched for the
              kindergarten curriculum.
            </p>
            <p>
              All our games are free, require no signup, and are designed to be
              safe for young children.
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
              href="/games/math"
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              🔢 Math Games
            </Link>
            <Link
              href="/worksheets/preschool"
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              📄 Preschool Worksheets
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
