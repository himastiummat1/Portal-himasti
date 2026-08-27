import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  const groq = new Groq({ apiKey: process.env.API_KEY_GROQ || "dummy_key" });
  try {
    const { messages } = await req.json();
    
    if (!process.env.API_KEY_GROQ) {
      return NextResponse.json({ 
        text: "Peringatan: API_KEY_GROQ belum dipasang di file .env!" 
      });
    }

    const formattedMessages = messages.slice(-5).map((msg: any) => ({
      role: msg.role === "bot" ? "assistant" : "user",
      content: msg.text
    }));


    formattedMessages.unshift({
      role: "system",
      content: `Kamu adalah AI Asisten resmi untuk HIMASTI. 
HIMASTI adalah singkatan dari "Himpunan Mahasiswa Sistem dan Teknologi Informasi" di Universitas Muhammadiyah Mataram (UMMAT).
Jika ditanya tentang sejarah atau apa itu HIMASTI, jawablah: HIMASTI adalah organisasi kemahasiswaan intra-kampus yang mewadahi mahasiswa program studi Sistem dan Teknologi Informasi untuk mengembangkan minat, bakat, akademik, dan nilai-nilai Kemuhammadiyahan di bidang teknologi.
Jawab dengan ramah, singkat, dan profesional.`
    });
    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: "qwen/qwen3.8-27b",
      temperature: 0.5,
      max_tokens: 500,
    });

    return NextResponse.json({ text: chatCompletion.choices[0]?.message?.content || "Data diterima." });
    
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ text: "Maaf, sistem AI sedang mengalami gangguan koneksi." }, { status: 500 });
  }
}
