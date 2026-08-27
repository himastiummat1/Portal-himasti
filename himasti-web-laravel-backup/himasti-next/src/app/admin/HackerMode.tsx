"use client";
import { useState, useEffect, useRef } from "react";
import { Terminal, ShieldAlert } from "lucide-react";

export default function HackerMode() {
  const [isActive, setIsActive] = useState(false);
  const [konamiUnlocked, setKonamiUnlocked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Konami Code sequence
  const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const [keyHistory, setKeyHistory] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newHistory = [...keyHistory, e.key].slice(-10);
      setKeyHistory(newHistory);
      
      if (newHistory.join(',') === secretCode.join(',')) {
        setKonamiUnlocked(true);
        setIsActive(true); // Auto activate hacker mode too!
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyHistory]);

  // Matrix Rain effect
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~'.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    
    // Inject dark mode body classes
    document.body.classList.add('hacker-active');
    
    return () => {
      clearInterval(interval);
      document.body.classList.remove('hacker-active');
    };
  }, [isActive]);

  return (
    <>
      <style>{`
        body.hacker-active {
          background-color: #000 !important;
        }
        body.hacker-active * {
          border-color: rgba(0, 255, 0, 0.2) !important;
          box-shadow: none !important;
        }
        body.hacker-active h1, body.hacker-active h2, body.hacker-active h3, body.hacker-active h4, body.hacker-active p, body.hacker-active span, body.hacker-active div {
          color: #0F0 !important;
          background-color: transparent !important;
        }
        body.hacker-active .bg-white, body.hacker-active .bg-slate-50, body.hacker-active .bg-sky-50 {
          background-color: rgba(0,20,0,0.8) !important;
          backdrop-filter: blur(4px);
        }
      `}</style>

      {/* Background Canvas */}
      {isActive && (
        <canvas 
          ref={canvasRef} 
          className="fixed inset-0 z-[-1] opacity-60 pointer-events-none"
        />
      )}

      {/* Toggle Button */}
      <div className="fixed bottom-[10.5rem] right-6 z-50 flex flex-col items-end gap-1 group/konami">
        <label className="flex items-center gap-2 cursor-pointer bg-slate-900/50 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-full hover:bg-slate-800 transition-colors">
          <input 
            type="checkbox" 
            className="sr-only" 
            checked={isActive} 
            onChange={() => setIsActive(!isActive)} 
          />
          <div className={`w-8 h-4 rounded-full transition-colors relative ${isActive ? 'bg-green-500' : 'bg-slate-600'}`}>
            <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-300">
            {isActive ? '> DEV MODE' : 'DEV MODE'}
          </span>
        </label>
        <div className="text-[9px] font-mono text-slate-400/50 group-hover/konami:text-slate-400 transition-colors bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/50 opacity-0 group-hover/konami:opacity-100 cursor-help" title="Konami Code">
          Hint: ⬆ ⬆ ⬇ ⬇ ⬅ ➡ ⬅ ➡ B A
        </div>
      </div>

      {/* Konami Code Modal */}
      {konamiUnlocked && (
        <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center animate-in zoom-in duration-300 backdrop-blur-md">
          <div className="bg-slate-950 border-2 border-green-500 p-8 rounded-3xl max-w-lg text-center shadow-[0_0_50px_rgba(0,255,0,0.2)]">
            <ShieldAlert className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl font-mono font-bold text-green-500 mb-2">DEVELOPER UNLOCKED</h2>
            <div className="w-16 h-1 bg-green-500 mx-auto mb-6"></div>
            <p className="text-green-400 font-mono text-sm leading-relaxed mb-8">
              Hormat kepada Sang Architect, <strong className="text-white bg-green-900 px-2 py-1">M N DAFFA</strong>! 
              <br/><br/>
              Sistem telah mendeteksi kode rahasia Konami. Semua protokol keamanan Vidyax Engine di-bypass. Anda sekarang memiliki kendali penuh atas portal HIMASTI.
            </p>
            <button 
              onClick={() => setKonamiUnlocked(false)}
              className="bg-green-500 text-black font-bold font-mono px-6 py-2 hover:bg-green-400 transition-colors uppercase tracking-widest"
            >
              Init System //
            </button>
          </div>
        </div>
      )}
    </>
  );
}
