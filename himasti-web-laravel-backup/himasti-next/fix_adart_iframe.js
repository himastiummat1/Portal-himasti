const fs = require('fs');
let content = fs.readFileSync('src/app/admin/adart/AdArtClient.tsx', 'utf8');

content = content.replace(
  'href="/uploads/adart/adart_official.docx"',
  'href="/api/adart"'
);

content = content.replace(
  'src="/uploads/adart/adart_official.pdf#toolbar=0"',
  'src="/api/adart#toolbar=0"'
);

// We need to add a cache-busting timestamp to the iframe so it refreshes immediately after upload
content = content.replace(
  'src="/api/adart#toolbar=0"',
  'src={`/api/adart?t=${Date.now()}#toolbar=0`}'
);

fs.writeFileSync('src/app/admin/adart/AdArtClient.tsx', content);
