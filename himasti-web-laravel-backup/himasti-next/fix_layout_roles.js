const fs = require('fs');
let content = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

content = content.replace(
  "const canAccessKeuangan = isSuperAdmin || userRoles.includes('bendahara');",
  "const canAccessKeuangan = isSuperAdmin || userRoles.includes('bendahara') || userRoles.includes('bendahara_umum');"
);
content = content.replace(
  "const canAccessSurat = isSuperAdmin || userRoles.includes('admin_sekretariat');",
  "const canAccessSurat = isSuperAdmin || userRoles.includes('sekretaris_umum');"
);
content = content.replace(
  "const canAccessRapat = isSuperAdmin || userRoles.some(r => r.includes('ketua') || r.includes('sekretariat') || r.includes('bendahara') || r.includes('kabid'));",
  "const canAccessRapat = isSuperAdmin || userRoles.some(r => r.includes('ketua') || r.includes('sekretaris') || r.includes('bendahara') || r.includes('kabid'));"
);

fs.writeFileSync('src/app/admin/layout.tsx', content);
