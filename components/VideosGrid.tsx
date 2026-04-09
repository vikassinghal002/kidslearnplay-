"use client";

// Client component that renders the /videos hub grid with filter tabs.
//
// We keep this separate from the server `app/videos/page.tsx` so the page
// itself can stay server-rendered (good for SEO + the JSON-LD blob), while
// the interactive filter UI lives in this small client island.

import { useMemo, useState } from "react";
import Link from "next/link";
import VideoEmbed from "@/components/VideoEmbed";
import {
  formatDuration,
  VIDEO_KIND_LABELS,
  type Video,
  type VideoKind,
} from "@/lib/videos";

type FilterValue = "all" | VideoKind;

type Props = {
  videos: Video[];
  /**
   * Map of related-content slug → human label, used for the
   * "Featured in:" link under each video card. Pre-computed on the server.
   */
  relatedLabels: Record<string, { label: string; href: string }>;
};

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all",         label: "All" },
  { value: "gameplay",    label: VIDEO_KIND_LABELS.gameplay },
  { value: "tutorial",    label: VIDEO_KIND_LABELS.tutorial },
  { value: "speedpaint",  label: VIDEO_KIND_LABELS.speedpaint },
  { value: "compilation", label: VIDEO_KIND_LABELS.compilation },
  { value: "short",       label: VIDEO_KIND_LABELS.short },
];

export default function VideosGrid({ videos, relatedLabels }: Props) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return videos;
    return videos.filter((v) => v.kind === filter);
  }, [filter, videos]);

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "border-red-500 bg-red-600 text-white shadow-lg shadow-red-500/30"
                  : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-10 text-center">
          <p className="text-lg font-semibold text-white">No videos in this category yet</p>
          <p className="mt-2 text-sm text-gray-400">
            Check back soon — we add new videos every week!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => {
            const related = v.relatedSlug ? relatedLabels[v.relatedSlug] : undefined;
            return (
              <article
                key={v.id}
                className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-colors hover:border-red-600/60"
              >
                <Link href={`/videos/${v.id}`} className="block">
                  <VideoEmbed
                    youtubeId={v.youtubeId}
                    title={v.title}
                    showTitleOverlay={false}
                  />
                </Link>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <span className="text-red-400">
                      {VIDEO_KIND_LABELS[v.kind]}
                    </span>
                    <span>{formatDuration(v.durationSec)}</span>
                  </div>
                  <Link href={`/videos/${v.id}`}>
                    <h3 className="line-clamp-2 text-base font-bold text-white hover:text-red-300">
                      {v.title}
                    </h3>
                  </Link>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                    {v.description}
                  </p>
                  {related && (
                    <Link
                      href={related.href}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-300 hover:text-purple-200"
                    >
                      Featured in: {related.label} →
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
