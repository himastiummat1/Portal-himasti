const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

// 1. Replace the massive blue gradient header with the standard utilitarian Sejuk header
const oldHeader = `<div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg shadow-sky-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">HIMASTI Learning Hub</h1>
          <p className="text-sky-100 text-lg leading-relaxed">
            Pusat pengetahuan dan kurikulum mandiri untuk mahasiswa Sistem dan Teknologi Informasi. Pelajari roadmap industri, unduh modul kuliah, dan akses ribuan snippet kode.
          </p>
        </div>
      </div>`;

const newHeader = `<div className="border-b border-slate-200/60 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Learning Hub</h1>
          <p className="text-sm text-slate-500 mt-1">Pusat kurikulum, modul perkuliahan, dan referensi kode HIMASTI.</p>
        </div>
      </div>`;

content = content.replace(oldHeader, newHeader);

// 2. Adjust the roadmap cards slightly to fit better with the Sejuk aesthetic 
// (they are already mostly Sejuk, but the dark button stands out too much)
content = content.replace(
  'bg-slate-900 hover:bg-sky-600 text-white',
  'bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] hover:bg-slate-50 hover:border-sky-200 text-slate-700'
);

// 3. Keep the Cheat Sheet dark mode (because it's code, code blocks are usually dark), but make it more utilitarian like Vercel.
// bg-slate-900 is fine, but maybe change border to border-slate-800. It's already there.

fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
