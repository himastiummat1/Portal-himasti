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

export async function buyCosmetic(
  itemId: string,
  category: "frame" | "title" | "theme" | "nameEffect"
) {
  try {
    const userId = await requireAuth();

    const kader = await prisma.dataKader.findFirst({
      where: { user_id: userId },
      include: { user: { include: { roles: { include: { role: true } } } } }
    });
    if (!kader) {
      return { success: false, error: "Profil kader tidak ditemukan." };
    }

    const isSuperAdmin = (kader.user?.roles || []).some(r => r?.role?.name === "super_admin");

    const { FRAMES, TITLES, THEMES, NAME_EFFECTS } = await import("@/lib/profileCustomization");
    const allCosmetics = [...FRAMES, ...TITLES, ...THEMES, ...NAME_EFFECTS];
    const item = allCosmetics.find(c => c.id === itemId);

    if (!item) {
      return { success: false, error: "Item kosmetik tidak ditemukan." };
    }

    let owned: string[] = [];
    try {
      owned = JSON.parse(kader.owned_cosmetics || "[]");
    } catch (e) {
      owned = [];
    }

    // Default free items
    const freeItems = ["none", "kader", "default", "plain"];
    if (item.minXp === 0 || freeItems.includes(item.id)) {
      if (!owned.includes(item.id)) owned.push(item.id);
      return { success: true, newXp: kader.xp ?? 50, ownedCosmetics: owned };
    }

    // If already owned
    if (owned.includes(item.id)) {
      return { success: true, newXp: kader.xp ?? 50, ownedCosmetics: owned, alreadyOwned: true };
    }

    const currentXp = kader.xp ?? 50;
    if (!isSuperAdmin && currentXp < item.minXp) {
      return {
        success: false,
        error: `XP Anda tidak mencukupi! Butuh ${item.minXp} XP, saat ini Anda memiliki ${currentXp} XP.`
      };
    }

    const price = isSuperAdmin ? 0 : item.minXp;
    const newXp = Math.max(0, currentXp - price);
    if (!owned.includes(item.id)) {
      owned.push(item.id);
    }

    // Deduct XP in database, save owned list, and auto-equip!
    await prisma.dataKader.update({
      where: { id: kader.id },
      data: {
        xp: newXp,
        owned_cosmetics: JSON.stringify(owned),
        ...(category === "frame" ? { custom_frame: item.id } : {}),
        ...(category === "title" ? { custom_title: item.id } : {}),
        ...(category === "theme" ? { custom_theme: item.id } : {}),
        ...(category === "nameEffect" ? { custom_name_effect: item.id } : {})
      }
    });

    revalidatePath("/admin/profil");
    revalidatePath("/admin/kader");
    revalidatePath("/admin");

    return {
      success: true,
      newXp,
      ownedCosmetics: owned,
      message: `Berhasil membeli dan memasang ${item.name} seharga ${price} XP!`
    };
  } catch (error: any) {
    console.error("Buy cosmetic error:", error);
    return { success: false, error: "Gagal memproses pembelian item." };
  }
}

export async function equipCosmetic(
  itemId: string,
  category: "frame" | "title" | "theme" | "nameEffect"
) {
  try {
    const userId = await requireAuth();

    const kader = await prisma.dataKader.findFirst({
      where: { user_id: userId },
      include: { user: { include: { roles: { include: { role: true } } } } }
    });
    if (!kader) {
      return { success: false, error: "Profil kader tidak ditemukan." };
    }

    const isSuperAdmin = (kader.user?.roles || []).some(r => r?.role?.name === "super_admin");

    let owned: string[] = [];
    try {
      owned = JSON.parse(kader.owned_cosmetics || "[]");
    } catch (e) {
      owned = [];
    }

    const freeItems = ["none", "kader", "default", "plain"];
    const isCurrentlyEquipped = (
      kader.custom_frame === itemId ||
      kader.custom_title === itemId ||
      kader.custom_theme === itemId ||
      kader.custom_name_effect === itemId
    );

    if (!isSuperAdmin && !freeItems.includes(itemId) && !isCurrentlyEquipped && !owned.includes(itemId)) {
      return { success: false, error: "Item belum dimiliki. Silakan beli terlebih dahulu." };
    }

    await prisma.dataKader.update({
      where: { id: kader.id },
      data: {
        ...(category === "frame" ? { custom_frame: itemId } : {}),
        ...(category === "title" ? { custom_title: itemId } : {}),
        ...(category === "theme" ? { custom_theme: itemId } : {}),
        ...(category === "nameEffect" ? { custom_name_effect: itemId } : {})
      }
    });

    revalidatePath("/admin/profil");
    revalidatePath("/admin/kader");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Equip cosmetic error:", error);
    return { success: false, error: "Gagal memasang item." };
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
