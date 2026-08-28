export default function BrutalistCore() {
  return (
    <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes elegantRipple {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: elegantRipple 8s cubic-bezier(0.1, 0, 0.3, 1) infinite;
        }
      `}</style>

      {/* Ripple Rings */}
      <div className="absolute w-[300px] h-[300px] border border-slate-300 rounded-full animate-ripple" style={{ animationDelay: '0s' }} />
      <div className="absolute w-[300px] h-[300px] border border-slate-300 rounded-full animate-ripple" style={{ animationDelay: '2s' }} />
      <div className="absolute w-[300px] h-[300px] border border-slate-300 rounded-full animate-ripple" style={{ animationDelay: '4s' }} />
      <div className="absolute w-[300px] h-[300px] border border-slate-300 rounded-full animate-ripple" style={{ animationDelay: '6s' }} />
      
      {/* Static Center Core */}
      <div className="absolute w-[120px] h-[120px] bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center z-10">
         <div className="w-[8px] h-[8px] bg-slate-900 rounded-full" />
      </div>
    </div>
  );
}
