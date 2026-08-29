import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal HIMASTI - Ekosistem Digital HIMASTI UMMAT",
  description: "Portal resmi ekosistem digital HIMASTI Universitas Muhammadiyah Mataram.",
  // Tambahkan baris verification ini:
  verification: {
    google: "nA1ksDi8zu990WSLCnvaFdYoZ59ewc0d9jrtciqCOzk",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
