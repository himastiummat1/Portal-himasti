const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Add Code icon to imports
if (!content.includes('Code,')) {
  content = content.replace('Info, Trophy, ExternalLink', 'Info, Trophy, ExternalLink, Code');
}

// 2. Add to KaderView grid
const newKaderButton = `              <Link href="/admin/devtools" className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-sky-200 transition-colors group text-center">
                <Code className="w-6 h-6 text-slate-400 mx-auto mb-2 group-hover:text-sky-500 transition-colors" />
                <span className="text-xs font-semibold text-slate-700">Dev Tools</span>
              </Link>`;

content = content.replace(
  '<span className="text-xs font-semibold text-slate-700">Katalog Karya (Coming Soon)</span>\n              </Link>',
  '<span className="text-xs font-semibold text-slate-700">Katalog Karya (Coming Soon)</span>\n              </Link>\n' + newKaderButton
);

// 3. Add to AdminView list
const newAdminListItem = `                { title: "Developer Tools", desc: "Utilitas ringan (JSON, Base64, Hash) untuk mempermudah coding", href: "/admin/devtools", reqSuper: false },`;
content = content.replace(
  '{ title: "Manajemen Hak Akses (RBAC)", desc: "Pengaturan permissions dan delegasi peran", href: "/admin/roles", reqSuper: true },',
  '{ title: "Manajemen Hak Akses (RBAC)", desc: "Pengaturan permissions dan delegasi peran", href: "/admin/roles", reqSuper: true },\n' + newAdminListItem
);

fs.writeFileSync('src/app/admin/page.tsx', content);
