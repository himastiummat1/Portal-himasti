<div align="center">

<!-- ANIMASI PACMAN -->
<img src="https://media.tenor.com/tHqgU6R_K6gAAAAi/pac-man-pacman.gif" width="200" alt="Pacman Animation"/>

<br/>

# 🌟 Portal HIMASTI 🌟
**Sistem Informasi Himpunan Mahasiswa Terintegrasi**

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

*Mewujudkan Digitalisasi dan Efisiensi Organisasi Mahasiswa*

<hr/>
</div>

## 📖 Tentang Proyek

**Portal HIMASTI** adalah platform modern yang dirancang khusus untuk memfasilitasi kebutuhan administrasi, komunikasi, dan pengelolaan kegiatan di **Himpunan Mahasiswa Sistem Informasi (HIMASTI)**. Dibangun dengan framework Laravel, proyek ini menawarkan keamanan tingkat tinggi, performa kilat, dan antarmuka pengguna yang sangat responsif.

## ✨ Fitur Utama

| Fitur | Deskripsi | Status |
|:---:|---|:---:|
| 👥 | **Manajemen Anggota** — Pendataan terpusat seluruh anggota aktif dan alumni | ✔️ |
| 📅 | **Event & Kegiatan** — Publikasi kegiatan dan pendaftaran acara mahasiswa | ✔️ |
| 💼 | **Administrasi** — Sistem persuratan dan pengarsipan dokumen digital | ✔️ |
| 🔐 | **Role & Permission** — Hak akses sistem yang komprehensif untuk setiap divisi | ✔️ |

## 🚀 Prasyarat Sistem

Sebelum menjalankan aplikasi ini, pastikan komputer/server Anda memenuhi persyaratan berikut:
- **PHP** `>= 8.1`
- **Composer** (Dependency Manager untuk PHP)
- **Node.js & NPM** (Untuk kompilasi aset *frontend*)
- **Database Server** (MySQL atau MariaDB)

## 🛠️ Instalasi & Setup Lokal

Ikuti langkah-langkah di bawah ini untuk mengatur dan menjalankan Portal HIMASTI secara lokal:

1. **Persiapkan Konfigurasi Environment**
   Salin konfigurasi environment bawaan dan sesuaikan kredensial database Anda.
   ```bash
   cp .env.example .env
   ```

2. **Install Dependensi Backend**
   ```bash
   composer install
   ```

3. **Install Dependensi Frontend**
   ```bash
   npm install
   ```

4. **Generate Application Key**
   ```bash
   php artisan key:generate
   ```

5. **Migrasi Database & Seeding**
   Jalankan migrasi untuk membuat tabel database dan mengisi data *dummy* awal (seperti akun *Super Admin*).
   ```bash
   php artisan migrate --seed
   ```

6. **Kompilasi Aset Frontend**
   ```bash
   npm run dev
   ```

7. **Jalankan Development Server**
   ```bash
   php artisan serve
   ```
   
> 🌐 **Voila!** Aplikasi Anda sekarang dapat diakses melalui browser di alamat: [http://localhost:8000](http://localhost:8000)

---

<div align="center">
  <h3>Dibuat dengan ❤️ oleh Tim Teknologi HIMASTI</h3>
  <p>&copy; 2026 Himpunan Mahasiswa Sistem Informasi. All rights reserved.</p>
</div>