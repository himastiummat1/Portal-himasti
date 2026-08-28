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

  // 3. Format Pesan Telegram
  const message = `
📊 *REKAP ABSENSI RAPAT HIMASTI* 📊
*Agenda:* ${meeting.title}
*Tanggal:* ${meeting.event_date.toLocaleDateString('id-ID')}
*Lokasi:* ${meeting.location}

✅ *HADIR (${hadir.length} Orang):*
${hadir.map((n, i) => `${i+1}. ${n}`).join('\n') || '-'}

❌ *TIDAK HADIR / ALFA (${tidakHadir.length} Orang):*
${tidakHadir.map((n, i) => `${i+1}. ${n}`).join('\n') || '-'}

_Sistem Absensi Cerdas HIMASTI v2.0_
`;

  // 4. Kirim ke Telegram (Jika token diatur di .env)
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    } catch (e) {
      console.error("Gagal mengirim Telegram:", e);
    }
  }

  return { success: true, message: "Absensi ditutup & rekap berhasil dihitung!" };
}
