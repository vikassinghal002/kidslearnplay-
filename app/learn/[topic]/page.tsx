import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  learnTopics,
  getLearnTopicBySlug,
} from "@/lib/programmaticContent";
import {
  getGameBySlug,
  getWorksheetBySlug,
  getCategoryBySlug,
} from "@/lib/data";
import { getRelatedLinks } from "@/lib/internalLinks";

const BASE_URL = "https://www.jiggyjoy.com";

type Props = { params: Promise<{ topic: string }> };

// ── Static params ──────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return learnTopics.map((t) => ({ topic: t.slug }));
}

export const dynamicParams = false;

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const page = getLearnTopicBySlug(topic);
  if (!page) return {};

  const canonical = `${BASE_URL}/learn/${page.slug}`;

  return {
    title: page.title,
    description: page.metaDescription,
    keywords: [
      page.keyword,
      "how to teach",
      "parent teaching guide",
      "homeschool teaching",
    ],
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
export default async function LearnTopicPage({ params }: Props) {
  const { topic } = await params;
  const page = getLearnTopicBySlug(topic);
  if (!page) notFound();

  const linkedGames = page.linkedGameSlugs
    .map((s) => getGameBySlug(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  const linkedWorksheets = page.linkedWorksheetSlugs
    .map((s) => getWorksheetBySlug(s))
    .filter((w): w is NonNullable<typeof w> => Boolean(w));

  const linkedCategories = page.linkedColoringCategorySlugs
    .map((s) => getCategoryBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const otherTopics = learnTopics
    .filter((t) => t.slug !== page.slug)
    .slice(0, 8);

  // Topical cluster links (Lever — SEO internal linking)
  const relatedLinks = getRelatedLinks({
    pageType: "learn",
    slug: page.slug,
    keyword: page.keyword,
    limit: 12,
  });

  const canonical = `${BASE_URL}/learn/${page.slug}`;

  // ── JSON-LD ──
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.metaDescription,
    author: { "@type": "Organization", name: "JiggyJoy" },
    publisher: {
      "@type": "Organization",
      name: "JiggyJoy",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/icon.png` },
    },
    mainEntityOfPage: canonical,
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
      { "@type": "ListItem", position: 2, name: "Learn", item: `${BASE_URL}/learn` },
      { "@type": "ListItem", position: 3, name: page.h1, item: canonical },
    ],
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <Script
        id="ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
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
      <section className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 py-14 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-white/80 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <Link href="/learn" className="hover:text-white">Learn</Link>
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
            <span className="bg-black/20 px-4 py-2 rounded-full">Parent & teacher guide</span>
            <span className="bg-black/20 px-4 py-2 rounded-full">Linked worksheets & games</span>
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

      {/* Recommended games */}
      {linkedGames.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Practise With These Free Games
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {linkedGames.map((g) => (
              <Link
                key={g.slug}
                href={`/games/${g.slug}`}
                className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-sky-500 hover:bg-gray-800 transition-colors"
              >
                <div className="text-xs uppercase tracking-wide text-sky-400 font-semibold mb-2">
                  {g.category}
                </div>
                <div className="text-lg font-bold text-white mb-2">{g.title}</div>
                <div className="text-sm text-gray-400 line-clamp-3">{g.description}</div>
                <div className="text-xs text-gray-500 mt-3">
                  Ages {g.ageRange} · {g.difficulty}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recommended worksheets */}
      {linkedWorksheets.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Printable Worksheets to Go With This Guide
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
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recommended coloring categories */}
      {linkedCategories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Colouring Pages That Support This Topic
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {linkedCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/coloring-pages/${c.slug}`}
                className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-pink-500 hover:bg-gray-800 transition-colors"
              >
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="text-lg font-bold text-white mb-2">{c.title}</div>
                <div className="text-sm text-gray-400 line-clamp-3">{c.description}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related resources — topical cluster links */}
      {relatedLinks.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            More learning ideas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-sky-500 hover:bg-gray-800 transition-colors"
              >
                <span className="text-sm md:text-base font-semibold text-white pr-3">
                  {l.label}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-sky-300 bg-sky-500/10 border border-sky-500/30 rounded px-2 py-1">
                  {l.type === "learn" ? "GUIDE" : l.type === "activity" ? "ACTIVITY" : l.type.toUpperCase()}
                </span>
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
                <span className="text-sky-400 group-open:rotate-45 transition-transform">+</span>
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
            More Teaching Guides
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {otherTopics.map((t) => (
              <Link
                key={t.slug}
                href={`/learn/${t.slug}`}
                className="bg-gray-800 hover:bg-sky-900 border border-gray-700 hover:border-sky-500 rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors"
              >
                {t.h1}
              </Link>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <Link
              href="/learn"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white"
            >
              <div className="font-bold mb-1">All Guides →</div>
              <div className="text-gray-400">The full JiggyJoy teaching library</div>
            </Link>
            <Link
              href="/worksheets"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white"
            >
              <div className="font-bold mb-1">All Worksheets →</div>
              <div className="text-gray-400">Printable PDFs by grade and subject</div>
            </Link>
            <Link
              href="/games"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white"
            >
              <div className="font-bold mb-1">All Games →</div>
              <div className="text-gray-400">Free educational games for every age</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
