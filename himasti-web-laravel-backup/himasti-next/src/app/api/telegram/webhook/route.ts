import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";
import { getHimastiKnowledgeContext, HIMASTI_STATIC_KNOWLEDGE } from "@/lib/ai-knowledge";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

const groupCooldowns = new Map<number, number>();
const COOLDOWN_MS = 3000;

async function sendMessage(chatId: number, text: string, parseMode = "HTML", replyMarkup?: any) {
  const payload: any = { chat_id: chatId, text, parse_mode: parseMode, disable_web_page_preview: true };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function editMessageText(chatId: number, messageId: number, text: string, parseMode = "HTML", replyMarkup?: any) {
  const payload: any = { chat_id: chatId, message_id: messageId, text, parse_mode: parseMode, disable_web_page_preview: true };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  await fetch(`${TELEGRAM_API}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text: text || "" })
  });
}

function formatForTelegramHTML(text: string) {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/`(.*?)`/g, "<code>$1</code>");
}

async function getKaderStatsText() {
  const [totalUsers, totalKaders, kaders] = await Promise.all([
    prisma.user.count(),
    prisma.dataKader.count(),
    prisma.dataKader.findMany({ select: { angkatan: true, status_kaderisasi: true } })
  ]);

  const angkatanMap: Record<string, number> = {};
  kaders.forEach(k => {
    const a = k.angkatan || "Lainnya";
    angkatanMap[a] = (angkatanMap[a] || 0) + 1;
  });

  const angkatanLines = Object.entries(angkatanMap)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([th, count]) => `• <b>Angkatan ${th}:</b> ${count} kader`)
    .join("\n");

  return `
👥 <b>STATISTIK KADER & MAHASISWA HIMASTI</b>

• <b>Total Pengguna Terdaftar:</b> ${totalUsers} orang
• <b>Total Anggota/Kader:</b> ${totalKaders} kader

<b>Sebaran Angkatan:</b>
${angkatanLines || "• Belum ada data per angkatan"}

<i>Semua data kader tersinkronisasi langsung dengan database Portal HIMASTI UMMAT.</i>
`.trim();
}

async function getRapatListText() {
  const meetings = await prisma.meeting.findMany({
    take: 5,
    orderBy: { event_date: "desc" },
    include: { creator: { select: { name: true } }, attendances: { select: { id: true } } }
  });

  if (meetings.length === 0) {
    return "📅 <b>Jadwal Rapat HIMASTI</b>\n\nBelum ada agenda rapat yang dijadwalkan saat ini.";
  }

  const list = meetings.map((m, idx) => {
    const startStr = new Intl.DateTimeFormat("id-ID", { 
      weekday: "short", day: "2-digit", month: "short", year: "numeric", 
      hour: "2-digit", minute: "2-digit" 
    }).format(new Date(m.event_date)) + " WITA";

    const endStr = m.end_date
      ? `\n   ⏰ <b>Selesai:</b> ${new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date(m.end_date))} WITA (Auto-Rekap)`
      : "";

    const statusBadge = m.is_active ? "🟢 <b>Aktif</b>" : "🔴 <b>Ditutup</b>";

    return `${idx + 1}. <b>${m.title}</b> (${m.type.replace('_', ' ').toUpperCase()})
   Status: ${statusBadge}
   📅 <b>Mulai:</b> ${startStr}${endStr}
   📍 <b>Lokasi:</b> ${m.location}
   👤 <b>Penyelenggara:</b> ${m.creator?.name || 'Pengurus'}
   👥 <b>Hadir:</b> ${m.attendances.length} orang`;
  }).join("\n\n");

  return `📅 <b>JADWAL RAPAT & PRESENSI HIMASTI</b>\n\n${list}\n\n<i>Sesi presensi yang memiliki batas waktu akan otomatis ditutup dan rekap dikirim ke grup ini.</i>`;
}

export async function POST(req: Request) {
  if (!TELEGRAM_TOKEN) return NextResponse.json({ error: "No Token" }, { status: 500 });

  try {
    const update = await req.json();

    const mainKeyboard = {
      inline_keyboard: [
        [
          { text: "👥 Data Kader", callback_data: "menu_kader" },
          { text: "📅 Jadwal Rapat", callback_data: "menu_rapat" }
        ],
        [
          { text: "🏢 8 Bidang HIMASTI", callback_data: "menu_divisi" },
          { text: "📚 Bank Modul", callback_data: "menu_modul" }
        ],
        [
          { text: "🏆 Info Lomba IT", callback_data: "menu_lomba" },
          { text: "🤖 Tanya AI Asisten", callback_data: "menu_ai" }
        ]
      ]
    };

    const backKeyboard = { 
      inline_keyboard: [[{ text: "⬅️ Kembali ke Menu Utama", callback_data: "menu_back" }]] 
    };

    // 1. Handle Callback Queries (Tombol Interaktif)
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message?.chat?.id;
      const messageId = cb.message?.message_id;
      const data = cb.data;

      await answerCallbackQuery(cb.id);
      if (!chatId || !messageId) return NextResponse.json({ ok: true });

      if (data === "menu_kader") {
        const text = await getKaderStatsText();
        await editMessageText(chatId, messageId, text, "HTML", backKeyboard);
      } else if (data === "menu_rapat") {
        const text = await getRapatListText();
        await editMessageText(chatId, messageId, text, "HTML", backKeyboard);
      } else if (data === "menu_divisi") {
        const text = `
🏢 <b>STRUKTUR & 8 BIDANG HIMASTI UMMAT</b>

1. <b>BPH Khusus:</b> Ketua Umum, Wakil Ketua Umum, Sekretaris Umum, Bendahara Umum.
2. <b>Bidang Kemuhammadiyahan:</b> Spiritual, Al-Islam, dan Moralitas Kader.
3. <b>Bidang Keorganisasian & Pengkaderan:</b> LDK, Regenerasi, dan Pengembangan Anggota.
4. <b>Bidang Metkom (Media Telekomunikasi):</b> Publikasi, Medsos, Branding, & Portal Web.
5. <b>Bidang Litbang / R&D:</b> Riset Teknologi, Pelatihan Coding, & Karya Inovasi Mahasiswa.
6. <b>Bidang Kewirausahaan:</b> Pendanaan Mandiri, Merchandise Resmi, & Bisnis Kreatif.
7. <b>Bidang Minat & Bakat (Mikat):</b> E-Sports, Olahraga, Seni, & Kreativitas.
8. <b>Bidang Aksi & Advokasi:</b> Penampungan Aspirasi & Hak-Hak Akademik Mahasiswa TI.
9. <b>Bidang Humas:</b> Relasi Eksternal, Kampus, Alumni, & Industri Teknologi.
`.trim();
        await editMessageText(chatId, messageId, text, "HTML", backKeyboard);
      } else if (data === "menu_modul") {
        const text = `
📚 <b>BANK MODUL & KURIKULUM TI HIMASTI</b>

Tersedia materi pembelajaran terbuka yang dapat diakses di portal web:
• <b>Web Development:</b> HTML, CSS, JavaScript, Next.js, React, Tailwind CSS.
• <b>Basis Data:</b> PostgreSQL, Supabase, Prisma ORM, MySQL.
• <b>Jaringan & Keamanan Siber:</b> Routing, Subnetting, FIDO2/WebAuthn, Kriptografi.
• <b>Algoritma & Pemrograman:</b> Logika dasar, Struktur Data, Python, PHP, C++.

Kunjungi menu <b>Modul Kuliah</b> di Portal HIMASTI untuk membaca materi lengkap.
`.trim();
        await editMessageText(chatId, messageId, text, "HTML", backKeyboard);
      } else if (data === "menu_lomba") {
        const lombas = await prisma.competitionInfo.findMany({ take: 3, orderBy: { created_at: 'desc' } });
        let reply = "🏆 <b>INFO LOMBA & HACKATHON TERKINI:</b>\n\n";
        if (lombas.length === 0) {
          reply += "Belum ada agenda lomba terbaru yang tercatat.";
        } else {
          lombas.forEach((l, i) => {
            reply += `${i + 1}. <b>${l.title}</b> (${l.type})\n   Penyelenggara: ${l.organizer}\n   <a href="${l.link}">Lihat Detail & Daftar</a>\n\n`;
          });
        }
        await editMessageText(chatId, messageId, reply, "HTML", backKeyboard);
      } else if (data === "menu_ai") {
        const text = `
🤖 <b>TANYA HIMASTI AI</b>

AI kami telah terintegrasi dengan seluruh database web HIMASTI, meliputi:
• Data kader & statistik angkatan
• Jadwal dan status rapat
• Informasi lomba & bank modul
• Bantuan coding, debugging, dan materi kuliah

<b>Cara bertanya:</b>
Ketikkan <code>/ai [pertanyaan Anda]</code> di grup atau langsung kirim pesan teks di private chat bot ini!
Contoh: <code>/ai Berapa total kader HIMASTI dan ada rapat apa saja?</code>
`.trim();
        await editMessageText(chatId, messageId, text, "HTML", backKeyboard);
      } else if (data === "menu_back") {
        const welcomeText = `Halo! Saya adalah Bot Resmi HIMASTI UMMAT. 👋\n\nSilakan pilih menu di bawah ini untuk melihat data portal dan informasi himpunan:`;
        await editMessageText(chatId, messageId, welcomeText, "HTML", mainKeyboard);
      }
      return NextResponse.json({ ok: true });
    }

    // 2. Handle Text Messages & Slash Commands
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      if (text.startsWith("/start") || text.startsWith("/menu") || text.startsWith("/help")) {
        const welcomeText = `Halo! Saya adalah Bot Resmi HIMASTI UMMAT. 👋\n\nSaya terintegrasi langsung dengan database Portal Web HIMASTI. Silakan pilih menu di bawah ini:`;
        await sendMessage(chatId, welcomeText, "HTML", mainKeyboard);
        return NextResponse.json({ ok: true });
      }

      if (text.startsWith("/kader")) {
        const textKader = await getKaderStatsText();
        await sendMessage(chatId, textKader);
        return NextResponse.json({ ok: true });
      }

      if (text.startsWith("/rapat")) {
        const textRapat = await getRapatListText();
        await sendMessage(chatId, textRapat);
        return NextResponse.json({ ok: true });
      }

      if (text.startsWith("/divisi") || text.startsWith("/bidang")) {
        await sendMessage(chatId, `📌 <b>8 Bidang HIMASTI UMMAT:</b>\n1. Kemuhammadiyahan\n2. Keorganisasian & Pengkaderan\n3. Metkom / Media\n4. Litbang / R&D\n5. Kewirausahaan\n6. Minat & Bakat (Mikat)\n7. Aksi & Advokasi\n8. Hubungan Masyarakat (Humas)`);
        return NextResponse.json({ ok: true });
      }

      if (text.startsWith("/lomba")) {
        const lombas = await prisma.competitionInfo.findMany({ take: 3, orderBy: { created_at: 'desc' } });
        let reply = "🏆 <b>Info Lomba Terbaru:</b>\n\n";
        if (lombas.length === 0) reply += "Belum ada info lomba terbaru.";
        else lombas.forEach((l, i) => {
          reply += `${i + 1}. <b>${l.title}</b> (${l.type})\nPenyelenggara: ${l.organizer}\n<a href="${l.link}">Lihat Detail</a>\n\n`;
        });
        await sendMessage(chatId, reply);
        return NextResponse.json({ ok: true });
      }

      // 3. AI Chatbot Trigger (Private Chat atau /ai atau Mention)
      const isPrivateChat = update.message.chat.type === "private";
      const isAiTriggered = text.toLowerCase().startsWith("/ai ") || text.includes("@himastiummatbot") || isPrivateChat;
      
      if (isAiTriggered) {
        const now = Date.now();
        const lastQuery = groupCooldowns.get(chatId) || 0;
        if (now - lastQuery < COOLDOWN_MS) return NextResponse.json({ ok: true });
        groupCooldowns.set(chatId, now);

        const prompt = text.replace(/\/ai/i, "").replace(/@himastiummatbot/i, "").trim();
        if (!prompt) {
          await sendMessage(chatId, "Ketikkan pertanyaan setelah perintah /ai. Contoh:\n<code>/ai Berapa total kader dan jadwal rapat terkini?</code>");
          return NextResponse.json({ ok: true });
        }

        const firstName = update.message.from?.first_name || "Mahasiswa";
        const groqKey = process.env.API_KEY_GROQ || process.env.GROQ_API_KEY;

        // Ambil konteks lengkap live dari database portal HIMASTI
        const dynamicDbKnowledge = await getHimastiKnowledgeContext();

        const systemPrompt = `
Kamu adalah HIMASTI AI, asisten resmi HIMASTI UMMAT di Telegram yang ramah, santai, namun sangat profesional dan berpengetahuan luas.
Kamu berbicara dengan ${firstName}.

${HIMASTI_STATIC_KNOWLEDGE}

${dynamicDbKnowledge}

INSTRUKSI:
1. Jawab pertanyaan mengenai data kader, angkatan, jadwal rapat, atau informasi lomba secara akurat berdasarkan data realtime di atas.
2. DILARANG menggunakan tanda bintang Markdown (*) atau (**) yang berantakan. Gunakan simbol bullet bulat • atau angka untuk daftar, dan huruf kapital/tanda kutip untuk penekanan.
3. Kamu juga ahli coding dan teknologi informasi. Berikan solusi error atau snippet kode yang tepat dan ringkas jika ditanyakan.
4. Jawab dengan to the point, padat, dan jelas.
`.trim();

        if (!groqKey) {
          await sendMessage(chatId, `Halo ${firstName}! Saat ini API AI Groq belum aktif di server. Namun ringkasan data terkini adalah:\n\n${dynamicDbKnowledge}`);
          return NextResponse.json({ ok: true });
        }

        const groq = new Groq({ apiKey: groqKey });

        try {
          let reply = "";
          try {
            const chatCompletion = await groq.chat.completions.create({
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
              ],
              model: "qwen/qwen3.8-27b",
              temperature: 0.6,
              max_tokens: 600,
            });
            reply = chatCompletion.choices[0]?.message?.content || "";
          } catch (modelErr) {
            console.warn("Telegram AI primary model error, falling back to openai/gpt-oss-120b:", modelErr);
            const fallback = await groq.chat.completions.create({
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
              ],
              model: "openai/gpt-oss-120b",
              temperature: 0.6,
              max_tokens: 600,
            });
            reply = fallback.choices[0]?.message?.content || "";
          }

          if (reply) {
            await sendMessage(chatId, formatForTelegramHTML(reply), "HTML");
          } else {
            await sendMessage(chatId, "Maaf, tidak dapat memproses jawaban saat ini.");
          }
        } catch (aiError) {
          console.error("Telegram AI Error:", aiError);
          await sendMessage(chatId, "⚠️ <i>Mohon maaf, sistem AI sedang mengalami lonjakan trafik. Silakan ulangi dalam beberapa detik.</i>");
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook handler error:", error);
    return NextResponse.json({ ok: true });
  }
}
