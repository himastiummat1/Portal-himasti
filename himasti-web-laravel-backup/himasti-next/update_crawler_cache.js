const fs = require('fs');
let content = fs.readFileSync('src/app/api/cron/crawl-lomba/route.ts', 'utf8');

// Import revalidatePath
content = content.replace(
  "import { NextResponse } from 'next/server';",
  "import { NextResponse } from 'next/server';\nimport { revalidatePath } from 'next/cache';"
);

// Add revalidatePath('/') before returning success
content = content.replace(
  "return NextResponse.json({ success: true",
  "revalidatePath('/');\n    return NextResponse.json({ success: true"
);

fs.writeFileSync('src/app/api/cron/crawl-lomba/route.ts', content);
