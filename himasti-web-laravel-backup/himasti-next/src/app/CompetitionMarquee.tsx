"use client";
import { ExternalLink, Calendar, Trophy } from "lucide-react";

export default function CompetitionMarquee({ competitions }: { competitions: any[] }) {
  if (!competitions || competitions.length === 0) return null;

  return (
    <section className="w-full bg-[#060913] py-3.5 overflow-hidden border-y border-white/5 relative flex items-center z-10">
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#060913] to-transparent z-20 pointer-events-none" />
      
      <div className="flex gap-8 items-center whitespace-nowrap animate-marquee">
        {/* Render twice for infinite smooth scroll */}
        {[...competitions, ...competitions].map((c, i) => (
          <div key={i} className="flex items-center gap-3 text-slate-200 px-4">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-sm sm:text-base text-white tracking-tight">{c.title}</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-800/50">
              {c.type}
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {c.deadline ? new Date(c.deadline).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) : "-"}
            </span>
            <a href={c.link} target="_blank" rel="noreferrer" className="ml-1 text-slate-400 hover:text-cyan-400 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 ml-6"></div>
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#060913] to-transparent z-20 pointer-events-none" />
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
}
