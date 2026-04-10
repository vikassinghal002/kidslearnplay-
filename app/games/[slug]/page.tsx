import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { games, getGameBySlug } from "@/lib/data";
import GameLoader from "@/components/games/GameLoader";
import GameScreen from "@/components/games/GameScreen";
import { getGameVisual } from "@/lib/gameVisuals";
import PinItButton from "@/components/PinItButton";
import VideoEmbed from "@/components/VideoEmbed";
import { getVideosForGame } from "@/lib/videos";

const SITE_URL = "https://www.jiggyjoy.com";

const categoryEmojis: Record<string, string> = {
  "Arcade Games":      "🕹️",
  "Toddler Games":     "🧸",
  "Math Games":        "🔢",
  "Educational Games": "📚",
  "Coloring Games":    "🎨",
};

// Maps a game category to its hub page
const categoryHubs: Record<string, { href: string; label: string }> = {
  "Math Games":        { href: "/games/math",          label: "Math Games" },
  "Toddler Games":     { href: "/games/kindergarten",  label: "Kindergarten" },
  "Educational Games": { href: "/games/kindergarten",  label: "Kindergarten" },
  "Arcade Games":      { href: "/games",               label: "Arcade" },
  "Coloring Games":    { href: "/coloring-pages",      label: "Coloring" },
};

const HOW_TO_PLAY: Record<string, string[]> = {
  "times-tables-challenge": [
    "A multiplication question appears — answer before the timer hits zero!",
    "Tap the correct answer from 4 choices",
    "Correct: +10 points (bonus +5 if answered in under 3 seconds)",
    "Wrong: -5 points — think fast but think right!",
    "Build a streak of correct answers to reach harder tables",
    "Mobile: tap any answer button to play",
  ],
  "multiplication-blast": [
    "A multiplication question appears at the top — find the answer!",
    "Click or tap the asteroid showing the correct answer",
    "Correct: +10 points (bonus if answered quickly)",
    "Wrong: lose a life — you have 3 lives total",
    "Tables get harder as your score grows",
    "Mobile: tap the right asteroid to blast it",
  ],
  "math-quiz": [
    "10 questions per round — answer before the timer hits zero!",
    "Tap the number pad on screen to type your answer",
    "Press ✓ to submit (or Enter on keyboard)",
    "Correct: +10 pts plus a speed bonus for leftover seconds",
    "Wrong or too slow: 0 pts for that question",
    "Desktop: type with your keyboard — faster than tapping!",
  ],
  "space-defender":     ["← → Arrow keys or A/D to move ship", "Space or ↑ to shoot", "Destroy all aliens before they land", "Watch out for enemy bombs!", "Mobile: use on-screen buttons"],
  "brick-breaker":      ["Move your mouse to control the paddle", "Click or press Space to launch the ball", "Break all bricks to complete the level", "Catch falling power-ups for bonuses", "Don't let the ball fall below your paddle"],
  "dino-run":           ["Press Space or tap to jump", "Double-jump available mid-air!", "Dodge cacti and flying birds", "Speed increases as you score more", "Beat your high score!"],
  "snake":              ["Arrow keys or WASD to steer", "Swipe on mobile", "Eat 🍎 apples to grow and score", "⭐ Bonus and 💎 Super food worth more", "Don't crash into yourself!"],
  "maths-play":         ["Choose +, −, or × mode", "Tap the correct answer", "Build a streak for bonus points", "Try all three modes!"],
  "math-addition":      ["Look at the addition question", "Tap the correct answer from the choices", "Build a streak for bonus points", "Keep going — questions get trickier!"],
  "math-subtraction":   ["Read the subtraction problem", "Tap the correct answer from the choices", "Build a streak for bonus points", "Answer fast for a higher score!"],
  "counting-game":      ["Count the objects on screen", "Tap the correct number", "Gets harder as you progress"],
  "alphabet-match":     ["Flip cards to reveal letters", "Match each UPPERCASE with its lowercase", "Find all pairs to win"],
  "animal-sounds":      ["Tap each animal to hear its sound", "Discover all 12 animals", "Try to remember each sound"],
  "bubble-pop-abc":     ["Pop bubbles in A-B-C order", "Find and tap each letter in sequence", "Complete the whole alphabet!"],
  "shape-sorter":       ["Look at the shape shown at the top", "Tap the matching shape hole below", "Sort all 6 shapes to win"],
  "colour-match":       ["Look at the colour shown", "Tap the correct colour bucket", "Build a streak for bonus points"],
  "memory-match-animals": ["Tap any card to flip it", "Find the matching animal pair", "Remember card positions!", "Easy: 6 pairs · Medium: 8 · Hard: 12"],
  "connect-the-dots":   ["Tap the dots in number order: 1, 2, 3...", "Connect all dots to reveal the picture", "Try all three pictures"],
  "word-spell":         ["Look at the picture and spell the word", "Tap letter tiles to build your answer", "Press Check when ready", "Use Hint if you're stuck"],
  "pattern-wizard":     ["Study the colour/shape sequence", "Tap what comes next", "Patterns get harder each level", "Fill multiple blanks in order on later levels"],
  "sorting-frenzy":     ["Items fall from the top", "Tap items in the buckets below to sort them", "5 misses and it's game over", "Speed increases as your score climbs!"],
  "story-adventure":    ["Read the story scene", "Tap a choice to decide what happens next", "Your choices affect the ending", "Try different choices for different endings!"],
  "pumpkin-smash": [
    "Tap 🎃 pumpkins for +10 points",
    "Tap 👻 ghosts for +20 bonus points",
    "Avoid 🦇 bats — they cost you points!",
    "Golden pumpkins give +30 (rare!)",
    "Chain hits without missing for a 2x combo",
    "60 seconds — smash as many as you can!",
  ],
  "present-catcher": [
    "Move the elf left/right with arrow keys or by dragging",
    "Catch 🎁 presents (+10), stars (+25) and golden gifts (+50)",
    "Avoid coal — it costs you a life!",
    "5 catches in a row = speed boost combo",
    "You have 3 lives and 60 seconds",
    "Mobile: drag anywhere on the screen to move",
  ],
  "super-jumper": [
    "← → Arrow keys or A/D to run left and right",
    "↑ / Space / Jump button to jump",
    "Land ON TOP of enemies to stomp them (+50 pts)",
    "Collect gold coins for +10 pts each",
    "Reach the 🏁 flag to win the level!",
    "Mobile: use the on-screen ◀ ▶ and JUMP buttons",
  ],
  "easter-egg-hunt": [
    "Click or tap to search for hidden eggs",
    "Watch the hot/cold hints — red = very close, blue = far",
    "Regular eggs: +10 · Patterned: +20 · Golden: +50",
    "You have 15 clicks per round — use them wisely!",
    "Find all eggs to advance to the next round",
    "How many rounds can you complete?",
  ],
  "fractions-frenzy": [
    "Look at the pizza pie — count how many slices are shaded",
    "Pick the fraction that matches what you see (e.g. 3/8 or 1/2)",
    "10 rounds — pies get trickier as you go",
    "Mobile: tap the answer button that matches the shaded amount",
  ],
  "money-match": [
    "Read the target amount at the top (e.g. Make 65¢)",
    "Tap pennies, nickels, dimes and quarters to add up to the target",
    "Don't go over — if your total is too big it resets",
    "Mobile: tap each coin to add it; tap Undo or Reset to start the round over",
  ],
  "spelling-bee": [
    "Look at the picture and spell the word by tapping letter tiles in order",
    "You have 30 seconds per word — don't let the bee fly off!",
    "Complete all 10 sight words to beat the round",
    "Mobile: tap a letter tile to drop it in the next blank, tap Undo to remove the last letter",
  ],
  "time-teller": [
    "Read the analog clock and pick the correct time from 4 choices",
    "Rounds 1-3 are to the hour, 4-6 are to the half hour, 7-10 are to the quarter hour",
    "10 rounds total — aim for a perfect score",
    "Mobile: tap the time button that matches the clock",
  ],
  "addition-attack": [
    "Read the question at the top (e.g. 5 + 4 = ?)",
    "Tap the asteroid showing the correct sum before it reaches the ground",
    "Wrong tap or missed asteroid = lose a life — you have 3 lives, 15 rounds",
    "Mobile: tap the right asteroid to blast it out of the sky",
  ],
  "subtraction-station": [
    "Look at the train car's equation (e.g. 10 − 3 = ?)",
    "Tap the passenger button showing the correct answer",
    "Correct answers make the train puff and the next car arrive",
    "Mobile: tap a passenger to answer — 12 rounds total",
  ],
  "division-duel": [
    "Solve each division problem before the red CPU timer bar fills",
    "Correct answer scores a point for you, wrong or too slow scores for CPU",
    "First to 5 points wins the duel — best-of-9 rounds",
    "Mobile: tap your answer fast before the bar fills",
  ],
  "sight-word-slam": [
    "Read the target sight word at the top of the screen",
    "Tap the matching word card from the 6 options before the timer runs out",
    "Wrong tap or timeout = lose a life — you have 3 lives and 20 rounds",
    "Mobile: tap the card that matches the target word",
  ],
  "reading-rocket": [
    "Look at the picture and the word with the missing middle vowel (e.g. C_T)",
    "Pick the right vowel from a, e, i, o, u to fill the blank",
    "Each correct answer fills the rocket's fuel tank by 20% — hit 100% to launch!",
    "3 levels of CVC word phonics practice. Mobile: tap the vowel button",
  ],
  "sudoku-kids": [
    "Fill every row, column and 2×2 box with the numbers 1 to 4 — no repeats",
    "Tap a blank cell, then tap a number 1-4 to place it (✕ clears)",
    "Invalid moves flash red so you can try again",
    "Beat your best time! 5 puzzles to solve. Mobile: tap cell, tap number",
  ],
};

const DEFAULT_HOW_TO_PLAY = ["Read the instructions on screen", "Tap or click to interact", "Try to get the highest score!", "Works on phone, tablet and computer"];

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return {};

  const pageUrl = `${SITE_URL}/games/${slug}`;
  const pinUrl  = `${SITE_URL}/pin/games/${slug}`;
  const ogUrl   = `${SITE_URL}/games/${slug}/opengraph-image`; // Next's auto-generated 1200x630 (if present)
  const title   = `${game.title} — Free Online Game for Kids`;

  return {
    title,
    description: game.description,
    keywords: [...game.tags, "free kids game", "educational game", "online learning"],
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description: game.description,
      url: pageUrl,
      type: "article",
      siteName: "JiggyJoy",
      // Pinterest uses the FIRST og:image, so we list the 1000x1500 pin first.
      // Facebook / Twitter are happy with any of these.
      images: [
        {
          url: pinUrl,
          width: 1000,
          height: 1500,
          alt: `${game.title} — free online game for kids`,
        },
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: game.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: game.description,
      images: [pinUrl],
    },
    other: {
      // Pinterest Rich Pins read these article:* tags.
      "article:published_time": "2025-01-01T00:00:00Z",
      "article:author":         "JiggyJoy",
      "article:section":        game.category,
      // Explicit Pinterest image hint — some scrapers look for this.
      "pinterest:description":  game.description,
      "pinterest:media":        pinUrl,
    },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const relatedGames = games
    .filter((g) => g.slug !== slug && g.category === game.category)
    .slice(0, 6);

  // Lever 4 — pull any YouTube videos that feature this game
  const gameVideos = getVideosForGame(game.slug);
  const featuredVideo = gameVideos[0];

  const emoji = categoryEmojis[game.category] ?? "🎯";
  const howToPlay = HOW_TO_PLAY[slug] ?? DEFAULT_HOW_TO_PLAY;
  const categoryHub = categoryHubs[game.category];

  const pageUrl     = `${SITE_URL}/games/${slug}`;
  const pinImageUrl = `${SITE_URL}/pin/games/${slug}`;
  const pinDesc     = `${game.title} — Free online ${game.category.toLowerCase()} for kids. ${game.description} Play free on jiggyjoy.com`;

  const suggestedMinAge = parseInt(game.ageRange.split(/[–\-]/)[0], 10);
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: game.title,
    description: game.description,
    applicationCategory: "GameApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: `https://www.jiggyjoy.com/games/${slug}`,
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: isNaN(suggestedMinAge) ? 3 : suggestedMinAge,
    },
  };

  return (
    <div className="bg-gray-950 text-white flex flex-col" style={{ minHeight: "100dvh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 sm:px-5 h-10 bg-gray-900 border-b border-gray-800 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/games" className="text-gray-400 hover:text-white transition-colors text-lg shrink-0" title="All Games">←</Link>
          <span className="text-lg shrink-0">{emoji}</span>
          <h1 className="text-sm font-bold text-white truncate">{game.title}</h1>
          <nav className="hidden sm:flex items-center gap-1 text-xs text-gray-500 ml-1">
            <span className="text-gray-700">·</span>
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/games" className="hover:text-gray-300 transition-colors">Games</Link>
            {categoryHub && categoryHub.href !== "/games" && (
              <>
                <span>/</span>
                <Link href={categoryHub.href} className="hover:text-gray-300 transition-colors">{categoryHub.label}</Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs bg-blue-900/60 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full">Age {game.ageRange}</span>
          <span className="hidden sm:block text-xs bg-green-900/60 text-green-300 border border-green-700/50 px-2 py-0.5 rounded-full capitalize">{game.difficulty}</span>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────────── */}
      {/* Mobile: game stacks above sidebar (scrollable)                 */}
      {/* Desktop: game left, sidebar right, both fixed in viewport       */}
      <div className="flex flex-col lg:flex-row lg:flex-1 lg:overflow-hidden" style={{ "--game-h": "calc(100dvh - 40px)" } as React.CSSProperties}>

        {/* ── Game area ─────────────────────────────────────────────── */}
        {/* Mobile: at least full viewport height so game is always seen  */}
        {/* Desktop: fills remaining width, fixed height                  */}
        <div className="w-full lg:flex-1 lg:overflow-hidden" style={{ minHeight: "var(--game-h)" }}>
          {game.component ? (
            <GameScreen title={game.title} howToPlay={howToPlay} skills={game.tags}>
              <GameLoader component={game.component} />
            </GameScreen>
          ) : game.embedUrl ? (
            <iframe src={game.embedUrl} className="w-full min-h-[400px] lg:h-full" title={game.title} allowFullScreen />
          ) : (
            <div className="w-full flex items-center justify-center bg-gray-900" style={{ minHeight: "var(--game-h)" }}>
              <div className="text-center"><div className="text-7xl mb-4">{emoji}</div><p className="text-gray-400">Game loading...</p></div>
            </div>
          )}
        </div>

        {/* ── Sidebar (right, desktop only) ───────────────────────── */}
        <aside className="lg:w-72 xl:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-900 flex flex-col lg:overflow-y-auto" style={{ maxHeight: "var(--game-h)" } as React.CSSProperties}>

          {/* Description */}
          <div className="p-4 border-b border-gray-800">
            <p className="text-sm text-gray-400 leading-relaxed">{game.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="text-xs bg-blue-900/60 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full">Age {game.ageRange}</span>
              <span className="text-xs bg-green-900/60 text-green-300 border border-green-700/50 px-2 py-0.5 rounded-full capitalize">{game.difficulty}</span>
              <span className="text-xs bg-purple-900/60 text-purple-300 border border-purple-700/50 px-2 py-0.5 rounded-full">{game.category}</span>
            </div>
          </div>

          {/* How to play */}
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">How to Play</h3>
            <ul className="space-y-1.5">
              {howToPlay.map((tip, i) => (
                <li key={i} className="text-sm text-gray-300 flex gap-2">
                  <span className="text-purple-400 flex-shrink-0 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Skills Practised</h3>
            <div className="flex flex-wrap gap-1.5">
              {game.tags.map((tag) => (
                <span key={tag} className="text-xs bg-purple-900/40 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded-full capitalize">{tag}</span>
              ))}
            </div>
          </div>

          {/* Lever 4 — Watch a walkthrough (only if a video exists for this game) */}
          {featuredVideo && (
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                📺 Watch a Walkthrough
              </h3>
              <Link
                href={`/videos/${featuredVideo.id}`}
                className="block rounded-xl overflow-hidden border border-gray-700 hover:border-red-500/60 transition-colors"
              >
                <VideoEmbed
                  youtubeId={featuredVideo.youtubeId}
                  title={featuredVideo.title}
                  showTitleOverlay={false}
                />
              </Link>
              <p className="mt-2 text-sm font-semibold text-gray-200 line-clamp-2">
                {featuredVideo.title}
              </p>
              {gameVideos.length > 1 && (
                <Link
                  href="/videos"
                  className="mt-2 inline-block text-xs font-semibold text-red-400 hover:text-red-300"
                >
                  +{gameVideos.length - 1} more video{gameVideos.length - 1 > 1 ? "s" : ""} →
                </Link>
              )}
            </div>
          )}

          {/* Related games */}
          {relatedGames.length > 0 && (
            <div className="p-4 flex-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">More {game.category}</h3>
              <div className="space-y-2">
                {relatedGames.map((g) => {
                  const visual = getGameVisual(g.slug);
                  return (
                    <Link
                      key={g.slug}
                      href={`/games/${g.slug}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50 hover:border-purple-600/50 transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${visual.gradient} flex items-center justify-center text-xl shrink-0`}>
                        {visual.hero}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-200 group-hover:text-white truncate">{g.title}</p>
                        <p className="text-xs text-gray-500">Age {g.ageRange}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="p-4 border-t border-gray-800 flex flex-col gap-2">
            <PinItButton
              pageUrl={pageUrl}
              mediaUrl={pinImageUrl}
              description={pinDesc}
              className="block w-full text-center py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold text-sm transition-colors"
            />
            {categoryHub && categoryHub.href !== "/games" && (
              <Link
                href={categoryHub.href}
                className="block w-full text-center py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                {emoji} More {categoryHub.label} →
              </Link>
            )}
            <Link
              href="/games"
              className="block w-full text-center py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              All Games →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
