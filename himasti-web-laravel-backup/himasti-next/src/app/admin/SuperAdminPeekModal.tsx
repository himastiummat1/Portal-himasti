"use client";

import React, { useState, useEffect } from "react";
import { Crown, ShieldCheck, Zap, Terminal, X, Eye, ThumbsUp, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";

interface SuperAdminPeekProps {
  adminData: {
    name: string;
    email?: string;
    nim?: string;
    angkatan?: string;
  };
}

export default function SuperAdminPeekModal({ adminData }: SuperAdminPeekProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [respectCount, setRespectCount] = useState(1337);
  const [hasRespected, setHasRespected] = useState(false);
  const [respectMessage, setRespectMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("himasti_admin_respect_count");
    if (saved) {
      setRespectCount(parseInt(saved, 10));
    }
  }, []);

  // Handle ESC key and lock body scroll when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const triggerRespect = () => {
    const next = respectCount + 1;
    setRespectCount(next);
    setHasRespected(true);
    localStorage.setItem("himasti_admin_respect_count", next.toString());

    // Mobile Haptic Vibration
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([40, 60, 40, 80]);
      } catch (_) {}
    }

    // High Voltage Cyber Confetti Explosion
    try {
      confetti({
        particleCount: 70,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#38bdf8", "#818cf8", "#f43f5e", "#fbbf24", "#34d399", "#a855f7"]
      });
    } catch (_) {}

    const quotes = [
      "Aura kodingmu meningkat pesat! Sungkem diterima oleh Sang Architect 👑",
      "Koneksi root terjalin. Sang Architect memberkati skripsi & kodinganmu! 🔥",
      "Bug di aplikasimu otomatis hilang karena sungkem ke Super Admin! ✨",
      "Respect level maksimal! Kamu sekarang diakui sebagai Kader Teladan ⚡"
    ];
    setRespectMessage(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  return (
    <>
      {/* Trigger Button to match web portal standard */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50/50 transition-colors inline-flex items-center gap-2 shrink-0 group"
      >
        <Eye className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        <span>Intip Akun Architect</span>
        <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-mono font-bold">
          VIP
        </span>
      </button>

      {/* Cyber Dossier Holographic Modal */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
        >
          {/* Modal Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white border border-slate-200 text-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 cursor-default my-auto"
          >
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-30 px-6 py-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-xs">
                  <Crown className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    Profil System Architect
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                      ROOT
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">Otoritas Tertinggi Arsitektur Sistem HIMASTI</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Body Content */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[78vh]">
              
              {/* Architect Identity Card */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div 
                  onClick={triggerRespect}
                  className="relative cursor-pointer group/avatar shrink-0"
                  title="Klik untuk kirim sungkem!"
                >
                  <img
                    src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(adminData.name || "SuperAdmin")}`}
                    alt="Super Admin Avatar"
                    className="w-16 h-16 rounded-2xl object-cover bg-white border border-slate-200 shadow-sm transition-transform group-hover/avatar:scale-105"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-white rounded-lg shadow-xs">
                    <Crown className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-base font-bold text-slate-900 truncate">{adminData.name || "M N DAFFA"}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                      ARCHITECT
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{adminData.email || "architect@himasti.ac.id"}</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs font-mono text-slate-600">
                    <span>NIM: <strong className="text-slate-900">{adminData.nim || "ARCHITECT-001"}</strong></span>
                    <span>•</span>
                    <span>Angkatan: <strong className="text-slate-900">{adminData.angkatan || "2022"}</strong></span>
                  </div>
                </div>
              </div>

              {/* Clearance & Auth Specs Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Clearance Level</span>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">RING_0 (Full Root)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Keamanan Autentikasi</span>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">Hardware FIDO2</span>
                  </div>
                </div>
              </div>

              {/* Live Telemetry Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-slate-700 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" /> Telemetri Ekosistem
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Terhubung
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>Integritas Audit Trail:</span>
                  <span className="font-mono font-bold text-slate-800">100% Immutable</span>
                </div>
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>Database Engine:</span>
                  <span className="font-mono font-bold text-slate-800">Supabase (0ms Lag)</span>
                </div>
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>Total Sungkeman:</span>
                  <span className="font-mono font-bold text-amber-600" suppressHydrationWarning>
                    {mounted ? `${respectCount.toLocaleString()} Kali` : "1,337 Kali"}
                  </span>
                </div>
              </div>

              {/* Interactive Respect Action */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={triggerRespect}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
                >
                  <ThumbsUp className="w-4 h-4 text-amber-400" />
                  <span suppressHydrationWarning>
                    Kirim Sungkem ke Architect ({mounted ? respectCount : 1337})
                  </span>
                </button>

                {respectMessage && (
                  <div className="text-center text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 p-2.5 rounded-xl animate-in fade-in">
                    {respectMessage}
                  </div>
                )}
              </div>

              {/* Dedicated "Kembali ke Dasbor" Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Dasbor</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
