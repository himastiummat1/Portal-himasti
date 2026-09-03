import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import KatalogKaryaClient from "./KaryaClient";

export const metadata = {
  title: "Katalog Karya - HIMASTI",
};
export const dynamic = "force-dynamic";

export default async function KaryaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const projects = await prisma.studentProject.findMany({
    orderBy: { created_at: 'desc' }
  });

  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("kabid"));

  return <KatalogKaryaClient records={projects} isExecutive={isExecutive} userName={session.user.name || ""} />;
}
