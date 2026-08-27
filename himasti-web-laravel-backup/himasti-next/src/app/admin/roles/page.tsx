import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RolesClient from "./RolesClient";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function RolesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  
  const isSuperAdmin = userRoles.some(r => r.role.name === "super_admin");
  
  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
        <p className="text-gray-500 max-w-md">Hanya Super Admin yang memiliki hak akses untuk mengubah struktur organisasi dan memberikan jabatan kepada kader.</p>
        <Link href="/admin" className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    include: {
      roles: true,
      data_kader: true
    },
    orderBy: { created_at: 'desc' }
  });

  const roles = await prisma.role.findMany({
    orderBy: { id: 'asc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-purple-600" />
          Manajemen Role Pengurus
        </h1>
        <p className="text-gray-500 mt-1">Kelola hak akses dan penetapan jabatan untuk seluruh anggota HIMASTI.</p>
      </div>

      <RolesClient users={users} roles={roles} />
      
    </div>
  );
}
