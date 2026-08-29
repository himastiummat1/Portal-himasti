"use client";

import { useState } from "react";
import { Search, ExternalLink, GitBranch, Plus, LayoutGrid, Rocket, Sparkles, X, Trash2, Shield } from "lucide-react";
import { addKarya, deleteKarya } from "./actions";

type ProjectRecord = {
  id: number;
  title: string;
  student_name: string;
  category: string;
  description: string | null;
  github_link: string | null;
  demo_link: string | null;
};

export default function KatalogKaryaClient({ records, isExecutive, userName }: { records: ProjectRecord[], isExecutive: boolean, userName: string }) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = records.filter(w => 
    w.title.toLowerCase().includes(search.toLowerCase()) || 
    w.student_name.toLowerCase().includes(search.toLowerCase()) ||
    w.category.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await addKarya(formData);
    if (result.success) setIsAddModalOpen(false);
    else alert(result.error);
    setIsSubmitting(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus karya ini?")) return;
    const result = await deleteKarya(id);
    if (!result.success) alert(result.error);
  }

  // Helper to determine span based on index
  const getBentoSpan = (idx: number) => {
    // A classic 4-column bento layout pattern
    const pattern = idx % 6;
    if (pattern === 0) return "md:col-span-2 md:row-span-2 h-[340px]"; // Featured Large
    if (pattern === 1) return "md:col-span-2 md:row-span-1 h-[200px]"; // Wide
    if (pattern === 2) return "md:col-span-1 md:row-span-1 h-[200px]"; // Standard
    if (pattern === 3) return "md:col-span-1 md:row-span-2 h-[340px]"; // Tall
    if (pattern === 4) return "md:col-span-2 md:row-span-1 h-[200px]"; // Wide
    return "md:col-span-1 md:row-span-1 h-[200px]"; // Standard
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="border-b border-slate-200/60 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-gray-900" /> Katalog Karya
          </h1>
          <p className="text-sm text-slate-500 mt-2">Etalase digital proyek, aplikasi, dan riset kebanggaan mahasiswa HIMASTI.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari karya..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 shadow-sm"
            />
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shadow-md">
            <Plus className="w-4 h-4" /> Unggah Karya
          </button>
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-min gap-4">
        {filtered.map((work, idx) => {
          const bentoClass = getBentoSpan(idx);
          const isFeatured = idx % 6 === 0;

          return (
            <div 
              key={work.id} 
              className={`group relative bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col ${bentoClass} ${isFeatured ? 'border-sky-200/60' : 'border-slate-200 hover:border-gray-300'}`}
            >
              {/* Dynamic Hover Glare */}
              <div className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.08)_0%,transparent_60%)]"></div>

              {/* Graphic Header / Background */}
              <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500 z-0`}>
                {isFeatured ? <Sparkles className="w-48 h-48 -mr-12 -mt-12 text-sky-500" /> : <Rocket className="w-24 h-24 -mr-6 -mt-6 text-slate-500" />}
              </div>

              {/* Content Box */}
              <div className="p-6 md:p-8 flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${isFeatured ? 'bg-sky-50 text-sky-600 border-sky-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                    {work.category}
                  </span>
                  {(isExecutive || userName === work.student_name) && (
                    <button onClick={() => handleDelete(work.id)} className="p-2 bg-white hover:bg-red-50 text-red-400 hover:text-red-600 rounded-full shadow-sm transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-auto">
                  <h3 className={`${isFeatured ? 'text-3xl' : 'text-xl'} font-bold text-slate-900 tracking-tight leading-tight group-hover:text-sky-600 transition-colors duration-300 line-clamp-2`}>
                    {work.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(work.student_name)}`} alt="Avatar" className="w-5 h-5 rounded-full shadow-sm bg-slate-100" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{work.student_name}</p>
                  </div>
                  
                  {isFeatured && (
                    <p className="text-sm text-slate-500 mt-4 line-clamp-3 leading-relaxed">
                      {work.description || "Sebuah inovasi luar biasa karya mahasiswa HIMASTI tanpa deskripsi."}
                    </p>
                  )}
                </div>

                {/* Footer Action Links */}
                <div className="flex items-center gap-3 mt-6 border-t border-slate-100/50 pt-4">
                  {work.demo_link ? (
                    <a href={work.demo_link} target="_blank" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-sky-500 transition-colors">
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                      <ExternalLink className="w-4 h-4" /> No Demo
                    </span>
                  )}
                  
                  {work.github_link ? (
                    <a href={work.github_link} target="_blank" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-sky-500 transition-colors ml-4">
                      <GitBranch className="w-4 h-4" /> Repository
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300 ml-4">
                      <GitBranch className="w-4 h-4" /> Private
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400">
            <Search className="w-16 h-16 mb-6 opacity-20" />
            <p className="text-lg font-medium">Tidak ada karya yang ditemukan.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Unggah Karya</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Judul Aplikasi</label>
                <input type="text" name="title" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none focus:bg-white transition-colors" placeholder="Contoh: Sistem Informasi Pendataan..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pembuat</label>
                  <input type="text" name="student_name" defaultValue={userName} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Kategori</label>
                  <select name="category" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none focus:bg-white">
                    <option value="web">Web App</option>
                    <option value="mobile">Mobile App</option>
                    <option value="ui/ux">UI/UX Design</option>
                    <option value="script">AI / Bot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Deskripsi Singkat</label>
                <textarea name="description" rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none focus:bg-white" placeholder="Jelaskan 1-2 kalimat fungsi utama..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Link Demo (URL)</label>
                  <input type="url" name="demo_link" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none focus:bg-white" placeholder="https://" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Link GitHub</label>
                  <input type="url" name="github_link" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none focus:bg-white" placeholder="https://github.com/" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors">
                  {isSubmitting ? "Menyimpan..." : "Simpan Karya"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
