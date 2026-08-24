import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { redirect } from 'next/navigation'

const SECRET_KEY = process.env.JWT_SECRET || 'himasti-super-secret-key-2026'
const key = new TextEncoder().encode(SECRET_KEY)

export default async function Dashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    redirect('/login')
  }

  let user = null
  try {
    const { payload } = await jwtVerify(token, key)
    user = payload
  } catch (err) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard HIMASTI</h1>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-2xl mb-2">Selamat datang, <strong>{user?.name as string}</strong>! 🎉</p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{user?.email as string}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                <h3 className="font-bold text-blue-800 dark:text-blue-300">Total Kader</h3>
                <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">0</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-100 dark:border-emerald-800">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300">Surat Masuk</h3>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">0</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800">
                <h3 className="font-bold text-purple-800 dark:text-purple-300">Saldo Kas</h3>
                <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">Rp0</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Sistem backend (Next.js Server Actions + Prisma + Supabase + JWT) sudah berjalan dengan sempurna!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
