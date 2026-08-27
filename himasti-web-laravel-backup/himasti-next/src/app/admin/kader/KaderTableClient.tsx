"use client";
import { useState } from "react";
import { Search, FileSpreadsheet, Eye, X, Download } from "lucide-react";

export default function KaderTableClient({ kaders }: { kaders: any[] }) {
  const [search, setSearch] = useState("");
  const [selectedKader, setSelectedKader] = useState<any | null>(null);

  const filtered = kaders.filter(k => 
    k.nama.toLowerCase().includes(search.toLowerCase()) || 
    k.nim.toLowerCase().includes(search.toLowerCase()) ||
    k.angkatan.toLowerCase().includes(search.toLowerCase())
  );
  const exportCSV = () => {
    const headers = ["ID", "Nama Lengkap", "NIM", "Email", "Angkatan", "No HP", "Jenis Kelamin", "Role", "Asal Sekolah", "Hobi"];
    const rows = filtered.map(k => [
      k.id,
      k.nama,
      k.nim,
      k.email,
      k.angkatan,
      k.no_hp,
      k.jenis_kelamin,
      k.role,
      k.asal_sekolah || "-",
      k.hobi || "-"
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(cell => `"${cell}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Kader_HIMASTI_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan Nama, NIM, atau Angkatan..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium w-full sm:w-auto justify-center"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-[10px] sm:text-xs tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-medium">Biodata Utama</th>
                <th className="px-4 sm:px-6 py-4 font-medium hidden sm:table-cell">Kontak</th>
                <th className="px-4 sm:px-6 py-4 font-medium hidden md:table-cell">Status Organisasi</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    Tidak ada data kader yang cocok.
                  </td>
                </tr>
              ) : filtered.map((k) => (
                <tr key={k.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold shrink-0 hidden sm:flex">
                        {k.nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{k.nama}</div>
                        <div className="text-gray-500 font-mono text-xs mt-0.5">{k.nim} • Angkt. {k.angkatan}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                    <div className="text-gray-800">{k.no_hp}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{k.email}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                    <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-200">
                      {k.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedKader(k)} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-600 text-gray-600 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedKader && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden slide-in-from-bottom-4 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 sticky top-0">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Berkas Biodata Kader</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {selectedKader.nim}</p>
              </div>
              <button onClick={() => setSelectedKader(null)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">Nama Lengkap</span>
                  <p className="font-medium text-gray-900">{selectedKader.nama}</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 block">Angkatan</span>
                  <p className="font-medium text-gray-900">{selectedKader.angkatan}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Informasi Kontak & Alamat</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-0.5">Email</span>
                    <span className="font-medium text-gray-900">{selectedKader.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">Nomor HP/WA</span>
                    <span className="font-medium text-gray-900">{selectedKader.no_hp}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 block mb-0.5">Alamat Domisili</span>
                    <span className="font-medium text-gray-900 leading-relaxed">{selectedKader.alamat || "Belum diisi"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Latar Belakang</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-0.5">Asal Sekolah</span>
                    <span className="font-medium text-gray-900">{selectedKader.asal_sekolah || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">Jenis Kelamin</span>
                    <span className="font-medium text-gray-900">{selectedKader.jenis_kelamin || "-"}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 block mb-0.5">Hobi / Minat</span>
                    <span className="font-medium text-gray-900">{selectedKader.hobi || "-"}</span>
                  </div>
                </div>
              </div>

              {/* UBAH ROLE (Khusus Super Admin) */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6">
                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-3">Manajemen Hak Akses (Role)</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select 
                    id="roleSelect"
                    defaultValue={selectedKader.role} 
                    className="flex-1 bg-white border border-blue-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kader">Kader Biasa</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="ketua_umum">Ketua Umum</option>
                    <option value="sekretaris">Sekretaris Umum</option>
                    <option value="bendahara">Bendahara Umum</option>
                    <option value="kabid_kaderisasi">Kabid Kaderisasi</option>
                    <option value="kabid_humas">Kabid Humas</option>
                    <option value="admin_sekretariat">Admin Sekretariat</option>
                  </select>
                  <button 
                    onClick={async () => {
                      const newRole = (document.getElementById('roleSelect') as HTMLSelectElement).value;
                      if(newRole === selectedKader.role) return;
                      const res = await fetch('/api/admin/kader/role', {
                        method: 'POST', body: JSON.stringify({ userId: selectedKader.user_id, newRoleName: newRole })
                      });
                      if(res.ok) {
                        alert('Berhasil mengubah role! Silakan refresh halaman.');
                        window.location.reload();
                      } else {
                        alert('Gagal mengubah role. (Pastikan Anda Super Admin)');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Terapkan Role
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setSelectedKader(null)} className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                Tutup Berkas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
