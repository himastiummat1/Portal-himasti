const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Import Trophy icon if not imported
if (!content.includes('Trophy')) {
  content = content.replace('Calendar, Info', 'Calendar, Info, Trophy, ExternalLink');
}

// 2. Fetch competitions data
content = content.replace(
  'const upcomingEvents = await prisma.event.findMany({',
  `const competitions = await prisma.competitionInfo.findMany({\n    orderBy: { deadline: 'asc' },\n    take: 4\n  });\n\n  const upcomingEvents = await prisma.event.findMany({`
);

const lombaWidgetHtml = `
          <div className="bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-2xl overflow-hidden mt-6">
             <div className="px-5 py-4 border-b border-slate-200/60 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Radar Hackathon Global
              </h2>
            </div>
            <div className="p-5">
              {competitions.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono text-center py-4">Belum ada info lomba ditarik.</p>
              ) : (
                <div className="space-y-4">
                  {competitions.map((c: any) => (
                    <div key={c.id} className="border-l-2 border-amber-400 pl-3 group">
                      <a href={c.link} target="_blank" className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-1">{c.title}</h4>
                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-amber-500 shrink-0 ml-2" />
                      </a>
                      <p className="text-xs text-slate-500 mt-0.5">{c.deadline ? c.deadline.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
`;

// 3. Inject into KaderView
// Find the end of Agenda Mendatang in KaderView
const kaderGridEnd = '        </div>\n\n      </div>\n    );\n  }';
content = content.replace(
  '        </div>\n\n      </div>\n    );\n  }',
  lombaWidgetHtml.replace('mt-6', '') + '\n        </div>\n\n      </div>\n    );\n  }'
);
// Wait, in KaderView, it's a grid of 2 columns, so adding a 3rd div will make it wrap nicely or unbalanced if grid-cols-2.
// Actually, I can just append it inside the right column or left.
// Let's replace the kaderGridEnd differently.

// Let's refine KaderView insertion:
const kaderAgendaMendatangEnd = `              </div>
            )}
          </div>`;
// Replace the first occurrence (which is in KaderView)
let parts = content.split(kaderAgendaMendatangEnd);
if(parts.length >= 3) {
  content = parts[0] + kaderAgendaMendatangEnd + lombaWidgetHtml.replace('mt-6', '') + parts.slice(1).join(kaderAgendaMendatangEnd);
}

fs.writeFileSync('src/app/admin/page.tsx', content);
