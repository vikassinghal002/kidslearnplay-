import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  coloringTopicPages,
  getColoringTopicBySlug,
} from "@/lib/programmaticContent";
import {
  getGameBySlug,
  getCategoryBySlug,
} from "@/lib/data";
import { getRelatedLinks } from "@/lib/internalLinks";

const BASE_URL = "https://www.jiggyjoy.com";

type Props = { params: Promise<{ slug: string }> };

// ── Static params ──────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return coloringTopicPages.map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getColoringTopicBySlug(slug);
  if (!page) return {};

  const canonical = `${BASE_URL}/coloring-pages/topics/${page.slug}`;

  return {
    title: page.title,
    description: page.metaDescription,
    keywords: [
      page.keyword,
      "coloring pages",
      "printable coloring pages",
      "free coloring pages",
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
export default async function ColoringTopicPage({ params }: Props) {
  const { slug } = await params;
  const page = getColoringTopicBySlug(slug);
  if (!page) notFound();

  const linkedCategories = page.linkedColoringCategorySlugs
    .map((s) => getCategoryBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const linkedGames = page.linkedGameSlugs
    .map((s) => getGameBySlug(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  const otherTopics = coloringTopicPages
    .filter((t) => t.slug !== page.slug)
    .slice(0, 8);

  // Topical cluster links
  const relatedLinks = getRelatedLinks({
    pageType: "coloring-topic",
    slug: page.slug,
    keyword: page.keyword,
    limit: 12,
  });

  const canonical = `${BASE_URL}/coloring-pages/topics/${page.slug}`;

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
      { "@type": "ListItem", position: 2, name: "Coloring Pages", item: `${BASE_URL}/coloring-pages` },
      { "@type": "ListItem", position: 3, name: page.h1, item: canonical },
    ],
  };

  return (
    <div className="bg-white min-h-screen">
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
      <section className="bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 py-14 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-white/80 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <Link href="/coloring-pages" className="hover:text-white">Coloring Pages</Link>
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
            <span className="bg-black/20 px-4 py-2 rounded-full">Free to print</span>
            <span className="bg-black/20 px-4 py-2 rounded-full">No signup</span>
            <span className="bg-black/20 px-4 py-2 rounded-full">Instant download</span>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {page.intro.map((para, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-5">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Linked coloring categories — the main payload */}
      {linkedCategories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Browse Coloring Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {linkedCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/coloring-pages/${c.slug}`}
                className={`${c.color} rounded-2xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-sm`}
              >
                <span className="text-5xl">{c.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{c.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{c.description}</p>
                  <span className="inline-block text-xs bg-white/60 text-gray-700 px-3 py-1 rounded-full font-medium">
                    {c.pages.length} pages →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Suggested games */}
      {linkedGames.length > 0 && (
        <section className="bg-gray-50 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Take a Break — Try These Free Games
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {linkedGames.map((g) => (
                <Link
                  key={g.slug}
                  href={`/games/${g.slug}`}
                  className="block bg-white border border-gray-200 rounded-2xl p-5 hover:border-pink-400 hover:shadow-md transition-all"
                >
                  <div className="text-xs uppercase tracking-wide text-pink-500 font-semibold mb-2">
                    {g.category}
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-2">{g.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-3">{g.description}</div>
                  <div className="text-xs text-gray-500 mt-3">
                    Ages {g.ageRange} · {g.difficulty}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related resources — topical cluster links */}
      {relatedLinks.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            More to explore
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 hover:border-pink-400 hover:shadow-sm transition-all"
              >
                <span className="text-sm md:text-base font-semibold text-gray-900 pr-3">
                  {l.label}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-pink-600 bg-pink-50 border border-pink-200 rounded px-2 py-1">
                  {l.type === "learn" ? "GUIDE" : l.type === "activity" ? "ACTIVITY" : l.type.toUpperCase()}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {page.faqs.map((f, i) => (
            <details
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-5 group"
            >
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>{f.question}</span>
                <span className="text-pink-500 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-gray-700 leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Internal linking footer */}
      <section className="bg-gray-100 border-t border-gray-200 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            More Coloring Topics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {otherTopics.map((t) => (
              <Link
                key={t.slug}
                href={`/coloring-pages/topics/${t.slug}`}
                className="bg-white hover:bg-pink-50 border border-gray-200 hover:border-pink-400 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 transition-colors"
              >
                {t.h1}
              </Link>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <Link
              href="/coloring-pages"
              className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900"
            >
              <div className="font-bold mb-1">All Coloring Pages →</div>
              <div className="text-gray-500">Every category on JiggyJoy</div>
            </Link>
            <Link
              href="/games"
              className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900"
            >
              <div className="font-bold mb-1">All Games →</div>
              <div className="text-gray-500">Free educational games for every age</div>
            </Link>
            <Link
              href="/printables"
              className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900"
            >
              <div className="font-bold mb-1">Printables →</div>
              <div className="text-gray-500">Activity packs, charts and worksheets</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
