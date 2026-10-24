import { ImageResponse } from "next/og";

export const alt = "CIPHER — Database TI 2025";
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
          justifyContent: "space-between",
          backgroundColor: "#04060c",
          backgroundImage:
            "radial-gradient(circle at 20% 0%, #123442 0%, #04060c 55%)",
          padding: "72px",
          fontFamily: "sans-serif",
          color: "#e6f1ff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              border: "2px solid rgba(34,211,238,0.35)",
              backgroundColor: "rgba(34,211,238,0.1)",
              color: "#67e8f9",
              fontSize: "38px",
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                display: "flex",
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "0.3em",
              }}
            >
              CIPHER
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "15px",
                letterSpacing: "0.2em",
                color: "#8193ad",
              }}
            >
              TEKNOLOGI INFORMASI 2025
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "66px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
            }}
          >
            Database profil mahasiswa TI 2025.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              lineHeight: 1.3,
              color: "#8193ad",
            }}
          >
            Cari berdasarkan NIM atau nama. Satu pencarian, satu profil.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "18px",
            color: "#8193ad",
          }}
        >
          <div style={{ display: "flex" }}>cipher-ti25.vercel.app</div>
          <div
            style={{
              display: "flex",
              letterSpacing: "0.16em",
              color: "#67e8f9",
            }}
          >
            DATABASE ANGKATAN · 2025
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
