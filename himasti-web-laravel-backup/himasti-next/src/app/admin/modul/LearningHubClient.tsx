"use client";

import { useState } from "react";
import { 
  Map, BookOpen, Code2, Terminal, Database, Sparkles, 
  Layout, Server, Cpu, FileCode2, ChevronRight, Search, CheckCircle2,
  X, AlignLeft, BookMarked, PlayCircle, ArrowLeft
} from "lucide-react";

export default function LearningHubClient({ userName }: { userName: string }) {
  const [activeTab, setActiveTab] = useState<"roadmap" | "materi" | "cheat" | "vidyax">("roadmap");
  const [activeCourse, setActiveCourse] = useState<any>(null);

    const roadmaps = [
    {
      id: "frontend",
      link: "https://roadmap.sh/frontend",
      title: "Frontend Engineer",
      icon: <Layout className="w-8 h-8 text-slate-900" />,
      desc: "Bangun antarmuka visual yang interaktif, responsif, dan mutakhir.",
      steps: [
        "1. Fundamental: HTML5, CSS3, & Semantic Web",
        "2. JavaScript ES6+: DOM, Fetch API, Async/Await",
        "3. Git & GitHub: Version Control Dasar",
        "4. Styling Modern: Tailwind CSS & Framer Motion",
        "5. Framework Inti: React.js (Hooks, Context, State)",
        "6. Meta-Framework: Next.js (SSR, SSG, App Router)",
        "7. Tools: TypeScript, Zod, & React Query"
      ]
    },
    {
      id: "backend",
      link: "https://roadmap.sh/backend",
      title: "Backend Engineer",
      icon: <Server className="w-8 h-8 text-slate-900" />,
      desc: "Rancang arsitektur server, API, dan sistem keamanan yang tangguh.",
      steps: [
        "1. Internet Basic: HTTP/HTTPS, DNS, & Hosting",
        "2. Bahasa Inti: Node.js, Go, atau PHP (Laravel)",
        "3. Relational DB: PostgreSQL, MySQL, Normalisasi",
        "4. API Design: RESTful API, GraphQL, Postman",
        "5. ORM & Query Builder: Prisma, Sequelize",
        "6. Keamanan: JWT Auth, OAuth, CORS, & Hashing",
        "7. Arsitektur Lanjut: Redis Caching, Docker, CI/CD"
      ]
    },
    {
      id: "data",
      link: "https://roadmap.sh/ai-data-scientist",
      title: "Data Science & AI",
      icon: <Cpu className="w-8 h-8 text-slate-900" />,
      desc: "Olah data menjadi wawasan, latih model AI, dan prediksi masa depan.",
      steps: [
        "1. Dasar Pemrograman: Python Dasar & Algoritma",
        "2. Matematika AI: Aljabar Linier & Statistika",
        "3. Data Wrangling: Pandas, Numpy, & SQL Lanjut",
        "4. Visualisasi: Matplotlib, Seaborn, Tableau",
        "5. Machine Learning Basic: Scikit-Learn, Regresi",
        "6. Deep Learning: TensorFlow, PyTorch, Neural Nets",
        "7. Generative AI: LangChain, RAG, & HuggingFace"
      ]
    },
    {
      id: "systems",
      link: "https://roadmap.sh/computer-science",
      title: "Systems & Compiler Engineer",
      icon: <Terminal className="w-8 h-8 text-rose-500" />,
      desc: "Jalur 'Dewa' (Expert): Bangun bahasa pemrograman, OS, dan infrastruktur tingkat rendah.",
      steps: [
        "1. Low-Level: C, C++, Rust, atau Zig",
        "2. Arsitektur Komputer & OS Internals",
        "3. Teori Kompilator & AST (Contoh: Vidyax)",
        "4. Code Generation & Runtime (Studi: Vidyax)",
        "5. Sistem Memori & Garbage Collection",
        "6. High-Performance Computing (HPC)",
        "7. Sistem Terdistribusi Skala Masif"
      ]
    }
  ];

  const materis = [
    { 
      semester: "Semester 1", 
      courses: [
        { 
          title: "Algoritma & Pemrograman Dasar", 
          chapters: [
            { title: "BAB 1: Pengantar Algoritma", content: "# Pengantar Algoritma\n\nAlgoritma adalah urutan langkah-langkah logis untuk memecahkan suatu masalah. Di sini kita akan mempelajari konsep dasar logika pemrograman, tipe data, dan kontrol alur (if/else, loops).\n\n```python\n# Contoh Algoritma Dasar (Python)\nprint('Hello HIMASTI!')\n```" },
            { title: "BAB 2: Variabel & Tipe Data", content: "# Variabel & Tipe Data\n\nSetiap bahasa pemrograman memiliki cara untuk menyimpan data di dalam memori komputer. Kita menyebutnya variabel." }
          ]
        },
        { title: "Pengantar Teknologi Informasi", chapters: [] },
        { title: "Matematika Diskrit", chapters: [] }
      ] 
    },
    { 
      semester: "Semester 3", 
      courses: [
        { title: "Pemrograman Berorientasi Objek", chapters: [] },
        { title: "Basis Data Dasar", chapters: [] }
      ] 
    }
  ];

  const cheatsheets = [
    {
      title: "Git Workflow Master",
      lang: "BASH",
      code: "git add .\ngit commit -m \"feat: added new awesome feature\"\ngit push origin main\n\n# Reset branch ke remote (BAHAYA)\ngit fetch origin\ngit reset --hard origin/main"
    },
    {
      title: "Docker Compose Quickstart",
      lang: "YAML",
      code: "version: '3.8'\nservices:\n  db:\n    image: postgres:15-alpine\n    environment:\n      POSTGRES_USER: root\n      POSTGRES_PASSWORD: pwd\n    ports:\n      - '5432:5432'"
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-mono font-bold tracking-widest mb-4">
            <Sparkles className="w-3 h-3 text-emerald-400" /> HIMASTI LEARNING HUB
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Akademi Digital</h1>
          <p className="text-slate-500 mt-2 text-sm max-w-xl">Pusat sumber daya pembelajaran, kurikulum, dan standardisasi keilmuan IT untuk seluruh kader HIMASTI.</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1.5 bg-slate-200/50 rounded-2xl w-fit border border-slate-200">
        {[
          { id: "roadmap", label: "Role Roadmap", icon: <Map className="w-4 h-4" /> },
          { id: "materi", label: "Bank Modul IT", icon: <BookOpen className="w-4 h-4" /> },
          { id: "cheat", label: "Cheat Sheets", icon: <Terminal className="w-4 h-4" /> },
          { id: "vidyax", label: "Vidyax (Eksperimental)", icon: <Code2 className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id 
                ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: ROADMAP (Keep original but modernized) */}
      {activeTab === "roadmap" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-300">
          {roadmaps.map(rm => (
            <div key={rm.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm group hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">{rm.icon}</div>
                <a href={rm.link} target="_blank" rel="noreferrer" className="text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors flex items-center gap-1">
                  Lihat Peta Utuh <ChevronRight className="w-3 h-3" />
                </a>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{rm.title}</h3>
              <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">{rm.desc}</p>
              
              <div className="space-y-3">
                {rm.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: BANK MODUL (E-LEARNING READER) */}
      {activeTab === "materi" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Main View: Course List */}
          {!activeCourse ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">Katalog Modul Interaktif</h2>
                  <p className="text-sm text-slate-500">Akses bacaan teknis dan modul kuliah secara langsung.</p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Cari modul..." className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-sm" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {materis.map((smt, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-800 tracking-tight">{smt.semester}</span>
                      <span className="text-xs bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded-full">{smt.courses.length} Kursus</span>
                    </div>
                    <div className="divide-y divide-slate-100 p-2">
                      {smt.courses.map((course, i) => (
                        <button 
                          key={i} 
                          onClick={() => setActiveCourse(course)}
                          className="w-full flex justify-between items-center p-4 hover:bg-slate-50 rounded-xl transition-colors group text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-100 text-slate-900 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
                              <BookMarked className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">{course.title}</h4>
                              <p className="text-xs text-slate-500 mt-1">{course.chapters?.length || 0} BAB Tersedia</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Reader Mode
            <div className="fixed inset-0 z-50 bg-white flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Sidebar Chapters */}
              <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50 flex flex-col h-full shrink-0">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                  <button onClick={() => setActiveCourse(null)} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Kembali
                  </button>
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold">H</div>
                </div>
                <div className="p-6 overflow-y-auto grow">
                  <h3 className="font-black text-xl text-slate-800 tracking-tight leading-tight mb-6">{activeCourse.title}</h3>
                  <div className="space-y-2">
                    {activeCourse.chapters && activeCourse.chapters.length > 0 ? (
                      activeCourse.chapters.map((chap: any, idx: number) => (
                        <button key={idx} className="w-full text-left p-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-400 transition-colors flex items-center gap-3">
                          <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="text-sm font-semibold text-slate-700">{chap.title}</span>
                        </button>
                      ))
                    ) : (
                      <div className="text-sm text-slate-400 font-mono p-4 border border-dashed border-slate-300 rounded-xl bg-slate-100/50">Materi belum diunggah.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reader Content Area */}
              <div className="flex-1 bg-white overflow-y-auto p-6 md:p-12 relative">
                {activeCourse.chapters && activeCourse.chapters.length > 0 ? (
                  <div className="max-w-3xl mx-auto prose prose-slate prose-headings:tracking-tight prose-a:text-sky-600 prose-pre:bg-slate-900 prose-pre:text-slate-50">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold tracking-widest mb-8">
                      <Sparkles className="w-3 h-3" /> BAB 1 AKTIF
                    </span>
                    <div dangerouslySetInnerHTML={{ __html: activeCourse.chapters[0].content.replace(/\n/g, '<br/>').replace(/```python/g, '<pre class="p-4 rounded-xl bg-slate-900 text-green-400 font-mono text-sm mt-4 overflow-x-auto">').replace(/```/g, '</pre>') }} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <BookOpen className="w-16 h-16 mb-4 text-slate-200" />
                    <p className="font-semibold text-slate-500">Materi Sedang Disusun</p>
                    <p className="text-sm mt-2 max-w-sm text-center">Tim Akademik HIMASTI sedang menyiapkan kurikulum dan modul untuk mata kuliah ini.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* (KEEP CHEATSHEET & VIDYAX AS THEY WERE, BUT WITH SLATE COLORS - ALREADY DONE ABOVE) */}
      
      {activeTab === "cheat" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Gudang Snippet & Cheat Sheet</h2>
              <p className="text-sm text-slate-500">Salin kode-kode esensial yang sering terlupakan dengan cepat.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cheatsheets.map((cheat, idx) => (
              <div key={idx} className="bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-800 flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 bg-slate-950 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-white">{cheat.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider bg-sky-900/30 px-3 py-1 rounded-full">
                    {cheat.lang}
                  </span>
                </div>
                <div className="p-6 overflow-x-auto text-sm font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap break-words">
                  {cheat.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "vidyax" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-rose-500/20 blur-3xl rounded-full"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-mono font-bold tracking-widest">
                  <Sparkles className="w-3 h-3" /> MAHKOTA HIMASTI
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">Vidyax</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Sebuah proyek eksperimental <strong className="text-white">AI-first</strong> hasil rancangan <strong className="text-rose-400">M N DAFFA</strong> yang dibangun secara kolaboratif bersama Kecerdasan Buatan (AI). Proyek ini mendemonstrasikan kekuatan kolaborasi manusia-mesin dalam menciptakan arsitektur bahasa pemrograman yang mendukung orkestrasi <em>LLM</em>.
                </p>
                <div className="flex gap-4">
                  <a href="https://github.com/Vidyax-Lang/Vidyax" target="_blank" className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-sm">
                    GitHub Repo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
