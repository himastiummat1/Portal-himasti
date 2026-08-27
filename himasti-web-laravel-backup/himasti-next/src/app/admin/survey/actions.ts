"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addSurvey(formData: FormData) {
  try {
    await prisma.survey.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        status: formData.get("status") as string,
      }
    });
    revalidatePath("/admin/survey");
    return { success: true };
  } catch (e) { return { success: false, error: "Gagal menambah survey" }; }
}

export async function deleteSurvey(id: number) {
  try {
    await prisma.survey.delete({ where: { id } });
    revalidatePath("/admin/survey");
    return { success: true };
  } catch (e) { return { success: false, error: "Gagal menghapus survey" }; }
}
