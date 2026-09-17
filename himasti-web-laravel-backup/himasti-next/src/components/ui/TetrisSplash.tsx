"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface TetrisSplashProps {
  onComplete?: () => void;
  autoClose?: boolean;
}

export default function TetrisSplash({ onComplete, autoClose = true }: TetrisSplashProps) {
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (autoClose) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, 2600);

      const finishTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3200);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [autoClose, onComplete]);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.05 : 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#050811] text-white select-none overflow-hidden"
    >
      {/* Dynamic Background Atmosphere (Tidak Polos) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.18) 0%, transparent 65%),
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 32px 32px, 32px 32px",
        }}
      />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black pointer-events-none" />

      {/* Stage Tengah */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-md w-full">
        
        {/* LOGO KELEMPAR MASUK DENGAN PERSPEKTIF 3D & EFEK SLAM */}
        <div className="relative mb-6">
          
          {/* Shockwave Ring Saat Logo Menghantam */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 2.2], opacity: [0.9, 0] }}
            transition={{ delay: 0.35, duration: 0.8, ease: "easeOut" }}
            className="absolute -inset-4 rounded-full border border-purple-400/60 pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 1.6], opacity: [0.6, 0] }}
            transition={{ delay: 0.42, duration: 0.7, ease: "easeOut" }}
            className="absolute -inset-4 rounded-full border border-indigo-400/40 pointer-events-none"
          />

          {/* Logo Container yang Dilempar Keras dari Depan */}
          <motion.div
            initial={{ 
              scale: 3.5, 
              y: -140, 
              rotate: -28, 
              opacity: 0, 
              filter: "blur(14px)" 
            }}
            animate={{ 
              scale: 1, 
              y: 0, 
              rotate: 0, 
              opacity: 1, 
              filter: "blur(0px)" 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 380, 
              damping: 18, 
              mass: 1.1,
              delay: 0.1 
            }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900/90 border border-slate-700/80 p-4 shadow-2xl flex items-center justify-center relative backdrop-blur-md"
          >
            {/* Glow Aura di belakang logo */}
            <div className="absolute inset-0 rounded-3xl bg-purple-600/20 blur-xl -z-10" />
            
            <Image
              src="/icons/icon-192x192.png"
              alt="HIMASTI Logo"
              width={100}
              height={100}
              className="w-full h-full object-contain drop-shadow-xl"
              priority
            />
          </motion.div>
        </div>

        {/* TYPOGRAPHY BESAR: HIMASTI MELESAT MASUK */}
        <div className="overflow-hidden py-1">
          <motion.h1
            initial={{ y: 60, opacity: 0, scale: 0.85, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ 
              type: "spring", 
              stiffness: 340, 
              damping: 22, 
              delay: 0.4 
            }}
            className="text-5xl sm:text-7xl font-black font-sans tracking-tight text-white drop-shadow-2xl"
          >
            HIMASTI
          </motion.h1>
        </div>

        {/* GARIS AKURASI TEKNIS MEKAR KE SAMPING */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "90px", opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
          className="h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent my-3.5"
        />

        {/* SUBTITLE AKADEMIK MELESAT LEMBUT */}
        <motion.div
          initial={{ y: 20, opacity: 0, letterSpacing: "0.1em" }}
          animate={{ y: 0, opacity: 1, letterSpacing: "0.28em" }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="text-[11px] sm:text-xs font-semibold text-slate-300 uppercase font-mono tracking-[0.28em]">
            UNIVERSITAS MUHAMMADIYAH MATARAM
          </p>
        </motion.div>

        {/* BADGE RESMI ELEGAN */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-purple-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
          <span>SISTEM DIGITAL RESMI</span>
        </motion.div>

      </div>

      {/* Footer Minimalis */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute bottom-6 text-center text-[10px] font-mono text-slate-400 tracking-widest uppercase"
      >
        PORTAL HIMASTI // v2.6.0
      </motion.div>
    </motion.div>
  );
}
