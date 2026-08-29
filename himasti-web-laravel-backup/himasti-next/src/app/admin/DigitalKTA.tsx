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
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isZoomed) return;
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
    if (isZoomed) return;
    x.set(0);
    y.set(0);
  };

  const qrValue = JSON.stringify({ type: "himasti_kta", nim, name });

  const CardContent = ({ zoomed = false }) => (
    <>
      {/* Subtle Glare */}
      {!zoomed && (
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
      )}

      {/* Top Header */}
      <div className={`flex justify-between items-start w-full relative z-10 ${zoomed ? 'mb-8' : ''}`} style={zoomed ? {} : { transform: "translateZ(20px)" }}>
        <div className="flex items-center gap-2">
          <div className={`${zoomed ? 'w-12 h-12' : 'w-8 h-8'} bg-slate-900 text-white flex items-center justify-center rounded-md`}>
            <Command className={zoomed ? "w-6 h-6" : "w-4 h-4"} />
          </div>
          <div>
            <div className={`font-bold text-slate-900 tracking-tight leading-none ${zoomed ? 'text-2xl' : 'text-sm md:text-base'}`}>HIMASTI</div>
            <div className={`${zoomed ? 'text-sm mt-1' : 'text-[10px] mt-0.5'} text-slate-500 font-mono tracking-widest uppercase`}>Member Card</div>
          </div>
        </div>
        <div className={`px-2 py-1 bg-slate-100 border border-slate-200 rounded ${zoomed ? 'text-sm px-3 py-1.5' : 'text-[10px]'} font-mono font-bold text-slate-600`}>
          ACTIVE
        </div>
      </div>

      {/* Middle Content */}
      <div className={`flex gap-4 items-end justify-between w-full relative z-10 ${zoomed ? 'mt-12' : 'mt-6'}`} style={zoomed ? {} : { transform: "translateZ(30px)" }}>
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <div className={`${zoomed ? 'text-sm mb-2' : 'text-[10px] mb-1'} text-slate-400 font-mono uppercase tracking-widest`}>IDENTITAS</div>
            <div className={`${zoomed ? 'text-4xl' : 'text-xl md:text-2xl truncate'} font-bold text-slate-900 leading-none w-full`}>{name}</div>
          </div>
          
          <div className={`flex ${zoomed ? 'gap-12 mt-8' : 'gap-6'}`}>
            <div>
              <div className={`${zoomed ? 'text-sm mb-1' : 'text-[10px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>NIM</div>
              <div className={`${zoomed ? 'text-xl' : 'text-sm'} font-mono font-bold text-slate-700`}>{nim}</div>
            </div>
            <div>
              <div className={`${zoomed ? 'text-sm mb-1' : 'text-[10px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>ANGKATAN</div>
              <div className={`${zoomed ? 'text-xl' : 'text-sm'} font-mono font-bold text-slate-700`}>{angkatan}</div>
            </div>
          </div>
        </div>

        <div className={`p-2 border border-slate-200 rounded-lg bg-white shrink-0 ${zoomed ? 'p-4 rounded-xl' : ''}`} style={zoomed ? {} : { transform: "translateZ(40px)" }}>
          <QRCodeSVG value={qrValue} size={zoomed ? 140 : 72} level="H" />
        </div>
      </div>

      {/* Footer */}
      <div className={`w-full flex justify-between items-end border-t border-slate-100 relative z-10 ${zoomed ? 'pt-6 mt-8' : 'pt-3 mt-4 flex-col md:flex-row gap-2'}`} style={zoomed ? {} : { transform: "translateZ(10px)" }}>
        <div className={`${zoomed ? 'text-sm' : 'text-[10px] truncate w-full max-w-[200px]'} text-slate-500 font-mono`}>{email}</div>
        <div className={`${zoomed ? 'text-sm' : 'text-[10px]'} text-slate-400 font-mono uppercase shrink-0`}>ID-{nim.substring(0,8)}</div>
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
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="w-full relative aspect-[1.6/1] rounded-xl overflow-hidden cursor-zoom-in border border-slate-200 bg-white p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow duration-300 flex flex-col justify-between"
        >
          <CardContent />
        </motion.div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomed(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-zoom-out"
            />
            
            <motion.div
              layoutId="kta-card"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-2xl aspect-[1.6/1] bg-white rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col justify-between border border-slate-200"
            >
              <button 
                onClick={() => setIsZoomed(false)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-lg z-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <CardContent zoomed={true} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
