import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.jiggyjoy.com";

export const metadata: Metadata = {
  title: "For Parents — How JiggyJoy Works",
  description:
    "A kids-first, privacy-first learning site. No accounts, no ads targeted at children, no data collection beyond anonymous analytics. Here's exactly what your child will learn and how we keep them safe.",
  alternates: { canonical: `${BASE_URL}/parents` },
  openGraph: {
    title: "For Parents — How JiggyJoy Works",
    description:
      "Privacy-first free games, worksheets and coloring pages for kids. No accounts, no ads at kids, no data collection.",
    url: `${BASE_URL}/parents`,
    type: "article",
  },
};

const ageGroups = [
  {
    label: "Ages 2–4",
    dot: "bg-green-400",
    emoji: "🧸",
    what: "Big tap targets, single-step activities, no reading required.",
    picks: [
      { href: "/games/animal-sounds", label: "Animal Sounds" },
      { href: "/games/color-match", label: "Color Match" },
      { href: "/games/bubble-pop-abc", label: "Bubble Pop ABC" },
      { href: "/coloring-pages/easy", label: "Easy Coloring" },
    ],
  },
  {
    label: "Ages 5–7",
    dot: "bg-yellow-400",
    emoji: "⭐",
    what: "Early reading, counting, phonics and problem-solving.",
    picks: [
      { href: "/games/counting-game", label: "Counting Stars" },
      { href: "/games/alphabet-match", label: "Alphabet Match" },
      { href: "/games/word-spell", label: "Word Spell" },
      { href: "/worksheets/kindergarten", label: "Kindergarten Worksheets" },
    ],
  },
  {
    label: "Ages 8–10",
    dot: "bg-blue-400",
    emoji: "🎯",
    what: "Times tables, spelling, logic puzzles and deeper challenges.",
    picks: [
      { href: "/games/times-tables-challenge", label: "Times Tables Challenge" },
      { href: "/games/multiplication-blast", label: "Multiplication Blast" },
      { href: "/games/math-quiz", label: "Math Quiz" },
      { href: "/worksheets/math", label: "Math Worksheets" },
    ],
  },
  {
    label: "Tweens 11+",
    dot: "bg-purple-400",
    emoji: "🚀",
    what: "Speed arcade games, advanced math and mindful coloring.",
    picks: [
      { href: "/games/snake", label: "Snake" },
      { href: "/games/space-defender", label: "Space Defender" },
      { href: "/games/brick-breaker", label: "Brick Breaker" },
      { href: "/coloring-pages", label: "Detailed Coloring" },
    ],
  },
];

const learningAreas = [
  { emoji: "🔢", label: "Numeracy", detail: "Counting, addition, subtraction, times tables, fractions." },
  { emoji: "🔤", label: "Literacy", detail: "Letter recognition, phonics, spelling and sight words." },
  { emoji: "🧠", label: "Logic & memory", detail: "Pattern matching, sequencing, memory games and puzzles." },
  { emoji: "🎨", label: "Creativity", detail: "Free coloring pages, mandala art and open-ended printables." },
  { emoji: "🤹", label: "Motor skills", detail: "Tracing sheets, drag-and-drop and tap-accurate arcade play." },
  { emoji: "💡", label: "Problem solving", detail: "Sudoku for kids, sorting games and strategy challenges." },
];

export default function ParentsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-3">👨‍👩‍👧</div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            For Parents
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            A free, no-signup play space for your child. Here&apos;s exactly
            what they&apos;ll learn and how we keep things safe.
          </p>
        </div>
      </section>

      {/* Privacy-first pledge */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            Our kids-first pledge
          </h2>
          <ul className="space-y-3 text-gray-800 text-base md:text-lg">
            <li className="flex gap-3">
              <span className="text-green-600 font-extrabold">✓</span>
              <span><strong>No accounts.</strong> Your child never signs up, never enters a name or email.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-extrabold">✓</span>
              <span><strong>No personal data collection.</strong> We do not collect names, birthdays, photos, voice or location from children.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-extrabold">✓</span>
              <span><strong>No ads targeted at kids.</strong> Any analytics we run are aggregate and anonymous.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-extrabold">✓</span>
              <span><strong>No in-app purchases.</strong> Every game, worksheet and coloring page is 100% free, forever.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-extrabold">✓</span>
              <span><strong>No external links inside games.</strong> Kids stay inside the play area until they choose to leave.</span>
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
            <Link
              href="/privacy-policy"
              className="px-5 py-2 bg-white border-2 border-green-300 text-green-800 rounded-full hover:bg-green-100 transition-colors"
            >
              Read the full Privacy Policy →
            </Link>
            <Link
              href="/terms"
              className="px-5 py-2 bg-white border-2 border-green-300 text-green-800 rounded-full hover:bg-green-100 transition-colors"
            >
              Terms of Use →
            </Link>
          </div>
        </div>
      </section>

      {/* What your kid learns */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-3">
            What your child will learn
          </h2>
          <p className="text-center text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-10">
            Every game and worksheet maps to a real curriculum area. Nothing
            here is filler — it all builds a skill.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningAreas.map((a) => (
              <div
                key={a.label}
                className="bg-white border-2 border-purple-100 rounded-2xl p-5 hover:border-purple-300 transition-colors"
              >
                <div className="text-4xl mb-2">{a.emoji}</div>
                <h3 className="font-extrabold text-gray-900 text-lg mb-1">{a.label}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations by age */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-3">
          Recommendations by age
        </h2>
        <p className="text-center text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-10">
          A hand-picked starter pack for each age band. These are the easiest
          way to get started in under 30 seconds.
        </p>

        <div className="space-y-6">
          {ageGroups.map((g) => (
            <div
              key={g.label}
              className="border-2 border-gray-100 rounded-3xl p-6 md:p-7 hover:border-purple-200 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl" aria-hidden="true">{g.emoji}</span>
                <span className={`w-3 h-3 rounded-full ${g.dot} ring-4 ring-offset-2 ring-offset-white`} aria-hidden="true" />
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-900">{g.label}</h3>
              </div>
              <p className="text-gray-700 text-base mb-4">{g.what}</p>
              <div className="flex flex-wrap gap-2">
                {g.picks.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="px-4 py-2 bg-purple-50 text-purple-800 font-bold rounded-full text-sm hover:bg-purple-100 border border-purple-100"
                  >
                    {p.label} →
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to use JiggyJoy well */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Getting the most out of JiggyJoy
          </h2>
          <ol className="space-y-5 text-gray-800">
            <li className="flex gap-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center text-lg">1</span>
              <div>
                <h3 className="font-extrabold text-lg mb-1">Start with age chips</h3>
                <p className="text-gray-600">Use the age filter at the top of the Games hub to jump straight to the right difficulty. Less frustration, more confidence.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center text-lg">2</span>
              <div>
                <h3 className="font-extrabold text-lg mb-1">Mix play with printables</h3>
                <p className="text-gray-600">Pair a 10-minute game with a matching worksheet — it cements the skill and gives screens a rest.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center text-lg">3</span>
              <div>
                <h3 className="font-extrabold text-lg mb-1">Let them pick</h3>
                <p className="text-gray-600">Kid-led sessions are more motivating. The age dots on every game card help them make safe choices themselves.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center text-lg">4</span>
              <div>
                <h3 className="font-extrabold text-lg mb-1">Install as an app</h3>
                <p className="text-gray-600">JiggyJoy works offline once installed. On iPhone use Safari → Share → Add to Home Screen. On Android use Chrome → Install app.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-purple-700 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-3">Questions or feedback?</h2>
          <p className="text-purple-200 mb-6">
            We read everything. If something isn&apos;t working for your child, tell us.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/about"
              className="px-7 py-3 bg-white text-purple-700 font-extrabold rounded-full text-lg hover:bg-gray-100 transition-colors"
            >
              About JiggyJoy
            </Link>
            <Link
              href="/games"
              className="px-7 py-3 bg-purple-800 border-2 border-purple-400 text-white font-extrabold rounded-full text-lg hover:bg-purple-900 transition-colors"
            >
              Browse Games →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
