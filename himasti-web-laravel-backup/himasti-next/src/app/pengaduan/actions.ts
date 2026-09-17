"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function generateTrackingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ASP-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return code;
}

export async function submitPengaduan(formData: FormData) {
  try {
    const kategori = (formData.get("kategori") as string || "Umum").trim();
    const judul = (formData.get("judul") as string || "").trim();
    const isi = (formData.get("isi") as string || "").trim();

    if (!judul || judul.length < 3) {
      return { success: false, error: "Judul pengaduan minimal 3 karakter." };
    }
    if (judul.length > 250) {
      return { success: false, error: "Judul pengaduan maksimal 250 karakter." };
    }
    if (!isi || isi.length < 10) {
      return { success: false, error: "Isi pengaduan minimal 10 karakter agar dapat dipahami dan ditindaklanjuti." };
    }
    if (isi.length > 5000) {
      return { success: false, error: "Isi pengaduan maksimal 5000 karakter." };
    }

    // Generate unique tracking code with collision handling
    let tracking_code = generateTrackingCode();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.pengaduan.findUnique({
        where: { tracking_code },
        select: { id: true },
      });
      if (!existing) break;
      tracking_code = generateTrackingCode();
      attempts++;
    }

    const created = await prisma.pengaduan.create({
      data: {
        tracking_code,
        kategori,
        judul,
        isi,
        status: "menunggu",
      },
    });

    return {
      success: true,
      tracking_code: created.tracking_code,
    };
  } catch (error: unknown) {
    console.error("Error submitting anonymous pengaduan:", error);
    return {
      success: false,
      error: "Terjadi kesalahan server saat menyimpan pengaduan. Silakan coba beberapa saat lagi.",
    };
  }
}

export async function getPengaduanByTracking(trackingCode: string) {
  try {
    const cleanCode = trackingCode.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, error: "Masukkan kode tracking pengaduan." };
    }

    const report = await prisma.pengaduan.findUnique({
      where: { tracking_code: cleanCode },
      select: {
        id: true,
        tracking_code: true,
        kategori: true,
        judul: true,
        isi: true,
        status: true,
        tanggapan: true,
        responded_by: true,
        responded_at: true,
        created_at: true,
      },
    });

    if (!report) {
      return {
        success: false,
        error: `Pengaduan dengan kode "${cleanCode}" tidak ditemukan. Pastikan kode yang Anda masukkan benar.`,
      };
    }

    return {
      success: true,
      data: {
        tracking_code: report.tracking_code,
        kategori: report.kategori,
        judul: report.judul,
        isi: report.isi,
        status: report.status,
        tanggapan: report.tanggapan,
        responded_by: report.responded_by,
        responded_at: report.responded_at?.toISOString() || null,
        created_at: report.created_at?.toISOString() || null,
      },
    };
  } catch (error: unknown) {
    console.error("Error fetching pengaduan by tracking:", error);
    return {
      success: false,
      error: "Gagal mengambil data pengaduan. Silakan coba kembali.",
    };
  }
}
