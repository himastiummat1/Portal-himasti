"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addArtikel(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const link = formData.get("link") as string;
  const status = formData.get("status") as string;
  
  if (!title || !description) return { success: false, error: "Judul dan konten wajib diisi." };

  try {
    await prisma.artikel.create({
      data: {
        title,
        description,
        link: link || null,
        status: status || "Draft"
      }
    });
    revalidatePath("/admin/artikel");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menyimpan artikel." };
  }
}

export async function deleteArtikel(id: number) {
  try {
    await prisma.artikel.delete({ where: { id } });
    revalidatePath("/admin/artikel");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus artikel." };
  }
}

export async function updateArtikelStatus(id: number, status: string) {
  try {
    await prisma.artikel.update({ where: { id }, data: { status } });
    revalidatePath("/admin/artikel");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal mengubah status." };
  }
}
