"use client";
import { useState } from "react";
import { addKlub, deleteKlub } from "./actions";

export default function KlubClient({ records }: { records: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const result = await addKlub(new FormData(e.target));
    if (result.success) setIsOpen(false);
    else alert(result.error);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white  rounded-lg shadow-sm">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-bold ">Klub IT & Minat Bakat</h2>
          <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">+ Tambah Klub</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map(r => (
            <div key={r.id} className="border p-4 rounded-lg bg-gray-50  flex justify-between">
              <div>
                <h3 className="font-bold text-lg ">{r.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{r.description}</p>
              </div>
              <div><button onClick={() => deleteKlub(r.id)} className="text-red-500 text-sm">Hapus</button></div>
            </div>
          ))}
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white  p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4 ">Tambah Klub Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" required placeholder="Nama Klub (Misal: Programming Club)" className="w-full p-2 border rounded" />
              <textarea name="description" required placeholder="Deskripsi & Jadwal Latihan" className="w-full p-2 border rounded" rows={3}></textarea>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
