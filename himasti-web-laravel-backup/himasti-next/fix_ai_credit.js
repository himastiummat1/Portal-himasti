const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

const oldDesc = 'Bahasa pemrograman <strong className="text-white">AI-first</strong> revolusioner ciptaan <strong className="text-rose-400">M N DAFFA</strong> (Kabid Riset & Pengembangan HIMASTI Periode 2025-2026). Dirancang dari nol dengan dukungan bawaan untuk orkestrasi <em>LLM</em>, <em>Swarm Multi-Agent</em>, dan <em>Native Tool Calling</em>.';

const newDesc = 'Sebuah proyek eksperimental <strong className="text-white">AI-first</strong> hasil rancangan <strong className="text-rose-400">M N DAFFA</strong> (Kabid Riset & Pengembangan HIMASTI 2025-2026) <strong>yang dibangun secara kolaboratif bersama Kecerdasan Buatan (AI)</strong>. Proyek ini mendemonstrasikan kekuatan kolaborasi manusia-mesin dalam menciptakan arsitektur bahasa pemrograman yang mendukung orkestrasi <em>LLM</em> dan <em>Swarm Multi-Agent</em> dari nol.';

content = content.replace(oldDesc, newDesc);

fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
