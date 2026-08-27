import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Users, FileText, Database, Shield, BookOpen, 
  Megaphone, CreditCard, Activity, ArrowRight, GitPullRequest, Search, CheckCircle2
} from "lucide-react";

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

  const isSuperAdmin = userRoles.includes('super_admin');
  
  // Dashboard Metrics
  const totalKader = await prisma.user.count();
  const totalEvent = await prisma.event.count();
  const totalSurat = await prisma.surat.count();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header Section (Vercel Style) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Portal Dasbor</h1>
          <p className="text-sm text-gray-500 mt-1">Sistem Informasi HIMASTI v2.0 • Diotorisasi sebagai <span className="font-mono text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded border border-gray-200">{userRoles[0] ? userRoles[0].replace(/_/g, ' ') : 'KADER'}</span></p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Documentation</button>
          {isSuperAdmin && (
            <button className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">Pengaturan Sistem</button>
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
          <Link href={stat.link} key={i} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="text-gray-500">{stat.icon}</div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 tracking-tight">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Modules) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-500" /> Modul & Layanan Organisasi
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { title: "Master Data Kader", desc: "Kelola database mahasiswa, demografi, dan role akses", href: "/admin/kader", reqSuper: false },
                { title: "Administrasi Persuratan", desc: "Sistem penomoran surat otomatis & arsip digital", href: "/admin/surat", reqSuper: false },
                { title: "Manajemen Keuangan", desc: "Laporan kas, donasi, dan transparansi anggaran", href: "/admin/keuangan", reqSuper: false },
                { title: "Bank Modul IT", desc: "Akses materi perkuliahan dan kurikulum himpunan", href: "/admin/modul", reqSuper: false },
                { title: "Manajemen Hak Akses (RBAC)", desc: "Pengaturan permissions dan delegasi peran", href: "/admin/roles", reqSuper: true },
              ].map((mod, i) => {
                if (mod.reqSuper && !isSuperAdmin) return null;
                return (
                  <Link key={i} href={mod.href} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{mod.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{mod.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (User & Logs) */}
        <div className="space-y-6">
          
          {/* User ID Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Identitas Sistem</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 font-mono text-lg font-bold">
                {userName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">{userName}</div>
                <div className="text-xs text-gray-500 font-mono">{session?.user?.email}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-500">NIM</span>
                <span className="font-mono text-gray-900">{kaderData?.nim || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Angkatan</span>
                <span className="font-mono text-gray-900">{kaderData?.angkatan || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Aktif
                </span>
              </div>
            </div>
          </div>

          {/* Activity Log Placeholder */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
             <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-gray-500" /> Log Aktivitas
              </h2>
            </div>
            <div className="p-5 text-center">
              <p className="text-xs text-gray-500 font-mono">Belum ada log terekam hari ini.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
