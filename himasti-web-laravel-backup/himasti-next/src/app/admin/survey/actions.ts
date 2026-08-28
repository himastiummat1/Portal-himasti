"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

export async function addSurvey(formData: FormData) {
  await requireAuth();
  try {
    await prisma.survey.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        link: (formData.get("link") as string) || null,
        status: formData.get("status") as string,
      }
    });
    revalidatePath("/admin/survey");
    return { success: true };
  } catch (e: any) { 
    return { success: false, error: e.message || "Gagal menambah kuesioner" }; 
  }
}

export async function deleteSurvey(id: number) {
  await requireAuth();
  try {
    await prisma.survey.delete({ where: { id } });
    revalidatePath("/admin/survey");
    return { success: true };
  } catch (e: any) { 
    return { success: false, error: e.message || "Gagal menghapus kuesioner" }; 
  }
}
