"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { updateProfil, changePassword } from "./actions";
import { 
  User, Lock, Save, AlertCircle, CheckCircle2, Crown, Shield, 
  Terminal, Sparkles, Zap, Cpu, Palette, Trophy, Check, 
  ArrowRight, CreditCard, Flame, QrCode, Star
} from "lucide-react";
import confetti from "canvas-confetti";
import { 
  FRAMES, TITLES, THEMES, NAME_EFFECTS, 
  UserCustomization, DEFAULT_CUSTOMIZATION, CosmeticItem 
} from "@/lib/profileCustomization";
import { challengesData } from "../challenge/challengesData";

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
  const [activeMainTab, setActiveMainTab] = useState<"edit" | "studio" | "kta">("edit");
  const [cosmeticCategory, setCosmeticCategory] = useState<"frame" | "title" | "theme" | "nameEffect">("frame");

  // User XP from Arena Koding + 50 Base XP for active membership
  const [userXp, setUserXp] = useState<number>(50);
  const [solvedCount, setSolvedCount] = useState<number>(0);

  // Equipped Customization State
  const [equippedStyle, setEquippedStyle] = useState<UserCustomization>(DEFAULT_CUSTOMIZATION);
  const [previewStyle, setPreviewStyle] = useState<UserCustomization>(DEFAULT_CUSTOMIZATION);

  const isSuper = initialData.isSuperAdmin;

  // Load XP & Equipped Customization from localStorage
  useEffect(() => {
    try {
      // 1. Calculate XP from solved challenges
      const savedSolved = localStorage.getItem("himasti_solved_challenges");
      if (savedSolved) {
        const parsed = JSON.parse(savedSolved);
        setSolvedCount(parsed.length);
        const earnedXp = challengesData
          .filter(c => parsed.includes(c.id))
          .reduce((acc, curr) => acc + curr.xp, 0);
        setUserXp(50 + earnedXp); // 50 Base + Solved Challenges
      }

      // 2. Load equipped customization
      const savedCustom = localStorage.getItem("himasti_user_customization");
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        setEquippedStyle(parsed);
        setPreviewStyle(parsed);
      }
    } catch (e) {}
  }, []);

  const triggerSparks = () => {
    try {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([40, 60, 40]);
      }
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.4 },
        colors: ["#38bdf8", "#818cf8", "#f43f5e", "#fbbf24", "#34d399", "#a855f7"]
      });
    } catch (_) {}
  };

  const handleEquipCosmetic = (category: "frame" | "title" | "theme" | "nameEffect", itemId: string) => {
    const updated: UserCustomization = {
      ...previewStyle,
      ...(category === "frame" ? { frameId: itemId } : {}),
      ...(category === "title" ? { titleId: itemId } : {}),
      ...(category === "theme" ? { themeId: itemId } : {}),
      ...(category === "nameEffect" ? { nameEffectId: itemId } : {})
    };

    setPreviewStyle(updated);
    setEquippedStyle(updated);
    localStorage.setItem("himasti_user_customization", JSON.stringify(updated));
    triggerSparks();
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

  // Resolve equipped cosmetic objects
  const currentFrame = FRAMES.find(f => f.id === previewStyle.frameId) || FRAMES[0];
  const currentTitle = TITLES.find(t => t.id === previewStyle.titleId) || TITLES[0];
  const currentTheme = THEMES.find(t => t.id === previewStyle.themeId) || THEMES[0];
  const currentNameEffect = NAME_EFFECTS.find(n => n.id === previewStyle.nameEffectId) || NAME_EFFECTS[0];

  // Card theme classes
  const getThemeClasses = (themeId: string) => {
    if (isSuper && themeId === "default") {
      return "bg-slate-900 text-white border border-slate-700 shadow-2xl animate-neon-pulse";
    }
    switch (themeId) {
      case "dark_obsidian":
        return "bg-slate-950 text-white border border-slate-800 shadow-2xl";
      case "cyber_city":
        return "bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white border border-cyan-500/40 shadow-2xl ring-1 ring-cyan-500/20";
      case "emerald_matrix":
        return "bg-gradient-to-b from-slate-950 via-emerald-950/70 to-slate-950 text-emerald-100 border border-emerald-500/40 shadow-2xl ring-1 ring-emerald-500/20";
      case "cosmic_violet":
        return "bg-gradient-to-b from-slate-950 via-purple-950/70 to-slate-950 text-purple-100 border border-purple-500/40 shadow-2xl ring-1 ring-purple-500/20";
      default:
        return "bg-white border border-gray-200 text-gray-900 shadow-sm";
    }
  };

  // Name Typography classes
  const getNameClasses = (effectId: string) => {
    switch (effectId) {
      case "holo_grad":
        return "bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 bg-clip-text text-transparent font-extrabold animate-holo-text";
      case "gold_shimmer":
        return "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 bg-clip-text text-transparent font-extrabold";
      case "neon_blue":
        return "text-cyan-400 font-extrabold drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]";
      default:
        return isSuper || previewStyle.themeId !== "default" ? "text-white font-extrabold" : "text-gray-900 font-bold";
    }
  };

  const isDarkCard = isSuper || previewStyle.themeId !== "default";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Dynamic Keyframes for Animations */}
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

      {/* Header with User Level & XP Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-mono font-bold tracking-widest text-cyan-300 mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> KARTU KADER HIMASTI
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex flex-wrap items-center gap-2.5">
            <span>Profil & Identitas Digital</span>
            {isSuper && (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 text-white shadow-sm animate-holo-text">
                <Crown className="w-3.5 h-3.5" /> ROOT ADMIN
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Kustomisasi gaya avatar, gelar kehormatan, dan kartu anggota dengan XP yang kamu raih!
          </p>
        </div>

        {/* XP Point Balance Badge */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">Saldo Poin Anda</span>
              <span className="text-lg font-black text-amber-300 block">{userXp} XP</span>
              <span className="text-[11px] font-mono text-slate-300">{solvedCount} Tantangan Terselesaikan</span>
            </div>
          </div>

          <Link
            href="/admin/challenge"
            className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95"
          >
            <span>Cari XP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveMainTab("edit")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeMainTab === "edit" 
              ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Informasi Akun</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab("studio")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeMainTab === "studio" 
              ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Palette className="w-4 h-4 text-violet-600" />
          <span>🎨 Studio Gaya & Toko XP</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">BARU</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab("kta")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeMainTab === "kta" 
              ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <span>KTA Digital</span>
        </button>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: LIVE PREVIEW PROFILE CARD (1 Col) */}
        <div className="col-span-1 space-y-4">
          
          <div className={`p-6 relative overflow-hidden transition-all duration-300 rounded-3xl ${getThemeClasses(previewStyle.themeId)}`}>
            
            {/* Super Admin Ambient Elements if Root */}
            {isSuper && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-cyber-laser shadow-[0_0_20px_#22d3ee]" />
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl" />
              </div>
            )}

            {/* Avatar Section with Equipped Frame */}
            <div className="relative z-10 flex flex-col items-center">
              
              <div 
                onClick={triggerSparks}
                className="relative w-24 h-24 mb-4 cursor-pointer group/avatar"
                title="Klik avatar untuk percikan spark ⚡"
              >
                {/* 1. Cyber Neon Frame */}
                {previewStyle.frameId === "cyber_neon" && (
                  <>
                    <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-spin [animation-duration:3s] blur-sm opacity-80" />
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-spin [animation-duration:3s]" />
                  </>
                )}

                {/* 2. Matrix Emerald Frame */}
                {previewStyle.frameId === "matrix_emerald" && (
                  <div className="absolute -inset-2 rounded-full bg-emerald-500/40 blur-md animate-pulse shadow-[0_0_25px_#10b981]" />
                )}

                {/* 3. Royal Gold Frame with Crown */}
                {previewStyle.frameId === "royal_gold" && (
                  <>
                    <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-spin [animation-duration:4s] blur-sm opacity-90" />
                    <div className="absolute -top-3 -right-2 z-20 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 p-1 rounded-full shadow-lg border-2 border-white animate-bounce [animation-duration:2s]">
                      <Crown className="w-3.5 h-3.5 fill-slate-950" />
                    </div>
                  </>
                )}

                {/* 4. Cosmic Nebula Frame */}
                {previewStyle.frameId === "cosmic_nebula" && (
                  <>
                    <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 animate-spin [animation-duration:5s] blur-md opacity-90" />
                    <div className="absolute -inset-1.5 rounded-full border border-purple-300/60" />
                  </>
                )}

                {/* 5. Flame Phoenix Frame */}
                {previewStyle.frameId === "flame_phoenix" && (
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-t from-red-600 via-orange-500 to-amber-400 blur-sm animate-pulse" />
                )}

                {/* Inner Avatar Image */}
                <img 
                  src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(initialData.name)}`} 
                  alt="Avatar" 
                  className={`relative z-10 w-full h-full object-cover rounded-full bg-slate-950 transition-transform group-hover/avatar:scale-105 active:scale-95 border-2 ${
                    previewStyle.frameId === "matrix_emerald" ? "border-emerald-400" :
                    previewStyle.frameId === "flame_phoenix" ? "border-amber-400" :
                    previewStyle.frameId === "none" ? "border-slate-300" : "border-white"
                  }`} 
                />
              </div>

              {/* Name & Custom Title */}
              <div className="text-center mb-6">
                <h3 className={`text-lg leading-tight ${getNameClasses(previewStyle.nameEffectId)}`}>
                  {initialData.name}
                </h3>
                
                {/* Custom Title Badge */}
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{currentTitle.name}</span>
                </div>

                <p className={`text-[11px] font-mono mt-1 ${isDarkCard ? 'text-slate-400' : 'text-gray-500'}`}>
                  {initialData.roles}
                </p>
              </div>
            </div>
            
            {/* Meta Data Grid */}
            <div className={`space-y-3 text-xs relative z-10 ${isDarkCard ? 'text-slate-300' : 'text-slate-600'}`}>
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isDarkCard ? 'text-slate-400' : 'text-gray-400'}`}>NIM Mahasiswa</label>
                <div className={`font-mono px-3 py-1.5 rounded-xl border ${
                  isDarkCard 
                    ? 'bg-slate-900/80 border-slate-800 text-cyan-300 font-semibold' 
                    : 'bg-gray-50 border-gray-100 text-gray-900'
                }`}>
                  {initialData.nim}
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isDarkCard ? 'text-slate-400' : 'text-gray-400'}`}>Tahun Angkatan</label>
                <div className={`font-mono px-3 py-1.5 rounded-xl border ${
                  isDarkCard 
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200' 
                    : 'bg-gray-50 border-gray-100 text-gray-900'
                }`}>
                  {initialData.angkatan}
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isDarkCard ? 'text-slate-400' : 'text-gray-400'}`}>Status Organisasi</label>
                <div className={`font-mono px-3 py-1.5 rounded-xl border ${
                  isDarkCard 
                    ? 'bg-slate-900/80 border-slate-800 text-emerald-400 font-semibold' 
                    : 'bg-gray-50 border-gray-100 text-gray-900'
                }`}>
                  {initialData.status_kaderisasi}
                </div>
              </div>
            </div>

            {/* Telemetry / XP Bar */}
            <div className={`mt-6 pt-4 border-t ${isDarkCard ? 'border-slate-800 text-slate-400' : 'border-gray-100 text-slate-500'} relative z-10 flex items-center justify-between text-[11px] font-mono`}>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{userXp} XP TERKUMPUL</span>
              </span>
              <span className="text-emerald-500 font-bold">AKTIF</span>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Gaya yang kamu pasang di sini akan otomatis tampil di kartu KTA digital dan papan peringkat Dewa Kode!
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: TABBED VIEWS (2 Cols) */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* TAB 1: STUDIO GAYA & TOKO XP */}
          {activeMainTab === "studio" && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-violet-600" />
                    <span>Studio Kustomisasi Visual</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pilih bingkai avatar, gelar, tema, dan efek nama yang sesuai dengan seleramu!
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 bg-violet-50 text-violet-800 rounded-xl border border-violet-100 w-fit">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>XP Kamu: {userXp}</span>
                </div>
              </div>

              {/* Sub Category Tabs */}
              <div className="flex overflow-x-auto gap-2 p-1 bg-slate-100 rounded-xl w-fit border border-slate-200">
                {[
                  { id: "frame", label: "Bingkai Avatar" },
                  { id: "title", label: "Gelar Kehormatan" },
                  { id: "theme", label: "Tema Kartu" },
                  { id: "nameEffect", label: "Efek Tipografi Nama" }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCosmeticCategory(cat.id as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      cosmeticCategory === cat.id
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Item Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(cosmeticCategory === "frame" ? FRAMES :
                  cosmeticCategory === "title" ? TITLES :
                  cosmeticCategory === "theme" ? THEMES : NAME_EFFECTS
                ).map(item => {
                  const isUnlocked = userXp >= item.minXp;
                  const isEquipped = (
                    (cosmeticCategory === "frame" && equippedStyle.frameId === item.id) ||
                    (cosmeticCategory === "title" && equippedStyle.titleId === item.id) ||
                    (cosmeticCategory === "theme" && equippedStyle.themeId === item.id) ||
                    (cosmeticCategory === "nameEffect" && equippedStyle.nameEffectId === item.id)
                  );

                  return (
                    <div 
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isEquipped 
                          ? "bg-violet-50/60 border-violet-300 ring-2 ring-violet-500/20 shadow-sm" 
                          : isUnlocked 
                          ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm" 
                          : "bg-slate-50/80 border-slate-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                            {isEquipped && (
                              <span className="px-2 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-mono font-bold">
                                DIPASANG
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                        </div>

                        {!isUnlocked && (
                          <div className="p-1.5 rounded-lg bg-slate-200 text-slate-500 shrink-0" title="Terkunci: Kurang XP">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-xs">
                        <span className="font-mono text-slate-400 font-bold">
                          {item.minXp === 0 ? "Gratis" : `${item.minXp} XP`}
                        </span>

                        {isUnlocked ? (
                          <button
                            type="button"
                            onClick={() => handleEquipCosmetic(cosmeticCategory, item.id)}
                            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 active:scale-95 ${
                              isEquipped 
                                ? "bg-emerald-600 text-white cursor-default" 
                                : "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                            }`}
                          >
                            {isEquipped ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Terpasang</span>
                              </>
                            ) : (
                              <span>Gunakan</span>
                            )}
                          </button>
                        ) : (
                          <span className="text-[11px] font-mono text-rose-500 font-bold">
                            Butuh {item.minXp - userXp} XP Lagi
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: EDIT PROFILE FORM */}
          {activeMainTab === "edit" && (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
              
              {/* Edit Profile Form */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-700" /> Informasi Data Pribadi
                </h3>
                
                {message && (
                  <div className={`p-3.5 mb-4 text-xs sm:text-sm rounded-xl flex items-start gap-2 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
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
              <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2.5 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-700" /> Pengaturan Kata Sandi
                </h3>

                {pwdMessage && (
                  <div className={`p-3.5 mb-4 text-xs sm:text-sm rounded-xl flex items-start gap-2 border ${pwdMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
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
          )}

          {/* TAB 3: KTA DIGITAL PREVIEW */}
          {activeMainTab === "kta" && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in zoom-in-95 duration-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Kartu Tanda Anggota (KTA Digital HIMASTI)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  KTA ini berlaku sebagai tanda pengenal resmi saat presensi acara, musyawarah, dan peminjaman inventaris.
                </p>
              </div>

              {/* Digital Card Preview Canvas */}
              <div className="max-w-md mx-auto rounded-3xl p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-2xl border border-slate-700 relative overflow-hidden">
                <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                      H
                    </div>
                    <div>
                      <h4 className="text-xs font-bold tracking-wider uppercase text-white">HIMASTI UMMAT</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Himpunan Mahasiswa Sistem & Teknologi Informasi</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold">
                    RESMI
                  </span>
                </div>

                {/* Body with Avatar */}
                <div className="flex items-center gap-4 py-5">
                  <div className="relative w-16 h-16 shrink-0">
                    {previewStyle.frameId === "royal_gold" && (
                      <div className="absolute -top-2 -right-1 z-20 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 p-0.5 rounded-full border border-white">
                        <Crown className="w-2.5 h-2.5 fill-slate-950" />
                      </div>
                    )}
                    {previewStyle.frameId === "cyber_neon" && (
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 animate-spin [animation-duration:3s]" />
                    )}
                    {previewStyle.frameId === "matrix_emerald" && (
                      <div className="absolute -inset-1 rounded-full bg-emerald-400/80 animate-pulse" />
                    )}
                    <img 
                      src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(initialData.name)}`} 
                      alt="Avatar" 
                      className={`relative z-10 w-full h-full object-cover rounded-full bg-slate-900 border-2 ${
                        previewStyle.frameId === "matrix_emerald" ? "border-emerald-400" :
                        previewStyle.frameId === "royal_gold" ? "border-amber-400" :
                        previewStyle.frameId === "flame_phoenix" ? "border-orange-400" : "border-white/40"
                      } shadow-md`}
                    />
                  </div>
                  <div>
                    <h5 className={`text-base font-black leading-tight ${getNameClasses(previewStyle.nameEffectId)}`}>{initialData.name}</h5>
                    <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-mono text-amber-300 font-bold">
                      <Star className="w-3 h-3 fill-amber-300" />
                      <span>{currentTitle.name}</span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">NIM: {initialData.nim}</p>
                  </div>
                </div>

                {/* Footer Barcode / QR Info */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>ANGKATAN: {initialData.angkatan}</span>
                  <span className="text-cyan-400 font-bold">VALID MEMBERSHIP</span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/absen"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Buka Scanner Presensi & Biometrik →</span>
                </Link>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
