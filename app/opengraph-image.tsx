import { ImageResponse } from "next/og";

export const alt = "KidsLearnPlay — Free Kids Games, Coloring Pages & Worksheets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 180, marginBottom: 20 }}>🌈</div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            letterSpacing: -2,
            textShadow: "0 4px 24px rgba(0,0,0,0.25)",
          }}
        >
          KidsLearnPlay
        </div>
        <div
          style={{
            fontSize: 40,
            marginTop: 16,
            opacity: 0.95,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <span>🎨 Coloring</span>
          <span>·</span>
          <span>🎮 Games</span>
          <span>·</span>
          <span>📄 Worksheets</span>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 32,
            opacity: 0.9,
            background: "rgba(255,255,255,0.18)",
            padding: "12px 32px",
            borderRadius: 999,
          }}
        >
          100% Free · No Signup · Instant Play
        </div>
      </div>
    ),
    { ...size }
  );
}
