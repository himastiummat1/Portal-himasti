const fs = require('fs');

// 1. Remove SystemTicker from page.tsx
let page = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
page = page.replace('import SystemTicker from "./SystemTicker";\n', '');
page = page.split('<SystemTicker />\n      ').join('');
fs.writeFileSync('src/app/admin/page.tsx', page);

// 2. Tidy up Terminal placement (bottom-24 right-6)
let terminal = fs.readFileSync('src/app/admin/TerminalEasterEgg.tsx', 'utf8');
terminal = terminal.replace('fixed bottom-6 left-6', 'fixed bottom-24 right-6');
fs.writeFileSync('src/app/admin/TerminalEasterEgg.tsx', terminal);

// 3. Tidy up HackerMode placement (bottom-44 right-6) and add Konami clue
let hackerMode = fs.readFileSync('src/app/admin/HackerMode.tsx', 'utf8');
hackerMode = hackerMode.replace('fixed top-24 right-6 z-50', 'fixed bottom-[10.5rem] right-6 z-50 flex flex-col items-end gap-1 group/konami');

// Add clue under the Dev Mode toggle
const oldToggle = `          <span className="text-xs font-mono font-bold text-slate-300">
            {isActive ? '> DEV MODE' : 'DEV MODE'}
          </span>
        </label>`;
const newToggle = `          <span className="text-xs font-mono font-bold text-slate-300">
            {isActive ? '> DEV MODE' : 'DEV MODE'}
          </span>
        </label>
        <div className="text-[9px] font-mono text-slate-400/50 group-hover/konami:text-slate-400 transition-colors bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/50 opacity-0 group-hover/konami:opacity-100 cursor-help" title="Konami Code">
          Hint: ⬆ ⬆ ⬇ ⬇ ⬅ ➡ ⬅ ➡ B A
        </div>`;
hackerMode = hackerMode.replace(oldToggle, newToggle);
fs.writeFileSync('src/app/admin/HackerMode.tsx', hackerMode);

