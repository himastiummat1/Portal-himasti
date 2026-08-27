const fs = require('fs');

// Fix page.tsx
let pageContent = fs.readFileSync('src/app/admin/kader/page.tsx', 'utf8');
pageContent = pageContent.replace(
  'r.role.name.includes("kabid_kaderisasi")',
  'r.role.name.includes("kaderisasi") || r.role.name.includes("pengkaderan")'
);
fs.writeFileSync('src/app/admin/kader/page.tsx', pageContent);

// Fix actions.ts
let actionsContent = fs.readFileSync('src/app/admin/kader/actions.ts', 'utf8');
actionsContent = actionsContent.replace(
  'r.role.name.includes("sekretaris")) || session',
  'r.role.name.includes("sekretaris") || r.role.name.includes("kaderisasi") || r.role.name.includes("pengkaderan")) || session'
);
fs.writeFileSync('src/app/admin/kader/actions.ts', actionsContent);
