"use client";

import React from "react";
import { Crown, Star, Sparkles, Terminal, Flame, Zap } from "lucide-react";
import { FRAMES, TITLES, THEMES, NAME_EFFECTS } from "@/lib/profileCustomization";

interface CosmeticAvatarProps {
  name: string;
  frameId?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function CosmeticAvatar({
  name,
  frameId = "none",
  size = "md",
  className = ""
}: CosmeticAvatarProps) {
  // Size mapping
  const sizeMap = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const avatarUrl = `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(name)}`;

  return (
    <div className={`relative ${currentSize} shrink-0 select-none ${className}`}>
      {/* 1. CYBERPUNK LASER FRAME */}
      {frameId === "cyber_neon" && (
        <>
          {/* Outer high-speed laser streak */}
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-rose-500 animate-laser-spin animate-laser-pulse opacity-90 blur-[2px]" />
          {/* Concentric laser ring */}
          <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-cyan-300 animate-laser-spin [animation-duration:6s]" />
          {/* Orbiting Laser Spark Dot */}
          <div className="absolute -inset-2 rounded-full animate-laser-spin">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-200 shadow-[0_0_10px_#22d3ee] ml-auto mr-1 -mt-0.5" />
          </div>
        </>
      )}

      {/* 2. MATRIX HACKER FRAME */}
      {frameId === "matrix_emerald" && (
        <>
          {/* Radioactive phosphor pulse */}
          <div className="absolute -inset-2 rounded-full animate-matrix-phosphor bg-emerald-500/30 blur-[2px]" />
          {/* Digital Glitch Border */}
          <div className="absolute -inset-1 rounded-full border-2 border-emerald-400 animate-matrix-glitch" />
          {/* Hacker Terminal Code Pill */}
          <div className="absolute -bottom-1 -right-1 z-20 bg-slate-950 text-emerald-400 border border-emerald-500 font-mono font-black text-[8px] px-1 py-0.2 rounded shadow-md">
            01
          </div>
        </>
      )}

      {/* 3. HIMASTI ROYAL GOLD FRAME */}
      {frameId === "royal_gold" && (
        <>
          {/* Rotating 24K Gold Shimmer */}
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-600 animate-royal-shimmer blur-[2px] opacity-90" />
          {/* Inner Golden Border */}
          <div className="absolute -inset-1 rounded-full border-2 border-yellow-300" />
          {/* Floating Crown of Honor */}
          <div className="absolute -top-3.5 -right-2 z-20 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-slate-950 p-1 rounded-full shadow-xl border border-white animate-crown-float">
            <Crown className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
          </div>
          {/* Gold Star Glint */}
          <div className="absolute -bottom-1 -left-1 z-20 text-yellow-300 animate-gold-glint">
            ✦
          </div>
        </>
      )}

      {/* 4. COSMIC NEBULA FRAME */}
      {frameId === "cosmic_nebula" && (
        <>
          {/* Swirling deep space vortex */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-nebula-swirl blur-sm opacity-90" />
          {/* Celestial rings */}
          <div className="absolute -inset-1 rounded-full border border-purple-300/80 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          {/* Orbiting Starlight 1 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-star-orbit">
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]" />
            </div>
          </div>
          {/* Orbiting Starlight 2 (Counter) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-star-orbit-counter">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-300 shadow-[0_0_6px_#f472b6]" />
            </div>
          </div>
        </>
      )}

      {/* 5. API PHOENIX FRAME */}
      {frameId === "flame_phoenix" && (
        <>
          {/* Rising flame aura */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-t from-red-600 via-orange-500 to-amber-300 animate-phoenix-flame blur-[3px] opacity-95" />
          <div className="absolute -inset-1 rounded-full border-2 border-orange-400 shadow-[0_0_18px_#f97316]" />
          {/* Rising Ember 1 */}
          <div className="absolute top-0 right-2 z-20 w-1.5 h-1.5 rounded-full bg-amber-200 animate-ember-1" />
          {/* Rising Ember 2 */}
          <div className="absolute top-1 left-2 z-20 w-1.5 h-1.5 rounded-full bg-red-300 animate-ember-2" />
        </>
      )}

      {/* AVATAR IMAGE */}
      <img
        src={avatarUrl}
        alt={name}
        className={`relative z-10 w-full h-full object-cover rounded-full bg-slate-950 transition-all border-2 ${
          frameId === "matrix_emerald" ? "border-emerald-400" :
          frameId === "royal_gold" ? "border-yellow-200" :
          frameId === "cyber_neon" ? "border-cyan-300" :
          frameId === "cosmic_nebula" ? "border-purple-300" :
          frameId === "flame_phoenix" ? "border-amber-300" : "border-slate-200"
        } shadow-md`}
      />
    </div>
  );
}

/**
 * Card theme CSS classes based on themeId
 */
export function getThemeClasses(themeId: string, isSuper: boolean = false): string {
  if (isSuper && themeId === "default") {
    return "bg-slate-950 text-white border-2 border-violet-500/40 shadow-2xl ring-1 ring-violet-500/20";
  }
  switch (themeId) {
    case "dark_obsidian":
      return "bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white border border-slate-700/80 shadow-2xl";
    case "cyber_city":
      return "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30";
    case "emerald_matrix":
      return "bg-gradient-to-b from-slate-950 via-emerald-950/80 to-slate-950 text-emerald-100 border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30 font-mono";
    case "cosmic_violet":
      return "bg-gradient-to-br from-slate-950 via-purple-950/80 to-slate-950 text-purple-100 border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/30";
    default:
      return "bg-white border border-slate-200/80 text-slate-900 shadow-sm";
  }
}

/**
 * Name typography CSS classes based on effectId
 */
export function getNameClasses(effectId: string, isSuper: boolean = false, themeId: string = "default"): string {
  switch (effectId) {
    case "holo_grad":
      return "bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 bg-clip-text text-transparent font-extrabold animate-holo-text";
    case "gold_shimmer":
      return "bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent font-extrabold animate-gold-sheen";
    case "neon_blue":
      return "text-cyan-300 font-extrabold animate-neon-pulse-text";
    default:
      return (isSuper || themeId !== "default") ? "text-white font-extrabold" : "text-slate-900 font-bold";
  }
}
