import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import KlubClient from "./KlubClient";
import { Users, ArrowLeft, Gamepad2, Code2, Shield, Cpu } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function KlubPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  
  // Hanya Pengurus Inti & Kabid R&D (Daffa/Tes) yang bisa mengubah data Klub
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("kabid")) || session.user?.name?.includes("tes") || session.user?.name?.includes("DAFFA");

  const data = await prisma.klub.findMany({ orderBy: { created_at: 'desc' } });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
          <Gamepad2 className="w-8 h-8 text-gray-900" />
          Klub IT & Minat Bakat
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Wadah eksplorasi, kolaborasi, dan pengembangan *skill* spesifik mahasiswa Teknik Informatika.</p>
      </div>

      <KlubClient records={data} isExecutive={!!isExecutive} />
    </div>
  );
}
