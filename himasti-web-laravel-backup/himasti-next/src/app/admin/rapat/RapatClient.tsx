"use client";

import { useState } from "react";
import { 
  addRapat, 
  deleteRapat, 
  uploadNotulensi, 
  getAttendance,
  manualCheckIn,
  deleteAttendanceRecord,
  getKadersForAttendance
} from "./actions";
import { tutupAbsensiDanRekap } from "./telegram";
import { Users, X, CheckCircle2, Clock, UserPlus, Trash2, UserCheck, FileSpreadsheet } from "lucide-react";

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

interface AttendanceRecord {
  id: number;
  userName: string;
  userEmail: string;
  userNim?: string;
  userAngkatan?: string;
  waktuHadir: string;
  status: string;
  method?: string;
}

interface KaderItem {
  id: number;
  name: string;
  email: string;
  nim: string;
  angkatan: string;
}

export default function RapatClient({ records }: { records: RapatRecord[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadMeetingId, setUploadMeetingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [attendanceModal, setAttendanceModal] = useState<{ meetingId: number; title: string } | null>(null);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [allKaders, setAllKaders] = useState<KaderItem[]>([]);
  const [selectedKaderId, setSelectedKaderId] = useState<string>("");
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualError, setManualError] = useState("");

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
    setShowManualForm(false);
    setSelectedKaderId("");
    setManualError("");
    const [data, kaders] = await Promise.all([
      getAttendance(meetingId),
      getKadersForAttendance()
    ]);
    setAttendanceList(data);
    setAllKaders(kaders);
    setIsLoadingAttendance(false);
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!attendanceModal || !selectedKaderId) return;
    setIsAddingManual(true);
    setManualError("");
    const result = await manualCheckIn(attendanceModal.meetingId, parseInt(selectedKaderId));
    setIsAddingManual(false);
    if (result.success) {
      const refreshed = await getAttendance(attendanceModal.meetingId);
      setAttendanceList(refreshed);
      setSelectedKaderId("");
      setShowManualForm(false);
    } else {
      setManualError(result.error || "Gagal mencatat kehadiran manual.");
    }
  }

  async function handleDeleteAttendance(id: number) {
    if (!confirm("Hapus catatan kehadiran ini?")) return;
    const result = await deleteAttendanceRecord(id);
    if (result.success && attendanceModal) {
      const refreshed = await getAttendance(attendanceModal.meetingId);
      setAttendanceList(refreshed);
    } else {
      alert(result.error || "Gagal menghapus data.");
    }
  }

  const exportAttendanceExcel = () => {
    if (!attendanceModal || attendanceList.length === 0) return;

    const headers = ["No", "Nama Mahasiswa", "NIM", "Angkatan", "Email", "Waktu Hadir", "Metode Presensi", "Status Kehadiran"];

    const formatCell = (val: unknown, isTextFormula = false) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/\r?\n/g, " ").trim();
      const escaped = str.replace(/"/g, '""');
      if (isTextFormula && /^[0-9+]+$/.test(str)) {
        return `"=""${escaped}"""`;
      }
      return `"${escaped}"`;
    };

    const rows = attendanceList.map((a, idx) => {
      const dateStr = new Date(a.waktuHadir).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      });
      const methodLabel = a.method === "manual_panitia" ? "Manual Panitia" : a.method === "biometric_fingerprint" ? "Biometrik" : "Scan QR";
      return [
        formatCell(idx + 1),
        formatCell(a.userName),
        formatCell(a.userNim || "-", true),
        formatCell(a.userAngkatan || "-"),
        formatCell(a.userEmail),
        formatCell(dateStr),
        formatCell(methodLabel),
        formatCell(a.status.toUpperCase())
      ].join(";");
    });

    const csvContent = "\uFEFF" + [
      headers.map(h => formatCell(h)).join(";"),
      ...rows
    ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const sanitizedTitle = attendanceModal.title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const dateFile = new Date().toISOString().split("T")[0];
    link.download = `Presensi_${sanitizedTitle}_${dateFile}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowManualForm(!showManualForm)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-blue-200"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{showManualForm ? "Tutup Form" : "+ Hadir Manual"}</span>
                  </button>
                  <button onClick={() => setAttendanceModal(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Manual Check-in Dropdown Form */}
              {showManualForm && (
                <form onSubmit={handleManualSubmit} className="p-4 bg-blue-50/50 border-b border-blue-200/60 flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex-1 w-full">
                    <select
                      value={selectedKaderId}
                      onChange={(e) => setSelectedKaderId(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Pilih Mahasiswa / Kader --</option>
                      {allKaders
                        .filter(k => !attendanceList.some(a => a.userEmail === k.email))
                        .map(k => (
                          <option key={k.id} value={k.id}>
                            {k.name} ({k.nim}) - Angkatan {k.angkatan}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isAddingManual || !selectedKaderId}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 transition-colors"
                  >
                    {isAddingManual ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                    <span>Tandai Hadir</span>
                  </button>
                </form>
              )}

              {manualError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs border-b border-rose-200 px-6">
                  {manualError}
                </div>
              )}
              
              <div className="p-6">
                {isLoadingAttendance ? (
                  <div className="flex items-center justify-center py-8 text-slate-500 gap-2">
                    <Clock className="w-5 h-5 animate-spin" /> Memuat data kehadiran...
                  </div>
                ) : attendanceList.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium">Belum ada yang absen</p>
                    <p className="text-sm mt-1">Tampilkan QR Code di layar proyektor atau gunakan tombol &quot;+ Hadir Manual&quot; jika HP anggota terkendala.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Total Hadir: <strong>{attendanceList.length}</strong> Orang</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-mono">Realtime</span>
                      </div>
                      <button
                        onClick={exportAttendanceExcel}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-emerald-100/50 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-semibold shadow-xs transition-colors self-end sm:self-auto"
                        title="Download daftar hadir rapat ini ke format Excel"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Export Excel Presensi</span>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-left text-slate-500 text-xs">
                            <th className="py-3 px-3 font-medium">No</th>
                            <th className="py-3 px-3 font-medium">Nama Anggota</th>
                            <th className="py-3 px-3 font-medium hidden md:table-cell">NIM / Angkatan</th>
                            <th className="py-3 px-3 font-medium hidden sm:table-cell">Metode</th>
                            <th className="py-3 px-3 font-medium">Waktu</th>
                            <th className="py-3 px-3 text-right font-medium">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceList.map((a, i) => (
                            <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-xs">
                              <td className="py-3 px-3 text-slate-500 font-mono">{i + 1}</td>
                              <td className="py-3 px-3 font-semibold text-slate-900">
                                <div>{a.userName}</div>
                                <div className="text-[11px] text-slate-400 font-normal sm:hidden">{a.userNim || a.userEmail}</div>
                              </td>
                              <td className="py-3 px-3 hidden md:table-cell font-mono text-[11px] text-slate-600">
                                {a.userNim || "-"} {a.userAngkatan ? `(${a.userAngkatan})` : ""}
                              </td>
                              <td className="py-3 px-3 hidden sm:table-cell">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                  a.method === "manual_panitia"
                                    ? "bg-amber-100 text-amber-800"
                                    : a.method === "biometric_fingerprint"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}>
                                  {a.method === "manual_panitia" ? "Manual Panitia" : a.method === "biometric_fingerprint" ? "Biometrik" : "Scan QR"}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-500 font-mono">
                                {new Date(a.waktuHadir).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => handleDeleteAttendance(a.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                  title="Hapus Kehadiran"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
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
