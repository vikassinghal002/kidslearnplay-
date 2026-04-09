import type { Metadata } from "next";
import Link from "next/link";
import { worksheets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free Alphabet Worksheets — Printable PDF | JiggyJoy",
  description:
    "Free printable alphabet worksheets — trace and write A to Z, uppercase and lowercase letters, letter recognition and phonics. Download free PDFs for kids.",
};

const filteredWorksheets = worksheets.filter(
  (ws) => ws.tags.includes("alphabet") || ws.tags.includes("letters")
);

export default function AlphabetWorksheetsPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 py-14 px-4 text-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-4xl mb-3">🔤</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
            Free Alphabet Worksheets
          </h1>
          <p className="text-lg mb-6 max-w-xl mx-auto opacity-80 text-gray-900">
            Printable worksheets to trace and write A to Z, practise uppercase
            and lowercase letters, and build letter recognition and phonics
            skills. Download free PDFs — no signup needed.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <span className="bg-black/15 px-4 py-2 rounded-full">✓ 100% Free</span>
            <span className="bg-black/15 px-4 py-2 rounded-full">✓ Printable PDF</span>
            <span className="bg-black/15 px-4 py-2 rounded-full">✓ No Signup</span>
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
          <h2>Free Alphabet Worksheets</h2>
          <p>
            Learning the alphabet is the very first step on a child's reading
            journey, and our free alphabet worksheets make it engaging and
            achievable. Each sheet guides children through tracing and writing
            both uppercase and lowercase letter forms, with plenty of practice
            space for each. The worksheets are suitable for preschool and
            kindergarten learners and can be used at home, in class or during
            tutoring sessions. Print as many copies as you need — always free,
            no account required.
          </p>

          <h2>Letter Recognition Activities</h2>
          <p>
            Before children can read, they need to recognise each letter of the
            alphabet reliably — and that takes repeated, varied exposure.
            Our alphabet worksheets combine tracing with matching and
            identification activities so children see each letter in multiple
            contexts. Visual prompts pair each letter with a familiar picture,
            strengthening the connection between symbol and sound. Over time,
            consistent practice with these sheets builds the automatic letter
            recognition that fluent reading depends on.
          </p>

          <h2>Phonics &amp; Letter Sound Worksheets</h2>
          <p>
            Knowing what a letter looks like is only half the battle — children
            also need to know the sound it makes. Our phonics-focused alphabet
            worksheets introduce the most common letter sounds alongside the
            written form, helping children build the phonemic awareness that
            underpins both reading and spelling. For more phonics practice, pair
            these sheets with our free{" "}
            <Link href="/worksheets/kindergarten" className="text-blue-400 hover:underline">
              kindergarten worksheets
            </Link>
            , which extend letter sounds into simple CVC words and early sight
            words.
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
