"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { cookies } from "next/headers";

async function isAuthorized() {
  const session = await auth();
  if (!session) return false;
  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  return userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("sekretaris") || r.role.name.includes("kaderisasi") || r.role.name.includes("pengkaderan"));
}

export async function updateKader(userId: number, formData: FormData) {
  if (!(await isAuthorized())) return { success: false, error: "Akses Ditolak." };

  const email = formData.get("email") as string;
  const no_hp = formData.get("no_hp") as string;
  const jenis_kelamin = formData.get("jenis_kelamin") as string;
  const role_name = formData.get("role_name") as string;

  try {
    // 1. Update Email in User table (Sync Login)
    if (email) {
      await prisma.user.update({ where: { id: userId }, data: { email } });
    }

    // 2. Update No HP in DataKader table
    if (no_hp) {
      const kader = await prisma.dataKader.findFirst({ where: { user_id: userId } });
      if (kader) {
        await prisma.dataKader.update({ where: { id: kader.id }, data: { no_hp, ...(jenis_kelamin && { jenis_kelamin }) } });
      }
    }

    // 3. Update Role (Prevent Privilege Escalation)
    if (role_name) {
      const session = await auth();
      const currentActorId = parseInt(session?.user?.id || "0");
      const actorRoles = await prisma.modelHasRole.findMany({ where: { model_id: currentActorId }, include: { role: true } });
      const isActorSuperAdmin = actorRoles.some(r => r.role.name === "super_admin");

      if (role_name === "super_admin" && !isActorSuperAdmin) {
        return { success: false, error: "Akses Ditolak: Hanya Super Admin yang dapat menunjuk akun Super Admin." };
      }

      const role = await prisma.role.findFirst({ where: { name: role_name } });
      if (role) {
        await prisma.modelHasRole.deleteMany({ where: { model_id: userId, model_type: "App\\Models\\User" } });
        await prisma.modelHasRole.create({ data: { role_id: role.id, model_id: userId, model_type: "App\\Models\\User" } });
      }
    }

    revalidatePath("/admin/kader");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menyimpan data" };
  }
}

export async function deleteKader(userId: number) {
  if (!(await isAuthorized())) return { success: false, error: "Akses Ditolak." };

  try {
    // Karena DB bawaan Laravel mungkin tidak memiliki FK Constraint CASCADE,
    // kita hapus secara manual dari tabel-tabel relasinya terlebih dahulu!
    await prisma.dataKader.deleteMany({ where: { user_id: userId } });
    await prisma.modelHasRole.deleteMany({ where: { model_id: userId, model_type: "App\\Models\\User" } });
    await prisma.surat.updateMany({ where: { user_id: userId }, data: { user_id: null } });
    await prisma.keuangan.updateMany({ where: { user_id: userId }, data: { user_id: null } });
    
    // Baru hapus User utamanya
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin/kader");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Gagal menghapus akun: " + err.message };
  }
}



export async function impersonateUser(targetUserId: number) {
  const session = await auth();
  if (!session) return { success: false, error: "Akses Ditolak." };
  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isSuperAdmin = userRoles.some(r => r.role.name === "super_admin");
  if (!isSuperAdmin) return { success: false, error: "Hanya Super Admin yang dapat menggunakan fitur Impersonasi." };
  
  const cookieStore = await cookies();
  cookieStore.set("impersonated_user_id", targetUserId.toString(), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 // 1 hour
  });
  
  return { success: true };
}

export async function stopImpersonating() {
  const cookieStore = await cookies();
  cookieStore.delete("impersonated_user_id");
  return { success: true };
}
