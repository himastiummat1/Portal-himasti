import { headers, cookies } from 'next/headers'
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import { prisma } from '@/lib/prisma'
import { signChallengeToken, verifyAndExtractChallenge, sanitizeString } from '@/lib/security'

const CHALLENGE_COOKIE_NAME = 'himasti_webauthn_challenge'

export async function getWebAuthnConfig() {
  const headerList = await headers()
  const hostHeader = headerList.get('host') || 'localhost:3000'
  const proto = headerList.get('x-forwarded-proto') || (hostHeader.startsWith('localhost') ? 'http' : 'https')
  
  const rpID = process.env.WEBAUTHN_RP_ID || hostHeader.split(':')[0]
  const origin = process.env.WEBAUTHN_ORIGIN || `${proto}://${hostHeader}`

  return {
    rpName: 'Portal HIMASTI',
    rpID,
    origin,
  }
}

/**
 * Buat tantangan (challenge) pendaftaran Hardware Passkey / Biometrik kader
 */
export async function getRegistrationOptionsForUser(userId: number, email: string, name: string) {
  const { rpName, rpID } = await getWebAuthnConfig()

  const existingCredentials = await prisma.webAuthnCredential.findMany({
    where: { user_id: userId },
    select: { credential_id: true, transports: true },
  })

  const excludeCredentials = existingCredentials.map((cred) => ({
    id: isoBase64URL.toBuffer(cred.credential_id),
    type: 'public-key' as const,
    transports: cred.transports ? (cred.transports.split(',') as AuthenticatorTransport[]) : undefined,
  }))

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: userId.toString(),
    userName: email,
    userDisplayName: name,
    attestationType: 'none',
    excludeCredentials,
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform', // Chip fisik perangkat HP (Fingerprint/FaceID/Knox)
    },
  })

  const signedChallenge = signChallengeToken(options.challenge, userId.toString(), 'reg')
  const cookieStore = await cookies()
  cookieStore.set(CHALLENGE_COOKIE_NAME, signedChallenge, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 300,
  })

  return options
}

/**
 * Verifikasi dan simpan kredensial chip fisik hardware kader ke database
 */
export async function verifyAndSaveRegistration(
  userId: number,
  response: any,
  deviceName: string = 'Perangkat Kader'
) {
  const cookieStore = await cookies()
  const rawCookie = cookieStore.get(CHALLENGE_COOKIE_NAME)?.value

  cookieStore.delete(CHALLENGE_COOKIE_NAME)

  if (!rawCookie) {
    throw new Error('Sesi pendaftaran biometrik telah kedaluwarsa. Silakan ulangi.')
  }

  const expectedChallenge = verifyAndExtractChallenge(rawCookie, userId.toString(), 'reg')
  if (!expectedChallenge) {
    throw new Error('Integritas keamanan challenge gagal. Akses ditolak (Anti-Tampering).')
  }

  const { rpID, origin } = await getWebAuthnConfig()

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  })

  if (!verification.verified || !verification.registrationInfo) {
    throw new Error('Verifikasi hardware security gagal. Pastikan sidik jari/FaceID valid.')
  }

  const { credentialID, credentialPublicKey, counter, credentialDeviceType, credentialBackedUp, aaguid } = verification.registrationInfo
  const publicKeyBase64 = isoBase64URL.fromBuffer(credentialPublicKey)
  const credentialIdStr = response.id || isoBase64URL.fromBuffer(credentialID)
  const cleanDeviceName = sanitizeString(deviceName, 100) || 'HP Fisik Kader'

  const savedCred = await prisma.webAuthnCredential.create({
    data: {
      user_id: userId,
      credential_id: credentialIdStr,
      public_key: publicKeyBase64,
      counter: BigInt(counter),
      device_type: credentialDeviceType,
      backed_up: credentialBackedUp,
      transports: response.response?.transports?.join(',') || null,
      device_name: cleanDeviceName,
      aaguid: aaguid || null,
    },
  })

  return {
    success: true,
    credentialId: savedCred.credential_id,
  }
}

/**
 * Generate opsi autentikasi untuk presensi rapat/acara
 */
export async function getAuthenticationOptionsForAttendance(userId?: number) {
  const { rpID } = await getWebAuthnConfig()

  let allowCredentials = undefined

  if (userId) {
    const userCredentials = await prisma.webAuthnCredential.findMany({
      where: { user_id: userId },
      select: { credential_id: true, transports: true },
    })

    if (userCredentials.length > 0) {
      allowCredentials = userCredentials.map((cred) => ({
        id: isoBase64URL.toBuffer(cred.credential_id),
        type: 'public-key' as const,
        transports: cred.transports ? (cred.transports.split(',') as AuthenticatorTransport[]) : undefined,
      }))
    }
  }

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
    allowCredentials,
  })

  const signedChallenge = signChallengeToken(options.challenge, userId ? userId.toString() : 'any', 'auth')
  const cookieStore = await cookies()
  cookieStore.set(CHALLENGE_COOKIE_NAME, signedChallenge, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 300,
  })

  return options
}

/**
 * Verifikasi tanda tangan hardware (Hardware-Grade Verification) untuk presensi anti-joki
 */
export async function verifyAttendanceAssertion(
  userId: number,
  response: any
) {
  const cookieStore = await cookies()
  const rawCookie = cookieStore.get(CHALLENGE_COOKIE_NAME)?.value

  cookieStore.delete(CHALLENGE_COOKIE_NAME)

  if (!rawCookie) {
    throw new Error('Sesi presensi biometrik telah kedaluwarsa. Silakan ulangi pemindaian.')
  }

  const expectedChallenge = verifyAndExtractChallenge(rawCookie, userId.toString(), 'auth')
  if (!expectedChallenge) {
    throw new Error('Integritas challenge presensi tidak valid atau telah dimanipulasi.')
  }

  const { rpID, origin } = await getWebAuthnConfig()

  const credentialRecord = await prisma.webAuthnCredential.findUnique({
    where: { credential_id: response.id },
  })

  if (!credentialRecord || credentialRecord.user_id !== userId) {
    throw new Error('Perangkat fisik tidak dikenali atau bukan milik akun Anda (Anti-Joki Alert).')
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialID: isoBase64URL.toBuffer(credentialRecord.credential_id),
      credentialPublicKey: isoBase64URL.toBuffer(credentialRecord.public_key),
      counter: Number(credentialRecord.counter),
      transports: credentialRecord.transports ? (credentialRecord.transports.split(',') as AuthenticatorTransport[]) : undefined,
    },
  })

  if (!verification.verified || !verification.authenticationInfo) {
    throw new Error('Validasi chip keamanan gagal. Presensi ditolak.')
  }

  await prisma.webAuthnCredential.update({
    where: { credential_id: credentialRecord.credential_id },
    data: {
      counter: BigInt(verification.authenticationInfo.newCounter),
      last_used_at: new Date(),
    },
  })

  return {
    verified: true,
    credentialId: credentialRecord.credential_id,
    deviceName: credentialRecord.device_name,
  }
}
