import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import VideoEmbed from "@/components/VideoEmbed";
import {
  videos,
  getVideoBySlug,
  getRelatedVideos,
  durationToISO8601,
  formatDuration,
  youtubeThumbnailUrl,
  isPlaceholderVideo,
  VIDEO_KIND_LABELS,
} from "@/lib/videos";
import {
  getGameBySlug,
  getWorksheetBySlug,
  getCategoryBySlug,
} from "@/lib/data";

const BASE_URL = "https://www.jiggyjoy.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return videos.map((v) => ({ slug: v.id }));
}

export const dynamicParams = false;

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) return {};

  const canonical = `${BASE_URL}/videos/${video.id}`;
  const thumbUrl = isPlaceholderVideo(video)
    ? `${BASE_URL}/thumbnail/games/${video.relatedSlug ?? "snake"}`
    : youtubeThumbnailUrl(video.youtubeId);

  return {
    title: `${video.title} — Free Kids Video — JiggyJoy`,
    description: video.description,
    keywords: [
      "kids learning video",
      "free educational video",
      VIDEO_KIND_LABELS[video.kind].toLowerCase(),
      video.title.toLowerCase(),
    ],
    alternates: { canonical },
    openGraph: {
      title: video.title,
      description: video.description,
      url: canonical,
      type: "video.other",
      siteName: "JiggyJoy",
      videos: [
        {
          url: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`,
          width: 1280,
          height: 720,
        },
      ],
      images: [
        {
          url: thumbUrl,
          width: 1280,
          height: 720,
          alt: video.title,
        },
      ],
    },
    twitter: {
      card: "player",
      title: video.title,
      description: video.description,
      images: [thumbUrl],
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function VideoPage({ params }: Props) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) notFound();

  const relatedVideos = getRelatedVideos(video.id, 3);

  // Resolve the linked game / coloring / worksheet for the CTA.
  let cta: { label: string; href: string; subtitle: string; icon: string } | null = null;
  if (video.relatedType === "game" && video.relatedSlug) {
    const g = getGameBySlug(video.relatedSlug);
    if (g) {
      cta = {
        label: `Play ${g.title.split("—")[0].trim()}`,
        href: `/games/${g.slug}`,
        subtitle: "Play the free game featured in this video",
        icon: "🎮",
      };
    }
  } else if (video.relatedType === "worksheet" && video.relatedSlug) {
    const w = getWorksheetBySlug(video.relatedSlug);
    if (w) {
      cta = {
        label: `Print ${w.title}`,
        href: `/worksheets/${w.slug}`,
        subtitle: "Get the free worksheet from this video",
        icon: "📄",
      };
    }
  } else if (video.relatedType === "coloring" && video.relatedSlug) {
    const c = getCategoryBySlug(video.relatedSlug);
    if (c) {
      cta = {
        label: `Browse ${c.title}`,
        href: `/coloring-pages/${c.slug}`,
        subtitle: "Print the coloring pages from this video",
        icon: "🎨",
      };
    }
  }

  const canonical = `${BASE_URL}/videos/${video.id}`;
  const thumbUrl = isPlaceholderVideo(video)
    ? `${BASE_URL}/thumbnail/games/${video.relatedSlug ?? "snake"}`
    : youtubeThumbnailUrl(video.youtubeId);

  // ── JSON-LD ─────────────────────────────────────────────────────────────
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: thumbUrl,
    uploadDate: video.publishedAt,
    duration: durationToISO8601(video.durationSec),
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`,
    url: canonical,
    publisher: {
      "@type": "Organization",
      name: "JiggyJoy",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/icon.png` },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Videos", item: `${BASE_URL}/videos` },
      { "@type": "ListItem", position: 3, name: video.title, item: canonical },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Script
        id="ld-video-object"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <Script
        id="ld-video-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-gray-800 bg-gray-900 px-4 py-3 text-sm text-gray-400">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/videos" className="hover:text-white">Videos</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-200">{video.title}</span>
        </div>
      </div>

      {/* Main player + content */}
      <section className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="overflow-hidden rounded-3xl border border-gray-800 bg-black shadow-2xl">
          <VideoEmbed
            youtubeId={video.youtubeId}
            title={video.title}
            showTitleOverlay={false}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            {VIDEO_KIND_LABELS[video.kind]}
          </span>
          <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-gray-300">
            ⏱ {formatDuration(video.durationSec)}
          </span>
          <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-gray-300">
            📅 {new Date(video.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-4xl">
          {video.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-300 md:text-lg">
          {video.description}
        </p>

        {/* CTA to the featured game / worksheet / coloring */}
        {cta && (
          <Link
            href={cta.href}
            className="mt-6 inline-flex w-full items-center gap-4 rounded-2xl border border-purple-600/50 bg-gradient-to-br from-purple-700 via-fuchsia-600 to-pink-600 p-5 shadow-xl transition-transform hover:scale-[1.02] sm:w-auto"
          >
            <span className="text-4xl">{cta.icon}</span>
            <span className="flex flex-col text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                {cta.subtitle}
              </span>
              <span className="text-lg font-bold text-white">
                {cta.label} →
              </span>
            </span>
          </Link>
        )}
      </section>

      {/* Related videos */}
      {relatedVideos.length > 0 && (
        <section className="border-t border-gray-800 bg-gray-900 px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-2xl font-bold text-white">More Videos</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedVideos.map((rv) => (
                <article
                  key={rv.id}
                  className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 transition-colors hover:border-red-600/60"
                >
                  <Link href={`/videos/${rv.id}`}>
                    <VideoEmbed
                      youtubeId={rv.youtubeId}
                      title={rv.title}
                      showTitleOverlay={false}
                    />
                  </Link>
                  <div className="p-4">
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <span className="text-red-400">{VIDEO_KIND_LABELS[rv.kind]}</span>
                      <span>{formatDuration(rv.durationSec)}</span>
                    </div>
                    <Link href={`/videos/${rv.id}`}>
                      <h3 className="line-clamp-2 text-base font-bold text-white hover:text-red-300">
                        {rv.title}
                      </h3>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/videos"
                className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-bold text-white hover:bg-purple-500"
              >
                See all videos →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
