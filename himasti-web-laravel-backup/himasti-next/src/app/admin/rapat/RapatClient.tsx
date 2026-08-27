"use client";

import { useState } from "react";
import { addRapat, deleteRapat } from "./actions";

type RapatRecord = {
  id: number;
  title: string;
  description: string;
  type: string;
  event_date: string;
  location: string;
  creator: string;
};

export default function RapatClient({ records }: { records: RapatRecord[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat("id-ID", { 
      weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute:'2-digit' 
    }).format(new Date(isoString));
  };

  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await addRapat(formData);

    if (result.success) {
      setIsAddModalOpen(false);
    } else {
      setErrorMsg(result.error || "Gagal menambah data");
    }
    setIsSubmitting(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus jadwal rapat ini?")) return;
    const result = await deleteRapat(id);
    if (!result.success) alert(result.error);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white  rounded-lg shadow-sm overflow-hidden relative">
        <div className="p-6 border-b border-gray-200  flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold ">Jadwal & Notulensi Rapat</h2>
            <p className="text-sm text-gray-500 mt-1">Manajemen jadwal rapat pengurus dan panitia.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            + Jadwalkan Rapat
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.length > 0 ? records.map(record => (
            <div key={record.id} className="border border-gray-200  rounded-lg p-5 hover:shadow-md transition bg-gray-50 ">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800  ">
                  {record.type.replace('_', ' ').toUpperCase()}
                </span>
                <button onClick={() => handleDelete(record.id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
              </div>
              <h3 className="font-bold text-lg text-gray-900  mb-1">{record.title}</h3>
              <p className="text-sm text-gray-500  mb-4 line-clamp-2">{record.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700 ">
                  <span className="w-5">📅</span> {formatDate(record.event_date)}
                </div>
                <div className="flex items-center text-gray-700 ">
                  <span className="w-5">📍</span> {record.location}
                </div>
                <div className="flex items-center text-gray-700 ">
                  <span className="w-5">👤</span> {record.creator}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200  flex gap-2">
                <button className="flex-1 bg-white  border border-gray-300  text-gray-700  py-1.5 rounded text-sm hover:bg-gray-50">Tulis Notulensi</button>
                <button className="flex-1 bg-white  border border-gray-300  text-gray-700  py-1.5 rounded text-sm hover:bg-gray-50">Absensi</button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-8 text-center text-gray-500">Belum ada jadwal rapat.</div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsAddModalOpen(false)}></div>
            <div className="relative z-10 w-full max-w-lg bg-white  rounded-lg p-6">
              <h3 className="text-lg font-medium  mb-4">Jadwalkan Rapat</h3>
              {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
              <form onSubmit={handleAddSubmit} id="addForm" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium ">Agenda / Judul</label>
                  <input type="text" name="title" required className="mt-1 p-2 w-full border rounded-md   " />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium ">Tipe Rapat</label>
                    <select name="type" className="mt-1 p-2 w-full border rounded-md   ">
                      <option value="rapat_pengurus">Rapat Pengurus</option>
                      <option value="rapat_panitia">Rapat Panitia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium ">Waktu Pelaksanaan</label>
                    <input type="datetime-local" name="event_date" required className="mt-1 p-2 w-full border rounded-md   " />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium ">Lokasi / Link Zoom</label>
                  <input type="text" name="location" required className="mt-1 p-2 w-full border rounded-md   " />
                </div>
                <div>
                  <label className="block text-sm font-medium ">Deskripsi Singkat</label>
                  <textarea name="description" rows={3} className="mt-1 p-2 w-full border rounded-md   "></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-200  rounded-md">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
