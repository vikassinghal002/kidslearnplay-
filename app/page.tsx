import Link from "next/link";
import { worksheets, adultCategories, kidsCategories, getGameBySlug } from "@/lib/data";
import type { ColoringCategory } from "@/lib/data";
import GameCard from "@/components/GameCard";
import HomeColoringTabs, { type ColoringTabCard } from "@/components/HomeColoringTabs";
import { JsonLd, faqPageSchema } from "@/lib/schemas";

// Homepage FAQs — answer the questions parents type into Google when sizing
// up a kids' content site. Doubles as FAQ rich-result fuel.
const HOME_FAQS = [
  {
    question: "Is JiggyJoy really 100% free?",
    answer:
      "Yes. Every game, coloring page and worksheet on JiggyJoy is free forever. There are no paid tiers, no in-app purchases, and no premium unlocks.",
  },
  {
    question: "Do I need to create an account or sign up?",
    answer:
      "No account needed. JiggyJoy works the moment you open it — no email, no password, no download. Pick a game or a coloring page and start playing.",
  },
  {
    question: "What ages is JiggyJoy for?",
    answer:
      "JiggyJoy is built for kids ages 2 to 14. Games and worksheets are tagged by age range so you can match the right activity to your child's level — toddlers, preschoolers, elementary and tweens.",
  },
  {
    question: "Are the worksheets and coloring pages printable?",
    answer:
      "Yes. Every worksheet and coloring page is designed to print cleanly on standard A4 or US Letter paper. One click downloads a high-resolution PDF.",
  },
  {
    question: "Does JiggyJoy work on phones and tablets?",
    answer:
      "Yes. JiggyJoy runs in any modern browser on phones, tablets, Chromebooks and computers. There's nothing to install, and the games are touch-friendly for tablets.",
  },
];

// Project the full ColoringCategory (with hundreds of `pages`) down to the
// handful of fields the client tab actually renders. Without this the RSC
// payload for "/" carries every single coloring page slug, title, tags and
// description — tens of kilobytes of dead weight on first load.
function toTabCards(cats: ColoringCategory[]): ColoringTabCard[] {
  return cats.map((c) => ({
    slug: c.slug,
    title: c.title,
    icon: c.icon,
    color: c.color,
    pageCount: c.pages.length,
  }));
}

const kidsColoringCards = toTabCards(kidsCategories);
const adultColoringCards = toTabCards(adultCategories);

const stats = [
  { value: "12,000+", label: "Coloring Pages" },
  { value: "25+",     label: "Free Games" },
  { value: "20+",     label: "Worksheets" },
  { value: "100%",    label: "Free Forever" },
];

// Subject → visual mapping for worksheet cards
function worksheetVisual(subject: string) {
  const s = subject.toLowerCase();
  if (s.includes("math") || s.includes("number"))
    return { emoji: "🔢", bg: "bg-gradient-to-br from-blue-100 to-indigo-100", pill: "bg-blue-100 text-blue-700" };
  if (s.includes("alphabet") || s.includes("letter"))
    return { emoji: "🔤", bg: "bg-gradient-to-br from-yellow-100 to-amber-100", pill: "bg-amber-100 text-amber-800" };
  if (s.includes("trac"))
    return { emoji: "✏️", bg: "bg-gradient-to-br from-green-100 to-emerald-100", pill: "bg-emerald-100 text-emerald-700" };
  if (s.includes("read"))
    return { emoji: "📖", bg: "bg-gradient-to-br from-rose-100 to-pink-100", pill: "bg-rose-100 text-rose-700" };
  if (s.includes("writ"))
    return { emoji: "✍️", bg: "bg-gradient-to-br from-purple-100 to-fuchsia-100", pill: "bg-purple-100 text-purple-700" };
  if (s.includes("science"))
    return { emoji: "🔬", bg: "bg-gradient-to-br from-teal-100 to-cyan-100", pill: "bg-teal-100 text-teal-700" };
  if (s.includes("shape") || s.includes("color") || s.includes("colour"))
    return { emoji: "🎨", bg: "bg-gradient-to-br from-orange-100 to-yellow-100", pill: "bg-orange-100 text-orange-700" };
  return { emoji: "📄", bg: "bg-gradient-to-br from-gray-100 to-slate-100", pill: "bg-gray-100 text-gray-700" };
}

const FEATURED_GAME_SLUGS = [
  "maths-play",
  "pumpkin-smash",
  "dino-run",
  "snake",
  "memory-match-animals",
  "colour-match",
  "pattern-wizard",
  "space-defender",
];
const featuredGames = FEATURED_GAME_SLUGS
  .map((slug) => getGameBySlug(slug))
  .filter((g): g is NonNullable<typeof g> => Boolean(g));

export default function HomePage() {
  return (
    <div>
      <JsonLd data={faqPageSchema(HOME_FAQS)} />
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-bounce-slow" aria-hidden="true">🌈</div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-5 leading-[1.05] drop-shadow-sm">
            Play, Color &amp; Learn<br />
            <span className="text-yellow-200">— 100% Free!</span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-white/95 font-semibold mb-7 sm:mb-8 max-w-2xl mx-auto">
            Free games, coloring pages and worksheets for kids.
            No signup, no ads — just pick one and start!
          </p>

          {/* Primary CTA — Play Games (the main hook) */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
            <Link
              href="/games"
              className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-yellow-300 text-purple-900 font-extrabold rounded-full text-xl sm:text-2xl md:text-3xl shadow-[0_8px_0_0_rgba(120,53,15,0.35)] hover:shadow-[0_4px_0_0_rgba(120,53,15,0.35)] hover:translate-y-1 active:translate-y-2 transition-all whitespace-nowrap animate-bounce-slow touch-manipulation"
            >
              <span className="inline-block group-hover:scale-110 transition-transform" aria-hidden="true">🎮</span>{" "}
              Play Games Now
            </Link>
            <Link
              href="/coloring-pages"
              className="px-6 sm:px-7 py-4 bg-white/15 border-2 border-white text-white font-extrabold rounded-full text-base sm:text-lg md:text-xl hover:bg-white/25 active:bg-white/30 transition-colors whitespace-nowrap touch-manipulation"
            >
              🎨 Coloring Pages
            </Link>
          </div>

          {/* Trust line — COPPA / kids-first posture */}
          <p className="mt-6 text-sm md:text-base text-white/90 font-medium">
            🛡️ No accounts · No ads at kids · No data collection ·{" "}
            <Link href="/parents" className="underline hover:text-white font-bold">
              For Parents
            </Link>
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-8 sm:py-10 border-b">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">{s.value}</div>
              <div className="text-gray-500 text-xs sm:text-sm mt-1 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Coloring Pages — Kids / Adults switcher */}
      <HomeColoringTabs kidsCategories={kidsColoringCards} adultCategories={adultColoringCards} />

      {/* Featured Games */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between gap-3 mb-6 sm:mb-8">
            <div className="min-w-0">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900">🎮 Educational Games</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Learn through play — free online games</p>
            </div>
            <Link href="/games" className="text-purple-600 font-extrabold hover:underline whitespace-nowrap text-sm sm:text-base">
              All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {featuredGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* Worksheets */}
      <section className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <div className="flex items-end justify-between gap-3 mb-6 sm:mb-8">
          <div className="min-w-0">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900">📄 Free Worksheets</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Printable worksheets for every grade</p>
          </div>
          <Link href="/worksheets" className="text-purple-600 font-extrabold hover:underline whitespace-nowrap text-sm sm:text-base">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {worksheets.slice(0, 6).map((ws) => {
            const visual = worksheetVisual(ws.subject);
            return (
              <Link
                key={ws.slug}
                href={`/worksheets/${ws.slug}`}
                className="group block rounded-3xl overflow-hidden bg-white border-2 border-gray-100 shadow-sm hover:border-purple-300 hover:shadow-xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300"
                aria-label={`${ws.title} — ${ws.grade}, ${ws.subject}`}
              >
                {/* Preview band — large subject emoji on colored backdrop */}
                <div className={`relative h-36 ${visual.bg} flex items-center justify-center overflow-hidden`}>
                  <span className="text-7xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {visual.emoji}
                  </span>
                  {/* paper-edge decoration */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/70" />
                  <span className="absolute top-3 right-3 bg-white/90 text-gray-800 text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
                    {ws.grade}
                  </span>
                </div>
                {/* Body */}
                <div className="p-4">
                  <h3 className="font-extrabold text-gray-900 text-base leading-snug line-clamp-2 mb-3">
                    {ws.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${visual.pill}`}>
                      {ws.subject}
                    </span>
                    <span className="text-sm font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                      Print →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-purple-700 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">New pages added every week!</h2>
          <p className="text-purple-200 mb-6">
            Hundreds of free coloring pages, games and worksheets — all printable, all free.
          </p>
          <Link
            href="/coloring-pages"
            className="px-8 py-3 bg-white text-purple-700 font-bold rounded-full text-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Start Exploring Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
