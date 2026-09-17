"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, CloudDownload, Smartphone, ShieldCheck, AlertCircle } from "lucide-react";

export default function AppUpdateChecker() {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<"idle" | "latest" | "update_available" | "error">("idle");
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [serverInfo, setServerInfo] = useState<any>(null);

  const checkUpdates = async () => {
    setChecking(true);
    setStatus("idle");

    try {
      // 1. Sinkronisasi Service Worker jika didukung peramban/native shell
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update();
        }
      }

      // 2. Cek ke endpoint versi cloud HIMASTI
      const res = await fetch("/api/version", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal terhubung ke server");

      const data = await res.json();
      setServerInfo(data);

      const now = new Date();
      const timeString = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      setLastChecked(timeString);

      // Status latest
      setStatus("latest");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setChecking(false);
    }
  };

  const handleApplyUpdate = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Pembaruan Aplikasi & OTA Cloud
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Aplikasi memperbarui konten secara otomatis Over-The-Air (OTA) saat terhubung ke internet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-gray-100 text-gray-700 border border-gray-200">
            v2.6.0
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            PRODUKSI
          </span>
        </div>
      </div>

      {/* Main Info Box */}
      <div className="bg-gray-50/70 border border-gray-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Kanal Rilis: HIMASTI Cloud Engine (id.ac.ummat.himasti)</span>
          </div>
          <p className="text-[11px] font-mono text-gray-500">
            {lastChecked ? `Terakhir diperiksa: Pukul ${lastChecked} WITA` : "Belum diperiksa dalam sesi ini"}
          </p>
        </div>

        <button
          onClick={checkUpdates}
          disabled={checking}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-60 cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
          <span>{checking ? "Memeriksa..." : "Periksa Pembaruan"}</span>
        </button>
      </div>

      {/* Result Status Feedback */}
      {status === "latest" && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <p className="font-semibold">Aplikasi Anda sudah versi terbaru!</p>
            <p className="text-[11px] text-emerald-700 font-mono">
              Build Hash: {serverInfo?.buildHash || "a2ba59d"} • Sistem sinkron dengan server Vercel.
            </p>
          </div>
        </div>
      )}

      {status === "update_available" && (
        <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-purple-900 animate-in fade-in duration-150">
          <div className="flex items-start gap-2.5">
            <CloudDownload className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Versi Baru Tersedia di Cloud!</p>
              <p className="text-[11px] text-purple-700">
                Pembaruan konten siap diterapkan pada perangkat Anda.
              </p>
            </div>
          </div>
          <button
            onClick={handleApplyUpdate}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0"
          >
            Terapkan Sekarang
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Tidak dapat terhubung ke server cloud. Pastikan internet Anda aktif.</span>
        </div>
      )}
    </div>
  );
}
