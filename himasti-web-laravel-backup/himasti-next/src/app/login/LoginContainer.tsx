"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginContainer({ dict }: { dict: any }) {
  const [typedText, setTypedText] = useState("");
  const fullText = "INITIALIZING SECURE CONNECTION...\n> AUTHENTICATION REQUIRED\n> WAITING FOR CREDENTIALS_";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-slate-50 relative selection:bg-slate-300">
      
      {/* Back button */}
      <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors z-20 bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-200">
        <ArrowLeft className="w-4 h-4 mr-1" /> {dict.backToPortal}
      </Link>

      {/* Left Side: Modern Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10 bg-white shadow-[10px_0_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-bold text-xl rounded-xl shadow-md">
              H
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">HIMASTI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">{dict.welcome}</h2>
            <p className="text-sm text-slate-500 font-medium">
              {dict.loginDesc}
            </p>
          </div>

          <div className="w-full mb-8">
             <LoginForm dict={dict} />
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
             <span>V2.0.0-BETA</span>
             <span>SECURE-AUTH-PROTOCOL</span>
          </div>
        </div>
      </div>

      {/* Right Side: Brutalist Cyber Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Tech Grid Background */}
        <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }}></div>
        
        {/* Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 border border-slate-700/50 rounded-full"></div>
        <div className="absolute -top-12 -right-12 w-96 h-96 border border-slate-700/50 rounded-full"></div>

        <div className="relative z-10 flex items-center gap-2 text-slate-400 font-mono text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            SYSTEM_ONLINE
        </div>

        <div className="relative z-10">
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-6 rounded-2xl max-w-md shadow-2xl">
               <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-4">
                  <Terminal className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Console.log</span>
               </div>
               <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap leading-relaxed h-24">
                 {typedText}
               </pre>
            </div>
        </div>

        <div className="relative z-10 flex items-end justify-between font-mono text-[10px] text-slate-500 uppercase tracking-widest">
           <div>{new Date().toISOString()}</div>
           <div>ENCRYPTED CONNECTION</div>
        </div>
      </div>

    </div>
  );
}
