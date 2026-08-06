<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tentang HIMASTI</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700|outfit:500,600,700,800" rel="stylesheet" />
    <script src="https://unpkg.com/lucide@latest"></script>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; overflow-x: hidden; }
        h1, h2, h3, .font-heading { font-family: 'Outfit', sans-serif; }
        .glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .blob { position: absolute; border-radius: 50%; filter: blur(80px); z-index: -1; }
        .blob-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: rgba(56, 189, 248, 0.3); }
        .blob-2 { bottom: -10%; right: -10%; width: 600px; height: 600px; background: rgba(99, 102, 241, 0.2); }
        .timeline-line::before { content: ''; position: absolute; top: 0; bottom: 0; left: 15px; width: 2px; background: rgba(56, 189, 248, 0.2); }
    </style>
</head>
<body class="antialiased min-h-screen relative">
    
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <!-- Navbar -->
    <nav class="glass fixed w-full top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <img src="{{ asset('images/logo-himasti.png') }}" alt="Logo HIMASTI" class="h-10 w-auto object-contain bg-white rounded-full p-1">
                <span class="font-heading font-bold text-xl tracking-wider text-white">HIMASTI</span>
            </div>
            <div class="flex items-center gap-6">
                <a href="{{ url('/') }}" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Beranda</a>
                <a href="{{ route('tentang') }}" class="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">Tentang Kami</a>
                @auth
                    <a href="{{ route('dashboard') }}" class="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-500/30">Dashboard</a>
                @else
                    <a href="{{ route('login') }}" class="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors border border-white/10">Log in</a>
                @endauth
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-32 pb-20 px-6">
        <div class="max-w-5xl mx-auto">
            
            <div class="text-center mb-16 space-y-6">
                <div class="inline-flex justify-center items-center p-4 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                    <img src="{{ asset('images/logo-himasti.png') }}" alt="Logo HIMASTI Besar" class="h-32 w-auto object-contain drop-shadow-2xl mix-blend-screen rounded-3xl bg-white p-2">
                </div>
                <h1 class="text-4xl md:text-6xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    Mengenal HIMASTI
                </h1>
                <p class="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-medium">
                    Himpunan Mahasiswa Sistem & Teknologi Informasi
                </p>
                <p class="text-base text-slate-500 max-w-2xl mx-auto">
                    Wadah pergerakan, eksplorasi, dan inovasi bagi mahasiswa penggerak teknologi masa depan. Berkolaborasi menciptakan solusi cerdas melalui riset, kode, dan pengabdian.
                </p>
            </div>

            <!-- Sejarah -->
            <div class="glass p-8 md:p-12 rounded-3xl mb-12">
                <div class="flex items-center gap-4 mb-8">
                    <div class="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                        <i data-lucide="history" class="w-6 h-6"></i>
                    </div>
                    <h2 class="text-3xl font-heading font-bold text-white">Jejak Sejarah Kami</h2>
                </div>
                
                <div class="relative timeline-line pl-10 space-y-8">
                    <div class="relative">
                        <div class="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-amber-400 border-4 border-slate-900"></div>
                        <h4 class="text-xl font-bold text-white mb-2">Awal Berdiri (Titik Nol)</h4>
                        <p class="text-slate-400 leading-relaxed text-sm">
                            HIMASTI lahir dari gagasan sekelompok mahasiswa perintis jurusan Sistem & Teknologi Informasi yang menyadari kebutuhan akan sebuah wadah kolaboratif. Berawal dari diskusi kecil di lorong laboratorium komputer kampus, mereka membentuk komunitas studi independen. Tepat pada momentum musyawarah mahasiswa di tahun tersebut, HIMASTI resmi disahkan sebagai organisasi himpunan mahasiswa tingkat jurusan.
                        </p>
                    </div>
                    <div class="relative">
                        <div class="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-blue-400 border-4 border-slate-900"></div>
                        <h4 class="text-xl font-bold text-white mb-2">Fase Ekspansi & Inkubasi</h4>
                        <p class="text-slate-400 leading-relaxed text-sm">
                            Di tahun-tahun berikutnya, HIMASTI tidak hanya berfokus pada kegiatan politik kampus, tetapi bertransformasi menjadi inkubator talenta IT. Divisi Teknologi dibentuk khusus untuk meriset tren *Web Development*, AI, dan Jaringan. Banyak *software* internal kampus mulai dibangun oleh tangan-tangan kreatif mahasiswa dari himpunan ini, membawa nama jurusan semakin dikenal luas.
                        </p>
                    </div>
                    <div class="relative">
                        <div class="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-indigo-400 border-4 border-slate-900"></div>
                        <h4 class="text-xl font-bold text-white mb-2">HIMASTI Masa Kini</h4>
                        <p class="text-slate-400 leading-relaxed text-sm">
                            Hingga hari ini, HIMASTI telah menjelma menjadi salah satu himpunan mahasiswa paling progresif. Kami mengadopsi struktur birokrasi digital (termasuk portal pintar ini) dan terus menjadi jembatan antara dunia akademis dan industri teknologi global. Solidaritas, Integritas, dan Kode adalah tiga napas yang membuat kami bertahan.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Visi Misi -->
            <div class="grid md:grid-cols-2 gap-8 mb-12">
                <div class="glass p-8 rounded-3xl">
                    <div class="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                        <i data-lucide="target" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-2xl font-heading font-bold text-white mb-4">Visi Kami</h3>
                    <p class="text-slate-400 leading-relaxed">
                        Menjadi himpunan mahasiswa yang unggul, inovatif, dan adaptif terhadap perkembangan teknologi global, serta mampu mencetak talenta-talenta IT yang berintegritas dan membawa dampak nyata bagi masyarakat luas.
                    </p>
                </div>

                <div class="glass p-8 rounded-3xl">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                        <i data-lucide="rocket" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-2xl font-heading font-bold text-white mb-4">Misi Kami</h3>
                    <ul class="text-slate-400 leading-relaxed space-y-3">
                        <li class="flex items-start gap-3"><i data-lucide="check-circle-2" class="w-5 h-5 text-indigo-400 shrink-0 mt-0.5"></i> Membangun ekosistem riset dan teknologi di kampus.</li>
                        <li class="flex items-start gap-3"><i data-lucide="check-circle-2" class="w-5 h-5 text-indigo-400 shrink-0 mt-0.5"></i> Menyelenggarakan program kerja berbasis pengembangan skill.</li>
                        <li class="flex items-start gap-3"><i data-lucide="check-circle-2" class="w-5 h-5 text-indigo-400 shrink-0 mt-0.5"></i> Menjaga tali persaudaraan antar elemen mahasiswa.</li>
                    </ul>
                </div>
            </div>

            <!-- Prestasi & Penghargaan -->
            <div class="mb-12">
                <h2 class="text-3xl font-heading font-bold text-center text-white mb-8">Prestasi & Penghargaan</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Award 1 -->
                    <div class="glass p-6 rounded-2xl border-t-2 border-amber-400 text-center flex flex-col items-center">
                        <i data-lucide="award" class="w-10 h-10 text-amber-400 mb-3"></i>
                        <h4 class="font-bold text-white text-sm mb-2">Juara 1 GEMASTIK Nasional</h4>
                        <p class="text-xs text-slate-400">Divisi Software Development</p>
                    </div>
                    <!-- Award 2 -->
                    <div class="glass p-6 rounded-2xl border-t-2 border-blue-400 text-center flex flex-col items-center">
                        <i data-lucide="trophy" class="w-10 h-10 text-blue-400 mb-3"></i>
                        <h4 class="font-bold text-white text-sm mb-2">Himpunan Ter-Inovatif</h4>
                        <p class="text-xs text-slate-400">Award Kemahasiswaan Kampus</p>
                    </div>
                    <!-- Award 3 -->
                    <div class="glass p-6 rounded-2xl border-t-2 border-emerald-400 text-center flex flex-col items-center">
                        <i data-lucide="medal" class="w-10 h-10 text-emerald-400 mb-3"></i>
                        <h4 class="font-bold text-white text-sm mb-2">Top 5 Hackathon Indonesia</h4>
                        <p class="text-xs text-slate-400">Delegasi Tim Teknologi</p>
                    </div>
                    <!-- Award 4 -->
                    <div class="glass p-6 rounded-2xl border-t-2 border-rose-400 text-center flex flex-col items-center">
                        <i data-lucide="star" class="w-10 h-10 text-rose-400 mb-3"></i>
                        <h4 class="font-bold text-white text-sm mb-2">Penyelenggara Event IT Terbaik</h4>
                        <p class="text-xs text-slate-400">Seminar Nasional & Workshop</p>
                    </div>
                </div>
            </div>

            <!-- Divisi / Struktur -->
            <div class="mt-16">
                <h2 class="text-3xl font-heading font-bold text-center text-white mb-8">Pilar Pergerakan (Divisi)</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div class="glass p-6 rounded-2xl text-center hover:-translate-y-2 transition-transform cursor-default">
                        <i data-lucide="cpu" class="w-10 h-10 mx-auto text-blue-400 mb-4"></i>
                        <h4 class="font-bold text-lg text-white">Teknologi & Riset</h4>
                        <p class="text-sm text-slate-400 mt-2">Fokus pengembangan produk IT, web, dan sistem cerdas AI.</p>
                    </div>
                    <div class="glass p-6 rounded-2xl text-center hover:-translate-y-2 transition-transform cursor-default">
                        <i data-lucide="users" class="w-10 h-10 mx-auto text-emerald-400 mb-4"></i>
                        <h4 class="font-bold text-lg text-white">Kaderisasi</h4>
                        <p class="text-sm text-slate-400 mt-2">Ujung tombak regenerasi dan pembentukan karakter anggota baru.</p>
                    </div>
                    <div class="glass p-6 rounded-2xl text-center hover:-translate-y-2 transition-transform cursor-default">
                        <i data-lucide="globe" class="w-10 h-10 mx-auto text-rose-400 mb-4"></i>
                        <h4 class="font-bold text-lg text-white">Hubungan Masyarakat</h4>
                        <p class="text-sm text-slate-400 mt-2">Menjaga relasi eksternal dan citra baik organisasi di mata publik.</p>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <footer class="border-t border-white/10 py-8 text-center text-slate-500 text-sm glass relative z-10">
        &copy; {{ date('Y') }} Himpunan Mahasiswa Sistem & Teknologi Informasi (HIMASTI). Dibuat dengan 💙 oleh Divisi Teknologi.
    </footer>

    <script>lucide.createIcons();</script>
</body>
</html>
