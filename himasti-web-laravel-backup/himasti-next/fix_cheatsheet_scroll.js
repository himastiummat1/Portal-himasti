const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

// Replace whitespace-pre with whitespace-pre-wrap break-words
content = content.replace(
  /className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed whitespace-pre"/g,
  'className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap break-words"'
);

// I should also check if the Vidyax Dedicated Tab has the same issue.
content = content.replace(
  /className="p-5 text-sm font-mono text-slate-300 leading-loose overflow-x-auto"/g,
  'className="p-5 text-sm font-mono text-slate-300 leading-loose overflow-x-auto whitespace-pre-wrap break-words"'
);

fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
