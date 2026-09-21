"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { canUserManageMeeting } from "@/lib/security";

export interface CloseRapatOptions {
  skipAuth?: boolean;
  isAutoClosed?: boolean;
  currentUserId?: number;
}

/**
 * Menutup sesi absensi rapat dan mengirimkan rekapitulasi kehadiran ke Telegram.
 * Dilengkapi validasi kepemilikan (RBAC):
 * - Hanya pembuat rapat atau Super Admin / BPH Khusus yang berhak menutup sesi.
 * - Pengurus lain atau kader tidak dapat menutup atau mengganggu rapat milik orang lain.
 */
export async function tutupAbsensiDanRekap(meetingId: number, options?: CloseRapatOptions) {
  // 1. Validasi Autentikasi & Wewenang (jika bukan dipanggil oleh auto-close engine internal)
  if (!options?.skipAuth) {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Akses ditolak: Silakan login terlebih dahulu." };
    }

    const currentUserId = parseInt(session.user.id);
    const meetingCheck = await prisma.meeting.findUnique({
      where: { id: meetingId },
      select: { created_by: true }
    });

    if (!meetingCheck) {
      return { success: false, message: "Rapat tidak ditemukan." };
    }

    const userRolesData = await prisma.modelHasRole.findMany({
      where: { model_id: currentUserId },
      include: { role: true }
    });
    const roleNames = userRolesData.map((r) => r.role.name);

    if (!canUserManageMeeting(currentUserId, roleNames, meetingCheck.created_by)) {
      return {
        success: false,
        message: "Akses ditolak: Anda tidak memiliki hak untuk menutup atau merekap rapat yang diselenggarakan oleh pengurus lain."
      };
    }
  }

  // 2. Matikan status aktif rapat
  await prisma.meeting.update({
    where: { id: meetingId },
    data: { is_active: false }
  });

  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { 
      attendances: { 
        include: { user: true },
        orderBy: { waktu_hadir: "asc" }
      },
      creator: {
        select: { name: true, email: true }
      }
    }
  });

  if (!meeting) {
    return { success: false, message: "Rapat tidak ditemukan." };
  }

  // 3. Ambil daftar seluruh kader/pengurus aktif untuk menghitung daftar alfa
  const allUsers = await prisma.user.findMany({
    where: { 
      roles: { some: {} } 
    },
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });

  const hadirIds = meeting.attendances.map((a) => a.user_id);
  const hadir = meeting.attendances.map((a) => ({
    name: a.user.name,
    time: a.waktu_hadir ? new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date(a.waktu_hadir)) : ""
  }));
  const tidakHadir = allUsers.filter((u) => !hadirIds.includes(u.id)).map((u) => u.name);

  // Escape HTML characters to prevent breaking Telegram's parser
  const escapeHtml = (text: string) => 
    (text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const formatDateTime = (d: Date) => 
    new Intl.DateTimeFormat("id-ID", { 
      weekday: "long", day: "2-digit", month: "short", year: "numeric", 
      hour: "2-digit", minute: "2-digit" 
    }).format(new Date(d)) + " WITA";

  const headerTitle = options?.isAutoClosed
    ? "⏰ <b>REKAP ABSENSI RAPAT (DITUTUP OTOMATIS)</b> ⏰\n<i>Sesi presensi telah berakhir sesuai batas waktu yang ditentukan.</i>"
    : "📊 <b>REKAP ABSENSI RAPAT HIMASTI</b> 📊";

  const waktuSelesaiInfo = meeting.end_date 
    ? `<b>Batas Selesai:</b> ${formatDateTime(meeting.end_date)}\n` 
    : "";

  // 4. Format Pesan Telegram
  const message = `
${headerTitle}

<b>Agenda:</b> ${escapeHtml(meeting.title)}
<b>Tipe:</b> ${escapeHtml(meeting.type.replace('_', ' ').toUpperCase())}
<b>Waktu Mulai:</b> ${formatDateTime(meeting.event_date)}
${waktuSelesaiInfo}<b>Lokasi:</b> ${escapeHtml(meeting.location)}
<b>Penyelenggara:</b> ${escapeHtml(meeting.creator?.name || "Pengurus HIMASTI")}

✅ <b>HADIR (${hadir.length} Orang):</b>
${hadir.map((h, i) => `${i + 1}. ${escapeHtml(h.name)} ${h.time ? `(${h.time})` : ''}`).join('\n') || '- Belum ada kehadiran -'}

❌ <b>TIDAK HADIR / ALFA (${tidakHadir.length} Orang):</b>
${tidakHadir.map((n, i) => `${i + 1}. ${escapeHtml(n)}`).join('\n') || '- Nihil (Hadir Semua) -'}

<i>Sistem Presensi Presisi HIMASTI v2.0 • Universitas Muhammadiyah Mataram</i>
`.trim();

  // 5. Kirim Notifikasi ke Telegram Bot
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      const result = await response.json();
      if (!result.ok) {
        console.error("Telegram API Error:", result);
      }
    } catch (e) {
      console.error("Gagal menghubungi server Telegram:", e);
    }
  }

  return { 
    success: true, 
    message: options?.isAutoClosed 
      ? "Sesi rapat telah otomatis ditutup dan rekap berhasil dikirim ke Telegram!" 
      : "Absensi ditutup & rekap kehadiran berhasil dikirim ke Telegram!" 
  };
}

/**
 * Mesin Pemeriksa Otomatis:
 * Menemukan seluruh rapat aktif yang telah melewati batas waktu (end_date <= now),
 * lalu otomatis menutup sesi dan mengirimkan rekapitulasi ke Telegram.
 */
export async function autoCloseExpiredMeetings(): Promise<{ closedCount: number; meetingIds: number[] }> {
  try {
    const now = new Date();
    const expiredMeetings = await prisma.meeting.findMany({
      where: {
        is_active: true,
        end_date: {
          not: null,
          lte: now
        }
      },
      select: { id: true, title: true }
    });

    if (expiredMeetings.length === 0) {
      return { closedCount: 0, meetingIds: [] };
    }

    const closedIds: number[] = [];
    for (const m of expiredMeetings) {
      try {
        await tutupAbsensiDanRekap(m.id, { skipAuth: true, isAutoClosed: true });
        closedIds.push(m.id);
      } catch (err) {
        console.error(`Gagal auto-close rapat ID ${m.id} (${m.title}):`, err);
      }
    }

    return { closedCount: closedIds.length, meetingIds: closedIds };
  } catch (error) {
    console.error("Error in autoCloseExpiredMeetings:", error);
    return { closedCount: 0, meetingIds: [] };
  }
}
