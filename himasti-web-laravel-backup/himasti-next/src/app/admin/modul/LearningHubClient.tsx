"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Map, BookOpen, Code2, Terminal, Database, Sparkles, 
  Layout, Server, Cpu, FileCode2, ChevronRight, Search, CheckCircle2,
  X, AlignLeft, BookMarked, PlayCircle, ArrowLeft, Bot, Flame,
  ChevronLeft, ExternalLink, List, FileText
} from "lucide-react";

import { curriculumData, Chapter, Course, SemesterTrack } from "./curriculumData";

function formatMarkdown(rawContent: string) {
  if (!rawContent) return "";

  // Completely strip all asterisks (*) to eliminate AI-generated markdown look
  const cleanContent = rawContent.replace(/\*/g, "");

  // Split content by double newlines into clean semantic blocks
  const blocks = cleanContent.split(/\n\n+/);
  
  return blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";

    // Code blocks
    if (trimmed.startsWith("```")) {
      const match = trimmed.match(/^```([a-zA-Z0-9_-]*)\n([\s\S]*?)```$/);
      const lang = match ? match[1] : "";
      const code = match ? match[2] : trimmed.replace(/```/g, "");
      return `<div class="my-5 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-lg">
        <div class="px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between items-center">
          <span class="font-bold text-cyan-400">${lang ? lang.toUpperCase() : "TERMINAL / CODE"}</span>
          <span class="text-slate-500">HIMASTI Engine</span>
        </div>
        <pre class="p-4 text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto leading-relaxed"><code>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
      </div>`;
    }

    // Headers
    if (trimmed.startsWith("# ")) {
      return `<h1 class="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mt-6 mb-3 tracking-tight">${trimmed.substring(2)}</h1>`;
    }
    if (trimmed.startsWith("## ")) {
      return `<h2 class="text-lg sm:text-xl font-bold text-slate-800 mt-6 mb-2 tracking-tight pb-1.5 border-b border-slate-200">${trimmed.substring(3)}</h2>`;
    }
    if (trimmed.startsWith("### ")) {
      return `<h3 class="text-base sm:text-lg font-bold text-slate-800 mt-4 mb-2">${trimmed.substring(4)}</h3>`;
    }

    // List items
    if (trimmed.includes("\n- ") || trimmed.startsWith("- ") || trimmed.includes("\n1. ") || /^\d+\.\s/.test(trimmed)) {
      const lines = trimmed.split("\n");
      const listItems = lines.map(line => {
        const itemText = line
          .replace(/^\s*-\s+/, "")
          .replace(/^\s*\d+\.\s+/, "")
          .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-slate-100 text-violet-700 font-mono text-xs border border-slate-200">$1</code>');
        return `<li class="my-1.5 leading-relaxed">${itemText}</li>`;
      }).join("");
      return `<ul class="list-disc ml-5 my-3 text-slate-700 space-y-1">${listItems}</ul>`;
    }

    // Regular Paragraph
    const parsedText = trimmed
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-slate-100 text-violet-700 font-mono text-xs border border-slate-200">$1</code>')
      .replace(/\n/g, '<br/>');

    return `<p class="text-sm sm:text-base text-slate-600 leading-relaxed my-3">${parsedText}</p>`;
  }).join("\n");
}

export default function LearningHubClient({ userName }: { userName: string }) {
  const [activeTab, setActiveTab] = useState<"roadmap" | "materi" | "cheat" | "vidyax">("roadmap");
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [mobileTab, setMobileTab] = useState<"list" | "content">("content");

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

  const [searchModul, setSearchModul] = useState("");
  const materis: SemesterTrack[] = curriculumData;

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

  const openAiCourse = () => {
    setActiveTab("materi");
    const aiCourse = materis[0]?.courses?.[0];
    if (aiCourse) {
      setActiveCourse(aiCourse);
      setActiveChapterIndex(0);
      setMobileTab("content");
    }
  };

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
              className={`rounded-3xl p-6 sm:p-8 border transition-all ${
                rm.isRecommended 
                  ? "bg-gradient-to-b from-violet-50/60 to-white border-violet-300 shadow-md ring-2 ring-violet-500/20" 
                  : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
              }`}
            >
              {rm.isRecommended && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] sm:text-[11px] font-mono font-bold shadow-sm animate-pulse mb-4">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>SANGAT DIREKOMENDASIKAN KABID RISET (2026)</span>
                </div>
              )}

              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl border ${rm.isRecommended ? "bg-violet-100/70 border-violet-200" : "bg-slate-50 border-slate-100"}`}>
                  {rm.icon}
                </div>
                {rm.isRecommended ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={openAiCourse}
                      className="text-xs font-bold px-4 py-2 rounded-full bg-violet-900 text-white hover:bg-violet-800 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Baca Modul</span>
                    </button>
                    <Link
                      href="/admin/mcp-hub"
                      className="text-xs font-bold px-3.5 py-2 rounded-full bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <span>MCP Hub</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <a 
                    href={rm.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors flex items-center gap-1"
                  >
                    Lihat Peta Utuh <ChevronRight className="w-3 h-3" />
                  </a>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">{rm.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6 leading-relaxed">{rm.desc}</p>
              
              <div className="space-y-2.5">
                {rm.steps.map((step, i) => (
                  <div 
                    key={i} 
                    onClick={rm.isRecommended ? openAiCourse : undefined}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors border ${
                      rm.isRecommended 
                        ? "cursor-pointer hover:bg-violet-100/60 border-violet-100/80 bg-white" 
                        : "hover:bg-slate-50 border-transparent hover:border-slate-100"
                    }`}
                  >
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${rm.isRecommended ? "text-violet-600" : "text-emerald-500"}`} />
                    <span className="text-xs sm:text-sm font-medium text-slate-700">{step}</span>
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
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">Katalog Modul Interaktif (Semester 1 s/d 7)</h2>
                  <p className="text-sm text-slate-500">Pilih modul di bawah untuk mulai membaca materi perkuliahan secara interaktif.</p>
                </div>
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchModul}
                    onChange={(e) => setSearchModul(e.target.value)}
                    placeholder="Cari modul atau topik (misal: PBO, SQL, Docker)..." 
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-8 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-sm" 
                  />
                  {searchModul && (
                    <button 
                      type="button" 
                      onClick={() => setSearchModul("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(() => {
                  const filteredMateris = materis.map(smt => {
                    if (!searchModul.trim()) return smt;
                    const q = searchModul.toLowerCase();
                    const matchingCourses = smt.courses.filter(c => 
                      c.title.toLowerCase().includes(q) || 
                      c.chapters.some(ch => ch.title.toLowerCase().includes(q)) ||
                      smt.semester.toLowerCase().includes(q)
                    );
                    return { ...smt, courses: matchingCourses };
                  }).filter(smt => smt.courses.length > 0);

                  if (filteredMateris.length === 0) {
                    return (
                      <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="text-base font-bold text-slate-700">Modul Tidak Ditemukan</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                          Tidak ada modul yang cocok dengan kata kunci &quot;{searchModul}&quot;.
                        </p>
                        <button
                          type="button"
                          onClick={() => setSearchModul("")}
                          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                        >
                          Tampilkan Semua Modul
                        </button>
                      </div>
                    );
                  }

                  return filteredMateris.map((smt, idx) => (
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
                          type="button"
                          onClick={() => {
                            setActiveCourse(course);
                            setActiveChapterIndex(0);
                            setMobileTab("content");
                          }}
                          className={`w-full flex justify-between items-center p-4 rounded-2xl transition-all group text-left cursor-pointer ${
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
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-violet-600 hidden sm:inline">Buka Modul</span>
                            <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                              course.isRecommended ? "text-violet-600" : "text-slate-300 group-hover:text-slate-900"
                            }`} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ));
                })()}
              </div>
            </>
          ) : (
            // Dedicated Responsive Reader Mode
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-200">
              
              {/* Reader Top Bar */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setActiveCourse(null)} 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all active:scale-95 border border-slate-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Katalog</span>
                  </button>
                  <div className="hidden sm:block text-xs font-mono text-slate-400 border-l border-slate-800 pl-3">
                    {activeCourse.title}
                  </div>
                </div>

                {/* Mobile Segmented Toggle */}
                <div className="flex md:hidden bg-slate-800 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setMobileTab("list")}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                      mobileTab === "list" ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Daftar BAB ({activeCourse.chapters?.length || 0})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileTab("content")}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                      mobileTab === "content" ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Isi Materi</span>
                  </button>
                </div>
              </div>

              {/* Reader Body Grid (Sidebar on Desktop, Tabbed on Mobile) */}
              <div className="flex flex-col md:flex-row min-h-[550px]">
                
                {/* Chapters Sidebar */}
                <div className={`w-full md:w-80 border-r border-slate-200 bg-slate-50 p-5 space-y-4 shrink-0 ${
                  mobileTab === "list" ? "block" : "hidden md:block"
                }`}>
                  <div>
                    {activeCourse.badge && (
                      <span className="text-[10px] font-mono font-bold text-violet-700 bg-violet-100 px-2.5 py-0.5 rounded-full block w-fit mb-2">
                        {activeCourse.badge}
                      </span>
                    )}
                    <h3 className="font-extrabold text-base text-slate-800 tracking-tight leading-snug">
                      Daftar BAB Kursus
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Pilih BAB untuk membuka materinya:</p>
                  </div>

                  <div className="space-y-2">
                    {activeCourse.chapters && activeCourse.chapters.length > 0 ? (
                      activeCourse.chapters.map((chap: Chapter, idx: number) => (
                        <button 
                          key={idx} 
                          type="button"
                          onClick={() => {
                            setActiveChapterIndex(idx);
                            setMobileTab("content");
                          }}
                          className={`w-full text-left p-3.5 rounded-2xl border shadow-sm transition-all flex items-start gap-3 cursor-pointer ${
                            activeChapterIndex === idx 
                              ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-violet-500/30" 
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                          }`}
                        >
                          <PlayCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
                            activeChapterIndex === idx ? "text-amber-400" : "text-slate-400"
                          }`} />
                          <div className="flex-1">
                            <span className="text-xs font-bold leading-tight block">{chap.title}</span>
                            <span className={`text-[10px] mt-0.5 block ${
                              activeChapterIndex === idx ? "text-slate-300" : "text-slate-400"
                            }`}>
                              Klik untuk membaca
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 font-mono p-4 border border-dashed border-slate-300 rounded-2xl bg-slate-100/50">
                        Materi belum diunggah.
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className={`flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto ${
                  mobileTab === "content" ? "block" : "hidden md:block"
                }`}>
                  {currentChapter ? (
                    <div className="max-w-3xl mx-auto space-y-6">
                      
                      {/* Chapter Tag Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-violet-100 text-violet-800 rounded-full text-xs font-bold tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>BAB {activeChapterIndex + 1} DARI {activeCourse.chapters.length}</span>
                        </span>

                        <span className="text-xs font-mono text-slate-400">
                          Mode Pembaca Interaktif HIMASTI
                        </span>
                      </div>

                      {/* Rendered HTML Markdown */}
                      <div 
                        className="prose prose-slate max-w-none text-slate-700"
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(currentChapter.content) }} 
                      />

                      {/* Chapter Bottom Navigation Bar */}
                      <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button
                          type="button"
                          disabled={activeChapterIndex === 0}
                          onClick={() => {
                            if (activeChapterIndex > 0) {
                              setActiveChapterIndex(activeChapterIndex - 1);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                          }}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Bab Sebelumnya</span>
                        </button>

                        <Link
                          href="/admin/mcp-hub"
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-violet-100 text-violet-800 hover:bg-violet-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Cpu className="w-4 h-4 text-violet-600" />
                          <span>Praktek di MCP & Prompt Hub</span>
                        </Link>

                        <button
                          type="button"
                          disabled={activeChapterIndex >= (activeCourse.chapters?.length || 1) - 1}
                          onClick={() => {
                            if (activeChapterIndex < (activeCourse.chapters?.length || 1) - 1) {
                              setActiveChapterIndex(activeChapterIndex + 1);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                          }}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <span>Bab Selanjutnya</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-slate-400 text-center">
                      <BookOpen className="w-16 h-16 mb-4 text-slate-200" />
                      <p className="font-bold text-slate-600">Pilih BAB di Samping</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        Silakan klik salah satu bab pada daftar untuk mulai membaca materi teknis.
                      </p>
                    </div>
                  )}
                </div>

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
