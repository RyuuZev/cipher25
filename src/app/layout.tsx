import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: "variable",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://cipher-ti25.vercel.app",
  ),
  title: {
    default: "CIPHER — Database TI 2025",
    template: "%s · CIPHER",
  },
  description:
    "Database mahasiswa Teknologi Informasi angkatan 2025. Cari profil berdasarkan NIM atau nama.",
  keywords: ["CIPHER", "Teknologi Informasi", "TI 2025", "database mahasiswa"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "CIPHER",
    title: "CIPHER — Database TI 2025",
    description:
      "Cari profil mahasiswa Teknologi Informasi 2025 berdasarkan NIM atau nama.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CIPHER — Database TI 2025",
    description:
      "Cari profil mahasiswa Teknologi Informasi 2025 berdasarkan NIM atau nama.",
  },
};

export const viewport: Viewport = {
  themeColor: "#04060c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-fg">
        {children}
      </body>
    </html>
  );
}
