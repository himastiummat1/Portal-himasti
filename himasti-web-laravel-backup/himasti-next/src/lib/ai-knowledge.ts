import { prisma } from "@/lib/prisma";

// Cache in-memory untuk konteks database agar tidak membebani connection pool Supabase
let cachedStats: string = "";
let lastFetchTime: number = 0;
const CACHE_TTL_MS = 60 * 1000; // Cache 60 detik

export async function getHimastiKnowledgeContext(): Promise<string> {
  const now = Date.now();
  if (cachedStats && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedStats;
  }

  try {
    const [totalUsers, totalKaders, kaders, meetings, lombas] = await Promise.all([
      prisma.user.count(),
      prisma.dataKader.count(),
      prisma.dataKader.findMany({
        select: {
          nim: true,
          angkatan: true,
          status_kaderisasi: true,
          user: {
            select: {
              name: true,
              roles: {
                select: {
                  role: { select: { name: true } }
                }
              }
            }
          }
        },
        take: 100,
        orderBy: { id: "desc" }
      }),
      prisma.meeting.findMany({
        take: 5,
        orderBy: { event_date: "desc" },
        select: {
          id: true,
          title: true,
          type: true,
          event_date: true,
          end_date: true,
          location: true,
          is_active: true
        }
      }),
      prisma.competitionInfo.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
        select: {
          title: true,
          type: true,
          organizer: true,
          deadline: true
        }
      })
    ]);

    // Ringkasan Angkatan
    const angkatanMap: Record<string, number> = {};
    kaders.forEach(k => {
      const a = k.angkatan || "Lainnya";
      angkatanMap[a] = (angkatanMap[a] || 0) + 1;
    });

    const angkatanText = Object.entries(angkatanMap)
      .map(([th, count]) => `Angkatan ${th}: ${count} kader`)
      .join(", ");

    // Ringkasan Pengurus Berdasarkan Role
    const pengurusList = kaders
      .filter(k => k.user?.roles && k.user.roles.length > 0)
      .map(k => {
        const roles = k.user.roles.map(r => r.role.name.replace(/_/g, ' ')).join(', ');
        return `${k.user.name} (${roles}) - NIM: ${k.nim}`;
      })
      .slice(0, 25);

    // Ringkasan Rapat
    const meetingText = meetings.length > 0
      ? meetings.map(m => {
          const dateStr = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(m.event_date));
          const endStr = m.end_date ? ` s/d ${new Intl.DateTimeFormat("id-ID", { timeStyle: "short" }).format(new Date(m.end_date))}` : "";
          const status = m.is_active ? "🟢 Aktif" : "🔴 Selesai/Ditutup";
          return `• [${status}] ${m.title} (${m.type}) pada ${dateStr}${endStr} di ${m.location}`;
        }).join("\n")
      : "Tidak ada jadwal rapat aktif saat ini.";

    // Ringkasan Lomba
    const lombaText = lombas.length > 0
      ? lombas.map(l => `• ${l.title} (${l.type}) oleh ${l.organizer}`).join("\n")
      : "Belum ada informasi lomba terbaru.";

    cachedStats = `
=== DATA REALTIME SISTEM PORTAL HIMASTI (DATABASE LIVE) ===
• Total Akun Terdaftar: ${totalUsers} pengguna
• Total Kader Terdata: ${totalKaders} kader
• Sebaran Angkatan: ${angkatanText || "Belum ada data"}
• Rapat Terkini:
${meetingText}
• Informasi Lomba Terkini:
${lombaText}
• Sebagian Daftar Kader & Pengurus:
${pengurusList.length > 0 ? pengurusList.map(p => `• ${p}`).join('\n') : "• Belum ada data pengurus yang ditetapkan."}
`.trim();

    lastFetchTime = now;
    return cachedStats;
  } catch (error) {
    console.warn("Gagal mengambil data dinamis database untuk AI:", error);
    return "Data realtime sedang disinkronkan.";
  }
}

export const HIMASTI_STATIC_KNOWLEDGE = `
=== PROFIL & SEJARAH LENGKAP HIMASTI UMMAT ===
• Nama Organisasi: Himpunan Mahasiswa Teknologi Informasi (HIMASTI)
• Perguruan Tinggi: Fakultas Teknik, Universitas Muhammadiyah Mataram (UMMAT)
• Berdiri: 21 April 2022 melalui Musyawarah Besar (Mubes) pertama di Ruang Fakultas Teknik UMMAT (dihadiri 6 dosen & 36 mahasiswa perintis).
• Latar Belakang: Lahir dari semangat mahasiswa angkatan pertama TI yang ingin memiliki wadah independen dan progresif dalam mengembangkan keilmuan teknologi informasi.
• 8 Pendiri / Perintis HIMASTI:
  1. Arif Rahman
  2. Sam'ul Gozi
  3. Husni Mubarok
  4. Novianti
  5. Luhur Budi
  6. Fauzan
  7. Alfian
  8. Akrimul Hakim
• Sejarah Nama: Sempat diusulkan nama HMSTI, HIMASI, dan HIMASTI. Nama HIMASTI terpilih secara demokratis dengan suara terbanyak.
• Pengkaderan Akbar Pertama: Pengkaderan Jilid 2 diikuti 28 peserta di Pantai 3 Sempong pada 28-29 Juni.
• Nilai Kemuhammadiyahan: HIMASTI berlandaskan nilai-nilai Islam berkemajuan yang dicetuskan KH Ahmad Dahlan (18 Nov 1912): integritas, pendidikan modern, toleransi, kepedulian sosial, dan pencerahan umat.

=== STRUKTUR ORGANISASI & 8 BIDANG UTAMA ===
1. BPH Khusus (Badan Pengurus Harian Inti):
   - Ketua Umum: Pemegang kebijakan tertinggi dan representasi resmi organisasi.
   - Wakil Ketua Umum: Pendamping ketua umum dan koordinator internal bidang.
   - Sekretaris Umum: Pengelola administrasi, arsip notulensi rapat, dan surat menyurat resmi.
   - Bendahara Umum: Pengelola transparansi kas himpunan dan pelaporan keuangan.

2. 8 Bidang Kerja:
   • Bidang Kemuhammadiyahan: Pembinaan keislaman, kajian rutin, spiritualitas, dan moral kader.
   • Bidang Keorganisasian & Pengkaderan: Rekrutmen kader baru, Latihan Kepemimpinan, dan regenerasi kepengurusan.
   • Bidang Metkom (Media Telekomunikasi & Informasi): Pengelolaan media sosial, dokumentasi, branding, publikasi, dan portal web himpunan.
   • Bidang Litbang / R&D (Penelitian & Pengembangan): Riset teknologi terbaru, workshop coding, bootcamp, dan inkubasi karya mahasiswa.
   • Bidang Kewirausahaan: Penggalangan dana mandiri, penjualan merchandise resmi HIMASTI (jaket, kaos, stiker), dan bisnis kreatif.
   • Bidang Mikat (Minat & Bakat): Penyaluran hobi olahraga (futsal, badminton), seni, dan tim e-sports (Mobile Legends, PUBG, Valorant).
   • Bidang Aksi & Advokasi: Membela hak-hak mahasiswa TI, menjembatani aspirasi akademik ke pimpinan prodi/fakultas.
   • Bidang Humas (Hubungan Masyarakat): Membangun relasi eksternal dengan alumni, himpunan kampus lain, dan instansi industri IT.

=== FITUR EKOSISTEM DIGITAL PORTAL HIMASTI ===
• Presensi Cerdas Anti-Joki (Biometrik WebAuthn): Kehadiran dapat diverifikasi melalui sensor sidik jari / Face ID perangkat fisik kader (FIDO2 standard).
• Presensi QR Code Dinamis: QR code di layar proyektor berotasi setiap 30 detik dengan verifikasi lokasi GPS geofencing kampus (radius 50 meter).
• Manajemen Rapat & Auto-Close: Pengurus dapat menentukan batas waktu selesai rapat; sistem otomatis menutup sesi dan mengirimkan rekapitulasi kehadiran ke Telegram.
• KTA Digital (Kartu Tanda Anggota): Kartu identitas kader dengan QR Code unik dan pass digital wallet.
• Bank Modul Pembelajaran: Modul materi kuliah terbuka TI (Web Development, Basis Data, Jaringan Komputer, Algoritma, Keamanan Siber).
• Showcase Karya & Info Lomba: Feed kompetisi hackathon nasional dan direktori aplikasi hasil karya mahasiswa.
• Kotak Pengaduan: Sistem aspirasi mahasiswa secara anonim maupun terverifikasi untuk advokasi prodi.
• Toko Merchandise & Transparansi Kas: Manajemen keuangan kas yang dapat diaudit secara transparan.

=== KODE AKSES REGISTRASI KADER ===
Kode akses registrasi akun kader resmi: "JIWA AKTIF JIWA KREATIF LUAR BIASA".
`.trim();
