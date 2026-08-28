import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Users, FileText, Database, Shield, BookOpen, 
  Megaphone, CreditCard, Activity, ArrowRight, GitPullRequest, Search, CheckCircle2,
  Calendar, Info, Trophy, ExternalLink, Code, LayoutGrid
} from "lucide-react";
import TerminalEasterEgg from "./TerminalEasterEgg";
import HackerMode from "./HackerMode";
import { katalogKarya } from "@/lib/karyaData";

export default async function AdminDashboard() {
  const session = await auth();
  const userName = session?.user?.name || "Kader";
  
  let userRoles: string[] = [];
  let kaderData = null;
  if (session?.user?.id) {
    const rolesData = await prisma.modelHasRole.findMany({
      where: { model_id: parseInt(session.user.id) },
      include: { role: true }
    });
    userRoles = rolesData.map(r => r.role.name);
    kaderData = await prisma.dataKader.findUnique({
      where: { user_id: parseInt(session.user.id) }
    });
  }

  const creatorCounts = katalogKarya.reduce((acc, curr) => {
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
    });

  const isSuperAdmin = userRoles.includes('super_admin');
  
  // Dashboard Metrics
  const totalKader = await prisma.user.count();
  const totalEvent = await prisma.event.count();
  const totalSurat = await prisma.surat.count();

  // Fetch real events
  const competitions = await prisma.competitionInfo.findMany({
    orderBy: { deadline: 'asc' },
    take: 4
  });

  const upcomingEvents = await prisma.event.findMany({
    orderBy: { tanggal_mulai: 'asc' },
    take: 3
  });


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
        <div className="bg-gray-50 from-white/90 to-slate-50/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.05)] border border-gray-100/60 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100/50 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-24 h-24 bg-gray-100 border-2 border-white shadow-sm rounded-full flex items-center justify-center text-gray-900 font-mono text-3xl font-bold shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{userName}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                  <span className="font-mono text-xs bg-gray-50 text-gray-900 px-2 py-0.5 rounded-full border border-gray-200 flex items-center gap-1 font-bold">
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
              <BookOpen className="w-4 h-4 text-gray-900" /> Akses Akademik
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/modul" className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-gray-200 transition-colors group text-center">
                <Database className="w-6 h-6 text-slate-400 mx-auto mb-2 group-hover:text-gray-900 transition-colors" />
                <span className="text-xs font-semibold text-slate-700">Bank Modul</span>
              </Link>
              <Link href="/admin/karya" className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-gray-200 transition-colors group text-center">
                <LayoutGrid className="w-6 h-6 text-slate-400 mx-auto mb-2 group-hover:text-gray-900 transition-colors" />
                <span className="text-xs font-semibold text-slate-700">Katalog Karya</span>
              </Link>
              <Link href="/admin/devtools" className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-gray-200 transition-colors group text-center">
                <Code className="w-6 h-6 text-slate-400 mx-auto mb-2 group-hover:text-gray-900 transition-colors" />
                <span className="text-xs font-semibold text-slate-700">Dev Tools</span>
              </Link>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-2xl p-6">
             <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-gray-900" /> Agenda Mendatang
            </h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono text-center py-4">Belum ada agenda terdaftar.</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(ev => (
                  <div key={ev.id} className="border-l-2 border-gray-300 pl-3">
                    <h4 className="text-sm font-semibold text-slate-800">{ev.nama_event}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{ev.tanggal_mulai.toLocaleDateString('id-ID')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-2xl overflow-hidden ">
             <div className="px-5 py-4 border-b border-slate-200/60 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Radar Hackathon Global
              </h2>
            </div>
            <div className="p-5">
              {competitions.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono text-center py-4">Belum ada info lomba ditarik.</p>
              ) : (
                <div className="space-y-4">
                  {competitions.map((c: any) => (
                    <div key={c.id} className="border-l-2 border-amber-400 pl-3 group">
                      <a href={c.link} target="_blank" className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-1">{c.title}</h4>
                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-amber-500 shrink-0 ml-2" />
                      </a>
                      <p className="text-xs text-slate-500 mt-0.5">{c.deadline ? c.deadline.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dewa Kode Leaderboard */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Dewa Kode HIMASTI</h3>
                <p className="text-sm text-slate-500">Kreator Teraktif (Katalog Karya)</p>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              {dynamicLeaderboard.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                      {i === 0 ? p.icon : i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{p.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{p.score}</p>
                    <p className="text-[10px] text-slate-500">Karya</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <HackerMode />
      <TerminalEasterEgg userName={session?.user?.name || "Kader"} />
      </div>
    );
  }

  // PENGURUS / SUPER ADMIN VIEW
  return (

    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header Section (Vercel Style) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Portal Dasbor</h1>
          <p className="text-sm text-slate-500 mt-1">Sistem Informasi HIMASTI v2.0 • Diotorisasi sebagai <span className="font-mono text-xs bg-slate-50/50 text-slate-800 px-1.5 py-0.5 rounded-2xl border border-slate-200/60">{userRoles[0] ? userRoles[0].replace(/_/g, ' ') : 'KADER'}</span></p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/kader" className="px-4 py-2 bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-xl text-sm font-medium hover:bg-slate-50/50 transition-colors">Lihat Kader</Link>
          {isSuperAdmin && (
            <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors">Pengaturan Sistem</button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Kader Terdaftar", value: totalKader, icon: <Users className="w-4 h-4" />, link: "/admin/kader" },
          { label: "Surat & Dokumen", value: totalSurat, icon: <FileText className="w-4 h-4" />, link: "/admin/surat" },
          { label: "Agenda & Event Aktif", value: totalEvent, icon: <Activity className="w-4 h-4" />, link: "/admin/rapat" },
        ].map((stat, i) => (
          <Link href={stat.link} key={i} className="bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-500">{stat.icon}</div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
            </div>
            <div className="text-3xl font-semibold text-slate-800 tracking-tight">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Modules) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200/60 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-500" /> Modul & Layanan Organisasi
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { title: "Master Data Kader", desc: "Kelola database mahasiswa, demografi, dan role akses", href: "/admin/kader", reqSuper: false },
                { title: "Administrasi Persuratan", desc: "Sistem penomoran surat otomatis & arsip digital", href: "/admin/surat", reqSuper: false },
                { title: "Manajemen Keuangan", desc: "Laporan kas, donasi, dan transparansi anggaran", href: "/admin/keuangan", reqSuper: false },
                { title: "Bank Modul IT", desc: "Akses materi perkuliahan dan kurikulum himpunan", href: "/admin/modul", reqSuper: false },
                { title: "Manajemen Hak Akses (RBAC)", desc: "Pengaturan permissions dan delegasi peran", href: "/admin/roles", reqSuper: true },
                { title: "Developer Tools", desc: "Utilitas ringan (JSON, Base64, Hash) untuk mempermudah coding", href: "/admin/devtools", reqSuper: false },
              ].map((mod, i) => {
                if (mod.reqSuper && !isSuperAdmin) return null;
                return (
                  <Link key={i} href={mod.href} className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors group">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 group-hover:text-gray-900 transition-colors">{mod.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{mod.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200/60 bg-slate-50/50">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" /> Informasi Organisasi
              </h2>
            </div>
            <div className="p-6 text-sm text-slate-600 space-y-4">
              <p>
                <strong>HIMASTI (Himpunan Mahasiswa Sistem dan Teknologi Informasi)</strong> didirikan pada tanggal <strong>21 April 2022</strong>. Inisiasi ini bermula karena angkatan pertama merasa dianaktirikan oleh fakultas, sehingga memicu 8 orang pencetus untuk membentuk wadah organisasi yang mandiri.
              </p>
              <div>
                <strong className="block mb-2 text-slate-800">8 Pendiri (Pencetus):</strong>
                <ul className="grid grid-cols-2 gap-2 list-disc list-inside text-slate-500">
                  <li>Arif Rahman</li><li>Samiul Ghozi</li>
                  <li>Husni Mubarok</li><li>Novianti</li>
                  <li>Luhur Budi</li><li>Fauzan</li>
                  <li>Alfian</li><li>Akrinul Hakim</li>
                </ul>
              </div>
              <p>
                Mubes Pertama diadakan di Ruang Teknik, dihadiri 6 dosen dan 36 mahasiswa. Dari tiga kandidat nama (HMSTI, HIMASI, HIMASTI), nama <strong>HIMASTI</strong> mendapat suara terbanyak dan diresmikan hingga saat ini.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column (User & Logs) */}
        <div className="space-y-6">
          
          {/* User ID Card */}
          <div className="bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Identitas Sistem</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-900 font-mono text-lg font-bold">
                {userName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">{userName}</div>
                <div className="text-xs text-slate-500 font-mono">{session?.user?.email}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-500">NIM</span>
                <span className="font-mono text-slate-800 font-medium">{kaderData?.nim || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Angkatan</span>
                <span className="font-mono text-slate-800 font-medium">{kaderData?.angkatan || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="flex items-center gap-1 text-gray-900 text-xs font-bold bg-gray-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Aktif
                </span>
              </div>
            </div>
          </div>

          {/* Dewa Kode Leaderboard */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Dewa Kode HIMASTI</h3>
                <p className="text-sm text-slate-500">Kreator Teraktif (Katalog Karya)</p>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              {dynamicLeaderboard.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                      {i === 0 ? p.icon : i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{p.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{p.score}</p>
                    <p className="text-[10px] text-slate-500">Karya</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log Placeholder */}
          <div className="bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-2xl overflow-hidden">
             <div className="px-5 py-4 border-b border-slate-200/60 bg-slate-50/50">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" /> Agenda Mendatang
              </h2>
            </div>
            <div className="p-5">
              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono text-center py-4">Belum ada agenda rapat atau event terdaftar.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map(ev => (
                    <div key={ev.id} className="border-l-2 border-gray-300 pl-3">
                      <h4 className="text-sm font-semibold text-slate-800">{ev.nama_event}</h4>
                      <p className="text-xs text-slate-500 mt-1">{ev.tanggal_mulai.toLocaleDateString('id-ID')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
      <HackerMode />
      <TerminalEasterEgg userName={session?.user?.name || "Kader"} />
    </div>
  );
}
