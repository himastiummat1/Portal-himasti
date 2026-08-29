"use client";
import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { ArrowLeft, Camera, CheckCircle2, ShieldAlert, XCircle, Search } from "lucide-react";
import Link from "next/link";
import { scanKtaAbsen } from "./actions";

export default function ScannerClient({ meetings }: { meetings: any[] }) {
  const [selectedMeetingId, setSelectedMeetingId] = useState<number>(meetings.length > 0 ? meetings[0].id : 0);
  const [scanResult, setScanResult] = useState<{ status: 'success'|'error', msg: string, name?: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    if (!selectedMeetingId) {
      alert("Pilih rapat/event terlebih dahulu!");
      return;
    }
    
    setIsScanning(true);
    setScanResult(null);

    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          // Pause scanner to process
          html5QrCode.pause();
          
          try {
            const data = JSON.parse(decodedText);
            if (data.type === "himasti_kta" && data.nim) {
              // Hit the server action
              const res = await scanKtaAbsen(selectedMeetingId, data.nim);
              if (res.success) {
                setScanResult({ status: 'success', msg: 'Absensi Berhasil!', name: res.name });
              } else {
                setScanResult({ status: 'error', msg: res.error });
              }
            } else {
              setScanResult({ status: 'error', msg: "QR Code tidak valid (Bukan KTA HIMASTI)." });
            }
          } catch (err) {
            setScanResult({ status: 'error', msg: "Format QR Code salah." });
          }

          // Resume after 3 seconds
          setTimeout(() => {
            setScanResult(null);
            html5QrCode.resume();
          }, 3000);
        },
        (errorMessage) => {
          // parse error, ignore
        }
      );
    } catch (err) {
      console.error(err);
      alert("Gagal mengakses kamera. Pastikan Anda memberi izin kamera.");
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        setIsScanning(false);
        setScanResult(null);
      }).catch(console.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Camera className="w-6 h-6 text-gray-900" />
          Live KTA Scanner
        </h1>
        <p className="text-gray-500 mt-1">Gunakan kamera untuk men-scan Digital ID Card Kader saat Rapat atau Event.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Settings Column */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Pengaturan Sesi</h3>
            
            <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Event/Rapat</label>
            <select 
              value={selectedMeetingId}
              onChange={(e) => setSelectedMeetingId(parseInt(e.target.value))}
              disabled={isScanning}
              className="w-full border border-slate-300 rounded-lg p-2 text-sm mb-6 disabled:bg-slate-100 disabled:text-slate-500"
            >
              <option value={0}>-- Pilih Event --</option>
              {meetings.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>

            {!isScanning ? (
              <button 
                onClick={startScanner}
                disabled={!selectedMeetingId}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4" /> Mulai Scanner
              </button>
            ) : (
              <button 
                onClick={stopScanner}
                className="w-full py-3 bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
              >
                <XCircle className="w-4 h-4" /> Hentikan Scanner
              </button>
            )}
          </div>
        </div>

        {/* Scanner Column */}
        <div className="md:col-span-2">
          <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden border border-slate-800 flex flex-col items-center justify-center min-h-[400px]">
            
            {!isScanning ? (
              <div className="text-center text-slate-500 flex flex-col items-center">
                <Camera className="w-16 h-16 mb-4 text-slate-700" />
                <p>Scanner belum aktif.</p>
                <p className="text-sm mt-2 max-w-xs">Pilih event di samping dan klik "Mulai Scanner" untuk mengaktifkan kamera.</p>
              </div>
            ) : (
              <div className="w-full relative">
                <div id="reader" className="w-full overflow-hidden rounded-2xl bg-black border-4 border-slate-700"></div>
                
                {/* Overlay Result */}
                {scanResult && (
                  <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-md ${scanResult.status === 'success' ? 'bg-emerald-900/80' : 'bg-red-900/80'} rounded-2xl animate-in zoom-in duration-200`}>
                    {scanResult.status === 'success' ? (
                      <>
                        <CheckCircle2 className="w-20 h-20 text-emerald-400 mb-4" />
                        <h2 className="text-3xl font-bold text-white text-center">VERIFIED</h2>
                        <p className="text-emerald-200 font-mono mt-2 text-center text-lg">{scanResult.name}</p>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-20 h-20 text-red-400 mb-4" />
                        <h2 className="text-3xl font-bold text-white text-center">ACCESS DENIED</h2>
                        <p className="text-red-200 mt-2 text-center">{scanResult.msg}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
