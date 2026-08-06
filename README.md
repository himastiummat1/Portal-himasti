# Portal HIMASTI

Selamat datang di repositori web Portal HIMASTI (Himpunan Mahasiswa Sistem Informasi). Proyek ini dibangun menggunakan framework Laravel.

## Persyaratan Sistem

Pastikan sistem Anda memenuhi persyaratan berikut:
- PHP >= 8.1
- Composer
- Node.js & NPM
- MySQL / MariaDB

## Instalasi

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek secara lokal:

1. Salin file environment:
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan konfigurasi database Anda di dalam file `.env`.
3. Install dependensi PHP:
   ```bash
   composer install
   ```
4. Install dependensi frontend (Node.js):
   ```bash
   npm install
   ```
5. Generate application key Laravel:
   ```bash
   php artisan key:generate
   ```
6. Jalankan migrasi database:
   ```bash
   php artisan migrate
   ```
7. Compile aset frontend:
   ```bash
   npm run dev
   ```
8. Jalankan local development server:
   ```bash
   php artisan serve
   ```

Aplikasi sekarang dapat diakses melalui `http://localhost:8000`.

## Lisensi
Hak Cipta &copy; HIMASTI.
