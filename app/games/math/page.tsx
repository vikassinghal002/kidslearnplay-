import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data";
import GameCard from "@/components/GameCard";

export const metadata: Metadata = {
  title: "Free Math Games for Kids — Play Online | JiggyJoy",
  description:
    "Fun free math games for kids! Practice times tables, addition, subtraction and multiplication with our free online math games. No download, no signup.",
};

// ── Group math games by topic so the hub tells a story instead of dumping
//    18 identical tiles in a grid. Kids scan by theme, not by alphabet.
//    A single game can live in at most one bucket — the order here decides
//    where it shows up.
const mathGames = games.filter((g) => g.category === "Math Games");

const bySlug = (slugs: string[]) =>
  slugs
    .map((s) => mathGames.find((g) => g.slug === s))
    .filter((g): g is (typeof mathGames)[number] => Boolean(g));

const topics = [
  {
    id: "multiply",
    title: "Times Tables & Multiplication",
    emoji: "✖️",
    blurb: "Race the clock, blast asteroids, crush the 7 times table.",
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    pill: "bg-purple-100 text-purple-700 border-purple-200",
    slugs: ["times-tables-challenge", "multiplication-blast", "math-quiz"],
  },
  {
    id: "addsub",
    title: "Addition & Subtraction",
    emoji: "➕",
    blurb: "Add up, take away, build streaks — the foundations of every sum.",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    pill: "bg-emerald-100 text-emerald-700 border-emerald-200",
    slugs: ["math-addition", "math-subtraction", "addition-attack", "subtraction-station"],
  },
  {
    id: "divide",
    title: "Division Duels",
    emoji: "➗",
    blurb: "Face the CPU and split numbers faster than the timer.",
    gradient: "from-red-500 via-rose-500 to-pink-600",
    pill: "bg-rose-100 text-rose-700 border-rose-200",
    slugs: ["division-duel"],
  },
  {
    id: "reallife",
    title: "Real-Life Math: Money, Time & Fractions",
    emoji: "🍕",
    blurb: "The math kids actually use — coins, clocks and pizza slices.",
    gradient: "from-orange-500 via-amber-500 to-yellow-400",
    pill: "bg-amber-100 text-amber-800 border-amber-200",
    slugs: ["fractions-frenzy", "money-match", "time-teller"],
  },
  {
    id: "counting",
    title: "Counting & Number Play",
    emoji: "🔢",
    blurb: "Perfect first maths for little kids — count, tap, celebrate.",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    pill: "bg-sky-100 text-sky-700 border-sky-200",
    slugs: ["counting-game", "maths-play"],
  },
] as const;

// Anything that somehow isn't in a topic bucket still gets shown at the
// bottom so we never silently hide a game.
const placedSlugs: Set<string> = new Set(topics.flatMap((t) => t.slugs as readonly string[]));
const extras = mathGames.filter((g) => !placedSlugs.has(g.slug));

export default function MathGamesHubPage() {
  return (
    <div className="bg-gradient-to-b from-sky-50 via-white to-purple-50 min-h-screen text-gray-900">
      {/* ─────────────────────────────────────────────────────────────
         Hero — bright, playful, very obviously "math land".
         Floating math symbols give the card personality without
         costing us a hero illustration.
         ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-10 sm:pt-14 pb-14 sm:pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl px-6 sm:px-10 py-10 sm:py-14 text-center text-white overflow-hidden">
            {/* Floating math symbol decorations — absolute-positioned emojis
                that gently bob. No JS, just CSS. */}
            <span aria-hidden="true" className="absolute top-4 left-5 text-4xl sm:text-5xl opacity-80 animate-bounce-slow select-none">➕</span>
            <span aria-hidden="true" className="absolute top-8 right-6 text-4xl sm:text-6xl opacity-80 animate-bounce-slow select-none" style={{ animationDelay: "0.4s" }}>✖️</span>
            <span aria-hidden="true" className="absolute bottom-6 left-8 text-3xl sm:text-5xl opacity-70 animate-bounce-slow select-none" style={{ animationDelay: "0.8s" }}>➗</span>
            <span aria-hidden="true" className="absolute bottom-8 right-10 text-3xl sm:text-5xl opacity-70 animate-bounce-slow select-none" style={{ animationDelay: "1.2s" }}>➖</span>
            <span aria-hidden="true" className="absolute top-1/2 left-2 text-2xl sm:text-4xl opacity-60 animate-bounce-slow select-none" style={{ animationDelay: "0.6s" }}>💯</span>
            <span aria-hidden="true" className="absolute top-1/3 right-2 text-2xl sm:text-4xl opacity-60 animate-bounce-slow select-none" style={{ animationDelay: "1s" }}>🧮</span>

            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-sm mb-4 sm:mb-5 shadow-lg ring-4 ring-white/20">
                <span className="text-5xl sm:text-6xl drop-shadow" aria-hidden="true">🔢</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold mb-3 sm:mb-4 leading-tight drop-shadow">
                Free Math Games for Kids
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/95 mb-6 sm:mb-8 max-w-2xl mx-auto font-semibold">
                Times tables, addition, fractions and more — tap a game and go.
                No download, no signup, just maths kids actually want to play.
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-extrabold">
                <span className="bg-white text-purple-700 rounded-full px-4 py-2 shadow-md">✓ 100% Free</span>
                <span className="bg-white text-purple-700 rounded-full px-4 py-2 shadow-md">✓ No Signup</span>
                <span className="bg-white text-purple-700 rounded-full px-4 py-2 shadow-md">✓ Any Device</span>
              </div>

              {/* Jump links — one tap to the topic you came for */}
              <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
                {topics.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 text-sm font-bold text-white border border-white/30 transition-colors"
                  >
                    <span className="text-base" aria-hidden="true">{t.emoji}</span>
                    <span className="hidden sm:inline">{t.title}</span>
                    <span className="sm:hidden">{t.title.split(" ")[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         Topic sections — each one gets its own colored header pill
         and a grid of GameCards. Kids can scan by theme.
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-12 sm:pb-16 space-y-10 sm:space-y-14">
        {topics.map((topic) => {
          const topicGames = bySlug([...topic.slugs]);
          if (topicGames.length === 0) return null;
          return (
            <div key={topic.id} id={topic.id} className="scroll-mt-20">
              {/* Topic header — the colorful anchor strip */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 sm:mb-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center text-3xl sm:text-4xl shrink-0 shadow-lg`}>
                    <span aria-hidden="true">{topic.emoji}</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                      {topic.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 font-semibold mt-1">
                      {topic.blurb}
                    </p>
                  </div>
                </div>
                <span className={`self-start sm:self-auto inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full border ${topic.pill}`}>
                  {topicGames.length} {topicGames.length === 1 ? "game" : "games"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {topicGames.map((game) => (
                  <GameCard key={game.slug} game={game} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Any strays (shouldn't normally happen, but never silently hide) */}
        {extras.length > 0 && (
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5">
              More Math Games
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {extras.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
         SEO copy — keeps Google happy. Light cards on the purple tint.
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-white/60 backdrop-blur-sm border-y border-purple-100 py-12 sm:py-14 px-4">
        <div className="max-w-3xl mx-auto space-y-8 text-gray-700 text-base leading-relaxed">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
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
              round. Over time this positive reinforcement turns &ldquo;I can&rsquo;t do
              maths&rdquo; into &ldquo;I love maths.&rdquo;
            </p>
            <p>
              Our math games align with primary school curriculum goals covering
              counting, number recognition, addition, subtraction and
              multiplication — making them a perfect complement to classroom
              learning and homework practice.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
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
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Free Math Games — No Strings Attached
            </h2>
            <p>
              Every math game on JiggyJoy is completely free. No subscription,
              no in-app purchases, no account required. Just click play and
              start learning. Our games run directly in any modern web browser
              on phones, tablets and computers — so kids can practice wherever
              they are.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         Explore more — subtle outro on the light background
         ───────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">
            Keep Exploring
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Link
              href="/games/kindergarten"
              className="text-sm sm:text-base font-bold bg-white hover:bg-purple-50 text-gray-800 border-2 border-purple-200 hover:border-purple-400 px-5 py-3 rounded-full shadow-sm transition-colors"
            >
              🎒 Kindergarten Games
            </Link>
            <Link
              href="/worksheets"
              className="text-sm sm:text-base font-bold bg-white hover:bg-purple-50 text-gray-800 border-2 border-purple-200 hover:border-purple-400 px-5 py-3 rounded-full shadow-sm transition-colors"
            >
              📄 Free Worksheets
            </Link>
            <Link
              href="/games"
              className="text-sm sm:text-base font-bold bg-white hover:bg-purple-50 text-gray-800 border-2 border-purple-200 hover:border-purple-400 px-5 py-3 rounded-full shadow-sm transition-colors"
            >
              🎮 All Games
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
