"use client";

import { useState, useTransition } from "react";
import { updateProfil, changePassword } from "./actions";
import { User, Lock, Save, AlertCircle, CheckCircle2, Crown, Shield, Terminal, Sparkles, Zap, Cpu } from "lucide-react";
import confetti from "canvas-confetti";

type ProfileData = {
  id: number;
  name: string;
  email: string;
  nim: string;
  angkatan: string;
  no_hp: string;
  jenis_kelamin: string;
  status_kaderisasi: string;
  roles: string;
  isSuperAdmin?: boolean;
};

export default function ProfilClient({ initialData }: { initialData: ProfileData }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [pwdMessage, setPwdMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const isSuper = initialData.isSuperAdmin;

  const triggerSuperAdminSparks = () => {
    if (!isSuper) return;
    try {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([40, 60, 40]);
      }
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.4 },
        colors: ["#38bdf8", "#818cf8", "#f43f5e", "#fbbf24", "#34d399"]
      });
    } catch (_) {}
  };

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setMessage(null);
      const res = await updateProfil(formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Terjadi kesalahan.' });
      }
    });
  };

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      setPwdMessage(null);
      const res = await changePassword(formData);
      if (res.success) {
        setPwdMessage({ type: 'success', text: 'Password berhasil diubah.' });
        form.reset();
      } else {
        setPwdMessage({ type: 'error', text: res.error || 'Terjadi kesalahan.' });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Dynamic Keyframes for Super Admin */}
      <style>{`
        @keyframes cyberScan {
          0% { transform: translateY(-10px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(320px); opacity: 0; }
        }
        @keyframes neonPulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(129, 140, 248, 0.35), 0 0 40px rgba(56, 189, 248, 0.2); }
          50% { box-shadow: 0 0 35px rgba(244, 63, 94, 0.45), 0 0 60px rgba(129, 140, 248, 0.35); }
        }
        @keyframes holoShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-cyber-laser {
          animation: cyberScan 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-neon-pulse {
          animation: neonPulseGlow 4s ease-in-out infinite;
        }
        .animate-holo-text {
          background-size: 200% auto;
          animation: holoShine 4s linear infinite;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2.5">
            <User className="w-7 h-7 text-slate-800" />
            <span>Profil Akun</span>
            {isSuper && (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 text-white shadow-sm animate-holo-text">
                <Crown className="w-3.5 h-3.5" /> SUPER ADMIN
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Kelola informasi data diri, keamanan, dan izin otorisasi akun Anda.</p>
        </div>

        {isSuper && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin [animation-duration:6s]" />
            <span>VIP ARCHITECT MODE: ACTIVE</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Profile Card */}
        <div className="col-span-1 space-y-4">
          
          {/* Super Admin Animated Card vs Regular Card */}
          <div className={`p-6 relative overflow-hidden transition-all duration-300 ${
            isSuper 
              ? 'rounded-3xl bg-slate-900 text-white border border-slate-700 shadow-2xl animate-neon-pulse group' 
              : 'rounded-2xl bg-white border border-gray-200 text-gray-900 shadow-sm'
          }`}>
            
            {/* Super Admin Laser Scan & Cosmic Ambient Glows */}
            {isSuper && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-cyber-laser shadow-[0_0_20px_#22d3ee]" />
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl" />
              </div>
            )}

            {/* Avatar Section */}
            <div className="relative z-10 flex flex-col items-center">
              
              {isSuper ? (
                /* Super Admin Cosmic Laser Avatar */
                <div 
                  onClick={triggerSuperAdminSparks}
                  className="relative w-24 h-24 mb-4 cursor-pointer group/avatar"
                  title="Klik avatar untuk percikan spark ⚡"
                >
                  {/* Spinning Holographic Laser Ring */}
                  <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 via-rose-500 to-amber-400 animate-spin [animation-duration:3s] blur-sm opacity-80 group-hover/avatar:opacity-100 transition-opacity" />
                  <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 animate-spin [animation-duration:3s]" />
                  
                  {/* Floating Gold Crown */}
                  <div className="absolute -top-2.5 -right-2 z-20 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 p-1 rounded-full shadow-lg border-2 border-white animate-bounce [animation-duration:2s]">
                    <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  </div>

                  <img 
                    src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(initialData.name)}`} 
                    alt="Avatar" 
                    className="relative z-10 w-full h-full object-cover rounded-full bg-slate-950 border-2 border-white shadow-xl transition-transform group-hover/avatar:scale-105 active:scale-95" 
                  />
                </div>
              ) : (
                /* Regular Avatar */
                <img 
                  src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(initialData.name)}`} 
                  alt="Avatar" 
                  className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-full mx-auto mb-4" 
                />
              )}

              {/* Name & Role */}
              <div className="text-center mb-6">
                <h3 className={`font-bold text-lg leading-tight ${
                  isSuper 
                    ? 'bg-gradient-to-r from-cyan-300 via-violet-200 to-amber-200 bg-clip-text text-transparent font-extrabold' 
                    : 'text-gray-900'
                }`}>
                  {initialData.name}
                </h3>
                
                {isSuper ? (
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-950/80 border border-violet-500/40 text-violet-300">
                    <Shield className="w-3 h-3 text-cyan-400" />
                    <span>SUPER_ADMIN • ROOT LEVEL 0</span>
                  </div>
                ) : (
                  <p className="text-xs font-mono text-gray-500 mt-1">{initialData.roles}</p>
                )}
              </div>
            </div>
            
            {/* Meta Data Grid */}
            <div className={`space-y-3 text-xs relative z-10 ${isSuper ? 'text-slate-300' : 'text-slate-600'}`}>
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isSuper ? 'text-slate-400' : 'text-gray-400'}`}>NIM Mahasiswa</label>
                <div className={`font-mono px-3 py-1.5 rounded-xl border ${
                  isSuper 
                    ? 'bg-slate-800/80 border-slate-700 text-cyan-300 font-semibold' 
                    : 'bg-gray-50 border-gray-100 text-gray-900'
                }`}>
                  {initialData.nim}
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isSuper ? 'text-slate-400' : 'text-gray-400'}`}>Tahun Angkatan</label>
                <div className={`font-mono px-3 py-1.5 rounded-xl border ${
                  isSuper 
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200' 
                    : 'bg-gray-50 border-gray-100 text-gray-900'
                }`}>
                  {initialData.angkatan}
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isSuper ? 'text-slate-400' : 'text-gray-400'}`}>Status Organisasi</label>
                <div className={`font-mono px-3 py-1.5 rounded-xl border ${
                  isSuper 
                    ? 'bg-slate-800/80 border-slate-700 text-emerald-400 font-semibold' 
                    : 'bg-gray-50 border-gray-100 text-gray-900'
                }`}>
                  {initialData.status_kaderisasi}
                </div>
              </div>
            </div>

            {/* Exclusive Super Admin Live Telemetry HUD */}
            {isSuper && (
              <div className="mt-6 pt-4 border-t border-slate-800 relative z-10 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-cyan-400" /> SYSTEM TELEMETRY
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[10px] font-mono space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>Clearance:</span>
                    <span className="text-rose-400 font-bold">RING_0 (ROOT)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Engine:</span>
                    <span className="text-cyan-400">Supabase 6543</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audit Trail:</span>
                    <span className="text-emerald-400">IMMUTABLE ACTIVE</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* Edit Profile Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-700" /> Informasi Data Pribadi
            </h3>
            
            {message && (
              <div className={`p-3 mb-4 text-sm rounded-xl flex items-start gap-2 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600" /> : <AlertCircle className="w-4 h-4 mt-0.5 text-rose-600" />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Lengkap</label>
                  <input type="text" name="name" defaultValue={initialData.name} required className="w-full text-sm p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-slate-900 bg-gray-50/50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Akun</label>
                  <input type="email" name="email" defaultValue={initialData.email} required className="w-full text-sm p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-slate-900 bg-gray-50/50 focus:bg-white transition-colors" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nomor WhatsApp / HP</label>
                  <input type="text" name="no_hp" defaultValue={initialData.no_hp} className="w-full text-sm p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-slate-900 bg-gray-50/50 focus:bg-white transition-colors font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Jenis Kelamin</label>
                  <select name="jenis_kelamin" defaultValue={initialData.jenis_kelamin} className="w-full text-sm p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-slate-900 bg-gray-50/50 focus:bg-white transition-colors">
                    <option value="">-- Pilih --</option>
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isPending} 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isPending ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-700" /> Pengaturan Kata Sandi
            </h3>

            {pwdMessage && (
              <div className={`p-3 mb-4 text-sm rounded-xl flex items-start gap-2 border ${pwdMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                {pwdMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600" /> : <AlertCircle className="w-4 h-4 mt-0.5 text-rose-600" />}
                {pwdMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password Saat Ini</label>
                <input type="password" name="current_password" required className="w-full text-sm p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-slate-900 bg-gray-50/50 focus:bg-white transition-colors" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password Baru</label>
                  <input type="password" name="new_password" required className="w-full text-sm p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-slate-900 bg-gray-50/50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Konfirmasi Password Baru</label>
                  <input type="password" name="confirm_password" required className="w-full text-sm p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-slate-900 bg-gray-50/50 focus:bg-white transition-colors" />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isPending} 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isPending ? 'Mengubah...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
