import Link from "next/link";
import { Terminal, Database, Code2, Server, Menu } from "lucide-react";
import CompetitionMarquee from "./CompetitionMarquee";

export default function LandingAnimation({ competitions }: { competitions?: any[] }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased overflow-x-hidden selection:bg-gray-200">
      
      {/* Top Navbar */}
      <header className="w-full bg-white">
        <div className="max-w-6xl mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-medium text-lg tracking-tight">
            {/* Logo imitation */}
            <div className="text-blue-500 font-bold text-xl">HIMASTI</div>
            <span className="text-gray-500">Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="h-10 flex items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
              Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full pt-20 pb-0 px-6 relative flex flex-col items-center text-center">
        
        <h1 className="text-5xl sm:text-6xl font-medium tracking-tight text-gray-900 mb-6">
          HIMASTI 2.0
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Portal Ekosistem Digital HIMASTI adalah platform terdedikasi Anda untuk berkolaborasi. Orkestrasikan berbagai divisi dan program kerja secara paralel dalam satu ruang independen.
        </p>
        
        <Link href="/register" className="h-12 flex items-center justify-center rounded-full bg-black px-8 text-base font-medium text-white hover:bg-gray-800 transition-colors mb-20 shadow-sm">
          Daftar Kader
        </Link>
        
        {/* Mockup Container imitating the Antigravity preview box */}
        <div className="w-full max-w-5xl mx-auto bg-gradient-to-b from-gray-50 to-white rounded-t-[40px] border-x border-t border-gray-100 p-4 sm:p-10 pb-0 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          <div className="w-full bg-white rounded-t-2xl border border-gray-200 shadow-sm aspect-[16/9] md:aspect-[21/9] flex flex-col items-center justify-center overflow-hidden relative">
             <div className="absolute top-0 w-full h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
             </div>
             <div className="mt-12 p-8 text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">HIMASTI Workspace</div>
                <div className="w-full max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center text-gray-400 text-sm">
                   Ask anything, @ to mention, / for actions
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-b border-gray-100 bg-white py-4">
        <CompetitionMarquee competitions={competitions || []} />
      </div>

      {/* Divisions Section */}
      <section id="divisions" className="w-full py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-medium tracking-tight mb-4 text-gray-900">Modul Divisi</h2>
            <p className="text-gray-500 text-lg">Infrastruktur utama yang menggerakkan organisasi.</p>
          </div>
          
          <div className="flex flex-col gap-24 w-full">
            {[
              { name: 'Kemuhammadiyahan', desc: 'Menanamkan nilai-nilai Islam dan moral Kemuhammadiyahan di lingkungan mahasiswa IT. Memastikan setiap langkah organisasi sejalan dengan nilai luhur persyarikatan.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { name: 'Kaderisasi', desc: 'Membentuk jiwa kepemimpinan, soliditas, dan regenerasi kepengurusan himpunan. Membangun pondasi kader yang tangguh dan adaptif terhadap tantangan teknologi.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { name: 'Penelitian & Pengembangan', desc: 'Fokus pada kajian akademik, riset teknologi, dan pengembangan kurikulum (Litbang). Mendorong inovasi dan kompetisi mahasiswa di tingkat nasional.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
              { name: 'Media & Komunikasi', desc: 'Mengelola desain visual, dokumentasi, dan infrastruktur digital HIMASTI (Metkom). Memastikan branding organisasi tampil profesional di dunia maya.', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' }
            ].map((divisi, i) => (
              <div key={i} className={`flex flex-col sm:flex-row gap-12 sm:gap-20 items-center ${i % 2 !== 0 ? 'sm:flex-row-reverse' : ''}`}>
                
                {/* Visual Side imitating Antigravity soft blocks */}
                <div className="flex-1 w-full flex justify-center">
                  <div className="relative bg-gray-50 rounded-[32px] w-full max-w-sm aspect-square flex flex-col items-center justify-center p-8">
                     <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={divisi.icon} />
                        </svg>
                     </div>
                     <div className="text-lg font-medium text-gray-900 mb-1">Divisi 0{i+1}</div>
                  </div>
                </div>

                {/* Text Side */}
                <div className="flex-1 space-y-4 text-center sm:text-left">
                  <h3 className="text-3xl font-medium text-gray-900">{divisi.name}</h3>
                  <p className="text-lg text-gray-500 leading-relaxed">{divisi.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
          <div className="font-medium tracking-tight text-gray-900">
            HIMASTI Portal
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} HIMASTI Digital Ecosystem. All rights reserved.
          </p>
        </div>
      </footer>
      
    </div>
  );
}
