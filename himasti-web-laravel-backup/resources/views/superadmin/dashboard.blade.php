@extends('layouts.admin')

@section('title', 'Dashboard Super Admin')

@section('content')
<div class="max-w-7xl mx-auto space-y-8">

    <!-- Welcome Banner -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-500/20">
        <!-- Abstract shapes -->
        <div class="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div class="absolute bottom-0 right-32 -mb-12 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-xl"></div>
        
        <div class="relative z-10">
            <h2 class="font-heading text-3xl font-bold mb-2">Selamat datang kembali, {{ explode(' ', Auth::user()->name)[0] }}! 👋</h2>
            <p class="text-blue-100 max-w-2xl text-lg">Pantau aktivitas sistem, manajemen pengguna, dan keseluruhan operasional HIMASTI melalui dashboard cerdas ini.</p>
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Stat Card 1 -->
        <div class="glass-panel rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div class="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div class="flex items-center gap-4 relative z-10">
                <div class="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <i data-lucide="users-2" class="w-7 h-7"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-slate-500 mb-1">Total Pengurus</p>
                    <h3 class="text-3xl font-heading font-bold text-slate-800">{{ $totalUsers }}</h3>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm text-emerald-500 font-medium">
                <i data-lucide="trending-up" class="w-4 h-4 mr-1"></i>
                <span>Aktif di sistem</span>
            </div>
        </div>

        <!-- Stat Card 2 -->
        <div class="glass-panel rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div class="absolute right-0 top-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div class="flex items-center gap-4 relative z-10">
                <div class="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <i data-lucide="graduation-cap" class="w-7 h-7"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-slate-500 mb-1">Data Kader</p>
                    <h3 class="text-3xl font-heading font-bold text-slate-800">{{ $totalKader }}</h3>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm text-slate-400 font-medium">
                <i data-lucide="layers" class="w-4 h-4 mr-1"></i>
                <span>Tercatat di database</span>
            </div>
        </div>

        <!-- Stat Card 3 -->
        <div class="glass-panel rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div class="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div class="flex items-center gap-4 relative z-10">
                <div class="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <i data-lucide="file-text" class="w-7 h-7"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-slate-500 mb-1">Total Persuratan</p>
                    <h3 class="text-3xl font-heading font-bold text-slate-800">{{ $totalSurat }}</h3>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm text-slate-400 font-medium">
                <i data-lucide="file-clock" class="w-4 h-4 mr-1"></i>
                <span>Riwayat pengajuan</span>
            </div>
        </div>

    </div>

    <!-- Quick Actions -->
    <div class="glass-panel rounded-2xl p-8 shadow-sm">
        <h3 class="font-heading text-xl font-bold text-slate-800 mb-6">Akses Cepat</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <a href="{{ route('superadmin.users') }}" class="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                <div class="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-600 group-hover:text-blue-600 transition-colors mb-3">
                    <i data-lucide="user-plus" class="w-6 h-6"></i>
                </div>
                <span class="font-medium text-slate-700 group-hover:text-blue-700">Atur Role Pengurus</span>
            </a>

            <a href="{{ route('superadmin.trash') }}" class="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/50 transition-all group">
                <div class="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-red-100 flex items-center justify-center text-slate-600 group-hover:text-red-600 transition-colors mb-3">
                    <i data-lucide="trash" class="w-6 h-6"></i>
                </div>
                <span class="font-medium text-slate-700 group-hover:text-red-700">Recycle Bin</span>
            </a>
            
        </div>
    </div>

</div>
@endsection
