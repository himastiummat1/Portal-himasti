export default function BrutalistCore() {
  return (
    <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes subtleRipple {
          0% {
            transform: scale(0.6);
            opacity: 0.7;
          }
          100% {
            transform: scale(3.2);
            opacity: 0;
          }
        }
        .animate-subtle-ripple {
          animation: subtleRipple 10s cubic-bezier(0.1, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Subtle Ambient Radial Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-100/30 via-slate-100/40 to-transparent blur-[100px] pointer-events-none" />

      {/* Subtle Concentric Rings */}
      <div className="absolute w-[340px] h-[340px] border border-slate-200/50 rounded-full animate-subtle-ripple pointer-events-none" style={{ animationDelay: '0s' }} />
      <div className="absolute w-[340px] h-[340px] border border-slate-200/35 rounded-full animate-subtle-ripple pointer-events-none" style={{ animationDelay: '3.3s' }} />
      <div className="absolute w-[340px] h-[340px] border border-slate-200/20 rounded-full animate-subtle-ripple pointer-events-none" style={{ animationDelay: '6.6s' }} />
    </div>
  );
}
