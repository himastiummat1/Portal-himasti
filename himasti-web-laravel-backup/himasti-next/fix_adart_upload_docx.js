const fs = require('fs');

// Fix actions.ts
let actionsContent = fs.readFileSync('src/app/admin/adart/actions.ts', 'utf8');
actionsContent = actionsContent.replace(
  'const fileName = "adart_official.pdf"; // Enforce PDF name',
  'const ext = file.name.split(".").pop()?.toLowerCase();\n    if (ext !== "pdf" && ext !== "docx") return { success: false, error: "Hanya file PDF atau DOCX yang diizinkan." };\n    const fileName = `adart_official.${ext}`;'
);
actionsContent = actionsContent.replace(
  'uploadedBy: session.user?.name',
  'uploadedBy: session.user?.name,\n      extension: ext'
);

// Delete old files before writing new one so we don't have both pdf and docx lingering
actionsContent = actionsContent.replace(
  'const fileName = `adart_official.${ext}`;',
  'const fileName = `adart_official.${ext}`;\n    try { await fs.unlink(path.join(uploadDir, "adart_official.pdf")); } catch(e){}\n    try { await fs.unlink(path.join(uploadDir, "adart_official.docx")); } catch(e){}'
);

fs.writeFileSync('src/app/admin/adart/actions.ts', actionsContent);

// Fix page.tsx
let pageContent = fs.readFileSync('src/app/admin/adart/page.tsx', 'utf8');
pageContent = pageContent.replace(
  'await fs.access(path.join(uploadDir, "adart_official.pdf"));',
  'const metaBuffer = await fs.readFile(path.join(uploadDir, "meta.json"), "utf8");\n    metadata = JSON.parse(metaBuffer);\n    await fs.access(path.join(uploadDir, `adart_official.${metadata.extension || "pdf"}`));'
);
pageContent = pageContent.replace(
  'hasFile = true;\n    const metaBuffer = await fs.readFile(path.join(uploadDir, "meta.json"), "utf8");\n    metadata = JSON.parse(metaBuffer);',
  'hasFile = true;'
);
fs.writeFileSync('src/app/admin/adart/page.tsx', pageContent);

