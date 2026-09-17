# Portal HIMASTI — Next.js Core Application

<p align="center">
  <strong>Satu Ekosistem. Tanpa Batas.</strong><br>
  Aplikasi web portal terpadu Himpunan Mahasiswa Teknologi Informasi (HIMASTI) Universitas Muhammadiyah Mataram.
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

## Gambaran Umum

Direktori ini berisi kode sumber utama aplikasi web portal HIMASTI yang dideploy pada platform Vercel. Aplikasi ini mencakup:
- **Presensi Biometrik FIDO2 & WebAuthn**: Presensi presisi berbasis passkey perangkat yang mencegah manipulasi kehadiran (anti-joki).
- **Hierarki RBAC Lengkap**: Pemisahan otorisasi yang jelas antara Super Admin, BPH Khusus, Ketua Bidang, Anggota Bidang, dan Kader umum.
- **Modul Layanan Digital Organisasi**: Keuangan/Kas, Persuratan Digital, Rapat & Notulensi QR, Bank Modul IT, Showcase Karya, dan Scraper Lomba IT.
- **KTA Digital & Wallet Pass**: Kartu tanda anggota terverifikasi QR dengan kompatibilitas format dompet digital.
- **AI Student Companion**: Fitur konsultasi interaktif kurikulum dan informasi organisasi bertenaga Groq SDK dan Gemini API.

---

## Panduan Instalasi & Menjalankan Aplikasi

### 1. Salin Konfigurasi Environment
```bash
cp .env.example .env
```
Sesuaikan koneksi database PostgreSQL (`DATABASE_URL`, `DIRECT_URL`), secret autentikasi (`AUTH_SECRET`, `NEXTAUTH_SECRET`), dan kunci registrasi.

### 2. Install Dependensi
```bash
npm install
```

### 3. Generate Prisma Client & Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Akses portal melalui browser di [http://localhost:3000](http://localhost:3000).

---

## Perintah Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan Next.js development server dengan Turbopack |
| `npm run build` | Melakukan `prisma generate` dan kompilasi production build |
| `npm run start` | Menjalankan hasil build production secara lokal |
| `npm run test` | Menjalankan rangkaian unit test dengan Vitest |
| `npm run lint` | Menjalankan pengecekan kualitas kode dengan ESLint |

---

## Struktur Folder Utama

- `src/app/` — Endpoint API dan rute halaman (Landing page, dashboard `/admin`, alur presensi `/absen`).
- `src/components/` — Komponen antarmuka pengguna, scanner QR kamera, dialog interaktif, dan kartu data.
- `src/lib/` — Instance Prisma, konfigurasi NextAuth, helper RBAC, dan rate-limiter.
- `src/hooks/` — Custom React hooks untuk pemindaian kamera, sinkronisasi presensi offline, dan sesi pengguna.
- `tests/` — Suite pengujian otomatis Vitest.
- `prisma/` — Skema database dan relasi entitas.

---

Hak Cipta © 2022–2026 **HIMASTI Universitas Muhammadiyah Mataram**.
