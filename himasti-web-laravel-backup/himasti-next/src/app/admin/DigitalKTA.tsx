"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Command, X } from "lucide-react";

export default function DigitalKTA({ 
  name, nim, email, angkatan 
}: { 
  name: string, nim: string, email: string, angkatan: string 
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement>) => {
    if (!targetRef.current) return;
    const rect = targetRef.current.getBoundingClientRect();
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

  const CardContent = ({ zoomed = false }) => (
    <>
      {/* Glare Effect - Now visible on dark background */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 rounded-xl"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)",
          left: glareX,
          top: glareY,
          transform: "translate(-50%, -50%)",
          width: "200%",
          height: "200%",
          mixBlendMode: "screen"
        }}
      />

      {/* Background Pattern - subtle dots */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px', transform: "translateZ(-10px)" }}></div>

      {/* Top Header */}
      <div className="flex justify-between items-start w-full relative z-10" style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-center gap-3">
          <div className={`${zoomed ? 'w-10 h-10' : 'w-8 h-8'} bg-white text-black flex items-center justify-center rounded-lg shadow-sm`}>
            <Command className={zoomed ? "w-5 h-5" : "w-4 h-4"} />
          </div>
          <div>
            <div className={`font-bold text-white tracking-tight leading-none ${zoomed ? 'text-xl' : 'text-sm md:text-base'}`}>HIMASTI</div>
            <div className={`${zoomed ? 'text-xs mt-1' : 'text-[10px] mt-0.5'} text-slate-400 font-mono tracking-widest uppercase`}>Member Card</div>
          </div>
        </div>
        <div className={`px-2 py-1 bg-white/10 border border-white/20 rounded ${zoomed ? 'text-xs px-3 py-1.5' : 'text-[9px]'} font-mono font-bold text-white backdrop-blur-sm`}>
          VERIFIED
        </div>
      </div>

      {/* Middle Content */}
      <div className={`flex gap-4 items-end justify-between w-full relative z-10 ${zoomed ? 'mt-10' : 'mt-6'}`} style={{ transform: "translateZ(50px)" }}>
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <div className={`${zoomed ? 'text-xs mb-1' : 'text-[9px] mb-1'} text-slate-400 font-mono uppercase tracking-widest`}>KADER IDENTITAS</div>
            <div className={`${zoomed ? 'text-3xl whitespace-normal break-words' : 'text-xl truncate'} font-bold text-white leading-tight w-full`}>{name}</div>
          </div>
          
          <div className={`flex ${zoomed ? 'gap-10 mt-6' : 'gap-4 mt-2'}`}>
            <div>
              <div className={`${zoomed ? 'text-xs mb-1' : 'text-[9px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>NIM</div>
              <div className={`${zoomed ? 'text-lg' : 'text-sm'} font-mono font-bold text-slate-200`}>{nim}</div>
            </div>
            <div>
              <div className={`${zoomed ? 'text-xs mb-1' : 'text-[9px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>ANGKATAN</div>
              <div className={`${zoomed ? 'text-lg' : 'text-sm'} font-mono font-bold text-slate-200`}>{angkatan}</div>
            </div>
          </div>
        </div>

        <div className={`p-2 border border-white/10 rounded-xl bg-white shrink-0 shadow-xl ${zoomed ? 'p-3' : ''}`} style={{ transform: "translateZ(60px)" }}>
          <QRCodeSVG value={qrValue} size={zoomed ? 100 : 64} level="H" />
        </div>
      </div>

      {/* Footer */}
      <div className={`w-full flex justify-between items-end border-t border-white/10 pt-3 relative z-10 ${zoomed ? 'mt-8 gap-4' : 'mt-4 gap-2'}`} style={{ transform: "translateZ(20px)" }}>
        <div className={`${zoomed ? 'text-xs whitespace-normal break-all' : 'text-[9px] truncate max-w-[200px]'} text-slate-400 font-mono w-full`}>{email}</div>
        <div className={`${zoomed ? 'text-xs' : 'text-[9px]'} text-slate-500 font-mono uppercase shrink-0`}>ID-{nim.substring(0,8)}</div>
      </div>
    </>
  );

  return (
    <>
      {/* Small Card */}
      <div 
        className="perspective-1000 flex items-center justify-center w-full relative group"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          ref={ref}
          onClick={() => setIsZoomed(true)}
          onMouseMove={(e) => handleMouseMove(e, ref)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="w-full relative aspect-[1.6/1] rounded-2xl overflow-hidden cursor-zoom-in border border-slate-800 bg-black p-5 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-shadow duration-300 flex flex-col justify-between"
        >
          <CardContent zoomed={false} />
        </motion.div>
      </div>

      {/* Zoom Modal - Much smaller, keeps 3D effect */}
      <AnimatePresence>
        {isZoomed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomed(false)}
              className="absolute inset-0 bg-white/80 backdrop-blur-md cursor-zoom-out"
            />
            
            <div 
              className="relative z-10 w-full max-w-lg perspective-1000"
              style={{ perspective: "1200px" }}
            >
              <button 
                onClick={() => setIsZoomed(false)}
                className="absolute -top-12 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-slate-800 shadow-xl transition-colors z-[110]"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                ref={zoomRef}
                layoutId="kta-card"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onMouseMove={(e) => handleMouseMove(e, zoomRef)}
                onMouseLeave={handleMouseLeave}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="w-full relative aspect-[1.6/1] bg-black rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col justify-between border border-slate-800"
              >
                <CardContent zoomed={true} />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
