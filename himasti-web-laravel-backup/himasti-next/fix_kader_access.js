const fs = require('fs');
let content = fs.readFileSync('src/app/admin/kader/page.tsx', 'utf8');

// Bypass executive check for Kabid R&D (Daffa / tes)
content = content.replace(
  'const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("kabid_kaderisasi") || r.role.name.includes("sekretaris"));',
  'const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("kabid_kaderisasi") || r.role.name.includes("sekretaris")) || session.user?.name?.includes("tes") || session.user?.name?.includes("DAFFA");'
);

fs.writeFileSync('src/app/admin/kader/page.tsx', content);
