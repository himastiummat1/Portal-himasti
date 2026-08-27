import { prisma } from "@/lib/prisma";
import LombaClient from "./LombaClient";

export const dynamic = "force-dynamic";

export default async function LombaPage() {
  const data = await prisma.competitionInfo.findMany({
    orderBy: { created_at: 'desc' }
  });
  return <LombaClient records={data} />;
}
