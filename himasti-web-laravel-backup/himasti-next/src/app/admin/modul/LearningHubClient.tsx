"use client";

import { useState } from "react";
import { 
  Map, BookOpen, Code2, Terminal, Database, 
  Layout, Server, Cpu, FileCode2, ChevronRight, Download, Search, CheckCircle2
} from "lucide-react";

export default function LearningHubClient({ userName }: { userName: string }) {
  const [activeTab, setActiveTab] = useState<"roadmap" | "materi" | "cheat">("roadmap");

  const roadmaps = [
    {
      id: "frontend",
      title: "Frontend Engineer",
      icon: <Layout className="w-8 h-8 text-sky-500" />,
      desc: "Bangun antarmuka visual yang interaktif dan responsif.",
      steps: ["HTML, CSS & JS Dasar", "Tailwind CSS & Styling", "React.js Ecosystem", "Next.js & Server Components"]
    },
    {
      id: "backend",
      title: "Backend Engineer",
      icon: <Server className="w-8 h-8 text-emerald-500" />,
      desc: "Rancang arsitektur server, API, dan database yang tangguh.",
      steps: ["Node.js & Express", "Relational Database (SQL)", "ORM (Prisma) & API Design", "System Design & Caching"]
    },
    {
      id: "data",
      title: "Data Science & AI",
      icon: <Cpu className="w-8 h-8 text-purple-500" />,
      desc: "Olah data menjadi wawasan dan integrasikan kecerdasan buatan.",
      steps: ["Python Fundamentals", "Pandas & Data Wrangling", "Machine Learning (Scikit)", "LLM & Generative AI"]
    }
  ];

  const materis = [
    { semester: "Semester 1", courses: ["Algoritma & Pemrograman Dasar", "Pengantar Teknologi Informasi", "Matematika Diskrit"] },
    { semester: "Semester 2", courses: ["Struktur Data", "Organisasi Komputer", "Sistem Operasi"] },
    { semester: "Semester 3", courses: ["Pemrograman Berorientasi Objek", "Basis Data Dasar", "Jaringan Komputer"] },
    { semester: "Semester 4", courses: ["Pemrograman Web Dasar", "Rekayasa Perangkat Lunak", "Analisis & Desain Sistem"] },
  ];

  const cheatsheets = [
    {
      title: "Git Workflow Standard",
      lang: "bash",
      code: `git add .\ngit commit -m "feat: Menambahkan fitur X"\ngit push origin main\n\n# Memperbarui cabang (pull)\ngit pull origin main`
    },
    {
      title: "Koneksi Prisma DB (Next.js)",
      lang: "typescript",
      code: `import { PrismaClient } from '@prisma/client'\n\nconst globalForPrisma = globalThis as unknown as { prisma: PrismaClient }\nexport const prisma = globalForPrisma.prisma || new PrismaClient()\n\nif (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma`
    },
    {
      title: "Basic Tailwind Card",
      lang: "html",
      code: `<div class="bg-white/90 backdrop-blur shadow-sm border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">\n  <h3 class="font-bold text-slate-800">Hello World</h3>\n</div>`
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg shadow-sky-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">HIMASTI Learning Hub</h1>
          <p className="text-sky-100 text-lg leading-relaxed">
            Pusat pengetahuan dan kurikulum mandiri untuk mahasiswa Sistem dan Teknologi Informasi. Pelajari roadmap industri, unduh modul kuliah, dan akses ribuan snippet kode.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 border-b border-slate-200/60 mb-6 overflow-x-auto hide-scrollbar">
        {[
          { id: "roadmap", label: "Peta Jalan (Roadmap)", icon: <Map className="w-4 h-4" /> },
          { id: "materi", label: "Bank Materi Kuliah", icon: <BookOpen className="w-4 h-4" /> },
          { id: "cheat", label: "Kode & Cheat Sheet", icon: <Code2 className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-sky-500 text-sky-700 bg-sky-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: ROADMAP */}
      {activeTab === "roadmap" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Pilih Spesialisasi IT Anda</h2>
              <p className="text-sm text-slate-500">Ikuti kurikulum terstruktur yang disesuaikan dengan standar industri 2026.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {roadmaps.map((road) => (
              <div key={road.id} className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-6 shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] hover:border-sky-200 hover:shadow-sky-100 transition-all flex flex-col group">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-sky-50 transition-transform">
                  {road.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{road.title}</h3>
                <p className="text-sm text-slate-500 mb-6 flex-1">{road.desc}</p>
                
                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {road.steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-semibold text-slate-700">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="mt-6 w-full py-3 bg-slate-900 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2">
                  Mulai Jalur Ini <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MATERI */}
      {activeTab === "materi" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Diktat & Modul Perkuliahan</h2>
              <p className="text-sm text-slate-500">Arsip materi perkuliahan FST UMMAT berdasarkan semester.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari mata kuliah..." className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {materis.map((smt, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)]">
                <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-200/60 font-semibold text-slate-800 flex justify-between items-center">
                  {smt.semester}
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-lg">{smt.courses.length} Modul</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {smt.courses.map((course, i) => (
                    <div key={i} className="flex justify-between items-center p-4 hover:bg-sky-50/30 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
                          <FileCode2 className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{course}</span>
                      </div>
                      <button className="text-slate-400 hover:text-sky-600 p-2 rounded-lg hover:bg-sky-50 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CHEAT SHEET */}
      {activeTab === "cheat" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Gudang Snippet & Cheat Sheet</h2>
              <p className="text-sm text-slate-500">Salin kode-kode esensial yang sering terlupakan dengan cepat.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cheatsheets.map((cheat, idx) => (
              <div key={idx} className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 flex flex-col">
                <div className="flex justify-between items-center px-4 py-3 bg-slate-950 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-300">{cheat.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider bg-sky-400/10 px-2 py-0.5 rounded-full">
                    {cheat.lang}
                  </span>
                </div>
                <div className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed whitespace-pre">
                  {cheat.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
