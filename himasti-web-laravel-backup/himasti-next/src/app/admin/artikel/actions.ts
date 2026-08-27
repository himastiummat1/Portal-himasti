"use server";
import { auth } from "@/auth";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addArtikel(formData: FormData) {
  await requireAuth();
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
  await requireAuth();
  try {
    await prisma.artikel.delete({ where: { id } });
    revalidatePath("/admin/artikel");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus artikel." };
  }
}

export async function updateArtikelStatus(id: number, status: string) {
  await requireAuth();
  try {
    await prisma.artikel.update({ where: { id }, data: { status } });
    revalidatePath("/admin/artikel");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal mengubah status." };
  }
}
