"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { getQrToken } from "./actions";
import { Shield, RefreshCw, MapPin } from "lucide-react";

export default function QrClient({ meeting, appUrl }: { meeting: any, appUrl: string }) {
  const [token, setToken] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [error, setError] = useState("");

  const refreshQr = async () => {
    try {
      const data = await getQrToken(meeting.id);
      setToken(data.token);
      setCountdown(10);
    } catch (e: any) {
      setError("Gagal memuat QR Code. Hubungi tim teknis.");
    }
  };

  useEffect(() => {
    refreshQr(); // Initial fetch

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refreshQr();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const qrUrl = `${appUrl}/absen?m=${meeting.id}&t=${token}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="z-10 w-full max-w-4xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        
        {/* Left Side: QR Code Area */}
        <div className="flex flex-col items-center p-4 sm:p-8 bg-white rounded-3xl shadow-2xl relative group w-full max-w-sm mx-auto">
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-500 text-[10px] sm:text-xs font-mono">
            <RefreshCw className={`w-3 h-3 ${countdown > 0 ? "animate-spin" : ""}`} />
            Berubah dalam {countdown}s
          </div>
          
          <h3 className="text-slate-900 font-bold text-xl sm:text-2xl mb-6 sm:mb-8 mt-6 sm:mt-4 text-center">Scan untuk Hadir</h3>
          
          <div className="p-3 sm:p-4 border-4 border-slate-100 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-sm group-hover:scale-105 transition-transform duration-500 bg-white">
            {token ? (
              <div className="w-[200px] sm:w-[280px] h-[200px] sm:h-[280px]">
                <QRCodeSVG value={qrUrl} width="100%" height="100%" level="H" includeMargin={false} />
              </div>
            ) : (
              <div className="w-[200px] sm:w-[280px] h-[200px] sm:h-[280px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-2xl text-xs sm:text-sm text-center px-4">
                Memuat QR Cerdas...
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
            <Shield className="w-4 h-4 text-green-500" />
            Anti-Cheat Protection Active
          </div>
        </div>

        {/* Right Side: Meeting Info Area */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-full text-slate-300 text-sm w-fit font-mono tracking-widest backdrop-blur-md">
            <Image src="/images/logo_himasti.jpg" alt="Logo HIMASTI" width={20} height={20} className="w-5 h-5 object-contain rounded-md shrink-0 shadow-2xs" />
            <span>HIMASTI CORE SYSTEM</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {meeting.title}
          </h1>
          
          <p className="text-slate-400 text-lg leading-relaxed">
            Silakan buka kamera HP atau aplikasi Barcode Scanner, lalu arahkan ke QR Code di samping. Pastikan GPS (Lokasi) Anda aktif.
          </p>
          
          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl backdrop-blur-md mt-4">
            <h4 className="text-sm text-slate-400 mb-4 uppercase tracking-wider font-semibold">Persyaratan Sistem</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-200">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                Lokasi HP wajib cocok dengan lokasi rapat (Geofence).
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <Shield className="w-4 h-4 text-red-400" />
                </div>
                Foto QR dari teman tidak akan berfungsi (Dynamic TOTP).
              </li>
            </ul>
          </div>
        </div>
        
      </div>
      
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
