import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CappaWork — Elevate your people. Automate your process.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0A0F1C",
          padding: "60px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(212, 168, 83, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(212, 168, 83, 0.05) 0%, transparent 50%)",
            display: "flex",
          }}
        />

        {/* Top bar accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #D4A853 0%, #D4A853 40%, transparent 100%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          {/* Logo text */}
          <div
            style={{
              fontSize: 28,
              color: "#D4A853",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 40,
              display: "flex",
            }}
          >
            CappaWork
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#FAFAF8",
              lineHeight: 1.15,
              marginBottom: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>Elevate your people.</span>
            <span>Automate your process.</span>
          </div>

          {/* Subheadline */}
          <div
            style={{
              fontSize: 24,
              color: "rgba(250, 250, 248, 0.6)",
              maxWidth: 700,
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            AI transformation for founder-led service businesses doing $3M-$10M.
          </div>
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: "rgba(250, 250, 248, 0.35)",
              letterSpacing: "0.05em",
              display: "flex",
            }}
          >
            cappawork.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
