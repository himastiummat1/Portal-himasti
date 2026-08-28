import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AbsenClient from "./AbsenClient";

export const dynamic = "force-dynamic";

export default async function AbsenPage({ searchParams }: { searchParams: { m?: string, t?: string } }) {
  const session = await auth();
  
  // If not logged in, redirect to login with the callbackUrl to return here after login!
  if (!session) {
    const params = new URLSearchParams(searchParams as any).toString();
    redirect(`/login?callbackUrl=${encodeURIComponent(`/absen?${params}`)}`);
  }

  const meetingId = parseInt(searchParams.m || "0");
  const token = searchParams.t;

  if (!meetingId || !token) {
    return <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-900">
      Kode absen tidak lengkap atau tidak valid.
    </div>;
  }

  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) {
    return <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-900">
      Rapat tidak ditemukan.
    </div>;
  }
  
  // Check if already attended
  const userId = parseInt(session.user?.id || "0");
  const existing = await prisma.meetingAttendance.findUnique({
    where: { meeting_id_user_id: { meeting_id: meetingId, user_id: userId } }
  });

  return <AbsenClient 
    meeting={meeting} 
    token={token} 
    alreadyAttended={!!existing} 
    userName={session.user?.name || "Kader"} 
  />;
}
