"use client";
import { ExternalLink, Calendar, Trophy } from "lucide-react";

export default function CompetitionMarquee({ competitions }: { competitions: any[] }) {
  if (!competitions || competitions.length === 0) return null;

  return (
    <section className="w-full bg-gray-50 py-3 overflow-hidden border-y border-gray-200 relative flex items-center z-10">
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gray-50 from-gray-50 to-transparent z-20"></div>
      
      <div className="flex gap-8 items-center whitespace-nowrap animate-marquee">
        {/* Render twice for infinite smooth scroll */}
        {[...competitions, ...competitions].map((c, i) => (
          <div key={i} className="flex items-center gap-3 text-gray-900 px-4">
            <Trophy className="w-4 h-4 opacity-70" />
            <span className="font-bold text-sm sm:text-base">{c.title}</span>
            <span className="text-xs sm:text-sm opacity-80 font-medium px-2 py-0.5 rounded-full bg-gray-200">
              {c.type}
            </span>
            <span className="text-xs sm:text-sm font-semibold opacity-70 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {c.deadline ? new Date(c.deadline).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) : "-"}
            </span>
            <a href={c.link} target="_blank" className="ml-1 text-gray-600 hover:text-gray-900">
              <ExternalLink className="w-4 h-4" />
            </a>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 ml-6"></div>
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-gray-50 to-transparent z-20"></div>
      
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
