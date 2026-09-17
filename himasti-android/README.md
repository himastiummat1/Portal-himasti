# HIMASTI HUB — Native Android Application (Kotlin & Jetpack Compose)

Aplikasi mobile resmi **Himpunan Mahasiswa Teknik Informatika (HIMASTI)**, Universitas Muhammadiyah Mataram.

Dibangun menggunakan standar industri Android modern dengan filosofi **Utilitarian & Brutal Minimalism** (terinspirasi dari GitHub Mobile & X).

---

## 🌟 Fitur Utama

1. **Splash Screen Instan ala X (Twitter) & Instagram**:
   - Menggunakan **Android 12+ SplashScreen API** (`androidx.core:core-splashscreen`).
   - Latar gelap pekat (`#0B0F17`) dengan logo vektor HIMASTI tajam di tengah.
   - Booting hardware 0ms tanpa loading spinner atau web redirect yang lambat.

2. **Integrasi Penuh Database Web (Single Sign-On / SSO)**:
   - Terhubung langsung ke backend portal Next.js (`/api/mobile/login` dan `/api/mobile/feed`).
   - Akun kader sama persis dengan web (NIM/Email & Password).

3. **Auto-Login & Sesi Permanen**:
   - Sekali login, sesi kader tersimpan secara aman di HP.
   - Kader tidak perlu mengetik password berulang kali saat membuka aplikasi.

4. **Bottom Navigation (Tech Hub)**:
   - 🏠 **Beranda**: Mini KTA Digital, Aksi Cepat (Presensi QR, Web SSO), dan Agenda Rapat/Kegiatan.
   - 📚 **Bank Modul**: Materi kuliah IT, pencarian, dan snippet kode yang bisa langsung di-copy.
   - 🏆 **Info Lomba**: Hackathon, kompetisi web/mobile/UI-UX nasional, dan sertifikasi.
   - 👤 **Profil & KTA Digital**: Kartu Tanda Anggota resmi, QR Code, dan tombol SSO ke web portal.

---

## 🛠️ Stack Teknologi

- **Bahasa**: Kotlin (JVM 17)
- **UI Toolkit**: Jetpack Compose & Material 3
- **Networking**: OkHttp & Gson
- **Splash API**: `androidx.core:core-splashscreen`
- **Browser SSO**: Chrome Custom Tabs (`androidx.browser:browser`)

---

## 🚀 Cara Menjalankan di Android Studio

1. Buka **Android Studio**.
2. Pilih **Open**, lalu arahkan ke folder `himasti-android`.
3. Tunggu Gradle sync selesai.
4. Tekan tombol **Run** (Segitiga hijau) ke Emulator atau HP fisik Android Anda.

---

## 📦 Build Otomatis via GitHub Actions

Aplikasi ini dilengkapi workflow GitHub Actions `.github/workflows/build-kotlin-app.yml` yang secara otomatis meng-compile file **`HIMASTI-HUB-Kotlin-v1.0.apk`** setiap kali ada commit baru ke branch `main`.
