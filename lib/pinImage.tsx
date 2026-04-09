// Shared Pinterest pin renderer.
//
// Returns an ImageResponse of a 1000x1500 vertical card tuned for Pinterest.
// Used by `app/pin/games/[slug]/route.tsx`, `app/pin/coloring/[category]/[slug]/route.tsx`
// and `app/pin/worksheets/[slug]/route.tsx`.
//
// Layout:
//   ┌───────────────────────────┐  1000px wide
//   │  SPARKLES                 │
//   │       🦖                  │  Top 60% — hero section (gradient bg + giant emoji)
//   │  SPARKLES                 │
//   │                           │
//   │  ┌─────FREE PRINTABLE────┐│
//   │  │                       ││  Bottom 40% — white panel with title
//   │  │     Big Title Here    ││
//   │  │                       ││
//   │  │     jiggyjoy.com      ││
//   │  └───────────────────────┘│
//   └───────────────────────────┘  1500px tall
//
// Everything here is flexbox — Satori/ImageResponse does not support grid.

import { ImageResponse } from "next/og";
import type { PinVisual } from "@/lib/pinVisuals";

export const PIN_WIDTH = 1000;
export const PIN_HEIGHT = 1500;

type PinContent = {
  title: string;    // Headline (e.g. "Dinosaur Coloring Pages")
  subtitle?: string; // Optional secondary line (e.g. "Grade 1 · Math")
  visual: PinVisual;
};

// Clamp long titles so they don't overflow. Very long worksheet / coloring
// titles get softly truncated.
function fitTitle(title: string, max: number = 52): string {
  if (title.length <= max) return title;
  const trimmed = title.slice(0, max - 1).trimEnd();
  return `${trimmed}…`;
}

// Decide font size from title length so every pin stays visually balanced.
function titleFontSize(title: string): number {
  if (title.length <= 18) return 108;
  if (title.length <= 28) return 92;
  if (title.length <= 40) return 78;
  return 64;
}

export function renderPinImage({ title, subtitle, visual }: PinContent): ImageResponse {
  const displayTitle = fitTitle(title);
  const fontSize = titleFontSize(displayTitle);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        {/* ── HERO (top 60%) ────────────────────────────────────────── */}
        <div
          style={{
            flex: "0 0 900px",
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            background: visual.gradient,
            overflow: "hidden",
          }}
        >
          {/* Soft radial-ish highlight via a huge blurred white circle */}
          <div
            style={{
              position: "absolute",
              top: -200,
              left: -150,
              width: 700,
              height: 700,
              borderRadius: 9999,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -180,
              right: -140,
              width: 520,
              height: 520,
              borderRadius: 9999,
              background: "rgba(0,0,0,0.12)",
              display: "flex",
            }}
          />

          {/* Sparkles scattered around the hero emoji */}
          {visual.sparkles[0] && (
            <div style={{ position: "absolute", top: 90, left: 110, fontSize: 100, display: "flex" }}>
              {visual.sparkles[0]}
            </div>
          )}
          {visual.sparkles[1] && (
            <div style={{ position: "absolute", top: 140, right: 120, fontSize: 120, display: "flex" }}>
              {visual.sparkles[1]}
            </div>
          )}
          {visual.sparkles[2] && (
            <div style={{ position: "absolute", bottom: 140, left: 150, fontSize: 110, display: "flex" }}>
              {visual.sparkles[2]}
            </div>
          )}
          {visual.sparkles[0] && (
            <div style={{ position: "absolute", bottom: 110, right: 160, fontSize: 90, opacity: 0.85, display: "flex" }}>
              {visual.sparkles[0]}
            </div>
          )}

          {/* The giant hero emoji */}
          <div
            style={{
              fontSize: 480,
              lineHeight: 1,
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.35))",
              display: "flex",
            }}
          >
            {visual.hero}
          </div>
        </div>

        {/* ── TEXT PANEL (bottom 40%) ──────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "50px 70px 60px 70px",
            background: "#ffffff",
            position: "relative",
          }}
        >
          {/* Badge ribbon overlapping the hero section */}
          <div
            style={{
              position: "absolute",
              top: -42,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "22px 54px",
              background: "#111827",
              color: "#ffffff",
              borderRadius: 999,
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: 3,
              boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
              border: "4px solid #ffffff",
            }}
          >
            {visual.badge}
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginTop: 30,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize,
                fontWeight: 900,
                color: "#111827",
                letterSpacing: -2,
                lineHeight: 1.05,
                textAlign: "center",
                display: "flex",
                maxWidth: 860,
              }}
            >
              {displayTitle}
            </div>
            {subtitle && (
              <div
                style={{
                  marginTop: 24,
                  fontSize: 38,
                  color: "#6b7280",
                  fontWeight: 600,
                  display: "flex",
                  textAlign: "center",
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
              justifyContent: "center",
              gap: 18,
              marginTop: 30,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              🕺
            </div>
            <div
              style={{
                fontSize: 38,
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
      width: PIN_WIDTH,
      height: PIN_HEIGHT,
      headers: {
        // Cache generated pins aggressively — content is derived from the
        // static data.ts/manifest so it changes at deploy time, not per request.
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
