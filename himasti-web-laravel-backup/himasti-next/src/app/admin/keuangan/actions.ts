"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function addKeuangan(formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };
  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("bendahara"));
  if (!isExecutive) return { success: false, error: "Akses Ditolak" };

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
    const record = await prisma.keuangan.create({
      data: {
        tipe,
        nominal,
        tanggal: new Date(tanggalStr),
        keterangan,
      }
    });

    const { logAuditEvent } = await import("@/lib/audit-log");
    await logAuditEvent({
      userId,
      userName: session.user?.name || "Bendahara",
      action: "CREATE_KEUANGAN",
      targetResource: `keuangan:${record.id}`,
      details: { tipe, nominal, keterangan, tanggal: tanggalStr },
      status: "success"
    });

    revalidatePath("/admin/keuangan");
    return { success: true };
  } catch (error) {
    console.error("Gagal menambah data keuangan:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan data." };
  }
}

export async function updateKeuangan(id: number, formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };
  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("bendahara"));
  if (!isExecutive) return { success: false, error: "Akses Ditolak" };

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

    const { logAuditEvent } = await import("@/lib/audit-log");
    await logAuditEvent({
      userId,
      userName: session.user?.name || "Bendahara",
      action: "UPDATE_KEUANGAN",
      targetResource: `keuangan:${id}`,
      details: { id, tipe, nominal, keterangan, tanggal: tanggalStr },
      status: "success"
    });

    revalidatePath("/admin/keuangan");
    return { success: true };
  } catch (error) {
    console.error("Gagal mengupdate data keuangan:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan perubahan." };
  }
}

export async function deleteKeuangan(id: number) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };
  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("bendahara"));
  if (!isExecutive) return { success: false, error: "Akses Ditolak" };

  try {
    await prisma.keuangan.delete({ where: { id } });

    const { logAuditEvent } = await import("@/lib/audit-log");
    await logAuditEvent({
      userId,
      userName: session.user?.name || "Bendahara",
      action: "DELETE_KEUANGAN",
      targetResource: `keuangan:${id}`,
      details: { deletedId: id },
      status: "success"
    });

    revalidatePath("/admin/keuangan");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus data keuangan:", error);
    return { success: false, error: "Terjadi kesalahan saat menghapus data." };
  }
}
