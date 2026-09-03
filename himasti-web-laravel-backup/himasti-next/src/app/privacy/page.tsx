import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, Lock, Eye, KeyRound, Server, UserCheck, 
  FileText, ArrowLeft, ExternalLink, Sparkles, Mail
} from "lucide-react";

export const metadata = {
  title: "Kebijakan Privasi - Portal HIMASTI UMMAT",
  description: "Kebijakan privasi dan perlindungan data pribadi mahasiswa di Portal Resmi HIMASTI UMMAT.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Ambient Cyber Grid & Glows */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div 
        className="fixed -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)" }}
      />

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white p-1 overflow-hidden shadow-sm">
              <Image src="/images/logo_himasti.jpg" alt="Logo HIMASTI" width={28} height={28} className="w-full h-full object-contain" />
            </div>
            <span className="font-mono font-bold text-sm text-white">HIMASTI UMMAT</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>UU PDP NO. 27 TAHUN 2022 COMPLIANT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Komitmen resmi Himpunan Mahasiswa Sistem & Teknologi Informasi (HIMASTI) Fakultas Teknik Universitas Muhammadiyah Mataram dalam melindungi data pribadi, biometrik, dan privasi seluruh kader.
          </p>
          <div className="text-xs font-mono text-slate-500">
            Terakhir Diperbarui: 4 September 2026 • Versi Dokumen 2.5
          </div>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Biometrik Aman (FIDO2)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sidik jari atau Face ID Anda diproses lokal di perangkat dan <b>tidak pernah dikirimkan</b> ke server.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <Lock className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-bold text-white">Enkripsi End-to-End</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kata sandi dienkripsi dengan Bcrypt satu arah, dan komunikasi jaringan dilindungi TLS 1.3.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <Eye className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Transparansi Organisasi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tidak ada data yang dijual ke pihak komersial. Seluruh pencatatan digunakan demi kepentingan kaderisasi.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-slate-300 text-sm sm:text-base leading-relaxed divide-y divide-slate-800/80">

          {/* Section 1 */}
          <section className="space-y-4 pt-8 first:pt-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <span className="text-cyan-400 font-mono text-base">01.</span>
              Data yang Kami Kumpulkan
            </h2>
            <p>
              Dalam rangka menjalankan sistem administrasi kemahasiswaan digital dan presensi organisasi, Portal HIMASTI mengumpulkan informasi berikut:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
              <li><b className="text-slate-200">Data Identitas Akademik:</b> Nomor Induk Mahasiswa (NIM), Nama Lengkap, Tahun Angkatan, Program Studi Sistem & Teknologi Informasi, serta status kaderisasi.</li>
              <li><b className="text-slate-200">Data Akun & Kredensial:</b> Alamat email, hash kata sandi (diacak satu arah dengan *salt* unik), dan public key autentikasi Passkey / WebAuthn.</li>
              <li><b className="text-slate-200">Data Presensi & Kegiatan:</b> Catatan kehadiran rapat, waktu pemindaian QR code presensi, kepanitiaan, dan riwayat partisipasi event.</li>
              <li><b className="text-slate-200">Data Gamifikasi & Toko XP:</b> Poin pengalaman (XP), riwayat penyelesaian tantangan koding (LeetCode Arena), kosmetik avatar (frame, title, efek nama) yang diperoleh.</li>
              <li><b className="text-slate-200">Data Keuangan Kas:</b> Transaksi iuran kas dan donasi kegiatan yang diaudit demi transparansi kepengurusan.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <span className="text-cyan-400 font-mono text-base">02.</span>
              Keamanan Biometrik & Passkey (WebAuthn)
            </h2>
            <p>
              Portal HIMASTI mendukung standar login masa depan tanpa kata sandi (*passwordless*) menggunakan <b>FIDO2 WebAuthn Passkeys</b>:
            </p>
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2 text-xs sm:text-sm text-cyan-200">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Jaminan Keamanan Biometrik:
              </p>
              <p>
                Ketika Anda menggunakan Face ID, Touch ID, atau sensor sidik jari perangkat, data biometrik Anda <b>diproses secara eksklusif di dalam hardware Secure Enclave</b> ponsel atau laptop Anda.
              </p>
              <p>
                Server Portal HIMASTI hanya menerima tanda tangan kriptografis publik (public key challenge), sehingga <b>server kami tidak memiliki akses apa pun ke sidik jari maupun wajah Anda</b>.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <span className="text-cyan-400 font-mono text-base">03.</span>
              Kartu Tanda Anggota (KTA) Digital & Dompet Digital
            </h2>
            <p>
              Digital KTA HIMASTI menyajikan data keanggotaan dalam bentuk kartu 3D holografik dan dapat diekspor ke <b>Apple Wallet</b> (`.pkpass`) serta <b>Google Wallet</b>.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
              <li>Barcode QR Code yang tertera pada KTA berisi payload tanda tangan resmi terenkripsi untuk mencegah pemalsuan identitas kader.</li>
              <li>Penggunaan pass digital pada Apple Wallet dan Google Wallet disimpan secara lokal di dompet bawaan smartphone Anda tanpa izin pelacakan lokasi latar belakang tanpa izin.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <span className="text-cyan-400 font-mono text-base">04.</span>
              Pembatasan Akses & RBAC (Role-Based Access Control)
            </h2>
            <p>
              Data kader hanya dapat diakses berdasarkan hak akses peran (*Role-Based Access Control*) yang ketat:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
              <li><b className="text-slate-200">Kader Biasa:</b> Hanya dapat melihat dan menyunting profil pribadi, KTA digital, bank modul, katalog karya, dan info lomba.</li>
              <li><b className="text-slate-200">Sekretaris & Bendahara:</b> Memiliki wewenang terbatas pada persuratan dan pembukuan kas.</li>
              <li><b className="text-slate-200">Super Admin & Pengurus Inti:</b> Memiliki akses pengelolaan dengan seluruh aktivitas terekam dalam <b>Audit Logs</b> yang tidak dapat dimanipulasi (*immutable*).</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <span className="text-cyan-400 font-mono text-base">05.</span>
              Hak Pengguna (*Your Rights*)
            </h2>
            <p>
              Sebagai pemilik data pribadi yang sah, Anda memiliki hak-hak berikut:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <b className="text-white block mb-1">Hak Akses & Koreksi</b>
                Memperbarui data kontak, foto, minat skill, dan portofolio karya sewaktu-waktu melalui menu Profil.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <b className="text-white block mb-1">Hak Pencabutan Passkey</b>
                Menghapus kredensial biometric FIDO2 dari daftar perangkat yang diizinkan kapan saja.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <b className="text-white block mb-1">Hak Penghapusan Akun</b>
                Mengajukan permohonan penonaktifan akun setelah lulus atau demisioner dari kepengurusan.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <b className="text-white block mb-1">Hak Portabilitas Data</b>
                Mengunduh data identitas keanggotaan dalam format file standar (`.pkpass`, JSON, PDF).
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-4 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <span className="text-cyan-400 font-mono text-base">06.</span>
              Hubungi Pengelola Data
            </h2>
            <p>
              Apabila Anda memiliki pertanyaan, keluhan, atau ingin melaporkan potensi celah keamanan (*vulnerability disclosure*), silakan menghubungi pengurus:
            </p>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-white">Divisi Komunikasi & Informasi (Kominfo)</div>
                <div className="text-xs text-slate-400">HIMASTI Fakultas Teknik Universitas Muhammadiyah Mataram</div>
                <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 pt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>himasti@ummat.ac.id</span>
                </div>
              </div>
              <Link 
                href="/admin" 
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
              >
                Buka Portal Kader
              </Link>
            </div>
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500">
        <p>© 2026 HIMASTI Universitas Muhammadiyah Mataram. All rights reserved.</p>
        <p className="mt-1">Dibuat dengan dedikasi penuh untuk kemajuan teknologi informasi kampus.</p>
      </footer>

    </div>
  );
}
