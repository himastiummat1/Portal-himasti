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
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (!targetRef.current || isZoomed) return;
    const rect = targetRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    if (isZoomed) return;
    x.set(0);
    y.set(0);
  };

  const qrValue = JSON.stringify({ type: "himasti_kta", nim, name });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    if (isZoomed) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  const CardContent = ({ zoomed = false }) => (
    <>
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        style={zoomed ? {} : {
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
      <div className={`flex justify-between items-start w-full relative z-10 ${zoomed ? 'max-w-7xl mx-auto' : ''}`} style={zoomed ? {} : { transform: "translateZ(30px)" }}>
        <div className="flex items-center gap-3">
          <div className={`${zoomed ? 'w-16 h-16 rounded-2xl' : 'w-8 h-8 rounded-lg'} bg-white text-black flex items-center justify-center shadow-sm`}>
            <Command className={zoomed ? "w-8 h-8" : "w-4 h-4"} />
          </div>
          <div>
            <div className={`font-bold text-white tracking-tight leading-none ${zoomed ? 'text-4xl' : 'text-base'}`}>HIMASTI</div>
            <div className={`${zoomed ? 'text-lg mt-2' : 'text-[10px] mt-0.5'} text-slate-400 font-mono tracking-widest uppercase`}>Member Card</div>
          </div>
        </div>
        <div className={`px-2 py-1 bg-white/10 border border-white/20 rounded-md ${zoomed ? 'text-xl px-6 py-3' : 'text-[9px] px-2 py-1'} font-mono font-bold text-white backdrop-blur-sm tracking-widest`}>
          VERIFIED
        </div>
      </div>

      {/* Middle Content */}
      <div className={`flex flex-col md:flex-row gap-8 md:gap-4 md:items-end justify-between w-full relative z-10 ${zoomed ? 'mt-auto mb-auto max-w-7xl mx-auto' : 'mt-6'}`} style={zoomed ? {} : { transform: "translateZ(50px)" }}>
        <div className="flex-1 min-w-0 pr-4">
          <div className="mb-6">
            <div className={`${zoomed ? 'text-xl mb-3 text-sky-400' : 'text-[9px] mb-1 text-slate-400'} font-mono uppercase tracking-widest`}>IDENTITAS KADER</div>
            <div className={`${zoomed ? 'text-5xl md:text-7xl lg:text-8xl whitespace-normal break-words leading-tight' : 'text-xl truncate leading-tight'} font-bold text-white w-full`}>{name}</div>
          </div>
          
          <div className={`flex flex-wrap ${zoomed ? 'gap-12 md:gap-24 mt-12' : 'gap-4 mt-2'}`}>
            <div>
              <div className={`${zoomed ? 'text-lg mb-2' : 'text-[9px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>NIM</div>
              <div className={`${zoomed ? 'text-3xl md:text-4xl' : 'text-sm'} font-mono font-bold text-slate-200`}>{nim}</div>
            </div>
            <div>
              <div className={`${zoomed ? 'text-lg mb-2' : 'text-[9px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>ANGKATAN</div>
              <div className={`${zoomed ? 'text-3xl md:text-4xl' : 'text-sm'} font-mono font-bold text-slate-200`}>{angkatan}</div>
            </div>
          </div>
        </div>

        <div className={`border border-white/10 bg-white shrink-0 shadow-2xl flex items-center justify-center ${zoomed ? 'p-6 rounded-3xl w-fit self-start md:self-end' : 'p-2 rounded-xl'}`} style={zoomed ? {} : { transform: "translateZ(60px)" }}>
          <QRCodeSVG value={qrValue} size={zoomed ? 240 : 64} level="H" />
        </div>
      </div>

      {/* Footer */}
      <div className={`w-full flex flex-col md:flex-row justify-between md:items-end border-t border-white/10 relative z-10 ${zoomed ? 'mt-8 pt-8 gap-4 max-w-7xl mx-auto' : 'mt-4 pt-3 gap-2'}`} style={zoomed ? {} : { transform: "translateZ(20px)" }}>
        <div className={`${zoomed ? 'text-xl whitespace-normal break-all' : 'text-[9px] truncate max-w-[200px]'} text-slate-400 font-mono w-full`}>{email}</div>
        <div className={`${zoomed ? 'text-xl' : 'text-[9px]'} text-slate-500 font-mono uppercase shrink-0`}>ID-{nim.substring(0,8)}</div>
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
          layoutId="kta-card-body"
          onClick={() => setIsZoomed(true)}
          onMouseMove={(e) => handleMouseMove(e, ref)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="w-full relative aspect-[1.6/1] rounded-2xl overflow-hidden cursor-pointer border border-slate-800 bg-black p-5 shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-500 flex flex-col justify-between"
        >
          <CardContent zoomed={false} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            layoutId="kta-card-body"
            className="fixed inset-0 z-[200] w-full h-[100dvh] bg-black flex flex-col justify-between p-6 md:p-16 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Background geometric pattern for fullscreen to look premium */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, #ffffff 1px, transparent 1px), radial-gradient(circle at 0% 100%, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900/50 to-black pointer-events-none"></div>

            <button 
              onClick={() => setIsZoomed(false)}
              className="absolute top-6 right-6 md:top-12 md:right-12 w-14 h-14 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black shadow-2xl transition-all duration-300 z-[210] cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            
            <CardContent zoomed={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
