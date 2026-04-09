import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  freeWorksheetTopics,
  getFreeWorksheetTopicBySlug,
} from "@/lib/programmaticContent";
import {
  getGameBySlug,
  getWorksheetBySlug,
} from "@/lib/data";

const BASE_URL = "https://www.jiggyjoy.com";

type Props = { params: Promise<{ topic: string }> };

// ── Static params ──────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return freeWorksheetTopics.map((p) => ({ topic: p.slug }));
}

export const dynamicParams = false;

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const page = getFreeWorksheetTopicBySlug(topic);
  if (!page) return {};

  const canonical = `${BASE_URL}/worksheets/free/${page.slug}`;

  return {
    title: page.title,
    description: page.metaDescription,
    keywords: [page.keyword, "free printable worksheets", "printable PDF", "homeschool worksheets"],
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.metaDescription,
    },
  };
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function FreeWorksheetTopicPage({ params }: Props) {
  const { topic } = await params;
  const page = getFreeWorksheetTopicBySlug(topic);
  if (!page) notFound();

  const linkedWorksheets = page.linkedWorksheetSlugs
    .map((s) => getWorksheetBySlug(s))
    .filter((w): w is NonNullable<typeof w> => Boolean(w));

  const linkedGames = page.linkedGameSlugs
    .map((s) => getGameBySlug(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  // Internal link footer: other worksheet topics
  const otherTopics = freeWorksheetTopics.filter((p) => p.slug !== page.slug).slice(0, 6);

  const canonical = `${BASE_URL}/worksheets/free/${page.slug}`;

  // ── JSON-LD ──
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.h1,
    description: page.metaDescription,
    url: canonical,
    isPartOf: {
      "@type": "WebSite",
      name: "JiggyJoy",
      url: BASE_URL,
    },
    hasPart: linkedWorksheets.map((w) => ({
      "@type": "CreativeWork",
      name: w.title,
      url: `${BASE_URL}/worksheets/${w.slug}`,
      description: w.description,
      educationalLevel: w.grade,
      learningResourceType: "Worksheet",
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Worksheets", item: `${BASE_URL}/worksheets` },
      { "@type": "ListItem", position: 3, name: "Free Worksheets", item: `${BASE_URL}/worksheets/free` },
      { "@type": "ListItem", position: 4, name: page.h1, item: canonical },
    ],
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <Script
        id="ld-collection"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 py-14 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-white/80 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <Link href="/worksheets" className="hover:text-white">Worksheets</Link>
            {" / "}
            <span className="text-white font-medium">{page.h1}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {page.h1}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mb-6">
            {page.metaDescription}
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <span className="bg-black/20 px-4 py-2 rounded-full">✓ Free PDF</span>
            <span className="bg-black/20 px-4 py-2 rounded-full">✓ Answer Keys Included</span>
            <span className="bg-black/20 px-4 py-2 rounded-full">✓ Classroom Safe</span>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-invert prose-lg max-w-none">
          {page.intro.map((para, i) => (
            <p key={i} className="text-gray-300 leading-relaxed mb-5">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Worksheets grid */}
      {linkedWorksheets.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Download the Worksheets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {linkedWorksheets.map((w) => (
              <Link
                key={w.slug}
                href={`/worksheets/${w.slug}`}
                className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-green-500 hover:bg-gray-800 transition-colors"
              >
                <div className="text-xs uppercase tracking-wide text-green-400 font-semibold mb-2">
                  {w.grade} · {w.subject}
                </div>
                <div className="text-lg font-bold text-white mb-2">{w.title}</div>
                <div className="text-sm text-gray-400 line-clamp-3">{w.description}</div>
                <div className="inline-block mt-3 text-xs font-semibold text-green-400">
                  Open worksheet →
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Practice games */}
      {linkedGames.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Pair With These Practice Games
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {linkedGames.map((g) => (
              <Link
                key={g.slug}
                href={`/games/${g.slug}`}
                className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-purple-500 hover:bg-gray-800 transition-colors"
              >
                <div className="text-xs uppercase tracking-wide text-purple-400 font-semibold mb-2">
                  {g.category}
                </div>
                <div className="text-lg font-bold text-white mb-2">{g.title}</div>
                <div className="text-sm text-gray-400 line-clamp-3">{g.description}</div>
                <div className="text-xs text-gray-500 mt-3">Ages {g.ageRange}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {page.faqs.map((f, i) => (
            <details
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 group"
            >
              <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>{f.question}</span>
                <span className="text-green-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-gray-300 leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Internal linking footer */}
      <section className="bg-gray-900 border-t border-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            More Free Worksheet Topics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {otherTopics.map((p) => (
              <Link
                key={p.slug}
                href={`/worksheets/free/${p.slug}`}
                className="bg-gray-800 hover:bg-green-900 border border-gray-700 hover:border-green-500 rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors"
              >
                Free {p.slug.replace(/-/g, " ")} worksheets
              </Link>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <Link
              href="/worksheets"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white"
            >
              <div className="font-bold mb-1">All Worksheets →</div>
              <div className="text-gray-400">Every printable on JiggyJoy</div>
            </Link>
            <Link
              href="/games"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white"
            >
              <div className="font-bold mb-1">All Games →</div>
              <div className="text-gray-400">Free educational games</div>
            </Link>
            <Link
              href="/activities/5-year-olds"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white"
            >
              <div className="font-bold mb-1">Activities by Age →</div>
              <div className="text-gray-400">Curated hubs from age 2 to 11</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
