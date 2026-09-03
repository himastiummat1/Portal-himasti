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
      <div className="absolute w-[450px] h-[450px] rounded-full bg-blue-100/40 blur-[90px] pointer-events-none" />

      {/* Clean Ripple Rings */}
      <div className="absolute w-[320px] h-[320px] border border-slate-200/80 rounded-full animate-subtle-ripple" style={{ animationDelay: '0s' }} />
      <div className="absolute w-[320px] h-[320px] border border-slate-200/60 rounded-full animate-subtle-ripple" style={{ animationDelay: '2.5s' }} />
      <div className="absolute w-[320px] h-[320px] border border-slate-200/40 rounded-full animate-subtle-ripple" style={{ animationDelay: '5s' }} />
      <div className="absolute w-[320px] h-[320px] border border-slate-100 rounded-full animate-subtle-ripple" style={{ animationDelay: '7.5s' }} />
      
      {/* Central Core Reactor */}
      <div className="absolute w-[90px] h-[90px] bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center z-10">
         <div className="w-[10px] h-[10px] bg-blue-600 rounded-full shadow-sm animate-pulse" />
      </div>
    </div>
  );
}
