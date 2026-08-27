"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { addKeuangan, deleteKeuangan, updateKeuangan } from "./actions";

type KeuanganRecord = {
  id: number;
  tipe: string;
  jumlah: number;
  tanggal: string;
  keterangan: string | null;
};

export default function KeuanganClient({ records }: { records: KeuanganRecord[] }) {
  const [filterType, setFilterType] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingRecord, setEditingRecord] = useState<KeuanganRecord | null>(null);

  // Filter records
  const filteredRecords = records.filter(record => {
    if (filterType === "all") return true;
    return record.tipe === filterType;
  });

  // Calculate totals
  const totalPemasukan = records.filter(r => r.tipe === "pemasukan").reduce((sum, r) => sum + r.jumlah, 0);
  const totalPengeluaran = records.filter(r => r.tipe === "pengeluaran").reduce((sum, r) => sum + r.jumlah, 0);
  const saldoAkhir = totalPemasukan - totalPengeluaran;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  
  // Siapkan data grafik per bulan
  const chartData = useMemo(() => {
    const dataMap: Record<string, { name: string; Pemasukan: number; Pengeluaran: number }> = {};
    records.forEach(r => {
      const date = new Date(r.tanggal);
      const monthYear = date.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
      if (!dataMap[monthYear]) {
        dataMap[monthYear] = { name: monthYear, Pemasukan: 0, Pengeluaran: 0 };
      }
      if (r.tipe === 'pemasukan') dataMap[monthYear].Pemasukan += r.jumlah;
      else dataMap[monthYear].Pengeluaran += r.jumlah;
    });
    return Object.values(dataMap);
  }, [records]);

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat("id-ID", { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(isoString));
  };

  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await addKeuangan(formData);

    if (result.success) {
      setIsAddModalOpen(false);
    } else {
      setErrorMsg(result.error || "Gagal menambah data");
    }
    
    setIsSubmitting(false);
  }

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingRecord) return;
    
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await updateKeuangan(editingRecord.id, formData);

    if (result.success) {
      setIsEditModalOpen(false);
      setEditingRecord(null);
    } else {
      setErrorMsg(result.error || "Gagal mengupdate data");
    }
    
    setIsSubmitting(false);
  }

  async function handleDelete(id: number) {
    if (!confirm(`Apakah Anda yakin ingin menghapus data keuangan ini?`)) return;
    
    const result = await deleteKeuangan(id);
    if (!result.success) {
      alert(result.error || "Gagal menghapus data");
    }
  }

  function openEditModal(record: KeuanganRecord) {
    setEditingRecord(record);
    setIsEditModalOpen(true);
    setErrorMsg("");
  }

  return (
    <div className="space-y-6">
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pemasukan</h3>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{formatRupiah(totalPemasukan)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pengeluaran</h3>
          <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">{formatRupiah(totalPengeluaran)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Akhir (Kas)</h3>
          <p className={`mt-2 text-3xl font-bold ${saldoAkhir >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatRupiah(saldoAkhir)}
          </p>
        </div>
      </div>


      {/* DIAGRAM KEUANGAN */}
      {records.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Grafik Arus Kas (Per Bulan)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(val) => `Rp${(val/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => formatRupiah(value)}
                  contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Pemasukan" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* MAIN TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden relative">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold dark:text-white">Buku Kas & Keuangan</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola data pemasukan dan pengeluaran organisasi.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full sm:w-auto py-2 px-3 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            >
              <option value="all">Semua Data</option>
              <option value="pemasukan">Hanya Pemasukan</option>
              <option value="pengeluaran">Hanya Pengeluaran</option>
            </select>

            <button onClick={() => { setIsAddModalOpen(true); setErrorMsg(""); }} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition w-full sm:w-auto text-center whitespace-nowrap">
              + Catat Transaksi
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipe
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Keterangan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Jumlah
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(record.tanggal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.tipe === 'pemasukan' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                      }`}>
                        {record.tipe.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                      {record.keterangan || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                          record.tipe === 'pemasukan' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                      {record.tipe === 'pemasukan' ? '+' : '-'} {formatRupiah(record.jumlah)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(record)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">Edit</button>
                      <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Hapus</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada transaksi tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
            <div className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Catat Transaksi Baru</h3>
                
                {errorMsg && (
                  <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
                    <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleAddSubmit} id="addForm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label>
                        <select name="tipe" className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md">
                          <option value="pemasukan">Pemasukan</option>
                          <option value="pengeluaran">Pengeluaran</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
                        <input type="date" name="tanggal" required className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md" defaultValue={new Date().toISOString().split('T')[0]} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah (Rp)</label>
                      <input type="number" name="jumlah" required min="1" className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md" placeholder="50000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Keterangan</label>
                      <textarea name="keterangan" required rows={2} className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md" placeholder="Detail transaksi..."></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse">
                <button type="submit" form="addForm" disabled={isSubmitting} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {isEditModalOpen && editingRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsEditModalOpen(false)}></div>
            <div className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Transaksi</h3>
                
                {errorMsg && (
                  <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
                    <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleEditSubmit} id="editForm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label>
                        <select name="tipe" defaultValue={editingRecord.tipe} className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md">
                          <option value="pemasukan">Pemasukan</option>
                          <option value="pengeluaran">Pengeluaran</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
                        <input type="date" name="tanggal" defaultValue={editingRecord.tanggal.split('T')[0]} required className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah (Rp)</label>
                      <input type="number" name="jumlah" defaultValue={editingRecord.jumlah} required min="1" className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Keterangan</label>
                      <textarea name="keterangan" defaultValue={editingRecord.keterangan || ""} required rows={2} className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse">
                <button type="submit" form="editForm" disabled={isSubmitting} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
