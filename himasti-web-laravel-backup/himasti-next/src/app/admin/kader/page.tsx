import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import KaderTableClient from "./KaderTableClient";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function DataKaderPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("kaderisasi") || r.role.name.includes("pengkaderan") || r.role.name.includes("sekretaris"));

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

  // Fetch full data kader
  const rawData = await prisma.dataKader.findMany({
    include: {
      user: {
        include: {
          roles: { include: { role: true } }
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  const kaders = rawData.map(k => ({
    id: k.id,
    user_id: k.user_id,
    nama: k.user.name,
    email: k.user.email,
    nim: k.nim,
    angkatan: k.angkatan || "-",
    no_hp: k.no_hp || "-",
    jenis_kelamin: k.jenis_kelamin || "-",
    role: k.user.roles[0]?.role.name || "kader",
    asal_sekolah: (k as any).asal_sekolah,
    hobi: (k as any).hobi,
    alamat: (k as any).alamat_sekarang
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

      <KaderTableClient kaders={kaders} />
    </div>
  );
}
