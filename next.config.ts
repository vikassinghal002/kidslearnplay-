import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
  },
  compress: true,

  // React 19 + strict rendering. Strict mode is a no-op in prod but catches
  // unmount-cleanup bugs in dev (the audio-leak we just fixed was exactly
  // this kind of issue).
  reactStrictMode: true,

  experimental: {
    // Tailwind produces a small atomic CSS bundle, so inlining it in the
    // <head> wins LCP/FCP for first-time visitors (no extra RTT for the
    // stylesheet). Returning visitors don't get cached CSS, but since our
    // audience is mostly kid-search-traffic first-timers, the trade is
    // right. Production-only, so dev HMR is unaffected.
    inlineCss: true,

    // Keep client-prefetched segments fresh for a while so back/forward
    // and repeated nav between /games and /games/math feel instant.
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },

  // Longer cache lifetimes on static assets Next doesn't already hash.
  // Next.js uses path-to-regexp for `source`, which does not support `(?:...)`
  // non-capturing groups — we use the named-wildcard + extension-alternation
  // syntax from the Next docs instead.
  async headers() {
    return [
      {
        source: "/:path*.:ext(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
