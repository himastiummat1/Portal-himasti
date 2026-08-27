const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

// 1. Update the roadmap step
content = content.replace(
  '"3. Teori Kompilator: Lexer, Parser, AST"',
  '"3. Teori Kompilator & AST (Contoh: Vidyax)"'
);
content = content.replace(
  '"4. Code Generation: LLVM & GCC Internals"',
  '"4. Code Generation & Runtime (Studi: Vidyax)"'
);

// 2. Add a Cheat Sheet for Vidyax!
const newCheatSheet = `    {
      title: "Vidyax Lang: Hello World",
      lang: "vidyax",
      code: \`// Bahasa pemrograman karya anak HIMASTI (Nans)\n\nfunc main() {\n    print("Halo Dunia dari Compiler Vidyax!");\n}\`
    },`;

content = content.replace(
  'const cheatsheets = [',
  'const cheatsheets = [\n' + newCheatSheet
);

fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
