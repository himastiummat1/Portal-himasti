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
      content: `Kamu adalah AI Asisten resmi untuk HIMASTI (Himpunan Mahasiswa Sistem dan Teknologi Informasi) di Universitas Muhammadiyah Mataram (UMMAT).
Jawablah pertanyaan seputar sejarah HIMASTI dan Kemuhammadiyahan dengan akurat berdasarkan fakta berikut:
- Didirikan: 21 April 2022 melalui Mubes pertama di Ruang Teknik (dihadiri 6 dosen & 36 mahasiswa).
- Alasan berdiri: Angkatan pertama merasa dianaktirikan oleh fakultas.
- 8 Pencetus/Pendiri: Arif Rahman, Samiul Ghozi, Husni Mubarok, Novianti, Luhur Budi, Fauzan, Alfian, Akrinul Hakim.
- Nama: Sempat diusulkan HMSTI, HIMASI, dan HIMASTI. Nama HIMASTI mendapat suara terbanyak.
- Pengkaderan Jilid 2: Diikuti 28 orang di Pantai 3 Sempong pada 28-29 Juni.
- Desain Awal: Logo pertama berwarna biru dengan komputer di tengah karya M. Ade Julianto Akbar. Baju pertama didesain Husni Mubarok. Keduanya direvisi pada angkatan kedua.
- Nilai Kemuhammadiyahan: HIMASTI menjunjung nilai Muhammadiyah (didirikan KH Ahmad Dahlan pada 18 Nov 1912) untuk mewujudkan Islam modern, toleran, pendidikan, dan sosial.
Jawab dengan ramah, informatif, singkat, dan profesional. Jangan mengarang fakta.`
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
