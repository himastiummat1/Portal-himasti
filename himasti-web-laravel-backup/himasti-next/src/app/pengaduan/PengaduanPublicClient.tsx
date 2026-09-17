"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Send, 
  Search, 
  Copy, 
  Check, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ArrowLeft,
  Lock,
  EyeOff,
  Building2,
  Sparkles
} from "lucide-react";
import { submitPengaduan, getPengaduanByTracking } from "./actions";

interface PengaduanDetail {
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

export default function PengaduanPublicClient() {
  const [activeTab, setActiveTab] = useState<"submit" | "track">("submit");
  
  // Submit Form States
  const [kategori, setKategori] = useState("Akademik");
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Track States
  const [trackInput, setTrackInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackResult, setTrackResult] = useState<PengaduanDetail | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append("kategori", kategori);
    formData.append("judul", judul);
    formData.append("isi", isi);

    const res = await submitPengaduan(formData);
    setIsSubmitting(false);

    if (res.success && res.tracking_code) {
      setCreatedCode(res.tracking_code);
      setJudul("");
      setIsi("");
    } else {
      setSubmitError(res.error || "Gagal mengirim pengaduan.");
    }
  }

  async function handleSearch(codeToSearch?: string) {
    const query = codeToSearch || trackInput;
    if (!query.trim()) return;

    setIsSearching(true);
    setTrackError(null);
    setTrackResult(null);

    const res = await getPengaduanByTracking(query);
    setIsSearching(false);

    if (res.success && res.data) {
      setTrackResult(res.data);
    } else {
      setTrackError(res.error || "Pengaduan tidak ditemukan.");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai Ditanggapi
          </span>
        );
      case "diproses":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> Sedang Ditindaklanjuti
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Menunggu Peninjauan
          </span>
        );
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      {/* Top Header Strip */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">HIMASTI UMMAT</span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">WHISTLEBLOWING</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Kotak Aspirasi & Pengaduan Mahasiswa</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/login" 
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Login Pengurus
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        
        {/* Hero & Security Assurance Banner */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium mb-2.5">
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                <span>Enkripsi Privasi & Tanpa Login</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Kotak Aspirasi & Pengaduan Anonim
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                Suarakan keluhan akademik, fasilitas laboratorium, kendala birokrasi, atau ide perbaikan untuk Program Studi Teknik Informatika UMMAT tanpa rasa khawatir.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-center shrink-0 w-44">
              <EyeOff className="w-6 h-6 text-slate-600 mb-1.5" />
              <span className="text-xs font-bold text-slate-800">100% Anonim</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Identitas tidak dicatat</span>
            </div>
          </div>

          {/* Privacy Guarantee Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6">
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Tanpa Akun:</strong> Anda tidak perlu login atau mengisi nama dan NIM.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Advokasi Resmi:</strong> Diterima langsung oleh Divisi Aksi & Advokasi HIMASTI.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Terlacak:</strong> Pantau respon dan tindak lanjut lewat kode unik Anda.</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1 bg-slate-200/60 rounded-xl max-w-md">
          <button
            onClick={() => { setActiveTab("submit"); setCreatedCode(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "submit"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Tulis Pengaduan
          </button>
          <button
            onClick={() => setActiveTab("track")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "track"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Lacak Status Laporan
          </button>
        </div>

        {/* TAB 1: FORM PENGADUAN */}
        {activeTab === "submit" && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            {createdCode ? (
              /* Success State with Tracking Code */
              <div className="text-center py-6 space-y-6">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">Pengaduan Berhasil Dikirim!</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                    Laporan Anda telah masuk ke sistem antrean Advokasi HIMASTI tanpa merekam identitas Anda.
                  </p>
                </div>

                {/* Tracking Code Box */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-5 max-w-md mx-auto">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Kode Tracking Rahasia Anda
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 tracking-wider">
                      {createdCode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(createdCode)}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
                      title="Salin Kode"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-700 bg-amber-50 rounded-lg p-2 mt-3 border border-amber-200/60 leading-relaxed text-left">
                    ⚠️ <strong>PENTING:</strong> Catat atau simpan kode ini sekarang. Karena pengaduan bersifat anonim murni, kode ini adalah satu-satunya cara Anda mengecek balasan dari tim pengurus.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setTrackInput(createdCode);
                      setActiveTab("track");
                      handleSearch(createdCode);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Lacak Status Laporan Sekarang
                  </button>
                  <button
                    onClick={() => setCreatedCode(null)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Tulis Pengaduan Lain
                  </button>
                </div>
              </div>
            ) : (
              /* Complaint Submission Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Kategori */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Kategori Pengaduan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                  >
                    <option value="Akademik">Akademik (Dosen, Perkuliahan, Nilai, Kurikulum)</option>
                    <option value="Fasilitas & Lab">Fasilitas & Sarana (Lab Komputer, Wi-Fi, Ruang Kelas, AC)</option>
                    <option value="Organisasi & Birokrasi">Organisasi & Birokrasi (HIMASTI, Fakultas, Administrasi)</option>
                    <option value="Aspirasi & Saran">Aspirasi & Ide Pengembangan Prodi/Himpunan</option>
                    <option value="Lainnya">Lainnya / Masalah Umum</option>
                  </select>
                </div>

                {/* Judul */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Judul Pengaduan / Aspirasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kendala Software MATLAB di Lab Jaringan Komputer"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    maxLength={200}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                  />
                </div>

                {/* Isi */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Rincian Masalah & Aspirasi <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {isi.length}/5000
                    </span>
                  </div>
                  <textarea
                    required
                    rows={6}
                    placeholder="Tuliskan secara jelas kronologi masalah, waktu kejadian, lokasi spesifik (jika terkait lab/gedung), serta ekspektasi atau solusi yang diharapkan..."
                    value={isi}
                    onChange={(e) => setIsi(e.target.value)}
                    maxLength={5000}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tips: Hindari menyebutkan identitas pribadi Anda di dalam teks jika ingin menjaga kerahasiaan 100%.
                  </p>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Mengirimkan Laporan...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Kirim Pengaduan Anonim</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: LACAK PENGADUAN */}
        {activeTab === "track" && (
          <div className="space-y-6">
            {/* Search Input Box */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Cari Berdasarkan Kode Tracking
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Contoh: ASP-8Y2K7A"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-mono text-sm tracking-wider text-slate-900 uppercase placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  disabled={isSearching || !trackInput.trim()}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Lacak Laporan
                </button>
              </div>

              {trackError && (
                <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{trackError}</span>
                </div>
              )}
            </div>

            {/* Tracking Result View */}
            {trackResult && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-5 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {trackResult.tracking_code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Kategori: <strong>{trackResult.kategori}</strong>
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Dikirim pada {trackResult.created_at ? new Date(trackResult.created_at).toLocaleDateString("id-ID", { dateStyle: "long" }) : "-"}
                    </span>
                  </div>
                  <div>
                    {getStatusBadge(trackResult.status)}
                  </div>
                </div>

                {/* Complaint Content */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">{trackResult.judul}</h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {trackResult.isi}
                  </div>
                </div>

                {/* Official Response Section */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Tanggapan Resmi Advokasi HIMASTI
                    </h4>
                  </div>

                  {trackResult.tanggapan ? (
                    <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs text-blue-900 font-semibold border-b border-blue-200/40 pb-2">
                        <span>Ditanggapi oleh: {trackResult.responded_by || "Tim Advokasi"}</span>
                        {trackResult.responded_at && (
                          <span className="text-[11px] font-normal text-blue-700">
                            {new Date(trackResult.responded_at).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap pt-1">
                        {trackResult.tanggapan}
                      </p>
                    </div>
                  ) : (
                    <div className="p-5 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                      Laporan Anda telah tercatat dan sedang menunggu peninjauan oleh Divisi Aksi & Advokasi. Tanggapan resmi akan diperbarui di halaman ini segera setelah dilakukan kajian/rapat koordinasi.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 mt-12 py-6 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} HIMASTI UMMAT • Portal Whistleblowing & Aspirasi Mahasiswa</p>
      </footer>
    </div>
  );
}
