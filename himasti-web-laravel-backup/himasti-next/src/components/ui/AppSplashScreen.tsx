"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AppSplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("MEMUAT SISTEM...");
  const [isClosing, setIsClosing] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  useEffect(() => {
    // Cek apakah sudah pernah boot dalam session saat ini
    const hasBooted = sessionStorage.getItem("himasti_booted");
    if (hasBooted) {
      setIsDestroyed(true);
      return;
    }

    setMounted(true);

    // Animasi progress bar bertahap
    const timer1 = setTimeout(() => {
      setProgress(55);
      setStatusText("MEMERIKSA KONEKSI...");
    }, 200);

    const timer2 = setTimeout(() => {
      setProgress(90);
      setStatusText("MENYIAPKAN PORTAL...");
    }, 450);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText("SISTEM SIAP");
    }, 700);

    // Mulai animasi fade-out keluar
    const timerClose = setTimeout(() => {
      setIsClosing(true);
      sessionStorage.setItem("himasti_booted", "true");
    }, 950);

    // Hapus total dari DOM agar tidak membebani memori
    const timerDestroy = setTimeout(() => {
      setIsDestroyed(true);
    }, 1450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerClose);
      clearTimeout(timerDestroy);
    };
  }, []);

  if (isDestroyed) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-900 select-none transition-all duration-500 ease-out ${
        isClosing
          ? "opacity-0 scale-105 pointer-events-none"
          : mounted
          ? "opacity-100 scale-100"
          : "opacity-100 scale-100"
      }`}
    >
      {/* Container Utama */}
      <div className="flex flex-col items-center justify-center px-6 text-center max-w-xs w-full">
        {/* Logo Container dengan Border Presisi (Utilitarian & Minimalis) */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-xl flex items-center justify-center p-3 transition-transform duration-700 ease-out transform scale-100">
            <Image
              src="/icons/icon-192x192.png"
              alt="HIMASTI Logo"
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
              priority
            />
          </div>
          {/* Subtle status indicator dot */}
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-slate-900 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Brand Typography */}
        <div className="space-y-1 mb-6">
          <h1 className="text-white text-base font-bold font-mono tracking-widest uppercase">
            HIMASTI PORTAL
          </h1>
          <p className="text-slate-400 text-[11px] font-mono tracking-wider">
            UNIVERSITAS MUHAMMADIYAH MATARAM
          </p>
        </div>

        {/* Minimalist Tech Loading Bar */}
        <div className="w-48 space-y-2">
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-0.5">
            <span className="truncate">{statusText}</span>
            <span className="text-slate-400 font-bold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Footer Akademik */}
      <div className="absolute bottom-8 text-center text-[10px] font-mono text-slate-400 tracking-widest uppercase">
        FASILKOM • HIMASTI UMMAT
      </div>
    </div>
  );
}
