"use server";
import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addRapat(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const location = formData.get("location") as string;
  const eventDate = formData.get("event_date") as string;
  
  if (!title || !eventDate || !location) {
    return { success: false, error: "Judul, Tanggal, dan Lokasi wajib diisi." };
  }

  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };
    const userId = parseInt(session.user.id);

    await prisma.meeting.create({
      data: {
        title,
        description: description || "",
        type,
        location,
        event_date: new Date(eventDate),
        created_by: userId
      }
    });

    revalidatePath("/admin/rapat");
    return { success: true };
  } catch (error) {
    console.error("Gagal menambah rapat:", error);
    return { success: false, error: "Terjadi kesalahan." };
  }
}

export async function deleteRapat(id: number) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  try {
    const meeting = await prisma.meeting.findUnique({ where: { id } });
    if (meeting?.notulensi_path) {
      try { await fsPromises.unlink(path.join(process.cwd(), "public", meeting.notulensi_path)); } catch {}
    }
    await prisma.meeting.delete({ where: { id } });
    revalidatePath("/admin/rapat");
    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kesalahan saat menghapus rapat." };
  }
}

import fsPromises from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function uploadNotulensi(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const meetingId = parseInt(formData.get("meetingId") as string);
  const file = formData.get("file") as File;

  if (!meetingId || !file || file.size === 0) {
    return { success: false, error: "Data tidak valid." };
  }

  const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];
  const ext = file.name.split('.').pop()?.toLowerCase();
  
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return { success: false, error: "Hanya file PDF, DOC, atau DOCX yang diizinkan." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: "Ukuran maksimal 10MB." };
  }

  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) return { success: false, error: "Rapat tidak ditemukan." };

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `notulensi-${crypto.randomBytes(8).toString('hex')}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "notulensi");
    await fsPromises.mkdir(uploadDir, { recursive: true });
    
    // Hapus file lama jika ada
    if (meeting.notulensi_path) {
      try { await fsPromises.unlink(path.join(process.cwd(), "public", meeting.notulensi_path)); } catch {}
    }

    await fsPromises.writeFile(path.join(uploadDir, fileName), buffer);
    const filePath = `/uploads/notulensi/${fileName}`;

    await prisma.meeting.update({
      where: { id: meetingId },
      data: { notulensi_path: filePath }
    });

    revalidatePath("/admin/rapat");
    return { success: true };
  } catch (error: unknown) {
    console.error("Gagal upload notulensi:", error);
    return { success: false, error: "Gagal menyimpan file." };
  }
}

export async function getAttendance(meetingId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const attendances = await prisma.meetingAttendance.findMany({
      where: { meeting_id: meetingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            data_kader: { select: { nim: true, angkatan: true } }
          }
        }
      },
      orderBy: { waktu_hadir: 'asc' }
    });

    return attendances.map(a => ({
      id: a.id,
      userName: a.user.name,
      userEmail: a.user.email,
      userNim: a.user.data_kader?.nim || "-",
      userAngkatan: a.user.data_kader?.angkatan || "-",
      waktuHadir: a.waktu_hadir.toISOString(),
      status: a.status_kehadiran,
      method: a.verification_method || "qr_code"
    }));
  } catch (err) {
    console.error("Error in getAttendance:", err);
    return [];
  }
}

export async function manualCheckIn(meetingId: number, userId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const existing = await prisma.meetingAttendance.findUnique({
      where: { meeting_id_user_id: { meeting_id: meetingId, user_id: userId } }
    });
    if (existing) {
      return { success: false, error: "Kader ini sudah tercatat hadir sebelumnya." };
    }

    await prisma.meetingAttendance.create({
      data: {
        meeting_id: meetingId,
        user_id: userId,
        status_kehadiran: "hadir",
        verification_method: "manual_panitia"
      }
    });

    revalidatePath("/admin/rapat");
    return { success: true };
  } catch (err: unknown) {
    console.error("Error in manualCheckIn:", err);
    return { success: false, error: "Gagal mencatat kehadiran manual." };
  }
}

export async function deleteAttendanceRecord(attendanceId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await prisma.meetingAttendance.delete({
      where: { id: attendanceId }
    });

    revalidatePath("/admin/rapat");
    return { success: true };
  } catch (err: unknown) {
    console.error("Error in deleteAttendanceRecord:", err);
    return { success: false, error: "Gagal menghapus data kehadiran." };
  }
}

export async function getKadersForAttendance() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        data_kader: {
          select: {
            nim: true,
            angkatan: true
          }
        }
      },
      orderBy: { name: "asc" }
    });

    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      nim: u.data_kader?.nim || "-",
      angkatan: u.data_kader?.angkatan || "-"
    }));
  } catch (err: unknown) {
    console.error("Error in getKadersForAttendance:", err);
    return [];
  }
}
