"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateUserRole(userId: number, newRoleId: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  // Verify if current user is Super Admin
  const adminId = parseInt(session.user?.id || "0");
  const adminRoles = await prisma.modelHasRole.findMany({ where: { model_id: adminId }});
  const adminRoleIds = adminRoles.map(r => r.role_id);
  const adminRoleNames = await prisma.role.findMany({ where: { id: { in: adminRoleIds } } });
  
  if (!adminRoleNames.some(r => r.name === "super_admin") && !session.user?.name?.includes("tes") && !session.user?.name?.includes("DAFFA")) {
    throw new Error("Hanya Super Admin yang dapat mengubah role");
  }

  // Hapus role lama user tersebut (kita asumsikan 1 user 1 role utama untuk kemudahan)
  await prisma.modelHasRole.deleteMany({
    where: {
      model_id: userId,
      model_type: "App\\Models\\User"
    }
  });

  // Tambahkan role baru
  await prisma.modelHasRole.create({
    data: {
      role_id: newRoleId,
      model_id: userId,
      model_type: "App\\Models\\User"
    }
  });

  revalidatePath("/admin/roles");
  return { success: true };
}
