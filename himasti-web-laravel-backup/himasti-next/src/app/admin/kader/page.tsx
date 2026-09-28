import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import KaderTableClient from "./KaderTableClient";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DataKaderPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  
  const isExecutive = userRoles.some(r => 
    r.role.name === "super_admin" || 
    r.role.name.includes("ketua") || 
    r.role.name.includes("sekretaris") || 
    r.role.name.includes("bendahara") || 
    r.role.name.includes("kabid") || 
    r.role.name.includes("anggota") || 
    r.role.name.includes("panitia")
  );

  if (!isExecutive) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
        <p className="text-gray-500 max-w-md">Data Master Kader bersifat rahasia dan hanya dapat diakses oleh Departemen Kaderisasi atau Eksekutif Himpunan.</p>
        <Link href="/admin" className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  // Fetch full data kader based on Users to ensure 100% sync with Hak Akses (RBAC)
  const rawData = await prisma.user.findMany({
    include: {
      data_kader: true,
      roles: { include: { role: true } }
    },
    orderBy: { created_at: 'desc' }
  });

  const isSuperAdmin = userRoles.some(r => r.role.name === "super_admin");

  const kaders = rawData.map(u => ({
    id: u.data_kader?.id || u.id,
    user_id: u.id,
    nama: u.name,
    email: u.email,
    nim: u.data_kader?.nim || "-",
    angkatan: u.data_kader?.angkatan || "-",
    no_hp: u.data_kader?.no_hp || "-",
    jenis_kelamin: u.data_kader?.jenis_kelamin || "-",
    role: u.roles[0]?.role.name || "kader",
    asal_sekolah: (u.data_kader as Record<string, unknown> | null)?.asal_sekolah as string | null | undefined,
    hobi: (u.data_kader as Record<string, unknown> | null)?.hobi as string | null | undefined,
    alamat: (u.data_kader as Record<string, unknown> | null)?.alamat_sekarang as string | null | undefined,
    xp: u.data_kader?.xp ?? 50,
    custom_frame: u.data_kader?.custom_frame || "none",
    custom_title: u.data_kader?.custom_title || "kader",
    custom_theme: u.data_kader?.custom_theme || "default",
    custom_name_effect: u.data_kader?.custom_name_effect || "plain"
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-gray-900" />
          Master Data Kader
        </h1>
        <p className="text-gray-500 mt-1">Pangkalan data utama seluruh anggota Himpunan Mahasiswa.</p>
      </div>

      <KaderTableClient kaders={kaders} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
