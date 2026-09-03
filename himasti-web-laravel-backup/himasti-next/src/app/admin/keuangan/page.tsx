import { prisma } from "@/lib/prisma";
import KeuanganClient from "./KeuanganClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function KeuanganPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  
  // Hanya Bendahara, Ketua, dan Super Admin yang bisa melihat dan mengelola keuangan
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("bendahara"));

  if (!isExecutive) {
    redirect("/admin");
  }

  const dataKeuangan = await prisma.keuangan.findMany({
    orderBy: {
      tanggal: 'desc'
    }
  });

  // Transform to plain objects for Client Component serialization
  const transformedRecords = dataKeuangan.map(record => ({
    id: record.id,
    tipe: record.tipe,
    // Convert Decimal to number
    jumlah: Number(record.nominal),
    // Convert Date to ISO string
    tanggal: record.tanggal.toISOString(),
    keterangan: record.keterangan
  }));

  return (
    <KeuanganClient records={transformedRecords} isExecutive={!!isExecutive} />
  );
}
