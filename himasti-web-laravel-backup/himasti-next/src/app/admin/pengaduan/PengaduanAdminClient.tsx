"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  MessageSquare,
  Trash2,
  X,
  Filter,
  RefreshCw,
} from "lucide-react";
import { updatePengaduanStatus, deletePengaduan } from "./actions";

interface PengaduanItem {
  id: number;
  tracking_code: string;
  kategori: string;
  judul: string;
  isi: string;
  status: string;
  tanggapan: string | null;
  responded_by: string | null;
  responded_at: string | null;
  created_at: string | null;
}

export default function PengaduanAdminClient({
  initialReports,
}: {
  initialReports: PengaduanItem[];
}) {
  const [reports, setReports] = useState<PengaduanItem[]>(initialReports);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Detail & Response Modal State
  const [selectedReport, setSelectedReport] = useState<PengaduanItem | null>(null);
  const [modalStatus, setModalStatus] = useState<"menunggu" | "diproses" | "selesai">("menunggu");
  const [modalTanggapan, setModalTanggapan] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Filter calculations
  const totalCount = reports.length;
  const waitingCount = reports.filter((r) => r.status === "menunggu").length;
  const processingCount = reports.filter((r) => r.status === "diproses").length;
  const resolvedCount = reports.filter((r) => r.status === "selesai").length;

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.tracking_code.toLowerCase().includes(search.toLowerCase()) ||
      r.judul.toLowerCase().includes(search.toLowerCase()) ||
      r.isi.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : r.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" ? true : r.kategori === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  function openDetailModal(report: PengaduanItem) {
    setSelectedReport(report);
    setModalStatus(report.status as "menunggu" | "diproses" | "selesai");
    setModalTanggapan(report.tanggapan || "");
    setActionError(null);
  }

  async function handleSaveResponse(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReport) return;

    setIsSaving(true);
    setActionError(null);

    const res = await updatePengaduanStatus(selectedReport.id, modalStatus, modalTanggapan);
    setIsSaving(false);

    if (res.success && res.data) {
      setReports((prev) =>
        prev.map((item) =>
          item.id === selectedReport.id
            ? {
                ...item,
                status: modalStatus,
                tanggapan: modalTanggapan.trim() || null,
                responded_by: res.data.responded_by,
                responded_at: res.data.responded_at ? res.data.responded_at.toISOString() : null,
              }
            : item
        )
      );
      setSelectedReport(null);
    } else {
      setActionError(res.error || "Gagal menyimpan tanggapan.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus pengaduan ini secara permanen?")) return;

    const res = await deletePengaduan(id);
    if (res.success) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      if (selectedReport?.id === id) setSelectedReport(null);
    } else {
      alert(res.error || "Gagal menghapus pengaduan.");
    }
  }

  function renderStatusBadge(status: string) {
    switch (status) {
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
          </span>
        );
      case "diproses":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> Diproses
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Menunggu
          </span>
        );
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Inbox className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Manajemen Kotak Aspirasi & Pengaduan
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Pusat moderasi aspirasi mahasiswa Teknik Informatika. Dengarkan masukan, berikan klarifikasi, dan pantau status tindak lanjut secara akuntabel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/pengaduan"
            target="_blank"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <span>Halaman Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Laporan
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono">
            {totalCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
            Menunggu Tindak Lanjut
          </span>
          <span className="text-2xl font-extrabold text-amber-600 font-mono">
            {waitingCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200/80 bg-blue-50/20 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
            Sedang Diproses
          </span>
          <span className="text-2xl font-extrabold text-blue-600 font-mono">
            {processingCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            Telah Selesai
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono">
            {resolvedCount}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode tracking atau judul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium focus:outline-none focus:border-slate-400"
            >
              <option value="all">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          {/* Kategori Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Kategori:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium focus:outline-none focus:border-slate-400"
            >
              <option value="all">Semua Kategori</option>
              <option value="Akademik">Akademik</option>
              <option value="Fasilitas & Lab">Fasilitas & Lab</option>
              <option value="Organisasi & Birokrasi">Organisasi</option>
              <option value="Aspirasi & Saran">Aspirasi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table / Card List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">Tidak ada data pengaduan</h3>
            <p className="text-xs text-slate-400 mt-1">
              Tidak ada laporan yang cocok dengan kata kunci atau filter yang dipilih.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Kode Tracking</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Judul & Cuplikan Laporan</th>
                  <th className="py-3 px-4">Tanggal Masuk</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {report.tracking_code}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {report.kategori}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-bold text-slate-900 truncate">{report.judul}</p>
                      <p className="text-slate-500 truncate text-[11px] mt-0.5">{report.isi}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {report.created_at ? new Date(report.created_at).toLocaleDateString("id-ID", { dateStyle: "medium" }) : "-"}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderStatusBadge(report.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openDetailModal(report)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Tanggapi</span>
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Pengaduan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Response & Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200">
                  {selectedReport.tracking_code}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  • {selectedReport.kategori}
                </span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveResponse} className="p-5 sm:p-6 space-y-5">
              {actionError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Full Original Report */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedReport.judul}
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-xs leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
                  {selectedReport.isi}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
                  <span>
                    Masuk: {selectedReport.created_at ? new Date(selectedReport.created_at).toLocaleString("id-ID") : "-"}
                  </span>
                  <span>100% Whistleblower Anonim</span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Moderation Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Update Status Pengaduan
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setModalStatus("menunggu")}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                        modalStatus === "menunggu"
                          ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Menunggu
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalStatus("diproses")}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                        modalStatus === "diproses"
                          ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Sedang Diproses
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalStatus("selesai")}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                        modalStatus === "selesai"
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Selesai
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tanggapan Resmi Pengurus (Dapat dilihat oleh pelapor)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan klarifikasi resmi, hasil rapat advokasi, atau langkah konkret yang telah/akan diambil..."
                    value={modalTanggapan}
                    onChange={(e) => setModalTanggapan(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all leading-relaxed"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Tanggapan ini akan langsung muncul saat pelapor mengecek status menggunakan kode tracking.
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Simpan & Perbarui Status</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
