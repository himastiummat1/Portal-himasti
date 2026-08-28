"use client";
import { useState, useTransition } from "react";
import { addLomba, deleteLomba, syncMockLomba } from "./actions";
import { RefreshCw, Plus, Trash2, ExternalLink } from "lucide-react";

export default function LombaClient({ records }: { records: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: any) {
    e.preventDefault();
    const result = await addLomba(new FormData(e.target));
    if (result.success) setIsOpen(false);
    else alert(result.error);
  }

  function handleSync() {
    startTransition(async () => {
      await syncMockLomba();
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white  rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Info Lomba & Sertifikasi</h2>
            <p className="text-sm text-gray-500 mt-1">Daftar kompetisi terbaru untuk mahasiswa HIMASTI.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleSync}
              disabled={isPending}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} /> 
              {isPending ? "Menyinkronkan..." : "Sync Devpost API"}
            </button>
            <button 
              onClick={() => setIsOpen(true)} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Tambah Info
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Event / Lomba</th>
                <th className="px-6 py-4">Penyelenggara</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    Belum ada data lomba. Klik tombol "Sync Devpost API" untuk menarik data otomatis.
                  </td>
                </tr>
              ) : records.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-900 whitespace-nowrap">
                        {r.type}
                      </span>
                      <div>
                        <a href={r.link} target="_blank" className="font-semibold text-gray-900 hover:text-gray-600 flex items-center gap-1.5">
                          {r.title} <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{r.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {r.organizer}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-red-500">
                    {r.deadline ? new Date(r.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteLomba(r.id)} 
                      className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl slide-in-from-bottom-4">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Tambah Info Lomba</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kompetisi</label>
                <input type="text" name="title" required className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Event</label>
                  <select name="type" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/20 outline-none">
                    <option value="Lomba IT">Lomba IT</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Sertifikasi">Sertifikasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input type="date" name="deadline" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/20 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Penyelenggara</label>
                <input type="text" name="organizer" required placeholder="Kampus / Instansi" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Pendaftaran</label>
                <input type="url" name="link" placeholder="https://..." className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea name="description" rows={3} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/20 outline-none"></textarea>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors text-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
