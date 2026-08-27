const fs = require('fs');
let content = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

// Remove AD/ART from Akademik
content = content.replace(
  '    groupAkademik.links.push({ href: "/admin/adart", label: "AD/ART & Konstitusi" });\n',
  ''
);

// Add new Organisasi group at the top
const searchGroupUtama = '// Group Utama';
const replaceGroupUtama = `// Group Organisasi (Global)
  const groupOrganisasi = { title: "Profil & Organisasi", links: [] as any[] };
  groupOrganisasi.links.push({ href: "/admin/adart", label: "AD/ART & Konstitusi" });
  groups.push(groupOrganisasi);

  // Group Utama`;
content = content.replace(searchGroupUtama, replaceGroupUtama);

fs.writeFileSync('src/app/admin/layout.tsx', content);
