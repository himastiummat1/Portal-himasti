const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// I will completely replace the return statement to conditionally render Admin vs Kader views.
const newReturn = `
  const isPengurus = userRoles.some(r => r !== 'kader');

  if (!isPengurus) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Kader Header */}
        <div className="border-b border-slate-200/60 pb-6">
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Portal Anggota</h1>
          <p className="text-sm text-slate-500 mt-1">Selamat datang di Ekosistem Digital HIMASTI v2.0</p>
        </div>

        {/* Big Profile Card */}
        <div className="bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.05)] border border-sky-100/60 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-24 h-24 bg-sky-100 border-2 border-white shadow-sm rounded-full flex items-center justify-center text-sky-600 font-mono text-3xl font-bold shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{userName}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                  <span className="font-mono text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Kader Aktif
                  </span>
                  <span className="text-slate-400 text-xs font-mono">{session?.user?.email}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/50">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">NIM Mahasiswa</span>
                  <p className="font-mono text-slate-800 font-medium">{kaderData?.nim || "Belum Update"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tahun Angkatan</span>
                  <p className="font-mono text-slate-800 font-medium">{kaderData?.angkatan || "Belum Update"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kader Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-sky-500" /> Akses Akademik
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/modul" className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-sky-200 transition-colors group text-center">
                <Database className="w-6 h-6 text-slate-400 mx-auto mb-2 group-hover:text-sky-500 transition-colors" />
                <span className="text-xs font-semibold text-slate-700">Bank Modul</span>
              </Link>
              <button onClick={() => alert("Segera Hadir")} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-sky-200 transition-colors group text-center">
                <FileText className="w-6 h-6 text-slate-400 mx-auto mb-2 group-hover:text-sky-500 transition-colors" />
                <span className="text-xs font-semibold text-slate-700">Katalog Karya</span>
              </button>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-2xl p-6">
             <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-sky-500" /> Agenda Mendatang
            </h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono text-center py-4">Belum ada agenda terdaftar.</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(ev => (
                  <div key={ev.id} className="border-l-2 border-sky-400 pl-3">
                    <h4 className="text-sm font-semibold text-slate-800">{ev.nama_event}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{ev.tanggal_mulai.toLocaleDateString('id-ID')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }

  // PENGURUS / SUPER ADMIN VIEW
  return (
`;

content = content.replace(/  return \(\n    <div className="max-w-7xl/g, newReturn + '\n    <div className="max-w-7xl');

fs.writeFileSync('src/app/admin/page.tsx', content);
