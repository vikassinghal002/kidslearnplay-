import type { Metadata } from "next";
import Link from "next/link";
import { worksheets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free Math Worksheets for Kids — Printable PDF | KidsLearnPlay",
  description:
    "Free printable math worksheets for all grades — addition, subtraction, multiplication, number bonds, counting and more. Download PDF, no signup required.",
};

const filteredWorksheets = worksheets.filter((ws) => ws.subject === "Math");

export default function MathWorksheetsPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-4xl mb-3">🔢</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Free Math Worksheets for Kids
          </h1>
          <p className="text-lg mb-6 max-w-xl mx-auto opacity-90">
            Printable math worksheets for all grades — addition, subtraction,
            multiplication, number bonds, counting and more. Download free PDFs
            instantly, no signup required.
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
          <h2>Free Math Worksheets</h2>
          <p>
            Whether your child is just starting to count or working through
            long multiplication, our free math worksheets have you covered.
            Every sheet is printable, clearly laid out and completely free to
            download — ideal for homework practice, tutoring sessions or
            keeping skills sharp over the school holidays. We cover key stages
            from preschool counting right through to upper primary multiplication
            and place value, so you can find the right challenge for any child.
          </p>

          <h2>Addition &amp; Subtraction Worksheets</h2>
          <p>
            Addition and subtraction are the building blocks of all later maths.
            Our worksheets start with simple number bonds to ten and progress
            to two- and three-digit calculations with and without regrouping.
            Each sheet gives children enough repetition to build fluency without
            feeling like a chore. Parents and teachers can use these sheets
            alongside classroom work to reinforce new concepts while confidence
            is still fresh.
          </p>

          <h2>Times Tables &amp; Multiplication Worksheets</h2>
          <p>
            Knowing the times tables by heart is one of the biggest advantages
            a child can have in primary maths, and our multiplication worksheets
            make regular practice easy. Tables run from 1 through 12 with
            answer-key versions for self-checking. For a more active approach,
            try pairing the worksheets with our free{" "}
            <Link href="/games/math" className="text-blue-400 hover:underline">
              online math games
            </Link>{" "}
            — the combination of written and game-based practice is highly
            effective for building lasting recall.
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
