import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 antialiased min-h-screen flex flex-col justify-center items-center relative">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg max-w-xl text-center border border-gray-200 dark:border-gray-700 mx-4">
        <div className="flex justify-center mb-6">
          <Image 
            src="/images/logo_himasti.jpg" 
            alt="Logo HIMASTI" 
            width={96} 
            height={96} 
            className="w-24 h-24 rounded-full object-cover shadow-sm border border-gray-100 dark:border-gray-600"
            unoptimized
          />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Selamat Datang di Portal Internal HIMASTI</h1>
        <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">Himpunan Mahasiswa Sistem & Teknologi Informasi</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
            Sistem ini dirancang untuk mengelola data kaderisasi dan persuratan internal organisasi dengan sistem role-based access.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Login
            </Link>
            <Link href="/register" className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium rounded-lg transition-colors">
                Daftar Akun
            </Link>
        </div>
      </div>
    </div>
  )
}
