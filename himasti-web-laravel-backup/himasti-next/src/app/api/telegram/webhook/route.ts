import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

const groupCooldowns = new Map<number, number>();
const COOLDOWN_MS = 5000;

async function sendMessage(chatId: number, text: string, parseMode = "HTML", replyMarkup?: any) {
  const payload: any = { chat_id: chatId, text, parse_mode: parseMode, disable_web_page_preview: true };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  await fetch(`${TELEGRAM_API}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

async function editMessageText(chatId: number, messageId: number, text: string, parseMode = "HTML", replyMarkup?: any) {
  const payload: any = { chat_id: chatId, message_id: messageId, text, parse_mode: parseMode, disable_web_page_preview: true };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  await fetch(`${TELEGRAM_API}/editMessageText`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  await fetch(`${TELEGRAM_API}/answerCallbackQuery`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ callback_query_id: callbackQueryId, text: text || "" }) });
}

function formatForTelegramHTML(text: string) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\*(.*?)\*/g, "<i>$1</i>").replace(/`(.*?)`/g, "<code>$1</code>");
}

export async function POST(req: Request) {
  if (!TELEGRAM_TOKEN) return NextResponse.json({ error: "No Token" }, { status: 500 });

  try {
    const update = await req.json();

    // 1. Handle Callback Queries (Inline Buttons)
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message?.chat?.id;
      const messageId = cb.message?.message_id;
      const data = cb.data;

      await answerCallbackQuery(cb.id);
      if (!chatId || !messageId) return NextResponse.json({ ok: true });

      const backKeyboard = { inline_keyboard: [[{ text: "⬅️ Kembali ke Menu", callback_data: "menu_back" }]] };

      if (data === "menu_divisi") {
        await editMessageText(chatId, messageId, "📌 <b>Divisi HIMASTI:</b>\n1. Pendidikan & Teknologi\n2. Kaderisasi\n3. Wirausaha\n4. Humas\n5. Kerohanian", "HTML", backKeyboard);
      } else if (data === "menu_modul") {
        await editMessageText(chatId, messageId, "📚 <b>Bank Modul:</b>\nKunjungi portal web kami untuk mengunduh modul perkuliahan dan snippet kode mahasiswa.", "HTML", backKeyboard);
      } else if (data === "menu_lomba") {
        const lombas = await prisma.competitionInfo.findMany({ take: 3, orderBy: { created_at: 'desc' } });
        let reply = "🏆 <b>Info Lomba Terbaru:</b>\n\n";
        if (lombas.length === 0) reply += "Belum ada info lomba terbaru.";
        else lombas.forEach((l, i) => { reply += `${i+1}. <b>${l.title}</b> (${l.type})\nPenyelenggara: ${l.organizer}\n<a href="${l.link}">Lihat Detail</a>\n\n`; });
        await editMessageText(chatId, messageId, reply, "HTML", backKeyboard);
      } else if (data === "menu_back") {
        const welcomeText = `Halo! Saya adalah Bot resmi HIMASTI UMMAT. 👋\n\nSilakan pilih menu di bawah ini untuk melihat informasi:`;
        const keyboard = { inline_keyboard: [ [{ text: "🏢 Info Divisi", callback_data: "menu_divisi" }], [{ text: "📚 Bank Modul", callback_data: "menu_modul" }, { text: "🏆 Info Lomba Terbaru", callback_data: "menu_lomba" }] ] };
        await editMessageText(chatId, messageId, welcomeText, "HTML", keyboard);
      }
      return NextResponse.json({ ok: true });
    }

    // 2. Handle Text Messages
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      if (text.startsWith("/start") || text.startsWith("/menu") || text.startsWith("/help")) {
        const welcomeText = `Halo! Saya adalah Bot resmi HIMASTI UMMAT. 👋\n\nSilakan pilih menu di bawah ini untuk melihat informasi:`;
        const keyboard = { inline_keyboard: [ [{ text: "🏢 Info Divisi", callback_data: "menu_divisi" }], [{ text: "📚 Bank Modul", callback_data: "menu_modul" }, { text: "🏆 Info Lomba Terbaru", callback_data: "menu_lomba" }] ] };
        await sendMessage(chatId, welcomeText, "HTML", keyboard);
        return NextResponse.json({ ok: true });
      }

      if (text.startsWith("/divisi")) {
        await sendMessage(chatId, "📌 <b>Divisi HIMASTI:</b>\n1. Pendidikan & Teknologi\n2. Kaderisasi\n3. Wirausaha\n4. Humas\n5. Kerohanian");
        return NextResponse.json({ ok: true });
      }

      if (text.startsWith("/lomba")) {
        const lombas = await prisma.competitionInfo.findMany({ take: 3, orderBy: { created_at: 'desc' } });
        let reply = "🏆 <b>Info Lomba Terbaru:</b>\n\n";
        if (lombas.length === 0) reply += "Belum ada info lomba terbaru.";
        else lombas.forEach((l, i) => { reply += `${i+1}. <b>${l.title}</b> (${l.type})\nPenyelenggara: ${l.organizer}\n<a href="${l.link}">Lihat Detail</a>\n\n`; });
        await sendMessage(chatId, reply);
        return NextResponse.json({ ok: true });
      }

      const isAiTriggered = text.toLowerCase().startsWith("/ai ") || text.includes("@himastiummatbot");
      if (isAiTriggered) {
        const now = Date.now();
        const lastQuery = groupCooldowns.get(chatId) || 0;
        if (now - lastQuery < COOLDOWN_MS) return NextResponse.json({ ok: true });
        groupCooldowns.set(chatId, now);

        const prompt = text.replace(/\/ai/i, "").replace(/@himastiummatbot/i, "").trim();
        if (!prompt) {
          await sendMessage(chatId, "Ketikkan pertanyaan setelah command /ai. Contoh:\n<code>/ai Apa visi misi HIMASTI?</code>");
          return NextResponse.json({ ok: true });
        }

        const firstName = update.message.from?.first_name || "Mahasiswa";

        const groq = new Groq({ apiKey: process.env.API_KEY_GROQ || "" });
        if (!process.env.API_KEY_GROQ) return NextResponse.json({ ok: true });

        try {
          const chatCompletion = await groq.chat.completions.create({
            messages: [
              { role: "system", content: `Kamu adalah AI Asisten resmi HIMASTI UMMAT yang gaul, profesional, tapi santai. Selain paham HIMASTI, kamu juga ahli coding dan debugging. Jawab pertanyaan seputar kode atau error dengan format yang benar. Kamu sedang berbicara dengan ${firstName}. Sapa dia di awal jika cocok. Jawab dengan sangat ringkas dan to the point.` },
              { role: "user", content: prompt }
            ],
            model: "qwen/qwen3.8-27b",
            temperature: 0.5,
            max_tokens: 200,
          });
          let reply = chatCompletion.choices[0]?.message?.content || "Maaf, saya tidak mengerti.";
          await sendMessage(chatId, formatForTelegramHTML(reply), "HTML");
        } catch (aiError) {
          await sendMessage(chatId, "⚠️ <i>Mohon maaf, server AI kami sedang penuh (Rate Limit).</i>");
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: true });
  }
}
