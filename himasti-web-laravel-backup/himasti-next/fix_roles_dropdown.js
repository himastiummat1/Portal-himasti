const fs = require('fs');
let content = fs.readFileSync('src/app/admin/roles/RolesClient.tsx', 'utf8');

// Filter out 'super_admin' from the roles array mapped in the dropdown
content = content.replace(
  '{roles.map(role => (',
  '{roles.filter(r => r.name !== "super_admin").map(role => ('
);

// Prevent editing the role of a user who is already a super_admin
content = content.replace(
  '<select \n                        disabled={isPending}',
  '<select \n                        disabled={isPending || u.roles.some((r: any) => r.role.name === "super_admin")}'
);

fs.writeFileSync('src/app/admin/roles/RolesClient.tsx', content);
