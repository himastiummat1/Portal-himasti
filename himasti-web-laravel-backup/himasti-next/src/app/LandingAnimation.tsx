"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Terminal, Database, Code2, Server, Menu, Loader2, Send } from "lucide-react";
import CompetitionMarquee from "./CompetitionMarquee";

export default function LandingAnimation({ competitions }: { competitions?: any[] }) {

  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Halo! Saya AI Asisten HIMASTI. Ada yang bisa saya bantu tentang organisasi atau kampus?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat count from localStorage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem('himasti_chat_count');
    if (savedCount) {
      setChatCount(parseInt(savedCount, 10));
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (chatCount >= 5) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', text: userMsg }] })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
      
      const newCount = chatCount + 1;
      setChatCount(newCount);
      localStorage.setItem('himasti_chat_count', newCount.toString());
      
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Maaf, koneksi ke server AI terputus.' }]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white relative text-gray-900 font-sans antialiased overflow-x-hidden selection:bg-gray-200">
      
      {/* Subtle Future Tech Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
      </div>

      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-medium text-lg tracking-tight">
            <div className="text-blue-600 font-bold text-xl tracking-tighter">HIMASTI</div>
            <span className="text-gray-400">Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="h-10 flex items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
              Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full pt-20 pb-0 px-6 relative flex flex-col items-center text-center">
        
        <h1 className="text-5xl sm:text-6xl font-medium tracking-tight text-gray-900 mb-6">
          HIMASTI 2.0
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Portal Ekosistem Digital HIMASTI adalah platform terdedikasi Anda untuk berkolaborasi. Orkestrasikan berbagai divisi dan program kerja secara paralel dalam satu ruang independen.
        </p>
        
        <Link href="/register" className="h-12 flex items-center justify-center rounded-full bg-black px-8 text-base font-medium text-white hover:bg-gray-800 transition-colors mb-20 shadow-sm">
          Daftar Kader
        </Link>
        
        {/* Interactive Groq Terminal */}
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-gray-50 to-white rounded-t-[40px] border-x border-t border-gray-100 p-4 sm:p-8 pb-0 shadow-[0_-10px_50px_rgba(59,130,246,0.1)] border-blue-100">
          <div className="w-full bg-white rounded-t-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden relative" style={{ height: '400px' }}>
             {/* Terminal Header */}
             <div className="w-full h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 text-xs font-mono text-gray-500 flex items-center gap-2"><Terminal className="w-3 h-3"/> HIMASTI_AI_CORE_v2.0 (Powered by Groq)</div>
             </div>
             
             {/* Chat Window */}
             <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50 text-left">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      <span className="text-xs text-gray-500">AI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
             </div>

             {/* Input Area */}
             <div className="p-3 bg-white border-t border-gray-200 shrink-0">
               {chatCount >= 5 ? (
                 <div className="text-center p-2 text-xs font-medium text-red-500 bg-red-50 rounded-lg">
                   Batas percakapan demo (5/5) telah tercapai. Silakan Login untuk akses penuh.
                 </div>
               ) : (
                 <form onSubmit={handleSend} className="relative flex items-center">
                   <input
                     type="text"
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     disabled={isLoading}
                     placeholder="Tanyakan sesuatu ke AI HIMASTI..."
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                   />
                   <button 
                     type="submit" 
                     disabled={!input.trim() || isLoading}
                     className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                   >
                     <Send className="w-4 h-4" />
                   </button>
                 </form>
               )}
               <div className="text-center mt-2 text-[10px] text-gray-400 font-medium">Sisa Percakapan Demo: {5 - chatCount}/5</div>
             </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-b border-gray-100 bg-white py-4">
        <CompetitionMarquee competitions={competitions || []} />
      </div>

      {/* Divisions Section */}
      <section id="divisions" className="w-full py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-medium tracking-tight mb-4 text-gray-900">Modul Divisi</h2>
            <p className="text-gray-500 text-lg">Infrastruktur utama yang menggerakkan organisasi.</p>
          </div>
          
          <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
            {[
              { name: 'Kemuhammadiyahan', desc: 'Menanamkan nilai-nilai Islam dan moral Kemuhammadiyahan di lingkungan mahasiswa IT. Memastikan setiap langkah organisasi sejalan dengan nilai luhur persyarikatan.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { name: 'Kaderisasi', desc: 'Membentuk jiwa kepemimpinan, soliditas, dan regenerasi kepengurusan himpunan. Membangun pondasi kader yang tangguh dan adaptif terhadap tantangan teknologi.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { name: 'Penelitian & Pengembangan', desc: 'Fokus pada kajian akademik, riset teknologi, dan pengembangan kurikulum (Litbang). Mendorong inovasi dan kompetisi mahasiswa di tingkat nasional.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
              { name: 'Media & Komunikasi', desc: 'Mengelola desain visual, dokumentasi, dan infrastruktur digital HIMASTI (Metkom). Memastikan branding organisasi tampil profesional di dunia maya.', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
              { name: 'Hubungan Masyarakat', desc: 'Menjalin relasi dan kerja sama dengan pihak rektorat, ormawa lain, dan eksternal. Mewakili suara HIMASTI di kancah yang lebih luas.', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
              { name: 'Kewirausahaan', desc: 'Membangun kemandirian finansial organisasi melalui unit usaha dan merchandise. Melatih jiwa entrepreneurship kader IT.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { name: 'Minat dan Bakat', desc: 'Mewadahi dan menyalurkan potensi mahasiswa di bidang olahraga, seni, dan e-sports. Menjaga keseimbangan antara akademik dan kreativitas.', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { name: 'Aksi dan Advokasi', desc: 'Menampung aspirasi mahasiswa dan mengawal isu-isu kebijakan strategis kampus. Garda terdepan dalam memperjuangkan hak mahasiswa.', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' }
            ].map((divisi, i) => (
              <div key={i} className="group flex flex-col sm:flex-row items-center sm:items-start bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-md transition-shadow duration-300 w-full text-left">
                {/* Visual Icon (Left on Desktop, Top on Mobile) */}
                <div className="flex-shrink-0 mb-6 sm:mb-0 sm:mr-8 flex flex-col items-center justify-center w-24 h-24 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-blue-50 transition-colors">
                   <svg className="w-8 h-8 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                     <path strokeLinecap="round" strokeLinejoin="round" d={divisi.icon} />
                   </svg>
                   <div className="mt-2 text-xs font-bold text-gray-400 group-hover:text-blue-400">0{i+1}</div>
                </div>

                {/* Text Content */}
                <div className="flex-1 w-full flex flex-col justify-center h-full">
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">{divisi.name}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm sm:text-base">{divisi.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
          <div className="font-medium tracking-tight text-gray-900">
            HIMASTI Portal
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} HIMASTI Digital Ecosystem. All rights reserved.
          </p>
        </div>
      </footer>
      
    </div>
  );
}
