"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function scanKtaAbsen(meetingId: number, nim: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const kader = await prisma.dataKader.findUnique({
      where: { nim },
      include: { user: true }
    });

    if (!kader) return { success: false, error: "Kader tidak ditemukan di database." };

    const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
    if (!meeting || !meeting.is_active) return { success: false, error: "Rapat tidak aktif atau tidak ditemukan." };

    // Check if already attended
    const existing = await prisma.attendance.findFirst({
      where: { meeting_id: meetingId, user_id: kader.user_id }
    });

    if (existing) {
      return { success: false, error: "Kader ini sudah melakukan absensi sebelumnya." };
    }

    await prisma.attendance.create({
      data: {
        meeting_id: meetingId,
        user_id: kader.user_id,
        status: "hadir",
        verified_by: session.user.name || "Admin Scanner"
      }
    });

    return { success: true, name: kader.user.name };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: "Kesalahan internal server." };
  }
}
