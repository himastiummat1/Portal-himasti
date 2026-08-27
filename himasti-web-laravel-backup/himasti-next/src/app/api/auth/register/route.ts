import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, nim, angkatan } = body;

    if (!name || !email || !password || !nim || !angkatan) {
      return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });

    // Create DataKader
    await prisma.dataKader.create({
      data: {
        user_id: user.id,
        nim,
        angkatan,
        status_kaderisasi: "Aktif"
      }
    });

    // Assign Kader role
    const role = await prisma.role.findFirst({ where: { name: "kader" } });
    if (role) {
      await prisma.modelHasRole.create({
        data: {
          role_id: role.id,
          model_type: "App\\Models\\User",
          model_id: user.id
        }
      });
    }

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem saat mendaftar" }, { status: 500 });
  }
}
