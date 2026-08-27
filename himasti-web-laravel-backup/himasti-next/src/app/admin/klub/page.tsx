import { prisma } from "@/lib/prisma";
import KlubClient from "./KlubClient";
export const dynamic = "force-dynamic";

export default async function KlubPage() {
  const data = await prisma.klub.findMany({ orderBy: { created_at: 'desc' } });
  return <KlubClient records={data} />;
}
