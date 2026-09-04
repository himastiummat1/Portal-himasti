import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { syncOfflineAttendancesAction } from '@/app/actions/webauthn'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Sesi tidak valid atau telah berakhir. Harap login kembali.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const records = Array.isArray(body) ? body : body.records

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: 'Tidak ada data presensi untuk disinkronkan.' })
    }

    const result = await syncOfflineAttendancesAction(records)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      syncedCount: result.syncedCount,
      message: `Berhasil menyinkronkan ${result.syncedCount} data presensi offline.`,
    })
  } catch (error: any) {
    console.error('API /api/absen/sync error:', error)
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan internal server saat sinkronisasi presensi.' },
      { status: 500 }
    )
  }
}
