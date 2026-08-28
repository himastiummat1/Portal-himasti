import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import QrClient from "./QrClient";

export const dynamic = "force-dynamic";

export default async function QrPage({ searchParams }: { searchParams: { id?: string } }) {
  const session = await auth();
  if (!session) redirect("/login");

  const meetingId = parseInt(searchParams.id || "0");
  if (!meetingId) return <div className="p-8 text-white">ID Rapat tidak valid.</div>;

  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) return <div className="p-8 text-white">Rapat tidak ditemukan.</div>;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return <QrClient meeting={meeting} appUrl={appUrl} />;
}
