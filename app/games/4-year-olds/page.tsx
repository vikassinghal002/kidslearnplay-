import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data";
import GameCard from "@/components/GameCard";

export const metadata: Metadata = {
  title: "Games for 4 Year Olds — Free Online | KidsLearnPlay",
  description:
    "Free online games for 4 year olds! Fun preschool games for letters, numbers, animals and colours. Safe, free, no signup — perfect for curious 4 year olds.",
};

// Include any game whose age range covers 4-year-olds (lower ≤ 4 ≤ upper)
const ageGames = games.filter((g) => {
  const [lo, hi] = g.ageRange.split(/[–\-]/).map((n) => parseInt(n, 10));
  if (isNaN(lo) || isNaN(hi)) return false;
  return lo <= 4 && hi >= 4;
});

export default function FourYearOldsPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero — light gradient with dark text */}
      <section className="bg-gradient-to-br from-yellow-400 via-amber-400 to-lime-400 py-14 px-4 text-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4 flex justify-center gap-3">
            <span>🔤</span>
            <span>🔢</span>
            <span>🦁</span>
            <span>🌈</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Games for 4 Year Olds
          </h1>
          <p className="text-lg mb-6 max-w-xl mx-auto text-gray-800">
            Learning through play for curious 4 year olds! Free online games
            covering letters, numbers, animals and more.
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
              Preschool Games for 4 Year Olds
            </h2>
            <p className="mb-3">
              Four-year-olds are ready to tackle early literacy and numeracy
              through play. At this age children can begin recognising letters,
              matching shapes, counting objects up to 10, and sorting by colour
              — all skills that our preschool games reinforce in a fun,
              pressure-free way. Alphabet Match turns letter recognition into a
              memory card game, making A-Z feel like an exciting challenge rather
              than a chore.
            </p>
            <p>
              Our games are pitched at exactly the right level for 4 year olds:
              achievable enough to feel rewarding, but with enough variety to
              stay interesting across multiple play sessions. Each game session
              is short — perfect for young attention spans — and ends on a
              positive note so children are always eager to play again.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Learning Through Play
            </h2>
            <p className="mb-3">
              Research in early childhood education consistently shows that
              play-based learning leads to better retention and a more positive
              attitude towards school. When a 4 year old plays Bubble Pop ABCs,
              they are practising the alphabet sequence without realising they
              are doing structured learning. When they play Colour Match, they
              are building colour vocabulary that directly supports early science
              and art lessons.
            </p>
            <p>
              Animal Sounds introduces vocabulary and world knowledge through
              sound and images. Connect the Dots builds number sequencing — a
              key maths skill — while giving children the satisfaction of
              revealing a hidden picture. These micro-rewards are what make
              educational games so effective at this age.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Free &amp; Safe — No Signup Required
            </h2>
            <p className="mb-3">
              Every game on KidsLearnPlay is completely free, with no account,
              email address or payment required. There are no advertisements
              shown to children, no third-party tracking, and no links to
              external websites. Parents can be confident that handing a tablet
              to their 4 year old with KidsLearnPlay open is a fully safe
              experience.
            </p>
            <p>
              Games run directly in any web browser on phones, tablets and
              computers — including iPhone, iPad, Android devices, Chromebooks
              and Windows PCs. No app installation or download is ever needed.
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
