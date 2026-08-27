"use server";

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
    const user = await prisma.user.findFirst(); // Dummy login user
    if (!user) return { success: false, error: "Tidak ada user." };

    await prisma.meeting.create({
      data: {
        title,
        description: description || "",
        type,
        location,
        event_date: new Date(eventDate),
        created_by: user.id
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
  try {
    await prisma.meeting.delete({ where: { id } });
    revalidatePath("/admin/rapat");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Terjadi kesalahan." };
  }
}
