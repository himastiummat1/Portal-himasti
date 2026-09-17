import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PengaduanAdminClient from "./PengaduanAdminClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manajemen Kotak Aspirasi & Pengaduan | HIMASTI UMMAT",
  description: "Moderasi dan tindak lanjut laporan aspirasi mahasiswa TI UMMAT.",
};

export default async function PengaduanAdminPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = parseInt(session.user.id);
  const rolesData = await prisma.modelHasRole.findMany({
    where: { model_id: userId },
    include: { role: true },
  });
  const roles = rolesData.map((r) => r.role.name);

  const isSuperAdmin = roles.includes("super_admin");
  const isPengurus = roles.some((r) => r !== "kader");

  // Jika bukan pengurus / super admin, lempar kembali ke dashboard umum
  if (!isPengurus && !isSuperAdmin) {
    redirect("/admin");
  }

  const reports = await prisma.pengaduan.findMany({
    orderBy: { created_at: "desc" },
  });

  const serializedReports = reports.map((r) => ({
    id: r.id,
    tracking_code: r.tracking_code,
    kategori: r.kategori,
    judul: r.judul,
    isi: r.isi,
    status: r.status,
    tanggapan: r.tanggapan,
    responded_by: r.responded_by,
    responded_at: r.responded_at ? r.responded_at.toISOString() : null,
    created_at: r.created_at ? r.created_at.toISOString() : null,
  }));

  return <PengaduanAdminClient initialReports={serializedReports} />;
}
