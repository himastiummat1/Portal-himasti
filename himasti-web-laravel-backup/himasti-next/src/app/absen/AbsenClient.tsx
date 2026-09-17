"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { submitAbsensi } from "./actions";
import { 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  RefreshCw,
  Sparkles
} from "lucide-react";

interface AbsenClientProps {
  meeting: {
    id: number;
    title: string;
    latitude: number | null;
    longitude: number | null;
    radius_meter: number | null;
  };
  token: string;
  alreadyAttended: boolean;
  userName: string;
}

export default function AbsenClient({ meeting, token, alreadyAttended, userName }: AbsenClientProps) {
  const [status, setStatus] = useState<"locating" | "submitting" | "success" | "error">(
    alreadyAttended ? "success" : "locating"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [attendedTime, setAttendedTime] = useState<string>(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (alreadyAttended) return;
    executeAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadyAttended]);

  function executeAttendance() {
    setStatus("locating");
    setErrorMsg("");

    if (meeting.latitude && meeting.longitude) {
      if (!navigator.geolocation) {
        setStatus("error");
        setErrorMsg("Browser Anda tidak mendukung pendeteksi lokasi (GPS). Silakan gunakan Chrome atau Safari.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          processAbsen(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn("GPS error:", err);
          setStatus("error");
          setErrorMsg(
            "Izin GPS belum aktif atau sinyal satelit indoor terhambat. Silakan aktifkan izin lokasi di browser Anda, lalu klik 'Coba Lagi'."
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      // Tidak membutuhkan koordinat lokasi
      processAbsen(null, null);
    }
  }

  async function processAbsen(lat: number | null, lng: number | null) {
    setStatus("submitting");
    const result = await submitAbsensi(meeting.id, token, lat, lng);
    
    if (result.success) {
      if (result.attendedAt) {
        setAttendedTime(new Date(result.attendedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
      }
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Gagal mencatat kehadiran.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Strip */}
        <div className="bg-slate-900 p-6 text-center text-white relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-mono mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Presensi Rapat HIMASTI</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">{meeting.title}</h1>
          <p className="text-xs text-slate-400 mt-1">Sistem Presensi Resmi Mahasiswa TI UMMAT</p>
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-8">
          {/* STATE: DETECTING GPS */}
          {status === "locating" && (
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center animate-pulse">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Mengecek Lokasi...</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Memverifikasi bahwa Anda berada di area ruangan rapat kampus.
                </p>
              </div>
            </div>
          )}

          {/* STATE: SUBMITTING */}
          {status === "submitting" && (
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Mencatat Kehadiran...</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Menyimpan data presensi Anda ke buku notulensi kegiatan.
                </p>
              </div>
            </div>
          )}

          {/* STATE: SUCCESS (OFFICIAL RECEIPT) */}
          {status === "success" && (
            <div className="flex flex-col items-center text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border-2 border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" /> Terverifikasi Hadir
                </span>
                <h3 className="text-xl font-bold text-slate-900">Kehadiran Berhasil Dicatat!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Terima kasih atas partisipasi Anda dalam agenda himpunan.
                </p>
              </div>

              {/* Attendance Slip */}
              <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Nama
                  </span>
                  <span className="font-bold text-slate-900">{userName}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Agenda
                  </span>
                  <span className="font-bold text-slate-900 truncate max-w-[180px]">{meeting.title}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Waktu Absen
                  </span>
                  <span className="font-mono font-bold text-slate-900">{attendedTime} WITA</span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full space-y-2 pt-2">
                <Link
                  href="/admin"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Portal Anggota
                </Link>
                <Link
                  href="/admin/rapat"
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center"
                >
                  Lihat Rekap Notulensi Rapat
                </Link>
              </div>
            </div>
          )}

          {/* STATE: ERROR & TROUBLESHOOTING */}
          {status === "error" && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Presensi Belum Berhasil</h3>
                <p className="text-xs text-rose-600 mt-1.5 leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-200/60 text-left">
                  {errorMsg}
                </p>
              </div>

              <div className="w-full space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRetrying(true);
                    executeAttendance();
                    setTimeout(() => setIsRetrying(false), 1500);
                  }}
                  disabled={isRetrying}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
                  Coba Ulangi Sekarang
                </button>

                <Link
                  href="/absen"
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center"
                >
                  Buka Menu Scan QR Lainnya
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
