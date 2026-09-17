import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AbsenClient from "./AbsenClient";
import AbsenTabs from "./AbsenTabs";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface ActiveMeetingItem {
  id: number;
  title: string;
  description: string;
  type: string;
  location: string;
  event_date: string;
  is_active: boolean;
}

export default async function AbsenPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; t?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  // Jika belum login, redirect ke login dengan callbackUrl kembali ke sini
  if (!session?.user?.id) {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    const dest = qs ? `/absen?${qs}` : "/absen";
    redirect(`/login?callbackUrl=${encodeURIComponent(dest)}`);
  }

  const userId = parseInt(session.user.id);
  let meetingId = parseInt(params.m || "0");
  const token = params.t;

  // Jika ada token tapi meetingId belum disertakan (misal link cepat /absen?t=... atau copy token saja),
  // otomatis pasangkan dengan rapat yang sedang aktif saat ini
  if (!meetingId && token) {
    try {
      const latestActive = await prisma.meeting.findFirst({
        where: { is_active: true },
        orderBy: { event_date: "desc" },
      });
      if (latestActive) {
        meetingId = latestActive.id;
      }
    } catch (e) {
      console.warn("Could not find active meeting fallback:", e);
    }
  }

  // JIKA BUKAN DARI SCAN QR SPESIFIK: Tampilkan Hub Presensi Mahasiswa
  if (!meetingId || !token) {
    let activeMeetings: ActiveMeetingItem[] = [];
    const attendedMap: Record<number, string> = {};

    try {
      const meetings = await prisma.meeting.findMany({
        where: { is_active: true },
        orderBy: { event_date: "desc" },
        take: 5,
      });
      activeMeetings = meetings.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        type: m.type,
        location: m.location,
        event_date: m.event_date.toISOString(),
        is_active: Boolean(m.is_active),
      }));

      const attendances = await prisma.meetingAttendance.findMany({
        where: { user_id: userId },
        select: {
          meeting_id: true,
          waktu_hadir: true,
        },
      });

      attendances.forEach((a) => {
        attendedMap[a.meeting_id] = a.waktu_hadir.toISOString();
      });
    } catch (err) {
      console.error("Error loading meetings:", err);
    }

    const primaryMeeting = activeMeetings[0] || null;

    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 sm:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Portal
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sistem Presensi Resmi
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <Image 
              src="/images/logo_himasti.jpg" 
              alt="Logo HIMASTI" 
              width={48} 
              height={48} 
              className="w-12 h-12 object-contain rounded-2xl border border-slate-200 shadow-2xs shrink-0 bg-white" 
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Presensi Kegiatan & Pertemuan
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Scan QR Code di layar proyektor acara atau pilih pertemuan yang sedang aktif hari ini.
              </p>
            </div>
          </div>

          <AbsenTabs
            meetingId={primaryMeeting?.id || 1}
            meetingTitle={primaryMeeting?.title || "Rapat Koordinasi & Kegiatan HIMASTI"}
            currentUserId={userId}
            currentUserName={session.user.name || "Kader HIMASTI"}
            activeMeetings={activeMeetings}
            attendedMap={attendedMap}
          />
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
