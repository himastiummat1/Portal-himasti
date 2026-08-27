import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import KaryaClient from "./KaryaClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Katalog Karya | Ekosistem HIMASTI",
};

export default async function KaryaPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isSuperAdmin = userRoles.some(r => r.role.name === "super_admin");

  const karyas: any[] = []; // Disabled Prisma query to bypass missing table

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Katalog Karya Mahasiswa</h1>
        <p className="text-gray-500 mt-2">Etalase digital proyek, aplikasi, dan riset inovatif dari mahasiswa Sistem dan Teknologi Informasi.</p>
      </div>

      <KaryaClient karyas={karyas} currentUserId={userId} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
