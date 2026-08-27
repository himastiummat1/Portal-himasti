const fs = require('fs');
let content = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

const searchTopNavProps = `userStr={session.user.name || "User"} 
        roleStr={isSuperAdmin ? "Super Admin" : userRoles[0] || "Pengurus"} 
      />`;
const replaceTopNavProps = `userStr={session.user.name || "User"} 
        roleStr={isSuperAdmin ? "Super Admin" : userRoles[0] || "Pengurus"} 
        isImpersonating={(session.user as any).isImpersonating}
      />`;
content = content.replace(searchTopNavProps, replaceTopNavProps);

fs.writeFileSync('src/app/admin/layout.tsx', content);
