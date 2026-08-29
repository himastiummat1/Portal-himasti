"use client";
import Image from "next/image";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Command, X } from "lucide-react";

export default function DigitalKTA({ 
  name, nim, email, angkatan 
}: { 
  name: string, nim: string, email: string, angkatan: string 
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

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

  // Add Device Orientation (Gyroscope) support for Android/Mobile
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      
      // gamma is left/right tilt (-90 to 90)
      // beta is front/back tilt (-180 to 180)
      // We map these to our -0.5 to 0.5 scale
      let tiltX = e.gamma / 45; 
      let tiltY = (e.beta - 45) / 45; 
      
      tiltX = Math.max(-1, Math.min(1, tiltX));
      tiltY = Math.max(-1, Math.min(1, tiltY));

      // Only apply gyroscope if we're on a mobile device (touch capable)
      // This prevents desktop laptops with gyro from weird behaviors
      if (typeof window !== 'undefined' && ('ontouchstart' in window)) {
        x.set(tiltX * 0.5);
        y.set(tiltY * 0.5);
      }
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
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

  const CardContent = ({ zoomed = false }) => (
    <>
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
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

      <div className={`flex justify-between items-start w-full relative z-10`} style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`${zoomed ? 'w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl' : 'w-8 h-8 rounded-lg'} bg-white flex items-center justify-center shadow-sm p-1 overflow-hidden`}>
            <Image src="/images/logo_himasti.jpg" alt="Logo HIMASTI" width={60} height={60} className="w-full h-full object-contain" />
          </div>
          <div>
            <div className={`font-bold text-white tracking-tight leading-none ${zoomed ? 'text-xl md:text-3xl' : 'text-base'}`}>HIMASTI</div>
            <div className={`${zoomed ? 'text-[10px] md:text-sm mt-1 md:mt-1.5' : 'text-[10px] mt-0.5'} text-slate-400 font-mono tracking-widest uppercase`}>Member Card</div>
          </div>
        </div>
        <div className={`px-2 py-1 bg-white/10 border border-white/20 rounded-md ${zoomed ? 'text-[10px] md:text-sm px-3 py-1.5 md:px-4 md:py-2' : 'text-[9px] px-2 py-1'} font-mono font-bold text-white backdrop-blur-sm tracking-widest`}>
          VERIFIED
        </div>
      </div>

      <div className={`flex ${zoomed ? 'flex-col md:flex-row mt-8 md:mt-auto md:mb-auto' : 'flex-row mt-6'} gap-6 md:gap-4 items-start md:items-end justify-between w-full relative z-10`} style={{ transform: "translateZ(50px)" }}>
        <div className="flex-1 min-w-0 w-full pr-0 md:pr-4">
          <div className="mb-4 flex items-center gap-3 md:gap-5">
            <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(nim)}`} alt="Avatar" className={`rounded-lg md:rounded-2xl shadow-lg bg-white/5 border border-white/10 shrink-0 ${zoomed ? 'w-16 h-16 md:w-24 md:h-24' : 'w-10 h-10'}`} />
            <div className="flex-1 min-w-0">
              <div className={`${zoomed ? 'text-[10px] md:text-sm mb-1 md:mb-2' : 'text-[9px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>IDENTITAS KADER</div>
              <div className={`${zoomed ? 'text-2xl md:text-5xl lg:text-7xl whitespace-normal break-words leading-tight' : 'text-lg truncate leading-tight'} font-bold text-white w-full`}>{name}</div>
            </div>
          </div>
          
          <div className={`flex flex-wrap ${zoomed ? 'gap-8 md:gap-16 mt-6 md:mt-8' : 'gap-4 mt-2'}`}>
            <div>
              <div className={`${zoomed ? 'text-[10px] md:text-sm mb-1 md:mb-2' : 'text-[9px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>NIM</div>
              <div className={`${zoomed ? 'text-lg md:text-3xl' : 'text-sm'} font-mono font-bold text-slate-200`}>{nim}</div>
            </div>
            <div>
              <div className={`${zoomed ? 'text-[10px] md:text-sm mb-1 md:mb-2' : 'text-[9px] mb-0.5'} text-slate-400 font-mono uppercase tracking-widest`}>ANGKATAN</div>
              <div className={`${zoomed ? 'text-lg md:text-3xl' : 'text-sm'} font-mono font-bold text-slate-200`}>{angkatan}</div>
            </div>
          </div>
        </div>

        <div className={`p-2 border border-white/10 bg-white shrink-0 shadow-2xl flex items-center justify-center ${zoomed ? 'p-3 md:p-5 rounded-xl md:rounded-2xl w-24 h-24 md:w-[200px] md:h-[200px] self-start md:self-end' : 'rounded-xl w-16 h-16'}`} style={{ transform: "translateZ(60px)" }}>
          <QRCodeSVG value={qrValue} width="100%" height="100%" level="H" />
        </div>
      </div>

      <div className={`w-full flex ${zoomed ? 'flex-col md:flex-row mt-6 md:mt-8 pt-4 md:pt-6 gap-3 md:gap-6' : 'flex-row mt-4 pt-3 gap-2'} justify-between items-start md:items-end border-t border-white/10 relative z-10`} style={{ transform: "translateZ(20px)" }}>
        <div className={`${zoomed ? 'text-xs md:text-lg whitespace-normal break-all' : 'text-[9px] truncate max-w-[200px]'} text-slate-400 font-mono w-full`}>{email}</div>
        <div className={`${zoomed ? 'text-xs md:text-lg' : 'text-[9px]'} text-slate-500 font-mono uppercase shrink-0`}>ID-{nim.substring(0,8)}</div>
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
          className="w-full relative aspect-[1.6/1] rounded-2xl overflow-hidden cursor-zoom-in border border-slate-800 bg-black p-5 shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-500 flex flex-col justify-between"
        >
          <CardContent zoomed={false} />
        </motion.div>
      </div>

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
                <button 
                  onClick={() => setIsZoomed(false)}
                  className="absolute -top-12 md:-top-16 right-0 w-10 h-10 md:w-12 md:h-12 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black shadow-2xl transition-all duration-300 z-[9999] cursor-pointer"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>

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
                  className="w-full relative h-full md:h-auto aspect-auto md:aspect-[2/1] lg:aspect-[2.2/1] bg-black rounded-[2rem] p-6 md:p-14 shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col justify-between border border-slate-800 overflow-y-auto overflow-x-hidden md:overflow-visible"
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
