"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createSurat(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const createdBy = parseInt(session.user.id);
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: createdBy }, include: { role: true } });
  const isAuthorized = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("sekretaris") || r.role.name.includes("ketua"));
  if (!isAuthorized) {
    throw new Error("Akses Ditolak: Hanya Sekretaris atau Pengurus Inti yang berhak menerbitkan surat.");
  }

  const nomor_surat = formData.get("nomor_surat") as string;
  const jenis_surat = formData.get("jenis_surat") as string;
  const perihal = formData.get("perihal") as string;
  const tanggal_surat = new Date(formData.get("tanggal_surat") as string);
  const entitas = formData.get("entitas") as string; // Pengirim/Tujuan
  const file_url = formData.get("file_url") as string; // Ganti file fisik menjadi Link GDrive

  if (!nomor_surat || !jenis_surat || !perihal || !tanggal_surat) {
    throw new Error("Semua kolom berlabel bintang wajib diisi");
  }

  await prisma.surat.create({
    data: {
      nomor_surat,
      jenis_surat,
      perihal,
      tanggal_surat,
      pengirim: jenis_surat === "Masuk" ? entitas : null,
      tujuan: jenis_surat === "Keluar" ? entitas : null,
      file_path: file_url || null,
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

  await prisma.surat.delete({ where: { id } });
  revalidatePath("/admin/surat");
  return { success: true };
}
