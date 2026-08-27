"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) setError("Kredensial tidak valid.");
      else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) { setError("Terjadi kesalahan sistem."); } 
    finally { setIsLoading(false); }
  };

  return (
    <>
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Email Akun</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="block w-full text-gray-900 bg-white appearance-none rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-600/10 sm:text-sm transition-all"
          placeholder="admin@email.com"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
          <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-600 transition-colors">Lupa sandi?</a>
        </div>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="block w-full text-gray-900 bg-white appearance-none rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-600/10 sm:text-sm transition-all"
          placeholder="••••••••"
        />
      </div>

      <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center rounded-lg bg-purple-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : "Masuk ke Panel"}
      </button>

      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm font-medium leading-6">
          <span className="bg-white px-6 text-gray-400">Atau masuk dengan</span>
        </div>
      </div>

      <button type="button" onClick={() => alert("SSO Google belum diaktifkan")} className="w-full flex justify-center items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-sm font-semibold leading-6">Google Workspace</span>
      </button>
    </form>
    <div className="mt-8 text-center text-sm text-gray-500">
      Belum memiliki akun kader?{' '}
      <Link href="/register" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">
        Daftar Sekarang
      </Link>
    </div>
    </>
  );
}
