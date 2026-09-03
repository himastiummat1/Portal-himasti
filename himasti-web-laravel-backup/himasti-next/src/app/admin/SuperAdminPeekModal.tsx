"use client";

import React, { useState, useEffect } from "react";
import { Crown, Sparkles, ShieldCheck, Zap, Terminal, X, Flame, Eye, ThumbsUp, ArrowLeft } from "lucide-react";
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
      {/* Trigger Button to flex on Cadres */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white text-xs font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-purple-500/30 overflow-hidden shrink-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-rose-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <span className="relative z-10 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Intip Akun Architect</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono border border-amber-400/30">
            👑 VIP
          </span>
        </span>
      </button>

      {/* Cyber Dossier Holographic Modal */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
        >
          <style>{`
            @keyframes modalCyberLaser {
              0% { transform: translateY(-10px); opacity: 0; }
              25% { opacity: 1; }
              75% { opacity: 1; }
              100% { transform: translateY(480px); opacity: 0; }
            }
            @keyframes modalHoloShine {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-modal-laser {
              animation: modalCyberLaser 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            .animate-modal-holo {
              background-size: 200% auto;
              animation: modalHoloShine 4s linear infinite;
            }
          `}</style>

          {/* Modal Container (Stop Propagation so clicking inside does not close) */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-purple-500/40 text-white shadow-[0_0_60px_rgba(168,85,247,0.35)] overflow-hidden animate-in zoom-in-95 duration-200 cursor-default my-auto"
          >
            {/* Scanning Laser Beam (Contained) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 animate-modal-laser shadow-[0_0_20px_#22d3ee]" />
              <div className="absolute -top-20 -right-20 w-52 h-52 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Sticky Modal Header Bar */}
            <div className="sticky top-0 z-30 px-5 sm:px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-300 font-bold">
                  TOP SECRET // ARCHITECT DOSSIER
                </span>
              </div>
              
              {/* Prominent Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-rose-600 text-slate-300 hover:text-white transition-all text-xs font-bold active:scale-95 border border-slate-700 hover:border-rose-500"
                aria-label="Tutup Dossier"
              >
                <X className="w-4 h-4" />
                <span>Tutup</span>
              </button>
            </div>

            {/* Scrollable Modal Body Content */}
            <div className="relative z-10 p-5 sm:p-7 space-y-6 overflow-y-auto overscroll-contain flex-1">
              
              {/* Avatar Showcase */}
              <div className="flex flex-col items-center text-center">
                <div 
                  onClick={triggerRespect}
                  className="relative w-24 sm:w-28 h-24 sm:h-28 mb-3 cursor-pointer group/avatar"
                  title="Klik avatar untuk kirim sungkem!"
                >
                  {/* Spinning Holographic Laser Ring */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 via-rose-500 to-amber-400 animate-spin [animation-duration:3s] blur-md opacity-80 group-hover/avatar:opacity-100 transition-opacity" />
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 animate-spin [animation-duration:3s]" />
                  
                  {/* Crown */}
                  <div className="absolute -top-3 -right-2 z-20 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce [animation-duration:2s]">
                    <Crown className="w-4 h-4 fill-slate-950" />
                  </div>

                  <img
                    src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(adminData.name || "SuperAdmin")}`}
                    alt="Super Admin Avatar"
                    className="relative z-10 w-full h-full object-cover rounded-full bg-slate-950 border-2 border-white shadow-2xl transition-transform group-hover/avatar:scale-105 active:scale-95"
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-violet-950/80 border border-violet-500/40 text-violet-300 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>ROOT ARCHITECT // SUPER ADMIN</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-violet-200 to-amber-200 bg-clip-text text-transparent animate-modal-holo">
                  {adminData.name || "Super Admin"}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Pemegang Otoritas Penuh Infrastruktur Digital & Arsitektur Swarm HIMASTI UMMAT
                </p>
              </div>

              {/* Flex Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Clearance Level</span>
                  <span className="text-rose-400 font-bold flex items-center gap-1 text-xs">
                    <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" /> RING_0 (GOD MODE)
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Auth Security</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> FIDO2 HARDWARE
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">NIM Mahasiswa</span>
                  <span className="text-amber-300 font-bold text-xs">{adminData.nim || "ROOT-SYSTEM"}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Aura Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                    <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> &gt; 9000 OVERLOAD
                  </span>
                </div>
              </div>

              {/* Live Telemetry HUD Box */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-[10px] font-mono space-y-1.5 text-slate-400">
                <div className="flex justify-between items-center text-slate-300 font-bold pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-cyan-400" /> REALTIME TELEMETRY
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SYNCED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Trail Integrity:</span>
                  <span className="text-emerald-400 font-bold">100% IMMUTABLE</span>
                </div>
                <div className="flex justify-between">
                  <span>Database Pooling:</span>
                  <span className="text-cyan-400 font-bold">SUPABASE 6543 (0ms LAG)</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Sungkeman:</span>
                  <span className="text-amber-400 font-bold" suppressHydrationWarning>
                    {mounted ? `${respectCount.toLocaleString()} Kali 🙇‍♂️` : "1,337 Kali 🙇‍♂️"}
                  </span>
                </div>
              </div>

              {/* Sungkem Interactive Action */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={triggerRespect}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 transition-all duration-200 transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span suppressHydrationWarning>
                    Sungkeman ke Sang Architect! ({mounted ? respectCount : 1337})
                  </span>
                </button>

                {respectMessage && (
                  <p className="text-center text-xs font-medium text-emerald-400 py-1 animate-in fade-in">
                    {respectMessage}
                  </p>
                )}
              </div>

              {/* Dedicated Big "Kembali ke Dasbor" Button */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-800 active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kembali ke Dasbor (Tutup)</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
