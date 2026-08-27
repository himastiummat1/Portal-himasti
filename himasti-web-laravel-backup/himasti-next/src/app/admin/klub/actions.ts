"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addKlub(formData: FormData) {
  try {
    await prisma.klub.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
      }
    });
    revalidatePath("/admin/klub");
    return { success: true };
  } catch (e) { return { success: false, error: "Gagal menambah klub" }; }
}

export async function deleteKlub(id: number) {
  try {
    await prisma.klub.delete({ where: { id } });
    revalidatePath("/admin/klub");
    return { success: true };
  } catch (e) { return { success: false, error: "Gagal menghapus klub" }; }
}
