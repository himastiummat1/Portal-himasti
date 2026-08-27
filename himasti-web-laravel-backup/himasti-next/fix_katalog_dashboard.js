const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// The block looks like this:
// <Link href="#" className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-sky-200 transition-colors group text-center">
//   <FileText className="w-6 h-6 text-slate-400 mx-auto mb-2 group-hover:text-sky-500 transition-colors" />
//   <span className="text-xs font-semibold text-slate-700">Katalog Karya (Coming Soon)</span>
// </Link>

content = content.replace(
  'Katalog Karya (Coming Soon)',
  'Katalog Karya'
);
content = content.replace(
  '<FileText className="w-6 h-6 text-slate-400 mx-auto mb-2 group-hover:text-sky-500 transition-colors" />\n                <span className="text-xs font-semibold text-slate-700">Katalog Karya</span>',
  '<LayoutGrid className="w-6 h-6 text-slate-400 mx-auto mb-2 group-hover:text-sky-500 transition-colors" />\n                <span className="text-xs font-semibold text-slate-700">Katalog Karya</span>'
);
// Replace the specific href="#" just before that LayoutGrid
content = content.replace(
  '<Link href="#" className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-sky-200 transition-colors group text-center">\n                <LayoutGrid',
  '<Link href="/admin/karya" className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-sky-200 transition-colors group text-center">\n                <LayoutGrid'
);

fs.writeFileSync('src/app/admin/page.tsx', content);
