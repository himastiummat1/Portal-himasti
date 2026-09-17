'use client'

import { useState } from 'react'
import { QrCode, Calendar, Fingerprint, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react'
import OfflineAttendanceScanner from '@/components/OfflineAttendanceScanner'
import PasskeyEnrollment from '@/components/PasskeyEnrollment'
import CameraQRScanner from './CameraQRScanner'

interface MeetingItem {
  id: number
  title: string
  description: string
  type: string
  location: string
  event_date: string
  is_active: boolean
}

interface AbsenTabsProps {
  meetingId: number
  meetingTitle: string
  currentUserId: number
  currentUserName: string
  activeMeetings?: MeetingItem[]
  attendedMap?: Record<number, string>
}

export default function AbsenTabs({
  meetingId,
  meetingTitle,
  currentUserId,
  currentUserName,
  activeMeetings = [],
  attendedMap = {},
}: AbsenTabsProps) {
  const [activeTab, setActiveTab] = useState<'camera_qr' | 'active_meetings' | 'biometric'>('camera_qr')
  const [showPasskeyEnroll, setShowPasskeyEnroll] = useState(false)

  return (
    <div className="space-y-6">
      {/* Friendly Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex overflow-x-auto gap-1.5 max-w-lg mx-auto w-full">
        <button
          type="button"
          onClick={() => setActiveTab('camera_qr')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0 ${
            activeTab === 'camera_qr'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <QrCode className="w-4 h-4 shrink-0" />
          <span>Scan QR Rapat</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('active_meetings')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0 ${
            activeTab === 'active_meetings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span>Rapat Aktif ({activeMeetings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('biometric')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0 ${
            activeTab === 'biometric'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Fingerprint className="w-4 h-4 shrink-0" />
          <span>Sidik Jari (Opsional)</span>
        </button>
      </div>

      {/* TAB 1: Scan QR Kamera (Pilihan Utama yang Paling User-Friendly) */}
      {activeTab === 'camera_qr' && (
        <div className="max-w-lg mx-auto w-full">
          <CameraQRScanner 
            currentUserId={currentUserId} 
            defaultMeetingId={meetingId || (activeMeetings.length > 0 ? activeMeetings[0].id : undefined)}
          />
        </div>
      )}

      {/* TAB 2: Agenda Rapat Aktif Hari Ini */}
      {activeTab === 'active_meetings' && (
        <div className="max-w-lg mx-auto w-full space-y-3.5">
          {activeMeetings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">Tidak ada rapat yang sedang aktif</h3>
              <p className="text-xs text-slate-400 mt-1">
                Sesi presensi akan dibuka saat panitia atau pengurus mengaktifkan jadwal pertemuan.
              </p>
            </div>
          ) : (
            activeMeetings.map((meeting) => {
              const attendedTime = attendedMap[meeting.id]
              const isAttended = !!attendedTime

              return (
                <div
                  key={meeting.id}
                  className={`bg-white rounded-2xl p-5 border transition-all shadow-xs ${
                    isAttended
                      ? 'border-emerald-200 bg-emerald-50/15'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {meeting.type.replace('_', ' ')}
                    </span>
                    {isAttended ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sudah Hadir
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" /> Sesi Sedang Dibuka
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{meeting.title}</h3>
                  <div className="space-y-1 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{meeting.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(meeting.event_date).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
                    </div>
                  </div>

                  {isAttended ? (
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                      <span>Kehadiran Anda telah tercatat</span>
                      <span className="font-mono font-bold">
                        {new Date(attendedTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab('camera_qr')}
                      className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Scan QR Rapat Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* TAB 3: Biometrik & Passkey (Opsional bagi yang ingin tanpa scan) */}
      {activeTab === 'biometric' && (
        <div className="max-w-lg mx-auto w-full space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-xs text-slate-600 leading-relaxed">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Presensi Cepat via Sidik Jari</h4>
            <p>
              Jika perangkat HP Anda mendukung Touch ID, Face ID, atau sensor sidik jari, Anda dapat melakukan presensi secara langsung tanpa perlu scan QR kamera.
            </p>
          </div>

          <OfflineAttendanceScanner
            meetingId={meetingId}
            title={meetingTitle}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            onSwitchToPasskey={() => setShowPasskeyEnroll(true)}
          />

          {showPasskeyEnroll && (
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <PasskeyEnrollment />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
