// Shared YouTube thumbnail renderer.
//
// Returns an ImageResponse of a 1280x720 landscape card tuned for YouTube.
// Used by `app/thumbnail/games/[slug]/route.tsx`,
// `app/thumbnail/coloring/[category]/[slug]/route.tsx` and
// `app/thumbnail/worksheets/[slug]/route.tsx`.
//
// Layout (landscape, opposite of pinImage which is portrait):
//   ┌─────────────────────────────────────────────────────┐  1280px wide
//   │  SPARKLES                                           │
//   │                              ┌─────────────────────┐│
//   │       🦖                     │  FREE ONLINE GAME   ││
//   │   (huge hero on left)        │                     ││
//   │                              │  BIG TITLE HERE     ││
//   │  SPARKLES                    │                     ││
//   │                              │  jiggyjoy.com  🕺   ││
//   │                              └─────────────────────┘│
//   └─────────────────────────────────────────────────────┘  720px tall
//
// Mirrors the visual language of the Pinterest pin (`lib/pinImage.tsx`)
// but in landscape orientation, with the hero emoji on the left and the
// text panel on the right. Reuses the same `PinVisual` shape from
// `lib/pinVisuals.ts` for total brand cohesion.
//
// Everything here is flexbox — Satori/ImageResponse does not support grid.

import { ImageResponse } from "next/og";
import type { PinVisual } from "@/lib/pinVisuals";

export const THUMB_WIDTH = 1280;
export const THUMB_HEIGHT = 720;

type ThumbContent = {
  title: string;     // Headline (e.g. "Snake Game")
  subtitle?: string; // Optional secondary line (e.g. "Free online game")
  visual: PinVisual; // Reuses the pin visual (gradient + hero + sparkles + badge)
};

// Clamp long titles so they don't overflow the right panel.
function fitTitle(title: string, max: number = 46): string {
  if (title.length <= max) return title;
  const trimmed = title.slice(0, max - 1).trimEnd();
  return `${trimmed}…`;
}

// Pick a font size that keeps every thumbnail visually balanced.
function titleFontSize(title: string): number {
  if (title.length <= 14) return 110;
  if (title.length <= 22) return 92;
  if (title.length <= 32) return 76;
  return 62;
}

export function renderThumbnailImage({ title, subtitle, visual }: ThumbContent): ImageResponse {
  const displayTitle = fitTitle(title);
  const fontSize = titleFontSize(displayTitle);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          background: visual.gradient,
        }}
      >
        {/* ── HERO PANEL (left ~55%) ─────────────────────────────────── */}
        <div
          style={{
            flex: "0 0 700px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Soft blurred white circle highlight */}
          <div
            style={{
              position: "absolute",
              top: -180,
              left: -120,
              width: 560,
              height: 560,
              borderRadius: 9999,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -160,
              right: -80,
              width: 420,
              height: 420,
              borderRadius: 9999,
              background: "rgba(0,0,0,0.12)",
              display: "flex",
            }}
          />

          {/* Sparkles */}
          {visual.sparkles[0] && (
            <div style={{ position: "absolute", top: 60, left: 80, fontSize: 90, display: "flex" }}>
              {visual.sparkles[0]}
            </div>
          )}
          {visual.sparkles[1] && (
            <div style={{ position: "absolute", top: 100, right: 60, fontSize: 100, display: "flex" }}>
              {visual.sparkles[1]}
            </div>
          )}
          {visual.sparkles[2] && (
            <div style={{ position: "absolute", bottom: 80, left: 100, fontSize: 90, display: "flex" }}>
              {visual.sparkles[2]}
            </div>
          )}
          {visual.sparkles[0] && (
            <div style={{ position: "absolute", bottom: 60, right: 100, fontSize: 80, opacity: 0.85, display: "flex" }}>
              {visual.sparkles[0]}
            </div>
          )}

          {/* Giant hero emoji */}
          <div
            style={{
              fontSize: 420,
              lineHeight: 1,
              filter: "drop-shadow(0 16px 36px rgba(0,0,0,0.4))",
              display: "flex",
            }}
          >
            {visual.hero}
          </div>
        </div>

        {/* ── TEXT PANEL (right ~45%) ────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "60px 56px 50px 40px",
            background: "rgba(255,255,255,0.96)",
            position: "relative",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 36px",
              background: "#dc2626",
              color: "#ffffff",
              borderRadius: 999,
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: 2,
              boxShadow: "0 8px 22px rgba(220,38,38,0.35)",
              border: "3px solid #ffffff",
            }}
          >
            ▶ {visual.badge}
          </div>

          {/* Title block */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              flex: 1,
              marginTop: 24,
            }}
          >
            <div
              style={{
                fontSize,
                fontWeight: 900,
                color: "#111827",
                letterSpacing: -2,
                lineHeight: 1.02,
                display: "flex",
                textShadow: "0 2px 0 rgba(0,0,0,0.06)",
                maxWidth: 520,
              }}
            >
              {displayTitle}
            </div>
            {subtitle && (
              <div
                style={{
                  marginTop: 18,
                  fontSize: 30,
                  color: "#6b7280",
                  fontWeight: 700,
                  display: "flex",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Branding footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 22,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
              }}
            >
              🕺
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#111827",
                letterSpacing: -1,
                display: "flex",
              }}
            >
              jiggyjoy.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: THUMB_WIDTH,
      height: THUMB_HEIGHT,
      headers: {
        // Aggressively cache — content is derived from data.ts so it only
        // changes at deploy time.
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
