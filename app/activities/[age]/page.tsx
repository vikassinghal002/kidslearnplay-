import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  activityPages,
  getActivityPageBySlug,
} from "@/lib/programmaticContent";
import {
  games,
  worksheets,
  coloringCategories,
  getGameBySlug,
  getWorksheetBySlug,
  getCategoryBySlug,
} from "@/lib/data";

const BASE_URL = "https://www.jiggyjoy.com";

type Props = { params: Promise<{ age: string }> };

// ── Static params ──────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return activityPages.map((p) => ({ age: p.slug }));
}

export const dynamicParams = false;

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { age } = await params;
  const page = getActivityPageBySlug(age);
  if (!page) return {};

  const canonical = `${BASE_URL}/activities/${page.slug}`;

  return {
    title: page.title,
    description: page.metaDescription,
    keywords: [page.keyword, "free activities for kids", "kids learning", "free online activities"],
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
export default async function ActivityAgePage({ params }: Props) {
  const { age } = await params;
  const page = getActivityPageBySlug(age);
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

  // Internal link footer: 5 other age pages
  const otherAges = activityPages.filter((p) => p.slug !== page.slug).slice(0, 6);

  // ── JSON-LD ──
  const canonical = `${BASE_URL}/activities/${page.slug}`;

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
      { "@type": "ListItem", position: 2, name: "Activities", item: `${BASE_URL}/activities` },
      { "@type": "ListItem", position: 3, name: page.h1, item: canonical },
    ],
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* JSON-LD */}
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
      <section className="bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 py-14 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-white/80 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <span className="text-white">Activities</span>
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
            <span className="bg-black/20 px-4 py-2 rounded-full">✓ 100% Free</span>
            <span className="bg-black/20 px-4 py-2 rounded-full">✓ No Signup</span>
            <span className="bg-black/20 px-4 py-2 rounded-full">✓ Works on Any Device</span>
          </div>
        </div>
      </section>

      {/* Intro copy */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-invert prose-lg max-w-none">
          {page.intro.map((para, i) => (
            <p key={i} className="text-gray-300 leading-relaxed mb-5">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Linked games */}
      {linkedGames.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Games for {page.slug.replace(/-/g, " ")}
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
                <div className="text-xs text-gray-500 mt-3">
                  Ages {g.ageRange} · {g.difficulty}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Linked worksheets */}
      {linkedWorksheets.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Printable Worksheets
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

      {/* Linked coloring categories */}
      {linkedCategories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Colouring Pages to Print
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
                <span className="text-purple-400 group-open:rotate-45 transition-transform">+</span>
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
            Activities for Other Ages
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {otherAges.map((p) => (
              <Link
                key={p.slug}
                href={`/activities/${p.slug}`}
                className="bg-gray-800 hover:bg-purple-900 border border-gray-700 hover:border-purple-500 rounded-xl px-4 py-3 text-sm font-medium text-white text-center transition-colors"
              >
                {p.slug.replace(/-/g, " ")}
              </Link>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <Link
              href="/games"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white"
            >
              <div className="font-bold mb-1">All Games →</div>
              <div className="text-gray-400">Browse every free game on JiggyJoy</div>
            </Link>
            <Link
              href="/worksheets"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white"
            >
              <div className="font-bold mb-1">All Worksheets →</div>
              <div className="text-gray-400">Free printable PDFs for every grade</div>
            </Link>
            <Link
              href="/coloring-pages"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white"
            >
              <div className="font-bold mb-1">All Colouring Pages →</div>
              <div className="text-gray-400">Thousands of free printable colouring sheets</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
