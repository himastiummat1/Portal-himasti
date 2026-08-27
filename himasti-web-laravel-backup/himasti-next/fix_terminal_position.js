const fs = require('fs');
let content = fs.readFileSync('src/app/admin/TerminalEasterEgg.tsx', 'utf8');

content = content.replace(
  'fixed bottom-6 right-6 p-4 bg-slate-900',
  'fixed bottom-6 left-6 p-4 bg-slate-900'
);

fs.writeFileSync('src/app/admin/TerminalEasterEgg.tsx', content);
