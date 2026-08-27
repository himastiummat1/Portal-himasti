import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ModulClient from "./ModulClient";
import { Code, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ModulPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user?.id || "0");
  
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isSuperAdmin = userRoles.some(r => r.role.name === "super_admin");

  const moduls = await prisma.itModule.findMany({
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Code className="w-6 h-6 text-purple-600" />
          Bank Modul & Snippet
        </h1>
        <p className="text-gray-500 mt-1">Akses dan bagikan potongan kode pemrograman (Code Snippet) untuk seluruh kader HIMASTI.</p>
      </div>

      <ModulClient moduls={moduls} isSuperAdmin={isSuperAdmin} />
      
    </div>
  );
}
