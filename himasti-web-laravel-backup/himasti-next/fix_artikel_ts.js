const fs = require('fs');
let content = fs.readFileSync('src/app/admin/artikel/page.tsx', 'utf8');

content = content.replace(
  'created_at: record.created_at.toISOString(),',
  'created_at: record.created_at ? record.created_at.toISOString() : new Date().toISOString(),'
);

fs.writeFileSync('src/app/admin/artikel/page.tsx', content);
