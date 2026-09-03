import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, ArrowLeft, Zap, Shield, Smartphone, Award, 
  GitBranch, CheckCircle2, Rocket, Calendar, Tag, ExternalLink
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
    summary: "Integrasi resmi Apple Wallet & Google Wallet untuk KTA Digital serta akselerasi grafis 60 FPS pada kartu 3D holografik di smartphone.",
    highlights: [
      {
        type: "FEATURE",
        color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        title: "Apple Wallet & Google Wallet (.pkpass) Integration",
        desc: "Kader kini dapat menyimpan Kartu Tanda Anggota (KTA) langsung ke aplikasi Apple Wallet bawaan iPhone dan Google Wallet di Android. Mendukung presensi rapat instan tanpa perlu selalu membuka browser."
      },
      {
        type: "PERFORMANCE",
        color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        title: "Mobile GPU 60 FPS Acceleration Engine",
        desc: "Mengeliminasi multi-pass Gaussian blur berat (blur-3xl) dan menggantinya dengan pure GPU radial-gradient serta hardware layer isolation (transform: translateZ(0)). Animasi kartu 3D kini berjalan super mulus dan hemat baterai di semua smartphone."
      },
      {
        type: "COMPLIANCE",
        color: "bg-violet-500/20 text-violet-300 border-violet-500/30",
        title: "Pusat Kebijakan Privasi (UU PDP No. 27/2022)",
        desc: "Peluncuran dokumen kebijakan privasi resmi yang menjamin keamanan data mahasiswa, isolasi biometrik FIDO2 Passkeys di Secure Enclave lokal, dan hak transparansi kader."
      },
      {
        type: "UI/UX",
        color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
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
        color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        title: "Studio Gaya & Toko XP",
        desc: "Koleksi frame avatar eksklusif (Cyberpunk Laser, Matrix Emerald, Royal Gold, Cosmic Nebula, Phoenix Flame) dan efek tipografi animasi yang dapat dibeli menggunakan XP dari penyelesaian tantangan koding."
      },
      {
        type: "FEATURE",
        color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        title: "Digital KTA 3D Hologram dengan Sensor Gyroscope",
        desc: "Kartu identitas interaktif yang merespons orientasi fisik smartphone secara real-time, dilengkapi chip IC pintar, sweep laser scanning, dan QR Code dinamis."
      },
      {
        type: "GAMIFICATION",
        color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
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
        color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        title: "Offline Attendance Scanner (PWA)",
        desc: "Aplikasi scanner presensi panitia tetap dapat memindai QR kartu mahasiswa walau jaringan internet kampus terputus, tersimpan di IndexedDB dan otomatis sinkron saat online."
      },
      {
        type: "SECURITY",
        color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        title: "Autentikasi Biometrik Passkey (FIDO2)",
        desc: "Kemampuan login menggunakan Face ID, Touch ID, dan sensor sidik jari perangkat dengan standar keamanan WebAuthn."
      },
      {
        type: "INTEGRATION",
        color: "bg-sky-500/20 text-sky-300 border-sky-500/30",
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
        color: "bg-slate-500/20 text-slate-300 border-slate-500/30",
        title: "Manajemen Basis Data Kader",
        desc: "Database terintegrasi mahasiswa Sistem & Teknologi Informasi, pemetaan angkatan, dan direktori keahlian."
      },
      {
        type: "CORE",
        color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        title: "Modul Keuangan & Kas Digital",
        desc: "Transparansi arus kas ormawa dengan pencatatan pemasukan, pengeluaran, dan audit trail."
      },
      {
        type: "CORE",
        color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        title: "Bank Modul IT & Katalog Karya",
        desc: "Pusat berbagi materi kuliah pemrograman serta showcase proyek karya inovasi mahasiswa."
      }
    ]
  }
];

export default function UpdatesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div 
        className="fixed top-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
      />
      <div 
        className="fixed bottom-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }}
      />

      {/* Header Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Portal</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white p-1 overflow-hidden shadow-sm">
              <Image src="/images/logo_himasti.jpg" alt="Logo HIMASTI" width={28} height={28} className="w-full h-full object-contain" />
            </div>
            <span className="font-mono font-bold text-sm text-white">HIMASTI CHANGELOG</span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/40 text-violet-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRODUCT UPDATES & RELEASE NOTES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Catatan Rilis & Pembaruan
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Perjalanan inovasi teknis Portal HIMASTI UMMAT dari waktu ke waktu — menghadirkan platform ormawa tercepat, paling aman, dan terdepan.
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative border-l border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-16">
          
          {updates.map((item, idx) => (
            <div key={item.version} className="relative group">
              
              {/* Timeline Indicator Dot */}
              <div className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full border-4 border-slate-950 flex items-center justify-center ${
                item.isLatest 
                  ? "bg-cyan-400 shadow-[0_0_15px_#22d3ee]" 
                  : "bg-slate-700"
              }`}>
                {item.isLatest && <div className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />}
              </div>

              {/* Version Header Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden space-y-5 hover:border-slate-700 transition-all">
                
                {/* Top Metas */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                      {item.version}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      item.isLatest 
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" 
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Detailed Change Cards */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {item.highlights.map((h, hIdx) => (
                    <div 
                      key={hIdx}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${h.color}`}>
                          {h.type}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {h.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed pl-0.5">
                        {h.desc}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          ))}

        </div>

        {/* Quick CTA Box */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/50 via-slate-900/80 to-purple-950/50 border border-slate-800 text-center space-y-4">
          <Rocket className="w-8 h-8 text-cyan-400 mx-auto" />
          <h3 className="text-lg sm:text-xl font-bold text-white">Punya Usulan Fitur atau Menemukan Masalah?</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Portal ini dikembangkan secara aktif dan terbuka oleh dan untuk mahasiswa HIMASTI. Kontribusi ide Anda sangat berharga bagi kemajuan organisasi.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link 
              href="/admin" 
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
            >
              Kembali ke Dashboard
            </Link>
            <Link 
              href="/privacy" 
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              Baca Kebijakan Privasi
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500">
        <p>© 2026 HIMASTI Universitas Muhammadiyah Mataram. Changelog Engine v2.5.</p>
      </footer>

    </div>
  );
}
