"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Terminal, BookOpen, Layers } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import CompetitionMarquee from "./CompetitionMarquee";

export default function LandingAnimation({ competitions }: { competitions?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Lacak progress scroll hanya pada area 200vh
  const { scrollYProgress } = useScroll();

  // Animasi Teks: Naik ke atas (-150px) dan memudar
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const textY = useTransform(scrollY, [0, 400], [0, -150]);
  const textPointerEvents = useTransform(scrollY, (v) => v > 400 ? "none" : "auto");

  // Animasi Logo: Muncul dari bawah (150px), naik ke tengah (0px), dan membesar
  const logoOpacity = useTransform(scrollY, [300, 700], [0, 1]);
  const logoY = useTransform(scrollY, [300, 700], [150, 0]);
  const logoScale = useTransform(scrollY, [300, 800], [0.8, 1.8]);
  const logoPointerEvents = useTransform(scrollY, (v) => v < 500 ? "none" : "auto");

  // Aura Ungu Logo: Muncul di akhir animasi
  const glowOpacity = useTransform(scrollY, [600, 1000], [0, 0.5]);

  // Transisi Tema Warna Background Navbar
  const navBg = useTransform(scrollY, [400, 800], ["rgba(250, 250, 250, 0.9)", "rgba(59, 7, 100, 0.9)"]); // dari #fafafa ke bg-purple-950
  const navBorder = useTransform(scrollY, [400, 800], ["rgba(229, 231, 235, 0.6)", "rgba(255, 255, 255, 0.1)"]);
  const navTextColor = useTransform(scrollY, [400, 800], ["#6b7280", "#9ca3af"]); // text-gray-500 ke text-gray-400
  const titleColor = useTransform(scrollY, [400, 800], ["#6b7280", "#d8b4fe"]); // text-gray-500 ke text-purple-300

  // Transisi Warna Halaman Utama
  const pageBg = useTransform(scrollY, [400, 800], ["#fafafa", "#3b0764"]); // dari #fafafa ke bg-purple-950

  return (
    <motion.div style={{ backgroundColor: pageBg }} className="min-h-screen font-sans flex flex-col ">
      
      {/* Top Accent Line */}
      <div className="h-1 w-full bg-purple-600 fixed top-0 z-50"></div>

      {/* Navigation (Framer Motion) */}
      <motion.nav 
        style={{ backgroundColor: navBg, borderColor: navBorder }}
        className="w-full py-4 sm:py-6 px-6 sm:px-8 flex justify-between items-center max-w-5xl mx-auto fixed top-0 left-1/2 -translate-x-1/2 z-40 backdrop-blur-md border-b"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm p-1">
            <Image src="/images/logo_himasti.jpg" alt="Logo HIMASTI" width={36} height={36} className="h-full w-auto object-contain rounded" priority />
          </div>
          <div className="flex flex-col">
            <motion.span style={{ color: navTextColor }} className="font-bold text-[13px] sm:text-sm tracking-tight leading-tight text-gray-900">Himpunan Mahasiswa</motion.span>
            <motion.span style={{ color: titleColor }} className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider leading-tight">Sistem & Teknologi Informasi</motion.span>
          </div>
        </div>
        <motion.div style={{ color: navTextColor }} className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="#fitur" className="hover:opacity-70 transition-opacity">Fitur Utama</Link>
          <Link href="#karya" className="hover:opacity-70 transition-opacity">Katalog Karya</Link>
        </motion.div>
      </motion.nav>

      {/* 200vh Scroll Container */}
      <div ref={containerRef} className="h-[250vh] w-full relative">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          
          {/* Main Text Content */}
          <motion.div 
            style={{ opacity: textOpacity, y: textY, pointerEvents: textPointerEvents as any }}
            className="flex flex-col items-center text-center px-6 absolute max-w-4xl z-20 pt-20"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-gray-900">
              Ekosistem Digital <br/>
              Mahasiswa IT
            </h1>
            <p className="text-lg sm:text-xl mb-12 max-w-2xl leading-relaxed mx-auto text-gray-600">
              Portal terpadu untuk administrasi organisasi, publikasi akademik, riset, dan eksplorasi karya mahasiswa Sistem dan Teknologi Informasi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold bg-gray-900 text-white shadow-sm hover:scale-105 transition-transform">
                Sign In <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
                Sign Up
              </Link>
            </div>
          </motion.div>

          {/* Animasi Logo Menengah */}
          <motion.div 
            style={{ opacity: logoOpacity, y: logoY, scale: logoScale, pointerEvents: logoPointerEvents as any }}
            className="absolute z-10 flex flex-col items-center justify-center pt-10"
          >
            <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0 bg-purple-600 rounded-full blur-2xl scale-150"></motion.div>
            <div className="relative w-24 h-24 bg-white rounded-3xl shadow-2xl p-2 border border-white/20">
              <Image src="/images/logo_himasti.jpg" alt="Logo HIMASTI" width={100} height={100} className="h-full w-auto object-contain rounded-2xl" priority />
            </div>
            <motion.p style={{ opacity: glowOpacity }} className="mt-8 text-center font-bold text-yellow-400 tracking-widest uppercase text-[9px] sm:text-[10px]">
              HIMASTI UMMAT
            </motion.p>
          </motion.div>

        </div>
      </div>

      {/* Konten Bagian Bawah (Selalu Tema Gelap) */}
      <div id="fitur" className="relative z-20 bg-purple-950 text-white">
        
        {/* Minimalist Feature Grid */}
        <section className="w-full border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:-translate-y-2 bg-purple-800/50 text-purple-300 border border-purple-500/20">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bank Modul & Akademik</h3>
              <p className="text-sm leading-relaxed text-purple-200">Akses repositori materi pembelajaran, kurikulum, dan literatur yang disusun khusus untuk mendukung perkuliahan.</p>
            </div>

            <div className="flex flex-col group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:-translate-y-2 bg-yellow-900/30 text-yellow-400 border border-yellow-500/20">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Katalog Karya</h3>
              <p className="text-sm leading-relaxed text-purple-200">Pameran digital untuk proyek, riset, dan inovasi teknologi yang dikembangkan oleh anggota himpunan.</p>
            </div>

            <div className="flex flex-col group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:-translate-y-2 bg-white/10 text-gray-200 border border-white/20">
                <Terminal className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Administrasi Terpusat</h3>
              <p className="text-sm leading-relaxed text-purple-200">Sistem pencatatan persuratan, keuangan, dan data keanggotaan yang transparan dan terintegrasi penuh.</p>
            </div>
          </div>
        </section>

        
        {/* Statistik Kebanggaan (Impact Metrics) */}
        <section className="w-full py-20 border-t border-white/5 bg-purple-900/20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
              <div className="flex flex-col">
                <span className="text-4xl sm:text-5xl font-extrabold text-white mb-2">500+</span>
                <span className="text-xs sm:text-sm font-semibold text-purple-300 uppercase tracking-wider">Kader Aktif</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl sm:text-5xl font-extrabold text-white mb-2">120+</span>
                <span className="text-xs sm:text-sm font-semibold text-purple-300 uppercase tracking-wider">Bank Modul</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl sm:text-5xl font-extrabold text-white mb-2">50+</span>
                <span className="text-xs sm:text-sm font-semibold text-purple-300 uppercase tracking-wider">Katalog Karya</span>
              </div>
              <a href="#divisi" className="flex flex-col hover:bg-white/5 rounded-xl p-2 transition-colors cursor-pointer">
                <span className="text-4xl sm:text-5xl font-extrabold text-white mb-2 hover:scale-110 transition-transform">8</span>
                <span className="text-xs sm:text-sm font-semibold text-purple-300 uppercase tracking-wider">Divisi Aktif</span>
              </a>
            </div>
          </div>
        </section>
        <CompetitionMarquee competitions={competitions || []} />


        
        {/* Struktur Divisi HIMASTI */}
        <section id="divisi" className="w-full py-24 bg-purple-950 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Struktur 8 Divisi</h2>
              <p className="text-purple-200 max-w-2xl mx-auto">Motor penggerak HIMASTI yang berkolaborasi untuk menciptakan ekosistem mahasiswa IT yang progresif.</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
              {[
                { name: 'Kemuhammadiyahan', desc: 'Menanamkan nilai-nilai Islam dan moral Kemuhammadiyahan di lingkungan mahasiswa IT.' },
                { name: 'Kaderisasi', desc: 'Membentuk jiwa kepemimpinan, soliditas, dan regenerasi kepengurusan himpunan.' },
                { name: 'Penelitian & Pengembangan', desc: 'Fokus pada kajian akademik, riset teknologi, dan pengembangan kurikulum (Litbang).' },
                { name: 'Media & Komunikasi', desc: 'Mengelola desain visual, dokumentasi, dan infrastruktur digital HIMASTI (Metkom).' },
                { name: 'Hubungan Masyarakat', desc: 'Menjalin relasi dan kerja sama dengan pihak rektorat, ormawa lain, dan eksternal.' },
                { name: 'Kewirausahaan', desc: 'Membangun kemandirian finansial organisasi melalui unit usaha dan merchandise.' },
                { name: 'Minat dan Bakat', desc: 'Mewadahi dan menyalurkan potensi mahasiswa di bidang olahraga, seni, dan e-sports.' },
                { name: 'Aksi dan Advokasi', desc: 'Menampung aspirasi mahasiswa dan mengawal isu-isu kebijakan strategis kampus.' }
              ].map((divisi, i) => (
                <details key={i} className="group bg-purple-900/20 rounded-xl sm:rounded-2xl border border-purple-500/20 overflow-hidden transition-all duration-300 hover:border-purple-400/40 hover:bg-purple-900/40">
                  <summary className="p-4 sm:p-6 text-base sm:text-lg font-bold text-white cursor-pointer list-none flex justify-between items-center transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                      
                      {divisi.name}
                    </div>
                    <span className="transition-transform duration-300 group-open:rotate-180 opacity-40 text-purple-200">▼</span>
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base text-purple-200/80 leading-relaxed pt-2 sm:pt-4 border-t border-white/5 mx-4 sm:mx-6">
                    {divisi.desc}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-24 bg-purple-900 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Pertanyaan Umum (FAQ)</h2>
              <p className="text-purple-200">Informasi cepat seputar penggunaan Ekosistem Digital HIMASTI.</p>
            </div>

            <div className="space-y-4">
              {[
                { q: 'Siapa saja yang bisa menggunakan portal ini?', a: 'Seluruh mahasiswa Sistem dan Teknologi Informasi yang berstatus aktif dapat mendaftar dan menggunakan portal ini dengan memasukkan NIM dan Angkatan mereka.' },
                { q: 'Apa itu Katalog Karya?', a: 'Sebuah etalase digital tempat mahasiswa IT dapat memamerkan hasil proyek perkuliahan, aplikasi, atau riset teknologi mereka kepada publik.' },
                { q: 'Apakah saya bisa melihat transparansi keuangan himpunan?', a: 'Tentu! Bagi kader yang memiliki hak akses, portal ini menyediakan dasbor khusus untuk memantau sirkulasi kas dan anggaran secara real-time.' },
                { q: 'Bagaimana cara menghubungi pengurus?', a: 'Anda dapat menggunakan fitur AI Chatbot di dalam portal atau menghubungi langsung divisi Hubungan Masyarakat melalui kontak resmi HIMASTI.' }
              ].map((faq, i) => (
                <details key={i} className="group bg-purple-950/50 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
                  <summary className="p-5 sm:p-6 text-base sm:text-lg font-bold text-yellow-400 cursor-pointer list-none flex justify-between items-center hover:bg-white/5 transition-colors">
                    {faq.q}
                    <span className="transition-transform duration-300 group-open:rotate-180 opacity-60">▼</span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-purple-100/90 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}


        <section className="w-full py-32 bg-purple-900 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Mulai Menjelajahi Sistem</h2>
            <p className="mb-10 leading-relaxed max-w-2xl mx-auto text-purple-200">
              Sistem ini dirancang untuk seluruh kader. Masuk menggunakan akun Anda untuk melihat jadwal lomba, katalog modul, dan pembaruan organisasi terbaru secara real-time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
              <Link href="/login" className="inline-flex items-center justify-center px-10 py-4 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 bg-yellow-400 text-purple-950 shadow-[0_0_30px_rgba(250,204,21,0.2)] hover:bg-yellow-300">
                Sign In
              </Link>
              <Link href="/register" className="inline-flex items-center justify-center px-10 py-4 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 border border-white/20 text-white hover:bg-white/10">
                Sign Up Kader
              </Link>
            </div>
          </div>
        </section>

        
        {/* Tech Stack Flex */}
        <section className="w-full py-12 border-t border-white/5 bg-purple-950 flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-6">Dibangun Dengan Teknologi Modern</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-bold text-white"><Terminal className="w-6 h-6"/> Next.js</div>
            <div className="flex items-center gap-2 text-xl font-bold text-white"><Layers className="w-6 h-6"/> Prisma</div>
            <div className="flex items-center gap-2 text-xl font-bold text-white"><BookOpen className="w-6 h-6"/> PostgreSQL</div>
            <div className="flex items-center gap-2 text-xl font-bold text-white"><ArrowRight className="w-6 h-6"/> Framer Motion</div>
          </div>
        </section>

        <footer
 className="py-8 text-center text-sm border-t bg-purple-950 text-purple-400 border-white/10">
          <p>&copy; {new Date().getFullYear()} HIMASTI. All rights reserved.</p>
        </footer>
      </div>

    </motion.div>
  );
}
