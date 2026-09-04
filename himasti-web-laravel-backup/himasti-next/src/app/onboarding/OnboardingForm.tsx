"use client";
import { useState } from "react";
import Link from "next/link";
import { submitOnboarding } from "./actions";

export default function OnboardingForm({ userId, defaultName, defaultEmail }: { userId: string, defaultName: string, defaultEmail: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError("Pendaftaran ditolak: Anda wajib menyetujui Ketentuan Layanan & Kebijakan Privasi.");
      return;
    }
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
      <div className="pt-2">
        <div className={`p-3 rounded-xl border transition-all ${
          agreedToTerms 
            ? 'bg-emerald-50/80 border-emerald-300 text-slate-800' 
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <label className="flex items-start gap-2.5 text-xs cursor-pointer select-none">
            <input 
              type="checkbox" 
              name="consent" 
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (error) setError("");
              }}
              required
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer shrink-0 accent-slate-900" 
            />
            <span className="leading-snug">
              Saya telah membaca dan menyetujui <Link href="/terms" target="_blank" className="text-blue-600 font-bold underline underline-offset-2 hover:text-blue-800">Ketentuan Layanan</Link> & <Link href="/privacy" target="_blank" className="text-blue-600 font-bold underline underline-offset-2 hover:text-blue-800">Kebijakan Privasi</Link> HIMASTI UMMAT.
            </span>
          </label>
        </div>
        {!agreedToTerms && (
          <p className="text-[11px] text-amber-600 font-medium mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
            Wajib centang persetujuan untuk masuk ke portal.
          </p>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading || !agreedToTerms} 
        className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? "Menyimpan..." : (agreedToTerms ? "Verifikasi & Masuk Portal" : "Centang Persetujuan untuk Masuk")}
      </button>
    </form>
  );
}
