# Portal HIMASTI — Universitas Muhammadiyah Mataram

<p align="center">
  <strong>Satu Ekosistem. Tanpa Batas.</strong><br>
  Platform digital terpadu Himpunan Mahasiswa Teknologi Informasi (HIMASTI) Fakultas Teknik Universitas Muhammadiyah Mataram.
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.3.3-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-6.0.0-2D3748?style=flat-square&logo=prisma" alt="Prisma" /></a>
  <a href="https://authjs.dev/"><img src="https://img.shields.io/badge/Auth-NextAuth%20v5%20%2B%20FIDO2-green?style=flat-square" alt="Auth" /></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel" alt="Vercel" /></a>
</p>

---

## Ringkasan Ekosistem

Portal HIMASTI adalah sistem informasi organisasi yang mengintegrasikan layanan administrasi digital, absensi presisi berbasis biometrik, manajemen kader berjenjang, dan pusat sumber daya akademik untuk mahasiswa Program Studi Teknologi Informasi UMMAT.

Sistem dibangun dengan arsitektur modern Next.js 16 (Turbopack) dan didukung otentikasi hardware-grade FIDO2/WebAuthn untuk menjamin keabsahan data presensi pada setiap sidang, musyawarah, dan rapat komisi himpunan.

```mermaid
flowchart TD
    subgraph Client ["Klien & Perangkat"]
        Browser["Perangkat Mahasiswa / Admin"]
        Biometric["Sensor Biometrik / Passkey FIDO2"]
        Scanner["Kamera Pemindai QR Presensi"]
    end

    subgraph AppLayer ["Next.js 16 (App Router)"]
        Landing["Landing Interaktif & AI Assistant"]
        AuthModule["NextAuth v5 + WebAuthn Verification"]
        AdminDashboard["Panel Administrasi & RBAC Guard"]
        API["REST / Server Actions Endpoints"]
    end

    subgraph DataLayer ["Data & Layanan Eksternal"]
        Prisma["Prisma ORM 6"]
        Postgres[(PostgreSQL Database)]
        LLM["Groq SDK & Google Gemini API"]
        Telegram["Telegram Broadcast Webhook"]
    end

    Browser --> Landing
    Browser --> AdminDashboard
    Biometric --> AuthModule
    Scanner --> API
    AuthModule --> Prisma
    AdminDashboard --> API
    API --> Prisma
    API --> LLM
    API --> Telegram
    Prisma --> Postgres
```

---

## Modul & Fitur Utama

| Modul | Deskripsi | Akses Rute |
|---|---|---|
| **Presensi Biometrik FIDO2** | Verifikasi kehadiran berbasis cryptographic passkey perangkat (sidik jari / face recognition) anti-joki, dilengkapi failover scanner QR berbatas waktu dan antrean sinkronisasi offline-first. | `/absen`, `/admin/scanner`, `/admin/rapat/qr` |
| **RBAC Berjenjang** | Sistem kontrol akses multi-tier yang membatasi privilese antara Super Admin, BPH Khusus (Ketum, Waketum, Sekum, Bendum), Ketua Bidang, Anggota Bidang, serta Kader umum. | `/admin/roles`, `/admin/kader` |
| **Kas & Finansial** | Pencatatan arus kas kas masuk/keluar, iuran kas wajib pengurus, neraca real-time, dan filter kategori transaksi. | `/admin/keuangan` |
| **Administrasi Surat** | Pengarsipan surat masuk, surat keluar, penomoran terstandar himpunan, dan status disposisi persuratan. | `/admin/surat` |
| **Rapat & Notulensi** | Penjadwalan rapat divisi/BPH, absensi terintegrasi QR dinamis, dan pencatatan notulensi digital terpusat. | `/admin/rapat` |
| **Bank Modul Pembelajaran** | Repositori modul materi terbuka kuliah TI (Web Dev, Jaringan Komputer, Keamanan Siber, Rekayasa Perangkat Lunak). | `/admin/modul` |
| **Showcase Karya & Lomba** | Direktori karya inovasi software/hardware kader serta feed otomatis informasi lomba IT nasional. | `/admin/karya`, `/admin/lomba` |
| **KTA Digital & Wallet** | Penerbitan identitas anggota digital dengan QR validasi dan dukungan format pass dompet digital. | `/api/kta/wallet` |
| **AI Assistant Mahasiswa** | Bot konsultasi kurikulum, struktur 8 bidang, dan informasi himpunan bertenaga Groq Llama 3 & Gemini 2.5. | `/` (Interactive Dialog), `/api/chat` |
| **Audit Trail & Keamanan** | Pencatatan riwayat aksi administratif sensitif, proteksi rate-limiting, dan validasi input. | `/admin/audit-logs`, `/health` |

---

## Hierarki Hak Akses (RBAC)

Struktur perizinan hak akses dikelompokkan secara hierarkis:

1. **Super Admin**: Pengawasan penuh terhadap seluruh modul, konfigurasi sistem, devtools, dan audit logs.
2. **BPH Khusus (Ketua Umum, Wakil Ketua Umum, Sekretaris Umum, Bendahara Umum)**:
   - Akses penuh ke approval surat, mutasi kas, manajemen presensi rapat, dan verifikasi status kader.
3. **Ketua Bidang & Anggota Bidang**:
   - Memiliki hak akses operasional setara di bawah BPH Khusus untuk mengelola agenda kegiatan, modul bidang, karya mahasiswa, dan presensi anggota.
4. **Kader Umum**:
   - Hak akses mandiri untuk melihat KTA digital, mengunduh modul pembelajaran terbuka, mengisi presensi rapat/kegiatan, dan mempublikasikan karya portofolio.

---

## Tech Stack

- **Framework**: [Next.js 16.3.3](https://nextjs.org/) (App Router, Turbopack)
- **Frontend Core**: [React 19.2.8](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/), [Prisma ORM 6.0.0](https://www.prisma.io/)
- **Otentikasi & Keamanan**: [NextAuth v5 (Beta 32)](https://authjs.dev/), [@simplewebauthn/server](https://simplewebauthn.dev/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **AI & Integrasi**: [Groq SDK](https://groq.com/), [Google Generative AI](https://ai.google.dev/), [Cheerio](https://cheerio.js.org/)
- **Pengujian**: [Vitest 5.0](https://vitest.dev/)
- **Deployment Platform**: [Vercel](https://vercel.com/)

---

## Struktur Direktori Repositori

```text
Portal-himasti/
├── himasti-web-laravel-backup/
│   └── himasti-next/              # Source code aktif Next.js 16 (Root Deployment)
│       ├── prisma/
│       │   └── schema.prisma      # Model database Prisma
│       ├── public/
│       │   ├── images/            # Logo himpunan & aset visual
│       │   └── manifest.json      # Konfigurasi PWA
│       ├── src/
│       │   ├── app/               # Rute aplikasi & endpoint Next.js
│       │   ├── components/        # Komponen UI, layout, scanner, modal
│       │   ├── hooks/             # Custom hooks (kamera, offline queue, auth)
│       │   ├── lib/               # Prisma client, auth options, rate-limiter, guards
│       │   └── types/             # Tipe data TypeScript
│       ├── tests/                 # Unit test Vitest
│       ├── .env.example           # Contoh variabel lingkungan
│       ├── .npmrc                 # Konfigurasi dependensi
│       ├── package.json
│       └── vitest.config.mts
├── .npmrc                         # Konfigurasi root npm
├── README.md                      # Dokumentasi utama
└── package.json
```

---

## Memulai Pengembangan (Local Setup)

### 1. Kloning Repositori
```bash
git clone https://github.com/himastiummat1/Portal-himasti.git
cd Portal-himasti/himasti-web-laravel-backup/himasti-next
```

### 2. Konfigurasi Environment
Salin template konfigurasi lingkungan dan sesuaikan nilainya:
```bash
cp .env.example .env
```

Pastikan variabel utama terisi:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/himasti_db?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/himasti_db?schema=public"
AUTH_SECRET="generate-a-strong-32-character-secret"
NEXTAUTH_SECRET="generate-a-strong-32-character-secret"
NEXTAUTH_URL="http://localhost:3000"
WEBAUTHN_RP_ID="localhost"
WEBAUTHN_ORIGIN="http://localhost:3000"
REGISTRATION_CODE="HIMASTI-PIONEER-2026"
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Setup Database
Sinkronkan model Prisma dengan database PostgreSQL Anda:
```bash
npx prisma generate
npx prisma db push
```

### 5. Menjalankan Server Development
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## Skrip Operasional

```bash
# Menjalankan server development dengan Turbopack
npm run dev

# Kompilasi production build
npm run build

# Menjalankan instance production secara lokal
npm run start

# Menjalankan test suite dengan Vitest
npm run test

# Menjalankan linter kode
npm run lint
```

---

## Sejarah & Identitas Organisasi

HIMASTI didirikan pada **21 April 2022** melalui Musyawarah Besar (Mubes) I di Universitas Muhammadiyah Mataram oleh 8 orang mahasiswa perintis. Himpunan ini menaungi 8 bidang kerja utama:
- Bidang Kemuhammadiyahan
- Bidang Kaderisasi & Pengembangan SDM
- Bidang Penelitian & Pengembangan (Litbang)
- Bidang Media & Komunikasi (Medkom)
- Bidang Hubungan Masyarakat (Humas)
- Bidang Kewirausahaan & Dana Usaha (Danus)
- Bidang Minat & Bakat
- Bidang Aksi & Advokasi

---

## Kontribusi & Lisensi

1. Fork repositori ini.
2. Buat branch fitur baru (`git checkout -b fitur/nama-fitur`).
3. Commit perubahan (`git commit -m "feat: tambahkan fitur X"`).
4. Push ke branch Anda (`git push origin fitur/nama-fitur`).
5. Ajukan Pull Request ke branch `main`.

Hak Cipta © 2022–2026 **HIMASTI Universitas Muhammadiyah Mataram**. Seluruh hak cipta dilindungi undang-undang.
