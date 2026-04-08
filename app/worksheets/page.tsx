import type { Metadata } from "next";
import Link from "next/link";
import { worksheets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free Printable Worksheets for Kids",
  description:
    "Free printable worksheets for kids — math worksheets, alphabet worksheets, kindergarten and preschool worksheets. Download and print instantly!",
  keywords: [
    "free printable worksheets",
    "kindergarten worksheets",
    "preschool worksheets",
    "math worksheets",
    "multiplication worksheets",
    "free worksheets for kids",
  ],
};

const subjects = [...new Set(worksheets.map((w) => w.subject))];
const subjectEmojis: Record<string, string> = {
  Math: "🔢",
  Writing: "✏️",
  Reading: "📖",
  Science: "🔬",
};

export default function WorksheetsPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            📄 Free Printable Worksheets
          </h1>
          <p className="text-lg text-white/90">
            {worksheets.length}+ free worksheets for preschool, kindergarten and primary school.
            Download and print — no signup needed!
          </p>
        </div>
      </section>

      {/* Worksheets by subject */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {subjects.map((subject) => {
          const subjectWs = worksheets.filter((w) => w.subject === subject);
          return (
            <div key={subject} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span>{subjectEmojis[subject] ?? "📋"}</span>
                <span>{subject} Worksheets</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectWs.map((ws) => (
                  <Link
                    key={ws.slug}
                    href={`/worksheets/${ws.slug}`}
                    className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-green-300 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">📋</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{ws.title}</h3>
                        <p className="text-sm text-gray-500 mb-3 leading-relaxed">{ws.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            {ws.grade}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            Free PDF
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-green-600 text-sm font-semibold">Download free →</div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* SEO block */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Free Worksheets for Teachers and Parents</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Our <strong>free printable worksheets</strong> are designed by educators for use at home
            and in the classroom. Each worksheet is available as a free PDF download with no
            registration required.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            We cover core subjects including maths worksheets (
            <Link href="/worksheets/multiplication-worksheets" className="text-purple-600 hover:underline">
              multiplication
            </Link>,{" "}
            <Link href="/worksheets/kindergarten-math-worksheets" className="text-purple-600 hover:underline">
              kindergarten math
            </Link>), writing worksheets (
            <Link href="/worksheets/alphabet-worksheets" className="text-purple-600 hover:underline">
              alphabet tracing
            </Link>) and more. New worksheets are added regularly.
          </p>
        </div>
      </section>
    </div>
  );
}
