const fs = require('fs');

// Fix AdArtClient.tsx
let clientContent = fs.readFileSync('src/app/admin/adart/AdArtClient.tsx', 'utf8');
clientContent = clientContent.replace(
  'src={`/api/adart?t=${Date.now()}#toolbar=0`}',
  'src={`/api/adart?t=${metadata?.uploadedAt || "default"}#toolbar=0`}'
);
fs.writeFileSync('src/app/admin/adart/AdArtClient.tsx', clientContent);

// Fix route.ts (Remove Content-Disposition for inline, let browser decide automatically for PDFs)
let routeContent = fs.readFileSync('src/app/api/adart/route.ts', 'utf8');
routeContent = routeContent.replace(
  '"Content-Disposition": ext === "pdf" ? "inline; filename=AD-ART.pdf" : "attachment; filename=AD-ART.docx",',
  '...(ext === "docx" ? { "Content-Disposition": "attachment; filename=AD-ART.docx" } : {}),'
);
fs.writeFileSync('src/app/api/adart/route.ts', routeContent);

