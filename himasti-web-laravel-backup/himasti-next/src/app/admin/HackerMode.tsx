"use client";
import { useState, useEffect, useRef } from "react";
import { Terminal, ShieldAlert } from "lucide-react";

export default function HackerMode() {
  const [isActive, setIsActive] = useState(false);
  const [konamiUnlocked, setKonamiUnlocked] = useState(false);
  const [showRiddle, setShowRiddle] = useState(false);
  const [riddleAnswer, setRiddleAnswer] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Konami Code sequence
  const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const [keyHistory, setKeyHistory] = useState<string[]>([]);

  useEffect(() => {
    const handleRequest = () => {
      if (isActive) {
        setIsActive(false);
      } else {
        setShowRiddle(true);
      }
    };
    window.addEventListener('request-dev-mode', handleRequest);
    return () => window.removeEventListener('request-dev-mode', handleRequest);
  }, [isActive]);

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
        body.hacker-active .bg-white, body.hacker-active .bg-slate-50, body.hacker-active .bg-gray-50 {
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


            {/* Riddle Modal */}
      {showRiddle && !isActive && (
        <div className="fixed inset-0 bg-slate-950/80 z-[999] flex items-center justify-center animate-in zoom-in duration-300 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowRiddle(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <ShieldAlert className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-amber-500">🔒</span> Security Clearance Required
            </h2>
            <p className="text-sm text-slate-400 mb-6 pb-4 border-b border-slate-800">
              Dev Mode hanya dapat diakses oleh kader tingkat tinggi. Jawab teka-teki berikut untuk membuktikan identitas Anda:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
              <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                "Saya lahir dari pemikiran kolaboratif. Saya adalah bahasa pemrograman AI-first dengan eksekusi Swarm. Siapakah saya?"
              </p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (riddleAnswer.toLowerCase().trim() === "vidyax") {
                setShowRiddle(false);
                setIsActive(true);
                setRiddleAnswer("");
              } else {
                alert("Akses Ditolak! Jawaban salah. Anda bukan kader sejati!");
              }
            }}>
              <input 
                type="text" 
                autoFocus
                placeholder="Masukkan jawaban..."
                value={riddleAnswer}
                onChange={(e) => setRiddleAnswer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-900 mb-4"
              />
              <button type="submit" className="w-full bg-gray-900 hover:bg-gray-900 text-white font-bold py-3 rounded-xl transition-colors">
                Unlock System
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-[10px] font-mono text-slate-600">Hint: ⬆ ⬆ ⬇ ⬇ ⬅ ➡ ⬅ ➡ B A</p>
            </div>
          </div>
        </div>
      )}

      {/* Konami Code Modal */}
      {konamiUnlocked && (
        <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center animate-in zoom-in duration-300 backdrop-blur-md">
          <div className="bg-slate-950 border-2 border-green-500 p-8 rounded-3xl max-w-lg text-center shadow-[0_0_50px_rgba(0,255,0,0.2)]">
            <ShieldAlert className="w-20 h-20 text-green-600 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl font-mono font-bold text-green-600 mb-2">DEVELOPER UNLOCKED</h2>
            <div className="w-16 h-1 bg-green-500 mx-auto mb-6"></div>
            <p className="text-green-600 font-mono text-sm leading-relaxed mb-8">
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
