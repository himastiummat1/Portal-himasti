"use client";
import { useState } from "react";
import { addSurvey, deleteSurvey } from "./actions";

export default function SurveyClient({ records }: { records: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const result = await addSurvey(new FormData(e.target));
    if (result.success) setIsOpen(false);
    else alert(result.error);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-bold dark:text-white">Riset & Kuesioner</h2>
          <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">+ Buat Kuesioner</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map(r => (
            <div key={r.id} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900 flex justify-between">
              <div>
                <span className={`text-xs px-2 py-1 rounded-full mb-2 inline-block ${r.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{r.status}</span>
                <h3 className="font-bold text-lg dark:text-white">{r.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{r.description}</p>
              </div>
              <div><button onClick={() => deleteSurvey(r.id)} className="text-red-500 text-sm">Hapus</button></div>
            </div>
          ))}
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Buat Kuesioner</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" required placeholder="Judul Kuesioner" className="w-full p-2 border rounded" />
              <textarea name="description" required placeholder="Tujuan Kuesioner & Link GForm" className="w-full p-2 border rounded" rows={3}></textarea>
              <select name="status" className="w-full p-2 border rounded">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
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
