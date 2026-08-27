"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginContainer() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative selection:bg-gray-200">
      
      <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Portal
      </Link>

      <div className="w-full max-w-sm mx-auto p-6">
        <div className="flex justify-center mb-8">
          <div className="text-2xl font-bold text-blue-600 tracking-tighter">HIMASTI</div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-medium text-gray-900 tracking-tight">Selamat Datang</h2>
          <p className="mt-2 text-sm text-gray-500">
            Masuk menggunakan kredensial HIMASTI Anda.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 w-full mb-8">
           <LoginForm />
        </div>
        
        <p className="text-center text-sm text-gray-500">
          Belum memiliki akun? <Link href="/register" className="text-blue-600 font-medium hover:underline">Daftar sekarang</Link>
        </p>
      </div>

    </div>
  );
}
