"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Download, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Terminal, 
  Layers,
  ArrowRight,
  Info
} from "lucide-react";

export default function DownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installingPwa, setInstallingPwa] = useState(false);

  useEffect(() => {
    // Cek apakah sudah terpasang
    const standalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator as any).standalone === true;
    setIsInstalled(standalone);

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      alert("Untuk menginstal via Chrome: Ketuk titik tiga (⋮) di pojok kanan atas browser, lalu pilih 'Instal aplikasi' atau 'Tambahkan ke Layar Utama'.");
      return;
    }

    setInstallingPwa(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setInstallingPwa(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Branding */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-3 shadow-md shrink-0">
            <Image
              src="/icons/icon-192x192.png"
              alt="HIMASTI Logo"
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
              priority
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-purple-50 text-purple-700 border border-purple-200">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
              DISTRIBUSI RESMI • FASILKOM UMMAT
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Aplikasi Portal HIMASTI
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
              Sistem informasi akademik terintegrasi, modul perkuliahan IT, presensi biometrik hardware FIDO2, dan katalog karya inovasi mahasiswa Informatika UMMAT.
            </p>

            {/* Spec Bar (Monospace) */}
            <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-3 text-xs font-mono text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">Versi: 2.6.0</span>
              <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">Paket: id.ac.ummat.himasti</span>
              <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">Ukuran: ~3.2 MB</span>
              <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">OS: Android 8.0+</span>
            </div>
          </div>
        </div>

        {/* Metode Pilihan Instalasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: WebAPK PWA (Rekomendasi) */}
          <div className="bg-white border-2 border-purple-600/60 rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-mono uppercase px-3 py-1 font-bold rounded-bl-lg">
              Rekomendasi Utama
            </div>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                <Smartphone className="w-5 h-5" />
              </div>
              
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Instalasi Instan (WebAPK)
                </h2>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Terintegrasi langsung melalui Google Chrome. Google memverifikasi dan menandatangani paket secara otomatis tanpa peringatan keamanan.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tanpa peringatan Play Protect / scan virus</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Update otomatis Over-The-Air (OTA)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ikon adaptif HD tanpa border putih</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-100">
              <button
                onClick={handleInstallPwa}
                disabled={isInstalled || installingPwa}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                {isInstalled ? "Sudah Terpasang di Perangkat" : "Pasang di Layar Utama"}
              </button>
            </div>
          </div>

          {/* Card 2: Unduh APK Mandiri */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700">
                <Download className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Paket APK Mandiri
                </h2>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  File installer APK resmi untuk instalasi manual di perangkat Android atau dibagikan saat jaringan internet terbatas.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Ditandatangani secara digital (V1 + V2 + V3)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dukungan penuh instalasi offline</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bawaan Splash Screen asli Android OS</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-100">
              <a
                href="/downloads/himasti.apk"
                download="HIMASTI-HUB-v1.0.apk"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Unduh File APK Resmi
              </a>
            </div>
          </div>

        </div>

        {/* Panduan Instalasi APK */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-700" />
            <h3 className="text-base font-bold text-gray-900">
              Petunjuk Pemasangan File APK Mandiri
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600 pt-2">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
              <span className="font-mono font-bold text-purple-600">01. UNDUH</span>
              <p>Ketuk tombol <strong>Unduh File APK</strong> di atas dan tunggu hingga unduhan selesai.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
              <span className="font-mono font-bold text-purple-600">02. IZINKAN</span>
              <p>Buka file dari notifikasi. Jika Android meminta izin, pilih <strong>Setelan ➔ Izinkan dari sumber ini</strong>.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
              <span className="font-mono font-bold text-purple-600">03. SELESAI</span>
              <p>Ketuk <strong>Instal</strong>. Aplikasi HIMASTI resmi langsung siap digunakan di beranda HP Anda.</p>
            </div>
          </div>
        </div>

        {/* Section Pengembang / Developer IT */}
        <div className="bg-slate-900 text-slate-300 rounded-xl p-6 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>PENGEMBANG & ARSITEKTUR NATIVE</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              CAPACITOR v8 • GRADLE
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed font-sans text-xs">
            Proyek ini dilengkapi arsitektur native Android Studio (`android/` project) berbasis Capacitor. Pengembang atau anggota divisi Litbang HIMASTI dapat mengompilasi rilis baru secara otomatis melalui GitHub Actions CI/CD atau membuka proyek secara lokal di Android Studio.
          </p>

          <div className="bg-black/50 p-3 rounded border border-slate-800 text-slate-300 space-y-1 text-[11px]">
            <p className="text-slate-500"># Membuka di Android Studio secara lokal:</p>
            <p className="text-purple-300">npx cap open android</p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Kembali ke Beranda Portal HIMASTI
          </Link>
        </div>

      </div>
    </div>
  );
}
