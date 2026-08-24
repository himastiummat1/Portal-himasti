'use server'

import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const SECRET_KEY = process.env.JWT_SECRET || 'himasti-super-secret-key-2026'
const key = new TextEncoder().encode(SECRET_KEY)

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi!' }
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email: email }
    })

    if (!user) {
      return { error: 'Email tidak ditemukan!' }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return { error: 'Password salah!' }
    }

    const token = await new SignJWT({ 
      id: user.id.toString(), 
      email: user.email,
      name: user.name
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(key)

    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 
    })

    return { success: true, message: 'Login berhasil!' }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Terjadi kesalahan sistem.' }
  }
}
