const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

if (!content.includes('import TerminalEasterEgg')) {
  // Inject right after the lucide-react import
  content = content.replace(
    /import {[^}]+} from "lucide-react";/,
    `$&
import TerminalEasterEgg from "./TerminalEasterEgg";`
  );
}

// Fix the possibly null session issue
content = content.replace(
  'userName={session.user.name || "Kader"}',
  'userName={session?.user?.name || "Kader"}'
);

fs.writeFileSync('src/app/admin/page.tsx', content);
