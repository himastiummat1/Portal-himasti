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

export async function saveCustomization(data: {
  frameId?: string;
  titleId?: string;
  themeId?: string;
  nameEffectId?: string;
}) {
  try {
    const userId = await requireAuth();

    const kader = await prisma.dataKader.findFirst({ where: { user_id: userId } });
    if (!kader) {
      return { success: false, error: "Profil kader tidak ditemukan." };
    }

    const currentXp = kader.xp || 50;

    // Server-side validation of XP unlock
    const { FRAMES, TITLES, THEMES, NAME_EFFECTS } = await import("@/lib/profileCustomization");
    
    if (data.frameId) {
      const item = FRAMES.find(f => f.id === data.frameId);
      if (item && currentXp < item.minXp) {
        return { success: false, error: `XP belum mencukupi untuk bingkai '${item.name}'.` };
      }
    }

    if (data.titleId) {
      const item = TITLES.find(t => t.id === data.titleId);
      if (item && currentXp < item.minXp) {
        return { success: false, error: `XP belum mencukupi untuk gelar '${item.name}'.` };
      }
    }

    if (data.themeId) {
      const item = THEMES.find(t => t.id === data.themeId);
      if (item && currentXp < item.minXp) {
        return { success: false, error: `XP belum mencukupi untuk tema '${item.name}'.` };
      }
    }

    if (data.nameEffectId) {
      const item = NAME_EFFECTS.find(n => n.id === data.nameEffectId);
      if (item && currentXp < item.minXp) {
        return { success: false, error: `XP belum mencukupi untuk efek '${item.name}'.` };
      }
    }

    await prisma.dataKader.update({
      where: { id: kader.id },
      data: {
        ...(data.frameId ? { custom_frame: data.frameId } : {}),
        ...(data.titleId ? { custom_title: data.titleId } : {}),
        ...(data.themeId ? { custom_theme: data.themeId } : {}),
        ...(data.nameEffectId ? { custom_name_effect: data.nameEffectId } : {})
      }
    });

    revalidatePath("/admin/profil");
    revalidatePath("/admin/kader");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Save customization error:", error);
    return { success: false, error: "Gagal menyimpan kustomisasi ke server." };
  }
}
