import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#17150f",
        color: "#f7f4f0",
        fontSize: 320,
        fontFamily: "serif",
        fontWeight: 300,
      }}
    >
      E
    </div>,
    size,
  );
}
