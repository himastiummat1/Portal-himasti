export default function BrutalistCore() {
  return (
    <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes antigravityPulse {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(3.5);
            opacity: 0;
          }
        }
        .animate-antigravity-ring {
          animation: antigravityPulse 9s cubic-bezier(0.1, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Ambient Celestial Glow Center */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-cyan-500/20 blur-[100px] pointer-events-none" />

      {/* Ripple Wave Rings with Antigravity Glow */}
      <div className="absolute w-[340px] h-[340px] border border-cyan-500/30 rounded-full animate-antigravity-ring shadow-[0_0_25px_rgba(6,182,212,0.2)]" style={{ animationDelay: '0s' }} />
      <div className="absolute w-[340px] h-[340px] border border-blue-500/25 rounded-full animate-antigravity-ring shadow-[0_0_25px_rgba(59,130,246,0.2)]" style={{ animationDelay: '2.25s' }} />
      <div className="absolute w-[340px] h-[340px] border border-indigo-500/20 rounded-full animate-antigravity-ring shadow-[0_0_25px_rgba(99,102,241,0.15)]" style={{ animationDelay: '4.5s' }} />
      <div className="absolute w-[340px] h-[340px] border border-purple-500/15 rounded-full animate-antigravity-ring" style={{ animationDelay: '6.75s' }} />
      
      {/* Central Core Reactor */}
      <div className="absolute w-[100px] h-[100px] bg-slate-900/80 border border-cyan-500/40 rounded-full shadow-[0_0_40px_rgba(6,182,212,0.3)] backdrop-blur-xl flex items-center justify-center z-10">
         <div className="w-[12px] h-[12px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.8)] animate-pulse" />
      </div>
    </div>
  );
}
