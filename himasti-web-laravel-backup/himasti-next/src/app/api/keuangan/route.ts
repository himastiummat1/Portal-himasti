import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = parseInt(session.user.id as string);
    const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
    const isBendahara = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("bendahara"));
    if (!isBendahara) {
      return NextResponse.json({ error: "Akses ditolak: Hanya Bendahara yang dapat mencatat kas." }, { status: 403 });
    }

    const body = await req.json();
    const { tipe, jumlah, keterangan, tanggal } = body;

    if (!tipe || !jumlah || !keterangan || !tanggal) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    const keuangan = await prisma.keuangan.create({
      data: {
        user_id: parseInt(session.user.id as string),
        tipe,
        nominal: parseFloat(jumlah),
        keterangan,
        tanggal: new Date(tanggal)
      }
    });

    return NextResponse.json({ success: true, data: keuangan });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
