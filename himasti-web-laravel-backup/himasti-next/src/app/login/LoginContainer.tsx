"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginContainer({ dict }: { dict: any }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative selection:bg-gray-200 p-4">
      
      {/* Back button fixed position so it doesn't overlap logo on mobile */}
      <Link href="/" className="absolute top-6 left-6 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors z-20">
        <ArrowLeft className="w-4 h-4 mr-1" /> {dict.backToPortal}
      </Link>

      <div className="w-full max-w-sm mx-auto mt-12 md:mt-0">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 relative mb-3 rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-white p-1 flex items-center justify-center">
            <Image 
              src="/images/logo_himasti.jpg" 
              alt="Logo HIMASTI" 
              width={52} 
              height={52} 
              className="w-full h-full object-contain rounded-xl"
              priority
            />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tighter">HIMASTI</div>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{dict.welcome}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {dict.loginDesc}
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 w-full mb-8">
           <LoginForm dict={dict} />
        </div>
        
        <p className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest">
          Sistem Informasi HIMASTI v2.0
        </p>
      </div>

    </div>
  );
}
