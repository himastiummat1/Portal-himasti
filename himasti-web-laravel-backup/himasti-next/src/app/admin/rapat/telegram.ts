"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function tutupAbsensiDanRekap(meetingId: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  // 1. Matikan QR
  await prisma.meeting.update({
    where: { id: meetingId },
    data: { is_active: false }
  });

  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { attendances: { include: { user: true } } }
  });

  if (!meeting) throw new Error("Rapat tidak ditemukan");

  // 2. Ambil semua anggota pengurus (yang seharusnya hadir)
  // Misalnya kita ambil semua user yang punya role (atau status aktif)
  const allUsers = await prisma.user.findMany({
    where: { roles: { some: {} } }, // Asumsi pengurus punya minimal 1 role
    select: { id: true, name: true }
  });

  const hadirIds = meeting.attendances.map(a => a.user_id);
  const hadir = meeting.attendances.map(a => a.user.name);
  const tidakHadir = allUsers.filter(u => !hadirIds.includes(u.id)).map(u => u.name);

  // Escape HTML characters to prevent breaking Telegram's parser
  const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // 3. Format Pesan Telegram (Menggunakan HTML agar lebih kebal error)
  const message = `
📊 <b>REKAP ABSENSI RAPAT HIMASTI</b> 📊
<b>Agenda:</b> ${escapeHtml(meeting.title)}
<b>Tanggal:</b> ${meeting.event_date.toLocaleDateString('id-ID')}
<b>Lokasi:</b> ${escapeHtml(meeting.location)}

✅ <b>HADIR (${hadir.length} Orang):</b>
${hadir.map((n, i) => `${i+1}. ${escapeHtml(n)}`).join('\n') || '-'}

❌ <b>TIDAK HADIR / ALFA (${tidakHadir.length} Orang):</b>
${tidakHadir.map((n, i) => `${i+1}. ${escapeHtml(n)}`).join('\n') || '-'}

<i>Sistem Absensi Cerdas HIMASTI v2.0</i>
`;

  // 4. Kirim ke Telegram
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

  return { success: true, message: "Absensi ditutup & rekap berhasil dihitung!" };
}
