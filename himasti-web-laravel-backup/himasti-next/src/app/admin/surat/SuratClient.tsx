"use client";
import { useState, useTransition } from "react";
import { createSurat, deleteSurat } from "./actions";
import { Search, Upload, FileText, Trash2, Download, X, Mailbox, Send } from "lucide-react";

export default function SuratClient({ surats, isExecutive }: { surats: any[], isExecutive: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"Masuk" | "Keluar">("Masuk");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredSurats = surats.filter(s => 
    s.jenis_surat === tab &&
    (s.nomor_surat.toLowerCase().includes(search.toLowerCase()) || 
     s.perihal.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("jenis_surat", tab); // Inject current tab
    try {
      await createSurat(formData);
      setIsUploadOpen(false);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan surat");
    }
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Yakin ingin menghapus arsip surat ini?")) return;
    startTransition(async () => {
      try {
        await deleteSurat(id);
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab("Masuk")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all \${tab === "Masuk" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          <Mailbox className="w-4 h-4" /> Surat Masuk
        </button>
        <button onClick={() => setTab("Keluar")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all \${tab === "Keluar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          <Send className="w-4 h-4" /> Surat Keluar
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari nomor surat atau perihal..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isExecutive && (
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium w-full sm:w-auto justify-center"
          >
            <Upload className="w-4 h-4" /> Arsipkan Surat {tab}
          </button>
        )}
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden slide-in-from-bottom-4">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">Arsipkan Surat {tab} Baru</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat *</label>
                <input required type="text" name="nomor_surat" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none" placeholder="001/HIMASTI/VIII/2026" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perihal *</label>
                <input required type="text" name="perihal" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none" placeholder="Undangan Rapat Kerja" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Surat *</label>
                  <input required type="date" name="tanggal_surat" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{tab === "Masuk" ? "Pengirim *" : "Tujuan *"}</label>
                  <input required type="text" name="entitas" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none" placeholder={tab === "Masuk" ? "BEM Fakultas" : "Dekan Fakultas"} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Scan Surat (Opsional)</label>
                <input type="file" name="file" accept=".pdf,.png,.jpg,.jpeg" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-900 hover:file:bg-gray-100 border border-gray-200 rounded-lg p-1" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white font-semibold rounded-lg py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 mt-6">
                {loading ? "Menyimpan..." : "Simpan Arsip Surat"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Nomor & Tanggal</th>
                <th className="px-6 py-4 font-medium">Perihal</th>
                <th className="px-6 py-4 font-medium">{tab === "Masuk" ? "Pengirim" : "Tujuan"}</th>
                <th className="px-6 py-4 font-medium">Dokumen</th>
                {isExecutive && <th className="px-6 py-4 font-medium text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSurats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Belum ada arsip Surat {tab}.
                  </td>
                </tr>
              ) : filteredSurats.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono font-medium text-gray-900">{s.nomor_surat}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{new Date(s.tanggal_surat).toLocaleDateString('id-ID')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800 line-clamp-2">{s.perihal}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {tab === "Masuk" ? s.pengirim : s.tujuan}
                  </td>
                  <td className="px-6 py-4">
                    {s.file_path ? (
                      <a href={s.file_path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-gray-900 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-md transition-colors">
                        <FileText className="w-3 h-3" /> Buka
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Tidak ada lampiran</span>
                    )}
                  </td>
                  {isExecutive && (
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(s.id)} disabled={isPending} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
