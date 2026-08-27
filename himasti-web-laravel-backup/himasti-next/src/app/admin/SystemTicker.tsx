export default function SystemTicker() {
  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950 text-emerald-400 font-mono text-[10px] py-1 border-t border-slate-800 z-40 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee shrink-0 flex items-center">
          <span className="mx-4">[SYS] 4 percobaan login gagal dari IP 192.168.1.5</span> •
          <span className="mx-4">[API] Devpost Hackathon Crawler sinkronisasi (OK)</span> •
          <span className="mx-4">[KERNEL] Vidyax Engine Swarm Mode aktif (Port 8080)</span> •
          <span className="mx-4">[AUTH] Token JWT diperbarui untuk M N DAFFA</span> •
          <span className="mx-4">[DB] Prisma terhubung ke DB (Ping: 12ms)</span> •
          <span className="mx-4">[LOG] Memori server stabil</span> •
        </div>
        <div className="animate-marquee shrink-0 flex items-center">
          <span className="mx-4">[SYS] 4 percobaan login gagal dari IP 192.168.1.5</span> •
          <span className="mx-4">[API] Devpost Hackathon Crawler sinkronisasi (OK)</span> •
          <span className="mx-4">[KERNEL] Vidyax Engine Swarm Mode aktif (Port 8080)</span> •
          <span className="mx-4">[AUTH] Token JWT diperbarui untuk M N DAFFA</span> •
          <span className="mx-4">[DB] Prisma terhubung ke DB (Ping: 12ms)</span> •
          <span className="mx-4">[LOG] Memori server stabil</span> •
        </div>
      </div>
    </>
  );
}
