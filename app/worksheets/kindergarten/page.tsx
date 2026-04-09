import type { Metadata } from "next";
import Link from "next/link";
import { worksheets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free Kindergarten Worksheets — Printable PDF | JiggyJoy",
  description:
    "Free printable kindergarten worksheets — maths, reading, writing and phonics worksheets for 5–6 year olds. Download free PDFs instantly.",
};

const filteredWorksheets = worksheets.filter(
  (ws) => ws.grade.includes("Kindergarten") || ws.tags.includes("kindergarten")
);

export default function KindergartenWorksheetsPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-4xl mb-3">🎒</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Free Kindergarten Worksheets
          </h1>
          <p className="text-lg mb-6 max-w-xl mx-auto opacity-90">
            Printable maths, reading, writing and phonics worksheets for 5–6
            year olds. Instantly download free PDFs — no signup required.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <span className="bg-white/20 px-4 py-2 rounded-full">✓ 100% Free</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">✓ Printable PDF</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">✓ No Signup</span>
          </div>
        </div>
      </section>

      {/* Worksheet grid */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Available Worksheets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorksheets.map((ws) => (
            <Link
              key={ws.slug}
              href={`/worksheets/${ws.slug}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors group"
            >
              <div className="text-2xl mb-2">📄</div>
              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                {ws.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">{ws.description}</p>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">{ws.grade}</span>
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">{ws.subject}</span>
              </div>
            </Link>
          ))}
        </div>
        {filteredWorksheets.length === 0 && (
          <p className="text-gray-400">More worksheets coming soon!</p>
        )}
      </section>

      {/* SEO copy */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="prose prose-invert max-w-none">
          <h2>Free Kindergarten Worksheets</h2>
          <p>
            Kindergarten is where children make the leap from play-based
            learning to structured skills — and the right worksheets make that
            transition easier. Our free kindergarten worksheets cover maths,
            early reading, writing practice and phonics, all designed for the
            5–6 age group. Each sheet is clear, uncluttered and fun so children
            stay focused without feeling overwhelmed. Print as many copies as
            you need — completely free.
          </p>

          <h2>Kindergarten Math Worksheets</h2>
          <p>
            Math in kindergarten is all about building number confidence.
            Our kindergarten math worksheets cover counting objects up to 20,
            comparing quantities, recognising numerals and tackling simple
            addition and subtraction. The activities use pictures and familiar
            objects so children can connect abstract numbers to the real world.
            Regular short practice sessions with these sheets help children
            arrive at Grade 1 fully prepared.
          </p>

          <h2>Kindergarten Reading &amp; Phonics Worksheets</h2>
          <p>
            Learning to read starts with phonics — the understanding that
            letters represent sounds. Our kindergarten reading worksheets
            introduce letter-sound relationships, CVC word patterns and early
            sight words in a format that young learners can handle independently
            or with a parent. Pairing these sheets with our free alphabet
            worksheets gives children a complete early literacy toolkit they can
            use at home every day.
          </p>
        </div>
      </section>

      {/* Related links */}
      <section className="border-t border-gray-800 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4 justify-center">
          <Link href="/worksheets" className="text-blue-400 hover:underline">All Worksheets →</Link>
          <Link href="/games/math" className="text-blue-400 hover:underline">Math Games →</Link>
          <Link href="/games/kindergarten" className="text-blue-400 hover:underline">Kindergarten Games →</Link>
          <Link href="/games" className="text-blue-400 hover:underline">All Games →</Link>
        </div>
      </section>
    </div>
  );
}
