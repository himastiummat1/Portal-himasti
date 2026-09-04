import Link from "next/link";
import Image from "next/image";
import { 
  Scale, ShieldAlert, FileText, ArrowLeft, CheckCircle2, 
  AlertTriangle, Building2, Gavel, HelpCircle, Mail, Clock, 
  ExternalLink, UserX
} from "lucide-react";

export const metadata = {
  title: "Ketentuan Layanan (Terms of Service) - Portal HIMASTI UMMAT",
  description: "Syarat dan Ketentuan Layanan resmi penggunaan ekosistem digital Portal HIMASTI Fakultas Teknik Universitas Muhammadiyah Mataram.",
};

export default function TermsPage() {
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
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-800 font-medium hidden sm:inline-block">
              Kebijakan Privasi
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5 text-slate-700" />
            <span>LEGAL TERMS OF SERVICE & ORGANIZATIONAL JURISDICTION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Syarat & Ketentuan Layanan
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Aturan resmi penggunaan sistem informasi internal Himpunan Mahasiswa Sistem & Teknologi Informasi (HIMASTI) Fakultas Teknik Universitas Muhammadiyah Mataram.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Berlaku Efektif: 4 September 2026
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
              Dokumen Hukum: ToS-2026-V1
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">

        {/* Golden Legal Shield Box (Dispute & Jurisdiction) */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <Gavel className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-amber-950">
                Klausul Wajib: Penyelesaian Internal & Yurisdiksi Kampus
              </h2>
              <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                Portal HIMASTI adalah fasilitas teknologi informasi intra-kampus resmi di bawah naungan <b>Program Studi Sistem & Teknologi Informasi, Fakultas Teknik Universitas Muhammadiyah Mataram</b>.
              </p>
              <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed pt-1">
                Segala bentuk keberatan, kesalahpahaman, sengketa, atau perselisihan data yang timbul terkait portal ini <b>wajib diselesaikan terlebih dahulu secara musyawarah untuk mufakat</b> melalui mediasi internal Program Studi dan Pembina Organisasi Mahasiswa sebelum menempuh jalur eksternal mana pun, sesuai prinsip <i>Restorative Justice</i> dan tata tertib kemahasiswaan.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Terms Document */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] space-y-12">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Kedudukan Hukum & Otoritas Sistem
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Portal HIMASTI (termasuk modul presensi biometrik FIDO2, bank modul, katalog karya, KTA digital, dan sistem poin XP) dikembangkan dan dikelola secara resmi oleh Pengurus Himpunan Mahasiswa Sistem & Teknologi Informasi (HIMASTI) Periode Berjalan atas mandat Anggaran Dasar / Anggaran Rumah Tangga (AD/ART) organisasi dan persetujuan Program Studi S&TI FT UMMAT.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
              Sistem ini <b>bukan entitas komersial</b> dan tidak terafiliasi dengan pihak swasta mana pun. Penggunaan portal semata-mata ditujukan untuk efisiensi administrasi perkaderan, keterbukaan informasi publik, dan pengembangan potensi akademik mahasiswa.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Persetujuan Eksplisit & Pendaftaran Akun
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Dengan mendaftar, membuat akun, atau masuk ke dalam Portal HIMASTI, pengguna:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600 pl-2">
              <li>Secara sadar dan sukarela memberikan persetujuan eksplisit (*lawful consent* menurut UU No. 27/2022 tentang Pelindungan Data Pribadi) untuk pencatatan nama, NIM, angkatan, dan riwayat presensi keanggotaan.</li>
              <li>Bertanggung jawab penuh atas kerahasiaan kata sandi dan perangkat otentikasi biometrik yang digunakan untuk login.</li>
              <li>Menjamin bahwa data yang dimasukkan adalah data pribadi yang valid dan bukan milik pihak lain tanpa hak.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Hak Penghapusan Data (*Right to be Forgotten*)
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Kami menghormati hak setiap mahasiswa yang berkeberatan data dirinya tercantum pada platform ini:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs sm:text-sm text-slate-700">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <UserX className="w-4 h-4 text-blue-600" />
                Mekanisme Pencabutan & Penghapusan Mandiri:
              </p>
              <p>
                Bagi mahasiswa atau alumni yang ingin data keanggotaannya dihapus, disamarkan (*anonymized*), atau dinonaktifkan dari sistem, dapat mengajukan permohonan melalui email resmi <b>himasti@ummat.ac.id</b> dengan menyertakan foto Kartu Tanda Mahasiswa (KTM) yang sah.
              </p>
              <p className="text-slate-500 text-xs">
                Pengurus wajib memproses permohonan tersebut dalam waktu maksimal 3×24 jam kerja tanpa pungutan biaya apa pun.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-sm">
                04
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Larangan Penggunaan & Integritas Sistem (UU ITE)
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Pengguna dilarang keras melakukan tindakan melawan hukum terhadap portal ini, antara lain:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600 pl-2">
              <li>Melakukan upaya akses tanpa hak (*unauthorized access* / pembobolan) ke database atau akun administrator (Pasal 30 UU ITE).</li>
              <li>Melakukan pemalsuan identitas atau memindai presensi QR code milik orang lain secara curang (*fraudulent attendance*).</li>
              <li>Menyebarkan tuduhan palsu, fitnah, atau laporan yang tidak berdasar dengan maksud mencemarkan nama baik organisasi atau pengurus (Pasal 27A/28 UU ITE jo. Pasal 220 & 310 KUHP).</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-sm">
                05
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Penafian Tanggung Jawab (*Limitation of Liability*)
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Layanan disediakan secara *"apa adanya"* (*as-is*) dan *"sebagaimana tersedia"* (*as-available*). Pengurus HIMASTI berupaya sebaik mungkin menjaga ketersediaan sistem dan keamanan data, namun tidak bertanggung jawab atas gangguan koneksi jaringan internet kampus, kegagalan perangkat keras pengguna, atau kehilangan data akibat kelalaian kata sandi oleh pengguna sendiri.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-sm">
                06
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Kontak Advokasi & Mediasi Organisasi
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Jika Anda memiliki saran, pengaduan tata kelola, atau permohonan hak data, silakan hubungi tim pengurus resmi:
            </p>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-slate-900">Pengurus Harian HIMASTI FT UMMAT</div>
                <div className="text-xs text-slate-500">Ruang Ormawa Fakultas Teknik, Universitas Muhammadiyah Mataram</div>
                <div className="text-xs font-mono text-blue-600 flex items-center gap-1.5 pt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>himasti@ummat.ac.id</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  href="/" 
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Kembali ke Beranda
                </Link>
                <Link 
                  href="/privacy" 
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10 px-4 text-center text-xs text-slate-500">
        <p>© 2026 HIMASTI Universitas Muhammadiyah Mataram. Terms of Service v1.0.</p>
      </footer>

    </div>
  );
}
