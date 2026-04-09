import type { Metadata } from "next";
import Link from "next/link";
import { printablePages } from "@/lib/programmaticContent";

const BASE_URL = "https://www.jiggyjoy.com";

export const metadata: Metadata = {
  title: "Free Printables for Kids — Worksheets, Activities & Holiday Sheets",
  description:
    "Over 50 free printables for kids: word searches, mazes, colouring sheets, math drills, handwriting practice, holiday activities and more. Print instantly, no signup.",
  keywords: [
    "free printables for kids",
    "printable activities for kids",
    "free printable worksheets",
    "kids printables",
    "halloween printables",
    "christmas printables",
  ],
  alternates: { canonical: `${BASE_URL}/printables` },
};

// Rough grouping by keyword heuristics so parents can scan quickly.
function groupOf(slug: string): string {
  if (/halloween|christmas|easter|thanksgiving|valentines|st-patricks|mothers-day|fathers-day/.test(slug)) return "Holidays";
  if (/maze|dot-to-dot|hidden|spot-the-difference|crossword|word-search|sudoku|bingo|scavenger|i-spy|puzzle/.test(slug)) return "Puzzles & Games";
  if (/addition|subtraction|multiplication|division|fraction|money|time|clock|math|number|counting|place-value/.test(slug)) return "Math";
  if (/alphabet|letter|phonic|sight|reading|writing|handwriting|cursive|tracing|spelling|story|comprehension/.test(slug)) return "Literacy";
  if (/colou?ring|color-by|paint/.test(slug)) return "Colouring";
  return "Activities";
}

const grouped = printablePages.reduce<Record<string, typeof printablePages>>((acc, p) => {
  const g = groupOf(p.slug);
  (acc[g] ||= []).push(p);
  return acc;
}, {});

const groupOrder = ["Math", "Literacy", "Puzzles & Games", "Colouring", "Holidays", "Activities"];
const groupEmoji: Record<string, string> = {
  Math: "🔢",
  Literacy: "📖",
  "Puzzles & Games": "🧩",
  Colouring: "🎨",
  Holidays: "🎃",
  Activities: "🌈",
};

export default function PrintablesHubPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-14 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            📚 Free Printables for Kids
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-5">
            {printablePages.length}+ parent-tested printables — word searches, mazes, math drills,
            holiday activities and handwriting sheets. Every sheet is a free PDF. No email, no
            signup, no paywall.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <span className="bg-black/20 px-4 py-2 rounded-full">✓ Instant PDF download</span>
            <span className="bg-black/20 px-4 py-2 rounded-full">✓ Classroom friendly</span>
            <span className="bg-black/20 px-4 py-2 rounded-full">✓ Designed by teachers</span>
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
                {grouped[group].map((p) => (
                  <Link
                    key={p.slug}
                    href={`/printables/${p.slug}`}
                    className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-purple-500 hover:bg-gray-800 transition-colors"
                  >
                    <div className="text-xs uppercase tracking-wide text-purple-400 font-semibold mb-2">
                      {group}
                    </div>
                    <div className="text-lg font-bold text-white mb-2">{p.h1}</div>
                    <div className="text-sm text-gray-400 line-clamp-3">{p.metaDescription}</div>
                    <div className="inline-block mt-3 text-xs font-semibold text-purple-400">
                      Open printable →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </section>

      {/* SEO / internal linking */}
      <section className="bg-gray-900 border-t border-gray-800 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Printable activities that actually get used
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            We keep this printables library small on purpose. Every sheet here has been used in a
            real living room or classroom before it got published — if it didn&apos;t hold a
            six-year-old&apos;s attention for at least ten minutes it got cut. You&apos;ll find
            maths drills you can actually hand to a reluctant learner, holiday puzzles that work in
            a substitute-teacher folder, and handwriting pages that don&apos;t look like they were
            made in 1998.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Looking for more? Browse our full library of{" "}
            <Link href="/worksheets" className="text-purple-400 hover:underline">
              printable worksheets
            </Link>
            , our{" "}
            <Link href="/coloring-pages" className="text-purple-400 hover:underline">
              free colouring pages
            </Link>
            , or our age-based{" "}
            <Link href="/activities/5-year-olds" className="text-purple-400 hover:underline">
              activity hubs
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
