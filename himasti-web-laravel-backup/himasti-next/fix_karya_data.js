const fs = require('fs');
let content = fs.readFileSync('src/app/admin/karya/KaryaClient.tsx', 'utf8');

// Inject import
content = content.replace(
  'import { Search, ExternalLink',
  'import { katalogKarya } from "@/lib/karyaData";\nimport { Search, ExternalLink'
);

// Remove the local works array (from `const works = [` down to `];`)
const worksRegex = /const works = \[\s+{(.|\n)*?}\n  \];/;
content = content.replace(worksRegex, 'const works = katalogKarya;');

fs.writeFileSync('src/app/admin/karya/KaryaClient.tsx', content);
