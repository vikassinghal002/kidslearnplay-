"use client";

// Lite YouTube embed.
//
// Renders a clickable preview image with a play-button overlay. The real
// <iframe> is only mounted on the first click — until then, this component
// adds zero JavaScript / network cost beyond a single thumbnail image.
// This pattern gives us ~95% of the SEO/UX benefit of a real embed with ~0%
// of the page weight, which is critical for Core Web Vitals on a content
// site that may eventually embed dozens of videos per page (compilations,
// related videos, etc.).

import { useState } from "react";

type Props = {
  /** The YouTube video ID (the bit after `?v=`). */
  youtubeId: string;
  /** Display title — used for the alt text and aria-label. */
  title: string;
  /**
   * Custom thumbnail URL. If omitted we fall back to the YouTube
   * `maxresdefault.jpg` for the given `youtubeId`. Pass an internal
   * `/thumbnail/games/<slug>` URL to use a JiggyJoy-branded fallback.
   */
  thumbnailUrl?: string;
  /** Optional className for the outer wrapper. */
  className?: string;
  /** Show the title overlay on the thumbnail. Defaults to true. */
  showTitleOverlay?: boolean;
};

export default function VideoEmbed({
  youtubeId,
  title,
  thumbnailUrl,
  className = "",
  showTitleOverlay = true,
}: Props) {
  const [activated, setActivated] = useState(false);

  // If the YouTube ID is still a placeholder, render a clear "coming soon"
  // state instead of a broken iframe.
  const isPlaceholder = youtubeId.startsWith("PLACEHOLDER_");

  const fallbackThumb = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
  const thumb = thumbnailUrl ?? (isPlaceholder ? "" : fallbackThumb);

  // ── Activated state: real iframe ─────────────────────────────────────────
  if (activated && !isPlaceholder) {
    return (
      <div className={`relative aspect-video overflow-hidden rounded-2xl bg-black ${className}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  // ── Default state: clickable preview ─────────────────────────────────────
  return (
    <button
      type="button"
      aria-label={isPlaceholder ? `${title} (video coming soon)` : `Play video: ${title}`}
      onClick={() => !isPlaceholder && setActivated(true)}
      disabled={isPlaceholder}
      className={`group relative block aspect-video w-full overflow-hidden rounded-2xl bg-gray-900 ${
        isPlaceholder ? "cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      {thumb ? (
        // Use plain <img> so we can lazy-load and avoid Next/image config
        // for arbitrary YouTube/host URLs.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb}
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
          <span className="text-7xl">📺</span>
        </div>
      )}

      {/* Dark gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

      {/* Play button */}
      {!isPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-2xl ring-4 ring-white/20 transition-transform duration-200 group-hover:scale-110 group-hover:bg-red-500">
            <svg
              viewBox="0 0 24 24"
              className="ml-1 h-9 w-9 fill-white"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Placeholder badge */}
      {isPlaceholder && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
          <span className="text-5xl">🎬</span>
          <span className="rounded-full bg-yellow-500/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black">
            Video coming soon
          </span>
        </div>
      )}

      {/* Title overlay */}
      {showTitleOverlay && (
        <div className="absolute inset-x-0 bottom-0 p-4 text-left">
          <p className="line-clamp-2 text-sm font-bold text-white drop-shadow-md md:text-base">
            {title}
          </p>
        </div>
      )}
    </button>
  );
}
