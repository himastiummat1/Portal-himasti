const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

content = content.replace(
  '<button onClick={() => alert("Segera Hadir")}',
  '<Link href="#"'
);

content = content.replace(
  '<span className="text-xs font-semibold text-slate-700">Katalog Karya</span>\n              </button>',
  '<span className="text-xs font-semibold text-slate-700">Katalog Karya (Coming Soon)</span>\n              </Link>'
);

fs.writeFileSync('src/app/admin/page.tsx', content);
