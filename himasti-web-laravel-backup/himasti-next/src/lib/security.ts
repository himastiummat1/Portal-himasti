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

    const privilegedNames = ['admin', 'superadmin', 'panitia', 'pengurus', 'sekretaris', 'ketua']
    return userRoles.some((ur) => privilegedNames.includes(ur.role.name.toLowerCase()))
  } catch (err) {
    console.error('Role check error:', err)
    return false
  }
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
