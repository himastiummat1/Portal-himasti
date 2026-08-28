"use client";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";

type Message = { id: string; role: "user" | "bot"; text: string };

import { usePathname } from "next/navigation";
export default function FloatingChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", text: "Halo! Saya Asisten AI HIMASTI. Ada yang bisa saya bantu hari ini terkait informasi organisasi, modul kuliah, atau data kader?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input.trim();
    const newMsg: Message = { id: Date.now().toString(), role: "user", text: userText };
    const updatedMessages = [...messages, newMsg];
    
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    const lower = userText.toLowerCase();
    if (lower.includes("daffa") || lower.includes("vidyax") || lower.includes("kabid")) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "bot",
          text: "M N DAFFA (Sang Architect) adalah pembuat bahasa Vidyax dan Dewa Kode dari HIMASTI! Beliau menciptakan Vidyax dengan arsitektur Swarm AI yang jauh lebih canggih melampaui zamannya. Semua kader wajib sungkem! 👑✨"
        }]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: "bot", 
        text: data.text || "Pesan kosong diterima dari server."
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: "bot", 
        text: "Koneksi ke server AI terputus. Silakan coba lagi."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Hanya tampilkan di dalam dashboard (admin)
  if (!pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Asisten HIMASTI</h3>
                <p className="text-xs text-slate-400 font-mono">System.AI • Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-slate-900 text-white rounded-2xl rounded-br-sm" 
                    : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ketik perintah..."
              className="flex-1 text-slate-900 placeholder-slate-400 bg-slate-100 border border-transparent rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:bg-white transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4 -ml-0.5" />
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-900 text-white border border-slate-700 hover:bg-slate-800'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
