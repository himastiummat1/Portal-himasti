<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'HIMASTI') }} - @yield('title', 'Dashboard')</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700|outfit:500,600,700" rel="stylesheet" />
    <script src="https://unpkg.com/lucide@latest"></script>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <x-dark-mode-init />
    <style>
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, h5, h6, .font-heading { font-family: 'Outfit', sans-serif; }
        .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body class="font-sans antialiased bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-gray-100">
    <div class="flex h-screen overflow-hidden">
        
        <!-- Sidebar -->
        <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shadow-2xl relative z-20">
            <div class="p-6 border-b border-slate-800">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-white p-0.5 overflow-hidden shadow-lg shadow-blue-500/10 border border-slate-700">
                        <img src="{{ asset('images/logo_himasti.jpg') }}" alt="Logo HIMASTI" class="w-full h-full object-cover rounded-lg">
                    </div>
                    <div>
                        <h2 class="text-xl font-heading font-bold text-white tracking-wide">HIMASTI</h2>
                        <p class="text-xs text-slate-400">Portal Internal</p>
                    </div>
                </div>
            </div>

            <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Menu Utama</p>
                
                <a href="{{ route('dashboard') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('dashboard') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="monitor" class="w-5 h-5"></i>
                    <span class="font-medium">Portal Informasi Kader</span>
                </a>
                
                @if(Auth::user()->hasRole('super_admin'))
                <a href="{{ route('superadmin.dashboard') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('superadmin.dashboard') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
                    <span class="font-medium">Dashboard</span>
                </a>
                <a href="{{ route('superadmin.users') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('superadmin.users') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="users" class="w-5 h-5"></i>
                    <span class="font-medium">Manajemen Pengurus</span>
                </a>
                @endif

                @if(Auth::user()->hasRole('super_admin'))
                <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Pusat Inovasi IT</p>
                
                <a href="{{ route('admin.modules.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.modules.*') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="book-open" class="w-5 h-5 text-indigo-400"></i>
                    <span class="font-medium">Bank Modul & Snippet</span>
                </a>
                
                <a href="{{ route('admin.projects.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.projects.*') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="code" class="w-5 h-5 text-teal-400"></i>
                    <span class="font-medium">Katalog Karya</span>
                </a>
                @endif

                @if(Auth::user()->hasRole('super_admin') || Auth::user()->hasRole('ketua_himpunan') || Auth::user()->hasRole('wakil_ketua_himpunan') || Auth::user()->hasRole('admin_kaderisasi') || Auth::user()->hasRole('wakil_kaderisasi') || Auth::user()->hasRole('anggota_kaderisasi'))
                <a href="{{ route('admin.kaderisasi.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.kaderisasi.index') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="users" class="w-5 h-5"></i>
                    <span class="font-medium">Data Kader</span>
                </a>
                <a href="{{ route('admin.kaderisasi.galeri.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.kaderisasi.galeri.*') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="image" class="w-5 h-5"></i>
                    <span class="font-medium">Galeri Pengkaderan</span>
                </a>
                @endif

                @if(Auth::user()->hasRole('super_admin') || Auth::user()->hasRole('ketua_himpunan') || Auth::user()->hasRole('wakil_ketua_himpunan') || Auth::user()->hasRole('admin_sekretariat'))
                <a href="{{ route('admin.sekretariat.surat.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.sekretariat.surat.*') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="inbox" class="w-5 h-5"></i>
                    <span class="font-medium">Verifikasi Surat</span>
                </a>
                @endif

                @if(Auth::user()->hasRole('super_admin') || Auth::user()->hasRole('kader'))
                <a href="{{ route('kader.surat.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('kader.surat.index') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="file-text" class="w-5 h-5"></i>
                    <span class="font-medium">Pengajuan Surat</span>
                </a>
                @endif

                @if(Auth::user()->hasAnyRole(['super_admin', 'ketua_himpunan', 'wakil_ketua_himpunan', 'admin_sekretariat', 'bendahara', 'kabid_kemuhammadiyahan', 'kabid_keorganisasian', 'kabid_metkom', 'kabid_litbang', 'kabid_kewirausahaan', 'kabid_mikat', 'ketua_panitia_sementara']))
                <a href="{{ route('admin.meetings.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.meetings.*') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="bell-ring" class="w-5 h-5"></i>
                    <span class="font-medium">Undangan Rapat</span>
                </a>
                @endif

                @if(Auth::user()->hasRole('super_admin'))
                <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Divisi & Modul Khusus</p>
                @endif
                
                @if(Auth::user()->hasRole('super_admin') || Auth::user()->hasRole('bendahara'))
                <a href="{{ route('admin.keuangan.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.keuangan.index') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="wallet" class="w-5 h-5"></i>
                    <span class="font-medium">Keuangan (Bendahara)</span>
                </a>
                @endif
                
                @if(Auth::user()->hasRole('super_admin') || Auth::user()->hasRole('ketua_himpunan') || Auth::user()->hasRole('wakil_ketua_himpunan') || Auth::user()->hasRole('kabid_kemuhammadiyahan') || Auth::user()->hasRole('wakil_kemuhammadiyahan') || Auth::user()->hasRole('anggota_kemuhammadiyahan'))
                <a href="{{ route('admin.kajian.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.kajian.*') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="book-open" class="w-5 h-5"></i>
                    <span class="font-medium">Kajian (Kemuhammadiyahan)</span>
                </a>
                @endif

                @if(Auth::user()->hasRole('super_admin') || Auth::user()->hasRole('ketua_himpunan') || Auth::user()->hasRole('wakil_ketua_himpunan') || Auth::user()->hasRole('kabid_keorganisasian') || Auth::user()->hasRole('wakil_keorganisasian') || Auth::user()->hasRole('anggota_keorganisasian'))
                <a href="{{ route('admin.notulensi.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.notulensi.*') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="file-text" class="w-5 h-5"></i>
                    <span class="font-medium">Notulensi (Keorganisasian)</span>
                </a>
                @endif

                @if(Auth::user()->hasRole('super_admin') || Auth::user()->hasRole('ketua_himpunan') || Auth::user()->hasRole('wakil_ketua_himpunan') || Auth::user()->hasRole('kabid_metkom') || Auth::user()->hasRole('wakil_metkom') || Auth::user()->hasRole('anggota_metkom'))
                <a href="{{ route('admin.artikel.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.artikel.*') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="instagram" class="w-5 h-5"></i>
                    <span class="font-medium">Postingan Medsos (Metkom)</span>
                </a>
                @endif

                @if(Auth::user()->hasRole('super_admin') || Auth::user()->hasRole('ketua_himpunan') || Auth::user()->hasRole('wakil_ketua_himpunan') || Auth::user()->hasRole('kabid_litbang') || Auth::user()->hasRole('wakil_litbang') || Auth::user()->hasRole('anggota_litbang'))
                <a href="{{ route('admin.survey.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.survey.*') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="bar-chart-2" class="w-5 h-5"></i>
                    <span class="font-medium">Survey (Litbang)</span>
                </a>
                @endif

                @if(Auth::user()->hasRole('super_admin') || Auth::user()->hasRole('ketua_himpunan') || Auth::user()->hasRole('wakil_ketua_himpunan') || Auth::user()->hasRole('kabid_kewirausahaan') || Auth::user()->hasRole('wakil_kewirausahaan') || Auth::user()->hasRole('anggota_kewirausahaan'))
                <a href="{{ route('admin.merchandise.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.merchandise.*') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                    <span class="font-medium">Merchandise (Kewirausahaan)</span>
                </a>
                @endif

                @if(Auth::user()->hasRole('super_admin') || Auth::user()->hasRole('ketua_himpunan') || Auth::user()->hasRole('wakil_ketua_himpunan') || Auth::user()->hasRole('kabid_mikat') || Auth::user()->hasRole('wakil_mikat') || Auth::user()->hasRole('anggota_mikat'))
                <a href="{{ route('admin.klub.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.klub.*') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="music" class="w-5 h-5"></i>
                    <span class="font-medium">Klub (Mikat)</span>
                </a>
                @endif

                @if(Auth::user()->hasRole('super_admin'))
                <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Sistem & Ekstra</p>
                <a href="{{ route('admin.events.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.events.index') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="calendar" class="w-5 h-5"></i>
                    <span class="font-medium">Event & Panitia</span>
                </a>
                <a href="{{ route('admin.absensi.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {{ request()->routeIs('admin.absensi.index') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="clipboard-check" class="w-5 h-5"></i>
                    <span class="font-medium">Data Absensi</span>
                </a>
                
                <a href="{{ route('superadmin.trash') }}" class="flex items-center gap-3 px-3 py-2.5 mt-4 rounded-lg {{ request()->routeIs('superadmin.trash') ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white' }} transition-colors">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                    <span class="font-medium">Recycle Bin</span>
                </a>
                @endif

                @if(session()->has('impersonate_by'))
                <div class="mt-8 px-3">
                    <a href="{{ route('leave_impersonate') }}" class="flex items-center justify-center gap-2 px-3 py-2 bg-amber-500/20 text-amber-500 border border-amber-500/50 rounded-lg hover:bg-amber-500 hover:text-white transition-colors text-sm font-medium">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke Admin
                    </a>
                </div>
                @endif
            </nav>

            <div class="p-4 border-t border-slate-800">
                <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50">
                    <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white uppercase">
                        {{ substr(Auth::user()->name, 0, 1) }}
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <p class="text-sm font-medium text-white truncate">{{ Auth::user()->name }}</p>
                        <p class="text-xs text-slate-400 truncate">{{ Auth::user()->roles->pluck('name')->join(', ') ?: 'No Role' }}</p>
                    </div>
                </div>
                <form method="POST" action="{{ route('logout') }}" class="mt-2">
                    @csrf
                    <button type="submit" class="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        <i data-lucide="log-out" class="w-4 h-4"></i> Logout
                    </button>
                </form>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50 dark:bg-gray-900/50">
            <div class="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none"></div>
            
            <header class="h-16 flex items-center justify-between px-8 glass-panel dark:bg-gray-800/80 border-b border-slate-200 dark:border-gray-700 z-10 sticky top-0">
                <h1 class="text-xl font-heading font-semibold text-slate-800 dark:text-gray-100">@yield('title')</h1>
                <div class="flex items-center gap-4">
                    <x-dark-mode-toggle />
                    <a href="{{ route('tentang') }}" target="_blank" class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                        <i data-lucide="info" class="w-4 h-4"></i> Tentang HIMASTI
                    </a>
                </div>
            </header>

            <div class="flex-1 overflow-auto p-8 z-10 relative">
                @if($errors->any())
                    <div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col gap-1">
                        @foreach ($errors->all() as $error)
                            <div class="flex items-center gap-2 text-red-700 text-sm">
                                <i data-lucide="alert-circle" class="w-4 h-4"></i> {{ $error }}
                            </div>
                        @endforeach
                    </div>
                @endif
                @if(session('success'))
                    <div class="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                        <i data-lucide="check-circle" class="w-5 h-5 text-emerald-500 mt-0.5"></i>
                        <p class="text-emerald-700 font-medium">{{ session('success') }}</p>
                    </div>
                @endif
                
                @yield('content')
            </div>
        </main>
    </div>
    <script>lucide.createIcons();</script>
    <x-chatbot />
</body>
</html>
