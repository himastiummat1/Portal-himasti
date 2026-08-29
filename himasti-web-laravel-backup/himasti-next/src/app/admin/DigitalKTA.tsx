"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Hexagon, Sparkles } from "lucide-react";

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

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
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

  // The QR Code contains a JSON string or just the NIM for scanning
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
        className="w-full relative aspect-[1.6/1] rounded-2xl overflow-hidden cursor-crosshair border border-slate-700 shadow-2xl transition-shadow duration-300 group-hover:shadow-[0_0_40px_rgba(14,165,233,0.3)] bg-gradient-to-br from-slate-900 to-black p-5"
      >
        {/* Hologram Glare Effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 rounded-2xl"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)",
            left: glareX,
            top: glareY,
            transform: "translate(-50%, -50%)",
            width: "200%",
            height: "200%",
            mixBlendMode: "overlay"
          }}
        />

        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" style={{ transform: "translateZ(-10px)" }}></div>
        
        {/* Top Header */}
        <div className="flex justify-between items-start relative z-10" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center gap-2">
            <Hexagon className="w-6 h-6 text-sky-400 fill-sky-400/20" />
            <div className="font-black text-white tracking-tight uppercase leading-none">
              HIMASTI
              <span className="block text-[8px] text-sky-400 tracking-widest mt-0.5">MEMBER CARD</span>
            </div>
          </div>
          <div className="bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-sky-400 flex items-center gap-1 shadow-[0_0_10px_rgba(14,165,233,0.2)]">
            <Sparkles className="w-3 h-3" /> VERIFIED
          </div>
        </div>

        {/* Middle Content */}
        <div className="mt-6 relative z-10 flex justify-between items-end" style={{ transform: "translateZ(50px)" }}>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-1">NAMA KADER</div>
            <div className="text-xl font-bold text-white leading-none tracking-tight">{name}</div>
            
            <div className="flex gap-4 mt-4">
              <div>
                <div className="text-[9px] text-slate-400 font-mono uppercase tracking-widest mb-0.5">NIM</div>
                <div className="text-sm font-mono font-bold text-sky-400">{nim}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 font-mono uppercase tracking-widest mb-0.5">ANGKATAN</div>
                <div className="text-sm font-mono font-bold text-sky-400">{angkatan}</div>
              </div>
            </div>
          </div>

          <div className="p-1.5 bg-white rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]" style={{ transform: "translateZ(60px)" }}>
            <QRCodeSVG value={qrValue} size={64} level="H" className="rounded-sm" />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end border-t border-slate-700/50 pt-2 z-10" style={{ transform: "translateZ(20px)" }}>
          <div className="text-[8px] text-slate-500 font-mono">{email}</div>
          <div className="text-[8px] text-slate-500 font-mono uppercase">ID-{nim.substring(0,6)}</div>
        </div>
      </motion.div>
    </div>
  );
}
