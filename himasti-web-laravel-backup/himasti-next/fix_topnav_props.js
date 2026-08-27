const fs = require('fs');
let content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');

const searchProps = `roleStr: string 
}) {`;
const replaceProps = `roleStr: string,
  isImpersonating?: boolean
}) {`;

content = content.replace(searchProps, replaceProps);
fs.writeFileSync('src/components/layout/TopNav.tsx', content);
