import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { games, getGameBySlug } from "@/lib/data";
import GameLoader from "@/components/games/GameLoader";

const categoryEmojis: Record<string, string> = {
  "Math Games": "🔢",
  "Coloring Games": "🎨",
  "Educational Games": "📚",
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return {};
  return {
    title: `${game.title} — Free Online Game for Kids`,
    description: game.description,
    keywords: [...game.tags, "free kids game", "educational game", "online learning"],
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const relatedGames = games.filter((g) => g.slug !== slug && g.category === game.category).slice(0, 3);
  const emoji = categoryEmojis[game.category] ?? "🎯";

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-purple-600">Home</Link>
          {" / "}
          <Link href="/games" className="hover:text-purple-600">Games</Link>
          {" / "}
          <span className="text-gray-800 font-medium">{game.title}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main game area */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{emoji}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{game.title}</h1>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  Age {game.ageRange}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium capitalize">
                  {game.difficulty}
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                  {game.category}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{game.description}</p>

          {/* Game component or placeholder */}
          {game.component ? (
            <GameLoader component={game.component} />
          ) : game.embedUrl ? (
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                src={game.embedUrl}
                className="w-full"
                style={{ height: "500px" }}
                title={game.title}
                allowFullScreen
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-12 text-center">
              <div className="text-7xl mb-4">{emoji}</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">{game.title}</h3>
              <p className="text-gray-500">Game loading...</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">How to Play</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Read the question on screen</li>
              <li>• Tap or click your answer</li>
              <li>• Try to get the highest score!</li>
              <li>• Works on phone, tablet and computer</li>
            </ul>
          </div>

          {/* Skills learned */}
          <div className="bg-green-50 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Skills Practised</h3>
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <span key={tag} className="text-xs bg-white text-gray-700 px-3 py-1 rounded-full border border-green-200 capitalize">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Related games */}
          {relatedGames.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">More {game.category}</h3>
              <div className="space-y-2">
                {relatedGames.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/games/${g.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <span className="text-2xl">{categoryEmojis[g.category] ?? "🎯"}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{g.title}</div>
                      <div className="text-xs text-gray-400">Age {g.ageRange}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All games link */}
          <Link
            href="/games"
            className="block text-center px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            View All Games →
          </Link>
        </aside>
      </div>
    </div>
  );
}
