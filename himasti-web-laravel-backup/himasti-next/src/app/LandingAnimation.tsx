import Link from "next/link";
import { Terminal, Database, Code2, Server, ChevronRight, Zap, Shield, Sparkles } from "lucide-react";
import CompetitionMarquee from "./CompetitionMarquee";

export default function LandingAnimation({ competitions }: { competitions?: any[] }) {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans antialiased overflow-x-hidden selection:bg-purple-900 selection:text-white">
      
      {/* Dynamic Background with Grid and Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3 font-bold tracking-widest text-lg text-white uppercase">
            <Terminal className="w-5 h-5 text-purple-500" />
            HIMASTI <span className="text-purple-500">OS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#divisions" className="hover:text-white transition-colors">Divisions</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="h-9 flex items-center justify-center rounded bg-white px-4 text-sm font-bold text-black hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Initialize
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 w-full pt-32 pb-24 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-mono text-purple-400 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
            SYSTEM ONLINE // HIMASTI v2.0
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
            Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Agentic</span> <br className="hidden sm:block" /> Organization.
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Empowering Sistem dan Teknologi Informasi students with a next-generation centralized ecosystem. Built for speed, security, and absolute control.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="h-12 w-full sm:w-auto flex items-center justify-center gap-2 rounded bg-purple-600 px-8 text-sm font-bold text-white hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)]">
              <Zap className="w-4 h-4" /> Deploy Workspace
            </Link>
            <a href="#features" className="h-12 w-full sm:w-auto flex items-center justify-center gap-2 rounded border border-white/10 bg-black/50 px-8 text-sm font-medium text-white hover:bg-white/5 transition-colors backdrop-blur-sm">
              <Terminal className="w-4 h-4 text-gray-400" /> Read the Docs
            </a>
          </div>
        </div>
      </section>

      {/* Marquee (Dark Mode) */}
      <div className="relative z-10 border-b border-white/5 bg-black/40 py-4 backdrop-blur-sm">
        <CompetitionMarquee competitions={competitions || []} />
      </div>

      {/* Grid Features */}
      <section id="features" className="relative z-10 w-full py-24 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col items-center text-center">
            <Sparkles className="w-8 h-8 text-purple-500 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">System Architecture</h2>
            <p className="text-gray-400 max-w-2xl">A robust, scalable infrastructure designed to handle all organizational workloads autonomously.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Database, title: "Kader Registry", desc: "Centralized relational database for all STI students and alumni with strict access control." },
              { icon: Shield, title: "Encrypted Archive", desc: "Secure digital vault for incoming and outgoing official organizational documents." },
              { icon: Code2, title: "Project Showcase", desc: "Open-source repository catalog for student research and technological innovations." },
              { icon: Server, title: "Treasury Node", desc: "Real-time transparent financial tracking and distributed treasury management." }
            ].map((Feature, i) => (
              <div key={i} className="group p-6 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-purple-500/50 transition-all duration-300">
                <div className="h-12 w-12 rounded-lg border border-white/10 bg-black flex items-center justify-center mb-6 group-hover:border-purple-500/50 group-hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all">
                  <Feature.icon className="h-6 w-6 text-gray-400 group-hover:text-purple-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{Feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{Feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divisions / Modules */}
      <section id="divisions" className="relative z-10 w-full py-24 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">Core Modules</h2>
            <p className="text-gray-400">The 8 operational nodes powering the HIMASTI ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { id: 'MOD-01', name: 'Kemuhammadiyahan', desc: 'Menanamkan nilai-nilai Islam dan moral Kemuhammadiyahan di lingkungan mahasiswa IT.' },
              { id: 'MOD-02', name: 'Kaderisasi', desc: 'Membentuk jiwa kepemimpinan, soliditas, dan regenerasi kepengurusan himpunan.' },
              { id: 'MOD-03', name: 'Penelitian & Pengembangan', desc: 'Fokus pada kajian akademik, riset teknologi, dan pengembangan kurikulum (Litbang).' },
              { id: 'MOD-04', name: 'Media & Komunikasi', desc: 'Mengelola desain visual, dokumentasi, dan infrastruktur digital HIMASTI (Metkom).' },
              { id: 'MOD-05', name: 'Hubungan Masyarakat', desc: 'Menjalin relasi dan kerja sama dengan eksternal. Mewakili suara HIMASTI di kancah luas.' },
              { id: 'MOD-06', name: 'Kewirausahaan', desc: 'Membangun kemandirian finansial organisasi melalui unit usaha dan merchandise.' },
              { id: 'MOD-07', name: 'Minat dan Bakat', desc: 'Mewadahi dan menyalurkan potensi mahasiswa di bidang olahraga, seni, dan e-sports.' },
              { id: 'MOD-08', name: 'Aksi dan Advokasi', desc: 'Menampung aspirasi mahasiswa dan mengawal isu-isu kebijakan strategis kampus.' }
            ].map((divisi, i) => (
              <div key={i} className="flex flex-col sm:flex-row border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors overflow-hidden">
                <div className="p-6 bg-white/[0.02] border-b sm:border-b-0 sm:border-r border-white/10 flex flex-col justify-center items-center sm:w-1/3">
                  <div className="text-xs font-mono text-purple-400 mb-2">{divisi.id}</div>
                  <div className="text-5xl font-black text-white/20">0{i+1}</div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-white mb-2">{divisi.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{divisi.desc}</p>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-purple-400/70 hover:text-purple-400 cursor-pointer w-max">
                    INITIATE_PROTOCOL <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold tracking-widest text-white uppercase text-sm">
            <Terminal className="w-4 h-4 text-purple-500" />
            HIMASTI OS
          </div>
          <p className="text-xs text-gray-500 font-mono">
            &copy; {new Date().getFullYear()} HIMASTI DIGITAL ECOSYSTEM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
      
    </div>
  );
}
