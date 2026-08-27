import { prisma } from "@/lib/prisma";
import ArtikelClient from "./ArtikelClient";

export const dynamic = "force-dynamic";

export default async function ArtikelPage() {
  const data = await prisma.artikel.findMany({
    orderBy: { created_at: 'desc' }
  });

  const records = data.map(record => ({
    id: record.id,
    title: record.title,
    description: record.description,
    link: record.link,
    status: record.status,
    created_at: record.created_at ? record.created_at.toISOString() : new Date().toISOString(),
  }));

  return <ArtikelClient records={records} />;
}
