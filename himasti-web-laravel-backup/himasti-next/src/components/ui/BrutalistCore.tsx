export default function BrutalistCore() {
  return (
    <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden pointer-events-none">
      {/* Outer Ring */}
      <div className="absolute w-[800px] h-[800px] border-[1px] border-gray-300 rounded-full animate-[spin_60s_linear_infinite]" />
      
      {/* Middle Dashed Ring */}
      <div className="absolute w-[600px] h-[600px] border-[2px] border-dashed border-gray-400 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
      
      {/* Inner Thin Ring */}
      <div className="absolute w-[400px] h-[400px] border-[1px] border-gray-400 rounded-full animate-[spin_20s_linear_infinite]" />
      
      {/* The Core Point */}
      <div className="absolute w-[150px] h-[150px] border border-gray-300 rounded-full flex items-center justify-center animate-pulse">
         <div className="w-[12px] h-[12px] bg-gray-500 rounded-full" />
      </div>
    </div>
  );
}
