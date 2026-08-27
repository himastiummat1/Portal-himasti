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
      content: "Kamu adalah AI Asisten resmi untuk HIMASTI (Himpunan Mahasiswa). Jawab dengan sangat singkat, ringkas, dan to the point."
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 500,
    });

    return NextResponse.json({ text: chatCompletion.choices[0]?.message?.content || "Data diterima." });
    
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ text: "Maaf, sistem AI sedang mengalami gangguan koneksi." }, { status: 500 });
  }
}
