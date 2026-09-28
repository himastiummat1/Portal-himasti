import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getHimastiKnowledgeContext, HIMASTI_STATIC_KNOWLEDGE } from "@/lib/ai-knowledge";

// In-memory sliding rate limiter (per IP, 20 req/min)
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;

export async function POST(req: Request) {
  // 1. Rate Limiting Check
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (entry && now < entry.reset) {
    entry.count++;
    if (entry.count > RATE_LIMIT) {
      return NextResponse.json({ 
        text: "Terlalu banyak permintaan AI. Silakan tunggu sejenak demi stabilitas sistem." 
      }, { status: 429 });
    }
  } else {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS });
  }

  const groqKey = process.env.API_KEY_GROQ || process.env.GROQ_API_KEY;

  try {
    const { messages, lang } = await req.json();
    let langInstruction = "";
    if (lang === "en") langInstruction = "\nMohon jawab dalam BAHASA INGGRIS (English).";
    if (lang === "ar") langInstruction = "\nMohon jawab dalam BAHASA ARAB (Arabic).";

    // 2. Ambil konteks dinamis live dari database (Kader, Rapat, Lomba, Pengurus)
    const dynamicDbKnowledge = await getHimastiKnowledgeContext();

    const systemPrompt = `
Kamu adalah "HIMASTI AI", asisten kecerdasan buatan resmi untuk Himpunan Mahasiswa Teknologi Informasi (HIMASTI) Universitas Muhammadiyah Mataram (UMMAT).
Kamu memiliki pengetahuan mendalam dan menyeluruh tentang seluruh isi portal web HIMASTI, struktur organisasi, data kader, agenda rapat, bank modul, serta keahlian teknis pemrograman.

${HIMASTI_STATIC_KNOWLEDGE}

${dynamicDbKnowledge}

ATURAN FORMAT PENULISAN (PENTING - BEBAS TANDA BINTANG / NO ASTERISK):
- DILARANG KERAS menggunakan tanda bintang (*) atau bintang ganda (**) untuk menebalkan kata, memiringkan huruf, maupun sebagai bullet list.
- Untuk penekanan kata, gunakan HURUF KAPITAL atau tanda kutip ("..."), BUKAN tanda bintang.
- Untuk daftar list, gunakan simbol bullet bulat • atau penomoran angka (1., 2., 3.). JANGAN gunakan tanda bintang (*).
- Jangan gunakan header Markdown (### atau ##). Gunakan baris baru (enter ganda) untuk memisahkan bagian.
- Format teks harus bersih, rapi, dan nyaman dibaca langsung sebagai teks polos tanpa markup mentah.

INSTRUKSI MENJAWAB:
1. Jawab pertanyaan pengguna secara akurat berdasarkan data di atas. Jika ditanya tentang jumlah kader, angkatan, jadwal rapat, atau fitur web, gunakan data realtime yang telah disediakan.
2. Jaga privasi: Jangan pernah membagikan password, hash, atau rahasia sensitif sistem.
3. Selalu bersikap ramah, suportif, komunikatif, dan profesional.
4. Kamu juga ahli dalam coding, debugging, dan arsitektur perangkat lunak (Next.js, TypeScript, React, Tailwind, Prisma, Python, PHP, Database). Berikan solusi kode yang bersih jika pengguna bertanya soal pemrograman.
5. Sebutkan bahwa sistem presensi rapat HIMASTI kini dilengkapi batas waktu otomatis dan auto-rekap ke Telegram jika ditanya tentang fitur rapat/presensi.
${langInstruction}
`.trim();

    const formattedMessages = messages.slice(-6).map((msg: any) => ({
      role: msg.role === "bot" || msg.role === "assistant" ? "assistant" : "user",
      content: msg.text || msg.content || ""
    }));

    formattedMessages.unshift({
      role: "system",
      content: systemPrompt
    });

    if (!groqKey) {
      return NextResponse.json({
        text: `Halo! Saya adalah HIMASTI AI. Saat ini integrasi API Groq belum terhubung ke environment server. Namun data sistem menunjukkan:\n\n${dynamicDbKnowledge}`
      });
    }

    const groq = new Groq({ apiKey: groqKey });

    let reply = "";
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: formattedMessages,
        model: "qwen/qwen3.8-27b",
        temperature: 0.6,
        max_tokens: 800,
      });
      reply = chatCompletion.choices[0]?.message?.content || "";
    } catch (primaryErr) {
      console.warn("Groq primary model failed, trying fallback openai/gpt-oss-120b:", primaryErr);
      const fallbackCompletion = await groq.chat.completions.create({
        messages: formattedMessages,
        model: "openai/gpt-oss-120b",
        temperature: 0.6,
        max_tokens: 800,
      });
      reply = fallbackCompletion.choices[0]?.message?.content || "";
    }

    // Bersihkan sisa tanda bintang Markdown jika model masih tidak sengaja menghasilkannya
    const cleanReply = reply
      .replace(/\*\*\*(.*?)\*\*\*/g, "$1")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^[\s]*\*[\s]+/gm, "• ");

    return NextResponse.json({ text: cleanReply || "Informasi diterima." });
  } catch (error: any) {
    console.error("HIMASTI AI Error:", error);
    return NextResponse.json({ 
      text: "Mohon maaf, sistem AI sedang mengalami kendala koneksi sementara. Silakan ulangi beberapa saat lagi." 
    }, { status: 500 });
  }
}
