"use client";

import { useState } from "react";
import Image from "next/image";

type Props = { slug: string; title: string; fallbackEmoji: string };

export default function ColoringThumbnail({ slug, title, fallbackEmoji }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="bg-gray-50 aspect-square flex items-center justify-center overflow-hidden group-hover:bg-purple-50 transition-colors relative">
      {!imgFailed && (
        <Image
          src={`/images/coloring/${slug}.png`}
          alt={title}
          fill
          className="object-contain p-2"
          onError={() => setImgFailed(true)}
        />
      )}
      {imgFailed && <span className="text-7xl">{fallbackEmoji}</span>}
    </div>
  );
}
