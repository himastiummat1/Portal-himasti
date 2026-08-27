"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

export async function createItModule(formData: FormData) {
  await requireAuth();
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const code_snippet = formData.get("code_snippet") as string;

  if (!title || !category || !code_snippet) {
    throw new Error("Judul, Kategori, dan Code Snippet wajib diisi");
  }

  await prisma.itModule.create({
    data: { title, category, description, code_snippet }
  });

  revalidatePath("/admin/modul");
  return { success: true };
}

export async function deleteItModule(id: number) {
  await requireAuth();
  await prisma.itModule.delete({ where: { id } });
  revalidatePath("/admin/modul");
  return { success: true };
}
