import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
