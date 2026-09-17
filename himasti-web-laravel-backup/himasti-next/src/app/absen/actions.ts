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

  // 1. Verify TOTP Token (30 seconds per window with 4-window backward tolerance ~120s buffer)
  const currentWindow = Math.floor(Date.now() / 30000);
  let isValidToken = false;
  
  for (let w = currentWindow; w >= currentWindow - 3; w--) {
    const hmac = crypto.createHmac("sha256", meeting.qr_secret);
    hmac.update(`${meetingId}:${w}`);
    if (hmac.digest("hex") === token) {
      isValidToken = true;
      break;
    }
  }

  if (!isValidToken) {
    return { success: false, error: "QR Code sudah kedaluwarsa atau tidak valid. Silakan scan ulang QR yang tampil di layar panitia." };
  }

  // 2. Verify Geofencing (if meeting has lat/lng set)
  if (meeting.latitude && meeting.longitude && meeting.radius_meter) {
    if (!lat || !lng) return { success: false, error: "Gagal mendapatkan koordinat GPS Anda. Pastikan izin lokasi aktif." };
    
    // Haversine formula
    const R = 6371e3; // Earth radius in meters
    const rad = Math.PI / 180;
    const dLat = (lat - meeting.latitude) * rad;
    const dLon = (lng - meeting.longitude) * rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(meeting.latitude * rad) * Math.cos(lat * rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = Math.round(R * c);

    if (distance > meeting.radius_meter) {
      return { 
        success: false, 
        error: `Anda terdeteksi berada di luar area rapat (jarak: ${distance} meter). Batas toleransi lokasi adalah ${meeting.radius_meter} meter dari ruangan rapat.` 
      };
    }
  }

  // 3. Record Attendance
  try {
    const record = await prisma.meetingAttendance.create({
      data: {
        meeting_id: meetingId,
        user_id: userId,
        latitude_scan: lat,
        longitude_scan: lng,
        status_kehadiran: "hadir"
      }
    });
    return { 
      success: true, 
      meetingTitle: meeting.title,
      attendedAt: record.waktu_hadir.toISOString()
    };
  } catch (e: unknown) {
    // Unique constraint violation (already attended)
    if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2002') {
      return { 
        success: true, 
        message: "Kehadiran Anda sudah tercatat sebelumnya untuk rapat ini.", 
        alreadyAttended: true,
        meetingTitle: meeting.title
      };
    }
    return { success: false, error: "Terjadi gangguan sistem saat menyimpan data absensi." };
  }
}
