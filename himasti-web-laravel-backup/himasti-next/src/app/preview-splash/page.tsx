"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

const TetrisSplash = dynamic(() => import("@/components/ui/TetrisSplash"), {
  ssr: false,
});

export default function PreviewSplashPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playCount, setPlayCount] = useState(1);

  const handleReplay = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setPlayCount((c) => c + 1);
      setIsPlaying(true);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative font-mono selection:bg-white selection:text-black">
      
      {/* Live Splash Screen Instance */}
      {isPlaying && (
        <TetrisSplash 
          key={playCount} 
          onComplete={() => setIsPlaying(false)} 
          autoClose={true} 
        />
      )}

      {/* Control Panel */}
      <div className="max-w-sm w-full bg-zinc-950 border border-zinc-800 rounded-lg p-6 space-y-6 relative z-20">
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-2 border-b border-zinc-900">
            <span>PREVIEW // LAUNCH_SCREEN</span>
            <span>v2.6.0</span>
          </div>
          <h1 className="text-base font-bold text-white tracking-tight">
            SIMULASI BOOT HIMASTI
          </h1>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Animasi balok matriks presisi (H-I-M-A-S-T-I) dengan mekanisme jeda blok [S] dan telemetri terminal.
          </p>
        </div>

        {/* Action Controls */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleReplay}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded transition-colors cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>PUTAR ULANG ANIMASI</span>
          </button>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium rounded border border-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>KEMBALI KE PORTAL</span>
          </Link>
        </div>

        <div className="pt-2 border-t border-zinc-900 text-[10px] text-zinc-600 text-center">
          LOCAL DEV ONLY // ZERO CLOUD PUSH
        </div>

      </div>

    </div>
  );
}
