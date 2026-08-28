"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import crypto from "crypto";

export async function submitAbsensi(meetingId: number, token: string, lat: number | null, lng: number | null) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Silakan login terlebih dahulu." };
  const userId = parseInt(session.user.id);

  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) return { success: false, error: "Rapat tidak ditemukan." };
  if (!meeting.is_active) return { success: false, error: "Sesi absensi untuk rapat ini sudah ditutup." };
  if (!meeting.qr_secret) return { success: false, error: "Sistem QR belum diinisialisasi." };

  // 1. Verify TOTP Token (allow current window and previous window to account for network delay)
  const currentWindow = Math.floor(Date.now() / 10000);
  let isValidToken = false;
  
  for (let w = currentWindow; w >= currentWindow - 1; w--) {
    const hmac = crypto.createHmac("sha256", meeting.qr_secret);
    hmac.update(`${meetingId}:${w}`);
    if (hmac.digest("hex") === token) {
      isValidToken = true;
      break;
    }
  }

  if (!isValidToken) {
    return { success: false, error: "QR Code sudah kedaluwarsa. Silakan scan ulang QR yang tampil di layar." };
  }

  // 2. Verify Geofencing (if meeting has lat/lng set)
  if (meeting.latitude && meeting.longitude && meeting.radius_meter) {
    if (!lat || !lng) return { success: false, error: "Gagal mendapatkan lokasi GPS Anda." };
    
    // Haversine formula
    const R = 6371e3; // Earth radius in meters
    const rad = Math.PI / 180;
    const dLat = (lat - meeting.latitude) * rad;
    const dLon = (lng - meeting.longitude) * rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(meeting.latitude * rad) * Math.cos(lat * rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance > meeting.radius_meter) {
      return { success: false, error: `Anda berada di luar jangkauan lokasi rapat (${Math.round(distance)} meter). Jarak maksimal yang diizinkan adalah ${meeting.radius_meter} meter.` };
    }
  }

  // 3. Record Attendance
  try {
    await prisma.meetingAttendance.create({
      data: {
        meeting_id: meetingId,
        user_id: userId,
        latitude_scan: lat,
        longitude_scan: lng,
        status_kehadiran: "hadir"
      }
    });
    return { success: true };
  } catch (e: any) {
    // Unique constraint violation (already attended)
    if (e.code === 'P2002') return { success: true, message: "Anda sudah melakukan absensi sebelumnya." };
    return { success: false, error: "Gagal menyimpan data absensi." };
  }
}
