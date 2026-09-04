import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, nim, angkatan, secret_code, consent } = body;

    if (!name || !email || !password || !nim || !angkatan || !secret_code) {
      return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
    }

    // Validasi Persetujuan Ketentuan Layanan & Kebijakan Privasi
    if (!consent || consent === "false") {
      return NextResponse.json({ 
        error: "Pendaftaran ditolak: Anda wajib menyetujui Ketentuan Layanan dan Kebijakan Privasi." 
      }, { status: 400 });
    }

    // Validasi Kode Rahasia (Diambil dari environment variable aman)
    const VALID_CODE = process.env.REGISTRATION_CODE;
    if (!VALID_CODE) {
      return NextResponse.json({ error: "Pendaftaran sedang ditutup sementara oleh pengurus." }, { status: 503 });
    }

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

    const existingNim = await prisma.dataKader.findUnique({ where: { nim } });
    if (existingNim) {
      return NextResponse.json({ error: "NIM sudah terdaftar di sistem kader" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Atomic Transaction: Cegah orphaned User jika salah satu mutasi gagal
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, email, password: hashedPassword }
      });

      await tx.dataKader.create({
        data: { user_id: newUser.id, nim, angkatan, status_kaderisasi: "Aktif" }
      });

      const role = await tx.role.findFirst({ where: { name: "kader" } });
      if (role) {
        await tx.modelHasRole.create({
          data: { role_id: role.id, model_type: "App\\Models\\User", model_id: newUser.id }
        });
      }

      return newUser;
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error: any) {
    return NextResponse.json({ error: "Terjadi kesalahan sistem saat mendaftar" }, { status: 500 });
  }
}
