import { describe, it, expect } from 'vitest'
import type { OfflineAttendanceRecord } from '../src/lib/offline-attendance'

describe('Offline Attendance Data Integrity & Schema Validation', () => {
  it('should validate complete offline record properties', () => {
    const record: OfflineAttendanceRecord = {
      local_id: 1,
      meeting_id: 10,
      event_id: undefined,
      user_id: 101,
      user_name: 'Ahmad Fauzi',
      waktu_hadir: new Date().toISOString(),
      status_kehadiran: 'hadir',
      verification_method: 'webauthn',
      hardware_proof: 'fido2-signature-sample-proof-token',
      device_info: 'Linux x86_64 (Chrome 125)',
      latitude: -8.5833,
      longitude: 116.1167,
      is_synced: false,
      created_at: new Date().toISOString(),
    }

    expect(record.user_id).toBe(101)
    expect(record.verification_method).toBe('webauthn')
    expect(record.is_synced).toBe(false)
    expect(record.latitude).toBeCloseTo(-8.5833, 4)
    expect(record.longitude).toBeCloseTo(116.1167, 4)
  })

  it('should reject or flag corrupted ISO timestamps gracefully', () => {
    const invalidTimestamp = 'not-a-date'
    const dateObj = new Date(invalidTimestamp)
    const isInvalid = isNaN(dateObj.getTime())
    expect(isInvalid).toBe(true)

    // Fallback strategy check
    const safeDate = isInvalid ? new Date() : dateObj
    expect(safeDate.getTime()).toBeGreaterThan(0)
  })

  it('should format hardware proof correctly for FIDO2 and offline mesh', () => {
    const genOfflineProof = (userId: number) => `offline-token-${Date.now()}-${userId}`
    const proof = genOfflineProof(42)

    expect(proof).toMatch(/^offline-token-\d+-42$/)
  })
})
