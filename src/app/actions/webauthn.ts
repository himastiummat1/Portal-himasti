'use server'

import { getSessionUser } from '@/lib/auth-session'
import { prisma } from '@/lib/prisma'
import {
  getRegistrationOptionsForUser,
  verifyAndSaveRegistration,
  getAuthenticationOptionsForAttendance,
  verifyAttendanceAssertion,
} from '@/lib/webauthn-server'
import { isUserAdminOrPanitia, sanitizeString } from '@/lib/security'
import type { RegistrationResponseJSON, AuthenticationResponseJSON } from '@simplewebauthn/server'

/**
 * Server Action: Minta opsi tantangan untuk mendaftarkan chip keamanan / Passkey HP
 */
export async function getRegistrationOptionsAction() {
  const user = await getSessionUser()
  if (!user) {
    return { error: 'Anda harus login terlebih dahulu.' }
  }

  try {
    const options = await getRegistrationOptionsForUser(
      BigInt(user.id),
      user.email,
      user.name
    )
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
  const user = await getSessionUser()
  if (!user) {
    return { error: 'Anda harus login terlebih dahulu.' }
  }

  try {
    const cleanName = sanitizeString(deviceName, 80) || 'Perangkat Fisik Kader'
    const result = await verifyAndSaveRegistration(
      BigInt(user.id),
      response,
      cleanName
    )
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
 * Server Action: Minta opsi autentikasi untuk presensi acara
 */
export async function getAttendanceOptionsAction() {
  const user = await getSessionUser()
  if (!user) {
    return { error: 'Anda harus login terlebih dahulu.' }
  }

  try {
    const options = await getAuthenticationOptionsForAttendance(BigInt(user.id))
    return { success: true, options }
  } catch (error) {
    console.error('getAttendanceOptionsAction error:', error)
    return { error: error instanceof Error ? error.message : 'Gagal menyiapkan sesi presensi biometrik.' }
  }
}

/**
 * Server Action: Verifikasi tanda tangan hardware fisik & simpan presensi anti-joki
 */
export async function submitWebAuthnAttendanceAction(payload: {
  eventId: number | string
  response: AuthenticationResponseJSON
  catatan?: string
  deviceInfo?: string
}) {
  const user = await getSessionUser()
  if (!user) {
    return { error: 'Anda harus login terlebih dahulu.' }
  }

  let eventIdBig: bigint
  try {
    eventIdBig = BigInt(payload.eventId)
  } catch {
    return { error: 'ID Acara tidak valid.' }
  }

  try {
    const verification = await verifyAttendanceAssertion(
      BigInt(user.id),
      payload.response
    )

    // Cek apakah sudah absen di event ini (Anti-Duplikasi)
    const existing = await prisma.absensis.findFirst({
      where: {
        event_id: eventIdBig,
        user_id: BigInt(user.id),
      },
    })

    if (existing) {
      return {
        error: 'Anda sudah tercatat hadir pada kegiatan ini.',
        waktuHadir: existing.waktu_hadir.toISOString(),
      }
    }

    const cleanCatatan = sanitizeString(payload.catatan, 200) || 'Hadir via Hardware WebAuthn'
    const cleanDeviceInfo = sanitizeString(payload.deviceInfo || verification.deviceName, 150) || 'Secure Enclave'

    const attendance = await prisma.absensis.create({
      data: {
        event_id: eventIdBig,
        user_id: BigInt(user.id),
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
      message: 'Presensi berhasil diverifikasi oleh chip keamanan HP fisik (Anti-Joki Validated)!',
      attendanceId: attendance.id.toString(),
      waktuHadir: attendance.waktu_hadir.toISOString(),
    }
  } catch (error) {
    console.error('submitWebAuthnAttendanceAction error:', error)
    return { error: error instanceof Error ? error.message : 'Presensi ditolak oleh sistem keamanan.' }
  }
}

/**
 * Server Action: Sinkronisasi batch presensi offline dari IndexedDB lokal ke server
 * Dilindungi otorisasi peran (Panitia/Admin) atau pembatasan ketat hanya untuk data akun sendiri
 */
export async function syncOfflineAttendancesAction(records: Array<{
  local_id?: number
  event_id: string | number
  user_id: string | number
  status_kehadiran: string
  catatan?: string
  verification_method: string
  hardware_proof?: string
  device_info?: string
  waktu_hadir: string
}>) {
  const currentUser = await getSessionUser()
  if (!currentUser) {
    return { error: 'Autentikasi diperlukan untuk menyinkronkan data presensi.' }
  }

  if (!records || records.length === 0) {
    return { success: true, count: 0 }
  }

  // Batasi batch maksimum untuk mencegah DoS / kelebihan muatan
  if (records.length > 500) {
    return { error: 'Ukuran batch melebihi batas maksimum (500 data).' }
  }

  const currentUserIdBig = BigInt(currentUser.id)
  const isPrivileged = await isUserAdminOrPanitia(currentUserIdBig)

  try {
    const batchId = `offline-batch-${Date.now()}`
    let syncedCount = 0

    for (const item of records) {
      let eventIdBig: bigint
      let userIdBig: bigint

      try {
        eventIdBig = BigInt(item.event_id)
        userIdBig = BigInt(item.user_id)
      } catch {
        continue // Lewati format data ID yang rusak/tidak valid
      }

      // OTORISASI KEAMANAN (Anti-Spoofing / Anti-IDOR):
      // Jika bukan Panitia/Admin, kader HANYA boleh menyinkronkan data atas nama dirinya sendiri
      if (!isPrivileged && userIdBig.toString() !== currentUser.id) {
        console.warn(`[Security Alert] User ${currentUser.id} mencoba memalsukan presensi user ${userIdBig}`)
        continue
      }

      // Cek apakah sudah tercatat hadir
      const exists = await prisma.absensis.findFirst({
        where: {
          event_id: eventIdBig,
          user_id: userIdBig,
        },
      })

      if (!exists) {
        let validDate = new Date(item.waktu_hadir)
        if (isNaN(validDate.getTime())) {
          validDate = new Date()
        }

        await prisma.absensis.create({
          data: {
            event_id: eventIdBig,
            user_id: userIdBig,
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

    // Catat log sinkronisasi
    await prisma.offline_sync_logs.create({
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
  const user = await getSessionUser()
  if (!user) return { devices: [] }

  try {
    const devices = await prisma.webauthn_credentials.findMany({
      where: { user_id: BigInt(user.id) },
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
  const user = await getSessionUser()
  if (!user) return { error: 'Akses ditolak.' }

  try {
    await prisma.webauthn_credentials.deleteMany({
      where: {
        credential_id: credentialId,
        user_id: BigInt(user.id),
      },
    })

    return { success: true, message: 'Perangkat berhasil dihapus.' }
  } catch (error) {
    return { error: 'Gagal menghapus perangkat.' }
  }
}
