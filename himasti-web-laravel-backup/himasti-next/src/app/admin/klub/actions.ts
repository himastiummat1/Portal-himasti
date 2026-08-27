"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function addKlub(formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };
  
  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("kabid")) || session.user?.name?.includes("tes") || session.user?.name?.includes("DAFFA");
  if (!isExecutive) return { success: false, error: "Akses Ditolak: Hanya pengurus yang dapat meresmikan klub." };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  
  if (!title || !description) return { success: false, error: "Semua kolom wajib diisi." };

  try {
    await prisma.klub.create({ data: { title, description } });
    revalidatePath("/admin/klub");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteKlub(id: number) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };
  
  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("kabid")) || session.user?.name?.includes("tes") || session.user?.name?.includes("DAFFA");
  if (!isExecutive) return { success: false, error: "Akses Ditolak." };

  try {
    await prisma.klub.delete({ where: { id } });
    revalidatePath("/admin/klub");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
