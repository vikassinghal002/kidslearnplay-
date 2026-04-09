import type { Metadata } from "next";
import Link from "next/link";
import { learnTopics } from "@/lib/programmaticContent";

const BASE_URL = "https://www.jiggyjoy.com";

export const metadata: Metadata = {
  title: "How to Teach Kids — Parent & Teacher Guides | JiggyJoy",
  description:
    "Plain-English guides on how to teach reading, maths, phonics, handwriting, telling time, and more. Written for parents and teachers, with linked free worksheets and games.",
  keywords: [
    "how to teach kids",
    "parent teaching guides",
    "how to teach phonics",
    "how to teach multiplication",
    "how to teach reading",
    "homeschool teaching guides",
  ],
  alternates: { canonical: `${BASE_URL}/learn` },
};

function categoryOf(slug: string): string {
  if (/math|multiplication|addition|subtraction|division|fraction|count|number|place-value|shape|pattern|measurement|ordinal|time|clock|money|word-problem|comparison/.test(slug)) return "Maths";
  if (/read|phonic|alphabet|sight-word|spelling|writing|handwriting|rhym|vocabular|sentence|comprehension|name/.test(slug)) return "Literacy";
  if (/focus|listen|patience|shy|emotion|sharing|problem-solving/.test(slug)) return "Life Skills";
  if (/bike|swim/.test(slug)) return "Physical Skills";
  if (/science|solar|animal|dinosaur|geograph|art|coding|days|months|season/.test(slug)) return "The World";
  return "General";
}

const grouped = learnTopics.reduce<Record<string, typeof learnTopics>>((acc, t) => {
  const g = categoryOf(t.slug);
  (acc[g] ||= []).push(t);
  return acc;
}, {});

const groupOrder = ["Literacy", "Maths", "The World", "Life Skills", "Physical Skills", "General"];
const groupEmoji: Record<string, string> = {
  Maths: "🔢",
  Literacy: "📖",
  "Life Skills": "💙",
  "Physical Skills": "🚲",
  "The World": "🌍",
  General: "📘",
};

export default function LearnHubPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 py-14 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            How to Teach — Parent & Teacher Guides
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-5">
            Plain-English guides on how to teach phonics, maths, handwriting, telling time and
            everything in between. No fluff. Written by people who actually teach kids, with every
            recommended worksheet and game linked straight through.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <span className="bg-black/20 px-4 py-2 rounded-full">{learnTopics.length} topics</span>
            <span className="bg-black/20 px-4 py-2 rounded-full">✓ No paywall</span>
            <span className="bg-black/20 px-4 py-2 rounded-full">✓ Linked worksheets & games</span>
          </div>
        </div>
      </section>

      {/* Groups */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {groupOrder
          .filter((g) => grouped[g]?.length)
          .map((group) => (
            <div key={group} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-5 flex items-center gap-3">
                <span>{groupEmoji[group]}</span>
                <span>{group}</span>
                <span className="text-sm font-normal text-gray-500">
                  ({grouped[group].length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[group].map((t) => (
                  <Link
                    key={t.slug}
                    href={`/learn/${t.slug}`}
                    className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-sky-500 hover:bg-gray-800 transition-colors"
                  >
                    <div className="text-xs uppercase tracking-wide text-sky-400 font-semibold mb-2">
                      {group}
                    </div>
                    <div className="text-lg font-bold text-white mb-2">{t.h1}</div>
                    <div className="text-sm text-gray-400 line-clamp-3">{t.metaDescription}</div>
                    <div className="inline-block mt-3 text-xs font-semibold text-sky-400">
                      Read guide →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </section>

      {/* Internal linking */}
      <section className="bg-gray-900 border-t border-gray-800 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Guides that lead to the stuff your child actually needs
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Every guide on this page links directly to the free worksheets and games that support
            it. No affiliate clutter, no upsells — just teaching advice and the tools to act on it.
            If you want to jump straight to the tools instead, try our{" "}
            <Link href="/worksheets" className="text-sky-400 hover:underline">
              worksheet library
            </Link>
            , our{" "}
            <Link href="/games" className="text-sky-400 hover:underline">
              free educational games
            </Link>
            , or our age-based{" "}
            <Link href="/activities/5-year-olds" className="text-sky-400 hover:underline">
              activity hubs
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
