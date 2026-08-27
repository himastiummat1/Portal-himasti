const fs = require('fs');
let content = fs.readFileSync('src/app/admin/keuangan/page.tsx', 'utf8');

content = content.replace(
  'isExecutive={isExecutive}',
  'isExecutive={!!isExecutive}'
);

fs.writeFileSync('src/app/admin/keuangan/page.tsx', content);
