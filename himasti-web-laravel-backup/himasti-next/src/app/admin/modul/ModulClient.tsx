"use client";
import { useState, useTransition } from "react";
import { createItModule, deleteItModule } from "./actions";
import { Search, Plus, Trash2, X, Code, Copy, Check, Filter, ChevronDown, ChevronUp } from "lucide-react";

export default function ModulClient({ moduls, isSuperAdmin }: { moduls: any[], isSuperAdmin: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null); // For Accordion

  const categories = ["Semua", ...Array.from(new Set(moduls.map(m => m.category)))];

  const filteredModuls = moduls.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "Semua" || m.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createItModule(formData);
      setIsUploadOpen(false);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan modul");
    }
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Yakin ingin menghapus modul / snippet ini?")) return;
    startTransition(async () => {
      try {
        await deleteItModule(id);
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  const handleCopy = (id: number, code: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion from toggling
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan nama snippet..." 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isSuperAdmin && (
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium w-full md:w-auto justify-center shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Snippet
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <Filter className="w-4 h-4 text-gray-400 mr-1 shrink-0" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              activeCategory === cat 
                ? "bg-gray-900 text-white border-gray-900 shadow-sm" 
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden slide-in-from-bottom-4">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">Tambah Modul Code Snippet</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                  <input required type="text" name="title" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none" placeholder="Contoh: Koneksi Database PHP" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori / Bahasa *</label>
                  <input required type="text" name="category" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none" placeholder="Contoh: PHP, React, Python" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat (Opsional)</label>
                <input type="text" name="description" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none" placeholder="Kode untuk mengkoneksikan PDO ke MySQL" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Code className="w-4 h-4"/> Code Snippet *</label>
                <textarea required name="code_snippet" rows={8} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none font-mono bg-gray-50 text-gray-800" placeholder="Ketik atau paste kode Anda di sini..."></textarea>
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white font-semibold rounded-lg py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4">
                {loading ? "Menyimpan..." : "Simpan Modul"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LIST KODE (ACCORDION) */}
      <div className="space-y-3">
        {filteredModuls.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <Code className="w-12 h-12 mb-3 text-gray-300" />
            <p>Belum ada snippet kode untuk kategori ini.</p>
          </div>
        ) : filteredModuls.map(m => (
          <div key={m.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all hover:border-gray-200 group">
            
            {/* Header Accordion */}
            <div 
              onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
              className="p-4 flex justify-between items-center bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-900 border border-gray-200 w-24 justify-center">
                  {m.category}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">{m.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{m.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isSuperAdmin && (
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} disabled={isPending} className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100 hidden sm:block">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="text-gray-400 p-1">
                  {expandedId === m.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </div>

            {/* Konten Accordion */}
            {expandedId === m.id && (
              <div className="p-4 bg-gray-900 relative border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={(e) => handleCopy(m.id, m.code_snippet, e)}
                  className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-all shadow border border-gray-600"
                  title="Copy Code"
                >
                  {copiedId === m.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre className="text-xs sm:text-sm font-mono text-gray-300 overflow-x-auto custom-scrollbar leading-relaxed pt-2">
                  <code>{m.code_snippet}</code>
                </pre>
              </div>
            )}
            
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
