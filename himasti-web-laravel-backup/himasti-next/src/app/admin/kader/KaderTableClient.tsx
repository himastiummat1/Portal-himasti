"use client";
import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, FileSpreadsheet, Eye, X, Download, Edit2, Trash2, CheckCircle2, Crown, Star, Sparkles, ChevronDown, Check } from "lucide-react";
import { updateKader, deleteKader, impersonateUser } from "./actions";
import { LogIn } from "lucide-react";
import { FRAMES, TITLES, THEMES, NAME_EFFECTS } from "@/lib/profileCustomization";

export interface KaderItem {
  id: number;
  user_id: number;
  nama: string;
  email: string;
  nim: string | null;
  angkatan: string;
  no_hp: string;
  jenis_kelamin: string;
  role: string;
  asal_sekolah?: string | null;
  hobi?: string | null;
  alamat?: string | null;
  xp: number;
  custom_frame?: string;
  custom_title?: string;
  custom_theme?: string;
  custom_name_effect?: string;
}

export default function KaderTableClient({ 
  kaders,
  isSuperAdmin = false
}: { 
  kaders: KaderItem[];
  isSuperAdmin?: boolean;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedKader, setSelectedKader] = useState<KaderItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = kaders.filter(k => {
    const s = search.toLowerCase();
    const nama = (k.nama || "").toLowerCase();
    const nim = (k.nim || "").toLowerCase();
    const angkatan = (k.angkatan || "").toLowerCase();
    const email = (k.email || "").toLowerCase();
    return nama.includes(s) || nim.includes(s) || angkatan.includes(s) || email.includes(s);
  });

  const exportData = (type: "excel" | "csv") => {
    // delimiter: ';' for Indonesian Windows Excel (avoids Column A collapse), ',' for universal CSV
    const delimiter = type === "excel" ? ";" : ",";
    
    const headers = [
      "No",
      "ID",
      "Nama Lengkap",
      "NIM",
      "Email",
      "Angkatan",
      "No HP",
      "Jenis Kelamin",
      "Role",
      "Gelar",
      "XP",
      "Alamat",
      "Asal Sekolah",
      "Hobi"
    ];

    const formatCell = (val: unknown, isTextFormula = false) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/\r?\n/g, " ").trim();
      const escaped = str.replace(/"/g, '""');
      
      // Khusus NIM dan Nomor HP:
      // Di Microsoft Excel, format ="value" memvalidasi cell sebagai teks formula
      // sehingga angka 0 di depan (08...) TIDAK hilang dan NIM 14-digit TIDAK menjadi notasi ilmiah
      if (isTextFormula && /^[0-9+]+$/.test(str)) {
        return `"=""${escaped}"""`;
      }
      return `"${escaped}"`;
    };

    const rows = filtered.map((k, idx) => {
      const titleObj = TITLES.find(t => t.id === k.custom_title) || TITLES[0];
      return [
        formatCell(idx + 1),
        formatCell(k.id),
        formatCell(k.nama),
        formatCell(k.nim, true),
        formatCell(k.email),
        formatCell(k.angkatan),
        formatCell(k.no_hp, true),
        formatCell(k.jenis_kelamin),
        formatCell(k.role),
        formatCell(titleObj.name),
        formatCell(k.xp ?? 50),
        formatCell(k.alamat || "-"),
        formatCell(k.asal_sekolah || "-"),
        formatCell(k.hobi || "-")
      ].join(delimiter);
    });

    // \uFEFF adalah UTF-8 Byte Order Mark (BOM) agar Microsoft Excel di Windows
    // otomatis mendeteksi encoding UTF-8 (mencegah karakter rusak/mojibake)
    const csvContent = "\uFEFF" + [
      headers.map(h => formatCell(h)).join(delimiter),
      ...rows
    ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    const dateStr = new Date().toISOString().split("T")[0];
    const fileSuffix = type === "excel" ? "Excel_Windows" : "Universal_CSV";
    link.download = `Data_Kader_HIMASTI_${fileSuffix}_${dateStr}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowExportMenu(false);
    setExportSuccessMsg(type === "excel" ? `Berhasil unduh Excel (${filtered.length} Kader)` : `Berhasil unduh CSV (${filtered.length} Kader)`);
    setTimeout(() => setExportSuccessMsg(null), 3000);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedKader) return;
    const formData = new FormData(e.currentTarget);
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
        router.push("/admin");
        router.refresh();
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
            placeholder="Cari Nama, NIM, Email, atau Angkatan..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative w-full sm:w-auto flex items-center gap-2" ref={dropdownRef}>
          {exportSuccessMsg ? (
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-2 rounded-lg text-xs font-semibold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              {exportSuccessMsg}
            </div>
          ) : (
            <div className="inline-flex rounded-lg shadow-sm border border-gray-200 bg-white w-full sm:w-auto">
              <button 
                onClick={() => exportData("excel")}
                title="Download langsung dalam format siap buka Microsoft Excel"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors rounded-l-lg border-r border-gray-200 flex-1 sm:flex-initial justify-center"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export Excel</span>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-mono px-1.5 py-0.5 rounded">
                  {filtered.length}
                </span>
              </button>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-2 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-r-lg"
                title="Pilihan format ekspor"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {showExportMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1.5 text-xs animate-in fade-in zoom-in-95">
              <div className="px-2.5 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Pilih Format Ekspor
              </div>
              <button
                onClick={() => exportData("excel")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-start gap-2.5 transition-colors group"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    Excel Windows (.csv)
                    <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                      Rekomendasi
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                    Pemisah titik-koma (;). Langsung rapi terbagi kolom saat dibuka di MS Excel Indonesia.
                  </p>
                </div>
              </button>

              <button
                onClick={() => exportData("csv")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-start gap-2.5 transition-colors group mt-1"
              >
                <Download className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">
                    Universal CSV (.csv)
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                    Pemisah koma (,). Standar RFC-4180 untuk Google Sheets, Mac Numbers, & script database.
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Mahasiswa</th>
                <th className="px-6 py-4 font-medium">NIM</th>
                <th className="px-6 py-4 font-medium">Angkatan</th>
                <th className="px-6 py-4 font-medium">Gelar & XP</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((k) => {
                const titleObj = TITLES.find(t => t.id === k.custom_title) || TITLES[0];
                return (
                  <tr key={k.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{k.nama}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{k.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">{k.nim}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{k.angkatan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md w-fit">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {titleObj.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          {k.xp ?? 50} XP
                        </span>
                      </div>
                    </td>
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
                );
              })}
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
            <form onSubmit={handleUpdate} className="p-5 sm:p-6 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8 text-center sm:text-left">
                <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(selectedKader.nama)}`} alt="Avatar" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-gray-200/50 shadow-sm shrink-0 bg-gray-50" />
                <div className="space-y-1 w-full min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{selectedKader.nama}</h2>
                  <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start mt-2">
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

              {/* Profil & Gaya Kustomisasi Overview (View Mode) */}
              {!isEditing && (
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Kustomisasi Gaya & Poin XP
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">GELAR</span>
                      <span className="font-bold text-slate-800">
                        {TITLES.find(t => t.id === selectedKader.custom_title)?.name || "Kader Biasa"}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">BINGKAI</span>
                      <span className="font-bold text-slate-800">
                        {FRAMES.find(f => f.id === selectedKader.custom_frame)?.name || "Klasik"}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">TEMA KARTU</span>
                      <span className="font-bold text-slate-800">
                        {THEMES.find(th => th.id === selectedKader.custom_theme)?.name || "Default"}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">TOTAL POIN</span>
                      <span className="font-bold text-amber-600 font-mono">
                        {selectedKader.xp ?? 50} XP
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Super Admin Override: Customization Studio Panel */}
              {isEditing && isSuperAdmin && (
                <div className="bg-gradient-to-br from-amber-500/10 via-violet-500/10 to-cyan-500/10 border-2 border-amber-400/50 rounded-2xl p-5 mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-widest">
                      <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                      Hak Otoritas Super Admin: Anugerah Gelar & Tema
                    </div>
                    <span className="text-[10px] font-mono bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-bold">
                      ROOT PRIVILEGE
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sebagai <strong>Super Admin</strong>, Anda memiliki wewenang mutlak untuk memberikan tema profil khusus, gelar kehormatan, dan bingkai avatar kepada kader ini (baik anggota maupun pengurus/admin lainnya), serta menetapkan saldo poin XP mereka secara instan.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* 1. Bingkai Avatar */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Bingkai Avatar (Frame)</label>
                      <select 
                        name="custom_frame"
                        defaultValue={selectedKader.custom_frame || "none"}
                        className="w-full border border-slate-200 p-2.5 rounded-lg text-xs bg-white text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
                      >
                        {FRAMES.map(f => (
                          <option key={f.id} value={f.id}>{f.name} ({f.minXp} XP)</option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Gelar Kehormatan */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Gelar Kehormatan (Title)</label>
                      <select 
                        name="custom_title"
                        defaultValue={selectedKader.custom_title || "kader"}
                        className="w-full border border-slate-200 p-2.5 rounded-lg text-xs bg-white text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
                      >
                        {TITLES.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.minXp} XP)</option>
                        ))}
                      </select>
                    </div>

                    {/* 3. Tema Kartu Profil */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Tema Kartu Profil (Theme)</label>
                      <select 
                        name="custom_theme"
                        defaultValue={selectedKader.custom_theme || "default"}
                        className="w-full border border-slate-200 p-2.5 rounded-lg text-xs bg-white text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
                      >
                        {THEMES.map(th => (
                          <option key={th.id} value={th.id}>{th.name} ({th.minXp} XP)</option>
                        ))}
                      </select>
                    </div>

                    {/* 4. Efek Tipografi Nama */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Efek Tipografi Nama</label>
                      <select 
                        name="custom_name_effect"
                        defaultValue={selectedKader.custom_name_effect || "plain"}
                        className="w-full border border-slate-200 p-2.5 rounded-lg text-xs bg-white text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
                      >
                        {NAME_EFFECTS.map(ne => (
                          <option key={ne.id} value={ne.id}>{ne.name} ({ne.minXp} XP)</option>
                        ))}
                      </select>
                    </div>

                    {/* 5. Set Poin XP */}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Tetapkan Total Poin XP Kader</label>
                      <input 
                        type="number" 
                        name="xp" 
                        defaultValue={selectedKader.xp ?? 50} 
                        className="w-full border border-slate-200 p-2.5 rounded-lg text-xs bg-white text-slate-800 font-mono font-bold focus:ring-2 focus:ring-amber-500 outline-none shadow-sm" 
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Super Admin dapat menambahkan atau menetapkan poin XP kader ini secara langsung tanpa perlu menyelesaikan challenge.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isEditing && isSuperAdmin && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Ubah Role / Jabatan (Khusus Super Admin)</h4>
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">ROOT ACCESS</span>
                  </div>
                  <select 
                    name="role_name"
                    defaultValue={selectedKader.role}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none bg-white text-gray-900 font-medium"
                  >
                    <option value="kader">Kader Biasa</option>
                    <optgroup label="Pengurus Inti (BPH Khusus)">
                      <option value="ketua_himpunan">Ketua Himpunan</option>
                      <option value="wakil_ketua">Wakil Ketua Himpunan</option>
                      <option value="sekretaris_umum">Sekretaris Umum</option>
                      <option value="bendahara_umum">Bendahara Umum</option>
                    </optgroup>
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
                    <optgroup label="Bidang Lainnya (Kabid & Anggota)">
                      <option value="kabid_kemuhammadiyahan">Kabid Kemuhammadiyahan</option>
                      <option value="anggota_kemuhammadiyahan">Anggota Kemuhammadiyahan</option>
                      <option value="kabid_keorganisasian">Kabid Keorganisasian</option>
                      <option value="anggota_keorganisasian">Anggota Keorganisasian</option>
                      <option value="kabid_kewirausahaan">Kabid Kewirausahaan</option>
                      <option value="anggota_kewirausahaan">Anggota Kewirausahaan</option>
                      <option value="kabid_mikat">Kabid Minat Bakat (Mikat)</option>
                      <option value="anggota_mikat">Anggota Minat Bakat (Mikat)</option>
                      <option value="kabid_aksi_advokasi">Kabid Aksi & Advokasi</option>
                      <option value="anggota_aksi_advokasi">Anggota Aksi & Advokasi</option>
                      <option value="anggota_bidang">Anggota Bidang (Umum)</option>
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
