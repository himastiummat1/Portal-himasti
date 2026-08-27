import Link from "next/link";
import { ArrowRight, Terminal, Database, Code2, Server } from "lucide-react";
import CompetitionMarquee from "./CompetitionMarquee";

export default function LandingAnimation({ competitions }: { competitions?: any[] }) {
  return (
    <div className="min-h-screen bg-white text-purple-950 selection:bg-yellow-400 selection:text-purple-900 font-sans antialiased overflow-x-hidden">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-semibold tracking-tight text-lg">
            <div className="h-6 w-6 bg-purple-700 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            HIMASTI Portal
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-purple-950 transition-colors">Features</a>
            <a href="#divisions" className="hover:text-purple-950 transition-colors">Divisions</a>
            <Link href="/login" className="text-purple-950 hover:text-gray-600 transition-colors">Sign In</Link>
            <Link href="/register" className="h-8 flex items-center justify-center rounded-md bg-purple-700 px-4 text-white hover:bg-purple-800 transition-colors">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full pt-32 pb-24 px-6 border-b border-gray-200 relative">
        {/* Vercel-like thin grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-purple-700 mr-2"></span>
            HIMASTI Digital Ecosystem v2.0
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-purple-950 mb-8 leading-tight">
            Manage. Organize. <br className="hidden sm:block" /> Accelerate.
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            The core infrastructure for Sistem dan Teknologi Informasi students. 
            A unified platform for academic records, organization management, and competition tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="h-12 w-full sm:w-auto flex items-center justify-center rounded-md bg-purple-700 px-8 text-sm font-medium text-white hover:bg-purple-800 transition-all duration-200 shadow-sm hover:shadow-md">
              Access Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a href="#features" className="h-12 w-full sm:w-auto flex items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium text-purple-950 hover:bg-gray-50 transition-colors">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Competition Marquee (Kept functional but styling follows Vercel minimal) */}
      <div className="border-b border-gray-200 bg-gray-50 py-4">
        <CompetitionMarquee competitions={competitions || []} />
      </div>

      {/* Features Grid */}
      <section id="features" className="w-full py-24 px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-purple-950">Core Infrastructure</h2>
            <p className="text-gray-500 max-w-xl">Everything you need to manage the organization efficiently, built on modern web technologies.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Terminal, title: "Data Kader", desc: "Centralized database for all STI students and alumni." },
              { icon: Database, title: "Surat & Arsip", desc: "Digital archive for incoming and outgoing official letters." },
              { icon: Code2, title: "Katalog Karya", desc: "Showcase platform for student projects and research." },
              { icon: Server, title: "Keuangan", desc: "Transparent financial tracking and treasury management." }
            ].map((Feature, i) => (
              <div key={i} className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-all duration-200 group">
                <div className="h-10 w-10 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                  <Feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-purple-950 mb-2">{Feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{Feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divisions Section */}
      <section id="divisions" className="w-full py-24 px-6 border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-purple-950">Structural Divisions</h2>
            <p className="text-gray-500">The 8 pillars that drive HIMASTI forward.</p>
          </div>
          
          <div className="flex flex-col gap-16 sm:gap-24 mt-12 w-full max-w-6xl mx-auto">
            {[
              { name: 'Kemuhammadiyahan', desc: 'Menanamkan nilai-nilai Islam dan moral Kemuhammadiyahan di lingkungan mahasiswa IT. Memastikan setiap langkah organisasi sejalan dengan nilai luhur persyarikatan.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { name: 'Kaderisasi', desc: 'Membentuk jiwa kepemimpinan, soliditas, dan regenerasi kepengurusan himpunan. Membangun pondasi kader yang tangguh dan adaptif terhadap tantangan teknologi.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { name: 'Penelitian & Pengembangan', desc: 'Fokus pada kajian akademik, riset teknologi, dan pengembangan kurikulum (Litbang). Mendorong inovasi dan kompetisi mahasiswa di tingkat nasional.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
              { name: 'Media & Komunikasi', desc: 'Mengelola desain visual, dokumentasi, dan infrastruktur digital HIMASTI (Metkom). Memastikan branding organisasi tampil profesional di dunia maya.', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
              { name: 'Hubungan Masyarakat', desc: 'Menjalin relasi dan kerja sama dengan pihak rektorat, ormawa lain, dan eksternal. Mewakili suara HIMASTI di kancah yang lebih luas.', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
              { name: 'Kewirausahaan', desc: 'Membangun kemandirian finansial organisasi melalui unit usaha dan merchandise. Melatih jiwa entrepreneurship kader IT.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { name: 'Minat dan Bakat', desc: 'Mewadahi dan menyalurkan potensi mahasiswa di bidang olahraga, seni, dan e-sports. Menjaga keseimbangan antara akademik dan kreativitas.', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { name: 'Aksi dan Advokasi', desc: 'Menampung aspirasi mahasiswa dan mengawal isu-isu kebijakan strategis kampus. Garda terdepan dalam memperjuangkan hak mahasiswa.', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' }
            ].map((divisi, i) => (
              <div key={i} className={`flex flex-col sm:flex-row gap-8 lg:gap-16 items-center ${i % 2 !== 0 ? 'sm:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full relative">
                  <div className="absolute inset-0 bg-purple-700/5 transform rotate-3 rounded-3xl"></div>
                  <div className="relative bg-white border border-gray-200 p-8 sm:p-12 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="w-16 h-16 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center mb-6">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={divisi.icon} />
                      </svg>
                    </div>
                    <div className="text-8xl font-black text-gray-50 absolute top-4 left-6 pointer-events-none select-none tracking-tighter">0{i+1}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Sistem & Tata Kelola</h4>
                    <p className="text-sm text-gray-500 max-w-xs relative z-10">Dirancang secara spesifik untuk menangani {divisi.name} dengan skalabilitas tinggi.</p>
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-purple-700 uppercase tracking-widest">
                    Divisi 0{i+1}
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-purple-950 tracking-tight leading-tight">{divisi.name}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{divisi.desc}</p>
                  <ul className="space-y-3 pt-4 border-t border-gray-100">
                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                      Program Kerja Unggulan & Strategis
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                      Pengembangan Kapasitas Anggota
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                      Integrasi dengan Ekosistem Digital HIMASTI
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-semibold tracking-tight text-purple-950">
            <div className="h-5 w-5 bg-purple-700 rounded-sm flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">H</span>
            </div>
            HIMASTI
          </div>
          <p className="text-sm text-gray-500 font-mono">
            &copy; {new Date().getFullYear()} HIMASTI. Built with Next.js & Tailwind.
          </p>
        </div>
      </footer>
      
    </div>
  );
}
