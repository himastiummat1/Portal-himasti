import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal HIMASTI - Ekosistem Digital HIMASTI UMMAT",
  description: "Portal resmi ekosistem digital HIMASTI (Himpunan Mahasiswa Sistem dan Teknologi Informasi) Universitas Muhammadiyah Mataram.",
  keywords: ["HIMASTI", "UMMAT", "Sistem dan Teknologi Informasi", "Portal HIMASTI", "Mataram"],
  authors: [{ name: "HIMASTI UMMAT" }],
  creator: "HIMASTI",
  metadataBase: new URL("https://portal-himasti-beta.vercel.app"),
  openGraph: {
    title: "Portal HIMASTI - Ekosistem Digital HIMASTI UMMAT",
    description: "Platform kolaborasi, divisi, dan ekosistem digital mahasiswa STI.",
    url: "https://portal-himasti-beta.vercel.app",
    siteName: "HIMASTI Portal",
    images: [
      {
        url: "/images/logo_himasti.jpg",
        width: 800,
        height: 600,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

