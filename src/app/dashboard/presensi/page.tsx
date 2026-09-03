import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import OfflineAttendanceScanner from '@/components/OfflineAttendanceScanner'
import { ArrowLeft, Calendar, ShieldCheck } from 'lucide-react'

const SECRET_KEY = process.env.JWT_SECRET || 'himasti-super-secret-key-2026'
const key = new TextEncoder().encode(SECRET_KEY)

export default async function PresensiPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    redirect('/login')
  }

  let user: { id: string; email: string; name: string } | null = null
  try {
    const { payload } = await jwtVerify(token, key)
    user = {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
    }
  } catch {
    redirect('/login')
  }

  // Ambil event aktif atau buat fallback event untuk demonstrasi presensi
  let activeEvent: { id: string; nama_event: string; deskripsi: string } | null = null

  try {
    const events = await prisma.events.findMany({
      orderBy: { id: 'desc' },
      take: 1,
    })

    if (events.length > 0) {
      activeEvent = {
        id: events[0].id.toString(),
        nama_event: events[0].nama_event,
        deskripsi: events[0].deskripsi,
      }
    }
  } catch (err) {
    console.error('Failed to load events:', err)
  }

  if (!activeEvent) {
    activeEvent = {
      id: '1',
      nama_event: 'Latihan Keterampilan Manajemen Mahasiswa (LKMM-TD)',
      deskripsi: 'Pelatihan dasar kepemimpinan dan manajemen organisasi HIMASTI di Aula Kampus.',
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            Alpha Phase 1 Active
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Presensi Biometrik & Offline Aula
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sistem presensi anti-titip absen dengan enkripsi hardware chip (WebAuthn / Passkeys) dan ketahanan offline total.
          </p>
        </div>

        <OfflineAttendanceScanner
          eventId={activeEvent.id}
          eventName={activeEvent.nama_event}
          currentUserId={user.id}
          currentUserName={user.name}
        />
      </div>
    </div>
  )
}
