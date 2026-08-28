export default function BrutalistCore() {
  return (
    <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden pointer-events-none opacity-30">
      {/* Outer Ring */}
      <div className="absolute w-[800px] h-[800px] border border-gray-200 rounded-full animate-[spin_60s_linear_infinite]" />
      
      {/* Middle Dashed Ring */}
      <div className="absolute w-[600px] h-[600px] border-[1.5px] border-dashed border-gray-300 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
      
      {/* Inner Thin Ring */}
      <div className="absolute w-[400px] h-[400px] border border-gray-200 rounded-full animate-[spin_20s_linear_infinite]" />
      
      {/* The Core Point */}
      <div className="absolute w-[150px] h-[150px] border border-gray-900/10 rounded-full flex items-center justify-center animate-pulse">
         <div className="w-[10px] h-[10px] bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}
