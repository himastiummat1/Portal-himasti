"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function createSurat(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const nomor_surat = formData.get("nomor_surat") as string;
  const jenis_surat = formData.get("jenis_surat") as string;
  const perihal = formData.get("perihal") as string;
  const tanggal_surat = new Date(formData.get("tanggal_surat") as string);
  const entitas = formData.get("entitas") as string; // Pengirim/Tujuan
  const file = formData.get("file") as File | null;
  const createdBy = parseInt(session.user?.id || "0");

  if (!nomor_surat || !jenis_surat || !perihal || !tanggal_surat) {
    throw new Error("Semua kolom berlabel bintang wajib diisi");
  }

  let filePath = null;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split('.').pop();
    const fileName = `surat-\${crypto.randomBytes(8).toString('hex')}.\${fileExt}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "surat");
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    filePath = `/uploads/surat/\${fileName}`;
  }

  await prisma.surat.create({
    data: {
      nomor_surat,
      jenis_surat,
      perihal,
      tanggal_surat,
      pengirim: jenis_surat === "Masuk" ? entitas : null,
      tujuan: jenis_surat === "Keluar" ? entitas : null,
      file_path: filePath,
      user_id: createdBy
    }
  });

  revalidatePath("/admin/surat");
  return { success: true };
}

export async function deleteSurat(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  
  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isSuperAdmin = userRoles.some(r => r.role.name === "super_admin");
  const isSekretaris = userRoles.some(r => r.role.name.includes("sekretaris"));

  if (!isSuperAdmin && !isSekretaris) {
    throw new Error("Hanya Super Admin dan Sekretaris yang dapat menghapus surat");
  }

  const surat = await prisma.surat.findUnique({ where: { id } });
  if (!surat) throw new Error("Surat tidak ditemukan");

  if (surat.file_path) {
    const filePath = path.join(process.cwd(), "public", surat.file_path);
    try {
      await fs.unlink(filePath);
    } catch (e) {
      console.error("Gagal menghapus file fisik surat", e);
    }
  }

  await prisma.surat.delete({ where: { id } });
  revalidatePath("/admin/surat");
  return { success: true };
}
