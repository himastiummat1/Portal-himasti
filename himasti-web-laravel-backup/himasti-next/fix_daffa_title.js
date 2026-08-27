const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

const oldText = 'ciptaan Daffa (Kader HIMASTI)';
const newText = 'ciptaan <strong className="text-rose-400">M N DAFFA</strong> (Kabid Riset & Pengembangan HIMASTI Periode 2025-2026)';

content = content.replace(oldText, newText);

fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
