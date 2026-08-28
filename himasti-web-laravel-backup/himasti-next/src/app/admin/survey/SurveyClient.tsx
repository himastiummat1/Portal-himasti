"use client";
import { useState } from "react";
import { addSurvey, deleteSurvey } from "./actions";
import { ClipboardList, ExternalLink, Trash2, Plus, X, Search, FileText } from "lucide-react";
import Link from "next/link";

export default function SurveyClient({ records }: { records: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = records.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()));

  async function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await addSurvey(new FormData(e.target));
    setIsSubmitting(false);
    if (result.success) setIsOpen(false);
    else alert(result.error);
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-slate-700" />
            Pusat Riset & Kuesioner
          </h2>
          <p className="text-slate-500 text-sm mt-1">Kelola formulir survei, kuisioner anggota, dan pengumpulan data riset HIMASTI.</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)} 
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Buka Kuesioner Baru
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari judul atau deskripsi kuesioner..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400"
        />
      </div>

      {/* Grid List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <FileText className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">Belum ada data riset</h3>
          <p className="text-slate-500 text-sm max-w-sm mt-1">Kuesioner yang Anda buat akan muncul di sini. Mulai kumpulkan data sekarang.</p>
          <button onClick={() => setIsOpen(true)} className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
            + Buat Kuesioner Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(r => (
            <div key={r.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${r.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {r.status === 'published' ? 'Aktif (Published)' : 'Draft'}
                </span>
                <button 
                  onClick={() => { if(confirm('Yakin ingin menghapus kuesioner ini?')) deleteSurvey(r.id) }} 
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-semibold text-slate-900 text-lg mb-2 line-clamp-2">{r.title}</h3>
              <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-3">{r.description}</p>
              
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                {r.link ? (
                  <Link href={r.link} target="_blank" className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
                    Isi Form <ExternalLink className="w-4 h-4" />
                  </Link>
                ) : (
                  <button disabled className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl text-sm font-medium cursor-not-allowed">
                    Tidak ada Link
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Buat Kuesioner */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Buat Kuesioner Riset</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Kuesioner</label>
                <input type="text" name="title" required placeholder="Contoh: Survei Kepuasan Anggota 2026" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none text-sm transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi / Tujuan</label>
                <textarea name="description" required placeholder="Jelaskan tujuan pengumpulan data ini..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none text-sm transition-all resize-none" rows={3}></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tautan Google Form (Opsional)</label>
                <input type="url" name="link" placeholder="https://forms.gle/..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none text-sm transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Publikasi</label>
                <select name="status" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none text-sm transition-all appearance-none cursor-pointer">
                  <option value="draft">Draft (Belum Dibuka)</option>
                  <option value="published">Published (Terbuka untuk Umum)</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Kuesioner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
