"use client";
import { useState } from "react";
import { addMerch, deleteMerch } from "./actions";

export default function MerchClient({ records }: { records: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const result = await addMerch(new FormData(e.target));
    if (result.success) setIsOpen(false);
    else alert(result.error);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white  rounded-lg shadow-sm">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-bold ">Katalog Merchandise (Danus)</h2>
          <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm">+ Tambah Produk</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {records.map(r => (
            <div key={r.id} className="border rounded-lg overflow-hidden bg-gray-50  shadow-sm">
              <div className="h-40 bg-gray-200  flex items-center justify-center text-gray-400">PDIH (Gambar Belum)</div>
              <div className="p-4">
                <h3 className="font-bold text-lg ">{r.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{r.description}</p>
                <button onClick={() => deleteMerch(r.id)} className="text-red-500 text-xs font-semibold w-full text-right border-t pt-3 mt-3">Hapus Produk</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white  p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4 ">Tambah Produk Danus</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" required placeholder="Nama Produk (Misal: Kaos PDH)" className="w-full p-2 border rounded" />
              <textarea name="description" required placeholder="Deskripsi & Harga" className="w-full p-2 border rounded" rows={3}></textarea>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
