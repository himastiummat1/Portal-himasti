import Link from 'next/link'
import Image from 'next/image'

export default function Register() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 antialiased min-h-screen flex flex-col justify-center items-center relative py-12">
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
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-8">Pendaftaran Kader</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">NIM (Nomor Induk Mahasiswa)</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Masukkan NIM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="email@mhs.ummat.ac.id"
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

          <button 
            type="button" 
            className="w-full py-3 mt-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Daftar
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Sudah punya akun? <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Login di sini</Link>
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
