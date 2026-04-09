import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import VideosGrid from "@/components/VideosGrid";
import {
  videos,
  durationToISO8601,
  youtubeThumbnailUrl,
  isPlaceholderVideo,
} from "@/lib/videos";
import {
  getGameBySlug,
  getWorksheetBySlug,
  getCategoryBySlug,
} from "@/lib/data";

const BASE_URL = "https://www.jiggyjoy.com";

// ─── Channel link ────────────────────────────────────────────────────────────
//
// IMPORTANT: replace this with the real JiggyJoy YouTube channel URL once
// the channel has been created. Until then, the CTA buttons all point at
// a search for "jiggyjoy" on YouTube as a graceful interim fallback.
export const YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/results?search_query=jiggyjoy";

export const metadata: Metadata = {
  title: "Free Kids Learning Videos — JiggyJoy",
  description:
    "Watch free kids learning videos — math videos for kids, game walkthroughs, coloring speed-paints and tutorials. New free educational videos every week from JiggyJoy.",
  keywords: [
    "kids learning videos",
    "math videos for kids",
    "free educational videos",
    "kids game tutorials",
    "coloring videos for kids",
    "kids youtube channel",
  ],
  alternates: { canonical: `${BASE_URL}/videos` },
  openGraph: {
    title: "Free Kids Learning Videos — JiggyJoy",
    description:
      "Watch free kids learning videos — math, games, coloring and tutorials. New free educational videos every week from JiggyJoy.",
    url: `${BASE_URL}/videos`,
    type: "website",
    siteName: "JiggyJoy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Kids Learning Videos — JiggyJoy",
    description:
      "Free educational videos for kids — math, games, coloring and tutorials.",
  },
};

// ─── Resolve related-content labels for each video ──────────────────────────
function buildRelatedLabels(): Record<string, { label: string; href: string }> {
  const out: Record<string, { label: string; href: string }> = {};
  for (const v of videos) {
    if (!v.relatedSlug || !v.relatedType) continue;
    if (out[v.relatedSlug]) continue;
    if (v.relatedType === "game") {
      const g = getGameBySlug(v.relatedSlug);
      if (g) out[v.relatedSlug] = { label: g.title, href: `/games/${g.slug}` };
    } else if (v.relatedType === "worksheet") {
      const w = getWorksheetBySlug(v.relatedSlug);
      if (w) out[v.relatedSlug] = { label: w.title, href: `/worksheets/${w.slug}` };
    } else if (v.relatedType === "coloring") {
      const c = getCategoryBySlug(v.relatedSlug);
      if (c) out[v.relatedSlug] = { label: c.title, href: `/coloring-pages/${c.slug}` };
    }
  }
  return out;
}

export default function VideosHubPage() {
  const relatedLabels = buildRelatedLabels();

  // ── JSON-LD: ItemList of VideoObject entries ──
  const videoListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "JiggyJoy Kids Learning Videos",
    description:
      "Free educational videos for kids — game walkthroughs, math tutorials, coloring speed-paints and more.",
    itemListElement: videos.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: v.title,
        description: v.description,
        thumbnailUrl: isPlaceholderVideo(v)
          ? `${BASE_URL}/thumbnail/games/${v.relatedSlug ?? "snake"}`
          : youtubeThumbnailUrl(v.youtubeId),
        uploadDate: v.publishedAt,
        contentUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
        duration: durationToISO8601(v.durationSec),
        url: `${BASE_URL}/videos/${v.id}`,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Videos", item: `${BASE_URL}/videos` },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Script
        id="ld-videos-list"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoListJsonLd) }}
      />
      <Script
        id="ld-videos-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-red-600 via-rose-600 to-purple-700 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <nav className="mb-4 text-sm text-white/80">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <span className="text-white">Videos</span>
          </nav>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-1.5 text-sm font-semibold">
            <span className="text-2xl">📺</span>
            <span>JiggyJoy on YouTube</span>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-6xl">
            Free Kids Learning Videos
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/95 md:text-xl">
            Game walkthroughs, math tutorials, coloring speed-paints and more.
            New videos every week — all 100% free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-bold text-red-600 shadow-xl transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-red-600" aria-hidden="true">
                <path d="M23 12s0-3.7-.5-5.5c-.3-1-1.1-1.8-2.1-2C18.6 4 12 4 12 4s-6.6 0-8.4.5c-1 .2-1.8 1-2.1 2C1 8.3 1 12 1 12s0 3.7.5 5.5c.3 1 1.1 1.8 2.1 2C5.4 20 12 20 12 20s6.6 0 8.4-.5c1-.2 1.8-1 2.1-2 .5-1.8.5-5.5.5-5.5zM10 15.5v-7l6 3.5-6 3.5z" />
              </svg>
              Subscribe to JiggyJoy on YouTube
            </a>
            <span className="rounded-full bg-black/25 px-4 py-2 text-sm font-semibold">
              ✓ {videos.length} videos and growing
            </span>
          </div>
        </div>
      </section>

      {/* ── Videos grid ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <VideosGrid videos={videos} relatedLabels={relatedLabels} />
      </section>

      {/* ── SEO content block ─────────────────────────────────────────── */}
      <section className="border-t border-gray-800 bg-gray-900 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold text-white">
            About Our Free Kids Learning Videos
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-300">
            <p>
              JiggyJoy is building a library of <strong>free kids learning videos</strong>{" "}
              that pair perfectly with our{" "}
              <Link href="/games" className="text-purple-300 hover:underline">
                free online games
              </Link>
              ,{" "}
              <Link href="/coloring-pages" className="text-purple-300 hover:underline">
                printable coloring pages
              </Link>{" "}
              and{" "}
              <Link href="/worksheets" className="text-purple-300 hover:underline">
                worksheets
              </Link>
              . Every video is short, ad-light and made for kids. Whether
              you&apos;re looking for <strong>math videos for kids</strong>, game
              walkthroughs or coloring speed-paints, you&apos;ll find them here.
            </p>
            <p>
              Each video page includes a direct link to the activity it
              features, so kids can watch a tutorial and then jump straight
              into playing or printing.
            </p>
            <p>
              Want updates when new videos drop?{" "}
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-red-400 hover:text-red-300"
              >
                Subscribe to JiggyJoy on YouTube
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
