"use client";

import React, { useState } from "react";
import {
  Cpu,
  Terminal,
  Sparkles,
  Copy,
  Check,
  Server,
  BookOpen,
  Send,
  Loader2,
  Code2,
  Shield,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Database,
  Globe,
  FileCode2,
  Lightbulb
} from "lucide-react";
import confetti from "canvas-confetti";

interface McpServerPreset {
  id: string;
  name: string;
  category: "database" | "filesystem" | "developer" | "web" | "himasti";
  desc: string;
  command: string;
  envVars: string[];
  configSnippet: Record<string, any>;
  bestFor: string;
}

interface SystemPromptPreset {
  id: string;
  title: string;
  role: string;
  targetIDE: string;
  desc: string;
  tags: string[];
  prompt: string;
}

const MCP_PRESETS: McpServerPreset[] = [
  {
    id: "postgres",
    name: "Supabase & PostgreSQL MCP",
    category: "database",
    desc: "Menghubungkan AI Agent langsung ke database Postgres/Supabase agar agent bisa membaca skema tabel dan relasi foreign key secara akurat tanpa halusinasi.",
    command: "npx -y @modelcontextprotocol/server-postgres",
    envVars: ["POSTGRES_URL"],
    bestFor: "Cursor, Claude Desktop, Antigravity",
    configSnippet: {
      mcpServers: {
        postgres: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-postgres", "postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"]
        }
      }
    }
  },
  {
    id: "filesystem",
    name: "Secure Filesystem Sandbox MCP",
    category: "filesystem",
    desc: "Memberikan izin kepada AI Agent untuk membaca, mencari dengan ripgrep, dan memodifikasi file di dalam direktori proyek secara terisolasi dan aman.",
    command: "npx -y @modelcontextprotocol/server-filesystem",
    envVars: ["ALLOWED_PATHS"],
    bestFor: "Claude Code, Claude Desktop, Windsurf",
    configSnippet: {
      mcpServers: {
        filesystem: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/nans/RepoGit/Portal-himasti-1"]
        }
      }
    }
  },
  {
    id: "github",
    name: "GitHub & Repo Context MCP",
    category: "developer",
    desc: "Memungkinkan AI Agent memeriksa pull request, melihat riwayat commit git, membuat issues, dan membaca repository GitHub organisasi secara otomatis.",
    command: "npx -y @modelcontextprotocol/server-github",
    envVars: ["GITHUB_PERSONAL_ACCESS_TOKEN"],
    bestFor: "Cursor, Antigravity, Claude Code",
    configSnippet: {
      mcpServers: {
        github: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-github"],
          env: {
            GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_your_token_here"
          }
        }
      }
    }
  },
  {
    id: "brave-search",
    name: "Brave Search & Live Web MCP",
    category: "web",
    desc: "Memberikan kemampuan browsing internet secara real-time kepada AI Agent untuk menarik dokumentasi framework versi terbaru 2026 dan troubleshooting error.",
    command: "npx -y @modelcontextprotocol/server-brave-search",
    envVars: ["BRAVE_API_KEY"],
    bestFor: "Cursor, Claude Desktop, Cline",
    configSnippet: {
      mcpServers: {
        braveSearch: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-brave-search"],
          env: {
            BRAVE_API_KEY: "your_brave_api_key"
          }
        }
      }
    }
  },
  {
    id: "vidyax-swarm",
    name: "Vidyax Swarm AI MCP (Karya M N DAFFA)",
    category: "karya-mandiri" as any,
    desc: "Server MCP khusus untuk ekosistem riset bahasa pemrograman Vidyax karya mandiri M N DAFFA. Menyediakan tool untuk parsing AST dan simulasi multi-agent execution.",
    command: "node ./scripts/vidyax-mcp.js",
    envVars: ["VIDYAX_RUNTIME_PATH"],
    bestFor: "Antigravity, Cursor",
    configSnippet: {
      mcpServers: {
        vidyaxSwarm: {
          command: "node",
          args: ["./node_modules/@himasti/vidyax-agent-mcp/index.js"],
          env: {
            VIDYAX_MODE: "swarm_development"
          }
        }
      }
    }
  }
];

const SYSTEM_PROMPTS: SystemPromptPreset[] = [
  {
    id: "nextjs-architect",
    title: "Senior Next.js 16 & Server Components Architect",
    role: "Lead Fullstack Architect",
    targetIDE: ".cursorrules / AGENTS.md",
    desc: "Instruksi ketat agar AI Agent mematuhi paradigma Next.js 16: memprioritaskan Server Components & Server Actions, menghindari use client yang tidak perlu, dan melarang useEffect untuk manipulasi state server.",
    tags: ["Next.js", "React 19", "TypeScript", "Performance"],
    prompt: `# Role: Senior Next.js 16 Architect
You are an uncompromising Lead Engineer specializing in Next.js 16 (App Router) and React 19.

## Core Rules:
1. Default to React Server Components (RSC). Only add "use client" when browser APIs (window/localStorage) or interactive state (useState/useEffect) are strictly required.
2. Form actions and mutations MUST use Next.js Server Actions with proper revalidatePath or revalidateTag.
3. Enforce strict TypeScript types. Never use "any".
4. Handle loading and error states using Suspense boundaries and error.tsx.
5. All database operations must go through Prisma Client with proper connection pooling and try/catch fault tolerance.`
  },
  {
    id: "socratic-tutor",
    title: "Socratic Coding Mentor (Dosen Pendamping Virtual)",
    role: "AI Pedagogical Coach",
    targetIDE: "Claude Code / Cursor Chat",
    desc: "Prompt pengajaran yang membuat AI tidak langsung memberikan kunci jawaban mentah, melainkan membimbing mahasiswa memahami akar masalah dan logika algoritma.",
    tags: ["Edukasi", "Algoritma", "Clean Code", "Mahasiswa"],
    prompt: `# Role: Socratic Programming Mentor for IT Students
You are a friendly yet rigorous Computer Science Professor.

## Methodology:
- When a student asks for code or pastes an error log, DO NOT immediately write the complete solution.
- Step 1: Explain what the error message means in plain, accessible Indonesian.
- Step 2: Ask the student a targeted guiding question about the variable, loop condition, or null check that caused the bug.
- Step 3: Encourage them to write the fix themselves, offering feedback on their attempt.
- Foster critical thinking, architectural intuition, and reading stack traces like a pro.`
  },
  {
    id: "security-auditor",
    title: "Red Team & Cybersecurity Code Auditor",
    role: "Security Engineer",
    targetIDE: "Antigravity / Cursor",
    desc: "Memerintahkan AI Agent untuk memindai celah keamanan: SQL Injection, Broken Access Control (RBAC), Hardcoded Secrets, dan XSS sebelum kode dirilis.",
    tags: ["Cybersecurity", "OWASP Top 10", "Audit", "RBAC"],
    prompt: `# Role: Elite Application Security Auditor
You are an expert Red Team Security Engineer reviewing code for production deployment.

## Audit Checklist:
1. Access Control: Ensure every server action and API route explicitly verifies user authentication and role permissions (Super Admin, Executive, Kader).
2. Input Sanitization: Check for SQL Injection risks in raw queries, unescaped HTML (XSS), and path traversal.
3. Secrets: Check that zero API keys, passwords, or service tokens are hardcoded. Enforce process.env.
4. Rate Limiting: Identify any endpoints susceptible to brute-force or DoS attacks.
Flag every finding with Severity (CRITICAL/HIGH/MEDIUM) and provide the exact remediation patch.`
  },
  {
    id: "tailwind-ui-master",
    title: "Modern UI/UX Designer (Anti AI-Generated Slop)",
    role: "Product Designer & Frontend Engineer",
    targetIDE: "Cursor / Windsurf",
    desc: "Menghasilkan antarmuka visual yang berkelas, minimalis, human-crafted, berlatar terang/slate elegan, dan menghindari warna gelap 'crypto/ai-slop'.",
    tags: ["Tailwind CSS", "UI/UX", "Micro-Interactions", "Accessibility"],
    prompt: `# Role: Senior Product Designer & UI Engineer
You build breathtaking, human-crafted user interfaces that never look like generic AI templates.

## Visual Design Standards:
1. Palette: Light, clean backgrounds (slate-50, white) with high-contrast slate-900 typography and subtle accents (sky-600, violet-600). Avoid dark futuristic neon themes unless specifically asked.
2. Micro-Interactions: Every interactive element must have hover, active:scale-95, and focus-visible states.
3. Spacing: Use consistent 8px grid (p-4, p-6, gap-4). Ensure comfortable line-height (leading-relaxed).
4. Mobile First: Layouts must look flawless on 360px Android devices without horizontal blowout.`
  }
];

export default function McpHubClient() {
  const [activeTab, setActiveTab] = useState<"mcp" | "prompts" | "optimizer" | "tutorial">("mcp");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Prompt Optimizer States
  const [draftPrompt, setDraftPrompt] = useState("");
  const [targetAgent, setTargetAgent] = useState("Cursor / Claude Code");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState("");
  const [optCopied, setOptCopied] = useState(false);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOptimizePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftPrompt.trim() || isOptimizing) return;

    setIsOptimizing(true);
    setOptimizedResult("");

    try {
      const res = await fetch("/api/optimize-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftPrompt, targetAgent })
      });
      const data = await res.json();
      if (data.optimizedPrompt) {
        setOptimizedResult(data.optimizedPrompt);
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#38bdf8", "#818cf8", "#f43f5e", "#fbbf24"]
          });
        } catch (_) {}
      }
    } catch (err) {
      setOptimizedResult("Terjadi kesalahan saat memproses prompt.");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-950/80 border border-violet-500/40 text-violet-300 text-xs font-mono font-bold tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI AGENTIC ERA 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              MCP & Prompt Engineering Hub
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Standardisasi konfigurasi <strong>Model Context Protocol (MCP)</strong> dan perpustakaan <em>System Prompts</em> untuk mempersiapkan kader HIMASTI menjadi <strong>AI Agent Orchestrators</strong> kelas industri.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setActiveTab("optimizer")}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>AI Prompt Studio</span>
            </button>
            <button
              onClick={() => setActiveTab("tutorial")}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Panduan MCP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-fit border border-slate-200 shrink-0 touch-pan-x">
        {[
          { id: "mcp", label: "Katalog Server MCP", icon: <Server className="w-4 h-4" /> },
          { id: "prompts", label: "Pustaka System Prompts", icon: <Terminal className="w-4 h-4" /> },
          { id: "optimizer", label: "AI Prompt Studio (Live)", icon: <Sparkles className="w-4 h-4" /> },
          { id: "tutorial", label: "Edukasi & Cara Pasang", icon: <Layers className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: KATALOG MCP SERVERS */}
      {activeTab === "mcp" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Katalog MCP Servers Siap Pakai</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Salin konfigurasi JSON ini langsung ke <code>claude_desktop_config.json</code>, <code>.cursor/mcp.json</code>, atau Antigravity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MCP_PRESETS.map((server) => {
              const snippetText = JSON.stringify(server.configSnippet, null, 2);
              const isCopied = copiedId === server.id;

              return (
                <div
                  key={server.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        {server.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Target: {server.bestFor}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Server className="w-4 h-4 text-violet-600" />
                      <span>{server.name}</span>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {server.desc}
                    </p>
                  </div>

                  {/* Code snippet display */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>mcp_config.json</span>
                      <button
                        onClick={() => copyText(snippetText, server.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                          isCopied
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin JSON</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto max-h-48 leading-relaxed">
                      <code>{snippetText}</code>
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM PROMPTS & AGENT INSTRUCTIONS */}
      {activeTab === "prompts" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pustaka System Prompts & Agent Rules</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Template instruksi sistem teruji untuk diletakkan di <code>AGENTS.md</code> atau <code>.cursorrules</code> agar hasil kodingan AI tidak asal-asalan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {SYSTEM_PROMPTS.map((item) => {
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-50 text-violet-700 border border-violet-200">
                        {item.role}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Cocok untuk: {item.targetIDE}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-blue-600" />
                      <span>{item.title}</span>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Prompt Box */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Preview Prompt</span>
                      <button
                        onClick={() => copyText(item.prompt, item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                          isCopied
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono overflow-x-auto max-h-44 leading-relaxed whitespace-pre-wrap">
                      <code>{item.prompt}</code>
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: AI PROMPT OPTIMIZER (STUDIO) */}
      {activeTab === "optimizer" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Studio AI Prompt Optimizer (Chain-of-Thought)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ketik prompt kasar atau santai Anda. Mesin AI HIMASTI akan merombaknya menjadi prompt berstruktur XML standar enterprise yang siap disalin ke AI Agent Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Input Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <form onSubmit={handleOptimizePrompt} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target AI Agent / IDE
                  </label>
                  <select
                    value={targetAgent}
                    onChange={(e) => setTargetAgent(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  >
                    <option value="Cursor / Windsurf">Cursor / Windsurf (.cursorrules)</option>
                    <option value="Claude Code / Terminal">Claude Code / Terminal Agent (CLAUDE.md)</option>
                    <option value="Google Antigravity">Google Antigravity (AGENTS.md / SKILL.md)</option>
                    <option value="ChatGPT / Claude Chat">Web Chat (ChatGPT / Claude 3.7)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Prompt Kasar Anda
                  </label>
                  <textarea
                    rows={5}
                    value={draftPrompt}
                    onChange={(e) => setDraftPrompt(e.target.value)}
                    placeholder="Contoh: buatin sistem presensi qr code pake nextjs yang ada anti joki nya..."
                    className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tips: Cukup ceritakan apa yang mau dibuat dalam bahasa santai sehari-hari.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!draftPrompt.trim() || isOptimizing}
                  className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 active:scale-95"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Mengoptimasi Struktur Prompt...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Optimalkan ke Standar Agentic XML</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Output Result */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> PROMPT HASIL OPTIMASI
                </span>

                {optimizedResult && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(optimizedResult);
                      setOptCopied(true);
                      setTimeout(() => setOptCopied(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                  >
                    {optCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Hasil</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {optimizedResult ? (
                <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto border border-slate-800">
                  <code>{optimizedResult}</code>
                </pre>
              ) : (
                <div className="py-16 text-center text-slate-500 text-xs font-mono">
                  Prompt hasil optimasi akan muncul di sini lengkap dengan tag &lt;role&gt;, &lt;context&gt;, dan &lt;constraints&gt;.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TUTORIAL & EDUKASI */}
      {activeTab === "tutorial" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Panduan Mahasiswa IT HIMASTI
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Apa itu Model Context Protocol (MCP) & AI Agents?
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                Di tahun 2026, Large Language Model (LLM) tidak lagi hanya menjadi chatbot pasif. Melalui standar terbuka <strong>Model Context Protocol (MCP)</strong> dari Anthropic, AI kini bisa diberikan <em>alat bantu nyata (tools)</em> untuk membaca database lokal, terminal, dan file source code Anda secara aman.
              </p>
            </div>

            {/* Architecture Diagram */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Alur Kerja Ekosistem MCP
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2 font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">MCP Host / Client</h4>
                  <p className="text-slate-500">Cursor, Windsurf, Claude Desktop, Antigravity CLI</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2 font-bold">
                    2
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">MCP Protocol</h4>
                  <p className="text-slate-500">Jalur komunikasi standar JSON-RPC 2.0 yang aman</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 font-bold">
                    3
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">MCP Servers / Tools</h4>
                  <p className="text-slate-500">Database Postgres, Git, Filesystem, Browser Search</p>
                </div>
              </div>
            </div>

            {/* Step-by-step Setup */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Cara Memasang MCP di Cursor / Claude Desktop dalam 3 Langkah:
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900">Buka Menu Pengaturan MCP:</strong>
                    <p className="text-slate-500 mt-0.5">
                      Di Cursor: Buka <code>Settings ➔ Features ➔ MCP Servers</code>. Di Claude Desktop: Buka menu <code>Settings ➔ Developer ➔ Edit Config</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900">Salin Konfigurasi dari Tab MCP Hub Ini:</strong>
                    <p className="text-slate-500 mt-0.5">
                      Pilih server yang Anda butuhkan (misal PostgreSQL atau GitHub MCP), klik tombol <strong>"Salin JSON"</strong>, dan tempelkan ke file konfigurasi Anda.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900">Mulai Berkolaborasi dengan AI Agent:</strong>
                    <p className="text-slate-500 mt-0.5">
                      Sekarang AI Anda bisa langsung mengecek skema database dan file proyek Anda tanpa Anda harus mengetikkan konteks berulang-ulang secara manual!
                    </p>
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
