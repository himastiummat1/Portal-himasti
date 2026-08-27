import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import KaryaClient from "./KaryaClient";
import { Lightbulb, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function KaryaPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user?.id || "0");
  
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } */
  const isSuperAdmin = userRoles.some(r => r.role.name === "super_admin");

  const karyas: any[] = []; /*
    include: {
      user: {
        select: { name: true, email: true }
      }
    },
    orderBy: { created_at: 'desc' }
  */

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-purple-600" />
          Katalog Karya
        </h1>
        <p className="text-gray-500 mt-1">Pameran inovasi, aplikasi, dan hasil karya mahasiswa HIMASTI.</p>
      </div>

      <KaryaClient karyas={karyas} currentUserId={userId} isSuperAdmin={isSuperAdmin} />
      
    </div>
  );
}
