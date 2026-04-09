"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  slug: string;
  title: string;
  fallbackEmoji: string;
  /** Pass explicit image src to override the default slug-based path */
  src?: string;
};

export default function ColoringThumbnail({ slug, title, fallbackEmoji, src }: Props) {
  // Try png first (curated), then jpg (bulk), then emoji fallback
  const [attempt, setAttempt] = useState<"png" | "jpg" | "emoji">(
    src ? "png" : "png"
  );

  const imgSrc =
    src ??
    (attempt === "png"
      ? `/images/coloring/${slug}.png`
      : `/images/coloring/${slug}.jpg`);

  return (
    <div className="bg-gray-50 aspect-square flex items-center justify-center overflow-hidden group-hover:bg-purple-50 transition-colors relative">
      {attempt !== "emoji" && (
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-contain p-2"
          onError={() => {
            if (attempt === "png") setAttempt("jpg");
            else setAttempt("emoji");
          }}
        />
      )}
      {attempt === "emoji" && (
        <span className="text-7xl">{fallbackEmoji}</span>
      )}
    </div>
  );
}
