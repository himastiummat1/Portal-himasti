"use client";

import { useState } from "react";
import { Search, ExternalLink, Github, Plus, LayoutGrid, Rocket, Sparkles } from "lucide-react";

export default function KatalogClient() {
  const [search, setSearch] = useState("");

  const works = [
    {
      id: 1,
      title: "Vidyax Language Compiler",
      creator: "M N DAFFA (Kabid R&D)",
      desc: "Bahasa pemrograman AI-first dengan eksekusi multi-agen (Swarm) dan memori bersama secara native.",
      tags: ["C", "Python", "Compiler", "AI"],
      repo: "https://github.com/Vidyax-Lang/Vidyax",
      demo: "https://github.com/daffa2555/Vidyax-Vscode",
      featured: true
    },
    {
      id: 2,
      title: "Portal HIMASTI v2",
      creator: "Tim Pengurus HIMASTI",
      desc: "Sistem informasi terpadu himpunan mahasiswa berbasis Next.js App Router dengan arsitektur modern.",
      tags: ["Next.js", "Tailwind", "Prisma"],
      repo: "#",
      demo: "#",
      featured: true
    },
    {
      id: 3,
      title: "Sistem Deteksi Hama Padi AI",
      creator: "Riset Bersama Angkatan '22",
      desc: "Model Computer Vision YOLOv8 untuk mendeteksi penyakit daun padi secara real-time melalui kamera ponsel.",
      tags: ["Python", "YOLOv8", "TensorFlow"],
      repo: "#",
      demo: "#",
      featured: false
    },
    {
      id: 4,
      title: "E-Voting Pemira Himpunan",
      creator: "Divisi IT HIMASTI",
      desc: "Aplikasi pemilihan ketua himpunan berbasis blockchain sederhana untuk menjamin integritas suara.",
      tags: ["React", "Express", "Crypto"],
      repo: "#",
      demo: "#",
      featured: false
    }
  ];

  const filtered = works.filter(w => 
    w.title.toLowerCase().includes(search.toLowerCase()) || 
    w.creator.toLowerCase().includes(search.toLowerCase()) ||
    w.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="border-b border-slate-200/60 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-sky-500" /> Katalog Karya
          </h1>
          <p className="text-sm text-slate-500 mt-2">Etalase digital proyek, aplikasi, dan riset kebanggaan mahasiswa HIMASTI.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari karya atau nama..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" /> Unggah Karya
          </button>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(work => (
          <div key={work.id} className={`group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full ${work.featured ? 'border-sky-300 ring-1 ring-sky-100' : 'border-slate-200 hover:border-sky-200'}`}>
            
            {/* Thumbnail Mockup */}
            <div className={`h-40 w-full flex items-center justify-center relative overflow-hidden ${work.featured ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-slate-100'}`}>
              {work.featured && <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl"></div>}
              {work.featured ? (
                 <Sparkles className="w-12 h-12 text-sky-400/50 group-hover:scale-110 transition-transform duration-500" />
              ) : (
                 <Rocket className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
              )}
              {work.featured && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-sky-500 text-white text-[10px] font-bold tracking-wider rounded-lg uppercase flex items-center gap-1">
                  Mahkota
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{work.title}</h3>
              <p className="text-xs text-sky-600 font-medium mt-1">{work.creator}</p>
              
              <p className="text-sm text-slate-500 mt-3 line-clamp-2 flex-1">
                {work.desc}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {work.tags.map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-2">
              <a href={work.demo} target="_blank" className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-white border border-slate-200 hover:border-sky-300 hover:text-sky-600 rounded-xl text-xs font-semibold text-slate-700 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Kunjungi
              </a>
              <a href={work.repo} target="_blank" className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors">
                <Github className="w-3.5 h-3.5" /> Repositori
              </a>
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>Tidak ada karya yang cocok dengan pencarian.</p>
          </div>
        )}
      </div>

    </div>
  );
}
