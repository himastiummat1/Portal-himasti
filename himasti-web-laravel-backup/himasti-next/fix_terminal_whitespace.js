const fs = require('fs');
let content = fs.readFileSync('src/app/admin/TerminalEasterEgg.tsx', 'utf8');

// I need to add whitespace-pre-wrap to the history text output
content = content.replace(
  'className={line.type === "input" ? "text-slate-300" : "text-green-400"}',
  'className={line.type === "input" ? "text-slate-300" : "text-green-400 whitespace-pre-wrap font-mono"}'
);

fs.writeFileSync('src/app/admin/TerminalEasterEgg.tsx', content);
