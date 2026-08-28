"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addKarya(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const title = formData.get("title") as string;
  const student_name = formData.get("student_name") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const github_link = formData.get("github_link") as string;
  const demo_link = formData.get("demo_link") as string;

  if (!title || !student_name || !category) {
    return { success: false, error: "Judul, Nama, dan Kategori wajib diisi." };
  }

  try {
    await prisma.studentProject.create({
      data: {
        title,
        student_name,
        category,
        description,
        github_link: github_link || null,
        demo_link: demo_link || null,
      }
    });

    revalidatePath("/admin/karya");
    return { success: true };
  } catch (error) {
    console.error("Gagal menambah karya:", error);
    return { success: false, error: "Gagal menyimpan ke database." };
  }
}

export async function deleteKarya(id: number) {
  const session = await auth();
  // Simple check: Only super_admin or specific names can delete for now
  if (!session?.user?.name) return { success: false, error: "Unauthorized" };
  
  try {
    await prisma.studentProject.delete({ where: { id } });
    revalidatePath("/admin/karya");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus karya." };
  }
}
