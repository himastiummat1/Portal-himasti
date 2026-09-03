import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AbsenClient from "./AbsenClient";
import OfflineAttendanceScanner from "@/components/OfflineAttendanceScanner";
import PasskeyEnrollment from "@/components/PasskeyEnrollment";
import { ShieldCheck, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AbsenPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; t?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  // Jika belum login, redirect ke login dengan callbackUrl kembali ke sini
  if (!session?.user?.id) {
    const qs = new URLSearchParams(params as any).toString();
    const dest = qs ? `/absen?${qs}` : "/absen";
    redirect(`/login?callbackUrl=${encodeURIComponent(dest)}`);
  }

  const userId = parseInt(session.user.id);
  const meetingId = parseInt(params.m || "0");
  const token = params.t;

  // JIKA BUKAN DARI SCAN QR SPESIFIK: Tampilkan Hub Presensi Biometrik & Offline Aula
  if (!meetingId || !token) {
    let activeMeeting: { id: number; title: string } | null = null;
    try {
      const meetings = await prisma.meeting.findMany({
        where: { is_active: true },
        orderBy: { event_date: "desc" },
        take: 1,
      });
      if (meetings.length > 0) {
        activeMeeting = { id: meetings[0].id, title: meetings[0].title };
      }
    } catch (err) {
      console.error("Error loading meetings:", err);
    }

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 sm:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Portal
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Alpha Phase 1 (Anti-Joki & Zero Internet)
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Presensi Biometrik & Aula Offline
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sistem presensi anti-joki dengan chip fisik perangkat HP dan penyimpanan tangguh saat aula tanpa internet.
            </p>
          </div>

          <OfflineAttendanceScanner
            meetingId={activeMeeting?.id || 1}
            title={activeMeeting?.title || "Rapat Koordinasi & Kegiatan HIMASTI"}
            currentUserId={userId}
            currentUserName={session.user.name || "Kader HIMASTI"}
          />

          <PasskeyEnrollment />
        </div>
      </div>
    );
  }

  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-900">
        Rapat tidak ditemukan.
      </div>
    );
  }

  // Cek apakah sudah absen
  const existing = await prisma.meetingAttendance.findUnique({
    where: { meeting_id_user_id: { meeting_id: meetingId, user_id: userId } },
  });

  return (
    <AbsenClient
      meeting={{
        id: meeting.id,
        title: meeting.title,
        latitude: meeting.latitude,
        longitude: meeting.longitude,
        radius_meter: meeting.radius_meter,
      }}
      token={token}
      alreadyAttended={!!existing}
      userName={session.user.name || "Kader"}
    />
  );
}
