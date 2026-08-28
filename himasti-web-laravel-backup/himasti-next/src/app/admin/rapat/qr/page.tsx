import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import QrClient from "./QrClient";

export const dynamic = "force-dynamic";

export default async function QrPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const params = await searchParams;
  const meetingId = parseInt(params.id || "0");
  if (!meetingId) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-lg">ID Rapat tidak valid.</div>;

  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-lg">Rapat tidak ditemukan.</div>;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

  return <QrClient meeting={{ id: meeting.id, title: meeting.title, latitude: meeting.latitude, longitude: meeting.longitude, radius_meter: meeting.radius_meter }} appUrl={appUrl} />;
}
