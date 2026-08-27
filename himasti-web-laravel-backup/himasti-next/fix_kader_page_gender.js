const fs = require('fs');
let content = fs.readFileSync('src/app/admin/kader/page.tsx', 'utf8');

content = content.replace(
  'jenis_kelamin: (k as any).jenis_kelamin || "-",',
  'jenis_kelamin: k.jenis_kelamin || "-",'
);

fs.writeFileSync('src/app/admin/kader/page.tsx', content);
