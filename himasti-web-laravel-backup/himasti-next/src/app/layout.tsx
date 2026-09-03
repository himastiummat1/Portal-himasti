import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import FloatingChatbot from "@/components/chat/FloatingChatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HIMASTI Web",
  description: "Portal Informasi HIMASTI",
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
      <body className={`${inter.className} font-sans antialiased text-gray-900 bg-gray-100`}>
        <div className="min-h-screen">
          <Navigation />
          <main>{children}</main>
          <FloatingChatbot />
        </div>
      </body>
    </html>
  );
}
