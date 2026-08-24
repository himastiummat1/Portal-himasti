import Link from 'next/link'
import { ArrowRight, BookOpen, Users, Trophy } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                H
              </div>
              <span className="font-bold text-xl tracking-tight">HIMASTI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                Masuk
              </Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-blue-500/20">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 border border-blue-100 dark:border-blue-800">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
          Selamat Datang di Portal V2
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
          Himpunan Mahasiswa <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Sistem & Teknologi Informasi
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          Pusat informasi, manajemen kaderisasi, modul pembelajaran IT, dan rekam jejak karya mahasiswa Sistem & Teknologi Informasi secara terpadu.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-0.5">
            Mulai Sekarang
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/katalog-karya" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-semibold hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:-translate-y-0.5">
            Lihat Karya Mahasiswa
          </Link>
        </div>
      </main>

      {/* Feature Section */}
      <section className="bg-white dark:bg-slate-800/50 py-24 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Manajemen Kaderisasi</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Kelola data anggota, absensi kegiatan, dan rekam jejak perkembangan kader HIMASTI secara sistematis.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Modul IT Eksklusif</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Akses ratusan modul pembelajaran, roadmap pemrograman, dan tutorial teknologi terbaru khusus anggota.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Katalog Karya</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pamerkan portofolio proyek terbaikmu, ikuti kompetisi IT, dan bangun reputasimu di dunia teknologi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-500 dark:text-slate-400">
        <p>© {new Date().getFullYear()} HIMASTI. Himpunan Mahasiswa Sistem & Teknologi Informasi.</p>
      </footer>
    </div>
  )
}
