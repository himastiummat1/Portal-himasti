"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return parseInt(session.user.id);
}

export async function updateProfil(formData: FormData) {
  try {
    const userId = await requireAuth();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const no_hp = formData.get("no_hp") as string;
    const jenis_kelamin = formData.get("jenis_kelamin") as string;

    if (!name || !email) return { success: false, error: "Nama dan Email wajib diisi." };

    // Update user table
    await prisma.user.update({
      where: { id: userId },
      data: { name, email }
    });

    // Update data_kaders table
    await prisma.dataKader.updateMany({
      where: { user_id: userId },
      data: { no_hp, jenis_kelamin }
    });

    revalidatePath("/admin/profil");
    // Also revalidate nav if name changed
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { success: false, error: "Gagal menyimpan profil." };
  }
}

export async function changePassword(formData: FormData) {
  try {
    const userId = await requireAuth();
    
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "Semua kolom wajib diisi." };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Password baru dan konfirmasi tidak cocok." };
    }

    if (newPassword.length < 8) {
      return { success: false, error: "Password baru minimal 8 karakter." };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) return { success: false, error: "User tidak valid." };

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Password lama salah." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Change password error:", error);
    return { success: false, error: "Gagal mengubah password." };
  }
}
