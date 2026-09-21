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
import { Users, X, CheckCircle2, Clock, UserPlus, Trash2, UserCheck, FileSpreadsheet, Lock, ShieldCheck, Calendar } from "lucide-react";

export type RapatRecord = {
  id: number;
  title: string;
  description: string;
  type: string;
  event_date: string;
  end_date?: string | null;
  location: string;
  created_by?: number;
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

interface RapatClientProps {
  records: RapatRecord[];
  currentUserId?: number;
  isPrivilegedAdmin?: boolean;
  userRoles?: string[];
}

export default function RapatClient({ 
  records, 
  currentUserId, 
  isPrivilegedAdmin = false,
  userRoles = [] 
}: RapatClientProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadMeetingId, setUploadMeetingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [attendanceModal, setAttendanceModal] = useState<{ 
    meetingId: number; 
    title: string; 
    created_by?: number;
  } | null>(null);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [allKaders, setAllKaders] = useState<KaderItem[]>([]);
  const [selectedKaderId, setSelectedKaderId] = useState<string>("");
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualError, setManualError] = useState("");

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat("id-ID", { 
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).format(new Date(isoString)) + " WITA";
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
      setErrorMsg(result.error || "Gagal menambah jadwal rapat");
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
    if (!confirm("Tutup sesi absensi rapat ini dan kirim rekap kehadiran ke Telegram?")) return;
    const result = await tutupAbsensiDanRekap(id);
    alert(result.message);
  }

  async function handleShowAttendance(meetingId: number, title: string, created_by?: number) {
    setAttendanceModal({ meetingId, title, created_by });
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
      alert(result.error || "Gagal menghapus data kehadiran.");
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
    if (!confirm("Apakah Anda yakin ingin menghapus jadwal rapat ini? Tindakan ini tidak dapat dibatalkan.")) return;
    const result = await deleteRapat(id);
    if (!result.success) {
      alert(result.error);
    }
  }

  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden relative">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50">
          <div>
            <a href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> 
              Kembali ke Dashboard
            </a>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Jadwal & Notulensi Rapat</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                RBAC Protected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Setiap pengurus/ketua bidang mengelola rapatnya masing-masing. Terlindungi dari penghapusan oleh akun lain.
            </p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs flex items-center justify-center gap-2 shrink-0"
          >
            <Calendar className="w-4 h-4" />
            <span>+ Jadwalkan Rapat</span>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.length > 0 ? records.map(record => {
            // Wewenang RBAC: Pembuat rapat atau Super Admin / Pimpinan Tertinggi
            const canManage = isPrivilegedAdmin || (record.created_by && record.created_by === currentUserId);
            const isOwner = record.created_by && record.created_by === currentUserId;
            const isExpired = record.end_date ? now > new Date(record.end_date) : false;
            const isActuallyActive = Boolean(record.is_active) && !isExpired;

            return (
              <div key={record.id} className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition bg-white flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2.5 gap-2">
                    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-slate-100 text-slate-700 uppercase tracking-wider">
                      {record.type.replace('_', ' ')}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      {/* Status Badges */}
                      {!record.is_active ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          Ditutup
                        </span>
                      ) : isExpired ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Waktu Habis (Auto)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sesi Aktif
                        </span>
                      )}

                      {/* Tombol Hapus (Hanya muncul untuk pemilik atau Super Admin / Pimpinan) */}
                      {canManage ? (
                        <button 
                          onClick={() => handleDelete(record.id)} 
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Hapus Rapat Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span title="Dikelola oleh penyelenggara rapat" className="text-slate-300 p-1">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-1 leading-snug">{record.title}</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                    {record.description || "Tidak ada deskripsi tambahan."}
                  </p>
                  
                  <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                    <div className="flex items-start gap-2 text-slate-700">
                      <span className="text-slate-400 font-semibold shrink-0">📅 Mulai:</span>
                      <span className="font-medium">{formatDate(record.event_date)}</span>
                    </div>

                    {record.end_date && (
                      <div className="flex items-start gap-2 text-slate-700">
                        <span className="text-slate-400 font-semibold shrink-0">⏰ Selesai:</span>
                        <span className="font-medium text-amber-800">{formatDate(record.end_date)}</span>
                      </div>
                    )}

                    <div className="flex items-start gap-2 text-slate-700">
                      <span className="text-slate-400 font-semibold shrink-0">📍 Lokasi:</span>
                      <span className="font-medium">{record.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400 font-semibold shrink-0">👤 Panitia:</span>
                      <span className="font-medium text-slate-900 flex items-center gap-1">
                        {record.creator}
                        {isOwner && (
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-bold">
                            Anda
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  {/* Tutup & Rekap Telegram: Hanya untuk canManage dan masih aktif */}
                  {canManage && isActuallyActive && (
                    <button 
                      onClick={() => handleTutupRekap(record.id)} 
                      className="w-full bg-blue-50 border border-blue-200 text-blue-700 py-2 rounded-xl text-xs font-semibold hover:bg-blue-100 flex items-center justify-center gap-2 transition-colors"
                    >
                      <span className="w-3.5 h-3.5">📊</span> Tutup & Rekap ke Telegram
                    </button>
                  )}

                  {/* QR Code Absensi: Aktif jika sesi masih berjalan */}
                  {isActuallyActive && (
                    <a 
                      href={`/admin/rapat/qr?id=${record.id}`} 
                      target="_blank" 
                      className="w-full bg-slate-900 border border-slate-900 text-white py-2 rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <span>📱 Tampilkan QR Absensi</span>
                    </a>
                  )}

                  <button 
                    onClick={() => handleShowAttendance(record.id, record.title, record.created_by)} 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-500" /> Lihat Daftar Hadir
                  </button>

                  {record.notulensi_path ? (
                    <a 
                      href={record.notulensi_path} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-100 text-center transition-colors block"
                    >
                      📄 Unduh Notulensi
                    </a>
                  ) : canManage ? (
                    <button 
                      onClick={() => setUploadMeetingId(record.id)} 
                      className="w-full bg-white border border-slate-300 text-slate-700 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Upload Notulensi
                    </button>
                  ) : null}

                  {canManage && record.notulensi_path && (
                    <button 
                      onClick={() => setUploadMeetingId(record.id)} 
                      className="text-[11px] text-slate-400 hover:text-slate-600 underline text-center"
                    >
                      Ganti File Notulensi
                    </button>
                  )}
                </div>

              </div>
            );
          }) : (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-600">Belum ada agenda rapat</p>
              <p className="text-xs mt-1">Klik tombol &quot;+ Jadwalkan Rapat&quot; di atas untuk membuat sesi pertemuan baru.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Jadwalkan Rapat Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
            <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Jadwalkan Rapat Baru</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tentukan batas waktu agar presensi otomatis ditutup dan direkap.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleAddSubmit} id="addForm" className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Agenda / Judul Rapat <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    placeholder="Contoh: Rapat Pleno Divisi Litbang"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Tipe Rapat
                    </label>
                    <select 
                      name="type" 
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="rapat_pengurus">Rapat Pengurus / Bidang</option>
                      <option value="rapat_panitia">Rapat Panitia Kegiatan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Lokasi / Link Zoom <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="location" 
                      required 
                      placeholder="Gedung TI / Ruang Sidang"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900" 
                    />
                  </div>
                </div>

                {/* Pengaturan Batasan Waktu Rapat */}
                <div className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Rentang Waktu & Batas Sesi Absensi</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Waktu Mulai <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="datetime-local" 
                        name="event_date" 
                        required 
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Batas Selesai (Otomatis Ditutup)
                      </label>
                      <input 
                        type="datetime-local" 
                        name="end_date" 
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    💡 <strong>Otomatisasi:</strong> Jika batas waktu selesai diisi, sistem akan otomatis menutup sesi absensi saat waktu berakhir dan rekap kehadiran langsung dikirimkan ke Telegram!
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Deskripsi / Catatan Agenda
                  </label>
                  <textarea 
                    name="description" 
                    rows={2} 
                    placeholder="Tuliskan pembahasan pokok rapat..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)} 
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs disabled:opacity-50"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan & Buka Rapat"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Upload Notulensi */}
      {uploadMeetingId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setUploadMeetingId(null)}></div>
            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Upload Notulensi Rapat</h3>
              <p className="text-xs text-slate-500 mb-4">Unggah berkas rekap hasil pembahasan rapat.</p>
              
              <form onSubmit={handleUploadNotulensi} className="space-y-4">
                <input type="hidden" name="meetingId" value={uploadMeetingId} />
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    File Notulensi (PDF / DOCX)
                  </label>
                  <input 
                    type="file" 
                    name="file" 
                    accept=".pdf,.doc,.docx" 
                    required 
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer" 
                  />
                </div>
                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setUploadMeetingId(null)} 
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUploading} 
                    className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:opacity-50"
                  >
                    {isUploading ? 'Menyimpan...' : 'Upload Berkas'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Daftar Hadir */}
      {attendanceModal && (() => {
        const canManageAttendance = isPrivilegedAdmin || (attendanceModal.created_by && attendanceModal.created_by === currentUserId);

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAttendanceModal(null)}></div>
              <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Daftar Hadir Sesi Rapat</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{attendanceModal.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {canManageAttendance && (
                      <button
                        onClick={() => setShowManualForm(!showManualForm)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-blue-200"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{showManualForm ? "Tutup Form" : "+ Hadir Manual"}</span>
                      </button>
                    )}
                    <button onClick={() => setAttendanceModal(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Form Check-in Manual: Hanya untuk penyelenggara / BPH */}
                {canManageAttendance && showManualForm && (
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
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs border-b border-rose-200 px-6 font-medium">
                    {manualError}
                  </div>
                )}
                
                <div className="p-6">
                  {isLoadingAttendance ? (
                    <div className="flex items-center justify-center py-8 text-slate-500 gap-2 text-xs">
                      <Clock className="w-4 h-4 animate-spin" /> Memuat data kehadiran...
                    </div>
                  ) : attendanceList.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="font-semibold text-slate-700 text-sm">Belum ada peserta yang presensi</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Kader dapat scan QR Code acara di layar proyektor atau melalui menu presensi di portal.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Total Hadir: <strong>{attendanceList.length}</strong> Orang</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-mono">Realtime</span>
                        </div>
                        <button
                          onClick={exportAttendanceExcel}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-100/50 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors self-end sm:self-auto"
                          title="Download daftar hadir rapat ini ke format Excel"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Export CSV Presensi</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500">
                              <th className="py-2.5 px-3 font-semibold">No</th>
                              <th className="py-2.5 px-3 font-semibold">Nama Kader</th>
                              <th className="py-2.5 px-3 font-semibold hidden md:table-cell">NIM / Angkatan</th>
                              <th className="py-2.5 px-3 font-semibold hidden sm:table-cell">Metode</th>
                              <th className="py-2.5 px-3 font-semibold">Waktu</th>
                              {canManageAttendance && (
                                <th className="py-2.5 px-3 text-right font-semibold">Aksi</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {attendanceList.map((a, i) => (
                              <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="py-2.5 px-3 text-slate-500 font-mono">{i + 1}</td>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">
                                  <div>{a.userName}</div>
                                  <div className="text-[10px] text-slate-400 font-normal sm:hidden">{a.userNim || a.userEmail}</div>
                                </td>
                                <td className="py-2.5 px-3 hidden md:table-cell font-mono text-slate-600">
                                  {a.userNim || "-"} {a.userAngkatan ? `(${a.userAngkatan})` : ""}
                                </td>
                                <td className="py-2.5 px-3 hidden sm:table-cell">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    a.method === "manual_panitia"
                                      ? "bg-amber-100 text-amber-800"
                                      : a.method === "biometric_fingerprint"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}>
                                    {a.method === "manual_panitia" ? "Manual Panitia" : a.method === "biometric_fingerprint" ? "Biometrik" : "Scan QR"}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 font-mono">
                                  {new Date(a.waktuHadir).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                {canManageAttendance && (
                                  <td className="py-2.5 px-3 text-right">
                                    <button
                                      onClick={() => handleDeleteAttendance(a.id)}
                                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                      title="Hapus Kehadiran"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                )}
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
        );
      })()}
    </div>
  );
}
