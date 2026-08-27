const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

if (!content.includes('import HackerMode')) {
  content = content.replace(
    'import TerminalEasterEgg from "./TerminalEasterEgg";',
    'import TerminalEasterEgg from "./TerminalEasterEgg";\nimport HackerMode from "./HackerMode";\nimport SystemTicker from "./SystemTicker";'
  );
}

// Inject before TerminalEasterEgg in both returns
content = content.split('<TerminalEasterEgg').join('<HackerMode />\n      <SystemTicker />\n      <TerminalEasterEgg');

fs.writeFileSync('src/app/admin/page.tsx', content);
