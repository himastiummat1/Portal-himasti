'use client'

import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { startAuthentication } from '@simplewebauthn/browser'
import {
  getAttendanceOptionsAction,
  submitWebAuthnAttendanceAction,
  syncOfflineAttendancesAction,
} from '@/app/actions/webauthn'
import {
  saveOfflineAttendance,
  getPendingAttendances,
  deleteSyncedAttendances,
  setupAutoSyncOnOnline,
  type OfflineAttendanceRecord,
} from '@/lib/offline-attendance'
import {
  Fingerprint,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Radio,
  Clock,
  ShieldCheck,
} from 'lucide-react'

interface OfflineAttendanceScannerProps {
  meetingId?: number
  eventId?: number
  title?: string
  currentUserId: number
  currentUserName: string
  onSwitchToPasskey?: () => void
}

export default function OfflineAttendanceScanner({
  meetingId,
  eventId,
  title = 'Presensi HIMASTI',
  currentUserId,
  currentUserName,
  onSwitchToPasskey,
}: OfflineAttendanceScannerProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [pendingRecords, setPendingRecords] = useState<OfflineAttendanceRecord[]>([])
  const [result, setResult] = useState<{
    success: boolean
    message: string
    offline?: boolean
    timestamp?: string
  } | null>(null)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    loadPendingRecords()

    // Auto-sync fallback ketika koneksi pulih
    const cleanupAutoSync = setupAutoSyncOnOnline((count) => {
      loadPendingRecords()
    })

    // Tangkap sinyal sinkronisasi sukses dari Service Worker Background Sync
    const handleSwMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ATTENDANCE_SYNCED') {
        loadPendingRecords()
      }
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      cleanupAutoSync()
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage)
      }
    }
  }, [])

  const loadPendingRecords = async () => {
    try {
      const records = await getPendingAttendances()
      setPendingRecords(records)
    } catch {
      // offline storage fallback
    }
  }

  const handleScanAttendance = async () => {
    setLoading(true)
    setResult(null)

    try {
      if (isOnline) {
        const optsRes = await getAttendanceOptionsAction()
        if (optsRes.error || !optsRes.options) {
          setResult({
            success: false,
            message: optsRes.error || 'Gagal membuat sesi presensi.',
          })
          setLoading(false)
          return
        }

        const authResponse = await startAuthentication(optsRes.options)

        const submitRes = await submitWebAuthnAttendanceAction({
          meetingId,
          eventId,
          response: authResponse,
          catatan: `Presensi Biometrik Fisik - ${title}`,
          deviceInfo: navigator.userAgent,
        })

        if (submitRes.error) {
          setResult({
            success: false,
            message: submitRes.error,
          })
          setLoading(false)
          return
        }

        // Micro-Interactions: Haptic Feedback + Confetti Celebration
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([60, 40, 120])
        }
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#10b981', '#6366f1', '#f59e0b'],
        })

        setResult({
          success: true,
          message: submitRes.message || 'Presensi berhasil diverifikasi oleh chip keamanan HP!',
          timestamp: submitRes.waktuHadir ? new Date(submitRes.waktuHadir).toLocaleTimeString('id-ID') : new Date().toLocaleTimeString('id-ID'),
        })
      } else {
        // Mode Aula Offline (Zero Internet)
        const offlineId = await saveOfflineAttendance({
          meeting_id: meetingId,
          event_id: eventId,
          user_id: currentUserId,
          user_name: currentUserName,
          waktu_hadir: new Date().toISOString(),
          status_kehadiran: 'hadir',
          catatan: `Presensi Offline Aula - ${title}`,
          verification_method: 'offline_mesh',
          hardware_proof: `offline-token-${Date.now()}-${currentUserId}`,
          device_info: `${navigator.platform} (${navigator.userAgent.slice(0, 30)})`,
        })

        await loadPendingRecords()

        // Haptic feedback for offline saving
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([80])
        }
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981'],
        })

        setResult({
          success: true,
          offline: true,
          message: `Presensi tersimpan di memori offline lokal (ID: #${offlineId}). Akan disinkronkan otomatis saat ada koneksi.`,
          timestamp: new Date().toLocaleTimeString('id-ID'),
        })
      }
    } catch (err: any) {
      console.error(err)
      let msg = err.message || 'Presensi gagal.'
      if (err.name === 'NotAllowedError') {
        msg = 'Otorisasi biometrik dibatalkan oleh pengguna.'
      }
      setResult({
        success: false,
        message: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSyncPending = async () => {
    if (!isOnline) {
      alert('Koneksi internet belum tersedia untuk melakukan sinkronisasi.')
      return
    }

    setSyncing(true)
    try {
      const records = await getPendingAttendances()
      if (records.length === 0) return

      const syncRes = await syncOfflineAttendancesAction(
        records.map((r) => ({
          local_id: r.local_id,
          meeting_id: r.meeting_id,
          event_id: r.event_id,
          user_id: r.user_id,
          status_kehadiran: r.status_kehadiran,
          catatan: r.catatan,
          verification_method: r.verification_method,
          hardware_proof: r.hardware_proof,
          device_info: r.device_info,
          waktu_hadir: r.waktu_hadir,
          latitude: r.latitude,
          longitude: r.longitude,
        }))
      )

      if (syncRes.error) {
        throw new Error(syncRes.error)
      }

      await deleteSyncedAttendances()
      await loadPendingRecords()

      alert(`Sukses menyinkronkan ${syncRes.syncedCount} data presensi offline ke server!`)
    } catch (err: any) {
      alert(err.message || 'Sinkronisasi gagal')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-md max-w-lg mx-auto w-full overflow-hidden">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-700">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Jaringan Aula</span>
          <div className="flex items-center gap-2 mt-0.5">
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Wifi className="w-3.5 h-3.5" />
                Online (Server Connected)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 animate-pulse">
                <WifiOff className="w-3.5 h-3.5" />
                Zero Internet (Offline Mesh Active)
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Kader</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{currentUserName}</span>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700 text-center">
        <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
          Agenda Berlangsung
        </span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Protokol Validasi: FIDO2 Hardware Chip + Offline Resilient Store
        </p>
      </div>

      <div className="flex flex-col items-center my-6">
        <button
          onClick={handleScanAttendance}
          disabled={loading}
          className="group relative w-36 h-36 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition transform active:scale-95 flex flex-col items-center justify-center gap-2 border-4 border-white dark:border-slate-800 ring-4 ring-blue-100 dark:ring-blue-900/30 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-12 h-12 animate-spin" />
          ) : (
            <Fingerprint className="w-14 h-14 transition group-hover:scale-110" />
          )}
          <span className="text-xs font-bold tracking-wide uppercase">
            {loading ? 'Memvalidasi...' : 'Tap Presensi'}
          </span>
        </button>
        <p className="text-xs text-slate-400 mt-4 text-center">
          Sentuh tombol untuk verifikasi sidik jari/FaceID chip fisik HP Anda
        </p>
      </div>

      {result && (
        <div
          className={`p-4 rounded-2xl mb-4 border text-sm flex items-start gap-3 ${
            result.success
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold">{result.message}</p>
            {!result.success && result.message.includes('belum mendaftarkan') && (
              <button
                type="button"
                onClick={() => {
                  if (onSwitchToPasskey) {
                    onSwitchToPasskey()
                  } else {
                    document.getElementById('passkey-enrollment')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="mt-2.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition"
              >
                <span>👇 Klik di Sini untuk Tautkan Perangkat</span>
              </button>
            )}
            {result.timestamp && (
              <p className="text-xs mt-1 opacity-80 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Waktu: {result.timestamp}
              </p>
            )}
          </div>
        </div>
      )}

      {pendingRecords.length > 0 && (
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="text-xs font-medium text-amber-900 dark:text-amber-200">
              {pendingRecords.length} presensi tersimpan lokal di aula
            </span>
          </div>

          <button
            onClick={handleSyncPending}
            disabled={syncing || !isOnline}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Menyinkronkan...' : 'Sinkronkan'}</span>
          </button>
        </div>
      )}

      {/* Bantuan Tautkan Perangkat (Kelola Passkey) - Berada di DALAM container kartu */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
        <div className="p-3.5 rounded-2xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200 w-full">
          <div className="flex items-start gap-2.5 min-w-0">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Perangkat belum didaftarkan? Buka tab <strong>Kelola Passkey</strong> untuk mendaftarkan sensor HP.
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToPasskey}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shrink-0 shadow-xs active:scale-95 whitespace-nowrap self-stretch sm:self-auto"
          >
            <span>Daftar Sekarang</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  )
}
