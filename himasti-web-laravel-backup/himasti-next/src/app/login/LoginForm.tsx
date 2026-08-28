"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm({ dict, onSwitchToRegister }: { dict: any, onSwitchToRegister?: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">{dict.email}</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="block w-full text-slate-900 bg-slate-50 hover:bg-white focus:bg-white appearance-none rounded-lg border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm transition-all"
          placeholder="admin@email.com"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">{dict.password}</label>
          <a href="#" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">{dict.forgotPass}</a>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
            className="block w-full text-slate-900 bg-slate-50 hover:bg-white focus:bg-white appearance-none rounded-lg border border-slate-200 pl-4 pr-12 py-3 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm transition-all"
            placeholder="••••••••"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : "Login"}
      </button>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs font-medium">
          <span className="bg-white px-4 text-slate-400">Atau daftar / masuk dengan</span>
        </div>
      </div>

      <button type="button" onClick={() => signIn("google", { callbackUrl: "/admin" })} className="w-full flex justify-center items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-all mt-4">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-sm font-semibold leading-6">Google</span>
      </button>
    </form>
    <div className="mt-6 text-center text-xs text-slate-500">
      {dict.noAccount}{' '}
      {onSwitchToRegister ? (
        <button type="button" onClick={onSwitchToRegister} className="font-bold text-slate-900 hover:underline transition-colors">
          {dict.registerNow}
        </button>
      ) : (
        <Link href="/register" className="font-bold text-slate-900 hover:underline transition-colors">
          {dict.registerNow}
        </Link>
      )}
    </div>
    </>
  );
}
