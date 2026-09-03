import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = parseInt(session.user.id as string);
    const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
    const isBendahara = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("bendahara"));
    if (!isBendahara) {
      return NextResponse.json({ error: "Akses ditolak: Hanya Bendahara yang dapat mengubah kas." }, { status: 403 });
    }

    const p = await params;
    const id = parseInt(p.id);
    const body = await req.json();
    const { tipe, jumlah, keterangan, tanggal } = body;

    const keuangan = await prisma.keuangan.update({
      where: { id },
      data: {
        tipe,
        nominal: parseFloat(jumlah),
        keterangan,
        tanggal: new Date(tanggal)
      }
    });

    return NextResponse.json({ success: true, data: keuangan });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengupdate data" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = parseInt(session.user.id as string);
    const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
    const isBendahara = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("bendahara"));
    if (!isBendahara) {
      return NextResponse.json({ error: "Akses ditolak: Hanya Bendahara yang dapat menghapus kas." }, { status: 403 });
    }

    const p = await params;
    const id = parseInt(p.id);
    await prisma.keuangan.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}
