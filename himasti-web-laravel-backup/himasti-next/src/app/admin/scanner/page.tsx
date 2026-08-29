import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ScannerWrapper from "./ScannerWrapper";

export const metadata = {
  title: "Live Scanner Absensi - HIMASTI",
};

export default async function ScannerPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch active meetings (events happening today/now)
  const activeMeetings = await prisma.meeting.findMany({
    where: { is_active: true },
    orderBy: { event_date: 'asc' }
  });

  return <ScannerWrapper meetings={activeMeetings} />;
}
