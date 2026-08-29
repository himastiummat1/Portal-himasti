"use client";

import { useState, useMemo } from "react";
import { Plus, Wallet, TrendingUp, TrendingDown, Calendar, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend
} from "recharts";

type RecordType = {
  id: number;
  tipe: string;
  jumlah: number;
  tanggal: string;
  keterangan: string | null;
};

export default function KeuanganClient({ records, isExecutive }: { records: RecordType[], isExecutive: boolean }) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
  };

  const totalPemasukan = records.filter(r => r.tipe === "pemasukan").reduce((sum, r) => sum + r.jumlah, 0);
  const totalPengeluaran = records.filter(r => r.tipe === "pengeluaran").reduce((sum, r) => sum + r.jumlah, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  // Prepare data for chart: group by Date and sum
  const chartData = useMemo(() => {
    // Sort records by date ascending
    const sorted = [...records].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
    const grouped = new Map<string, { date: string, Pemasukan: number, Pengeluaran: number }>();
    
    sorted.forEach(r => {
      // Just take YYYY-MM-DD
      const dateStr = r.tanggal.split('T')[0];
      if (!grouped.has(dateStr)) {
        grouped.set(dateStr, { date: dateStr, Pemasukan: 0, Pengeluaran: 0 });
      }
      const data = grouped.get(dateStr)!;
      if (r.tipe === 'pemasukan') data.Pemasukan += r.jumlah;
      else data.Pengeluaran += r.jumlah;
    });

    return Array.from(grouped.values());
  }, [records]);


  // (Keep the existing API handler logic for add/edit/delete)
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isExecutive) return;
    setIsSubmitting(true);
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/keuangan", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setIsAddModalOpen(false);
      router.refresh();
    } catch (err: any) { setErrorMsg(err.message); } 
    finally { setIsSubmitting(false); }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isExecutive || !editingRecord) return;
    setIsSubmitting(true);
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/keuangan/${editingRecord.id}`, {
        method: "PUT",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Gagal mengubah data");
      setIsEditModalOpen(false);
      router.refresh();
    } catch (err: any) { setErrorMsg(err.message); } 
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!isExecutive || !confirm("Yakin ingin menghapus transaksi ini?")) return;
    try {
      const res = await fetch(`/api/keuangan/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } catch (err) { alert("Gagal menghapus"); }
  };

  const openEditModal = (r: RecordType) => {
    if (!isExecutive) return;
    setEditingRecord(r);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Kas & Keuangan</h1>
          <p className="text-sm text-slate-500 mt-1">Sistem Pemantauan Aliran Dana Organisasi HIMASTI.</p>
        </div>
        {isExecutive && (
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-sm font-medium text-sm">
            <Plus className="w-4 h-4" /> Catat Transaksi
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-medium text-slate-500">Saldo Kas Tersedia</h3>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Wallet className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-slate-800 relative z-10 tracking-tight">
            {formatRupiah(saldo)}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-sky-200 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-medium text-slate-500">Total Pemasukan</h3>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800 relative z-10 tracking-tight">
            {formatRupiah(totalPemasukan)}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-rose-200 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-medium text-slate-500">Total Pengeluaran</h3>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><TrendingDown className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800 relative z-10 tracking-tight">
            {formatRupiah(totalPengeluaran)}
          </div>
        </div>
      </div>

      {/* GRAPH CHART */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-6 flex items-center gap-2">
           <TrendingUp className="w-4 h-4 text-slate-500" /> Analisis Arus Kas
        </h3>
        <div className="w-full h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(value) => `Rp${value/1000}k`} />
                <Tooltip 
                  formatter={(value: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Pemasukan" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={50} />
                <Bar dataKey="Pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-mono bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
               Belum ada data untuk ditampilkan.
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" /> Riwayat Transaksi
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-white text-xs uppercase text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4 text-right">Pemasukan</th>
                <th className="px-6 py-4 text-right">Pengeluaran</th>
                {isExecutive && <th className="px-6 py-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {new Date(record.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{record.keterangan}</td>
                    <td className="px-6 py-4 text-right">
                       {record.tipe === 'pemasukan' ? <span className="text-sky-600 font-medium">{formatRupiah(record.jumlah)}</span> : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                       {record.tipe === 'pengeluaran' ? <span className="text-rose-600 font-medium">{formatRupiah(record.jumlah)}</span> : '-'}
                    </td>
                    {isExecutive && (
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button onClick={() => openEditModal(record)} className="text-slate-400 hover:text-slate-900 font-medium mr-4 transition-colors">Edit</button>
                        <button onClick={() => handleDelete(record.id)} className="text-rose-400 hover:text-rose-600 font-medium transition-colors">Hapus</button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isExecutive ? 5 : 4} className="px-6 py-12 text-center text-slate-400 font-mono text-xs uppercase tracking-widest">
                    Tidak ada transaksi tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* (MODALS KEPT EXACTLY THE SAME, JUST STYLING UPDATED) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-slate-200">
              <div className="px-6 pt-6 pb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Catat Transaksi Baru</h3>
                {errorMsg && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700">{errorMsg}</div>
                )}
                <form onSubmit={handleAddSubmit} id="addForm" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tipe</label>
                      <select name="tipe" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all">
                        <option value="pemasukan">Pemasukan (Uang Masuk)</option>
                        <option value="pengeluaran">Pengeluaran (Uang Keluar)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tanggal</label>
                      <input type="date" name="tanggal" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Jumlah (Rp)</label>
                    <input type="number" name="jumlah" required min="1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" placeholder="Contoh: 50000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Keterangan</label>
                    <textarea name="keterangan" required rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" placeholder="Detail transaksi..."></textarea>
                  </div>
                </form>
              </div>
              <div className="bg-slate-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-100">
                <button type="submit" form="addForm" disabled={isSubmitting} className="px-6 py-2 bg-slate-900 text-white font-medium text-sm rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50">
                  {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting} className="px-6 py-2 bg-white text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-50 transition-colors border border-slate-200">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsEditModalOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-slate-200">
              <div className="px-6 pt-6 pb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Edit Transaksi</h3>
                {errorMsg && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700">{errorMsg}</div>
                )}
                <form onSubmit={handleEditSubmit} id="editForm" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tipe</label>
                      <select name="tipe" defaultValue={editingRecord.tipe} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all">
                        <option value="pemasukan">Pemasukan (Uang Masuk)</option>
                        <option value="pengeluaran">Pengeluaran (Uang Keluar)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tanggal</label>
                      <input type="date" name="tanggal" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" defaultValue={editingRecord.tanggal.split('T')[0]} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Jumlah (Rp)</label>
                    <input type="number" name="jumlah" required min="1" defaultValue={editingRecord.jumlah} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Keterangan</label>
                    <textarea name="keterangan" required rows={2} defaultValue={editingRecord.keterangan || ""} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"></textarea>
                  </div>
                </form>
              </div>
              <div className="bg-slate-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-100">
                <button type="submit" form="editForm" disabled={isSubmitting} className="px-6 py-2 bg-slate-900 text-white font-medium text-sm rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50">
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting} className="px-6 py-2 bg-white text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-50 transition-colors border border-slate-200">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
