const fs = require('fs');
let content = fs.readFileSync('src/app/admin/kader/actions.ts', 'utf8');

content = content.replace('import { cookies } from "next/headers";', '');
content = content.replace('import { auth } from "@/auth";', 'import { auth } from "@/auth";\nimport { cookies } from "next/headers";');

fs.writeFileSync('src/app/admin/kader/actions.ts', content);
