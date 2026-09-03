import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET_KEY = process.env.JWT_SECRET || 'himasti-super-secret-key-2026'
const key = new TextEncoder().encode(SECRET_KEY)

export interface SessionUser {
  id: string
  email: string
  name: string
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) return null

    const { payload } = await jwtVerify(token, key)
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
    }
  } catch {
    return null
  }
}
