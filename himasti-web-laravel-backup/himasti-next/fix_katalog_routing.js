const fs = require('fs');

// 1. Read our beautiful new UI from /katalog
let newClient = fs.readFileSync('src/app/admin/katalog/KatalogClient.tsx', 'utf8');

// Rename the component
newClient = newClient.replace('export default function KatalogClient()', 'export default function KaryaClient()');

// Write it to /karya
fs.writeFileSync('src/app/admin/karya/KaryaClient.tsx', newClient);

// 2. Read the page.tsx from /katalog
let newPage = fs.readFileSync('src/app/admin/katalog/page.tsx', 'utf8');

// Change import and usage
newPage = newPage.replace('import KatalogClient from "./KatalogClient";', 'import KaryaClient from "./KaryaClient";');
newPage = newPage.replace('export default async function KatalogPage()', 'export default async function KaryaPage()');
newPage = newPage.replace('<KatalogClient />', '<KaryaClient />');

// Write it to /karya
fs.writeFileSync('src/app/admin/karya/page.tsx', newPage);

// 3. Fix the link in admin dashboard to point back to /admin/karya instead of /admin/katalog
let adminPage = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
adminPage = adminPage.replace('href="/admin/katalog"', 'href="/admin/karya"');
fs.writeFileSync('src/app/admin/page.tsx', adminPage);

