'use client'

import { useState } from 'react'
import { Fingerprint, QrCode, MapPin, ShieldCheck, Smartphone } from 'lucide-react'
import OfflineAttendanceScanner from '@/components/OfflineAttendanceScanner'
import PasskeyEnrollment from '@/components/PasskeyEnrollment'
import CameraQRScanner from './CameraQRScanner'

interface AbsenTabsProps {
  meetingId: number
  meetingTitle: string
  currentUserId: number
  currentUserName: string
}

export default function AbsenTabs({
  meetingId,
  meetingTitle,
  currentUserId,
  currentUserName,
}: AbsenTabsProps) {
  const [activeTab, setActiveTab] = useState<'biometric' | 'camera_qr' | 'passkey_manage'>('biometric')

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('biometric')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'biometric'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          <span>Biometrik & Offline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('camera_qr')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'camera_qr'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Scan QR Kamera</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('passkey_manage')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'passkey_manage'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Kelola Passkey</span>
        </button>
      </div>

      {/* Tab 1: Biometrik & Offline Aula */}
      {activeTab === 'biometric' && (
        <div className="space-y-6">
          <OfflineAttendanceScanner
            meetingId={meetingId}
            title={meetingTitle}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
          />
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              Perangkat belum didaftarkan? Buka tab <strong>Kelola Passkey</strong> untuk mendaftarkan HP.
            </span>
            <button
              onClick={() => setActiveTab('passkey_manage')}
              className="font-bold underline ml-2 shrink-0"
            >
              Daftar Sekarang →
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Scan QR Kamera HP */}
      {activeTab === 'camera_qr' && (
        <CameraQRScanner currentUserId={currentUserId} />
      )}

      {/* Tab 3: Kelola Passkey Perangkat Kader */}
      {activeTab === 'passkey_manage' && (
        <div className="space-y-4">
          <PasskeyEnrollment />
        </div>
      )}
    </div>
  )
}
