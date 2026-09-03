import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import FloatingChatbot from "@/components/chat/FloatingChatbot";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "HIMASTI Portal - Universitas Muhammadiyah Mataram",
  description: "Sistem Informasi, Presensi Biometrik FIDO2, dan Modul IT HIMASTI",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/logo_himasti.jpg",
    apple: "/images/logo_himasti.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HIMASTI",
  },
  verification: {
    google: "nA1ksDi8zu990WSLCnvaFdYoZ59ewc0d9jrtciqCOzk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} font-sans antialiased text-gray-900 bg-gray-100`}>
        <div className="min-h-screen">
          <Navigation />
          <main>{children}</main>
          <FloatingChatbot />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
