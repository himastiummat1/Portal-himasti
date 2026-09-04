"use client";
import Image from "next/image";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Command, X, Star, Cpu, Wifi, Sparkles, Smartphone, Download } from "lucide-react";
import { CosmeticAvatar, getNameClasses } from "@/components/profile/CosmeticAvatar";
import WalletPassModal from "./WalletPassModal";

export default function DigitalKTA({ 
  name, nim, email, angkatan,
  frameId = "none",
  title = "Kader Aktif",
  nameEffectId = "plain",
  themeId = "default"
}: { 
  name: string; 
  nim: string; 
  email: string; 
  angkatan: string;
  frameId?: string;
  title?: string;
  nameEffectId?: string;
  themeId?: string;
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 25, mass: 0.5 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 25, mass: 0.5 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateTilt = (clientX: number, clientY: number, targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (!targetRef.current) return;
    const rect = targetRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement | null>) => {
    calculateTilt(e.clientX, e.clientY, targetRef);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (e.touches.length > 0) {
      calculateTilt(e.touches[0].clientX, e.touches[0].clientY, targetRef);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Throttled Gyroscope support for mobile (~30fps limit to avoid JS main thread saturation)
  useEffect(() => {
    let lastTiltTime = 0;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      const now = performance.now();
      if (now - lastTiltTime < 33) return; // limit to ~30Hz update rate
      lastTiltTime = now;
      
      let tiltX = e.gamma / 45; 
      let tiltY = (e.beta - 45) / 45; 
      
      tiltX = Math.max(-1, Math.min(1, tiltX));
      tiltY = Math.max(-1, Math.min(1, tiltY));

      if (typeof window !== 'undefined' && ('ontouchstart' in window)) {
        x.set(tiltX * 0.4);
        y.set(tiltY * 0.4);
      }
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, [x, y]);

  const qrValue = JSON.stringify({ type: "himasti_kta", nim, name });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    if (isZoomed) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; 
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isZoomed]);

  const isMinimalist = !themeId || themeId === "default" || !["dark_obsidian", "cyber_city", "emerald_matrix", "cosmic_violet"].includes(themeId);

  const getThemeGlows = (tId?: string | null) => {
    if (!tId || tId === "default" || !["dark_obsidian", "cyber_city", "emerald_matrix", "cosmic_violet"].includes(tId)) {
      // Clean Minimalist: Elegan & Berstandar Korporat HIMASTI
      return {
        radial1: "none",
        radial2: "none",
        radial3: "none",
        laser: "none",
        border: "border-slate-200/90 dark:border-slate-800 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_35px_-5px_rgba(0,0,0,0.1)]",
        accentColor: "text-blue-600 dark:text-blue-400",
        sparkColor: "transparent"
      };
    }
    switch (tId) {
      case "emerald_matrix":
        return {
          radial1: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.08) 40%, transparent 70%)",
          radial2: "radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 70%)",
          radial3: "radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%)",
          laser: "via-emerald-400 shadow-[0_0_12px_#10b981]",
          border: "border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.25)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)]",
          accentColor: "text-emerald-300",
          sparkColor: "bg-emerald-400 shadow-[0_0_6px_#10b981]"
        };
      case "cosmic_violet":
        return {
          radial1: "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(147,51,234,0.08) 40%, transparent 70%)",
          radial2: "radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)",
          radial3: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          laser: "via-purple-400 shadow-[0_0_12px_#c084fc]",
          border: "border-purple-500/50 shadow-[0_0_35px_rgba(168,85,247,0.25)] hover:shadow-[0_0_50px_rgba(168,85,247,0.4)]",
          accentColor: "text-purple-300",
          sparkColor: "bg-pink-400 shadow-[0_0_6px_#f472b6]"
        };
      case "cyber_city":
        return {
          radial1: "radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)",
          radial2: "radial-gradient(circle, rgba(244,63,94,0.25) 0%, transparent 70%)",
          radial3: "radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)",
          laser: "via-cyan-400 shadow-[0_0_12px_#22d3ee]",
          border: "border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.25)] hover:shadow-[0_0_50px_rgba(6,182,212,0.4)]",
          accentColor: "text-cyan-300",
          sparkColor: "bg-cyan-300 shadow-[0_0_6px_#22d3ee]"
        };
      case "dark_obsidian":
        return {
          radial1: "radial-gradient(circle, rgba(100,116,139,0.25) 0%, transparent 70%)",
          radial2: "radial-gradient(circle, rgba(49,46,129,0.3) 0%, transparent 70%)",
          radial3: "radial-gradient(circle, rgba(148,163,184,0.15) 0%, transparent 70%)",
          laser: "via-slate-300 shadow-[0_0_12px_#cbd5e1]",
          border: "border-slate-700/70 shadow-[0_0_30px_rgba(148,163,184,0.15)] hover:shadow-[0_0_45px_rgba(148,163,184,0.3)]",
          accentColor: "text-slate-300",
          sparkColor: "bg-slate-200 shadow-[0_0_6px_#e2e8f0]"
        };
      default:
        return {
          radial1: "none",
          radial2: "none",
          radial3: "none",
          laser: "none",
          border: "border-slate-200/90 dark:border-slate-800 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_35px_-5px_rgba(0,0,0,0.1)]",
          accentColor: "text-blue-600 dark:text-blue-400",
          sparkColor: "transparent"
        };
    }
  };

  const currentTheme = getThemeGlows(themeId);

  const CardContent = ({ zoomed = false }) => (
    <>
      {/* Background layer */}
      {!isMinimalist ? (
        <>
          {/* 1. ANIMATED CYBER GRID PATTERN */}
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 animate-grid-pan z-0" />

          {/* 2. HOLOGRAPHIC IRIDESCENT FOIL SHIMMER */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-30 animate-holo-foil z-0"
            style={{
              background: "linear-gradient(135deg, rgba(6,182,212,0.25) 0%, rgba(168,85,247,0.2) 25%, rgba(244,63,94,0.2) 50%, rgba(251,191,36,0.25) 75%, rgba(16,185,129,0.25) 100%)"
            }}
          />

          {/* 3. LIGHTWEIGHT LIVING NEBULA & PLASMA GLOWS */}
          <div className="pointer-events-none absolute -top-14 -right-14 w-52 h-52 rounded-full animate-cyber-pulse z-0" style={{ background: currentTheme.radial1 }} />
          <div className="pointer-events-none absolute -bottom-14 -left-14 w-52 h-52 rounded-full animate-cyber-pulse [animation-delay:1.8s] z-0" style={{ background: currentTheme.radial2 }} />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full animate-cyber-pulse [animation-delay:3s] z-0" style={{ background: currentTheme.radial3 }} />

          {/* 4. CONTINUOUS LASER SCANNER */}
          <div className={`pointer-events-none absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent ${currentTheme.laser} to-transparent animate-scan-sweep z-10`} />

          {/* 5. FLOATING CYBER PARTICLES */}
          <div className={`pointer-events-none absolute top-6 right-1/4 w-1.5 h-1.5 rounded-full ${currentTheme.sparkColor} animate-particle-1 z-1`} />
          <div className="pointer-events-none absolute bottom-12 left-1/3 w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#e879f9] animate-particle-2 z-1" />
          <div className="pointer-events-none absolute top-1/2 right-12 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#f59e0b] animate-particle-3 z-1" />

          {/* 6. ROTATING HOLOGRAM WATERMARK */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 w-56 h-56 border border-cyan-400/10 rounded-full animate-holo-watermark flex items-center justify-center z-0">
            <div className="w-44 h-44 border border-dashed border-violet-400/15 rounded-full" />
          </div>
        </>
      ) : (
        <>
          {/* Minimalist Watermark & Subtle Corner Accent */}
          <div className="pointer-events-none absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-gradient-to-tl from-blue-500/5 via-indigo-500/5 to-transparent z-0" />
          <div className="pointer-events-none absolute -left-12 -top-12 w-48 h-48 rounded-full bg-gradient-to-br from-slate-200/40 dark:from-slate-700/20 to-transparent z-0" />
          <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.04] dark:opacity-[0.07] select-none z-0">
            <Image src="/images/logo_himasti.jpg" alt="" width={160} height={160} className="grayscale object-contain" />
          </div>
        </>
      )}

      {/* INTERACTIVE MOUSE / GYROSCOPE GLARE */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        style={{
          background: isMinimalist
            ? "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 60%)"
            : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)",
          left: glareX,
          top: glareY,
          transform: "translate(-50%, -50%)",
          width: "200%",
          height: "200%",
        }}
      />

      {/* CARD CONTENT HEADER */}
      <div className="flex justify-between items-start w-full relative z-10" style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className={`${zoomed ? 'w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl' : 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg'} bg-white flex items-center justify-center shadow-md p-1 overflow-hidden shrink-0 ${isMinimalist ? 'border border-slate-200 dark:border-slate-700' : 'border border-cyan-400/40'}`}>
            <Image src="/images/logo_himasti.jpg" alt="Logo HIMASTI" width={60} height={60} className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className={`font-black tracking-tight leading-none flex items-center gap-1.5 ${isMinimalist ? 'text-slate-900 dark:text-white' : 'text-white'} ${zoomed ? 'text-xl md:text-3xl' : 'text-sm sm:text-base'}`}>
              <span>HIMASTI UMMAT</span>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isMinimalist ? 'bg-blue-600 dark:bg-blue-400' : 'bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]'}`} />
            </div>
            <div className={`${zoomed ? 'text-[10px] md:text-sm mt-1 md:mt-1.5' : 'text-[8px] sm:text-[10px] mt-0.5'} ${isMinimalist ? 'text-slate-500 dark:text-slate-400 font-medium' : 'text-slate-400 font-mono tracking-normal sm:tracking-widest uppercase'} truncate max-w-[170px] sm:max-w-none`}>
              Himpunan Mahasiswa Sistem & Teknologi Informasi
            </div>
          </div>
        </div>

        {/* Live Security Badge */}
        {isMinimalist ? (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full ${zoomed ? 'text-xs md:text-sm px-3.5 py-1.5' : 'text-[8px] sm:text-[9px]'} font-semibold text-emerald-700 dark:text-emerald-300 shadow-2xs shrink-0 ml-2`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>KADER RESMI</span>
          </div>
        ) : (
          <div className={`flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-950/90 border border-emerald-400/40 rounded-full ${zoomed ? 'text-xs md:text-sm px-3.5 py-1.5' : 'text-[8px] sm:text-[9px]'} font-mono font-bold text-emerald-300 tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.25)] shrink-0 ml-2`}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
            </span>
            <span>RESMI • VERIFIED</span>
          </div>
        )}
      </div>

      {/* CARD CONTENT BODY */}
      <div className={`flex ${zoomed ? 'flex-col md:flex-row mt-8 md:mt-auto md:mb-auto' : 'flex-row mt-3 sm:mt-6'} gap-3 sm:gap-4 items-start md:items-end justify-between w-full relative z-10`} style={{ transform: "translateZ(50px)" }}>
        <div className="flex-1 min-w-0 w-full pr-0 md:pr-4">
          <div className="mb-2 sm:mb-4 flex items-center gap-2.5 sm:gap-3 md:gap-5">
            <CosmeticAvatar name={name} frameId={frameId} size={zoomed ? "lg" : "sm"} />

            {/* Smart Holographic IC Chip Graphic */}
            <div className="w-8 h-6 sm:w-10 sm:h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-md border border-amber-300/70 relative overflow-hidden shrink-0 hidden xs:block sm:block">
              <div className="w-full h-full border border-amber-800/40 rounded-xs flex flex-col justify-between p-0.5">
                <div className="flex justify-between h-1">
                  <div className="w-1.5 border-r border-amber-900/40" />
                  <div className="w-1.5 border-l border-amber-900/40" />
                </div>
                <div className="h-1.5 w-2.5 mx-auto rounded-xs bg-amber-300/60 border border-amber-800/50" />
                <div className="flex justify-between h-1">
                  <div className="w-1.5 border-r border-amber-900/40" />
                  <div className="w-1.5 border-l border-amber-900/40" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 animate-gold-sheen pointer-events-none" />
            </div>

            <div className="flex-1 min-w-0">
              <div className={`${zoomed ? 'text-[10px] md:text-sm mb-1 md:mb-2' : 'text-[8px] sm:text-[9px] mb-0.5'} ${isMinimalist ? 'text-blue-600 dark:text-blue-400 font-bold tracking-wider' : 'text-cyan-300/80 font-mono uppercase tracking-widest'} flex items-center gap-1`}>
                <Sparkles className={`w-2.5 h-2.5 ${isMinimalist ? 'text-blue-600 dark:text-blue-400' : 'text-cyan-400'}`} />
                <span>IDENTITAS KADER</span>
              </div>
              <div className={`${zoomed ? 'text-2xl md:text-5xl lg:text-7xl whitespace-normal break-words leading-tight' : 'text-base sm:text-lg truncate leading-tight'} ${getNameClasses(nameEffectId, false, themeId)} ${isMinimalist ? 'text-slate-900 dark:text-white font-extrabold' : ''} w-full`}>
                {name}
              </div>
              {isMinimalist ? (
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 text-[9px] sm:text-[10px] md:text-xs font-semibold truncate max-w-full">
                  <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400 shrink-0" />
                  <span className="truncate">{title}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 sm:px-2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] sm:text-[10px] md:text-xs font-mono font-bold truncate max-w-full shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                  <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-amber-300 text-amber-300 shrink-0" />
                  <span className="truncate">{title}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`flex flex-wrap ${zoomed ? 'gap-8 md:gap-16 mt-6 md:mt-8' : 'gap-3 sm:gap-4 mt-1 sm:mt-2'}`}>
            <div>
              <div className={`${zoomed ? 'text-[10px] md:text-sm mb-1 md:mb-2' : 'text-[8px] sm:text-[9px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>NIM</div>
              <div className={`${zoomed ? 'text-lg md:text-3xl' : 'text-xs sm:text-sm'} font-mono font-bold ${isMinimalist ? 'text-slate-900 dark:text-white' : 'text-cyan-200'} truncate max-w-[120px]`}>{nim}</div>
            </div>
            <div>
              <div className={`${zoomed ? 'text-[10px] md:text-sm mb-1 md:mb-2' : 'text-[8px] sm:text-[9px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>ANGKATAN</div>
              <div className={`${zoomed ? 'text-lg md:text-3xl' : 'text-xs sm:text-sm'} font-mono font-bold ${isMinimalist ? 'text-slate-700 dark:text-slate-300' : 'text-slate-200'}`}>{angkatan}</div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className={`relative p-1.5 sm:p-2 ${isMinimalist ? 'border border-slate-200 dark:border-slate-700 bg-white shadow-sm' : 'border border-cyan-400/40 bg-white shadow-2xl'} shrink-0 flex items-center justify-center rounded-lg sm:rounded-xl overflow-hidden ${zoomed ? 'p-3 md:p-5 rounded-xl md:rounded-2xl w-24 h-24 md:w-[200px] md:h-[200px] self-start md:self-end' : 'w-14 h-14 sm:w-16 sm:h-16'}`} style={{ transform: "translateZ(60px)" }}>
          {!isMinimalist && (
            <>
              {/* Cyber Corner Reticles */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-600 z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-600 z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-600 z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-600 z-20 pointer-events-none" />
              {/* Micro QR Scan Laser */}
              <div className="absolute inset-x-0 h-[1.5px] bg-cyan-500 shadow-[0_0_8px_#06b6d4] animate-scan-sweep pointer-events-none z-10 opacity-70" />
            </>
          )}
          <QRCodeSVG value={qrValue} width="100%" height="100%" level="H" fgColor="#0f172a" />
        </div>
      </div>

      {/* CARD CONTENT FOOTER */}
      <div className={`w-full flex ${zoomed ? 'flex-col md:flex-row mt-6 md:mt-8 pt-4 md:pt-6 gap-3 md:gap-6' : 'flex-row mt-3 sm:mt-4 pt-2 sm:pt-3 gap-2'} justify-between items-start md:items-end ${isMinimalist ? 'border-t border-slate-100 dark:border-slate-800' : 'border-t border-cyan-500/20'} relative z-10`} style={{ transform: "translateZ(20px)" }}>
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className={`flex items-center gap-1 text-[7px] sm:text-[8px] ${isMinimalist ? 'text-slate-600 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80' : 'text-cyan-400 font-mono bg-cyan-950/60 border border-cyan-500/40'} px-1.5 py-0.5 rounded shrink-0`}>
            <Wifi className={`w-2.5 h-2.5 ${isMinimalist ? 'text-slate-500' : 'text-cyan-400 animate-pulse'} shrink-0`} />
            <span>NFC</span>
          </div>
          <div className={`${zoomed ? 'text-xs md:text-lg whitespace-normal break-all' : 'text-[8px] sm:text-[9px] truncate max-w-[130px] sm:max-w-[200px]'} ${isMinimalist ? 'text-slate-500 dark:text-slate-400 font-medium' : 'text-slate-400 font-mono'}`}>{email}</div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full ${isMinimalist ? 'bg-blue-600 dark:bg-blue-400' : 'bg-cyan-400 animate-ping'}`} />
          <div className={`${zoomed ? 'text-xs md:text-lg' : 'text-[8px] sm:text-[9px]'} ${isMinimalist ? 'text-slate-700 dark:text-slate-300 font-mono font-bold' : 'text-cyan-300 font-mono uppercase font-bold tracking-wider'}`}>ID-{nim.substring(0,8)}</div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div 
        className="perspective-1000 flex items-center justify-center w-full relative group"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          ref={ref}
          onClick={() => setIsZoomed(true)}
          onMouseMove={(e) => handleMouseMove(e, ref)}
          onTouchMove={(e) => handleTouchMove(e, ref)}
          onMouseLeave={handleMouseLeave}
          onTouchEnd={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className={`w-full relative min-h-[220px] sm:aspect-[1.6/1] rounded-2xl overflow-hidden cursor-zoom-in ${isMinimalist ? 'bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 text-slate-900 dark:text-white' : 'bg-slate-950 text-white'} p-4 sm:p-5 transition-all duration-500 flex flex-col justify-between select-none ${currentTheme.border}`}
        >
          <CardContent zoomed={false} />
        </motion.div>
      </div>

      {/* Wallet Pass Integration Action Buttons */}
      <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {/* Apple Wallet Button */}
        <button
          type="button"
          onClick={() => setIsWalletOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-950 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl border border-slate-700 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-3.5 h-3.5 fill-current text-white shrink-0" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.97-14.42-6.19-9.58-10.97-20.73-14.33-33.45-3.37-12.72-5.06-24.32-5.06-34.8 0-16.14 4.12-29.62 12.36-40.45 8.24-10.83 18.59-16.36 31.06-16.6 4.79 0 10.13 1.25 16.03 3.76 5.89 2.51 9.77 3.82 11.64 3.93 1.52-.11 5.54-1.47 12.06-4.1 6.52-2.63 12.08-3.79 16.68-3.48 12.92.76 23.36 5.48 31.33 14.16-11.2 6.84-16.67 16.27-16.42 28.29.25 9.57 3.97 17.65 11.16 24.23 7.19 6.58 15.82 10.22 25.88 10.92-2.39 7.5-5.34 15.17-8.86 23.01zm-32.32-108.5c0 6.84-2.58 13.43-7.75 19.77-6.2 7.4-13.71 11.75-22.52 11.05-.13-1.09-.2-2.07-.2-2.94 0-6.84 2.82-13.71 8.46-20.61 2.83-3.48 6.42-6.39 10.77-8.73 4.35-2.34 8.08-3.69 11.19-4.05.08 1.8.05 3.63.05 5.51z" />
          </svg>
          <span>Add to Apple Wallet</span>
        </button>

        {/* Google Wallet Button */}
        <button
          type="button"
          onClick={() => setIsWalletOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
          <span>Save to Google Wallet</span>
        </button>

        {/* Direct Download .pkpass */}
        <a
          href={`/api/kta/wallet?format=pkpass&nim=${encodeURIComponent(nim)}`}
          download={`HIMASTI-KTA-${nim}.pkpass`}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-semibold rounded-xl border border-cyan-200 transition-all"
          title="Download file .pkpass langsung"
        >
          <Download className="w-3.5 h-3.5 text-cyan-700" />
          <span>Unduh .pkpass</span>
        </a>
      </div>

      {/* Wallet Pass Modal */}
      <WalletPassModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        name={name}
        nim={nim}
        angkatan={angkatan}
        title={title}
        email={email}
      />

      {mounted && createPortal(
        <AnimatePresence>
          {isZoomed && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-12 overflow-hidden">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsZoomed(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl cursor-zoom-out"
              />
              
              <div 
                className="relative z-10 w-full max-w-6xl perspective-1000 flex items-center justify-center h-full max-h-[90vh] md:max-h-none"
                style={{ perspective: "2000px" }}
              >
                <div className="absolute -top-12 md:-top-16 right-0 flex items-center gap-2 z-[9999]">
                  <button
                    type="button"
                    onClick={() => setIsWalletOpen(true)}
                    className="px-4 py-2 bg-slate-900/90 border border-slate-700 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xl hover:bg-slate-800 transition-all"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dompet Digital</span>
                  </button>
                  <button 
                    onClick={() => setIsZoomed(false)}
                    className="w-10 h-10 md:w-12 md:h-12 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>

                <motion.div
                  ref={zoomRef}
                  layoutId="kta-card-body"
                  initial={{ scale: 0.8, opacity: 0, y: 40 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 40 }}
                  transition={{ type: "spring", damping: 30, stiffness: 200 }}
                  onMouseMove={(e) => handleMouseMove(e, zoomRef)}
                  onTouchMove={(e) => handleTouchMove(e, zoomRef)}
                  onMouseLeave={handleMouseLeave}
                  onTouchEnd={handleMouseLeave}
                  style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                  }}
                  className={`w-full relative h-full md:h-auto aspect-auto md:aspect-[2/1] lg:aspect-[2.2/1] ${isMinimalist ? 'bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 text-slate-900 dark:text-white' : 'bg-slate-950 text-white'} rounded-[2rem] p-6 md:p-14 transition-all duration-500 flex flex-col justify-between overflow-y-auto overflow-x-hidden md:overflow-visible select-none ${currentTheme.border}`}
                >
                  <CardContent zoomed={true} />
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
