const fs = require('fs');
let content = fs.readFileSync('src/app/admin/HackerMode.tsx', 'utf8');

// 1. Add Riddle State
content = content.replace(
  'const [konamiUnlocked, setKonamiUnlocked] = useState(false);',
  'const [konamiUnlocked, setKonamiUnlocked] = useState(false);\n  const [showRiddle, setShowRiddle] = useState(false);\n  const [riddleAnswer, setRiddleAnswer] = useState("");'
);

// 2. Add event listener for top nav toggle request
const eventListener = `  useEffect(() => {
    const handleRequest = () => {
      if (isActive) {
        setIsActive(false);
      } else {
        setShowRiddle(true);
      }
    };
    window.addEventListener('request-dev-mode', handleRequest);
    return () => window.removeEventListener('request-dev-mode', handleRequest);
  }, [isActive]);\n\n  useEffect(() => {`;
content = content.replace('  useEffect(() => {', eventListener);

// 3. Remove the floating toggle button
const floatingToggleStart = '{/* Toggle Button */}';
const floatingToggleEnd = '</label>\n        <div className="text-[9px] font-mono text-slate-400/50 group-hover/konami:text-slate-400 transition-colors bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/50 opacity-0 group-hover/konami:opacity-100 cursor-help" title="Konami Code">\n          Hint: ⬆ ⬆ ⬇ ⬇ ⬅ ➡ ⬅ ➡ B A\n        </div>\n      </div>';
const toggleRegex = new RegExp(floatingToggleStart.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&') + '[\\\\s\\\\S]*?' + floatingToggleEnd.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'));
content = content.replace(toggleRegex, '');

// 4. Add the Riddle Modal JSX before Konami modal
const riddleModal = `      {/* Riddle Modal */}
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
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 mb-4"
              />
              <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl transition-colors">
                Unlock System
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-[10px] font-mono text-slate-600">Hint: ⬆ ⬆ ⬇ ⬇ ⬅ ➡ ⬅ ➡ B A</p>
            </div>
          </div>
        </div>
      )}\n\n`;

content = content.replace('{/* Konami Code Modal */}', riddleModal + '      {/* Konami Code Modal */}');

fs.writeFileSync('src/app/admin/HackerMode.tsx', content);
