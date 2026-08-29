"use client";

import { useRef, useState, useEffect } from "react";
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

  // Smooth springs for elegant 3D movement
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement | null>) => {
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

  // Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    if (isZoomed) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  const CardContent = ({ zoomed = false }) => (
    <>
      {/* Elegant Glare Effect (No dots) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 rounded-[inherit]"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)",
          left: glareX,
          top: glareY,
          transform: "translate(-50%, -50%)",
          width: "200%",
          height: "200%",
          mixBlendMode: "screen"
        }}
      />

      {/* Top Header */}
      <div className="flex justify-between items-start w-full relative z-10" style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-center gap-3">
          <div className={`${zoomed ? 'w-14 h-14 rounded-xl' : 'w-8 h-8 rounded-lg'} bg-white text-black flex items-center justify-center shadow-sm`}>
            <Command className={zoomed ? "w-7 h-7" : "w-4 h-4"} />
          </div>
          <div>
            <div className={`font-bold text-white tracking-tight leading-none ${zoomed ? 'text-3xl' : 'text-base'}`}>HIMASTI</div>
            <div className={`${zoomed ? 'text-sm mt-1.5' : 'text-[10px] mt-0.5'} text-slate-400 font-mono tracking-widest uppercase`}>Member Card</div>
          </div>
        </div>
        <div className={`px-3 py-1.5 bg-white/10 border border-white/20 rounded-md ${zoomed ? 'text-sm px-4 py-2' : 'text-[9px] px-2 py-1'} font-mono font-bold text-white backdrop-blur-sm tracking-widest`}>
          VERIFIED
        </div>
      </div>

      {/* Middle Content */}
      <div className={`flex gap-4 items-end justify-between w-full relative z-10 ${zoomed ? 'mt-16' : 'mt-6'}`} style={{ transform: "translateZ(50px)" }}>
        <div className="flex-1 min-w-0 pr-4">
          <div className="mb-4">
            <div className={`${zoomed ? 'text-sm mb-2' : 'text-[9px] mb-1'} text-slate-400 font-mono uppercase tracking-widest`}>IDENTITAS KADER</div>
            <div className={`${zoomed ? 'text-5xl md:text-6xl whitespace-normal break-words leading-tight' : 'text-xl truncate leading-tight'} font-bold text-white w-full`}>{name}</div>
          </div>
          
          <div className={`flex ${zoomed ? 'gap-16 mt-8' : 'gap-4 mt-2'}`}>
            <div>
              <div className={`${zoomed ? 'text-sm mb-2' : 'text-[9px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>NIM</div>
              <div className={`${zoomed ? 'text-2xl' : 'text-sm'} font-mono font-bold text-slate-200`}>{nim}</div>
            </div>
            <div>
              <div className={`${zoomed ? 'text-sm mb-2' : 'text-[9px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>ANGKATAN</div>
              <div className={`${zoomed ? 'text-2xl' : 'text-sm'} font-mono font-bold text-slate-200`}>{angkatan}</div>
            </div>
          </div>
        </div>

        <div className={`p-2 border border-white/10 bg-white shrink-0 shadow-2xl ${zoomed ? 'p-5 rounded-2xl' : 'rounded-xl'}`} style={{ transform: "translateZ(60px)" }}>
          <QRCodeSVG value={qrValue} size={zoomed ? 180 : 64} level="H" />
        </div>
      </div>

      {/* Footer */}
      <div className={`w-full flex justify-between items-end border-t border-white/10 relative z-10 ${zoomed ? 'mt-12 pt-6 gap-6' : 'mt-4 pt-3 gap-2'}`} style={{ transform: "translateZ(20px)" }}>
        <div className={`${zoomed ? 'text-lg whitespace-normal break-all' : 'text-[9px] truncate max-w-[200px]'} text-slate-400 font-mono w-full`}>{email}</div>
        <div className={`${zoomed ? 'text-lg' : 'text-[9px]'} text-slate-500 font-mono uppercase shrink-0`}>ID-{nim.substring(0,8)}</div>
      </div>
    </>
  );

  return (
    <>
      {/* Small Card on Dashboard */}
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
          className="w-full relative aspect-[1.6/1] rounded-2xl overflow-hidden cursor-zoom-in border border-slate-800 bg-black p-5 shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-500 flex flex-col justify-between"
        >
          <CardContent zoomed={false} />
        </motion.div>
      </div>

      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden">
            {/* Elegant Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomed(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl cursor-zoom-out"
            />
            
            {/* Massive Card Container */}
            <div 
              className="relative z-10 w-full max-w-5xl perspective-1000 flex items-center justify-center"
              style={{ perspective: "2000px" }}
            >
              <button 
                onClick={() => setIsZoomed(false)}
                className="absolute -top-16 right-0 w-12 h-12 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black shadow-2xl transition-all duration-300 z-[110]"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div
                ref={zoomRef}
                layoutId="kta-card"
                initial={{ scale: 0.8, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 40 }}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                onMouseMove={(e) => handleMouseMove(e, zoomRef)}
                onMouseLeave={handleMouseLeave}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="w-full relative aspect-[1.6/1] bg-black rounded-[2rem] p-10 md:p-14 shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col justify-between border border-slate-800"
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
