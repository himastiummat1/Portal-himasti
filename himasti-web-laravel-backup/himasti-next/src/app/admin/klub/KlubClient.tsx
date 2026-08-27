"use client";

import { useState } from "react";
import { addKlub, deleteKlub } from "./actions";
import { Plus, X, Users, TerminalSquare, Shield, Rocket, ExternalLink, Trash2 } from "lucide-react";

export default function KlubClient({ records, isExecutive }: { records: any[], isExecutive: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper to map club names to cool icons
  const getClubIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("cyber") || t.includes("security")) return <Shield className="w-8 h-8 text-rose-500" />;
    if (t.includes("ai") || t.includes("data")) return <Rocket className="w-8 h-8 text-purple-500" />;
    if (t.includes("web") || t.includes("mobile")) return <TerminalSquare className="w-8 h-8 text-sky-500" />;
    return <Users className="w-8 h-8 text-emerald-500" />;
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    const result = await addKlub(new FormData(e.target));
    setLoading(false);
    if (result.success) setIsOpen(false);
    else alert(result.error);
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin membubarkan klub ini? Data tidak dapat dikembalikan!")) return;
    const result = await deleteKlub(id);
    if (!result.success) alert(result.error);
  }

  return (
    <div className="space-y-6">
      
      {isExecutive && (
        <div className="flex justify-end">
          <button 
            onClick={() => setIsOpen(true)} 
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" /> Dirikan Klub Baru
          </button>
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-3xl">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">Belum Ada Klub</h3>
          <p className="text-gray-500 mt-2">Belum ada klub minat bakat yang terdaftar di HIMASTI.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map(r => (
            <div key={r.id} className="group border border-gray-200 bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full">
              {/* Decoration */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out -z-10"></div>
              
              <div className="flex items-start justify-between mb-6 z-10">
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                  {getClubIcon(r.title)}
                </div>
                {isExecutive && (
                  <button onClick={() => handleDelete(r.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex-1 z-10">
                <h3 className="font-bold text-xl text-gray-900 mb-2">{r.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">{r.description}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between z-10">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                      ?
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                    +
                  </div>
                </div>
                <button className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group-hover:underline">
                  Gabung Klub <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Dirikan Klub Baru</h3>
            <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">Daftarkan divisi minat bakat baru untuk mahasiswa HIMASTI.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Klub *</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="Misal: HIMASTI Cyber Security" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi & Aktivitas *</label>
                <textarea 
                  name="description" 
                  required 
                  placeholder="Jelaskan fokus klub ini dan kapan jadwal kumpul rutinnya..." 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all" 
                  rows={4}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4"
              >
                {loading ? "Menyimpan Data..." : "Resmikan Klub"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
