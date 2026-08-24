import Link from 'next/link'
import Image from 'next/image'

export default function Login() {
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
        
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email / NIM</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Masukkan email atau NIM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
              <span>Ingat saya</span>
            </label>
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Lupa Password?</a>
          </div>

          <button 
            type="button" 
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Masuk
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
