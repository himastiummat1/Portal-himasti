// Server or Client component, pure CSS animation

export default function BrutalistGrid() {

  return (
    <div className="grid grid-cols-4 gap-2 w-fit">
      <style>{`
        @keyframes popUp {
          0%, 100% { transform: translateY(0); box-shadow: 0 0 0 rgba(0,0,0,0); }
          50% { transform: translateY(-6px); box-shadow: 0 4px 0 rgba(0,0,0,0.9); }
        }
        .animate-pop {
          animation: popUp 2s infinite ease-in-out;
        }
      `}</style>
      
      {Array.from({ length: 16 }).map((_, i) => {
        // Create a wave effect across the 4x4 grid
        const row = Math.floor(i / 4);
        const col = i % 4;
        const delay = (row + col) * 0.15;
        
        return (
          <div
            key={i}
            className="w-10 h-10 bg-white border-2 border-gray-900 rounded-sm animate-pop"
            style={{
              animationDelay: \`\${delay}s\`
            }}
          />
        );
      })}
    </div>
  );
}
