"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addKeuangan(formData: FormData) {
  const tipe = formData.get("tipe") as string;
  const nominalStr = formData.get("jumlah") as string;
  const tanggalStr = formData.get("tanggal") as string;
  const keterangan = formData.get("keterangan") as string;
  
  if (!tipe || !nominalStr || !tanggalStr || !keterangan) {
    return { success: false, error: "Tipe, jumlah, tanggal, dan keterangan wajib diisi." };
  }

  const nominal = parseFloat(nominalStr);
  if (isNaN(nominal) || nominal <= 0) {
    return { success: false, error: "Jumlah harus berupa angka lebih dari 0." };
  }

  try {
    await prisma.keuangan.create({
      data: {
        tipe,
        nominal,
        tanggal: new Date(tanggalStr),
        keterangan,
      }
    });

    revalidatePath("/admin/keuangan");
    return { success: true };
  } catch (error) {
    console.error("Gagal menambah data keuangan:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan data." };
  }
}

export async function updateKeuangan(id: number, formData: FormData) {
  const tipe = formData.get("tipe") as string;
  const nominalStr = formData.get("jumlah") as string;
  const tanggalStr = formData.get("tanggal") as string;
  const keterangan = formData.get("keterangan") as string;
  
  if (!tipe || !nominalStr || !tanggalStr || !keterangan) {
    return { success: false, error: "Tipe, jumlah, tanggal, dan keterangan wajib diisi." };
  }

  const nominal = parseFloat(nominalStr);
  if (isNaN(nominal) || nominal <= 0) {
    return { success: false, error: "Jumlah harus berupa angka lebih dari 0." };
  }

  try {
    await prisma.keuangan.update({
      where: { id },
      data: {
        tipe,
        nominal,
        tanggal: new Date(tanggalStr),
        keterangan,
      }
    });

    revalidatePath("/admin/keuangan");
    return { success: true };
  } catch (error) {
    console.error("Gagal mengupdate data keuangan:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan perubahan." };
  }
}

export async function deleteKeuangan(id: number) {
  try {
    await prisma.keuangan.delete({ where: { id } });
    revalidatePath("/admin/keuangan");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus data keuangan:", error);
    return { success: false, error: "Terjadi kesalahan saat menghapus data." };
  }
}
