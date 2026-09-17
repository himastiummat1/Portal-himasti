import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

const SECRET_KEY = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'himasti-secret-salt-2026'

/**
 * Cek apakah user memiliki peran Admin, Panitia, atau Pengurus di himasti-next
 */
export async function isUserAdminOrPanitia(userId: number): Promise<boolean> {
  try {
    const userRoles = await prisma.modelHasRole.findMany({
      where: { model_id: userId },
      include: { role: true },
    })

    if (userRoles.length === 0) return false

    const privilegedNames = ['admin', 'superadmin', 'panitia', 'pengurus', 'sekretaris', 'ketua', 'bendahara', 'kabid', 'anggota']
    return userRoles.some((ur) => privilegedNames.some(p => ur.role.name.toLowerCase().includes(p)))
  } catch (err) {
    console.error('Role check error:', err)
    return false
  }
}

/**
 * RBAC Permission Helpers
 * 1. Super Admin: Root access (RBAC, Audit Logs, change roles)
 * 2. BPH Khusus:
 *    - Ketua & Wakil: Executive oversight
 *    - Sekretaris: Persuratan & Notulensi Rapat
 *    - Bendahara: Keuangan & Kas
 * 3. Bidang (Semua Ketua Bidang & Anggota Bidang memiliki HAK AKSES YANG SETARA):
 *    - Rapat & Presensi, Divisi, Artikel, Akademik, Kader
 *    - Di bawah hak akses khusus (tidak dapat mengakses/mengubah Keuangan kas utama, Surat resmi, dan RBAC)
 */
export function isSuperAdminRole(roles: string[]): boolean {
  return roles.some(r => r === 'super_admin' || r === 'superadmin');
}

export function isKetuaOrWakilRole(roles: string[]): boolean {
  return roles.some(r => r === 'ketua_himpunan' || r === 'wakil_ketua' || r === 'wakil_ketua_himpunan' || (r.includes('ketua') && !r.includes('bidang')));
}

export function isSekretarisRole(roles: string[]): boolean {
  return roles.some(r => r.includes('sekretaris'));
}

export function isBendaharaRole(roles: string[]): boolean {
  return roles.some(r => r.includes('bendahara'));
}

export function isKabidRole(roles: string[]): boolean {
  return roles.some(r => r.includes('kabid') || r.includes('ketua_bidang'));
}

export function isAnggotaBidangRole(roles: string[]): boolean {
  return roles.some(r => r.includes('anggota') || r.includes('panitia'));
}

// Hak akses yang SAMA untuk semua Ketua Bidang dan Anggota Bidang
export function isStaffBidangRole(roles: string[]): boolean {
  return isKabidRole(roles) || isAnggotaBidangRole(roles);
}

// Pengurus Inti Khusus (BPH + Super Admin)
export function isBPHKhususRole(roles: string[]): boolean {
  return isSuperAdminRole(roles) || isKetuaOrWakilRole(roles) || isSekretarisRole(roles) || isBendaharaRole(roles);
}

// Seluruh Pengurus (BPH + Semua Ketua Bidang + Semua Anggota Bidang)
export function isAllPengurusRole(roles: string[]): boolean {
  return isBPHKhususRole(roles) || isStaffBidangRole(roles);
}

/**
 * Tanda tangani challenge WebAuthn dengan HMAC-SHA256 yang terikat ke User ID & Waktu
 * Mencegah pemalsuan challenge antar-user, replay attack, dan tamper sesi
 */
export function signChallengeToken(challenge: string, userId: string, action: 'reg' | 'auth'): string {
  const payload = JSON.stringify({
    challenge,
    userId,
    action,
    exp: Date.now() + 5 * 60 * 1000, // 5 menit
  })

  const b64 = Buffer.from(payload).toString('base64url')
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(b64).digest('hex')
  return `${b64}.${signature}`
}

/**
 * Verifikasi token challenge WebAuthn dengan constant-time equality (anti timing attacks)
 */
export function verifyAndExtractChallenge(
  token: string,
  expectedUserId: string,
  expectedAction: 'reg' | 'auth'
): string | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null

    const [b64, signature] = parts
    const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(b64).digest('hex')

    const sigBuf = Buffer.from(signature)
    const expBuf = Buffer.from(expectedSig)

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null // Tanda tangan HMAC tidak valid
    }

    const data = JSON.parse(Buffer.from(b64, 'base64url').toString('utf-8'))

    // Validasi masa berlaku
    if (typeof data.exp !== 'number' || Date.now() > data.exp) {
      return null
    }

    // Validasi kepemilikan User ID
    if (data.userId !== expectedUserId || data.action !== expectedAction) {
      return null
    }

    return data.challenge as string
  } catch {
    return null
  }
}

/**
 * Sanitasi string input agar bebas dari injeksi atau data berlebih
 */
export function sanitizeString(val: string | null | undefined, maxLen = 255): string {
  if (!val) return ''
  return val.trim().slice(0, maxLen).replace(/[\r\n\t]/g, ' ')
}
