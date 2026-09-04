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
      <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex overflow-x-auto no-scrollbar gap-1.5 max-w-lg mx-auto w-full">
        <button
          type="button"
          onClick={() => setActiveTab('biometric')}
          className={`flex-1 min-w-[100px] py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition shrink-0 ${
            activeTab === 'biometric'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Fingerprint className="w-4 h-4 shrink-0" />
          <span className="sm:hidden">Biometrik</span>
          <span className="hidden sm:inline">Biometrik & Offline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('camera_qr')}
          className={`flex-1 min-w-[95px] py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition shrink-0 ${
            activeTab === 'camera_qr'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <QrCode className="w-4 h-4 shrink-0" />
          <span className="sm:hidden">Scan QR</span>
          <span className="hidden sm:inline">Scan QR Kamera</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('passkey_manage')}
          className={`flex-1 min-w-[100px] py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition shrink-0 ${
            activeTab === 'passkey_manage'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span className="sm:hidden">Passkey</span>
          <span className="hidden sm:inline">Kelola Passkey</span>
        </button>
      </div>

      {/* Tab 1: Biometrik & Offline Aula */}
      {activeTab === 'biometric' && (
        <div className="space-y-4 max-w-lg mx-auto w-full">
          <OfflineAttendanceScanner
            meetingId={meetingId}
            title={meetingTitle}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            onSwitchToPasskey={() => setActiveTab('passkey_manage')}
          />
          <div className="p-4 rounded-2xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5 min-w-0">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                Perangkat belum didaftarkan? Buka tab <strong>Kelola Passkey</strong> untuk mendaftarkan HP.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('passkey_manage')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shrink-0 shadow-xs active:scale-95 whitespace-nowrap self-stretch sm:self-auto"
            >
              <span>Daftar Sekarang</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Scan QR Kamera HP */}
      {activeTab === 'camera_qr' && (
        <div className="max-w-lg mx-auto w-full">
          <CameraQRScanner currentUserId={currentUserId} />
        </div>
      )}

      {/* Tab 3: Kelola Passkey Perangkat Kader */}
      {activeTab === 'passkey_manage' && (
        <div className="space-y-4 max-w-lg mx-auto w-full">
          <PasskeyEnrollment />
        </div>
      )}
    </div>
  )
}
