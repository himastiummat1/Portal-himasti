"use client";

import { useState } from "react";
import { Search, ExternalLink, GitBranch, Plus, LayoutGrid, Rocket, Sparkles, X, Trash2 } from "lucide-react";
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
    
    if (result.success) {
      setIsAddModalOpen(false);
    } else {
      alert(result.error);
    }
    setIsSubmitting(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus karya ini?")) return;
    const result = await deleteKarya(id);
    if (!result.success) alert(result.error);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
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
              placeholder="Cari karya atau pembuat..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" /> Unggah Karya
          </button>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((work, idx) => {
          const featured = idx === 0; // Highlight the latest project
          return (
            <div key={work.id} className={`group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full ${featured ? 'border-gray-300 ring-1 ring-gray-100' : 'border-slate-200 hover:border-gray-200'}`}>
              
              {/* Thumbnail Mockup */}
              <div className={`h-40 w-full flex items-center justify-center relative overflow-hidden ${featured ? 'bg-gray-50 from-slate-900 to-slate-800' : 'bg-slate-100'}`}>
                {featured && <div className="absolute top-0 right-0 w-32 h-32 bg-gray-900/20 rounded-full blur-2xl"></div>}
                {featured ? (
                   <Sparkles className="w-12 h-12 text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                ) : (
                   <Rocket className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                )}
                {featured && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-gray-900 text-white text-[10px] font-bold tracking-wider rounded-lg uppercase flex items-center gap-1">
                    Terbaru
                  </div>
                )}
                
                {(isExecutive || userName === work.student_name) && (
                  <button onClick={() => handleDelete(work.id)} className="absolute top-3 right-3 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{work.title}</h3>
                <p className="text-xs text-gray-900 font-medium mt-1">{work.student_name}</p>
                
                <p className="text-sm text-slate-500 mt-3 line-clamp-2 flex-1">
                  {work.description || "Tidak ada deskripsi."}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md border border-slate-200">
                    {work.category.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-2">
                {work.demo_link ? (
                  <a href={work.demo_link} target="_blank" className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-white border border-slate-200 hover:border-gray-300 hover:text-gray-900 rounded-xl text-xs font-semibold text-slate-700 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Kunjungi
                  </a>
                ) : (
                  <button disabled className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-slate-100 border border-transparent text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed">
                     Tidak ada Demo
                  </button>
                )}
                
                {work.github_link ? (
                  <a href={work.github_link} target="_blank" className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors">
                    <GitBranch className="w-3.5 h-3.5" /> Repositori
                  </a>
                ) : (
                  <button disabled className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-slate-200 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed">
                     Source Tertutup
                  </button>
                )}
              </div>

            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>Tidak ada karya yang ditemukan.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
            <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Unggah Karya Baru</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Judul Aplikasi / Karya</label>
                  <input type="text" name="title" required className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="Contoh: SIakad v2.0" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Pembuat</label>
                    <input type="text" name="student_name" defaultValue={userName} required className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                    <select name="category" required className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none">
                      <option value="web">Web App</option>
                      <option value="mobile">Mobile App</option>
                      <option value="ui/ux">Desain UI/UX</option>
                      <option value="script">Script/Bot</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                  <textarea name="description" rows={3} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="Jelaskan fitur utama karya ini..."></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Link Demo (Opsional)</label>
                    <input type="url" name="demo_link" className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Link GitHub (Opsional)</label>
                    <input type="url" name="github_link" className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="https://github.com/..." />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200">
                    Batal
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
                    {isSubmitting ? "Menyimpan..." : "Simpan Karya"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
