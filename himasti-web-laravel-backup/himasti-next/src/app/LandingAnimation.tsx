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
          
          <div className="grid gap-4">
            {[
              { name: 'Kemuhammadiyahan', desc: 'Menanamkan nilai-nilai Islam dan moral Kemuhammadiyahan di lingkungan mahasiswa IT.' },
              { name: 'Kaderisasi', desc: 'Membentuk jiwa kepemimpinan, soliditas, dan regenerasi kepengurusan himpunan.' },
              { name: 'Penelitian & Pengembangan', desc: 'Fokus pada kajian akademik, riset teknologi, dan pengembangan kurikulum (Litbang).' },
              { name: 'Media & Komunikasi', desc: 'Mengelola desain visual, dokumentasi, dan infrastruktur digital HIMASTI (Metkom).' },
              { name: 'Hubungan Masyarakat', desc: 'Menjalin relasi dan kerja sama dengan pihak rektorat, ormawa lain, dan eksternal.' },
              { name: 'Kewirausahaan', desc: 'Membangun kemandirian finansial organisasi melalui unit usaha dan merchandise.' },
              { name: 'Minat dan Bakat', desc: 'Mewadahi dan menyalurkan potensi mahasiswa di bidang olahraga, seni, dan e-sports.' },
              { name: 'Aksi dan Advokasi', desc: 'Menampung aspirasi mahasiswa dan mengawal isu-isu kebijakan strategis kampus.' }
            ].map((divisi, i) => (
              <details key={i} className="group rounded-md border border-gray-200 bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-purple-950 hover:bg-gray-50 transition-colors">
                  {divisi.name}
                  <span className="transition duration-200 group-open:-rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 pt-2 text-sm text-gray-500 border-t border-gray-100">
                  {divisi.desc}
                </div>
              </details>
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
