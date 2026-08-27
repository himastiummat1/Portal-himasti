const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const leaderboardWidget = `          {/* Dewa Kode Leaderboard */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Dewa Kode HIMASTI</h3>
                <p className="text-sm text-slate-500">Top Kontributor GitHub (Bulan Ini)</p>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              {[
                { name: "M N DAFFA", role: "The Architect", score: "1,240", icon: "👑" },
                { name: "Arif Rahman", role: "Code Ninja", score: "980", icon: "🔥" },
                { name: "Samiul Ghozi", role: "Bug Hunter", score: "750", icon: "⚔️" },
                { name: "Husni Mubarok", role: "Frontend Wizard", score: "620", icon: "✨" }
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                      {i === 0 ? p.icon : i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{p.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{p.score}</p>
                    <p className="text-[10px] text-slate-500">Commits</p>
                  </div>
                </div>
              ))}
            </div>
          </div>`;

const terminalKader = `\n      <TerminalEasterEgg userName={session?.user?.name || "Kader"} />\n    </div>\n    );\n  }`;

// 1. Inject Leaderboard into KaderView
const targetAnchor = '            </div>\n          </div>\n\n        </div>\n\n      </div>\n    );\n  }';
const newReplacement = '            </div>\n          </div>\n\n' + leaderboardWidget + '\n\n        </div>\n\n      </div>' + terminalKader;

content = content.replace(targetAnchor, newReplacement);

fs.writeFileSync('src/app/admin/page.tsx', content);
