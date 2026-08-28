import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, nim, angkatan, secret_code } = body;

    if (!name || !email || !password || !nim || !angkatan || !secret_code) {
      return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
    }

    // Validasi Kode Rahasia (Case Insensitive & Abaikan Tanda Baca/Spasi)
    const VALID_CODE = process.env.REGISTRATION_CODE || "JIWA AKTIF JIWA KREATIF LUAR BIASA";
    const cleanInput = secret_code.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanValid = VALID_CODE.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (cleanInput !== cleanValid) {
      return NextResponse.json({ error: "Kode Akses Pendaftaran tidak valid! Anda bukan kader." }, { status: 403 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password minimal 8 karakter" }, { status: 400 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
    }
    if (nim.length < 5 || nim.length > 20) {
      return NextResponse.json({ error: "NIM tidak valid" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    await prisma.dataKader.create({
      data: { user_id: user.id, nim, angkatan, status_kaderisasi: "Aktif" }
    });

    const role = await prisma.role.findFirst({ where: { name: "kader" } });
    if (role) {
      await prisma.modelHasRole.create({
        data: { role_id: role.id, model_type: "App\\Models\\User", model_id: user.id }
      });
    }

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error: any) {
    return NextResponse.json({ error: "Terjadi kesalahan sistem saat mendaftar" }, { status: 500 });
  }
}
