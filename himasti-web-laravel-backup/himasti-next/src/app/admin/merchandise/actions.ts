"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addMerch(formData: FormData) {
  try {
    await prisma.merchandise.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
      }
    });
    revalidatePath("/admin/merchandise");
    return { success: true };
  } catch (e) { return { success: false, error: "Gagal menambah produk" }; }
}

export async function deleteMerch(id: number) {
  try {
    await prisma.merchandise.delete({ where: { id } });
    revalidatePath("/admin/merchandise");
    return { success: true };
  } catch (e) { return { success: false, error: "Gagal menghapus produk" }; }
}
