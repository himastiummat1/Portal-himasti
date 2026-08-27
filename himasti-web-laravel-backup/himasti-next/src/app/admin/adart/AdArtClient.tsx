"use client";
import { useState, useTransition } from "react";
import { uploadAdArt } from "./actions";
import { BookOpen, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdArtClient({ 
  hasFile, 
  metadata, 
  isExecutive 
}: { 
  hasFile: boolean, 
  metadata: any,
  isExecutive: boolean 
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await uploadAdArt(formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Dokumen AD/ART berhasil diperbarui!' });
        setIsUploading(false);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage({ type: 'error', text: res.error });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sky-600" />
            Konstitusi (AD/ART) HIMASTI
          </h1>
          <p className="text-gray-500 mt-1">Anggaran Dasar dan Anggaran Rumah Tangga Himpunan Mahasiswa Teknik Informatika.</p>
        </div>
        
        {isExecutive && !isUploading && (
          <button 
            onClick={() => setIsUploading(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Perbarui Dokumen
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-start gap-3 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <div className="text-sm font-medium">{message.text}</div>
        </div>
      )}

      {isUploading && isExecutive && (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-6">
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pilih File PDF atau DOCX AD/ART Terbaru</label>
              <input 
                type="file" 
                name="file" 
                accept=".pdf,.docx"
                required
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setIsUploading(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isPending ? "Mengunggah..." : "Unggah Sekarang"}
              </button>
            </div>
          </form>
        </div>
      )}

      {hasFile ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4 text-sky-600" />
              Dokumen Resmi AD/ART HIMASTI UMMAT
            </div>
            {metadata && (
              <div className="text-xs text-gray-500">
                Diperbarui: {new Date(metadata.uploadedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} oleh {metadata.uploadedBy}
              </div>
            )}
          </div>
          {metadata?.extension === 'docx' ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-200">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dokumen Microsoft Word (.docx)</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Browser tidak dapat menampilkan file Microsoft Word secara langsung. Silakan unduh dokumen untuk membacanya.
              </p>
              <a 
                href="/api/adart" 
                download="AD-ART_HIMASTI_UMMAT.docx"
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                Unduh Dokumen AD/ART
              </a>
            </div>
          ) : (
            <iframe 
              src={`/api/adart?t=${metadata?.uploadedAt || "default"}#toolbar=0`} 
              className="w-full flex-1 bg-gray-100"
              title="AD/ART HIMASTI"
            />
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Belum Ada Dokumen</h3>
          <p className="text-gray-500 max-w-md mx-auto mt-2 text-sm">
            Dokumen AD/ART belum diunggah ke dalam sistem. Silakan minta Bidang Keorganisasian atau Eksekutif untuk mengunggah file PDF terbaru.
          </p>
        </div>
      )}
    </div>
  );
}
