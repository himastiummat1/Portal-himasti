# Panduan Deployment Portal HIMASTI ke Server Gratis (InfinityFree)

Panduan ini dibuat khusus untuk memandu pengurus HIMASTI men-*deploy* aplikasi berbasis Laravel ini ke layanan *hosting* gratis selamanya, tanpa memerlukan kartu kredit atau pengetahuan terminal/SSH.

## Persiapan (Lokal)
Karena aplikasi ini dibangun dengan arsitektur Laravel, ada beberapa hal yang sudah disiapkan secara otomatis:
1. **Database Terpadu**: Aplikasi menggunakan SQLite. File databasenya ada di `database/database.sqlite`. Anda tidak perlu repot melakukan ekspor/impor ke MySQL.
2. **File `.htaccess` Khusus**: Sudah ada file `.htaccess` di direktori utama (root) untuk mengarahkan pengunjung otomatis ke folder `public`.

---

## Langkah 1: Membungkus Aplikasi (Zipping)
1. Buka folder `himasti-web` di komputer/laptop Anda.
2. Blok **semua file dan folder** yang ada di dalamnya. (Pastikan file yang tersembunyi seperti `.env` dan `.htaccess` ikut terblok).
3. Klik kanan, lalu pilih **Compress to ZIP file** (Windows) atau **Compress** (Mac).
4. Beri nama file tersebut: `himasti-deploy.zip`.

---

## Langkah 2: Membuat Akun InfinityFree
1. Buka browser dan kunjungi: **[InfinityFree.com](https://infinityfree.com)**
2. Klik tombol **Register** dan buat akun menggunakan email aktif Anda.
3. Setelah login ke dashboard InfinityFree, klik tombol **Create Account** (Buat Hosting Baru).
4. Pilih opsi **Free Hosting** (0$).
5. Pilih **Subdomain** gratis untuk website Himpunan. (Contoh: ketik `portal-himasti` dan pilih ekstensi yang tersedia seperti `.epizy.com` atau `.infinityfreeapp.com`).
6. Masukkan password akun hosting (atau biarkan otomatis), lalu klik **Create Account**.
7. Tunggu sekitar 1-2 menit hingga status hosting Anda menjadi *Active*.

---

## Langkah 3: Mengunggah File ke Server (Upload)
1. Di halaman detail akun hosting yang baru Anda buat, klik tombol hijau bertuliskan **File Manager**.
2. Anda akan diarahkan ke halaman seperti File Explorer. Klik dua kali pada folder **`htdocs`**.
   > **Penting:** Folder `htdocs` adalah folder utama yang akan dibaca oleh publik saat membuka website Anda.
3. Di dalam `htdocs`, hapus file-file bawaan (seperti `index2.html` atau `DO NOT UPLOAD HERE`).
4. Klik ikon panah ke atas (Upload) di menu bagian bawah/atas, lalu pilih **Upload Zip**.
5. Pilih file `himasti-deploy.zip` yang Anda buat di Langkah 1.
6. Tunggu proses unggahan (*upload*) selesai (bisa memakan waktu 5-15 menit tergantung kecepatan internet Anda karena ukurannya lumayan besar).
7. Setelah selesai, InfinityFree akan otomatis mengekstrak file zip tersebut di dalam folder `htdocs`.
   *Jika tidak terekstrak otomatis, klik kanan pada file zip tersebut dan pilih **Extract**.*

---

## Langkah 4: Penyesuaian Lingkungan (Environment)
1. Cari file bernama **`.env`** di dalam folder `htdocs` tadi.
2. Klik kanan file `.env` dan pilih **Edit**.
3. Cari baris kode berikut:
   ```env
   APP_ENV=local
   APP_DEBUG=true
   APP_URL=http://localhost
   ```
4. Ubah menjadi versi Production agar lebih aman:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=http://portal-himasti.epizy.com (Ganti dengan link subdomain yang Anda pilih tadi)
   ```
5. Klik **Save** (Simpan).

---

## Langkah 5: Uji Coba Halaman Live
Selamat! Portal HIMASTI Anda sudah berhasil *online*.

1. Buka tab baru di browser Anda, dan ketikkan alamat website Anda (contoh: `http://portal-himasti.epizy.com`).
2. Anda akan melihat halaman "Selamat Datang di Portal Internal HIMASTI".
3. Klik tombol **Login**.
4. Gunakan kredensial Super Admin bawaan untuk masuk:
   - **Email:** `kabid.teknologi@himasti.org`
   - **Password:** `password`

Sistem siap digunakan oleh seluruh kader dan pengurus HIMASTI! 🚀
