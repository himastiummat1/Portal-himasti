import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Users, FileText, Database, Shield, BookOpen, 
  Megaphone, CreditCard, Activity, ArrowRight, GitPullRequest, Search, CheckCircle2,
  Calendar, Info, Trophy, ExternalLink, Code, LayoutGrid, Cpu, Star, Palette, Zap
} from "lucide-react";
import TerminalEasterEgg from "./TerminalEasterEgg";
import HackerMode from "./HackerMode";
import { katalogKarya } from "@/lib/karyaData";
import DigitalKTA from "./DigitalKTA";
import SuperAdminPeekModal from "./SuperAdminPeekModal";
import { CosmeticAvatar } from "@/components/profile/CosmeticAvatar";
import { TITLES, FRAMES, THEMES, getThemeClasses, getNameClasses } from "@/lib/profileCustomization";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  // Real-time calculation: Live Dewa Kode Leaderboard by XP from PostgreSQL
  let topCoders: any[] = [];
  try {
    topCoders = await prisma.dataKader.findMany({
      where: { deleted_at: null },
      orderBy: { xp: 'desc' },
      take: 5,
      include: { user: true }
    });
  } catch (e) {
    console.warn("Retrying topCoders query with fallback:", e);
    topCoders = await prisma.dataKader.findMany({
      where: { deleted_at: null },
      orderBy: { id: 'asc' },
      take: 5,
      include: { user: true }
    });
  }

  const { TITLES } = await import("@/lib/profileCustomization");

  const dynamicLeaderboard = topCoders.map((k, index) => {
    const titleObj = TITLES.find(t => t.id === k.custom_title) || TITLES[0];
    let icon = "✨";
    if (index === 0) icon = "👑";
    else if (index === 1) icon = "🔥";
    else if (index === 2) icon = "⚔️";
    else if (index === 3) icon = "⚡";

    return {
      name: k.user.name,
      role: titleObj.name,
      score: `${k.xp ?? 50}`,
      icon,
      frame: k.custom_frame || "none"
    };
  });

  const isSuperAdmin = userRoles.includes('super_admin');
  
  // Dashboard Metrics
  const totalKader = await prisma.dataKader.count();
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


  // Fetch Super Admin for the VIP Architect Peek Showcase
  const superAdminRole = await prisma.modelHasRole.findFirst({
    where: { role: { name: 'super_admin' } },
    include: {
      user: {
        include: { data_kader: true }
      }
    }
  });

  const superAdminData = {
    name: superAdminRole?.user?.name || "M N DAFFA (The Architect)",
    email: superAdminRole?.user?.email || "architect@himasti.ac.id",
    nim: superAdminRole?.user?.data_kader?.nim || "ARCHITECT-001",
    angkatan: superAdminRole?.user?.data_kader?.angkatan || "2022"
  };

  const isPengurus = userRoles.some(r => r !== 'kader');

  const userFrame = kaderData?.custom_frame || "none";
  const userTitleId = kaderData?.custom_title || "kader";
  const userThemeId = kaderData?.custom_theme || "default";
  const userNameEffect = kaderData?.custom_name_effect || "plain";
  const userXp = kaderData?.xp ?? 50;
  const userTitle = TITLES.find(t => t.id === userTitleId) || TITLES[0];
  const isDarkCard = userThemeId !== "default";

  if (!isPengurus) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Kader Header with Architect Peek Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Portal Anggota</h1>
            <p className="text-sm text-slate-500 mt-1">Selamat datang di Ekosistem Digital HIMASTI v2.0</p>
          </div>
          <SuperAdminPeekModal adminData={superAdminData} />
        </div>

        {/* Big Profile Card with Live Theme, Frame, Name Effect, and Title */}
        <div className={`rounded-3xl p-5 sm:p-8 relative overflow-hidden transition-all ${getThemeClasses(userThemeId, isSuperAdmin)}`}>
          {/* Static Subtle Background Accents */}
          {isDarkCard && (
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-10" />
          )}
          
          <div className="relative z-10 flex flex-col md:flex-row gap-5 sm:gap-8 items-center md:items-start">
            <CosmeticAvatar 
              name={userName} 
              frameId={userFrame} 
              size="lg" 
            />
            <div className="flex-1 text-center md:text-left space-y-4 w-full min-w-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className={`text-xl sm:text-3xl font-extrabold truncate ${getNameClasses(userNameEffect, isSuperAdmin, userThemeId)}`}>
                    {userName}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 font-mono text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {userTitle.name}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      <Zap className="w-3 h-3 fill-violet-400 text-violet-400" />
                      {userXp} XP
                    </span>
                    <span className={`text-xs font-mono truncate max-w-[200px] sm:max-w-none ${isDarkCard ? 'text-slate-400' : 'text-slate-500'}`}>{session?.user?.email}</span>
                  </div>
                </div>

                <Link 
                  href="/admin/profil" 
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 w-full sm:w-fit mx-auto md:mx-0 shrink-0"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Ubah Gaya & Gelar</span>
                </Link>
              </div>

              <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${isDarkCard ? 'border-white/10' : 'border-slate-200/60'}`}>
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${isDarkCard ? 'text-slate-400' : 'text-slate-500'}`}>NIM Mahasiswa</span>
                  <p className={`font-mono font-bold truncate ${isDarkCard ? 'text-white' : 'text-slate-900'}`}>{kaderData?.nim || "Belum Update"}</p>
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${isDarkCard ? 'text-slate-400' : 'text-slate-500'}`}>Tahun Angkatan</span>
                  <p className={`font-mono font-bold truncate ${isDarkCard ? 'text-white' : 'text-slate-900'}`}>{kaderData?.angkatan || "Belum Update"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Digital KTA (Moved to top for mobile visibility) */}
        <div className="mb-6">
          <div className="bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-3xl p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" /> Kartu Tanda Anggota Digital
            </h3>
            <div className="max-w-2xl mx-auto">
              <DigitalKTA 
                name={userName}
                nim={kaderData?.nim || "KADER-GUEST"}
                email={session?.user?.email || ""}
                angkatan={kaderData?.angkatan || new Date().getFullYear().toString()}
                frameId={userFrame}
                title={userTitle.name}
                nameEffectId={userNameEffect}
                themeId={userThemeId}
              />
            </div>
            <p className="text-xs text-center text-slate-500 mt-4 sm:mt-6 font-medium">Klik kartu untuk memperbesar. Sentuh / arahkan kursor untuk efek 3D hologram.</p>
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
              <Link href="/admin/mcp-hub" className="p-4 border border-violet-100 bg-violet-50/40 rounded-xl hover:bg-violet-50 hover:border-violet-300 transition-colors group text-center relative overflow-hidden">
                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-violet-600 text-white text-[8px] font-mono font-bold tracking-widest">2026</div>
                <Cpu className="w-6 h-6 text-violet-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">MCP & Prompts</span>
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
                <p className="text-sm text-slate-500">Peringkat Kader Teraktif (Arena Koding)</p>
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
                    <p className="text-[10px] text-slate-500">Poin XP</p>
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
        <div className="flex items-center gap-6">
          
          <div>
            <h1 className="text-3xl font-semibold text-slate-800 tracking-tight flex items-center gap-3">
              <span>Portal Dasbor</span>
              {isSuperAdmin && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 text-white shadow-sm animate-pulse">
                  👑 SYSTEM ARCHITECT
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Sistem Informasi HIMASTI v2.0 • Diotorisasi sebagai <span className="font-mono text-xs bg-slate-50/50 text-slate-800 px-1.5 py-0.5 rounded-2xl border border-slate-200/60">{userRoles[0] ? userRoles[0].replace(/_/g, ' ') : 'KADER'}</span></p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SuperAdminPeekModal adminData={superAdminData} />
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
                { title: "MCP & Prompt Engineering Hub", desc: "Katalog Model Context Protocol dan System Prompts untuk AI Agents", href: "/admin/mcp-hub", reqSuper: false },
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

          {/* Dewa Kode Leaderboard */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Dewa Kode HIMASTI</h3>
                <p className="text-sm text-slate-500">Peringkat Kader Teraktif (Arena Koding)</p>
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
                    <p className="text-[10px] text-slate-500">Poin XP</p>
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
