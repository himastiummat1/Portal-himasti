const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

// 1. Make the roadmap card borders solid and clear (not transparent /60)
// Old: bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl ...
content = content.replace(
  /className="bg-white\/90 backdrop-blur-sm border border-slate-200\/60 rounded-3xl p-6 shadow-\[0_8px_30px_-4px_rgba\(14,165,233,0\.03\)\] hover:border-sky-200 hover:shadow-sky-100 transition-all flex flex-col group"/g,
  'className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-sky-300 hover:shadow-md transition-all flex flex-col group"'
);

// 2. Make the button at the bottom of the roadmap match the "Primary" or "Secondary" style we designed
// Old button was matched to the transparent /60 style, let's use the solid sky blue primary button style
content = content.replace(
  /<button className="mt-6 w-full py-3 bg-white\/90 backdrop-blur-sm border border-slate-200\/60 shadow-\[0_8px_30px_-4px_rgba\(14,165,233,0\.03\)\] hover:bg-slate-50 hover:border-sky-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2">/g,
  '<button className="mt-8 w-full py-3 bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50 rounded-xl text-sm font-semibold transition-all shadow-sm flex justify-center items-center gap-2">'
);

// Wait, the user said "button gaya yang suda kita rancang dari tadi" (the button style we designed earlier).
// In Admin Dashboard, we had:
// Secondary: className="px-4 py-2 bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-xl text-sm font-medium hover:bg-slate-50/50 transition-colors"
// Primary: className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium transition-colors"
// I will use the solid Sky primary button!
content = content.replace(
  /<button className="mt-8 w-full py-3 bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50 rounded-xl text-sm font-semibold transition-all shadow-sm flex justify-center items-center gap-2">/g,
  '<button className="mt-8 w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex justify-center items-center gap-2">'
);

// Let's also fix the course materials (Bank Materi) cards to have clearer borders
content = content.replace(
  /className="bg-white\/90 backdrop-blur-sm border border-slate-200\/60 rounded-2xl overflow-hidden shadow-\[0_8px_30px_-4px_rgba\(14,165,233,0\.03\)\]"/g,
  'className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"'
);

// Clearer background for step items (from bg-slate-50 to bg-white with clear border)
content = content.replace(
  /className="w-\[calc\(100%-2rem\)\] md:w-\[calc\(50%-1\.5rem\)\] bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-semibold text-slate-700"/g,
  'className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold text-slate-700"'
);

fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
