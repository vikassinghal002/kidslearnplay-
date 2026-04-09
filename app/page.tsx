import Link from "next/link";
import { coloringCategories, games, worksheets, adultCategories, kidsCategories, getGameBySlug } from "@/lib/data";
import GameCard from "@/components/GameCard";

const stats = [
  { value: "12,000+", label: "Coloring Pages" },
  { value: "25+",     label: "Free Games" },
  { value: "20+",     label: "Worksheets" },
  { value: "100%",    label: "Free Forever" },
];

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
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🌈</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Free Coloring Pages,<br />Games &amp; Worksheets
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Hundreds of free printable coloring pages, educational games and worksheets for kids.
            No signup needed — just print and play!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/coloring-pages"
              className="px-8 py-3 bg-white text-purple-700 font-bold rounded-full text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              🎨 Coloring Pages
            </Link>
            <Link
              href="/games"
              className="px-8 py-3 bg-white/20 border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white/30 transition-colors"
            >
              🎮 Play Games
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 border-b">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-purple-600">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Kids Coloring Categories */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">🎨 Kids Coloring Pages</h2>
            <p className="text-gray-500 mt-1">Characters, animals, holidays — print for free</p>
          </div>
          <Link href="/coloring-pages" className="text-purple-600 font-semibold hover:underline hidden sm:block">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kidsCategories.map((cat) => (
            <Link key={cat.slug} href={`/coloring-pages/${cat.slug}`}
              className={`${cat.color} rounded-2xl p-5 flex flex-col items-center text-center hover:scale-105 transition-transform shadow-sm`}>
              <span className="text-4xl mb-2">{cat.icon}</span>
              <h3 className="font-bold text-gray-800 text-sm">{cat.title}</h3>
              <span className="text-xs text-gray-500 mt-1">{cat.pages.length} pages</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Adult Coloring Categories */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">🌸 Detailed & Mindful Coloring</h2>
              <p className="text-gray-500 mt-1">Mandalas, stress relief, zodiac & fantasy — intricate designs, completely free</p>
            </div>
            <Link href="/coloring-pages" className="text-purple-600 font-semibold hover:underline hidden sm:block">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {adultCategories.map((cat) => (
              <Link key={cat.slug} href={`/coloring-pages/${cat.slug}`}
                className={`${cat.color} rounded-2xl p-5 flex flex-col items-center text-center hover:scale-105 transition-transform shadow-sm border border-white`}>
                <span className="text-4xl mb-2">{cat.icon}</span>
                <h3 className="font-bold text-gray-800 text-sm">{cat.title}</h3>
                <span className="text-xs text-purple-600 font-medium mt-1">{cat.pages.length} free pages</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">🎮 Educational Games</h2>
              <p className="text-gray-500 mt-1">Learn through play — free online games</p>
            </div>
            <Link href="/games" className="text-purple-600 font-semibold hover:underline hidden sm:block">
              All games →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featuredGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* Worksheets */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">📄 Free Worksheets</h2>
            <p className="text-gray-500 mt-1">Printable worksheets for every grade</p>
          </div>
          <Link href="/worksheets" className="text-purple-600 font-semibold hover:underline hidden sm:block">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {worksheets.slice(0, 6).map((ws) => (
            <Link
              key={ws.slug}
              href={`/worksheets/${ws.slug}`}
              className="border border-gray-200 rounded-2xl p-5 hover:border-purple-300 hover:bg-purple-50 transition-colors flex items-start gap-4"
            >
              <div className="text-3xl">📋</div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{ws.title}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ws.grade}</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full ml-1">{ws.subject}</span>
              </div>
            </Link>
          ))}
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
