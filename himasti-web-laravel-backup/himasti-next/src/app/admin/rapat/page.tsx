import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RapatClient from "./RapatClient";
import { autoCloseExpiredMeetings } from "./telegram";
import { isSuperAdminRole, isKetuaOrWakilRole, isSekretarisRole } from "@/lib/security";

export const dynamic = "force-dynamic";

export default async function RapatPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id);
  const userRoles = await prisma.modelHasRole.findMany({
    where: { model_id: userId },
    include: { role: true }
  });

  const roleNames = userRoles.map(r => r.role.name);

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
    redirect("/admin");
  }

  // 1. Eksekusi pengecekan otomatis: tutup rapat yang kedaluwarsa & kirim rekap ke Telegram
  await autoCloseExpiredMeetings();

  // 2. Evaluasi hak akses supervisi pimpinan
  const isPrivilegedAdmin = isSuperAdminRole(roleNames) || isKetuaOrWakilRole(roleNames) || isSekretarisRole(roleNames);

  // 3. Ambil data rapat terurut dari yang terbaru
  const data = await prisma.meeting.findMany({
    include: { creator: true },
    orderBy: { event_date: 'desc' }
  });

  const records = data.map(record => ({
    id: record.id,
    title: record.title,
    description: record.description,
    type: record.type,
    event_date: record.event_date.toISOString(),
    end_date: record.end_date ? record.end_date.toISOString() : null,
    location: record.location,
    created_by: record.created_by,
    creator: record.creator?.name || "Admin",
    notulensi_path: record.notulensi_path,
    is_active: record.is_active ?? true
  }));

  return (
    <RapatClient 
      records={records} 
      currentUserId={userId}
      isPrivilegedAdmin={isPrivilegedAdmin}
      userRoles={roleNames}
    />
  );
}
