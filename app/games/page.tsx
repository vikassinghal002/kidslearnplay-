import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data";
import GamesAgeFilter from "@/components/GamesAgeFilter";
import {
  JsonLd,
  collectionPageSchema,
  breadcrumbSchema,
  faqPageSchema,
} from "@/lib/schemas";

const GAMES_FAQS = [
  {
    question: "Are JiggyJoy games really free?",
    answer:
      "Yes — every game on JiggyJoy is 100% free. No signup, no in-app purchases, no premium tier. Just open and play.",
  },
  {
    question: "Do JiggyJoy games work on phones and tablets?",
    answer:
      "Yes. All JiggyJoy games run in any modern browser on phones, tablets, Chromebooks and computers. Touch controls work on tablets and phones.",
  },
  {
    question: "What ages are JiggyJoy games for?",
    answer:
      "JiggyJoy games cover ages 2 to 14, from toddler-friendly tap-and-learn games to math and arcade games for tweens. Use the age filter at the top of the page to narrow down.",
  },
  {
    question: "Do I need to download or install anything?",
    answer:
      "No. Every JiggyJoy game runs directly in the browser — there is nothing to install and nothing to update.",
  },
];

export const metadata: Metadata = {
  title: "Free Educational Games for Kids",
  description:
    "Free online educational games for kids — math games, coloring games, alphabet games and more. Fun learning games for preschool, kindergarten and primary school.",
  keywords: [
    "educational games for kids",
    "free kids games",
    "maths play",
    "math games for kids",
    "learning games",
    "online games for kids",
    "coloring games",
  ],
};

const categoryEmojis: Record<string, string> = {
  "Arcade Games":      "🕹️",
  "Toddler Games":     "🧸",
  "Educational Games": "📚",
  "Math Games":        "🔢",
  "Coloring Games":    "🎨",
};

export default function GamesHubPage() {
  return (
    <div>
      <JsonLd
        data={collectionPageSchema({
          name: "Free Educational Games for Kids",
          description:
            "Free online educational games for kids — math games, coloring games, alphabet games and more.",
          url: "/games",
          numberOfItems: games.length,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Games", url: "/games" },
        ])}
      />
      <JsonLd data={faqPageSchema(GAMES_FAQS)} />
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">
            🎮 Free Kids Games
          </h1>
          <p className="text-lg text-white/90">
            Fun educational games for kids — learn maths, letters, colours and more through play.
            All games are free, no download needed!
          </p>
        </div>
      </section>

      {/* Age-filtered game grid */}
      <GamesAgeFilter games={games} categoryEmojis={categoryEmojis} />

      {/* SEO block */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About Our Free Kids Games</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            JiggyJoy offers a growing library of <strong>free educational games for kids</strong>.
            Our games are designed to make learning fun — covering math, reading, spelling, shapes,
            and creative arts. All games run directly in your browser with no app download required.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our most popular section is{" "}
            <Link href="/games/maths-play" className="text-purple-600 hover:underline font-medium">
              Maths Play
            </Link>
            , a complete maths playground covering addition, subtraction, multiplication and
            counting — perfect for primary school children aged 5–10.
          </p>
        </div>
      </section>
    </div>
  );
}
