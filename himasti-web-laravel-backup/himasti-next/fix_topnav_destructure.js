const fs = require('fs');
let content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');

const search = `export default function TopNav({ 
  groups, 
  userStr, 
  roleStr 
}:`;
const replace = `export default function TopNav({ 
  groups, 
  userStr, 
  roleStr,
  isImpersonating
}:`;

content = content.replace(search, replace);
fs.writeFileSync('src/components/layout/TopNav.tsx', content);
