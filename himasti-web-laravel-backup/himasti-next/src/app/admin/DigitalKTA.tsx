"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Command } from "lucide-react";

export default function DigitalKTA({ 
  name, nim, email, angkatan 
}: { 
  name: string, nim: string, email: string, angkatan: string 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const qrValue = JSON.stringify({ type: "himasti_kta", nim, name });

  return (
    <div 
      className="perspective-1000 flex items-center justify-center w-full relative group"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full relative aspect-[1.6/1] rounded-xl overflow-hidden cursor-crosshair border border-slate-200 bg-white p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow duration-300 flex flex-col justify-between"
      >
        {/* Subtle Glare - using strict white/gray instead of glowing neon */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 rounded-xl"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
            left: glareX,
            top: glareY,
            transform: "translate(-50%, -50%)",
            width: "200%",
            height: "200%",
            mixBlendMode: "soft-light"
          }}
        />

        {/* Top Header */}
        <div className="flex justify-between items-start w-full relative z-10" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-md">
              <Command className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 tracking-tight leading-none text-sm md:text-base">HIMASTI</div>
              <div className="text-[10px] text-slate-500 font-mono tracking-widest mt-0.5 uppercase">Member Card</div>
            </div>
          </div>
          <div className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">
            ACTIVE
          </div>
        </div>

        {/* Middle Content */}
        <div className="flex gap-4 items-end justify-between w-full relative z-10 mt-6" style={{ transform: "translateZ(30px)" }}>
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-1">IDENTITAS</div>
              <div className="text-xl md:text-2xl font-bold text-slate-900 leading-none truncate w-full">{name}</div>
            </div>
            
            <div className="flex gap-6">
              <div>
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-0.5">NIM</div>
                <div className="text-sm font-mono font-bold text-slate-700">{nim}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-0.5">ANGKATAN</div>
                <div className="text-sm font-mono font-bold text-slate-700">{angkatan}</div>
              </div>
            </div>
          </div>

          <div className="p-2 border border-slate-200 rounded-lg bg-white shrink-0" style={{ transform: "translateZ(40px)" }}>
            <QRCodeSVG value={qrValue} size={72} level="H" />
          </div>
        </div>

        {/* Footer */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end border-t border-slate-100 pt-3 relative z-10 gap-2 mt-4" style={{ transform: "translateZ(10px)" }}>
          <div className="text-[10px] text-slate-500 font-mono truncate w-full max-w-[200px]">{email}</div>
          <div className="text-[10px] text-slate-400 font-mono uppercase shrink-0">ID-{nim.substring(0,8)}</div>
        </div>
      </motion.div>
    </div>
  );
}
