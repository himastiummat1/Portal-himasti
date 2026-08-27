"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RegisterContainer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;

    if (password !== confirm) {
      setError("Password tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" }
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("Terjadi kesalahan pada server (API crash). Silakan coba lagi.");
      }
      if (!res.ok) throw new Error(data.error || "Gagal mendaftar");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-gray-500 mb-8">Akun Anda telah dibuat. Silakan masuk menggunakan email dan password yang baru saja Anda daftarkan.</p>
          <Link href="/login" className="block w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Menuju Halaman Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative z-10 bg-white">
        
        <Link href="/" className="absolute top-8 left-8 sm:left-12 flex items-center text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Portal
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-sm p-1">
              <img src="/images/logo_himasti.jpg" alt="Logo" className="w-full h-full object-contain rounded" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Daftar Akun HIMASTI</h1>
          </div>
          
          <p className="text-gray-500 mb-8 text-sm">
            Buat akun untuk mendapatkan akses ke modul materi, jadwal kajian, dan fitur keanggotaan lainnya.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input name="name" type="text" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm transition-all" placeholder="John Doe" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm transition-all" placeholder="nama@email.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                <input name="nim" type="text" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm transition-all" placeholder="2024..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                <input name="angkatan" type="text" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm transition-all" placeholder="2024" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input name="password" type="password" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm transition-all" placeholder="••••••••" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
              <input name="confirmPassword" type="password" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm transition-all" placeholder="••••••••" />
            </div>

            <button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2 disabled:opacity-70 flex justify-center items-center">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "Buat Akun"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Sudah punya akun? <Link href="/login" className="text-purple-600 font-semibold hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>

      {/* Right Art Side */}
      <div className="hidden lg:flex w-1/2 bg-purple-950 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-lg text-center text-white">
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight">Mulai Perjalanan Akademik Anda</h2>
          <p className="text-purple-200 text-lg leading-relaxed">
            Bergabung dengan ratusan mahasiswa Sistem dan Teknologi Informasi lainnya dalam ekosistem digital HIMASTI.
          </p>
        </div>
      </div>

    </div>
  );
}
