const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const badSyntax = `      </div>\n      <TerminalEasterEgg userName={session?.user?.name || "Kader"} />\n    </div>\n    );\n  }`;

const goodSyntax = `        <TerminalEasterEgg userName={session?.user?.name || "Kader"} />\n      </div>\n    );\n  }`;

content = content.replace(badSyntax, goodSyntax);

fs.writeFileSync('src/app/admin/page.tsx', content);
