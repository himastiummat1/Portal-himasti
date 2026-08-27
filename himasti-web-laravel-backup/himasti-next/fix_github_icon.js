const fs = require('fs');
let content = fs.readFileSync('src/app/admin/katalog/KatalogClient.tsx', 'utf8');

content = content.replace('Github', 'GitBranch');
content = content.replace('<Github', '<GitBranch');

fs.writeFileSync('src/app/admin/katalog/KatalogClient.tsx', content);
