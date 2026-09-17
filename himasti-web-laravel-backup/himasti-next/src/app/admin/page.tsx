import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Users, FileText, Database, Shield, BookOpen, 
  Megaphone, CreditCard, Activity, ArrowRight, GitPullRequest, Search, CheckCircle2,
  Calendar, Info, Trophy, ExternalLink, Code, LayoutGrid, Cpu, Star, Palette, Zap,
  MessageSquareWarning, QrCode
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
  const isKetuaOrWakil = userRoles.some(r => r === 'ketua_himpunan' || r === 'wakil_ketua' || r === 'wakil_ketua_himpunan' || (r.includes('ketua') && !r.includes('bidang')));
  const isSekretaris = userRoles.some(r => r.includes('sekretaris'));
  const isBendahara = userRoles.some(r => r.includes('bendahara'));
  const canAccessKeuangan = isSuperAdmin || isBendahara || isKetuaOrWakil;
  const canAccessSurat = isSuperAdmin || isSekretaris || isKetuaOrWakil;
  
  // Dashboard Metrics
  const totalKader = await prisma.dataKader.count();
  const totalEvent = await prisma.event.count();
  const totalSurat = await prisma.surat.count();
  const totalPengaduan = await prisma.pengaduan.count();
  const pendingPengaduan = await prisma.pengaduan.count({
    where: { status: "menunggu" },
  });

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
  const isDarkCard = !!userThemeId && userThemeId !== "default" && ["dark_obsidian", "cyber_city", "emerald_matrix", "cosmic_violet"].includes(userThemeId);

  if (!isPengurus) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
        {/* Welcome & Identity Strip */}
        <div className={`rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all border ${getThemeClasses(userThemeId, isSuperAdmin)}`}>
          {isDarkCard && (
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-10" />
          )}
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <CosmeticAvatar 
                name={userName} 
                frameId={userFrame} 
                size="md" 
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className={`text-lg sm:text-xl font-bold truncate ${getNameClasses(userNameEffect, isSuperAdmin, userThemeId)}`}>
                    {userName}
                  </h2>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {userTitle.name}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full font-bold">
                    <Zap className="w-3 h-3 fill-violet-400 text-violet-400" />
                    {userXp} XP
                  </span>
                </div>
                <p className={`text-xs font-mono mt-1 ${isDarkCard ? 'text-slate-400' : 'text-slate-500'}`}>
                  NIM: <span className="font-semibold">{kaderData?.nim || "Belum Update"}</span> • Angkatan {kaderData?.angkatan || "2024"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link 
                href="/admin/profil" 
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-sm active:scale-95"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Ubah Gaya & Gelar</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Academic & Activity Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Academic Hub - 4 Prominent Cards */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Akses Layanan Akademik
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Fasilitas Mahasiswa TI</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Link 
                  href="/absen" 
                  className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Presensi Rapat & QR</h4>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">1-KLIK</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Scan QR proyektor, cek sesi rapat hari ini, atau konfirmasi kehadiran.</p>
                  </div>
                </Link>

                <Link 
                  href="/admin/modul" 
                  className="p-4 rounded-xl border border-slate-200/70 hover:border-blue-300 hover:bg-blue-50/30 transition-all group flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Bank Modul IT</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Materi kuliah, bank soal, dan modul praktikum laboratorium.</p>
                  </div>
                </Link>

                <Link 
                  href="/admin/karya" 
                  className="p-4 rounded-xl border border-slate-200/70 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform shrink-0">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Katalog Karya</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Showcase proyek inovasi, skripsi, dan riset mahasiswa HIMASTI.</p>
                  </div>
                </Link>

                <Link 
                  href="/admin/lomba" 
                  className="p-4 rounded-xl border border-slate-200/70 hover:border-amber-300 hover:bg-amber-50/30 transition-all group flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Info Lomba & Hackathon</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Peluang kompetisi nasional, hackathon global, dan hibah riset.</p>
                  </div>
                </Link>

                <Link 
                  href="/admin/mcp-hub" 
                  className="p-4 rounded-xl border border-violet-200/70 bg-violet-50/20 hover:border-violet-300 hover:bg-violet-50/50 transition-all group flex items-start gap-3.5 relative overflow-hidden"
                >
                  <div className="p-2.5 rounded-lg bg-violet-100 text-violet-700 group-hover:scale-105 transition-transform shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-violet-600 transition-colors">MCP & DevTools</h4>
                      <span className="px-1.5 py-0.5 rounded-full bg-violet-600 text-white text-[9px] font-mono font-bold">DEV</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Model Context Protocol, prompt engineering, dan utilitas coding.</p>
                  </div>
                </Link>

                <Link 
                  href="/pengaduan" 
                  className="p-4 rounded-xl border border-rose-200/70 bg-rose-50/20 hover:border-rose-300 hover:bg-rose-50/50 transition-all group flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700 group-hover:scale-105 transition-transform shrink-0">
                    <MessageSquareWarning className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">Kotak Aspirasi</h4>
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">ANONIM</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Sampaikan saran, keluhan lab, atau aspirasi prodi secara rahasia tanpa login.</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Radar Hackathon Global */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" /> Radar Hackathon & Kompetisi
                </h2>
                <Link href="/admin/lomba" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  Lihat Semua <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="p-5">
                {competitions.length === 0 ? (
                  <div className="py-6 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-400 mb-2" />
                    <p className="text-xs font-semibold text-slate-700">Belum ada info kompetisi</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Data hackathon dan lomba IT akan disinkronkan otomatis.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {competitions.map((c: any) => (
                      <div key={c.id} className="p-3.5 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 transition-all group">
                        <a href={c.link} target="_blank" className="flex justify-between items-start">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-1">{c.title}</h4>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-500 shrink-0 ml-2" />
                        </a>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Deadline: {c.deadline ? c.deadline.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Agenda Mendatang */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-700" /> Agenda Kegiatan Terdekat
                </h3>
              </div>
              {upcomingEvents.length === 0 ? (
                <div className="py-6 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Belum ada agenda terdaftar</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Jadwal rapat dan kegiatan terdekat akan ditampilkan di sini.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map(ev => (
                    <div key={ev.id} className="border-l-2 border-blue-500 pl-3.5 py-0.5">
                      <h4 className="text-sm font-semibold text-slate-800">{ev.nama_event}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{ev.tanggal_mulai.toLocaleDateString('id-ID')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (1/3 width: Digital KTA + Dewa Kode) */}
          <div className="space-y-6">
            
            {/* Digital KTA Widget */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-600" /> KTA Digital Anggota
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">3D Hologram</span>
              </div>
              <div className="w-full">
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
              <p className="text-[11px] text-center text-slate-400 mt-3 font-medium">Klik untuk memperbesar / sentuh efek hologram</p>
            </div>

            {/* Dewa Kode Leaderboard */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Dewa Kode HIMASTI</h3>
                  <p className="text-xs text-slate-500">Peringkat Kader Teraktif (XP)</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {dynamicLeaderboard.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {i === 0 ? p.icon : i + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-tight truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider truncate">{p.role}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <p className="text-xs font-bold text-slate-800">{p.score}</p>
                      <p className="text-[9px] text-slate-400">XP</p>
                    </div>
                  </div>
                ))}
              </div>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Kader", value: totalKader, icon: <Users className="w-4 h-4" />, link: "/admin/kader", badge: null },
          { label: "Surat & Dokumen", value: totalSurat, icon: <FileText className="w-4 h-4" />, link: "/admin/surat", badge: null },
          { label: "Agenda & Event", value: totalEvent, icon: <Activity className="w-4 h-4" />, link: "/admin/rapat", badge: null },
          { label: "Kotak Aspirasi", value: totalPengaduan, icon: <MessageSquareWarning className="w-4 h-4" />, link: "/admin/pengaduan", badge: pendingPengaduan > 0 ? `${pendingPengaduan} Menunggu` : null },
        ].map((stat, i) => (
          <Link href={stat.link} key={i} className="bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] border border-slate-200/60 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-500">{stat.icon}</div>
              {stat.badge ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-600 text-white animate-pulse">
                  {stat.badge}
                </span>
              ) : (
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
              )}
            </div>
            <div className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Modules) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Management Hub */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" /> Pusat Manajemen & Layanan Organisasi
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Panel Pengurus</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Link 
                href="/admin/kader" 
                className="p-4 rounded-xl border border-slate-200/70 hover:border-blue-300 hover:bg-blue-50/30 transition-all group flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Master Data Kader</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Kelola database mahasiswa, verifikasi anggota, dan ekspor Excel & CSV.</p>
                </div>
              </Link>

              {canAccessSurat && (
                <Link 
                  href="/admin/surat" 
                  className="p-4 rounded-xl border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Administrasi Persuratan</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Penomoran surat otomatis, arsip surat masuk/keluar & delegasi.</p>
                  </div>
                </Link>
              )}

              {canAccessKeuangan && (
                <Link 
                  href="/admin/keuangan" 
                  className="p-4 rounded-xl border border-slate-200/70 hover:border-amber-300 hover:bg-amber-50/30 transition-all group flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Manajemen Keuangan</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Buku kas transparan, donasi, laporan keuangan dan anggaran proker.</p>
                  </div>
                </Link>
              )}

              <Link 
                href="/admin/rapat" 
                className="p-4 rounded-xl border border-slate-200/70 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Rapat & Presensi Acara</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Jadwal pertemuan, notulensi digital, dan rekap kehadiran.</p>
                </div>
              </Link>

              <Link 
                href="/admin/scanner" 
                className="p-4 rounded-xl border border-slate-200/70 hover:border-purple-300 hover:bg-purple-50/30 transition-all group flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">Scanner KTA & QR Panitia</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Validasi presensi cepat untuk panitia acara dan seminar.</p>
                </div>
              </Link>

              <Link 
                href="/admin/artikel" 
                className="p-4 rounded-xl border border-slate-200/70 hover:border-cyan-300 hover:bg-cyan-50/30 transition-all group flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-lg bg-cyan-50 text-cyan-600 group-hover:scale-105 transition-transform shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">Artikel & Publikasi Web</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Kelola artikel publik, liputan kegiatan, dan dokumentasi proker.</p>
                </div>
              </Link>

              <Link 
                href="/admin/modul" 
                className="p-4 rounded-xl border border-slate-200/70 hover:border-blue-300 hover:bg-blue-50/30 transition-all group flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Bank Modul & Riset</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Kelola kurikulum terbuka dan materi praktikum mahasiswa.</p>
                </div>
              </Link>

              <Link 
                href="/admin/pengaduan" 
                className="p-4 rounded-xl border border-rose-200/70 bg-rose-50/15 hover:border-rose-300 hover:bg-rose-50/40 transition-all group flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700 group-hover:scale-105 transition-transform shrink-0">
                  <MessageSquareWarning className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">Kotak Aspirasi & Pengaduan</h4>
                    {pendingPengaduan > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold">
                        {pendingPengaduan} MENUNGGU
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Moderasi laporan whistleblowing mahasiswa, beri tindak lanjut resmi.</p>
                </div>
              </Link>

              {isSuperAdmin && (
                <Link 
                  href="/admin/roles" 
                  className="p-4 rounded-xl border border-rose-200/70 bg-rose-50/20 hover:border-rose-300 hover:bg-rose-50/50 transition-all group flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700 group-hover:scale-105 transition-transform shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">Manajemen Hak Akses (RBAC)</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Delegasi peran kepengurusan, audit logs, dan keamanan sistem.</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Konstitusi & Tata Kelola Ringkas */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">AD/ART & Konstitusi Organisasi</h4>
                <p className="text-xs text-slate-500 mt-0.5">Pedoman resmi tata kelola himpunan, aturan pengurus, dan hasil Mubes.</p>
              </div>
            </div>
            <Link 
              href="/admin/adart" 
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shrink-0 active:scale-95"
            >
              Buka Konstitusi
            </Link>
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
                <div className="py-6 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Belum ada agenda terdaftar</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Jadwal rapat atau event kepengurusan akan muncul di sini.</p>
                </div>
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
