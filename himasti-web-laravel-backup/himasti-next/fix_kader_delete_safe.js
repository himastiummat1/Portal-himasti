const fs = require('fs');
let content = fs.readFileSync('src/app/admin/kader/actions.ts', 'utf8');

content = content.replace(
  'await prisma.surat.deleteMany({ where: { user_id: userId } });',
  'await prisma.surat.updateMany({ where: { user_id: userId }, data: { user_id: null } });'
);

fs.writeFileSync('src/app/admin/kader/actions.ts', content);
