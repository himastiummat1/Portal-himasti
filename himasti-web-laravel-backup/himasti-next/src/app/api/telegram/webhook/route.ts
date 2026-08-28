import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma"; // Phase 4: Integrasi Database

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Simple in-memory rate limiter for groups
const groupCooldowns = new Map<number, number>();
const COOLDOWN_MS = 5000;

// Helper: Send text message
async function sendMessage(chatId: number, text: string, parseMode = "HTML", replyMarkup?: any) {
  const payload: any = {
    chat_id: chatId,
    text: text,
    parse_mode: parseMode,
  };
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text || "",
    }),
  });
}

function formatForTelegramHTML(text: string) {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/`(.*?)`/g, "<code>$1</code>");
}

export async function POST(req: Request) {
  if (!TELEGRAM_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not configured" }, { status: 500 });
  }

  try {
    const update = await req.json();

    // 1. Handle Callback Queries (Inline Buttons)
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message?.chat?.id;
      const data = cb.data;

      await answerCallbackQuery(cb.id);
      if (!chatId) return NextResponse.json({ ok: true });

      if (data === "menu_divisi") {
        await sendMessage(chatId, "📌 <b>Divisi HIMASTI:</b>\n1. Pendidikan & Teknologi\n2. Kaderisasi\n3. Wirausaha\n4. Humas\n5. Kerohanian");
      } else if (data === "menu_modul") {
        await sendMessage(chatId, "📚 <b>Bank Modul:</b>\nKunjungi portal web kami untuk mengunduh modul perkuliahan dan snippet kode mahasiswa.");
      } else if (data === "menu_lomba") {
        // Query database (Phase 4)
        const lombas = await prisma.competitionInfo.findMany({ take: 3, orderBy: { created_at: 'desc' } });
        if (lombas.length === 0) {
          await sendMessage(chatId, "Belum ada info lomba terbaru.");
        } else {
          let reply = "🏆 <b>Info Lomba Terbaru:</b>\n\n";
          lombas.forEach((l, i) => {
            reply += `${i+1}. <b>${l.title}</b> (${l.type})\nPenyelenggara: ${l.organizer}\n<a href="${l.link}">Lihat Detail</a>\n\n`;
          });
          await sendMessage(chatId, reply);
        }
      }
      return NextResponse.json({ ok: true });
    }

    // 2. Handle Text Messages
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      // Commands Phase 2
      if (text.startsWith("/start") || text.startsWith("/menu") || text.startsWith("/help")) {
        const welcomeText = `Halo! Saya adalah Bot resmi HIMASTI UMMAT. 👋\n\nSilakan pilih menu di bawah ini untuk melihat informasi:`;
        const keyboard = {
          inline_keyboard: [
            [{ text: "🏢 Info Divisi", callback_data: "menu_divisi" }],
            [{ text: "📚 Bank Modul", callback_data: "menu_modul" }, { text: "🏆 Info Lomba Terbaru", callback_data: "menu_lomba" }]
          ]
        };
        await sendMessage(chatId, welcomeText, "HTML", keyboard);
        return NextResponse.json({ ok: true });
      }

      if (text.startsWith("/divisi")) {
        await sendMessage(chatId, "📌 <b>Divisi HIMASTI:</b>\n1. Pendidikan & Teknologi\n2. Kaderisasi\n3. Wirausaha\n4. Humas\n5. Kerohanian");
        return NextResponse.json({ ok: true });
      }

      if (text.startsWith("/lomba")) {
        // Direct command to DB (Phase 4)
        const lombas = await prisma.competitionInfo.findMany({ take: 3, orderBy: { created_at: 'desc' } });
        if (lombas.length === 0) {
          await sendMessage(chatId, "Belum ada info lomba terbaru.");
        } else {
          let reply = "🏆 <b>Info Lomba Terbaru:</b>\n\n";
          lombas.forEach((l, i) => {
            reply += `${i+1}. <b>${l.title}</b> (${l.type})\nPenyelenggara: ${l.organizer}\n<a href="${l.link}">Lihat Detail</a>\n\n`;
          });
          await sendMessage(chatId, reply);
        }
        return NextResponse.json({ ok: true });
      }

      // Phase 3: AI Engine Trigger (/ai or mention @bot)
      const isAiTriggered = text.toLowerCase().startsWith("/ai ") || text.includes("@himastiummatbot");
      
      if (isAiTriggered) {
        // Anti-spam Cooldown (Phase 3)
        const now = Date.now();
        const lastQuery = groupCooldowns.get(chatId) || 0;
        if (now - lastQuery < COOLDOWN_MS) {
          // If spamming, quietly ignore to save tokens
          return NextResponse.json({ ok: true });
        }
        groupCooldowns.set(chatId, now);

        const prompt = text.replace(/\/ai/i, "").replace(/@himastiummatbot/i, "").trim();
        if (!prompt) {
          await sendMessage(chatId, "Ketikkan pertanyaan setelah command /ai. Contoh:\n<code>/ai Apa visi misi HIMASTI?</code>");
          return NextResponse.json({ ok: true });
        }

        const groq = new Groq({ apiKey: process.env.API_KEY_GROQ || "" });
        if (!process.env.API_KEY_GROQ) {
          await sendMessage(chatId, "⚠️ <i>Sistem AI sedang offline (API Key tidak tersedia).</i>");
          return NextResponse.json({ ok: true });
        }

        try {
          const chatCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: "system",
                content: `Kamu adalah AI Asisten resmi HIMASTI UMMAT. 
Jawablah pertanyaan seputar sejarah HIMASTI dan Kemuhammadiyahan dengan akurat berdasarkan fakta berikut:
- Didirikan: 21 April 2022.
- 8 Pencetus: Arif Rahman, Samiul Ghozi, Husni Mubarok, dll.
Jawab dengan ramah, informatif, sangat ringkas. Gunakan format Markdown (bold/italic) seperlunya.`
              },
              { role: "user", content: prompt }
            ],
            model: "qwen/qwen3.8-27b", // Can fallback to llama3 if this fails
            temperature: 0.5,
            max_tokens: 200, // Membatasi output (Phase 3)
          });

          let reply = chatCompletion.choices[0]?.message?.content || "Maaf, saya tidak mengerti.";
          reply = formatForTelegramHTML(reply);
          await sendMessage(chatId, reply, "HTML");
        } catch (aiError: any) {
          console.error("Groq AI Error:", aiError);
          // Fallback (Phase 3)
          await sendMessage(chatId, "⚠️ <i>Mohon maaf, server AI kami sedang penuh (Rate Limit). Silakan coba beberapa saat lagi.</i>");
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ ok: true }); // Always return OK to Telegram to avoid retries
  }
}
