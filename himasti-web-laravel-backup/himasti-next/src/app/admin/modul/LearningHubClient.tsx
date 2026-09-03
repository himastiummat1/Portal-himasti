"use client";

import { useState } from "react";
import { 
  Map, BookOpen, Code2, Terminal, Database, Sparkles, 
  Layout, Server, Cpu, FileCode2, ChevronRight, Search, CheckCircle2,
  X, AlignLeft, BookMarked, PlayCircle, ArrowLeft, Bot, Flame
} from "lucide-react";

interface Chapter {
  title: string;
  content: string;
}

interface Course {
  title: string;
  badge?: string;
  isRecommended?: boolean;
  chapters: Chapter[];
}

interface SemesterTrack {
  semester: string;
  isRecommended?: boolean;
  courses: Course[];
}

export default function LearningHubClient({ userName }: { userName: string }) {
  const [activeTab, setActiveTab] = useState<"roadmap" | "materi" | "cheat" | "vidyax">("roadmap");
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  const roadmaps = [
    {
      id: "ai-agent",
      link: "/admin/mcp-hub",
      title: "AI Agentic Software Engineer (2026 Recommended)",
      isRecommended: true,
      icon: <Cpu className="w-8 h-8 text-violet-600" />,
      desc: "JALUR PALING DIBURU INDUSTRI 2026: Kuasai orkestrasi AI Agents, Model Context Protocol (MCP), Context Engineering, dan Autonomous Dev Workflows.",
      steps: [
        "1. Mindset Shift: Dari pengetik sintaks manual menjadi AI System Orchestrator",
        "2. Modern Tooling: Terminal CLI, Git Flow, & Agentic IDE (Cursor, Claude Code, Antigravity)",
        "3. Context Engineering: Menyusun AGENTS.md, .cursorrules, & System Prompt XML",
        "4. Tool Integration: Memasang Model Context Protocol (MCP) Database & Filesystem",
        "5. Automated Verification: Continuous Typecheck (tsc), Linter, & Test-Driven Verification",
        "6. Multi-Agent Loops: Sub-agents, task decomposition, & swarm architecture",
        "7. Critical Review: Mencegah halusinasi kode & memvalidasi keamanan aplikasi"
      ]
    },
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

  const materis: SemesterTrack[] = [
    {
      semester: "Kurikulum Khusus • AI Agentic Era 2026",
      isRecommended: true,
      courses: [
        {
          title: "AI Agentic Engineering & Model Context Protocol (MCP)",
          badge: "🔥 SANGAT DIREKOMENDASIKAN KABID RISET",
          isRecommended: true,
          chapters: [
            {
              title: "BAB 1: Revolusi Agentic AI — Mengapa Web Chat Mulai Ketinggalan Zaman?",
              content: `# BAB 1: Dari Chatbot Pasif ke AI Agent Otonom

Banyak mahasiswa IT saat ini masih terjebak di pola lama: membuka ChatGPT atau Gemini di peramban web, mengetik potongan kode terisolasi, lalu menyalinnya bolak-balik secara manual. Pola ini sangat lambat dan membuat mahasiswa bingung ketika proyek mulai kompleks.

## Perbedaan Mendasar: Web Chat vs. AI Agent
1. **Web Chat (Pasif):** Hanya menerima prompt teks dan mengeluarkan teks. AI tidak bisa melihat repositori proyek Anda, tidak bisa menjalankan perintah terminal, dan tidak tahu apakah kodenya menghasilkan error saat dikompilasi.
2. **AI Coding Agent (Aktif & Otonom):** Memiliki **siklus loop: Observe ➔ Plan ➔ Tool Execution ➔ Verify**. Agent membaca struktur folder langsung, mengedit file spesifik menggunakan *diff*, menjalankan kompilasi (*typecheck* / *test*), dan otomatis memperbaiki diri jika terjadi *syntax error*.

## Alat-Alat Utama Agentic Era:
- **Cursor & Windsurf:** IDE modern bertenaga agen yang mampu membaca seluruh basis kode.
- **Claude Code & Google Antigravity:** CLI Agent yang bisa mengendalikan terminal, git, dan sub-agent otonom.
- **Model Context Protocol (MCP):** Standar protokol terbuka yang menghubungkan LLM ke database, filesystem, dan server lokal.`
            },
            {
              title: "BAB 2: Anatomi IDE AI Agents (Cursor, Claude Code, Antigravity)",
              content: `# BAB 2: Anatomi dan Cara Kerja AI Coding Agent

Bagaimana sebuah agen AI bisa mengedit ratusan baris kode tanpa merusak keseluruhan aplikasi?

## 1. Tool Groups (Senjata Utama AI Agent)
Sebuah agen AI modern dilengkapi dengan 3 kelompok perkakas (*tooling*):
- **Read Tools:** Ripgrep (pencarian teks kilat), fd/find (pencarian nama file), view_file (membaca isi file).
- **Write Tools:** replace_file_content (mengedit baris tertentu dengan presisi), write_to_file (membuat file baru).
- **Execution Tools:** run_command (menjalankan terminal bash, git status, npx tsc, npm run build).

## 2. Loop Verifikasi Otomatis (Anti-Halusinasi)
Programmer yang cerdas tidak percaya begitu saja pada output AI. Kita melatih agen untuk selalu menjalankan:
\`\`\`bash
# Verifikasi typecheck sebelum commit
npx tsc --noEmit
\`\`\`
Jika perintah verifikasi di atas menghasilkan error, agen akan secara otomatis membaca pesan error tersebut dan memperbaikinya sampai exit code menjadi 0.`
            },
            {
              title: "BAB 3: Model Context Protocol (MCP) — Standar Terbuka Industri",
              content: `# BAB 3: Memahami Model Context Protocol (MCP)

Model Context Protocol (MCP) adalah standar protokol terbuka yang diperkenalkan oleh Anthropic untuk memecahkan masalah integrasi AI.

## Kenapa MCP Dibutuhkan?
Sebelum ada MCP, jika Anda ingin AI Anda membaca database PostgreSQL atau file lokal, Anda harus mengekspor data ke format CSV/JSON dan mengunggahnya manual ke jendela chat.
Dengan MCP, database lokal Anda berjalan sebagai **MCP Server** yang aman:
\`\`\`json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost:5432/db"]
    }
  }
}
\`\`\`
AI Agent kini bisa mengecek nama tabel, tipe data kolom, dan foreign key secara instan tanpa perlu Anda ketik berulang-ulang.`
            },
            {
              title: "BAB 4: Menyusun Agent Rules (AGENTS.md & .cursorrules)",
              content: `# BAB 4: Merancang Instruksi Agen Berkualitas Tinggi

AI Agent akan bekerja sesuai dengan batasan aturan (*constraints*) yang Anda berikan. Tanpa aturan, AI cenderung menghasilkan kode spaghetti atau teknologi kadaluarsa.

## File Panduan Konteks:
- **AGENTS.md:** Digunakan oleh agen modern (seperti Antigravity dan Claude Code) untuk membaca arsitektur dan larangan teknis.
- **.cursorrules:** Digunakan oleh Cursor IDE untuk mendikte standar kode setiap kali membuka proyek.

## Contoh Aturan Tegas (Negative Constraints):
\`\`\`markdown
# Aturan Rekayasa Next.js 16:
1. Utamakan React Server Components (RSC). DILARANG menggunakan "use client" kecuali ada event listener browser.
2. DILARANG menggunakan useEffect untuk sinkronisasi state data fetching.
3. Seluruh mutasi database WAJIB menggunakan Server Actions dengan validasi skema Zod.
\`\`\`
Dengan aturan ini, kode yang dihasilkan agen dijamin rapi, aman, dan siap produksi!`
            }
          ]
        }
      ]
    },
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
      title: "Agentic MCP & AI CLI Quickstart (2026)",
      lang: "BASH",
      code: "# 1. Install & Test PostgreSQL MCP Server\nnpx -y @modelcontextprotocol/server-postgres postgresql://user:pass@localhost:5432/db\n\n# 2. Run Typecheck Verification for Next.js\nnpx tsc --noEmit\n\n# 3. Quick Git Sync for Autonomous Agents\ngit add . && git commit -m \"feat: agentic workflow implementation\" && git push origin main"
    },
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

  const currentChapter = activeCourse?.chapters?.[activeChapterIndex] || activeCourse?.chapters?.[0];

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

      {/* TABS (Mobile Friendly Scrollable) */}
      <div className="flex overflow-x-auto gap-1.5 sm:gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-fit max-w-full border border-slate-200 shrink-0 touch-pan-x">
        {[
          { id: "roadmap", label: "Role Roadmap", icon: <Map className="w-4 h-4" /> },
          { id: "materi", label: "Bank Modul IT", icon: <BookOpen className="w-4 h-4" /> },
          { id: "cheat", label: "Cheat Sheets", icon: <Terminal className="w-4 h-4" /> },
          { id: "vidyax", label: "Vidyax (Karya M N DAFFA)", icon: <Code2 className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setActiveCourse(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/80" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: ROADMAP */}
      {activeTab === "roadmap" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-300">
          {roadmaps.map(rm => (
            <div 
              key={rm.id} 
              className={`rounded-3xl p-8 border transition-all ${
                rm.isRecommended 
                  ? "bg-gradient-to-b from-violet-50/50 to-white border-violet-300 shadow-md ring-2 ring-violet-500/20" 
                  : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
              }`}
            >
              {rm.isRecommended && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] sm:text-[11px] font-mono font-bold shadow-sm animate-pulse mb-4">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>SANGAT DIREKOMENDASIKAN (KABID RISET 2026)</span>
                </div>
              )}

              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl border ${rm.isRecommended ? "bg-violet-100/70 border-violet-200" : "bg-slate-50 border-slate-100"}`}>
                  {rm.icon}
                </div>
                <a 
                  href={rm.link} 
                  target={rm.link.startsWith("http") ? "_blank" : undefined}
                  rel={rm.link.startsWith("http") ? "noreferrer" : undefined} 
                  className={`text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1 ${
                    rm.isRecommended ? "bg-violet-900 text-white hover:bg-violet-800 shadow-sm" : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  Lihat Modul & Tools <ChevronRight className="w-3 h-3" />
                </a>
              </div>

              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{rm.title}</h3>
              <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">{rm.desc}</p>
              
              <div className="space-y-3">
                {rm.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${rm.isRecommended ? "text-violet-600" : "text-emerald-500"}`} />
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
                  <div 
                    key={idx} 
                    className={`rounded-3xl overflow-hidden shadow-sm border ${
                      smt.isRecommended 
                        ? "bg-gradient-to-b from-violet-50/40 to-white border-violet-300 md:col-span-2 ring-1 ring-violet-500/20" 
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className={`px-6 py-5 border-b flex flex-wrap justify-between items-center gap-2 ${
                      smt.isRecommended ? "bg-violet-950 text-white border-violet-900" : "bg-slate-50 border-slate-200"
                    }`}>
                      <div className="flex items-center gap-2">
                        {smt.isRecommended && <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />}
                        <span className={`font-bold tracking-tight ${smt.isRecommended ? "text-white" : "text-slate-800"}`}>
                          {smt.semester}
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        smt.isRecommended ? "bg-violet-800 text-violet-200" : "bg-slate-200 text-slate-700"
                      }`}>
                        {smt.courses.length} Kursus
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 p-2">
                      {smt.courses.map((course, i) => (
                        <button 
                          key={i} 
                          onClick={() => {
                            setActiveCourse(course);
                            setActiveChapterIndex(0);
                          }}
                          className={`w-full flex justify-between items-center p-4 rounded-2xl transition-all group text-left ${
                            course.isRecommended 
                              ? "hover:bg-violet-50/80 border border-violet-100 bg-violet-50/20 my-1" 
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl transition-colors ${
                              course.isRecommended 
                                ? "bg-violet-600 text-white" 
                                : "bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white"
                            }`}>
                              <BookMarked className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                                  {course.title}
                                </h4>
                                {course.isRecommended && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-mono font-bold tracking-wider">
                                    DIREKOMENDASIKAN
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{course.chapters?.length || 0} BAB Tersedia • Klik untuk membaca</p>
                            </div>
                          </div>
                          <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                            course.isRecommended ? "text-violet-600" : "text-slate-300 group-hover:text-slate-900"
                          }`} />
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
                  <button 
                    onClick={() => setActiveCourse(null)} 
                    className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Kembali
                  </button>
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs font-mono">H</div>
                </div>
                <div className="p-5 overflow-y-auto grow space-y-4">
                  <div>
                    {activeCourse.badge && (
                      <span className="text-[10px] font-mono font-bold text-violet-700 bg-violet-100 px-2.5 py-0.5 rounded-full block w-fit mb-2">
                        {activeCourse.badge}
                      </span>
                    )}
                    <h3 className="font-black text-lg text-slate-800 tracking-tight leading-tight">{activeCourse.title}</h3>
                  </div>

                  <div className="space-y-1.5">
                    {activeCourse.chapters && activeCourse.chapters.length > 0 ? (
                      activeCourse.chapters.map((chap: any, idx: number) => (
                        <button 
                          key={idx} 
                          onClick={() => setActiveChapterIndex(idx)}
                          className={`w-full text-left p-3 rounded-xl border shadow-sm transition-colors flex items-center gap-3 ${
                            activeChapterIndex === idx 
                              ? "bg-slate-900 text-white border-slate-900" 
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <PlayCircle className={`w-4 h-4 shrink-0 ${activeChapterIndex === idx ? "text-amber-400" : "text-slate-400"}`} />
                          <span className="text-xs sm:text-sm font-semibold leading-snug">{chap.title}</span>
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
                {currentChapter ? (
                  <div className="max-w-3xl mx-auto prose prose-slate prose-headings:tracking-tight prose-a:text-sky-600 prose-pre:bg-slate-900 prose-pre:text-slate-50">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-xs font-bold tracking-widest mb-8">
                      <Sparkles className="w-3 h-3 text-amber-500" /> {currentChapter.title}
                    </span>
                    <div dangerouslySetInnerHTML={{ 
                      __html: currentChapter.content
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#039;')
                        .replace(/```python([\s\S]*?)```/g, '<pre class="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm mt-4 overflow-x-auto"><code>$1</code></pre>')
                        .replace(/```json([\s\S]*?)```/g, '<pre class="p-4 rounded-xl bg-slate-900 text-cyan-400 font-mono text-xs sm:text-sm mt-4 overflow-x-auto"><code>$1</code></pre>')
                        .replace(/```bash([\s\S]*?)```/g, '<pre class="p-4 rounded-xl bg-slate-950 text-amber-300 font-mono text-xs sm:text-sm mt-4 overflow-x-auto"><code>$1</code></pre>')
                        .replace(/```markdown([\s\S]*?)```/g, '<pre class="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs sm:text-sm mt-4 overflow-x-auto"><code>$1</code></pre>')
                        .replace(/```([\s\S]*?)```/g, '<pre class="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm mt-4 overflow-x-auto"><code>$1</code></pre>')
                        .replace(/\n/g, '<br/>')
                    }} />
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

      {/* TAB CONTENT: CHEAT SHEETS */}
      {activeTab === "cheat" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cheatsheets.map((cs, idx) => (
              <div key={idx} className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400 px-3 py-1 bg-slate-800 rounded-full">{cs.lang}</span>
                    <Terminal className="w-4 h-4 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4 tracking-tight">{cs.title}</h3>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 font-mono text-xs text-emerald-400 overflow-x-auto">
                  <pre>{cs.code}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: VIDYAX (KARYA MANDIRI M N DAFFA) */}
      {activeTab === "vidyax" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-8 md:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
            {/* Background Ambient Glow (Contained) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -right-10 -top-10 w-72 sm:w-96 h-72 sm:h-96 bg-rose-500/20 blur-3xl rounded-full"></div>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-full text-xs font-mono font-bold tracking-widest">
                <Sparkles className="w-3 h-3" /> KARYA MANDIRI • M N DAFFA
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">Vidyax</h2>
                  <p className="text-xs sm:text-sm font-mono text-rose-400 mt-1">Experimental AI-First Language by M N DAFFA</p>
                </div>
                <a 
                  href="https://github.com/Vidyax-Lang/Vidyax" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all shadow-md active:scale-95 text-xs sm:text-sm w-full sm:w-auto shrink-0"
                >
                  <Code2 className="w-4 h-4 text-slate-900" />
                  <span>Lihat di GitHub</span>
                </a>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                Sebuah bahasa pemrograman eksperimental <strong className="text-white">AI-first</strong> hasil karya dan rekayasa perangkat lunak mandiri dari <strong className="text-rose-400">M N DAFFA</strong> yang dibangun secara independen bersama Kecerdasan Buatan (AI). Proyek ini mendemonstrasikan kekuatan kolaborasi manusia-mesin dalam menciptakan arsitektur bahasa pemrograman yang mendukung orkestrasi <em>LLM & Multi-Agent Swarm</em>.
              </p>

              {/* Architecture Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                  <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-1">01 • Syntax</div>
                  <h4 className="text-sm font-bold text-white mb-1">LLM-Native AST</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Struktur sintaks dirancang agar mudah di-parse dan di-generate oleh model kecerdasan buatan.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                  <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">02 • Runtime</div>
                  <h4 className="text-sm font-bold text-white mb-1">Swarm Agents</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Mendukung eksekusi paralel multi-agent otonom dalam satu runtime terpadu.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">03 • Creator</div>
                  <h4 className="text-sm font-bold text-white mb-1">Karya Mandiri M N DAFFA</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Dirancang dan dikembangkan secara independen oleh M N DAFFA sebagai riset kompilator modern.</p>
                </div>
              </div>

              {/* Code Snippet Box (Responsive) */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
                <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-rose-400" />
                    main.vdx
                  </span>
                  <span className="text-[10px] text-slate-500">Vidyax v0.1.0-alpha</span>
                </div>
                <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed whitespace-pre max-w-full">
{`// Vidyax AI-First Language Sample
swarm CodeArchitect {
    agent planner {
        role: "Architecture Director"
        task: "Design database schema & security bounds"
    }

    agent executor {
        role: "Core Builder"
        execute: parallel
    }
}

fn main() {
    print("Vidyax Swarm initialized successfully.")
}`}
                </pre>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
