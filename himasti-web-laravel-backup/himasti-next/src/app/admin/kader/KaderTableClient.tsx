"use client";
import { useState, useTransition } from "react";
import { Search, FileSpreadsheet, Eye, X, Download, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { updateKader, deleteKader, impersonateUser } from "./actions";
import { LogIn } from "lucide-react";

export default function KaderTableClient({ kaders }: { kaders: any[] }) {
  const [search, setSearch] = useState("");
  const [selectedKader, setSelectedKader] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      const res = await updateKader(selectedKader.user_id, formData);
      if (res.success) {
        alert("Data berhasil disimpan! Email login & role telah disinkronkan.");
        window.location.reload();
      } else {
        alert(res.error);
      }
    });
  };

  const handleImpersonate = async (userId: number) => {
    if (!confirm("Login sebagai kader ini? (Anda akan mendapatkan akses sesuai jabatan mereka untuk sementara waktu)")) return;
    startTransition(async () => {
      const res = await impersonateUser(userId);
      if (res.success) {
        window.location.href = "/admin"; // Redirect to dashboard to reload session
      } else {
        alert(res.error);
      }
    });
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("PERINGATAN: Menghapus data ini juga akan menghapus akun login kader tersebut secara permanen. Lanjutkan?")) return;
    startTransition(async () => {
      const res = await deleteKader(userId);
      if (res.success) {
        alert("Akun kader berhasil dihapus permanen.");
        window.location.reload();
      } else {
        alert(res.error);
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
            placeholder="Cari berdasarkan Nama, NIM, atau Angkatan..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 bg-gray-50 text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium w-full sm:w-auto justify-center"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Mahasiswa</th>
                <th className="px-6 py-4 font-medium">NIM</th>
                <th className="px-6 py-4 font-medium">Angkatan</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((k) => (
                <tr key={k.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{k.nama}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{k.email}</div>
                  </td>
                  <td className="px-6 py-4 font-mono">{k.nim}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{k.angkatan}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-900 border border-gray-100">
                      {k.role.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setSelectedKader(k); setIsEditing(false); }}
                      className="text-gray-900 hover:text-gray-900 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Lihat Berkas
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedKader && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden slide-in-from-bottom-4 border border-gray-100">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Berkas Biodata Kader</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {selectedKader.id.toString().padStart(8, '0')}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleImpersonate(selectedKader.user_id)} className="p-2 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors" title="Login Sebagai Akun Ini">
                  <LogIn className="w-5 h-5" />
                </button>
                <button onClick={() => setIsEditing(!isEditing)} className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}>
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(selectedKader.user_id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <button onClick={() => { setSelectedKader(null); setIsEditing(false); }} className="text-gray-400 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5"/>
                </button>
              </div>
            </div>

            {/* Content Modal */}
            <form onSubmit={handleUpdate} className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="flex items-start gap-6 mb-8">
                <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(selectedKader.nama)}`} alt="Avatar" className="w-24 h-24 rounded-2xl border border-gray-200/50 shadow-sm shrink-0 bg-gray-50" />
                <div className="space-y-1 w-full">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedKader.nama}</h2>
                  <div className="flex flex-wrap gap-2 items-center mt-2">
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-900 text-xs font-bold rounded-md border border-gray-100">
                      NIM. {selectedKader.nim}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-900 text-xs font-bold rounded-md border border-gray-100">
                      Angkatan {selectedKader.angkatan}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Alamat Email (Akun Login)</label>
                  {isEditing ? (
                    <input type="email" name="email" defaultValue={selectedKader.email} className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none" required />
                  ) : (
                    <div className="text-gray-900 font-medium">{selectedKader.email}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Nomor WhatsApp</label>
                  {isEditing ? (
                    <input type="text" name="no_hp" defaultValue={selectedKader.no_hp} className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none" />
                  ) : (
                    <div className="text-gray-900 font-medium">{selectedKader.no_hp}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Jenis Kelamin</label>
                  {isEditing ? (
                    <select name="jenis_kelamin" defaultValue={selectedKader.jenis_kelamin} className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none">
                      <option value="">Pilih</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  ) : (
                    <div className="text-gray-900 font-medium">{selectedKader.jenis_kelamin === 'L' ? 'Laki-laki' : selectedKader.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Role Saat Ini</label>
                  <div className="text-gray-900 font-medium uppercase">{selectedKader.role.replace(/_/g, ' ')}</div>
                </div>
              </div>

              {isEditing && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mt-8">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Ubah Role / Jabatan</h4>
                  <select 
                    name="role_name"
                    defaultValue={selectedKader.role}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none bg-white text-gray-900 font-medium"
                  >
                    <option value="kader">Kader Biasa</option>
                    <option value="ketua_himpunan">Ketua Himpunan</option>
                    <option value="wakil_ketua">Wakil Ketua</option>
                    <option value="sekretaris_umum">Sekretaris Umum</option>
                    <option value="bendahara_umum">Bendahara Umum</option>
                    <optgroup label="Bidang Pengkaderan (Kaderisasi)">
                      <option value="kabid_pengkaderan">Kabid Pengkaderan</option>
                      <option value="anggota_pengkaderan">Anggota Pengkaderan</option>
                    </optgroup>
                    <optgroup label="Bidang Kominfo (Metkom)">
                      <option value="kabid_metkom">Kabid Metkom</option>
                      <option value="anggota_metkom">Anggota Metkom</option>
                    </optgroup>
                    <optgroup label="Bidang Litbang (R&D)">
                      <option value="kabid_litbang">Kabid Litbang</option>
                      <option value="anggota_litbang">Anggota Litbang</option>
                    </optgroup>
                    <optgroup label="Bidang Humas">
                      <option value="kabid_humas">Kabid Humas</option>
                      <option value="anggota_humas">Anggota Humas</option>
                    </optgroup>
                    <optgroup label="Bidang Lainnya">
                      <option value="kabid_kemuhammadiyahan">Kabid Kemuhammadiyahan</option>
                      <option value="kabid_keorganisasian">Kabid Keorganisasian</option>
                      <option value="kabid_kewirausahaan">Kabid Kewirausahaan</option>
                      <option value="kabid_mikat">Kabid Minat Bakat (Mikat)</option>
                      <option value="kabid_aksi_advokasi">Kabid Aksi & Advokasi</option>
                    </optgroup>
                    <optgroup label="Lain-lain">
                      <option value="panitia_sementara">Panitia Sementara</option>
                      <option value="demisioner">Demisioner</option>
                    </optgroup>
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => { setSelectedKader(null); setIsEditing(false); }} className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  Tutup
                </button>
                {isEditing && (
                  <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50">
                    <CheckCircle2 className="w-4 h-4" />
                    {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                )}
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
