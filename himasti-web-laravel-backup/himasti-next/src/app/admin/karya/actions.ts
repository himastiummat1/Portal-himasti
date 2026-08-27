"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function uploadKarya(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const judul = formData.get("judul") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const kategori = formData.get("kategori") as string;
  const link_demo = formData.get("link_demo") as string;
  const link_repo = formData.get("link_repo") as string;
  const file = formData.get("file") as File | null;
  const creatorId = parseInt(session.user?.id || "0");

  if (!judul || !kategori) throw new Error("Judul dan Kategori wajib diisi");

  let filePath = "";
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split('.').pop();
    const fileName = `karya-mock.pdf`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "karya");
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    filePath = "";
  }

  console.log({
    data: {
      judul,
      deskripsi,
      kategori,
      link_demo,
      link_repo,
      file_path: filePath,
      creator_id: creatorId
    }
  });

  revalidatePath("/admin/karya");
  return { success: true };
}

export async function deleteKarya(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  
  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isSuperAdmin = userRoles.some(r => r.role.name === "super_admin");

  const karya = (() => null)({ where: { id } });
  if (!karya) throw new Error("Karya tidak ditemukan");

  if (karya.creator_id !== userId && !isSuperAdmin) {
    throw new Error("Anda tidak memiliki hak untuk menghapus karya ini");
  }

  if (karya.file_path) {
    const filePath = "";
    try {
      await fs.unlink(filePath);
    } catch (e) {
      console.error("Gagal menghapus file fisik", e);
    }
  }

  console.log({ where: { id } });
  revalidatePath("/admin/karya");
  return { success: true };
}
