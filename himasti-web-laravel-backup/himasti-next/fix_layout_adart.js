const fs = require('fs');
let content = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

const search = 'groupAkademik.links.push({ href: "/admin/karya", label: "Katalog Karya" });';
const replace = 'groupAkademik.links.push({ href: "/admin/karya", label: "Katalog Karya" });\n    groupAkademik.links.push({ href: "/admin/adart", label: "AD/ART & Konstitusi" });';
content = content.replace(search, replace);

fs.writeFileSync('src/app/admin/layout.tsx', content);
