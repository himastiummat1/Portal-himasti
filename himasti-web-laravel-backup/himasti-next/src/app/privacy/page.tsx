import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, Lock, Globe2, KeyRound, Server, UserCheck, 
  FileText, ArrowLeft, ExternalLink, Sparkles, Mail, CheckCircle2,
  AlertTriangle, Smartphone, Download, Database, Clock
} from "lucide-react";

export const metadata = {
  title: "Kebijakan Privasi (Global Privacy Policy) - Portal HIMASTI UMMAT",
  description: "Kebijakan Privasi Resmi Portal HIMASTI UMMAT yang mematuhi standar global (GDPR, CCPA, Apple/Google Wallet Guidelines, dan UU PDP No. 27/2022).",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/updates" className="text-xs text-slate-500 hover:text-slate-800 font-medium hidden sm:inline-block">
              Catatan Rilis
            </Link>
            <div className="h-4 w-px bg-slate-200 hidden sm:inline-block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 p-0.5 overflow-hidden shadow-xs">
                <Image src="/images/logo_himasti.jpg" alt="Logo HIMASTI" width={28} height={28} className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-sm text-slate-900 tracking-tight">HIMASTI UMMAT</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            <span>GLOBAL PRIVACY STANDARDS COMPLIANT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Kebijakan Privasi
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Standar perlindungan data pribadi dan privasi digital global untuk seluruh sivitas akademika, kader, dan pengguna Portal HIMASTI Universitas Muhammadiyah Mataram.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Terakhir Diperbarui: 4 September 2026
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
              Versi Dokumen: 2.5 (Global Edition)
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">

        {/* Global Compliance Frameworks Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Kepatuhan Standar Privasi Global</h2>
              <p className="text-xs text-slate-500">Prinsip tata kelola data kami diselaraskan dengan kerangka kerja hukum internasional:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800">GDPR (EU)</span>
              <div className="text-xs font-bold text-slate-900">Regulasi Perlindungan Data Eropa</div>
              <p className="text-[11px] text-slate-500">Mematuhi hak penghapusan akun (*right to be forgotten*), portabilitas data, dan minimasi data (Art. 5, 6, 17 GDPR).</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">CCPA / CPRA</span>
              <div className="text-xs font-bold text-slate-900">Standar Konsumen California</div>
              <p className="text-[11px] text-slate-500">Jaminan mutlak: Kami <b>tidak pernah menjual atau menyewakan</b> data pribadi mahasiswa kepada pihak ketiga mana pun.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800">APPLE & GOOGLE</span>
              <div className="text-xs font-bold text-slate-900">Pedoman Pass & Dompet Digital</div>
              <p className="text-[11px] text-slate-500">Penerbitan file `.pkpass` dan Google Wallet Pass mengikuti batasan privasi tanpa pelacakan lokasi latar belakang tanpa izin.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800">FIDO2 / WEBAUTHN</span>
              <div className="text-xs font-bold text-slate-900">Standar W3C Passwordless</div>
              <p className="text-[11px] text-slate-500">Biometrik Anda diproses di Secure Enclave lokal perangkat, bukan di server cloud kami.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-red-100 text-red-800">UU PDP (INDONESIA)</span>
              <div className="text-xs font-bold text-slate-900">UU No. 27 Tahun 2022</div>
              <p className="text-[11px] text-slate-500">Persetujuan eksplisit, dasar hukum pemrosesan, dan tanggung jawab hukum pengendali data di wilayah Republik Indonesia.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">ISO/IEC 27701</span>
              <div className="text-xs font-bold text-slate-900">Privasi Informasi Terstandarisasi</div>
              <p className="text-[11px] text-slate-500">Enkripsi data transit (TLS 1.3), enkripsi at-rest, hashing kata sandi Bcrypt, dan audit log kepengurusan.</p>
            </div>
          </div>
        </div>

        {/* Detailed Document Sections */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] space-y-12">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Data yang Kami Kumpulkan & Prinsip Minimasi Data
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Sesuai prinsip <i>Data Minimization</i> (Art. 5 GDPR), kami hanya mengumpulkan data yang mutlak diperlukan untuk operasional perkaderan, presensi kegiatan, dan layanan akademik internal:
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-700">
                <b className="text-slate-900 block mb-1">A. Data Identitas Akademik</b>
                Nomor Induk Mahasiswa (NIM), Nama Lengkap, Tahun Angkatan, Program Studi Sistem & Teknologi Informasi, serta status kaderisasi (Kader Muda / Kader Aktif / Demisioner).
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-700">
                <b className="text-slate-900 block mb-1">B. Kredensial Autentikasi</b>
                Alamat email terdaftar, hash kata sandi yang dienkripsi satu arah dengan algoritma Bcrypt (cost factor 10), serta public key autentikasi Passkey FIDO2.
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-700">
                <b className="text-slate-900 block mb-1">C. Catatan Presensi & QR Code</b>
                Waktu pemindaian (*timestamp*), identitas rapat/agenda ormawa, dan status kehadiran yang ditandatangani secara kriptografis untuk mencegah kecurangan.
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-700">
                <b className="text-slate-900 block mb-1">D. Aktivitas Gamifikasi & Saldo XP</b>
                Poin pengalaman (XP) yang diperoleh dari penyelesaian tantangan pemrograman di LeetCode Arena, riwayat transaksi kosmetik di Studio Gaya, dan peringkat di Leaderboard Dewa Kode.
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Keamanan Biometrik & Passkey (WebAuthn / FIDO2)
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Portal HIMASTI menerapkan standar internasional <b>W3C WebAuthn</b> untuk login tanpa kata sandi menggunakan Face ID, Touch ID, atau Windows Hello:
            </p>
            <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs sm:text-sm text-blue-900 space-y-2">
              <div className="font-bold flex items-center gap-2 text-blue-950">
                <KeyRound className="w-4 h-4 text-blue-600" />
                Zero-Knowledge Biometric Storage:
              </div>
              <p>
                Ketika Anda memverifikasi wajah atau sidik jari, proses verifikasi biometrik berlangsung <b>secara eksklusif di dalam hardware Secure Enclave / TPM perangkat Anda</b>.
              </p>
              <p>
                Server kami hanya menerima tanda tangan digital asimetris (kunci publik). <b>Data biometrik fisik Anda tidak pernah keluar dari ponsel/laptop dan tidak pernah tersimpan di server kami.</b>
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                KTA Digital & Kebijakan Dompet Digital (Apple Wallet & Google Wallet)
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Kartu Tanda Anggota (KTA) Digital dapat disimpan ke aplikasi dompet smartphone Anda melalui format paket resmi:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600 pl-2">
              <li><b>Apple Wallet (`.pkpass`):</b> Mengikuti spesifikasi resmi Apple Wallet Pass Developer Documentation. Paket pass terenkripsi memuat serial number unik, nama, NIM, dan QR Code terenkripsi.</li>
              <li><b>Google Wallet:</b> Mematuhi pedoman Google Wallet Passes API untuk kartu anggota digital (*generic pass*).</li>
              <li><b>Kerahasiaan Barcode:</b> Kode QR pada KTA hanya memuat identifikasi keabsahan mahasiswa dan tidak memuat kata sandi atau data finansial rahasia apa pun.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-mono font-bold text-sm">
                04
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Hak Pengguna Menurut Regulasi Global (Hak Anda)
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Kami menjamin hak-hak privasi penuh bagi seluruh pengguna sesuai standar GDPR (Uni Eropa), CCPA (Amerika Serikat), dan UU PDP No. 27/2022 (Indonesia):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
                <b className="text-slate-900 block mb-1">1. Hak Akses (Right to Access)</b>
                Anda berhak melihat seluruh data profil, rekam jejak presensi, dan data keuangan kas yang terkait dengan akun Anda kapan saja.
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
                <b className="text-slate-900 block mb-1">2. Hak Koreksi (Right to Rectification)</b>
                Anda dapat memperbarui data yang tidak akurat (seperti nomor telepon, keahlian, dan foto profil) secara langsung melalui dashboard profil.
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
                <b className="text-slate-900 block mb-1">3. Hak Penghapusan (Right to be Forgotten)</b>
                Setelah lulus atau demisioner, kader berhak mengajukan penghapusan akun atau pencabutan data pribadi dari basis data publik himpunan.
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
                <b className="text-slate-900 block mb-1">4. Hak Portabilitas Data (Data Portability)</b>
                Anda dapat mengunduh salinan data KTA Anda dalam format standar (`.pkpass`, JSON, PDF) untuk dipergunakan di platform lain.
              </div>
            </div>

            {/* Explicit Right to be Forgotten Procedure */}
            <div className="mt-4 p-5 rounded-2xl bg-red-50/70 border border-red-200 text-xs sm:text-sm text-red-950 space-y-2">
              <div className="font-bold flex items-center gap-2 text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Prosedur Pencabutan Persetujuan & Permohonan Hapus Data:
              </div>
              <p>
                Sesuai Pasal 8 UU No. 27/2022 tentang Pelindungan Data Pribadi dan Pasal 17 GDPR, apabila Anda sebagai mahasiswa/alumni <b>berkeberatan data Anda tercatat di portal ini</b>, Anda berhak mencabut persetujuan kapan saja.
              </p>
              <p>
                Kirimkan permohonan ke email resmi <b>himasti@ummat.ac.id</b> dengan subjek <code className="bg-red-100 px-1 py-0.5 rounded text-red-900">[HAPUS DATA] - Nama - NIM</code>. Tim pengurus akan memverifikasi dan menghapus/menyamarkan data keanggotaan Anda dari sistem dalam waktu maksimal <b>3×24 jam kerja</b> tanpa syarat yang memberatkan.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-mono font-bold text-sm">
                05
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Keamanan Infrastruktur, Penyimpanan & Audit Trail
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Kami menerapkan standar keamanan teknis berlapis untuk melindungi integritas data dari akses ilegal, manipulasi, atau kebocoran:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <Lock className="w-4 h-4 text-blue-600 mb-1.5" />
                <b className="text-slate-900 block">Enkripsi TLS 1.3</b>
                Seluruh lalu lintas data antara browser dan server dienkripsi menggunakan sertifikat SSL/TLS kelas perbankan.
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <UserCheck className="w-4 h-4 text-emerald-600 mb-1.5" />
                <b className="text-slate-900 block">Multi-Tier RBAC</b>
                Hak akses terbatas berbasis peran (*Role-Based Access Control*) memastikan kader biasa tidak dapat mengakses data sensitif organisasi.
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <Server className="w-4 h-4 text-purple-600 mb-1.5" />
                <b className="text-slate-900 block">Immutable Audit Logs</b>
                Setiap perubahan peran, mutasi kas, atau tindakan administratif terekam permanen dalam log audit yang tidak dapat dihapus.
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-4 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-sm">
                06
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Pemberitahuan Celah Keamanan & Kontak Tim Privasi (DPO)
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Apabila Anda memiliki pertanyaan seputar kebijakan privasi ini, ingin mengajukan hak privasi, atau menemukan potensi celah keamanan (*vulnerability disclosure*), silakan hubungi tim kami:
            </p>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-slate-900">Divisi Komunikasi & Informasi (Kominfo) HIMASTI</div>
                <div className="text-xs text-slate-500">Fakultas Teknik, Universitas Muhammadiyah Mataram</div>
                <div className="text-xs font-mono text-blue-600 flex items-center gap-1.5 pt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>himasti@ummat.ac.id</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href="mailto:himasti@ummat.ac.id" 
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Hubungi DPO</span>
                </a>
                <Link 
                  href="/updates" 
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Catatan Rilis
                </Link>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Clean Global Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto space-y-2">
          <p>© 2026 HIMASTI Universitas Muhammadiyah Mataram. Seluruh hak cipta dilindungi undang-undang.</p>
          <p className="text-[11px] text-slate-400">
            Sistem Informasi, Presensi Biometrik FIDO2, dan Modul IT Terpadu Program Studi Sistem & Teknologi Informasi.
          </p>
        </div>
      </footer>

    </div>
  );
}
