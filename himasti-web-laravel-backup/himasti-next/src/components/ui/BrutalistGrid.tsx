export default function BrutalistGrid() {
  return (
    <div className="grid grid-cols-4 gap-1.5 w-fit">
      <style>{`
        @keyframes elegantPop {
          0%, 100% {
            transform: scale(1) translateY(0);
            box-shadow: 0 0 0 rgba(0,0,0,0);
            background-color: #f8fafc; /* slate-50 */
            border-color: #f1f5f9; /* slate-100 */
            z-index: 1;
          }
          40%, 60% {
            transform: scale(1.05) translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01);
            background-color: #ffffff;
            border-color: #e2e8f0; /* slate-200 */
            z-index: 10;
          }
        }
        .animate-elegant {
          animation: elegantPop 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          position: relative;
        }
      `}</style>
      
      {Array.from({ length: 16 }).map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const delay = (row + col) * 0.3; // Diagonal wave
        
        return (
          <div
            key={i}
            className="w-12 h-12 md:w-16 md:h-16 border rounded-xl animate-elegant transition-colors"
            style={{ animationDelay: `${delay}s` }}
          />
        );
      })}
    </div>
  );
}
