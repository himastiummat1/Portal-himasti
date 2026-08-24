'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/app/actions/auth'

export default function Login() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const result = await loginAction(null, formData)
      
      if (result.error) {
        setErrorMsg(result.error)
      } else if (result.success) {
        setSuccessMsg(result.message || 'Berhasil login!')
        // Redirect ke dashboard admin nanti
        setTimeout(() => {
            router.push('/dashboard')
        }, 1000)
      }
    })
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 antialiased min-h-screen flex flex-col justify-center items-center relative">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700 mx-4">
        <div className="flex justify-center mb-6">
          <Image 
            src="/images/logo_himasti.jpg" 
            alt="Logo HIMASTI" 
            width={80} 
            height={80} 
            className="w-20 h-20 rounded-full object-cover shadow-sm border border-gray-100 dark:border-gray-600"
            unoptimized
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-8">Masuk ke Portal</h2>
        
        {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                {errorMsg}
            </div>
        )}
        
        {successMsg && (
            <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg text-sm text-center">
                {successMsg}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              name="email"
              type="email" 
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Masukkan email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              name="password"
              type="password" 
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            {isPending ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Belum punya akun? <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Daftar sekarang</Link>
        </p>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors">
                &larr; Kembali ke Beranda
            </Link>
        </div>
      </div>
    </div>
  )
}
