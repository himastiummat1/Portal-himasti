"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function getAuthorizedUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = parseInt(session.user.id);
  const rolesData = await prisma.modelHasRole.findMany({
    where: { model_id: userId },
    include: { role: true },
  });
  const roles = rolesData.map((r) => r.role.name);

  const isSuperAdmin = roles.includes("super_admin");
  const isPengurus = roles.some((r) => r !== "kader");

  if (!isPengurus && !isSuperAdmin) return null;

  return {
    userId,
    userName: session.user.name || "Pengurus HIMASTI",
    isSuperAdmin,
    roles,
  };
}

export async function updatePengaduanStatus(
  id: number,
  status: "menunggu" | "diproses" | "selesai",
  tanggapan: string
) {
  try {
    const user = await getAuthorizedUser();
    if (!user) {
      return { success: false, error: "Akses ditolak. Anda harus memiliki peran pengurus untuk merespons pengaduan." };
    }

    const cleanTanggapan = tanggapan?.trim() || null;

    const updated = await prisma.pengaduan.update({
      where: { id },
      data: {
        status,
        tanggapan: cleanTanggapan,
        responded_by: user.userName,
        responded_at: cleanTanggapan ? new Date() : undefined,
      },
    });

    // Write audit log
    try {
      await prisma.auditLog.create({
        data: {
          user_id: user.userId,
          user_name: user.userName,
          action: "RESPOND_PENGADUAN",
          target_resource: `pengaduan:${id}:${updated.tracking_code}`,
          details: `Status: ${status}, Tanggapan length: ${cleanTanggapan?.length || 0}`,
          status: "success",
        },
      });
    } catch (e) {
      console.warn("Could not record audit log:", e);
    }

    revalidatePath("/admin/pengaduan");
    revalidatePath("/pengaduan");

    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("Error updating pengaduan status:", error);
    return { success: false, error: "Gagal memperbarui status pengaduan." };
  }
}

export async function deletePengaduan(id: number) {
  try {
    const user = await getAuthorizedUser();
    if (!user) {
      return { success: false, error: "Akses ditolak." };
    }

    const pengaduan = await prisma.pengaduan.findUnique({
      where: { id },
      select: { tracking_code: true },
    });

    if (!pengaduan) {
      return { success: false, error: "Data pengaduan tidak ditemukan." };
    }

    await prisma.pengaduan.delete({
      where: { id },
    });

    // Write audit log
    try {
      await prisma.auditLog.create({
        data: {
          user_id: user.userId,
          user_name: user.userName,
          action: "DELETE_PENGADUAN",
          target_resource: `pengaduan:${id}:${pengaduan.tracking_code}`,
          details: `Pengaduan deleted by ${user.userName}`,
          status: "success",
        },
      });
    } catch (e) {
      console.warn("Could not record audit log:", e);
    }

    revalidatePath("/admin/pengaduan");
    revalidatePath("/pengaduan");

    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting pengaduan:", error);
    return { success: false, error: "Gagal menghapus pengaduan." };
  }
}
