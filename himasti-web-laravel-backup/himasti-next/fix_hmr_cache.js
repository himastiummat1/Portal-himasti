const fs = require('fs');

// Read current KaryaClient.tsx
let clientCode = fs.readFileSync('src/app/admin/karya/KaryaClient.tsx', 'utf8');
// Rename it to KatalogKaryaClient to bust the HMR cache
clientCode = clientCode.replace('export default function KaryaClient()', 'export default function KatalogKaryaClient()');
fs.writeFileSync('src/app/admin/karya/KaryaClient.tsx', clientCode);

// Update page.tsx to import and render the renamed component
let pageCode = fs.readFileSync('src/app/admin/karya/page.tsx', 'utf8');
pageCode = pageCode.replace('import KaryaClient from "./KaryaClient";', 'import KatalogKaryaClient from "./KaryaClient";');
pageCode = pageCode.replace('<KaryaClient />', '<KatalogKaryaClient />');
fs.writeFileSync('src/app/admin/karya/page.tsx', pageCode);

