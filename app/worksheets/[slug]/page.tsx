import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { worksheets, getWorksheetBySlug } from "@/lib/data";
import PrintButton from "@/components/PrintButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return worksheets.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = getWorksheetBySlug(slug);
  if (!ws) return {};
  return {
    title: `${ws.title} — Free Printable PDF`,
    description: ws.description,
    keywords: [...ws.tags, "free printable", "worksheet", "PDF download"],
  };
}

export default async function WorksheetPage({ params }: Props) {
  const { slug } = await params;
  const ws = getWorksheetBySlug(slug);
  if (!ws) notFound();

  const related = worksheets.filter((w) => w.slug !== slug && w.subject === ws.subject).slice(0, 3);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-purple-600">Home</Link>
          {" / "}
          <Link href="/worksheets" className="hover:text-purple-600">Worksheets</Link>
          {" / "}
          <span className="text-gray-800 font-medium">{ws.title}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{ws.title}</h1>
          <div className="flex gap-2 mb-4">
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">{ws.grade}</span>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{ws.subject}</span>
          </div>
          <p className="text-gray-600 mb-6">{ws.description}</p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <PrintButton />
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-green-200 text-green-700 rounded-full font-semibold hover:bg-green-50 transition-colors text-sm"
            >
              ⬇️ Download PDF — Free
            </a>
          </div>

          {/* Worksheet preview */}
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 print:border-0">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{ws.title}</h2>
              <p className="text-gray-400 text-sm">Grade: {ws.grade} | Subject: {ws.subject}</p>
              <p className="text-gray-400 text-xs mt-1">Name: _________________ Date: _________</p>
            </div>

            {ws.subject === "Math" && ws.slug === "kindergarten-math-worksheets" && (
              <div className="max-w-sm mx-auto space-y-4">
                <p className="text-sm font-semibold text-gray-700 text-center">Count and write the number:</p>
                {[["🍎🍎🍎", ""], ["⭐⭐⭐⭐⭐", ""], ["🐣🐣", ""], ["🌸🌸🌸🌸", ""]].map(([emoji, _], i) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-2xl tracking-widest">{emoji}</span>
                    <span className="text-gray-500 text-sm">=</span>
                    <div className="w-12 border-b-2 border-gray-400 h-7" />
                  </div>
                ))}
                <p className="text-sm font-semibold text-gray-700 text-center mt-4">Simple addition:</p>
                {["1 + 1 = ___", "2 + 3 = ___", "4 + 0 = ___"].map((q, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 text-lg font-mono text-gray-700">{q}</div>
                ))}
              </div>
            )}

            {ws.subject === "Math" && ws.slug === "multiplication-worksheets" && (
              <div className="max-w-sm mx-auto">
                <p className="text-sm font-semibold text-gray-700 text-center mb-4">Times Tables Practice:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[[2,3],[4,5],[3,6],[7,8],[5,9],[6,7],[8,9],[4,7]].map(([a,b], i) => (
                    <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 text-lg font-mono text-gray-700">
                      {a} × {b} = <span className="border-b-2 border-gray-400 inline-block w-10">&nbsp;</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ws.subject === "Math" && (ws.slug === "math-worksheets-grade-1" || ws.slug === "place-value-worksheets") && (
              <div className="max-w-sm mx-auto space-y-3">
                <p className="text-sm font-semibold text-gray-700 text-center mb-4">
                  {ws.slug === "place-value-worksheets" ? "Write the place value:" : "Solve the problems:"}
                </p>
                {ws.slug === "place-value-worksheets"
                  ? ["34 = ___ tens ___ ones", "57 = ___ tens ___ ones", "120 = ___ hundreds ___ tens", "209 = ___ hundreds ___ ones"].map((q, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 text-base font-mono text-gray-700">{q}</div>
                  ))
                  : ["3 + 5 = ___", "8 − 4 = ___", "7 + 2 = ___", "10 − 3 = ___", "6 + 6 = ___"].map((q, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 text-lg font-mono text-gray-700">{q}</div>
                  ))
                }
              </div>
            )}

            {ws.subject === "Writing" && ws.slug === "alphabet-worksheets" && (
              <div className="max-w-sm mx-auto space-y-4">
                <p className="text-sm font-semibold text-gray-700 text-center mb-2">Trace and write each letter:</p>
                {["Aa", "Bb", "Cc", "Dd", "Ee"].map((letter, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-purple-400 w-10">{letter}</span>
                    <div className="flex-1 border-b-2 border-dashed border-gray-300 h-8" />
                  </div>
                ))}
              </div>
            )}

            {ws.subject === "Writing" && ws.slug === "preschool-tracing-worksheets" && (
              <div className="max-w-sm mx-auto space-y-4">
                <p className="text-sm font-semibold text-gray-700 text-center mb-2">Trace the lines:</p>
                {["1 2 3 4 5", "A B C D E", "▲ ● ■ ★ ◆"].map((row, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl px-4 py-4 text-xl text-gray-300 tracking-widest font-bold text-center">
                    {row}
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-400 mt-6 text-center">
              Print this page or click <strong>Download PDF</strong> for the full worksheet
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {ws.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="bg-green-50 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Worksheet Details</h3>
            <dl className="text-sm space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Grade</dt>
                <dd className="font-medium text-gray-800">{ws.grade}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Subject</dt>
                <dd className="font-medium text-gray-800">{ws.subject}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Format</dt>
                <dd className="font-medium text-gray-800">Printable PDF</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Cost</dt>
                <dd className="font-bold text-green-600">Free!</dd>
              </div>
            </dl>
          </div>

          {related.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">More {ws.subject} Worksheets</h3>
              <div className="space-y-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/worksheets/${r.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                  >
                    <span className="text-2xl">📋</span>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{r.title}</div>
                      <div className="text-xs text-gray-400">{r.grade}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link
            href="/worksheets"
            className="block text-center px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            All Worksheets →
          </Link>
        </aside>
      </div>
    </div>
  );
}
