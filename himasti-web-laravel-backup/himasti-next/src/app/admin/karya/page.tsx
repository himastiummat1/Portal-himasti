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

  const isExecutive = session.user?.name?.includes("tes") || session.user?.name?.includes("DAFFA") || false;

  return <KatalogKaryaClient records={projects} isExecutive={isExecutive} userName={session.user.name || ""} />;
}
