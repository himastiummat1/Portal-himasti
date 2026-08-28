export default function BrutalistGrid() {
  return (
    <div className="grid grid-cols-4 gap-1 w-fit opacity-60 hover:opacity-100 transition-opacity duration-700">
      <style>{`
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
        .animate-subtle {
          animation: subtlePulse 3s infinite ease-in-out;
        }
      `}</style>
      
      {Array.from({ length: 16 }).map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const delay = (row + col) * 0.2;
        
        return (
          <div
            key={i}
            className="w-2.5 h-2.5 bg-gray-400 rounded-[1px] animate-subtle"
            style={{ animationDelay: `${delay}s` }}
          />
        );
      })}
    </div>
  );
}
