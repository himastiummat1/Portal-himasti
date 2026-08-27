const fs = require('fs');
let content = fs.readFileSync('src/app/api/adart/route.ts', 'utf8');

content = content.replace(
  '\\`adart_official.\\${ext}\\`',
  '`adart_official.${ext}`'
);

fs.writeFileSync('src/app/api/adart/route.ts', content);
