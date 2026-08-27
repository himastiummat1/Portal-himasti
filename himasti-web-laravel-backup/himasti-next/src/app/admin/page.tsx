import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Share2, PieChart, ShoppingBag, Users, FileText, UserPlus, Trash, GraduationCap, Layers, FileClock, TrendingUp , Sparkles, FolderOpen, UploadCloud, Megaphone} from "lucide-react";

const QUOTES = [
  "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.",
  "Masa depan adalah milik mereka yang menyiapkan hari ini.",
  "Ilmu tanpa amal bagaikan pohon tanpa buah.",
  "Jangan pernah menyerah. Hari ini sulit, besok akan lebih buruk, tapi lusa akan ada matahari bersinar.",
  "Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia."
];

export default async function DashboardKader() {
  const session = await auth();
  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "Admin";
  const userId = session?.user?.id ? parseInt(session.user.id) : 0;

  let userRoles: string[] = [];
  if (userId) {
    const rolesData = await prisma.modelHasRole.findMany({
      where: { model_id: userId },
      include: { role: true }
    });
    userRoles = rolesData.map(r => r.role.name);
  }

  const isSuperAdmin = userRoles.includes('super_admin');
  const isKetua = userRoles.includes('ketua_himpunan') || userRoles.includes('wakil_ketua_himpunan');
  const isExecutive = isSuperAdmin || isKetua || userRoles.some(r => r.includes('kabid') || r.includes('bendahara'));

  const kaderData = await prisma.dataKader.findFirst({
    where: { user: { email: userEmail } }
  });

  const status = kaderData?.status_kaderisasi || "Aktif";
  const nim = kaderData?.nim || "-";
  const angkatan = kaderData?.angkatan || "-";
  
  const joinDate = kaderData?.created_at 
    ? new Date(kaderData.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
    : "Aug 2026";

  const currentDate = new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  // Jika Executive, ambil metrik persis seperti di Laravel lama
  let stats = { totalUsers: 0, totalKader: 0, totalSurat: 0 };
  let roleStats: { roleName: string, count: number }[] = [];
  if (isExecutive) {
    stats.totalUsers = await prisma.user.count();
    stats.totalKader = await prisma.dataKader.count();
    stats.totalSurat = await prisma.surat.count();
    
    // Ambil jumlah kader di setiap divisi
    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      }
    });
    
    roleStats = roles.map(r => ({
      roleName: r.name,
      count: r._count.users
    })).filter(r => r.roleName.startsWith('kabid_'));
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-gray-800">
          {isExecutive ? "Dashboard Super Admin" : "Portal Informasi Kader"}
        </h1>
      </div>

      {isExecutive ? (
        /* SUPER ADMIN & EXECUTIVE DASHBOARD (Utilitarian) */
        <div className="space-y-6">
          
          {/* Executive Profile Header (Vercel Style) */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm relative overflow-hidden group">
            {/* Subtle Admin Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -mr-20 -mt-20"></div>

            <div className="flex items-center gap-5 relative z-10 w-full sm:w-auto">
              <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full border-2 border-gray-800 flex items-center justify-center text-white font-mono text-xl shadow-md">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-1 truncate">
                  {userName}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 font-mono">
                  <span className="flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 text-red-600 font-bold uppercase">
                    <Sparkles className="w-3 h-3" /> {userRoles[0] ? userRoles[0].replace(/_/g, ' ') : 'EXECUTIVE'}
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="truncate">{session?.user?.email}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 text-sm relative z-10">
              <div className="flex flex-col sm:items-end gap-0.5">
                <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Waktu Server</span>
                <span className="font-mono text-gray-700 text-xs sm:text-sm">{currentDate}</span>
              </div>
              <div className="flex flex-col sm:items-end gap-0.5">
                <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Akses Log</span>
                <span className="font-mono text-emerald-600 text-xs sm:text-sm font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block w-fit">GRANTED</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Kader</span>
                <GraduationCap className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-3xl font-mono font-bold text-gray-900">{stats.totalKader}</div>
              <div className="mt-2 text-xs text-gray-400 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-500"/> Tercatat di database</div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Pengurus</span>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-3xl font-mono font-bold text-gray-900">{stats.totalUsers}</div>
              <div className="mt-2 text-xs text-gray-400 flex items-center gap-1"><Layers className="w-3 h-3 text-emerald-500"/> Akun aktif di sistem</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Surat Terarsip</span>
                <FileText className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-3xl font-mono font-bold text-gray-900">{stats.totalSurat}</div>
              <div className="mt-2 text-xs text-gray-400 flex items-center gap-1"><FileClock className="w-3 h-3 text-emerald-500"/> Sistem administrasi</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Server Status</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <div className="text-3xl font-mono font-bold text-gray-900">100%</div>
              <div className="mt-2 text-xs text-gray-400">PostgreSQL beroperasi optimal</div>
            </div>
          </div>

          {/* Division Breakdown & IT Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Division Stats (Col 2) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">Status 8 Divisi (Kapasitas Anggota)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleStats.length > 0 ? roleStats.map((role, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-default">
                    <span className="text-sm font-medium text-gray-700 capitalize">{role.roleName.replace('kabid_', '').replace(/_/g, ' ')}</span>
                    <span className="bg-gray-100 text-gray-600 font-mono text-xs px-2 py-1 rounded-md border border-gray-200">
                      {role.count} Personel
                    </span>
                  </div>
                )) : (
                  <div className="col-span-full p-6 text-center border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-sm text-gray-500">Sistem belum mendeteksi pengurus divisi yang didaftarkan.</p>
                  </div>
                )}
              </div>
            </div>

            {/* IT System Menu */}
            {isSuperAdmin && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">Akses Cepat (IT System)</h3>
                <div className="flex flex-col gap-3">
                  <Link href="/admin/roles" className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors mr-4">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 group-hover:text-purple-700 transition-colors">Atur Role Pengurus</p>
                      <p className="text-xs text-gray-500">Naikkan jabatan & mutasi divisi</p>
                    </div>
                  </Link>

                  <Link href="/admin/trash" className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors mr-4">
                      <Trash className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 group-hover:text-red-700 transition-colors">Recycle Bin</p>
                      <p className="text-xs text-gray-500">Pulihkan data yang terhapus</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      ) : (
        /* KADER DASHBOARD (Utilitarian / Clean) */
        <div className="space-y-6">
          
          {/* Profile Header (Vercel/Github Style) */}
          <div className="relative bg-white rounded-xl border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 overflow-hidden group hover:shadow-lg transition-all duration-500">
            {/* Subtle Animated Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -mr-20 -mt-20"></div>
            
            <div className="flex items-center gap-5 relative z-10 w-full sm:w-auto">
              <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-purple-50 group-hover:to-indigo-50 rounded-full border border-gray-200 group-hover:border-purple-200 flex items-center justify-center text-gray-400 group-hover:text-purple-600 font-mono text-xl transition-colors duration-500 shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-1 truncate">
                  {userName}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 font-mono">
                  <span className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="truncate">{session?.user?.email}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full sm:w-auto gap-3 sm:gap-6 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 text-sm relative z-10">
              <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-1 p-2 sm:p-0 rounded-lg hover:bg-gray-50 sm:hover:bg-transparent transition-colors">
                <span className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest font-bold">NIM</span>
                <span className="font-mono font-medium text-gray-800 text-xs sm:text-sm break-all text-right sm:text-left">{nim}</span>
              </div>
              <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-1 p-2 sm:p-0 rounded-lg hover:bg-gray-50 sm:hover:bg-transparent transition-colors">
                <span className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest font-bold">Angkatan</span>
                <span className="font-mono font-medium text-gray-800 text-xs sm:text-sm">{angkatan}</span>
              </div>
              <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-1 p-2 sm:p-0 rounded-lg hover:bg-gray-50 sm:hover:bg-transparent transition-colors">
                <span className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest font-bold">Role</span>
                <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-[10px] sm:text-xs uppercase">{userRoles[0] ? userRoles[0].replace(/_/g, ' ') : 'KADER'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Quick Actions (Minimalist) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Bank Modul', href: '/admin/modul', icon: <FolderOpen className="w-4 h-4 mb-2" /> },
                  { name: 'Katalog Karya', href: '/admin/karya', icon: <UploadCloud className="w-4 h-4 mb-2" /> },
                  { name: 'Info Lomba', href: '/admin/lomba', icon: <Megaphone className="w-4 h-4 mb-2" /> },
                  { name: 'Merchandise', href: '/admin/merch', icon: <ShoppingBag className="w-4 h-4 mb-2" /> },
                ].map((item, i) => (
                  <Link key={i} href={item.href} className="flex flex-col items-start p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-700">
                    {item.icon}
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Feed: Kajian */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Kajian & Kegiatan
                  </h2>
                  <span className="text-xs font-mono text-gray-400">0 Upcoming</span>
                </div>
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-500">Belum ada jadwal kajian atau kegiatan dalam waktu dekat.</p>
                </div>
              </div>

            </div>

            {/* Sidebar Data */}
            <div className="space-y-6">
              
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <PieChart className="w-4 h-4" /> Polling Litbang
                  </h2>
                </div>
                <div className="p-5">
                  <div className="text-sm text-gray-500">Tidak ada polling aktif.</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Informasi Publik
                  </h2>
                </div>
                <div className="p-5">
                  <div className="text-sm text-gray-500">Data integrasi Instagram kosong.</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}