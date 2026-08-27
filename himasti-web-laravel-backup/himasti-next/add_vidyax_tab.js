const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

// 1. Add Sparkles to imports
if (!content.includes('Sparkles')) {
  content = content.replace('Terminal, Database,', 'Terminal, Database, Sparkles,');
}

// 2. Add "vidyax" to the activeTab type
content = content.replace(
  'useState<"roadmap" | "materi" | "cheat">("roadmap")',
  'useState<"roadmap" | "materi" | "cheat" | "vidyax">("roadmap")'
);

// 3. Add the Vidyax Tab Button
const tabsDefinition = `        {[
          { id: "roadmap", label: "Peta Jalan (Roadmap)", icon: <Map className="w-4 h-4" /> },
          { id: "materi", label: "Bank Materi Kuliah", icon: <BookOpen className="w-4 h-4" /> },
          { id: "cheat", label: "Kode & Cheat Sheet", icon: <Code2 className="w-4 h-4" /> },
          { id: "vidyax", label: "Vidyax Language", icon: <Sparkles className="w-4 h-4 text-rose-500" /> },
        ].map((tab) => (`;
content = content.replace(/\{\[\s*\{\s*id:\s*"roadmap"[\s\S]*?\]\.map\(\(tab\) => \(/g, tabsDefinition);

// 4. Add the Vidyax Tab Content at the bottom before </div>
const vidyaxTabContent = `
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
                  Bahasa pemrograman <strong className="text-white">AI-first</strong> revolusioner ciptaan Daffa (Kader HIMASTI). Dirancang dari nol dengan dukungan bawaan untuk orkestrasi <em>LLM</em>, <em>Swarm Multi-Agent</em>, dan <em>Native Tool Calling</em>.
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
                  <div className="p-5 text-sm font-mono text-slate-300 leading-loose overflow-x-auto">
                    <span className="text-purple-400">use</span> ai<br/><br/>
                    <span className="text-amber-300">@tool</span>(permissions=<span className="text-emerald-400">"mutate"</span>)<br/>
                    <span className="text-sky-400">func</span> <span className="text-rose-300">swarm_send</span>(channel, message):<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;shm_write(channel, message)<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-400">print</span> <span className="text-emerald-400">"Swarm [TX -> "</span> + channel + <span className="text-emerald-400">"] Terkirim."</span><br/><br/>
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
`;

content = content.replace(/    <\/div>\n  \);\n\}\n$/, vidyaxTabContent + '\n    </div>\n  );\n}\n');

fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
