"use client";
import { useState, useTransition } from "react";
import { uploadKarya, deleteKarya } from "./actions";
import { Search, Upload, Trash2, ExternalLink, Github, Image as ImageIcon, X, Lightbulb } from "lucide-react";

export default function KaryaClient({ karyas, currentUserId, isSuperAdmin }: { karyas: any[], currentUserId: number, isSuperAdmin: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredKaryas = karyas.filter(k => 
    k.judul.toLowerCase().includes(search.toLowerCase()) || 
    k.kategori.toLowerCase().includes(search.toLowerCase()) ||
    k.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await uploadKarya(formData);
      setIsUploadOpen(false);
    } catch (err: any) {
      alert(err.message || "Gagal mengupload karya");
    }
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Yakin ingin menghapus karya ini dari pameran?")) return;
    startTransition(async () => {
      try {
        await deleteKarya(id);
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari karya, kategori, atau nama..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button 
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium w-full sm:w-auto justify-center"
        >
          <Upload className="w-4 h-4" /> Pamerkan Karya
        </button>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden slide-in-from-bottom-4">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">Pamerkan Karya Baru</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Karya *</label>
                <input required type="text" name="judul" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" placeholder="Contoh: Aplikasi Absensi Wajah" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select required name="kategori" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none">
                  <option value="Web App">Aplikasi Web</option>
                  <option value="Mobile App">Aplikasi Mobile</option>
                  <option value="Design">Desain Grafis / UIUX</option>
                  <option value="Hardware">IoT / Hardware</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                <textarea name="deskripsi" rows={3} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" placeholder="Ceritakan singkat tentang karya ini..."></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Demo / Web</label>
                  <input type="url" name="link_demo" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" placeholder="https://" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Repositori (GitHub)</label>
                  <input type="url" name="link_repo" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" placeholder="https://github.com/..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image / Poster (Opsional)</label>
                <input type="file" name="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 border border-gray-200 rounded-lg p-1" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white font-semibold rounded-lg py-2.5 hover:bg-purple-700 transition-colors disabled:opacity-50 mt-4">
                {loading ? "Menyimpan..." : "Publikasikan Karya"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKaryas.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            Belum ada karya yang dipamerkan.
          </div>
        ) : filteredKaryas.map(karya => (
          <div key={karya.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 hover:shadow-md transition-all group flex flex-col">
            
            <div className="aspect-video w-full bg-gray-100 relative overflow-hidden flex items-center justify-center">
              {karya.file_path ? (
                <img src={karya.file_path} alt={karya.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="text-gray-300 flex flex-col items-center">
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <span className="text-xs font-medium uppercase tracking-widest">{karya.kategori}</span>
                </div>
              )}
              
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm text-gray-700">
                {karya.kategori}
              </div>

              {(karya.creator_id === currentUserId || isSuperAdmin) && (
                <button onClick={() => handleDelete(karya.id)} disabled={isPending} className="absolute top-3 right-3 bg-white/90 backdrop-blur text-red-500 hover:bg-red-50 p-1.5 rounded shadow-sm transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{karya.judul}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{karya.deskripsi || "Tidak ada deskripsi"}</p>
              
              <div className="flex gap-2 mb-4">
                {karya.link_demo && (
                  <a href={karya.link_demo} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 py-1.5 rounded-lg transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Demo
                  </a>
                )}
                {karya.link_repo && (
                  <a href={karya.link_repo} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 py-1.5 rounded-lg transition-colors">
                    <Github className="w-3.5 h-3.5" /> Source
                  </a>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600">
                  {karya.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-xs">
                  <span className="text-gray-500 block">Kreator</span>
                  <span className="font-semibold text-gray-900 truncate max-w-[150px] block">{karya.user.name}</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
