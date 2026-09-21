"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { canUserManageMeeting } from "@/lib/security";
import fsPromises from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * Menjadwalkan Rapat Baru
 * Menerima waktu mulai (event_date) dan batas waktu selesai otomatis (end_date)
 */
export async function addRapat(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const location = formData.get("location") as string;
  const eventDateStr = formData.get("event_date") as string;
  const endDateStr = formData.get("end_date") as string;
  
  if (!title || !eventDateStr || !location) {
    return { success: false, error: "Judul, Tanggal Mulai, dan Lokasi wajib diisi." };
  }

  const eventDate = new Date(eventDateStr);
  if (isNaN(eventDate.getTime())) {
    return { success: false, error: "Format tanggal mulai tidak valid." };
  }

  let endDate: Date | null = null;
  if (endDateStr) {
    endDate = new Date(endDateStr);
    if (isNaN(endDate.getTime())) {
      return { success: false, error: "Format batas waktu selesai tidak valid." };
    }
    if (endDate <= eventDate) {
      return { success: false, error: "Batas waktu selesai rapat harus lebih lambat dari waktu mulai." };
    }
  }

  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Akses ditolak: Silakan login terlebih dahulu." };
    const userId = parseInt(session.user.id);

    await prisma.meeting.create({
      data: {
        title,
        description: description || "",
        type: type || "rapat_pengurus",
        location,
        event_date: eventDate,
        end_date: endDate,
        created_by: userId,
        is_active: true
      }
    });

    revalidatePath("/admin/rapat");
    revalidatePath("/absen");
    return { success: true };
  } catch (error) {
    console.error("Gagal menambah rapat:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan jadwal rapat." };
  }
}

/**
 * Menghapus Rapat
 * PROTEKSI RBAC TINGKAT TINGGI:
 * - Hanya pembuat rapat (creator) atau Super Admin / Pimpinan Tertinggi (Ketua Umum, Wakil Ketua, Sekum)
 *   yang memiliki wewenang menghapus rapat.
 * - Ketua bidang lain atau kader biasa TIDAK BISA menghapus rapat milik pengurus lain.
 */
export async function deleteRapat(id: number) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Akses ditolak: Silakan login terlebih dahulu." };
  
  const currentUserId = parseInt(session.user.id);

  try {
    const meeting = await prisma.meeting.findUnique({ where: { id } });
    if (!meeting) return { success: false, error: "Rapat tidak ditemukan." };

    const userRolesData = await prisma.modelHasRole.findMany({
      where: { model_id: currentUserId },
      include: { role: true }
    });
    const roleNames = userRolesData.map((r) => r.role.name);

    if (!canUserManageMeeting(currentUserId, roleNames, meeting.created_by)) {
      return { 
        success: false, 
        error: "Akses ditolak: Anda tidak memiliki wewenang untuk menghapus rapat yang diselenggarakan oleh pengurus lain." 
      };
    }

    if (meeting.notulensi_path) {
      try { 
        await fsPromises.unlink(path.join(process.cwd(), "public", meeting.notulensi_path)); 
      } catch {}
    }

    await prisma.meeting.delete({ where: { id } });
    revalidatePath("/admin/rapat");
    revalidatePath("/absen");
    return { success: true };
  } catch (err) {
    console.error("Gagal menghapus rapat:", err);
    return { success: false, error: "Terjadi kesalahan sistem saat menghapus rapat." };
  }
}

/**
 * Upload Dokumen Notulensi Rapat
 * Proteksi kepemilikan rapat
 */
export async function uploadNotulensi(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Akses ditolak: Silakan login terlebih dahulu." };

  const currentUserId = parseInt(session.user.id);
  const meetingId = parseInt(formData.get("meetingId") as string);
  const file = formData.get("file") as File;

  if (!meetingId || !file || file.size === 0) {
    return { success: false, error: "Data file tidak valid." };
  }

  const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];
  const ext = file.name.split('.').pop()?.toLowerCase();
  
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return { success: false, error: "Hanya file PDF, DOC, atau DOCX yang diizinkan." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: "Ukuran file maksimal 10MB." };
  }

  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) return { success: false, error: "Rapat tidak ditemukan." };

  const userRolesData = await prisma.modelHasRole.findMany({
    where: { model_id: currentUserId },
    include: { role: true }
  });
  const roleNames = userRolesData.map((r) => r.role.name);

  if (!canUserManageMeeting(currentUserId, roleNames, meeting.created_by)) {
    return { 
      success: false, 
      error: "Akses ditolak: Anda tidak memiliki wewenang mengunggah notulensi untuk rapat pengurus lain." 
    };
  }

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
    return { success: false, error: "Gagal menyimpan file notulensi." };
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

/**
 * Manual Check-In oleh Penyelenggara
 * Proteksi RBAC: Hanya creator atau BPH Khusus / Super Admin
 */
export async function manualCheckIn(meetingId: number, userId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Akses ditolak: Silakan login terlebih dahulu." };

    const currentUserId = parseInt(session.user.id);
    const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
    if (!meeting) return { success: false, error: "Rapat tidak ditemukan." };

    const userRolesData = await prisma.modelHasRole.findMany({
      where: { model_id: currentUserId },
      include: { role: true }
    });
    const roleNames = userRolesData.map((r) => r.role.name);

    if (!canUserManageMeeting(currentUserId, roleNames, meeting.created_by)) {
      return { 
        success: false, 
        error: "Akses ditolak: Anda tidak memiliki hak mengelola kehadiran manual pada rapat pengurus lain." 
      };
    }

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

/**
 * Hapus Record Kehadiran
 * Proteksi RBAC: Hanya creator atau BPH Khusus / Super Admin
 */
export async function deleteAttendanceRecord(attendanceId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Akses ditolak: Silakan login terlebih dahulu." };

    const currentUserId = parseInt(session.user.id);
    const attendance = await prisma.meetingAttendance.findUnique({
      where: { id: attendanceId },
      include: { meeting: true }
    });

    if (!attendance) return { success: false, error: "Data kehadiran tidak ditemukan." };

    const userRolesData = await prisma.modelHasRole.findMany({
      where: { model_id: currentUserId },
      include: { role: true }
    });
    const roleNames = userRolesData.map((r) => r.role.name);

    if (!canUserManageMeeting(currentUserId, roleNames, attendance.meeting.created_by)) {
      return { 
        success: false, 
        error: "Akses ditolak: Anda tidak memiliki wewenang mengubah data presensi rapat pengurus lain." 
      };
    }

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
