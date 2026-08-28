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
      try { await fsPromises.unlink(path.join(process.cwd(), "public", meeting.notulensi_path)); } catch(e){}
    }
    await prisma.meeting.delete({ where: { id } });
    revalidatePath("/admin/rapat");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Terjadi kesalahan." };
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
      try { await fsPromises.unlink(path.join(process.cwd(), "public", meeting.notulensi_path)); } catch(e){}
    }

    await fsPromises.writeFile(path.join(uploadDir, fileName), buffer);
    const filePath = `/uploads/notulensi/${fileName}`;

    await prisma.meeting.update({
      where: { id: meetingId },
      data: { notulensi_path: filePath }
    });

    revalidatePath("/admin/rapat");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal upload notulensi:", error);
    return { success: false, error: "Gagal menyimpan file." };
  }
}

export async function getAttendance(meetingId: number) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const attendances = await prisma.meetingAttendance.findMany({
    where: { meeting_id: meetingId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { waktu_hadir: 'asc' }
  });

  return attendances.map(a => ({
    id: a.id,
    userName: a.user.name,
    userEmail: a.user.email,
    waktuHadir: a.waktu_hadir.toISOString(),
    status: a.status_kehadiran
  }));
}
