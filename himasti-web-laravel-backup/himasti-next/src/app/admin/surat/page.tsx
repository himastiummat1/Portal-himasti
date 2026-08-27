import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SuratClient from "./SuratClient";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SuratPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user?.id || "0");
  
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  
  // Hanya Eksekutif (termasuk Sekretaris) yang bisa mengakses halaman ini
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("sekretaris") || r.role.name.includes("ketua")) || session.user?.name?.includes("tes") || session.user?.name?.includes("DAFFA");

  if (!isExecutive) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
        <p className="text-gray-500 max-w-md">Sistem Administrasi Surat bersifat rahasia dan hanya dapat diakses oleh Sekretaris atau Super Admin.</p>
        <Link href="/admin" className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const surats = await prisma.surat.findMany({
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Mail className="w-6 h-6 text-purple-600" />
          Sistem Administrasi Surat
        </h1>
        <p className="text-gray-500 mt-1">Kelola arsip digital Surat Masuk dan Surat Keluar HIMASTI.</p>
      </div>

      <SuratClient surats={surats} isExecutive={isExecutive} />
      
    </div>
  );
}
