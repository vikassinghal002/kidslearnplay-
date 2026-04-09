import type { Metadata } from "next";
import Link from "next/link";
import { worksheets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free Tracing Worksheets for Kids — Printable PDF | JiggyJoy",
  description:
    "Free printable tracing worksheets — letter tracing, number tracing and shape tracing for preschool and kindergarten. Build handwriting skills with free PDFs.",
};

const filteredWorksheets = worksheets.filter(
  (ws) => ws.tags.includes("tracing") || ws.subject === "Writing"
);

export default function TracingWorksheetsPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-4xl mb-3">✏️</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Free Tracing Worksheets for Kids
          </h1>
          <p className="text-lg mb-6 max-w-xl mx-auto opacity-90">
            Printable letter tracing, number tracing and shape tracing
            worksheets for preschool and kindergarten. Build handwriting skills
            with free PDFs — no signup needed.
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
          <h2>Free Tracing Worksheets</h2>
          <p>
            Tracing is one of the most effective ways to develop a young
            child's fine motor skills and prepare them for independent writing.
            Our free tracing worksheets guide little hands along dotted lines
            for letters, numbers and simple shapes — giving children the
            muscle memory they need before pencil control becomes second nature.
            Each sheet is designed with generous line spacing so even a
            three-year-old can follow the path confidently. Download, print and
            let them trace — completely free.
          </p>

          <h2>Letter Tracing Worksheets</h2>
          <p>
            Learning to write the alphabet starts with tracing. Our letter
            tracing worksheets present each letter with clear dotted guidelines
            for both uppercase and lowercase forms. Children trace several
            examples of each letter, then have guided space to attempt writing
            it on their own. This gradual release approach — trace, then try —
            mirrors best practice in early childhood handwriting instruction and
            helps letters stick in a child's memory through both visual and
            muscle-memory pathways.
          </p>

          <h2>Number Tracing Worksheets</h2>
          <p>
            Recognising numerals and writing them correctly are two distinct
            skills, and our number tracing worksheets build both at once.
            Children trace numerals 0–9 with directional arrows showing the
            correct stroke order, which prevents the number-reversal habits
            that can be hard to break later. Pairing number tracing with our
            free{" "}
            <Link href="/worksheets/math" className="text-blue-400 hover:underline">
              math worksheets
            </Link>{" "}
            gives children a complete early numeracy practice kit they can work
            through at home every day.
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
