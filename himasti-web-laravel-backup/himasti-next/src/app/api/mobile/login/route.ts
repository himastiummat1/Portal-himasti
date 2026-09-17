import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const identifier = body.identifier || body.email;
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "NIM/Email dan Password wajib diisi" },
        { status: 400 }
      );
    }

    const rawIdentifier = String(identifier).trim();
    const rawPassword = String(password);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: rawIdentifier, mode: "insensitive" } },
          { data_kader: { nim: { equals: rawIdentifier, mode: "insensitive" } } },
        ],
      },
      include: {
        data_kader: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: "Akun tidak ditemukan atau password salah" },
        { status: 401 }
      );
    }

    // Password verification logic identical to auth.ts (with mobile tolerances)
    let passwordsMatch = await bcrypt.compare(rawPassword, user.password);
    if (!passwordsMatch && rawPassword.trim() !== rawPassword) {
      passwordsMatch = await bcrypt.compare(rawPassword.trim(), user.password);
    }
    if (!passwordsMatch) {
      const lowerFirst = rawPassword.charAt(0).toLowerCase() + rawPassword.slice(1).trim();
      passwordsMatch = await bcrypt.compare(lowerFirst, user.password);
    }
    if (!passwordsMatch) {
      const lowerAll = rawPassword.toLowerCase().trim();
      passwordsMatch = await bcrypt.compare(lowerAll, user.password);
    }

    if (!passwordsMatch) {
      return NextResponse.json(
        { success: false, message: "Password salah. Pastikan penulisan huruf besar/kecil benar." },
        { status: 401 }
      );
    }

    const roles = user.roles.map((r) => r.role?.name).filter(Boolean);

    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      nim: user.data_kader?.nim || null,
      angkatan: user.data_kader?.angkatan || null,
      status: user.data_kader?.status_kaderisasi || "Aktif",
      roles: roles.length > 0 ? roles : ["kader"],
      xp: user.data_kader?.xp || 0,
      custom_title: user.data_kader?.custom_title || "Kader",
    };

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: sessionData,
    });
  } catch (error: any) {
    console.error("Mobile login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server internal: " + error.message },
      { status: 500 }
    );
  }
}
