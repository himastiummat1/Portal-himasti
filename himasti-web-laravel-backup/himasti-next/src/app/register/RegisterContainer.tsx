"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterContainer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-16 h-16 text-gray-900" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Pendaftaran Berhasil</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">Akun Anda telah diotorisasi. Silakan masuk menggunakan kredensial yang baru saja Anda daftarkan.</p>
          <Link href="/login" className="flex items-center justify-center w-full bg-black text-white font-medium py-3 rounded-full hover:bg-gray-800 transition-colors">
            Masuk ke Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 relative selection:bg-gray-200">
      
      <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Portal
      </Link>

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="text-2xl font-bold text-gray-900 tracking-tighter">HIMASTI</div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-medium text-gray-900 tracking-tight">Daftar Akun</h2>
          <p className="mt-2 text-sm text-gray-500">
            Bergabung dengan ekosistem digital HIMASTI.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-200 w-full mb-8">
          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">NAMA LENGKAP</label>
              <input name="name" type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white" placeholder="John Doe" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">EMAIL</label>
              <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white" placeholder="nama@email.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">NIM</label>
                <input name="nim" type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white" placeholder="2024..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">ANGKATAN</label>
                <input name="angkatan" type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white" placeholder="2024" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">PASSWORD</label>
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} required className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">KONFIRMASI PASSWORD</label>
              <div className="relative">
                <input name="confirmPassword" type={showConfirm ? "text" : "password"} required className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-all outline-none bg-gray-50 hover:bg-white focus:bg-white" placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-full transition-colors mt-4 disabled:opacity-50 flex justify-center items-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Inisialisasi Akun"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500">
          Sudah punya akun? <Link href="/login" className="text-gray-900 font-medium hover:underline">Masuk di sini</Link>
        </p>
      </div>

    </div>
  );
}
