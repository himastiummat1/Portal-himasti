import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RapatClient from "./RapatClient";

export const dynamic = "force-dynamic";

export default async function RapatPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id);
  const userRoles = await prisma.modelHasRole.findMany({
    where: { model_id: userId },
    include: { role: true }
  });

  const isExecutive = userRoles.some(r => 
    r.role.name === "super_admin" || 
    r.role.name.includes("ketua") || 
    r.role.name.includes("sekretaris") || 
    r.role.name.includes("bendahara") || 
    r.role.name.includes("kabid")
  );

  if (!isExecutive) {
    redirect("/admin");
  }

  const data = await prisma.meeting.findMany({
    include: { creator: true },
    orderBy: { event_date: 'asc' }
  });

  const records = data.map(record => ({
    id: record.id,
    title: record.title,
    description: record.description,
    type: record.type,
    event_date: record.event_date.toISOString(),
    location: record.location,
    creator: record.creator?.name || "Admin",
    notulensi_path: record.notulensi_path,
    is_active: record.is_active ?? true
  }));

  return <RapatClient records={records} />;
}
