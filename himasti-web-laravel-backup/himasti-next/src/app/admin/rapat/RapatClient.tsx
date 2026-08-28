"use client";

import { useState } from "react";
import { addRapat, deleteRapat, uploadNotulensi, getAttendance } from "./actions";
import { tutupAbsensiDanRekap } from "./telegram";
import { Users, X, CheckCircle2, Clock } from "lucide-react";

type RapatRecord = {
  id: number;
  title: string;
  description: string;
  type: string;
  event_date: string;
  location: string;
  creator: string;
  notulensi_path?: string | null;
  is_active?: boolean | null;
};

export default function RapatClient({ records }: { records: RapatRecord[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadMeetingId, setUploadMeetingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [attendanceModal, setAttendanceModal] = useState<{ meetingId: number; title: string } | null>(null);
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);

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

  
  async function handleUploadNotulensi(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    const result = await uploadNotulensi(formData);
    if (result.success) {
      setUploadMeetingId(null);
    } else {
      alert(result.error);
    }
    setIsUploading(false);
  }

  async function handleTutupRekap(id: number) {
    if (!confirm("Tutup sesi absensi rapat ini dan kirim rekap ke Telegram?")) return;
    const result = await tutupAbsensiDanRekap(id);
    alert(result.message);
  }

  async function handleShowAttendance(meetingId: number, title: string) {
    setAttendanceModal({ meetingId, title });
    setIsLoadingAttendance(true);
    const data = await getAttendance(meetingId);
    setAttendanceList(data);
    setIsLoadingAttendance(false);
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
            <a href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> Kembali</a>
            <h2 className="text-xl font-bold ">Jadwal & Notulensi Rapat</h2>
            <p className="text-sm text-gray-500 mt-1">Manajemen jadwal rapat pengurus dan panitia.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800">
            + Jadwalkan Rapat
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.length > 0 ? records.map(record => (
            <div key={record.id} className="border border-gray-200  rounded-lg p-5 hover:shadow-md transition bg-gray-50 ">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-900  ">
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
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
                {record.is_active && (
                  <button onClick={() => handleTutupRekap(record.id)} className="flex-1 bg-blue-50 border border-blue-200 text-blue-700 py-1.5 rounded text-sm text-center font-medium hover:bg-blue-100 flex items-center justify-center gap-2 mb-2">
                    <span className="w-4 h-4">📊</span> Tutup & Rekap (Telegram)
                  </button>
                )}
                <a href={`/admin/rapat/qr?id=${record.id}`} target="_blank" className="flex-1 bg-slate-900 border border-slate-900 text-white py-1.5 rounded text-sm text-center font-medium hover:bg-slate-800 flex items-center justify-center gap-2 mb-2 shadow-sm">
                  <span className="w-4 h-4">📱</span> Tampilkan QR Absensi
                </a>
                <button onClick={() => handleShowAttendance(record.id, record.title)} className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 py-1.5 rounded text-sm text-center font-medium hover:bg-slate-100 flex items-center justify-center gap-2 mb-2">
                  <Users className="w-4 h-4" /> Lihat Daftar Hadir
                </button>
                {record.notulensi_path ? (
                  <a href={record.notulensi_path} target="_blank" rel="noreferrer" className="flex-1 bg-green-50 border border-green-200 text-green-700 py-1.5 rounded text-sm text-center font-medium hover:bg-green-100">
                    Lihat Notulensi
                  </a>
                ) : (
                  <button onClick={() => setUploadMeetingId(record.id)} className="flex-1 bg-white border border-gray-300 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-50">
                    Upload Notulensi
                  </button>
                )}
                {record.notulensi_path && (
                  <button onClick={() => setUploadMeetingId(record.id)} className="text-xs text-gray-500 hover:text-gray-700 underline mt-1 text-center">
                    Ganti File
                  </button>
                )}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-gray-900 text-white rounded-md">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {uploadMeetingId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setUploadMeetingId(null)}></div>
            <div className="relative z-10 w-full max-w-md bg-white rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Upload Notulensi Rapat</h3>
              <form onSubmit={handleUploadNotulensi} className="space-y-4">
                <input type="hidden" name="meetingId" value={uploadMeetingId} />
                <div>
                  <label className="block text-sm font-medium mb-2">File Notulensi (PDF/DOCX)</label>
                  <input type="file" name="file" accept=".pdf,.doc,.docx" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setUploadMeetingId(null)} className="px-4 py-2 bg-gray-200 rounded-md">Batal</button>
                  <button type="submit" disabled={isUploading} className="px-4 py-2 bg-gray-900 text-white rounded-md">{isUploading ? 'Menyimpan...' : 'Upload'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Attendance List Modal */}
      {attendanceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAttendanceModal(null)}></div>
            <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Daftar Hadir</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{attendanceModal.title}</p>
                </div>
                <button onClick={() => setAttendanceModal(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              
              <div className="p-6">
                {isLoadingAttendance ? (
                  <div className="flex items-center justify-center py-8 text-slate-500 gap-2">
                    <Clock className="w-5 h-5 animate-spin" /> Memuat data kehadiran...
                  </div>
                ) : attendanceList.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium">Belum ada yang absen</p>
                    <p className="text-sm mt-1">Tampilkan QR Code di layar proyektor agar anggota bisa melakukan scan absensi.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Total Hadir: {attendanceList.length} Orang
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-left text-slate-500">
                            <th className="py-3 px-4 font-medium">No</th>
                            <th className="py-3 px-4 font-medium">Nama</th>
                            <th className="py-3 px-4 font-medium hidden sm:table-cell">Email</th>
                            <th className="py-3 px-4 font-medium">Waktu</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceList.map((a, i) => (
                            <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                              <td className="py-3 px-4 text-slate-500 font-mono text-xs">{i + 1}</td>
                              <td className="py-3 px-4 font-medium text-slate-900">{a.userName}</td>
                              <td className="py-3 px-4 text-slate-500 font-mono text-xs hidden sm:table-cell truncate max-w-[200px]">{a.userEmail}</td>
                              <td className="py-3 px-4 text-slate-500 text-xs font-mono">
                                {new Date(a.waktuHadir).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
