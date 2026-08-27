"use client";

import { useState } from "react";
import { 
  Map, BookOpen, Code2, Terminal, Database, Sparkles, 
  Layout, Server, Cpu, FileCode2, ChevronRight, Download, Search, CheckCircle2
} from "lucide-react";

export default function LearningHubClient({ userName }: { userName: string }) {
  const [activeTab, setActiveTab] = useState<"roadmap" | "materi" | "cheat" | "vidyax">("roadmap");

  const roadmaps = [
    {
      id: "frontend",
      link: "https://roadmap.sh/frontend",
      title: "Frontend Engineer",
      icon: <Layout className="w-8 h-8 text-sky-500" />,
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
      icon: <Server className="w-8 h-8 text-emerald-500" />,
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
      icon: <Cpu className="w-8 h-8 text-purple-500" />,
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
    { semester: "Semester 1", courses: ["Algoritma & Pemrograman Dasar", "Pengantar Teknologi Informasi", "Matematika Diskrit"] },
    { semester: "Semester 2", courses: ["Struktur Data", "Organisasi Komputer", "Sistem Operasi"] },
    { semester: "Semester 3", courses: ["Pemrograman Berorientasi Objek", "Basis Data Dasar", "Jaringan Komputer"] },
    { semester: "Semester 4", courses: ["Pemrograman Web Dasar", "Rekayasa Perangkat Lunak", "Analisis & Desain Sistem"] },
  ];

  const cheatsheets = [
    {
      title: "Vidyax: Swarm AI Agents",
      lang: "vidyax",
      code: `use ai\n\n@tool(permissions="mutate")\nfunc swarm_send(channel, message):\n    shm_write(channel, message)\n    print "SwarmMessenger [TX -> " + channel + "] Terkirim."\n\nagent s1:\n    model "llama-3.1-8b-instant"\n    system "Kamu adalah Planner Agent (s1). Tugasmu menganalisis strategi."\n\nagent s2:\n    model "llama-3.1-8b-instant"\n    system "Kamu adalah Executor Agent (s2). Tugasmu mengeksekusi aksi."\n\n# S1 mengirim instruksi ke S2 via shared memory\nswarm_send("s2_inbox", "Plan Alpha Execute!")`
    },
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
      <div className="border-b border-slate-200/60 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Learning Hub</h1>
          <p className="text-sm text-slate-500 mt-1">Pusat kurikulum, modul perkuliahan, dan referensi kode HIMASTI.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 border-b border-slate-200/60 mb-6 overflow-x-auto hide-scrollbar">
                {[
          { id: "roadmap", label: "Peta Jalan (Roadmap)", icon: <Map className="w-4 h-4" /> },
          { id: "materi", label: "Bank Materi Kuliah", icon: <BookOpen className="w-4 h-4" /> },
          { id: "cheat", label: "Kode & Cheat Sheet", icon: <Code2 className="w-4 h-4" /> },
          { id: "vidyax", label: "Vidyax Language", icon: <Sparkles className="w-4 h-4 text-rose-500" /> },
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {roadmaps.map((road) => (
              <div key={road.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-sky-300 hover:shadow-md transition-all flex flex-col group">
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
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
                
                <a href={road.link} target="_blank" className="mt-8 w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex justify-center items-center gap-2">
                  Mulai Jalur Ini <ChevronRight className="w-4 h-4" />
                </a>
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
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
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
                <div className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                  {cheat.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* TAB CONTENT: VIDYAX */}
      {activeTab === "vidyax" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-br from-slate-900 to-black rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-rose-500/20 blur-3xl rounded-full"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-mono font-bold tracking-widest">
                  <Sparkles className="w-3 h-3" /> MAHKOTA HIMASTI
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                  Vidyax
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Sebuah proyek eksperimental <strong className="text-white">AI-first</strong> hasil rancangan <strong className="text-rose-400">M N DAFFA</strong> (Kabid Riset & Pengembangan HIMASTI 2025-2026) <strong>yang dibangun secara kolaboratif bersama Kecerdasan Buatan (AI)</strong>. Proyek ini mendemonstrasikan kekuatan kolaborasi manusia-mesin dalam menciptakan arsitektur bahasa pemrograman yang mendukung orkestrasi <em>LLM</em> dan <em>Swarm Multi-Agent</em> dari nol.
                </p>
                <div className="flex gap-4">
                  <a href="https://github.com/Vidyax-Lang/Vidyax" target="_blank" className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors">
                    GitHub Repo
                  </a>
                  <a href="https://github.com/daffa2555/Vidyax-Vscode" target="_blank" className="px-6 py-3 bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors">
                    VS Code Extension
                  </a>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="bg-slate-950/80 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="ml-4 text-xs font-mono text-slate-500">swarm_demo.vx</span>
                  </div>
                  <div className="p-5 text-sm font-mono text-slate-300 leading-loose overflow-x-auto whitespace-pre-wrap break-words">
                    <span className="text-purple-400">use</span> ai<br/><br/>
                    <span className="text-amber-300">@tool</span>(permissions=<span className="text-emerald-400">"mutate"</span>)<br/>
                    <span className="text-sky-400">func</span> <span className="text-rose-300">swarm_send</span>(channel, message):<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;shm_write(channel, message)<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-400">print</span> <span className="text-emerald-400">"Swarm [TX -&gt; "</span> + channel + <span className="text-emerald-400">"] Terkirim."</span><br/><br/>
                    <span className="text-purple-400">agent</span> s1:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;model <span className="text-emerald-400">"llama-3.1-8b-instant"</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;system <span className="text-emerald-400">"Kamu Planner Agent (s1)."</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
