'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  getRegistrationOptionsForUser,
  verifyAndSaveRegistration,
  getAuthenticationOptionsForAttendance,
  verifyAttendanceAssertion,
} from '@/lib/webauthn-server'
import { isUserAdminOrPanitia, sanitizeString } from '@/lib/security'
type RegistrationResponseJSON = any
type AuthenticationResponseJSON = any

/**
 * Server Action: Minta opsi tantangan untuk mendaftarkan chip keamanan / Passkey HP
 */
export async function getRegistrationOptionsAction() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Anda harus login terlebih dahulu.' }
  }

  const userId = parseInt(session.user.id)
  const email = session.user.email || `kader-${userId}@himasti.org`
  const name = session.user.name || 'Kader HIMASTI'

  try {
    const options = await getRegistrationOptionsForUser(userId, email, name)
    return { success: true, options }
  } catch (error) {
    console.error('getRegistrationOptionsAction error:', error)
    return { error: error instanceof Error ? error.message : 'Gagal menyiapkan pendaftaran Passkey.' }
  }
}

/**
 * Server Action: Verifikasi dan simpan Passkey perangkat fisik kader
 */
export async function verifyRegistrationAction(
  response: RegistrationResponseJSON,
  deviceName: string = 'Perangkat Kader'
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Anda harus login terlebih dahulu.' }
  }

  const userId = parseInt(session.user.id)

  try {
    const cleanName = sanitizeString(deviceName, 80) || 'Perangkat Fisik Kader'
    const result = await verifyAndSaveRegistration(userId, response, cleanName)
    return {
      success: true,
      message: 'Perangkat fisik (Secure Enclave / Biometrik) berhasil ditautkan ke akun Anda!',
      credentialId: result.credentialId,
    }
  } catch (error) {
    console.error('verifyRegistrationAction error:', error)
    return { error: error instanceof Error ? error.message : 'Verifikasi keamanan perangkat gagal.' }
  }
}

/**
 * Server Action: Minta opsi autentikasi untuk presensi acara / rapat
 */
export async function getAttendanceOptionsAction() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Anda harus login terlebih dahulu.' }
  }

  const userId = parseInt(session.user.id)

  // Cek apakah user sudah mendaftarkan perangkat fisik/biometrik
  const userCredentials = await prisma.webAuthnCredential.findMany({
    where: { user_id: userId },
    select: { id: true },
  })

  if (userCredentials.length === 0) {
    return {
      error: 'Anda belum mendaftarkan sidik jari/perangkat fisik pada akun ini. Silakan gulir ke bawah dan klik "Tautkan Perangkat Biometrik Baru" terlebih dahulu.',
      notEnrolled: true,
    }
  }

  try {
    const options = await getAuthenticationOptionsForAttendance(userId)
    return { success: true, options }
  } catch (error) {
    console.error('getAttendanceOptionsAction error:', error)
    return { error: error instanceof Error ? error.message : 'Gagal menyiapkan sesi presensi biometrik.' }
  }
}

/**
 * Server Action: Verifikasi tanda tangan hardware fisik & simpan presensi anti-joki (Meeting / Event)
 */
export async function submitWebAuthnAttendanceAction(payload: {
  meetingId?: number
  eventId?: number
  response: AuthenticationResponseJSON
  catatan?: string
  deviceInfo?: string
  lat?: number | null
  lng?: number | null
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Anda harus login terlebih dahulu.' }
  }

  const userId = parseInt(session.user.id)

  try {
    const verification = await verifyAttendanceAssertion(userId, payload.response)
    const cleanCatatan = sanitizeString(payload.catatan, 200) || 'Hadir via Hardware Passkey'
    const cleanDeviceInfo = sanitizeString(payload.deviceInfo || verification.deviceName, 150) || 'Secure Enclave'

    // 1. Jika presensi Rapat (MeetingAttendance)
    if (payload.meetingId) {
      const existing = await prisma.meetingAttendance.findUnique({
        where: {
          meeting_id_user_id: {
            meeting_id: payload.meetingId,
            user_id: userId,
          },
        },
      })

      if (existing) {
        return {
          error: 'Anda sudah tercatat hadir pada rapat ini.',
          waktuHadir: existing.waktu_hadir.toISOString(),
        }
      }

      const attendance = await prisma.meetingAttendance.create({
        data: {
          meeting_id: payload.meetingId,
          user_id: userId,
          waktu_hadir: new Date(),
          status_kehadiran: 'hadir',
          latitude_scan: payload.lat || null,
          longitude_scan: payload.lng || null,
          verification_method: 'webauthn',
          hardware_proof: `passkey:${verification.credentialId}`,
          device_info: cleanDeviceInfo,
          is_offline_sync: false,
          synced_at: new Date(),
        },
      })

      return {
        success: true,
        message: 'Presensi rapat berhasil diverifikasi oleh chip keamanan HP fisik (Anti-Joki)!',
        attendanceId: attendance.id.toString(),
        waktuHadir: attendance.waktu_hadir.toISOString(),
      }
    }

    // 2. Jika presensi Kegiatan / Acara (Absensi)
    if (payload.eventId) {
      const existing = await prisma.absensi.findFirst({
        where: {
          event_id: payload.eventId,
          user_id: userId,
        },
      })

      if (existing) {
        return {
          error: 'Anda sudah tercatat hadir pada kegiatan ini.',
          waktuHadir: existing.waktu_hadir.toISOString(),
        }
      }

      const attendance = await prisma.absensi.create({
        data: {
          event_id: payload.eventId,
          user_id: userId,
          waktu_hadir: new Date(),
          status_kehadiran: 'hadir',
          catatan: cleanCatatan,
          verification_method: 'webauthn',
          hardware_proof: `passkey:${verification.credentialId}`,
          device_info: cleanDeviceInfo,
          is_offline_sync: false,
          synced_at: new Date(),
        },
      })

      return {
        success: true,
        message: 'Presensi kegiatan berhasil diverifikasi oleh chip keamanan HP fisik (Anti-Joki)!',
        attendanceId: attendance.id.toString(),
        waktuHadir: attendance.waktu_hadir.toISOString(),
      }
    }

    return { error: 'ID Rapat atau ID Kegiatan wajib ditentukan.' }
  } catch (error) {
    console.error('submitWebAuthnAttendanceAction error:', error)
    return { error: error instanceof Error ? error.message : 'Presensi ditolak oleh sistem keamanan.' }
  }
}

/**
 * Server Action: Sinkronisasi batch presensi offline dari IndexedDB lokal ke server
 */
export async function syncOfflineAttendancesAction(records: Array<{
  local_id?: number
  meeting_id?: number
  event_id?: number
  user_id: number
  status_kehadiran: string
  catatan?: string
  verification_method: string
  hardware_proof?: string
  device_info?: string
  waktu_hadir: string
  latitude?: number | null
  longitude?: number | null
}>) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Autentikasi diperlukan untuk menyinkronkan data presensi.' }
  }

  if (!records || records.length === 0) {
    return { success: true, count: 0 }
  }

  if (records.length > 500) {
    return { error: 'Ukuran batch melebihi batas maksimum (500 data).' }
  }

  const currentUserId = parseInt(session.user.id)
  const isPrivileged = await isUserAdminOrPanitia(currentUserId)

  try {
    const batchId = `offline-batch-${Date.now()}`
    let syncedCount = 0

    for (const item of records) {
      if (!isPrivileged && item.user_id !== currentUserId) {
        console.warn(`[Security Alert] User ${currentUserId} mencoba menyinkronkan presensi milik user ${item.user_id}`)
        continue
      }

      let validDate = new Date(item.waktu_hadir)
      if (isNaN(validDate.getTime())) validDate = new Date()

      // Sinkronkan ke MeetingAttendance
      if (item.meeting_id) {
        const exists = await prisma.meetingAttendance.findUnique({
          where: {
            meeting_id_user_id: {
              meeting_id: item.meeting_id,
              user_id: item.user_id,
            },
          },
        })

        if (!exists) {
          await prisma.meetingAttendance.create({
            data: {
              meeting_id: item.meeting_id,
              user_id: item.user_id,
              waktu_hadir: validDate,
              status_kehadiran: sanitizeString(item.status_kehadiran, 50) || 'hadir',
              latitude_scan: item.latitude || null,
              longitude_scan: item.longitude || null,
              verification_method: 'offline_mesh',
              hardware_proof: sanitizeString(item.hardware_proof, 255) || 'offline-token',
              device_info: sanitizeString(item.device_info, 150) || 'Local Mesh Node',
              is_offline_sync: true,
              synced_at: new Date(),
            },
          })
          syncedCount++
        }
      }

      // Sinkronkan ke Absensi Event
      if (item.event_id) {
        const exists = await prisma.absensi.findFirst({
          where: {
            event_id: item.event_id,
            user_id: item.user_id,
          },
        })

        if (!exists) {
          await prisma.absensi.create({
            data: {
              event_id: item.event_id,
              user_id: item.user_id,
              waktu_hadir: validDate,
              status_kehadiran: sanitizeString(item.status_kehadiran, 50) || 'hadir',
              catatan: sanitizeString(item.catatan, 200) || 'Offline Sync Aula',
              verification_method: 'offline_mesh',
              hardware_proof: sanitizeString(item.hardware_proof, 255) || 'offline-token',
              device_info: sanitizeString(item.device_info, 150) || 'Local Mesh Node',
              is_offline_sync: true,
              synced_at: new Date(),
            },
          })
          syncedCount++
        }
      }
    }

    await prisma.offlineSyncLog.create({
      data: {
        batch_id: batchId,
        device_id: sanitizeString(records[0]?.device_info, 100) || 'Unknown-Device',
        total_records: records.length,
        synced_records: syncedCount,
        status: 'success',
      },
    })

    return {
      success: true,
      syncedCount,
      totalCount: records.length,
      batchId,
    }
  } catch (error) {
    console.error('syncOfflineAttendancesAction error:', error)
    return { error: error instanceof Error ? error.message : 'Gagal menyinkronkan data presensi offline.' }
  }
}

/**
 * Server Action: Daftar perangkat passkey yang terdaftar milik user aktif
 */
export async function getUserRegisteredDevicesAction() {
  const session = await auth()
  if (!session?.user?.id) return { devices: [] }

  const userId = parseInt(session.user.id)

  try {
    const devices = await prisma.webAuthnCredential.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        credential_id: true,
        device_name: true,
        device_type: true,
        created_at: true,
        last_used_at: true,
      },
      orderBy: { created_at: 'desc' },
    })

    return {
      devices: devices.map((d) => ({
        id: d.id.toString(),
        credential_id: d.credential_id,
        device_name: d.device_name || 'HP Kader',
        device_type: d.device_type,
        created_at: d.created_at?.toISOString() || null,
        last_used_at: d.last_used_at?.toISOString() || null,
      })),
    }
  } catch (error) {
    console.error('getUserRegisteredDevicesAction error:', error)
    return { devices: [] }
  }
}

/**
 * Server Action: Hapus perangkat terdaftar milik user aktif
 */
export async function deleteUserDeviceAction(credentialId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Akses ditolak.' }

  const userId = parseInt(session.user.id)

  try {
    await prisma.webAuthnCredential.deleteMany({
      where: {
        credential_id: credentialId,
        user_id: userId,
      },
    })

    return { success: true, message: 'Perangkat berhasil dihapus.' }
  } catch (error) {
    return { error: 'Gagal menghapus perangkat.' }
  }
}
