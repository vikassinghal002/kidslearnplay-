import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data";
import GameCard from "@/components/GameCard";

export const metadata: Metadata = {
  title: "Games for 5 Year Olds — Free Online | KidsLearnPlay",
  description:
    "Free online games for 5 year olds! Fun kindergarten-level games for reading, maths and creative play. No download, no signup — start playing instantly.",
};

// Include any game whose age range covers 5-year-olds (lower ≤ 5 ≤ upper)
const ageGames = games.filter((g) => {
  const [lo, hi] = g.ageRange.split(/[–\-]/).map((n) => parseInt(n, 10));
  if (isNaN(lo) || isNaN(hi)) return false;
  return lo <= 5 && hi >= 5;
});

export default function FiveYearOldsPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero — light gradient with dark text */}
      <section className="bg-gradient-to-br from-blue-400 via-sky-400 to-cyan-400 py-14 px-4 text-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4 flex justify-center gap-3">
            <span>📚</span>
            <span>🔢</span>
            <span>🎮</span>
            <span>🌟</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Games for 5 Year Olds
          </h1>
          <p className="text-lg mb-6 max-w-xl mx-auto text-gray-800">
            Getting ready for school? Our free games make learning letters and
            numbers fun for 5 year olds.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <span className="bg-black/10 px-4 py-2 rounded-full">✓ Safe for Kids</span>
            <span className="bg-black/10 px-4 py-2 rounded-full">✓ 100% Free</span>
            <span className="bg-black/10 px-4 py-2 rounded-full">✓ No Signup</span>
          </div>
        </div>
      </section>

      {/* Games count */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-2">
        <p className="text-gray-400 text-sm">{ageGames.length} games found</p>
      </div>

      {/* Games grid */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {ageGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      {/* SEO copy */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Online Games for 5 Year Olds
            </h2>
            <p className="mb-3">
              Five is a big year. Children at this age are starting or preparing
              for school, and the foundational skills they build now — letter
              recognition, phonics, counting and number sense — will shape their
              academic confidence for years to come. Our games for 5 year olds
              are designed to reinforce exactly these skills in short, rewarding
              play sessions that children choose to return to.
            </p>
            <p>
              All games work on any device with a browser — no download, no
              install, no account required. Whether on a family tablet, a school
              Chromebook or a smartphone, kids can jump straight into a game
              within seconds.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Reading &amp; Alphabet Games
            </h2>
            <p className="mb-3">
              Alphabet Match challenges 5 year olds to pair uppercase and
              lowercase letters in a memory card format — building letter
              recognition while exercising working memory. Bubble Pop ABCs
              reinforces alphabetical order by asking children to pop letter
              bubbles in sequence, giving instant feedback with every tap.
            </p>
            <p>
              Word Spell takes things a step further: children see a picture and
              click letter tiles to spell the word. The easy mode uses simple
              3-letter words, making it perfectly achievable for 5 year olds
              beginning their reading journey. These games align directly with
              the phonics and literacy targets children encounter in Reception
              and Kindergarten.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Maths Games for 5 Year Olds
            </h2>
            <p className="mb-3">
              Counting Stars builds number recognition and quantity sense up to
              10 — a core early maths goal. Connect the Dots teaches number
              sequencing in a creative way, with children tapping numbered dots
              to reveal a hidden picture. Both games make early maths concepts
              feel like exciting challenges rather than lessons.
            </p>
            <p>
              For 5 year olds who are ready to move beyond counting, our
              Addition Adventure introduces simple addition in a friendly animated
              format, celebrating every correct answer with positive feedback that
              builds mathematical confidence from the very start.
            </p>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4 justify-center">
          <Link href="/games/kindergarten" className="text-blue-400 hover:underline">
            Kindergarten Games →
          </Link>
          <Link href="/games/math" className="text-blue-400 hover:underline">
            Math Games →
          </Link>
          <Link href="/worksheets/preschool" className="text-blue-400 hover:underline">
            Preschool Worksheets →
          </Link>
          <Link href="/games" className="text-blue-400 hover:underline">
            All Games →
          </Link>
        </div>
      </section>
    </div>
  );
}
