"use client";
import { useState } from "react";
import { submitOnboarding } from "./actions";

export default function OnboardingForm({ userId, defaultName, defaultEmail }: { userId: string, defaultName: string, defaultEmail: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitOnboarding(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="userId" value={userId} />
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input type="text" disabled value={defaultEmail} className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap Kader</label>
        <input type="text" name="name" required defaultValue={defaultName} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">NIM</label>
          <input type="text" name="nim" required placeholder="Contoh: 1210..." className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Angkatan</label>
          <input type="number" name="angkatan" required defaultValue={new Date().getFullYear()} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Setel Password Baru</label>
        <input type="password" name="password" required minLength={6} placeholder="Minimal 6 karakter" className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all mb-1" />
        <p className="text-xs text-slate-500">Password ini akan digunakan saat Anda login secara manual (tanpa Google).</p>
      </div>

      <div className="pt-2">
        <label className="block text-sm font-bold text-slate-900 mb-1">Kode Akses Rahasia 🔒</label>
        <input type="text" name="secret_code" required placeholder="Masukkan kode dari pengurus" className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
      </div>

      <button type="submit" disabled={loading} className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50">
        {loading ? "Menyimpan..." : "Verifikasi & Masuk Portal"}
      </button>
    </form>
  );
}
