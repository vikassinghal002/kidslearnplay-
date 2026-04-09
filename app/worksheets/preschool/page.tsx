import type { Metadata } from "next";
import Link from "next/link";
import { worksheets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free Preschool Worksheets — Printable PDF | JiggyJoy",
  description:
    "Free printable preschool worksheets — counting, tracing, shapes, colours and alphabet. Download free PDF worksheets for 3–5 year olds. No signup needed.",
};

const filteredWorksheets = worksheets.filter(
  (ws) => ws.grade.includes("Preschool") || ws.tags.includes("preschool")
);

export default function PreschoolWorksheetsPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-4xl mb-3">🌟</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Free Preschool Worksheets
          </h1>
          <p className="text-lg mb-6 max-w-xl mx-auto opacity-90">
            Printable worksheets for 3–5 year olds covering counting, tracing,
            shapes, colours and the alphabet. Download free PDFs — no signup
            needed.
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
          <h2>Free Preschool Worksheets</h2>
          <p>
            Preschool is one of the most important windows for early learning,
            and the right worksheets make it genuinely fun. Our free preschool
            worksheets cover the core skills children aged 3–5 need — letter
            recognition, number sense, shape identification and basic tracing.
            Every sheet is designed to be completed in just a few minutes so
            little ones stay engaged from start to finish. Download, print and
            go — no account or payment required.
          </p>

          <h2>What Skills Do Preschool Worksheets Cover?</h2>
          <p>
            Our preschool worksheets target the foundational skills recommended
            by early childhood educators. Tracing worksheets build the fine
            motor control that children need before they can write independently.
            Counting and number worksheets introduce number recognition and
            one-to-one correspondence up to ten. Shape and colour worksheets
            help children learn to sort, match and describe the world around
            them. Together these activities lay the groundwork for a smooth
            transition into kindergarten.
          </p>

          <h2>Free to Download — No Signup</h2>
          <p>
            Every preschool worksheet on JiggyJoy is completely free to
            download and print at home. There are no hidden fees, no email
            sign-up and no subscription required. Simply click a worksheet,
            open the PDF and print — or use the browser print button for an
            instant preview. We believe every child deserves access to quality
            learning materials, which is why our entire library will always be
            free.
          </p>
        </div>
      </section>

      {/* Related links */}
      <section className="border-t border-gray-800 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4 justify-center">
          <Link href="/worksheets" className="text-blue-400 hover:underline">All Worksheets →</Link>
          <Link href="/worksheets/kindergarten" className="text-blue-400 hover:underline">Kindergarten Worksheets →</Link>
          <Link href="/games/math" className="text-blue-400 hover:underline">Math Games →</Link>
          <Link href="/games" className="text-blue-400 hover:underline">All Games →</Link>
        </div>
      </section>
    </div>
  );
}
