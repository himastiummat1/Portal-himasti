import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const currentUserRoles = await prisma.modelHasRole.findMany({
      where: { model_id: parseInt(session.user.id) },
      include: { role: true }
    });
    const isSuperAdmin = currentUserRoles.some(r => r.role.name === "super_admin");
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Hanya Super Admin yang dapat mengubah role." }, { status: 403 });
    }

    const { userId, newRoleName } = await req.json();
    if (!userId || !newRoleName) return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });

    const role = await prisma.role.findFirst({ where: { name: newRoleName } });
    if (!role) return NextResponse.json({ error: "Role tidak ditemukan" }, { status: 404 });

    // Hapus role lama
    await prisma.modelHasRole.deleteMany({
      where: { model_id: parseInt(userId) }
    });

    // Tambah role baru
    await prisma.modelHasRole.create({
      data: {
        role_id: role.id,
        model_type: "App\\Models\\User",
        model_id: parseInt(userId)
      }
    });

    return NextResponse.json({ success: true, message: "Role berhasil diubah!" });
  } catch (error: any) {
    console.error("Change Role Error:", error);
    return NextResponse.json({ error: "Gagal mengubah role" }, { status: 500 });
  }
}
