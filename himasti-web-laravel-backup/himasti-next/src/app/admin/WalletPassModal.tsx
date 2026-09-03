"use client";

import { useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { 
  X, Download, ExternalLink, Printer, Check, Copy, 
  Smartphone, ShieldCheck, Sparkles, QrCode, ArrowRight
} from "lucide-react";

interface WalletPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  nim: string;
  angkatan: string;
  title: string;
  email: string;
}

export default function WalletPassModal({
  isOpen,
  onClose,
  name,
  nim,
  angkatan,
  title,
  email
}: WalletPassModalProps) {
  const [activeTab, setActiveTab] = useState<"apple" | "google" | "print">("apple");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const qrPayload = JSON.stringify({
    type: "himasti_kta",
    nim,
    name,
    org: "HIMASTI UMMAT",
    verified: true
  });

  const pkpassDownloadUrl = `/api/kta/wallet?format=pkpass&nim=${encodeURIComponent(nim)}`;
  const jsonPassUrl = `/api/kta/wallet?format=json&nim=${encodeURIComponent(nim)}`;

  const handleCopyQr = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white my-auto animate-in zoom-in-95 duration-200">
        
        {/* Glowing Ambient Top Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-rose-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                Dompet Digital Resmi
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  SMART PASS
                </span>
              </h3>
              <p className="text-xs text-slate-400">Simpan KTA HIMASTI langsung ke Apple Wallet & Google Wallet</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/30 px-5 sm:px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab("apple")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "apple"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.97-14.42-6.19-9.58-10.97-20.73-14.33-33.45-3.37-12.72-5.06-24.32-5.06-34.8 0-16.14 4.12-29.62 12.36-40.45 8.24-10.83 18.59-16.36 31.06-16.6 4.79 0 10.13 1.25 16.03 3.76 5.89 2.51 9.77 3.82 11.64 3.93 1.52-.11 5.54-1.47 12.06-4.1 6.52-2.63 12.08-3.79 16.68-3.48 12.92.76 23.36 5.48 31.33 14.16-11.2 6.84-16.67 16.27-16.42 28.29.25 9.57 3.97 17.65 11.16 24.23 7.19 6.58 15.82 10.22 25.88 10.92-2.39 7.5-5.34 15.17-8.86 23.01zm-32.32-108.5c0 6.84-2.58 13.43-7.75 19.77-6.2 7.4-13.71 11.75-22.52 11.05-.13-1.09-.2-2.07-.2-2.94 0-6.84 2.82-13.71 8.46-20.61 2.83-3.48 6.42-6.39 10.77-8.73 4.35-2.34 8.08-3.69 11.19-4.05.08 1.8.05 3.63.05 5.51z" />
            </svg>
            Apple Wallet (.pkpass)
          </button>
          
          <button
            onClick={() => setActiveTab("google")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "google"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Google Wallet
          </button>

          <button
            onClick={() => setActiveTab("print")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "print"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak KTA Fisik
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* PASS VISUAL PREVIEW (Card Replica) */}
          <div className="relative mx-auto max-w-sm rounded-2xl p-4 bg-slate-900 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden">
            {/* Wallet Cutout Notch Visual */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-2 bg-slate-950 rounded-b-xl border-b border-slate-800" />

            {/* Top Pass Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white p-0.5 overflow-hidden">
                  <Image src="/images/logo_himasti.jpg" alt="Logo" width={24} height={24} className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-xs tracking-wider text-slate-200 font-mono">HIMASTI UMMAT</span>
              </div>
              <div className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                MEMBER PASS
              </div>
            </div>

            {/* Main Pass Info */}
            <div className="py-3.5 space-y-3">
              <div>
                <div className="text-[9px] font-mono uppercase text-slate-400">NAMA KADER</div>
                <div className="text-base font-extrabold text-white truncate">{name}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[9px] font-mono uppercase text-slate-400">NIM</div>
                  <div className="font-mono font-bold text-cyan-300 truncate">{nim}</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase text-slate-400">ANGKATAN</div>
                  <div className="font-mono font-bold text-slate-200">{angkatan}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[9px] font-mono uppercase text-slate-400">STATUS</div>
                  <div className="font-semibold text-emerald-400">Kader Aktif</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase text-slate-400">GELAR / TITLE</div>
                  <div className="font-semibold text-amber-300 truncate">{title}</div>
                </div>
              </div>
            </div>

            {/* Pass QR Barcode Area */}
            <div className="pt-3 border-t border-dashed border-slate-800 flex flex-col items-center justify-center">
              <div className="bg-white p-2.5 rounded-xl shadow-inner border border-slate-700">
                <QRCodeSVG value={qrPayload} size={110} level="M" />
              </div>
              <div className="text-[9px] font-mono text-slate-400 mt-2 tracking-widest uppercase">
                ID-{nim.substring(0, 8)} • OFFICIAL PASS
              </div>
            </div>
          </div>

          {/* TAB 1: APPLE WALLET ACTIONS */}
          {activeTab === "apple" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Petunjuk Penggunaan iPhone & Apple Watch:
                </div>
                <p>1. Klik tombol <b>Download .pkpass</b> di bawah ini menggunakan browser Safari di iPhone.</p>
                <p>2. iOS akan otomatis memunculkan sheet pratinjau Apple Wallet dengan tombol <b>Tambah / Add</b> di kanan atas.</p>
                <p>3. KTA Anda langsung tersimpan di aplikasi Apple Wallet resmi dan siap digunakan untuk tap/scan presensi!</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={pkpassDownloadUrl}
                  download={`HIMASTI-KTA-${nim}.pkpass`}
                  className="flex-1 py-3 px-4 bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .pkpass (Apple Wallet)</span>
                </a>

                <button
                  onClick={handleCopyQr}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Tersalin!" : "Salin QR"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE WALLET ACTIONS */}
          {activeTab === "google" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                  <Smartphone className="w-3.5 h-3.5" />
                  Petunjuk Penggunaan Android & Google Wallet:
                </div>
                <p>1. Unduh paket pass KTA dengan format standar <b>.pkpass</b> atau <b>Pass Data</b>.</p>
                <p>2. Di Android, file ini dapat dibuka langsung menggunakan aplikasi <b>Google Wallet</b>, <b>WalletPasses</b>, atau <b>PassAndroid</b>.</p>
                <p>3. Kartu digital akan tersimpan offline di HP tanpa perlu membuka browser tiap rapat.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={pkpassDownloadUrl}
                  download={`HIMASTI-KTA-${nim}.pkpass`}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Simpan ke Google Wallet / Android</span>
                </a>

                <a
                  href={jsonPassUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Pass Data (JSON)</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: CETAK FISIK */}
          {activeTab === "print" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Fisik Standar Kartu PVC / Laminasi:
                </div>
                <p>Fitur ini menyusun tata letak KTA dalam rasio standar kartu identitas ISO ID-1 (85.60 × 53.98 mm) siap cetak.</p>
              </div>

              <button
                onClick={handlePrint}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF Resolusi Tinggi</span>
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3.5 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terotentikasi Database HIMASTI UMMAT</span>
          </div>
          <span className="font-mono text-slate-500">v2.5 WALLET ENGINE</span>
        </div>

      </div>
    </div>
  );
}
