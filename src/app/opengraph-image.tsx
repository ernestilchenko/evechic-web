import { ImageResponse } from "next/og";

export const alt = "EVECHIC";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        background: "#f7f4f0",
        color: "#17150f",
      }}
    >
      <div style={{ fontSize: 120, letterSpacing: 36, fontWeight: 300 }}>EVECHIC</div>
      <div style={{ width: 120, height: 2, background: "#b08d57" }} />
      <div style={{ fontSize: 34, letterSpacing: 8, color: "#6b655c" }}>evechic.info</div>
    </div>,
    size,
  );
}
