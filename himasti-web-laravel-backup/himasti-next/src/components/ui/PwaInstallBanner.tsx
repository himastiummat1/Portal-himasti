"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, X } from "lucide-react";

export default function PwaInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Jangan munculkan jika sudah di-dismiss dalam 3 hari
    const dismissed = localStorage.getItem("himasti_app_banner_dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 3 * 86400000) {
      return;
    }

    // Cek apakah sedang running di dalam mode aplikasi/standalone
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (!isStandalone) {
      // Tunda muncul 2.5 detik agar santai dan tidak mengganggu konten awal
      const timer = setTimeout(() => setShowBanner(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("himasti_app_banner_dismissed", Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Pemberitahuan Aplikasi Mobile"
      className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-40 transition-all duration-200"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-slate-200 border border-slate-700/80 rounded-full pl-3.5 pr-2 py-1.5 shadow-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <span className="truncate text-slate-300 font-medium">
            Tersedia versi aplikasi Android
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/download"
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors text-[11px]"
          >
            <Download className="w-3 h-3" />
            <span>Unduh APK</span>
          </Link>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            title="Tutup"
            aria-label="Tutup pemberitahuan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
