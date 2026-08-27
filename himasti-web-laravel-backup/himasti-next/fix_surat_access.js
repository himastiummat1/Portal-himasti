const fs = require('fs');
let content = fs.readFileSync('src/app/admin/surat/page.tsx', 'utf8');

// Bypass executive check for Kabid R&D (Daffa / tes)
content = content.replace(
  'const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("sekretaris") || r.role.name.includes("ketua"));',
  'const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("sekretaris") || r.role.name.includes("ketua")) || session.user?.name?.includes("tes") || session.user?.name?.includes("DAFFA");'
);

fs.writeFileSync('src/app/admin/surat/page.tsx', content);
