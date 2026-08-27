const fs = require('fs');

const content = fs.readFileSync('src/app/LandingAnimation.tsx', 'utf8');

const replacement = `
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
      setChatCount(prev => prev + 1);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Maaf, koneksi ke server AI terputus.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased overflow-x-hidden selection:bg-gray-200">
      
      {/* Top Navbar */}
      <header className="w-full bg-white">
        <div className="max-w-6xl mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-medium text-lg tracking-tight">
            {/* Logo imitation */}
            <div className="text-blue-500 font-bold text-xl">HIMASTI</div>
            <span className="text-gray-500">Portal</span>
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
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-gray-50 to-white rounded-t-[40px] border-x border-t border-gray-100 p-4 sm:p-8 pb-0 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          <div className="w-full bg-white rounded-t-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden relative" style={{ height: '400px' }}>
             {/* Terminal Header */}
             <div className="w-full h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 text-xs font-mono text-gray-500 flex items-center gap-2"><Terminal className="w-3 h-3"/> HIMASTI_AI_TERMINAL (Powered by Groq)</div>
             </div>
             
             {/* Chat Window */}
             <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50 text-left">
                {messages.map((msg, idx) => (
                  <div key={idx} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
                    <div className={\`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm \${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'}\`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
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
`;

const after = content.split('{/* Marquee */}')[1];

fs.writeFileSync('src/app/LandingAnimation.tsx', replacement + after);
