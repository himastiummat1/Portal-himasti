"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { updateProfil, changePassword, saveCustomization, buyCosmetic, equipCosmetic } from "./actions";
import { 
  User, Lock, Save, AlertCircle, CheckCircle2, Crown, Shield, 
  Terminal, Sparkles, Zap, Cpu, Palette, Trophy, Check, 
  ArrowRight, CreditCard, Flame, QrCode, Star, ShoppingCart
} from "lucide-react";
import confetti from "canvas-confetti";
import { 
  FRAMES, TITLES, THEMES, NAME_EFFECTS, 
  UserCustomization, DEFAULT_CUSTOMIZATION, CosmeticItem 
} from "@/lib/profileCustomization";
import { challengesData } from "../challenge/challengesData";
import { CosmeticAvatar, getThemeClasses, getNameClasses } from "@/components/profile/CosmeticAvatar";
import DigitalKTA from "../DigitalKTA";

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
  xp?: number;
  custom_frame?: string;
  custom_title?: string;
  custom_theme?: string;
  custom_name_effect?: string;
  solved_challenges?: string[];
  owned_cosmetics?: string[];
};

export default function ProfilClient({ initialData }: { initialData: ProfileData }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [pwdMessage, setPwdMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<"edit" | "studio" | "kta">("edit");
  const [cosmeticCategory, setCosmeticCategory] = useState<"frame" | "title" | "theme" | "nameEffect">("frame");

  // User XP and Solved challenges from PostgreSQL Database
  const [userXp, setUserXp] = useState<number>(initialData.xp ?? 50);
  const [solvedCount, setSolvedCount] = useState<number>(initialData.solved_challenges?.length || 0);

  // Equipped Customization State from PostgreSQL Database
  const initialCustom: UserCustomization = {
    frameId: initialData.custom_frame || "none",
    titleId: initialData.custom_title || "kader",
    themeId: initialData.custom_theme || "default",
    nameEffectId: initialData.custom_name_effect || "plain"
  };

  const [equippedStyle, setEquippedStyle] = useState<UserCustomization>(initialCustom);
  const [previewStyle, setPreviewStyle] = useState<UserCustomization>(initialCustom);
  const [ownedCosmetics, setOwnedCosmetics] = useState<string[]>(
    initialData.owned_cosmetics || ["none", "kader", "default", "plain"]
  );
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  const isSuper = initialData.isSuperAdmin;

  // Sync with client-side cache as backup
  useEffect(() => {
    try {
      const savedSolved = localStorage.getItem("himasti_solved_challenges");
      if (savedSolved) {
        const parsed = JSON.parse(savedSolved);
        if (parsed.length > solvedCount) {
          setSolvedCount(parsed.length);
        }
      }
    } catch (e) {}
  }, [solvedCount]);

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

  // Buy cosmetic with XP
  const handleBuyCosmetic = async (category: "frame" | "title" | "theme" | "nameEffect", item: CosmeticItem) => {
    if (userXp < item.minXp && !isSuper) {
      alert(`XP Anda tidak mencukupi! Butuh ${item.minXp} XP, saat ini Anda memiliki ${userXp} XP.`);
      return;
    }

    setPurchaseLoading(item.id);
    try {
      const res = await buyCosmetic(item.id, category);
      if (res.success) {
        if (typeof res.newXp === "number") {
          setUserXp(res.newXp);
        }
        const updatedOwned = Array.from(new Set([...ownedCosmetics, item.id]));
        setOwnedCosmetics(updatedOwned);

        // Auto-equip the purchased item
        const updated: UserCustomization = {
          ...previewStyle,
          ...(category === "frame" ? { frameId: item.id } : {}),
          ...(category === "title" ? { titleId: item.id } : {}),
          ...(category === "theme" ? { themeId: item.id } : {}),
          ...(category === "nameEffect" ? { nameEffectId: item.id } : {})
        };
        setPreviewStyle(updated);
        setEquippedStyle(updated);
        localStorage.setItem("himasti_user_customization", JSON.stringify(updated));
        triggerSparks();
      } else {
        alert(res.error || "Gagal melakukan pembelian item.");
      }
    } catch (e) {
      alert("Terjadi kesalahan saat memproses transaksi XP.");
    } finally {
      setPurchaseLoading(null);
    }
  };

  // Equip an already owned cosmetic item
  const handleEquipCosmetic = async (category: "frame" | "title" | "theme" | "nameEffect", itemId: string) => {
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

    await equipCosmetic(itemId, category);
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

  const isDarkCard = isSuper || previewStyle.themeId !== "default";

  return (
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 animate-in fade-in duration-500 pb-12" suppressHydrationWarning>
      {/* Header with User Level & XP Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/10 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-widest text-cyan-300 mb-2 sm:mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> KARTU KADER HIMASTI
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white flex flex-wrap items-center gap-2">
            <span>Profil & Identitas Digital</span>
            {isSuper && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 text-white shadow-sm animate-holo-text">
                <Crown className="w-3 h-3" /> ROOT ADMIN
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Kustomisasi gaya avatar, gelar kehormatan, dan kartu anggota dengan XP yang kamu raih!
          </p>
        </div>

        {/* XP Point Balance Badge */}
        <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/15 flex items-center justify-between gap-3 shrink-0 w-full md:w-auto">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shrink-0">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-300 uppercase tracking-wider block">Saldo Poin</span>
              <span className="text-base sm:text-lg font-black text-amber-300 block">{userXp} XP</span>
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-300 block truncate">{solvedCount} Tantangan Selesai</span>
            </div>
          </div>

          <Link
            href="/admin/challenge"
            className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 shrink-0"
          >
            <span>Cari XP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Feature Tabs - Full Width Mobile Responsive */}
      <div className="w-full flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveMainTab("edit")}
          className={`flex-1 min-w-[95px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeMainTab === "edit" 
              ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-4 h-4 shrink-0 text-slate-700" />
          <span className="whitespace-nowrap sm:hidden">Akun</span>
          <span className="whitespace-nowrap hidden sm:inline">Informasi Akun</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab("studio")}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeMainTab === "studio" 
              ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Palette className="w-4 h-4 shrink-0 text-violet-600" />
          <span className="whitespace-nowrap sm:hidden">Studio XP</span>
          <span className="whitespace-nowrap hidden sm:inline">Studio Gaya & Toko XP</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[9px] font-mono font-bold tracking-wide shrink-0">BARU</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab("kta")}
          className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeMainTab === "kta" 
              ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <CreditCard className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="whitespace-nowrap">KTA Digital</span>
        </button>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-start">
        
        {/* LEFT COLUMN: LIVE PREVIEW PROFILE CARD (1 Col) */}
        <div className="col-span-1 space-y-3 sm:space-y-4">
          
          <div className={`p-5 sm:p-6 relative overflow-hidden transition-all duration-300 rounded-3xl ${getThemeClasses(previewStyle.themeId, isSuper)}`}>
            
            {/* Static Subtle Background Accents */}
            {isDarkCard && (
              <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-10" />
            )}

            {/* Super Admin Ambient Elements if Root */}
            {isSuper && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 shadow-[0_0_15px_#22d3ee]" />
                <div 
                  className="absolute -top-12 -right-12 w-36 h-36 rounded-full" 
                  style={{ background: "radial-gradient(circle, rgba(244,63,94,0.2) 0%, transparent 70%)" }}
                />
                <div 
                  className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full" 
                  style={{ background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)" }}
                />
              </div>
            )}

            {/* Avatar Section with Equipped Frame */}
            <div className="relative z-10 flex flex-col items-center">
              
              <div 
                onClick={triggerSparks}
                className="cursor-pointer group/avatar mb-3 sm:mb-4"
                title="Klik avatar untuk percikan spark ⚡"
              >
                <CosmeticAvatar name={initialData.name} frameId={previewStyle.frameId} size="lg" />
              </div>

              {/* Name & Custom Title */}
              <div className="text-center mb-4 sm:mb-6 w-full">
                <h3 className={`text-base sm:text-lg leading-tight truncate ${getNameClasses(previewStyle.nameEffectId, isSuper, previewStyle.themeId)}`}>
                  {initialData.name}
                </h3>
                
                {/* Custom Title Badge */}
                <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 max-w-full truncate">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                  <span className="truncate">{currentTitle.name}</span>
                </div>

                <p className={`text-[11px] font-mono mt-1 ${isDarkCard ? 'text-slate-400' : 'text-gray-500'}`}>
                  {initialData.roles}
                </p>
              </div>
            </div>
            
            {/* Meta Data Grid - 3 cols on mobile, stacked list on desktop */}
            <div className={`grid grid-cols-3 md:grid-cols-1 gap-2 md:space-y-3 md:gap-0 text-xs relative z-10 ${isDarkCard ? 'text-slate-300' : 'text-slate-600'}`}>
              <div className={`p-2 sm:p-2.5 md:p-0 md:bg-transparent rounded-xl border md:border-0 text-center md:text-left ${isDarkCard ? 'bg-slate-900/60 border-slate-800/80' : 'bg-gray-50/80 border-gray-100'}`}>
                <label className={`block text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5 md:mb-1 ${isDarkCard ? 'text-slate-400' : 'text-gray-400'}`}>NIM</label>
                <div className={`font-mono text-[11px] sm:text-xs md:px-3 md:py-1.5 md:rounded-xl md:border truncate ${
                  isDarkCard 
                    ? 'md:bg-slate-900/80 md:border-slate-800 text-cyan-300 font-semibold' 
                    : 'md:bg-gray-50 md:border-gray-100 text-gray-900'
                }`}>
                  {initialData.nim}
                </div>
              </div>

              <div className={`p-2 sm:p-2.5 md:p-0 md:bg-transparent rounded-xl border md:border-0 text-center md:text-left ${isDarkCard ? 'bg-slate-900/60 border-slate-800/80' : 'bg-gray-50/80 border-gray-100'}`}>
                <label className={`block text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5 md:mb-1 ${isDarkCard ? 'text-slate-400' : 'text-gray-400'}`}>Angkatan</label>
                <div className={`font-mono text-[11px] sm:text-xs md:px-3 md:py-1.5 md:rounded-xl md:border truncate ${
                  isDarkCard 
                    ? 'md:bg-slate-900/80 md:border-slate-800 text-slate-200' 
                    : 'md:bg-gray-50 md:border-gray-100 text-gray-900'
                }`}>
                  {initialData.angkatan}
                </div>
              </div>

              <div className={`p-2 sm:p-2.5 md:p-0 md:bg-transparent rounded-xl border md:border-0 text-center md:text-left ${isDarkCard ? 'bg-slate-900/60 border-slate-800/80' : 'bg-gray-50/80 border-gray-100'}`}>
                <label className={`block text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5 md:mb-1 ${isDarkCard ? 'text-slate-400' : 'text-gray-400'}`}>Status</label>
                <div className={`font-mono text-[11px] sm:text-xs md:px-3 md:py-1.5 md:rounded-xl md:border truncate ${
                  isDarkCard 
                    ? 'md:bg-slate-900/80 md:border-slate-800 text-emerald-400 font-semibold' 
                    : 'md:bg-gray-50 md:border-gray-100 text-gray-900'
                }`}>
                  {initialData.status_kaderisasi}
                </div>
              </div>
            </div>

            {/* Telemetry / XP Bar */}
            <div className={`mt-4 sm:mt-6 pt-3 sm:pt-4 border-t ${isDarkCard ? 'border-slate-800 text-slate-400' : 'border-gray-100 text-slate-500'} relative z-10 flex items-center justify-between text-[11px] font-mono`}>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{userXp} XP</span>
              </span>
              <span className="text-emerald-500 font-bold text-[10px] tracking-wider">AKTIF</span>
            </div>

          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Gaya yang kamu pasang di sini akan otomatis tampil di kartu KTA digital dan papan peringkat Dewa Kode!
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: TABBED VIEWS (2 Cols) */}
        <div className="col-span-1 md:col-span-2 space-y-5 sm:space-y-6">
          
          {/* TAB 1: STUDIO GAYA & TOKO XP */}
          {activeMainTab === "studio" && (
            <div className="bg-white border border-gray-200 rounded-3xl p-4 sm:p-7 shadow-sm space-y-5 sm:space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-violet-600 shrink-0" />
                    <span>Studio Kustomisasi Visual</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pilih bingkai avatar, gelar, tema, dan efek nama yang sesuai dengan seleramu!
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 bg-violet-50 text-violet-800 rounded-xl border border-violet-100 w-fit shrink-0">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>XP Kamu: {userXp}</span>
                </div>
              </div>

              {/* Sub Category Tabs - Clean 4-Col Grid on Mobile */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                {[
                  { id: "frame", label: "Bingkai", fullLabel: "Bingkai Avatar" },
                  { id: "title", label: "Gelar", fullLabel: "Gelar Kehormatan" },
                  { id: "theme", label: "Tema", fullLabel: "Tema Kartu" },
                  { id: "nameEffect", label: "Efek Nama", fullLabel: "Efek Tipografi" }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCosmeticCategory(cat.id as any)}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center truncate ${
                      cosmeticCategory === cat.id
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <span className="sm:hidden">{cat.label}</span>
                    <span className="hidden sm:inline">{cat.fullLabel}</span>
                  </button>
                ))}
              </div>

              {/* Item Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {(cosmeticCategory === "frame" ? FRAMES :
                  cosmeticCategory === "title" ? TITLES :
                  cosmeticCategory === "theme" ? THEMES : NAME_EFFECTS
                ).map(item => {
                  const isDefault = item.minXp === 0;
                  const isOwned = isDefault || isSuper || ownedCosmetics.includes(item.id);
                  const isEquipped = (
                    (cosmeticCategory === "frame" && equippedStyle.frameId === item.id) ||
                    (cosmeticCategory === "title" && equippedStyle.titleId === item.id) ||
                    (cosmeticCategory === "theme" && equippedStyle.themeId === item.id) ||
                    (cosmeticCategory === "nameEffect" && equippedStyle.nameEffectId === item.id)
                  );
                  const canAfford = userXp >= item.minXp || isSuper;
                  const isLoading = purchaseLoading === item.id;

                  return (
                    <div 
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isEquipped 
                          ? "bg-violet-50/70 border-violet-300 ring-2 ring-violet-500/20 shadow-sm" 
                          : isOwned 
                          ? "bg-emerald-50/30 border-emerald-200/80 hover:border-emerald-300 hover:shadow-sm" 
                          : canAfford 
                          ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm" 
                          : "bg-slate-50/80 border-slate-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                            {isEquipped ? (
                              <span className="px-2 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs">
                                <Check className="w-3 h-3" /> DIPASANG
                              </span>
                            ) : isOwned ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-200">
                                <Sparkles className="w-3 h-3" /> DIMILIKI
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                        </div>

                        {!isOwned && !canAfford && (
                          <div className="p-1.5 rounded-lg bg-slate-200 text-slate-500 shrink-0" title="XP Belum Cukup">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-xs">
                        <span className="font-mono text-slate-500 font-bold">
                          {isDefault ? "Gratis" : `${item.minXp} XP`}
                        </span>

                        {isEquipped ? (
                          <div className="px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 bg-violet-100 text-violet-800 cursor-default">
                            <Check className="w-3.5 h-3.5 text-violet-700" />
                            <span>Terpasang</span>
                          </div>
                        ) : isOwned ? (
                          <button
                            type="button"
                            onClick={() => handleEquipCosmetic(cosmeticCategory, item.id)}
                            className="px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-95"
                          >
                            <span>Gunakan</span>
                          </button>
                        ) : canAfford ? (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleBuyCosmetic(cosmeticCategory, item)}
                            className="px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 text-slate-950" />
                            <span>{isLoading ? "Membeli..." : `Beli (${item.minXp} XP)`}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-mono text-rose-500 font-bold">
                            Kurang {item.minXp - userXp} XP
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
            <div className="bg-white border border-gray-200 rounded-3xl p-4 sm:p-7 shadow-sm space-y-5 sm:space-y-6 animate-in zoom-in-95 duration-200">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Kartu Tanda Anggota (KTA Digital HIMASTI)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  KTA ini berlaku sebagai tanda pengenal resmi saat presensi acara, musyawarah, dan peminjaman inventaris. Dilengkapi hologram 3D interaktif.
                </p>
              </div>

              {/* Digital Card Preview Canvas */}
              <div className="max-w-xl mx-auto w-full">
                <DigitalKTA
                  name={initialData.name}
                  nim={initialData.nim || "KADER-GUEST"}
                  email={initialData.email}
                  angkatan={initialData.angkatan || new Date().getFullYear().toString()}
                  frameId={previewStyle.frameId}
                  title={currentTitle.name}
                  nameEffectId={previewStyle.nameEffectId}
                  themeId={previewStyle.themeId}
                />
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/absen"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95 w-full sm:w-auto"
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
