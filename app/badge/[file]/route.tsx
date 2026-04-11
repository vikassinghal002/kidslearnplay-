// Dynamic JiggyJoy backlink badges, served as PNGs.
//
// Routes:
//   GET /badge/jiggyjoy-180x50.png   → 180×50 small badge
//   GET /badge/jiggyjoy-300x90.png   → 300×90 medium badge
//
// These URLs are referenced from /for-teachers as copy-paste <img src="..." />
// snippets. Every teacher who pastes a snippet creates a permanent dofollow
// backlink to https://www.jiggyjoy.com — the viral loop in the Boss playbook.

import { ImageResponse } from "next/og";

type Ctx = { params: Promise<{ file: string }> };

const SIZES: Record<string, { w: number; h: number }> = {
  "jiggyjoy-180x50.png": { w: 180, h: 50 },
  "jiggyjoy-300x90.png": { w: 300, h: 90 },
};

// Cache aggressively at the CDN — these PNGs are static. Browsers and edge
// caches can hold them for a year; we'll bust by filename if we ever rev.
const CACHE = "public, max-age=31536000, s-maxage=31536000, immutable";

export async function GET(_req: Request, { params }: Ctx) {
  const { file } = await params;
  const size = SIZES[file];
  if (!size) {
    return new Response("Badge not found", { status: 404 });
  }

  const isSmall = size.h <= 50;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          // Brand-matching gradient — same hues as the homepage hero.
          background:
            "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: isSmall ? "0 12px" : "0 18px",
          gap: isSmall ? 10 : 16,
          boxSizing: "border-box",
        }}
      >
        {/* Rainbow mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isSmall ? 28 : 44,
            lineHeight: 1,
          }}
        >
          🌈
        </div>

        {/* Wordmark + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: isSmall ? 18 : 28,
              fontWeight: 900,
              letterSpacing: -0.5,
              lineHeight: 1,
              display: "flex",
            }}
          >
            JiggyJoy
          </div>
          <div
            style={{
              fontSize: isSmall ? 9 : 12,
              fontWeight: 700,
              opacity: 0.95,
              marginTop: isSmall ? 2 : 4,
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            {isSmall
              ? "Free games & worksheets"
              : "Free games, coloring & worksheets for kids"}
          </div>
        </div>

        {/* Free pill — only on the larger badge where it fits comfortably */}
        {!isSmall && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fde047",
              color: "#7c2d12",
              fontSize: 11,
              fontWeight: 900,
              padding: "4px 10px",
              borderRadius: 999,
              letterSpacing: 0.3,
            }}
          >
            100% FREE
          </div>
        )}
      </div>
    ),
    {
      width: size.w,
      height: size.h,
      headers: {
        "Cache-Control": CACHE,
        "Content-Type": "image/png",
      },
    },
  );
}
