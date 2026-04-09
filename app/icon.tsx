import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)",
          borderRadius: 120,
        }}
      >
        <div style={{ fontSize: 260, lineHeight: 1 }}>🕺</div>
      </div>
    ),
    { ...size }
  );
}
