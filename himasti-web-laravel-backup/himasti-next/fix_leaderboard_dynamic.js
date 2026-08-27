const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Add import
if (!content.includes('import { katalogKarya }')) {
  content = content.replace(
    'import TerminalEasterEgg from "./TerminalEasterEgg";',
    'import TerminalEasterEgg from "./TerminalEasterEgg";\nimport { katalogKarya } from "@/lib/karyaData";'
  );
}

// 2. Add dynamic logic right before "const isSuperAdmin"
const dynamicLogic = `  const creatorCounts = katalogKarya.reduce((acc, curr) => {
    acc[curr.creator] = (acc[curr.creator] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dynamicLeaderboard = Object.entries(creatorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map((entry, index) => {
       const [name, count] = entry;
       let role = "Member";
       let icon = "✨";
       if (index === 0) { role = "The Architect"; icon = "👑"; }
       else if (index === 1) { role = "Code Ninja"; icon = "🔥"; }
       else if (index === 2) { role = "Bug Hunter"; icon = "⚔️"; }
       
       return { name, role, score: count.toString(), icon };
    });\n`;

content = content.replace(
  '  const isSuperAdmin = userRoles.includes(\'super_admin\');',
  dynamicLogic + '\n  const isSuperAdmin = userRoles.includes(\'super_admin\');'
);

// 3. Replace the static array in the JSX with `dynamicLeaderboard`
// We need to replace the static array in BOTH KaderView and AdminView!
const staticArrayStr = `[
                { name: "M N DAFFA", role: "The Architect", score: "1,240", icon: "👑" },
                { name: "Arif Rahman", role: "Code Ninja", score: "980", icon: "🔥" },
                { name: "Samiul Ghozi", role: "Bug Hunter", score: "750", icon: "⚔️" },
                { name: "Husni Mubarok", role: "Frontend Wizard", score: "620", icon: "✨" }
              ]`;
content = content.split(staticArrayStr).join('dynamicLeaderboard');

// 4. Update the subtitle from "Top Kontributor GitHub" to "Kreator Teraktif (Katalog)"
content = content.split('Top Kontributor GitHub (Bulan Ini)').join('Kreator Teraktif (Katalog Karya)');

// 5. Update the "Commits" label to "Karya"
content = content.split('<p className="text-[10px] text-slate-500">Commits</p>').join('<p className="text-[10px] text-slate-500">Karya</p>');

fs.writeFileSync('src/app/admin/page.tsx', content);
