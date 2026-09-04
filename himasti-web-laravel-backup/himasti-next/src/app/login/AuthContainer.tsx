"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";

export default function AuthContainer({ dict, initialMode = "login" }: { dict: any, initialMode?: "login" | "register" }) {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === "login");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function onRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");

    if (!agreedToTerms) {
      setRegisterError("Pendaftaran ditolak: Anda wajib mencentang persetujuan Ketentuan Layanan & Kebijakan Privasi.");
      setRegisterLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;

    if (password !== confirm) {
      setRegisterError("Password tidak cocok.");
      setRegisterLoading(false);
      return;
    }

    try {
      const payload = {
        ...Object.fromEntries(formData),
        consent: agreedToTerms
      };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      });
      let data;
      try { data = await res.json(); } catch (e) { throw new Error("API crash."); }
      if (!res.ok) throw new Error(data.error || "Gagal mendaftar");
      setRegisterSuccess(true);
    } catch (err: any) {
      setRegisterError(err.message);
    } finally {
      setRegisterLoading(false);
    }
  }

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.4, type: "spring" as const, bounce: 0.2 }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      filter: "blur(4px)",
      transition: { duration: 0.3 }
    })
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative selection:bg-slate-200 p-4 overflow-hidden">
      
      <Link href="/" className="absolute top-6 left-6 flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors z-20">
        <ArrowLeft className="w-4 h-4 mr-1" /> {dict.backToPortal}
      </Link>

      <div className="w-full max-w-sm mx-auto mt-12 md:mt-0 relative">
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

        {/* Dynamic height container for smooth resizing between forms */}
        <div className="relative w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden">
           
           <AnimatePresence mode="wait" initial={false} custom={isLoginMode ? -1 : 1}>
              {isLoginMode ? (
                <motion.div 
                  key="login"
                  custom={-1}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full p-6 sm:p-8"
                >
                   <div className="mb-6 text-center">
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{dict.welcome}</h2>
                      <p className="mt-1 text-sm text-slate-500">{dict.loginDesc}</p>
                   </div>
                   <LoginForm dict={dict} onSwitchToRegister={() => setIsLoginMode(false)} />
                </motion.div>
              ) : (
                <motion.div 
                  key="register"
                  custom={1}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full p-6 sm:p-8"
                >
                   {registerSuccess ? (
                      <div className="text-center py-4">
                         <div className="flex justify-center mb-6">
                           <CheckCircle2 className="w-16 h-16 text-slate-900" strokeWidth={1.5} />
                         </div>
                         <h2 className="text-2xl font-bold text-slate-900 mb-2">Pendaftaran Berhasil</h2>
                         <p className="text-slate-500 mb-8 text-sm leading-relaxed">Akun Anda telah diotorisasi. Silakan masuk.</p>
                         <button onClick={() => { setRegisterSuccess(false); setIsLoginMode(true); }} className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
                           Masuk Sekarang
                         </button>
                      </div>
                   ) : (
                      <>
                         <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{dict.register}</h2>
                            <p className="mt-1 text-sm text-slate-500">Bergabung dengan ekosistem digital.</p>
                         </div>
                         
                         <form onSubmit={onRegisterSubmit} className="space-y-3">
                            {registerError && (
                              <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg text-center font-medium">
                                {registerError}
                              </div>
                            )}
                            <div>
                              <input name="name" type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm outline-none bg-slate-50 hover:bg-white focus:bg-white transition-all" placeholder="Nama Lengkap" />
                            </div>
                            <div>
                              <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm outline-none bg-slate-50 hover:bg-white focus:bg-white transition-all" placeholder="Email / NIM" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <input name="nim" type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm outline-none bg-slate-50 hover:bg-white focus:bg-white transition-all" placeholder="NIM" />
                              <input name="angkatan" type="number" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm outline-none bg-slate-50 hover:bg-white focus:bg-white transition-all" placeholder="Angkatan" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="relative">
                                <input name="password" type={showPassword ? "text" : "password"} required className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm outline-none bg-slate-50 hover:bg-white focus:bg-white transition-all" placeholder="Password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                              <div className="relative">
                                <input name="confirmPassword" type={showConfirm ? "text" : "password"} required className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm outline-none bg-slate-50 hover:bg-white focus:bg-white transition-all" placeholder="Ulangi Password" />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                            <div>
                              <input name="secret_code" type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm font-medium outline-none bg-white transition-all placeholder-slate-400" placeholder="Kode Rahasia Registrasi 🔒" />
                            </div>

                            <div className="pt-1">
                              <div className={`p-3 rounded-xl border transition-all ${
                                agreedToTerms 
                                  ? 'bg-emerald-50/80 border-emerald-300 text-slate-800 shadow-2xs' 
                                  : 'bg-slate-50 border-slate-200 text-slate-600'
                              }`}>
                                <label className="flex items-start gap-2.5 text-xs cursor-pointer select-none text-left">
                                  <input 
                                    type="checkbox" 
                                    name="consent"
                                    id="register-consent"
                                    checked={agreedToTerms}
                                    onChange={(e) => {
                                      setAgreedToTerms(e.target.checked);
                                      if (registerError) setRegisterError("");
                                    }}
                                    required 
                                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer shrink-0 accent-slate-900" 
                                  />
                                  <span className="leading-snug">
                                    Saya telah membaca dan menyetujui <Link href="/terms" target="_blank" className="text-blue-600 font-bold underline underline-offset-2 hover:text-blue-800">Ketentuan Layanan</Link> & <Link href="/privacy" target="_blank" className="text-blue-600 font-bold underline underline-offset-2 hover:text-blue-800">Kebijakan Privasi</Link> pemrosesan data kemahasiswaan HIMASTI UMMAT.
                                  </span>
                                </label>
                              </div>
                              {!agreedToTerms && (
                                <p className="text-[11px] text-amber-600 font-medium mt-1.5 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                                  Centang kotak persetujuan untuk membuka akses pendaftaran.
                                </p>
                              )}
                            </div>

                            <button 
                              type="submit"
                              disabled={registerLoading || !agreedToTerms} 
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-all mt-2 disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center shadow-sm"
                              title={!agreedToTerms ? "Wajib centang persetujuan terlebih dahulu" : "Daftar Akun Sekarang"}
                            >
                              {registerLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                agreedToTerms ? "Daftar Akun Sekarang" : "Centang Persetujuan untuk Masuk"
                              )}
                            </button>
                         </form>

                         <div className="mt-6 text-center text-xs text-slate-500">
                           Sudah punya akun? <button onClick={() => setIsLoginMode(true)} type="button" className="font-bold text-slate-900 hover:underline transition-colors">Masuk di sini</button>
                         </div>
                      </>
                   )}
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        <p className="text-center mt-6 text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-relaxed">
          Sistem Informasi HIMASTI v2.0
        </p>
      </div>
    </div>
  );
}
