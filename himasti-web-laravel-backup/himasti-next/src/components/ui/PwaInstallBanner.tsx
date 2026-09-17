"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Cek apakah sudah berjalan di mode standalone (sudah terpasang)
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // Cek apakah user sudah pernah menutup banner hari ini
    const dismissed = localStorage.getItem("himasti_pwa_dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 86400000) {
      return;
    }

    // Deteksi iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Untuk iOS yang tidak mendukung event beforeinstallprompt
    if (isIosDevice && !isStandalone) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosGuide(!showIosGuide);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("himasti_pwa_dismissed", Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white tracking-tight">Pasang Aplikasi HIMASTI</h4>
              <p className="text-xs text-slate-300 truncate">
                Akses cepat dari layar utama HP tanpa buka browser
              </p>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {showIosGuide && (
          <div className="p-3 bg-white/5 rounded-xl text-xs text-slate-200 border border-white/10 space-y-1">
            <p className="font-semibold text-white">Cara pasang di iPhone/iPad:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-300">
              <li>Tekan ikon <strong>Bagikan (Share)</strong> di bilah bawah Safari.</li>
              <li>Gulir ke bawah dan pilih <strong>Tambahkan ke Layar Utama</strong>.</li>
            </ol>
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isIOS ? "Lihat Cara Pasang" : "Pasang Sekarang (Gratis)"}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="py-2 px-3 bg-transparent hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Nanti
          </button>
        </div>
      </div>
    </div>
  );
}
