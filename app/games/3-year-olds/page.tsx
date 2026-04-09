import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data";
import GameCard from "@/components/GameCard";

export const metadata: Metadata = {
  title: "Games for 3 Year Olds — Free Online | KidsLearnPlay",
  description:
    "Free online games for 3 year olds! Simple toddler games for colours, shapes, animals and counting. Safe, no ads, no signup — fun learning for little ones.",
};

// Include any game whose age range covers 3-year-olds (lower ≤ 3 ≤ upper)
const ageGames = games.filter((g) => {
  const [lo, hi] = g.ageRange.split(/[–\-]/).map((n) => parseInt(n, 10));
  if (isNaN(lo) || isNaN(hi)) return false;
  return lo <= 3 && hi >= 3;
});

export default function ThreeYearOldsPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero — light gradient with dark text */}
      <section className="bg-gradient-to-br from-pink-400 via-rose-400 to-orange-300 py-14 px-4 text-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4 flex justify-center gap-3">
            <span>🧸</span>
            <span>🎨</span>
            <span>🐣</span>
            <span>⭐</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Games for 3 Year Olds
          </h1>
          <p className="text-lg mb-6 max-w-xl mx-auto text-gray-800">
            Simple, colourful games perfect for toddlers! Tap, click and learn
            with our free games designed for little hands.
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
              Online Games for 3 Year Olds
            </h2>
            <p className="mb-3">
              Three-year-olds are at a magical stage of development — curious
              about everything, learning new words every day, and beginning to
              understand colours, shapes and simple counting. Our games for 3
              year olds are designed specifically for this age: large tap targets,
              bright visuals, and immediate positive feedback that keeps little
              ones engaged.
            </p>
            <p>
              Every game works on tablets, phones and computers. No app download
              is needed — just open a browser and start playing. Parents can sit
              alongside or let toddlers explore independently in a fully safe
              environment with no external links or adverts.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              What Makes a Good Toddler Game?
            </h2>
            <p className="mb-3">
              The best games for 3 year olds have simple objectives, forgiving
              controls and instant rewards. Our Shape Sorter teaches circles,
              squares and triangles by asking children to tap the matching hole —
              a single tap is all it takes. Colour Match teaches red, blue, yellow
              and more through a bright bucket-matching activity that works
              perfectly on a touchscreen.
            </p>
            <p>
              Animal Sounds introduces 12 common animals with their real sounds,
              building vocabulary and world knowledge through joyful discovery.
              These short sessions — each just a few minutes — match a
              three-year-old's natural attention span perfectly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Safe Games — No Ads, No Signup
            </h2>
            <p className="mb-3">
              KidsLearnPlay is completely free and requires no account or email
              address. There are no advertisements, no in-app purchases, and no
              links to external sites. Our games are suitable for unsupervised
              toddler play, though many parents enjoy joining in and turning
              screen time into an interactive learning session together.
            </p>
            <p>
              All games run entirely in the browser — nothing is downloaded or
              installed. They work on iPhone, iPad, Android tablets, Chromebooks
              and desktop computers.
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
