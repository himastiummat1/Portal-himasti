const fs = require('fs');
let content = fs.readFileSync('src/app/admin/karya/KaryaClient.tsx', 'utf8');

// I need to add Lock and Download icons
if (!content.includes('Download')) {
  content = content.replace('LayoutGrid, Rocket, Sparkles', 'LayoutGrid, Rocket, Sparkles, Download, Lock');
}

// Locate the Footer Actions rendering block
const oldButtons = `<div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-2">
              <a href={work.demo} target="_blank" className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-white border border-slate-200 hover:border-sky-300 hover:text-sky-600 rounded-xl text-xs font-semibold text-slate-700 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Kunjungi
              </a>
              <a href={work.repo} target="_blank" className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors">
                <GitBranch className="w-3.5 h-3.5" /> Repositori
              </a>
            </div>`;

const newButtons = `<div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-2">
              <a href={work.demo} target={work.demo === "#" ? "_self" : "_blank"} className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-white border border-slate-200 hover:border-sky-300 hover:text-sky-600 rounded-xl text-xs font-semibold text-slate-700 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> {work.demo === "#" ? "Demo Offline" : "Kunjungi"}
              </a>
              
              {work.repo === "#" ? (
                <button onClick={() => alert("File ZIP Source Code sedang dipersiapkan...")} className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              ) : (
                <a href={work.repo} target="_blank" className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors">
                  <GitBranch className="w-3.5 h-3.5" /> Repositori
                </a>
              )}
            </div>`;

content = content.replace(oldButtons, newButtons);

fs.writeFileSync('src/app/admin/karya/KaryaClient.tsx', content);
