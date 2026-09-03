import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ScannerWrapper from "./ScannerWrapper";

export const metadata = {
  title: "Live Scanner Absensi - HIMASTI",
};

export default async function ScannerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id);
  const userRoles = await prisma.modelHasRole.findMany({
    where: { model_id: userId },
    include: { role: true }
  });

  const isPanitiaOrExecutive = userRoles.some(r => 
    r.role.name === "super_admin" || 
    r.role.name.includes("ketua") || 
    r.role.name.includes("sekretaris") || 
    r.role.name.includes("kaderisasi") || 
    r.role.name.includes("pengkaderan") || 
    r.role.name.includes("kabid")
  );

  if (!isPanitiaOrExecutive) {
    redirect("/absen");
  }

  // Fetch active meetings (events happening today/now)
  const activeMeetings = await prisma.meeting.findMany({
    where: { is_active: true },
    orderBy: { event_date: 'asc' }
  });

  return <ScannerWrapper meetings={activeMeetings} />;
}
