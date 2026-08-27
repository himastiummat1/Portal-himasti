"use client";
import { useState } from "react";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginContainer() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-50 relative">
      
      {/* 
        The Login Form (Background Layer / Bottom Layer)
        It slides up from slightly below to center when showLogin is true.
      */}
      <div 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center px-6 py-12 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showLogin ? "translate-y-0 opacity-100 scale-100" : "translate-y-[10%] opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="w-full max-w-sm mx-auto">
          <Link href="/" 
            onClick={() => setShowLogin(false)}
            className="mb-8 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Sambutan
          </Link>

          <div className="flex justify-center mb-8">
            <div className="h-14 w-14 bg-white rounded-xl shadow-sm border border-gray-200 p-1.5 flex items-center justify-center">
              <img src="/images/logo_himasti.jpg" alt="Logo" className="h-full w-auto object-contain rounded-lg" />
            </div>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Selamat Datang</h2>
            <p className="mt-2 text-sm text-gray-500">
              Masuk menggunakan kredensial HIMASTI Anda.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full">
             <LoginForm />
          </div>
        </div>
      </div>

      {/* 
        The Welcome Curtain (Top Layer)
        Starts at 100% height, slides UP completely when showLogin is true.
      */}
      <div 
        className={`absolute top-0 left-0 w-full h-full bg-purple-950 z-20 flex flex-col justify-center items-center p-8 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showLogin ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Dynamic Gradient Background inside Purple Panel */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0019] via-purple-950 to-purple-900 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30 z-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05)_0%,transparent_50%)]"></div>

        {/* Content */}
        <div className={`relative z-10 w-full max-w-2xl flex flex-col items-center text-center transition-all duration-700 ${showLogin ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          
          <div className="h-20 w-20 bg-yellow-400 rounded-2xl p-1 shadow-lg flex items-center justify-center mb-8 border border-yellow-300">
             <img src="/images/logo_himasti.jpg" alt="Logo" className="h-full w-auto object-contain rounded-xl" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Portal Informasi <br/> HIMASTI
          </h1>
          <p className="text-purple-200 text-lg sm:text-xl leading-relaxed mb-12 max-w-lg">
            Sistem informasi manajemen terpadu untuk administrasi, riset, dan publikasi mahasiswa Sistem & Teknologi Informasi.
          </p>

          <Link href="/" 
            onClick={() => setShowLogin(true)}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-purple-950 bg-yellow-400 rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_40px_rgba(250,204,21,0.5)] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Masuk ke Sistem
              <svg className="w-5 h-5 transition-transform group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </span>
          </Link>
          
        </div>
      </div>

    </div>
  );
}
