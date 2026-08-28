"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function submitOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sesi tidak valid." };

  const userId = session.user.id;
  if (formData.get("userId") !== userId) return { error: "Akses ditolak." };

  const name = formData.get("name") as string;
  const nim = formData.get("nim") as string;
  const angkatan = formData.get("angkatan") as string;
  const password = formData.get("password") as string;
  const secret_code = formData.get("secret_code") as string;

  if (!name || !nim || !angkatan || !password || !secret_code) {
    return { error: "Semua kolom wajib diisi." };
  }

  const VALID_CODE = process.env.REGISTRATION_CODE || "JIWA AKTIF JIWA KREATIF LUAR BIASA";
  const cleanInput = secret_code.toUpperCase().replace(/[^A-Z]/g, '');
  const cleanValid = VALID_CODE.toUpperCase().replace(/[^A-Z]/g, '');

  if (cleanInput !== cleanValid) {
    return { error: "Kode Akses Pendaftaran tidak valid! Anda bukan kader." };
  }

  if (password.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: parseInt(userId) },
        data: { name, password: hashedPassword }
      }),
      prisma.dataKader.update({
        where: { user_id: parseInt(userId) },
        data: { nim, angkatan }
      })
    ]);
  } catch (error) {
    return { error: "Gagal menyimpan data. Pastikan NIM belum digunakan." };
  }

  redirect("/admin");
}
