"use client";
import { useState, useEffect } from "react";
import { submitAbsensi } from "./actions";
import { MapPin, ShieldCheck, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export default function AbsenClient({ meeting, token, alreadyAttended, userName }: any) {
  const [status, setStatus] = useState<"idle" | "locating" | "submitting" | "success" | "error">(alreadyAttended ? "success" : "idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (alreadyAttended) return;

    // Automatically trigger GPS and submission on load
    setStatus("locating");
    
    if (meeting.latitude && meeting.longitude) {
      if (!navigator.geolocation) {
        setStatus("error");
        setErrorMsg("Browser Anda tidak mendukung deteksi lokasi (GPS).");
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          processAbsen(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          setStatus("error");
          setErrorMsg("Gagal mendapatkan lokasi. Pastikan izin GPS (Location) aktif di browser Anda.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      // No geofencing required for this meeting
      processAbsen(null, null);
    }
  }, []);

  async function processAbsen(lat: number | null, lng: number | null) {
    setStatus("submitting");
    const result = await submitAbsensi(meeting.id, token, lat, lng);
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Gagal melakukan absensi.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-blue-200">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white mb-2">{meeting.title}</h1>
            <p className="text-slate-400 text-sm">Sistem Absensi Cerdas HIMASTI</p>
          </div>
        </div>
        
        <div className="p-8">
          {status === "locating" && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                <MapPin className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Mendeteksi Lokasi...</h3>
              <p className="text-sm text-slate-500">Mencocokkan koordinat GPS Anda dengan lokasi rapat (Geofencing).</p>
            </div>
          )}

          {status === "submitting" && (
            <div className="flex flex-col items-center text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <h3 className="text-lg font-semibold text-slate-800">Memvalidasi Kehadiran...</h3>
              <p className="text-sm text-slate-500">Memeriksa token keamanan QR (TOTP).</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Kehadiran Tercatat!</h3>
                <p className="text-sm text-slate-500 mt-1">Halo, <strong>{userName}</strong>. Anda telah berhasil melakukan absensi.</p>
              </div>
              <div className="w-full bg-slate-50 p-4 rounded-xl text-xs text-slate-500 font-mono flex items-center gap-2 mt-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Divalidasi oleh Vidyax Core
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Absensi Ditolak</h3>
                <p className="text-sm text-red-600 font-medium mt-2">{errorMsg}</p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm hover:bg-slate-800 transition-colors"
              >
                Coba Ulangi (Scan Lagi)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
