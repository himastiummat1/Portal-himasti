"use client";

import { useState } from "react";
import { addArtikel, deleteArtikel, updateArtikelStatus } from "./actions";

type ArtikelRecord = {
  id: number;
  title: string;
  description: string;
  link: string | null;
  status: string;
  created_at: string;
};

export default function ArtikelClient({ records }: { records: ArtikelRecord[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await addArtikel(new FormData(e.currentTarget));
    if (result.success) setIsAddModalOpen(false);
    else alert(result.error);
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white  rounded-lg shadow-sm overflow-hidden relative">
        <div className="p-6 border-b border-gray-200  flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold ">Publikasi Artikel</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola konten artikel dan berita himpunan.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800">
            + Tulis Artikel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50 ">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul & Cuplikan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
              {records.map(record => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900  mb-1">{record.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-2 max-w-md">{record.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.status === 'Draft' ? (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Draft</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Dipublikasikan</span>
                    )}
                    <div className="mt-2 text-xs text-gray-900 cursor-pointer" onClick={() => updateArtikelStatus(record.id, record.status === 'Draft' ? 'Published' : 'Draft')}>
                      Ubah Status
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteArtikel(record.id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsAddModalOpen(false)}></div>
            <div className="relative z-10 w-full max-w-2xl bg-white  rounded-lg p-6">
              <h3 className="text-lg font-medium  mb-4">Tulis Artikel Baru</h3>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm ">Judul Artikel</label>
                  <input type="text" name="title" required className="mt-1 p-2 w-full border rounded-md   " />
                </div>
                <div>
                  <label className="block text-sm ">Isi Konten (Teks / HTML)</label>
                  <textarea name="description" required rows={6} className="mt-1 p-2 w-full border rounded-md   "></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm ">Tautan / Link Gambar (Opsional)</label>
                    <input type="url" name="link" className="mt-1 p-2 w-full border rounded-md   " />
                  </div>
                  <div>
                    <label className="block text-sm ">Status Awal</label>
                    <select name="status" className="mt-1 p-2 w-full border rounded-md   ">
                      <option value="Draft">Simpan sbg Draft</option>
                      <option value="Published">Langsung Publikasikan</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-gray-900 text-white rounded-md">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
