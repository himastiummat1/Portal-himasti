const fs = require('fs');
let content = fs.readFileSync('src/app/admin/roles/page.tsx', 'utf8');

// Add force-dynamic to prevent caching
if (!content.includes('force-dynamic')) {
  content = content.replace(
    'export default async function RolesPage() {',
    'export const dynamic = "force-dynamic";\n\nexport default async function RolesPage() {'
  );
  fs.writeFileSync('src/app/admin/roles/page.tsx', content);
}
