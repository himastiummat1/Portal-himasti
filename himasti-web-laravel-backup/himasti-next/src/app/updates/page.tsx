import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, ArrowLeft, Zap, Shield, Smartphone, Award, 
  GitBranch, CheckCircle2, Rocket, Calendar, Tag, ExternalLink,
  Clock, ShieldCheck
} from "lucide-react";

export const metadata = {
  title: "Catatan Rilis & Pembaruan - Portal HIMASTI UMMAT",
  description: "Daftar pembaruan, rilis fitur baru, dan changelog performa resmi Portal HIMASTI UMMAT.",
};

const updates = [
  {
    version: "v2.5",
    date: "4 September 2026",
    title: "Wallet Integration & Mobile GPU Performance Engine",
    badge: "LATEST RELEASE",
    isLatest: true,
    summary: "Integrasi resmi Apple Wallet (.pkpass) & Google Wallet untuk KTA Digital serta akselerasi grafis 60 FPS pada kartu 3D holografik di smartphone.",
    highlights: [
      {
        type: "FEATURE",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        title: "Apple Wallet & Google Wallet (.pkpass) Integration",
        desc: "Kader kini dapat menyimpan Kartu Tanda Anggota (KTA) langsung ke aplikasi Apple Wallet bawaan iPhone dan Google Wallet di Android. Mendukung presensi rapat instan tanpa perlu selalu membuka browser."
      },
      {
        type: "PERFORMANCE",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        title: "Mobile GPU 60 FPS Acceleration Engine",
        desc: "Mengeliminasi multi-pass Gaussian blur berat (blur-3xl) dan menggantinya dengan pure GPU radial-gradient serta hardware layer isolation (transform: translateZ(0)). Animasi kartu 3D kini berjalan super mulus dan hemat baterai di semua smartphone."
      },
      {
        type: "COMPLIANCE",
        color: "bg-purple-50 text-purple-700 border-purple-200",
        title: "Pusat Kebijakan Privasi Global (GDPR, CCPA & UU PDP)",
        desc: "Peluncuran dokumen kebijakan privasi resmi yang menjamin keamanan data mahasiswa, isolasi biometrik FIDO2 Passkeys di Secure Enclave lokal, dan hak transparansi kader berstandar internasional."
      },
      {
        type: "UI/UX",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        title: "Pusat Catatan Rilis (Changelog)",
        desc: "Halaman dokumentasi pembaruan publik agar pengurus, dosen, dan kader dapat memantau evolusi teknologi Portal HIMASTI."
      }
    ]
  },
  {
    version: "v2.0",
    date: "28 Agustus 2026",
    title: "Studio Gaya & Gamifikasi Toko XP",
    badge: "MAJOR UPDATE",
    isLatest: false,
    summary: "Sistem ekonomi gamifikasi pertama di himpunan mahasiswa dengan kosmetik avatar animasi dan kartu identitas 3D holografik.",
    highlights: [
      {
        type: "FEATURE",
        color: "bg-purple-50 text-purple-700 border-purple-200",
        title: "Studio Gaya & Toko XP",
        desc: "Koleksi frame avatar eksklusif (Cyberpunk Laser, Matrix Emerald, Royal Gold, Cosmic Nebula, Phoenix Flame) dan efek tipografi animasi yang dapat dibeli menggunakan XP dari penyelesaian tantangan koding."
      },
      {
        type: "FEATURE",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        title: "Digital KTA 3D Hologram dengan Sensor Gyroscope",
        desc: "Kartu identitas interaktif yang merespons orientasi fisik smartphone secara real-time, dilengkapi chip IC pintar, sweep laser scanning, dan QR Code dinamis."
      },
      {
        type: "GAMIFICATION",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        title: "Leaderboard Dewa Kode",
        desc: "Papan peringkat real-time untuk memacu semangat kompetisi koding antar-kader HIMASTI."
      }
    ]
  },
  {
    version: "v1.5",
    date: "15 Juli 2026",
    title: "Offline PWA Scanner & Biometric Security",
    badge: "SECURITY & RELIABILITY",
    isLatest: false,
    summary: "Dukungan presensi offline tanpa internet dan autentikasi biometrik modern tanpa kata sandi.",
    highlights: [
      {
        type: "FEATURE",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        title: "Offline Attendance Scanner (PWA)",
        desc: "Aplikasi scanner presensi panitia tetap dapat memindai QR kartu mahasiswa walau jaringan internet kampus terputus, tersimpan di IndexedDB dan otomatis sinkron saat online."
      },
      {
        type: "SECURITY",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        title: "Autentikasi Biometrik Passkey (FIDO2)",
        desc: "Kemampuan login menggunakan Face ID, Touch ID, dan sensor sidik jari perangkat dengan standar keamanan WebAuthn."
      },
      {
        type: "INTEGRATION",
        color: "bg-sky-50 text-sky-700 border-sky-200",
        title: "Bot Telegram Webhook & Broadcast",
        desc: "Pengiriman notifikasi agenda rapat dan pengumuman himpunan langsung ke kanal Telegram ormawa secara otomatis."
      }
    ]
  },
  {
    version: "v1.0",
    date: "1 Juni 2026",
    title: "Inisiasi & Arsitektur Utama Portal HIMASTI",
    badge: "FOUNDATION",
    isLatest: false,
    summary: "Peluncuran fondasi sistem informasi digital berbasis Next.js App Router, Prisma ORM, dan PostgreSQL.",
    highlights: [
      {
        type: "CORE",
        color: "bg-slate-100 text-slate-700 border-slate-200",
        title: "Manajemen Basis Data Kader",
        desc: "Database terintegrasi mahasiswa Sistem & Teknologi Informasi, pemetaan angkatan, dan direktori keahlian."
      },
      {
        type: "CORE",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        title: "Modul Keuangan & Kas Digital",
        desc: "Transparansi arus kas ormawa dengan pencatatan pemasukan, pengeluaran, dan audit trail."
      },
      {
        type: "CORE",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        title: "Bank Modul IT & Katalog Karya",
        desc: "Pusat berbagi materi kuliah pemrograman serta showcase proyek karya inovasi mahasiswa."
      }
    ]
  }
];

export default function UpdatesPage() {
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
              <span className="font-bold text-sm text-slate-900 tracking-tight">HIMASTI CHANGELOG</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>PRODUCT UPDATES & RELEASE NOTES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Catatan Rilis & Pembaruan
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Perjalanan inovasi teknis Portal HIMASTI UMMAT dari waktu ke waktu — menghadirkan platform ormawa tercepat, paling aman, dan terdepan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Rilis Aktif: v2.5 Stable
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
              Arsitektur: Next.js 16 (Turbopack) & Prisma ORM
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Timeline */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
        
        <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          
          {updates.map((item) => (
            <div key={item.version} className="relative group">
              
              {/* Timeline Indicator Dot */}
              <div className={`absolute -left-[33px] sm:-left-[49px] top-2 w-6 h-6 rounded-full border-4 border-[#f8fafc] flex items-center justify-center ${
                item.isLatest 
                  ? "bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]" 
                  : "bg-slate-400"
              }`}>
                {item.isLatest && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>

              {/* Version Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] space-y-5 hover:border-slate-300 transition-all">
                
                {/* Header Metas */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
                      {item.version}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      item.isLatest 
                        ? "bg-blue-50 text-blue-700 border-blue-200" 
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Change Details */}
                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {item.highlights.map((h, hIdx) => (
                    <div 
                      key={hIdx}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${h.color}`}>
                          {h.type}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {h.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-0.5">
                        {h.desc}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          ))}

        </div>

        {/* CTA Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-[0_8px_30px_-4px_rgba(14,165,233,0.03)] text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto">
            <Rocket className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Punya Usulan Fitur Baru?</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Portal ini dibangun secara terbuka oleh dan untuk seluruh mahasiswa Sistem & Teknologi Informasi HIMASTI UMMAT. Ide dan masukan Anda senantiasa dinantikan!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link 
              href="/" 
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm"
            >
              Kembali ke Beranda
            </Link>
            <Link 
              href="/privacy" 
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
            >
              Baca Kebijakan Privasi
            </Link>
          </div>
        </div>

      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10 px-4 text-center text-xs text-slate-500">
        <p>© 2026 HIMASTI Universitas Muhammadiyah Mataram. Changelog Engine v2.5.</p>
      </footer>

    </div>
  );
}
