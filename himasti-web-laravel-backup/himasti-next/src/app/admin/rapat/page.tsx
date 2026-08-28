import { prisma } from "@/lib/prisma";
import RapatClient from "./RapatClient";

export const dynamic = "force-dynamic";

export default async function RapatPage() {
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
