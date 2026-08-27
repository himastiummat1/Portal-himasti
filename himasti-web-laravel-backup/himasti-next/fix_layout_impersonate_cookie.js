const fs = require('fs');
let content = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

const search = 'import { redirect } from "next/navigation";';
const replace = 'import { redirect } from "next/navigation";\nimport { cookies } from "next/headers";';
content = content.replace(search, replace);

const searchProps = `isImpersonating={(session.user as any).isImpersonating}`;
const replaceProps = `isImpersonating={!!(await cookies()).get("impersonated_user_id")}`;
content = content.replace(searchProps, replaceProps);

fs.writeFileSync('src/app/admin/layout.tsx', content);
