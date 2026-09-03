'use client'

import { useState, useEffect } from 'react'
import { startRegistration } from '@simplewebauthn/browser'
import {
  getRegistrationOptionsAction,
  verifyRegistrationAction,
  getUserRegisteredDevicesAction,
  deleteUserDeviceAction,
} from '@/app/actions/webauthn'
import { ShieldCheck, Fingerprint, Smartphone, Trash2, Plus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

interface Device {
  id: string
  credential_id: string
  device_name: string
  device_type: string | null
  created_at: string | null
  last_used_at: string | null
}

export default function PasskeyEnrollment() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingDevices, setFetchingDevices] = useState(true)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [deviceName, setDeviceName] = useState('')
  const [showInput, setShowInput] = useState(false)

  const loadDevices = async () => {
    setFetchingDevices(true)
    try {
      const res = await getUserRegisteredDevicesAction()
      setDevices(res.devices || [])
    } catch {
      // ignore
    } finally {
      setFetchingDevices(false)
    }
  }

  useEffect(() => {
    loadDevices()
  }, [])

  const handleRegisterDevice = async () => {
    setLoading(true)
    setStatusMessage(null)

    try {
      const optRes = await getRegistrationOptionsAction()
      if (optRes.error || !optRes.options) {
        setStatusMessage({
          type: 'error',
          text: optRes.error || 'Gagal memulai pendaftaran perangkat.',
        })
        setLoading(false)
        return
      }

      const regResponse = await startRegistration(optRes.options)

      const name = deviceName.trim() || 'HP Fisik Saya'
      const verifyRes = await verifyRegistrationAction(regResponse, name)

      if (verifyRes.error) {
        setStatusMessage({
          type: 'error',
          text: verifyRes.error,
        })
        setLoading(false)
        return
      }

      setStatusMessage({
        type: 'success',
        text: 'Chip keamanan HP berhasil didaftarkan! Akun Anda kini terlindungi dari joki presensi.',
      })
      setDeviceName('')
      setShowInput(false)
      await loadDevices()
    } catch (err: any) {
      console.error(err)
      let msg = err.message || 'Terjadi kesalahan saat otentikasi hardware.'
      if (err.name === 'NotAllowedError') {
        msg = 'Pendaftaran dibatalkan atau waktu pemindaian biometrik habis.'
      }
      setStatusMessage({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (credentialId: string) => {
    if (!confirm('Hapus perangkat keamanan ini?')) return
    const res = await deleteUserDeviceAction(credentialId)
    if (res.success) {
      await loadDevices()
    } else {
      alert(res.error || 'Gagal menghapus')
    }
  }

  return (
    <div id="passkey-enrollment" className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Hardware Passkey (Anti-Joki)
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-medium">
                FIDO2 Enclave
              </span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tautkan chip biometrik perangkat HP untuk validasi presensi fisik yang tidak dapat dititipkan.
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`mb-4 p-3 rounded-xl flex items-center gap-2.5 text-sm ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* List Registered Devices */}
      <div className="space-y-2 mb-5">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Perangkat Terdaftar ({devices.length})
        </h3>

        {fetchingDevices ? (
          <div className="py-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memeriksa modul keamanan...</span>
          </div>
        ) : devices.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
            Belum ada perangkat hardware yang terhubung. Daftarkan HP Anda sekarang agar dapat melakukan presensi rapat & acara.
          </div>
        ) : (
          devices.map((device) => (
            <div
              key={device.credential_id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {device.device_name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {device.credential_id.slice(0, 16)}... • Terdaftar:{' '}
                    {device.created_at ? new Date(device.created_at).toLocaleDateString('id-ID') : '-'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(device.credential_id)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                title="Hapus Perangkat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {showInput ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Nama Perangkat (misal: Samsung A54 / iPhone 13)"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            disabled={loading}
            className="flex-1 px-3 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleRegisterDevice}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memindai Biometrik...</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-4 h-4" />
                <span>Pindai Sidik Jari / FaceID</span>
              </>
            )}
          </button>
          <button
            onClick={() => setShowInput(false)}
            disabled={loading}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Batal
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tautkan Perangkat Biometrik Baru</span>
        </button>
      )}
    </div>
  )
}
