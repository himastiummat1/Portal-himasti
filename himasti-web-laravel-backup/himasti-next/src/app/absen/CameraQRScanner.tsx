'use client'

import { useState, useEffect, useRef } from 'react'
import { Camera, RefreshCw, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CameraQRScanner({ currentUserId }: { currentUserId: number }) {
  const router = useRouter()
  const [scanning, setScanning] = useState(false)
  const [manualInput, setManualInput] = useState('')
  const [scanMessage, setScanMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const html5QrCodeRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    setScanMessage(null)
    setScanning(true)

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const qrScanner = new Html5Qrcode('camera-reader')
      html5QrCodeRef.current = qrScanner

      await qrScanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleDetectedCode(decodedText)
          stopCamera()
        },
        () => {
          // ignore scan frame errors
        }
      )
    } catch (err: any) {
      console.error('Camera error:', err)
      setScanning(false)
      setScanMessage({
        type: 'error',
        text: 'Tidak dapat mengakses kamera. Pastikan izin kamera aktif atau gunakan input kode di bawah.',
      })
    }
  }

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop()
        html5QrCodeRef.current = null
      } catch {
        // ignore
      }
    }
    setScanning(false)
  }

  const handleDetectedCode = (rawText: string) => {
    try {
      // Jika hasil scan berupa URL lengkap (/absen?m=...&t=...)
      if (rawText.includes('/absen') || rawText.startsWith('http')) {
        const url = new URL(rawText, window.location.origin)
        const m = url.searchParams.get('m')
        const t = url.searchParams.get('t')

        if (m && t) {
          setScanMessage({
            type: 'success',
            text: 'QR Rapat Valid! Memproses absensi geofencing...',
          })
          router.push(`/absen?m=${m}&t=${t}`)
          return
        }
      }

      // Jika format teks biasa / token
      setScanMessage({
        type: 'success',
        text: `Kode terdeteksi: ${rawText.slice(0, 30)}. Membuka halaman absensi...`,
      })
      router.push(`/absen?t=${encodeURIComponent(rawText)}`)
    } catch {
      setScanMessage({
        type: 'error',
        text: 'Format QR tidak dikenali sebagai kode absensi rapat HIMASTI.',
      })
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualInput.trim()) return
    handleDetectedCode(manualInput.trim())
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-md max-w-lg mx-auto">
      <div className="text-center mb-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Pemindai Kamera QR Rapat
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Arahkan kamera ke QR Code yang ditampilkan panitia di layar aula atau proyektor.
        </p>
      </div>

      {scanMessage && (
        <div
          className={`p-3.5 rounded-2xl mb-4 text-xs font-semibold flex items-center gap-2.5 ${
            scanMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}
        >
          {scanMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{scanMessage.text}</span>
        </div>
      )}

      {/* Camera Viewport */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-square flex flex-col items-center justify-center text-white mb-5">
        <div id="camera-reader" className="w-full h-full" />

        {!scanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 backdrop-blur-sm z-10">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <Camera className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-white">Kamera Belum Aktif</p>
            <p className="text-xs text-slate-400 mt-1 mb-4 max-w-xs">
              Aktifkan kamera untuk memindai kode QR proyektor tanpa mengetik token manual.
            </p>
            <button
              type="button"
              onClick={startCamera}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition transform active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Buka Kamera Pemindai</span>
            </button>
          </div>
        )}

        {scanning && (
          <button
            type="button"
            onClick={stopCamera}
            className="absolute bottom-4 z-20 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold backdrop-blur-sm border border-slate-600 transition"
          >
            Tutup Kamera
          </button>
        )}
      </div>

      {/* Manual Input Fallback */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
        <span className="text-xs font-bold text-slate-400 block mb-2">
          Atau Masukkan Tautan / Kode Presensi Manual
        </span>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Tempel tautan atau kode token rapat..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <span>Kirim</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  )
}
