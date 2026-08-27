const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

content = content.replace(
  '<Link href="#" className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-sky-200 transition-colors group text-center">\n                <Info className="w-6 h-6 text-slate-400 mx-auto mb-2 group-hover:text-sky-500 transition-colors" />\n                <span className="text-xs font-semibold text-slate-700">Katalog Karya (Coming Soon)</span>\n              </Link>',
  '<Link href="/admin/katalog" className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-sky-200 transition-colors group text-center">\n                <LayoutGrid className="w-6 h-6 text-slate-400 mx-auto mb-2 group-hover:text-sky-500 transition-colors" />\n                <span className="text-xs font-semibold text-slate-700">Katalog Karya</span>\n              </Link>'
);

// We need to import LayoutGrid
if (!content.includes('LayoutGrid')) {
  content = content.replace('Info, Trophy, ExternalLink, Code', 'Info, Trophy, ExternalLink, Code, LayoutGrid');
}

fs.writeFileSync('src/app/admin/page.tsx', content);
