<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard Kader HIMASTI') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            @php
                $quotes = [
                    "Barangsiapa bersungguh-sungguh, sesungguhnya kesungguhannya itu adalah untuk dirinya sendiri.",
                    "Teknologi hanyalah alat. Yang terpenting adalah manusianya.",
                    "Kode yang baik adalah puisi; kode yang buruk adalah tragedi.",
                    "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.",
                    "Inovasi membedakan antara pemimpin dan pengikut."
                ];
                $randomQuote = $quotes[array_rand($quotes)];
                $dataKader = auth()->user()->dataKader;
            @endphp
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <!-- Profil Kader & Quick Actions -->
                <div class="lg:col-span-2 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl shadow-lg border border-blue-800/50 overflow-hidden relative">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div class="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
                    
                    <div class="p-8 relative z-10">
                        <div class="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div class="flex items-center gap-5">
                                <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner backdrop-blur-md shrink-0">
                                    <span class="text-3xl font-bold text-white">{{ substr(Auth::user()->name, 0, 1) }}</span>
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold text-white mb-1">Halo, {{ Auth::user()->name }}! 👋</h3>
                                    <p class="text-blue-200 text-sm flex items-center gap-2">
                                        <i data-lucide="mail" class="w-4 h-4 opacity-70"></i> {{ Auth::user()->email }}
                                    </p>
                                </div>
                            </div>
                            
                            @if(auth()->user()->roles->where('name', '!=', 'kader')->count() > 0)
                                <a href="{{ route('admin.redirect') }}" class="inline-flex items-center justify-center px-4 py-2.5 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg whitespace-nowrap text-sm">
                                    <i data-lucide="shield" class="w-4 h-4 mr-2"></i> Panel Pengurus
                                </a>
                            @endif
                        </div>

                        <div class="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            @if($dataKader)
                                <div class="bg-white/10 backdrop-blur-sm border border-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors">
                                    <p class="text-blue-200 text-xs mb-1 opacity-80">Status Kader</p>
                                    <p class="text-white font-bold text-sm">{{ $dataKader->status_kaderisasi }}</p>
                                </div>
                                <div class="bg-white/10 backdrop-blur-sm border border-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors">
                                    <p class="text-blue-200 text-xs mb-1 opacity-80">NIM</p>
                                    <p class="text-white font-bold text-sm">{{ $dataKader->nim }}</p>
                                </div>
                                <div class="bg-white/10 backdrop-blur-sm border border-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors">
                                    <p class="text-blue-200 text-xs mb-1 opacity-80">Angkatan</p>
                                    <p class="text-white font-bold text-sm">{{ $dataKader->angkatan }}</p>
                                </div>
                                <div class="bg-white/10 backdrop-blur-sm border border-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors">
                                    <p class="text-blue-200 text-xs mb-1 opacity-80">Bergabung</p>
                                    <p class="text-white font-bold text-sm">{{ Auth::user()->created_at->format('M Y') }}</p>
                                </div>
                            @else
                                <div class="col-span-full bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <i data-lucide="alert-circle" class="w-5 h-5 text-red-300"></i>
                                        <p class="text-red-200 text-sm">Data biodata kader kamu belum lengkap.</p>
                                    </div>
                                    <a href="{{ route('profile.edit') }}" class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors">Lengkapi Sekarang</a>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>

                <!-- Kutipan & Akses Cepat -->
                <div class="flex flex-col gap-6">
                    <!-- Daily Quote -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 flex-1 flex flex-col justify-center relative overflow-hidden group">
                        <i data-lucide="quote" class="absolute -right-4 -bottom-4 w-24 h-24 text-slate-100 dark:text-gray-700/50 -rotate-12 group-hover:scale-110 transition-transform duration-500"></i>
                        <p class="text-gray-600 dark:text-gray-300 italic text-sm relative z-10 leading-relaxed font-medium">
                            "{{ $randomQuote }}"
                        </p>
                        <p class="text-xs text-blue-600 dark:text-blue-400 font-bold mt-3 uppercase tracking-wider relative z-10">— Semangat HIMASTI</p>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div class="grid grid-cols-2 gap-3">
                        <a href="{{ url('/') }}" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-3 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors group">
                            <div class="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <i data-lucide="home" class="w-5 h-5"></i>
                            </div>
                            <span class="text-xs font-bold text-gray-700 dark:text-gray-300">Beranda Web</span>
                        </a>
                        <a href="{{ route('profile.edit') }}" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-3 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors group">
                            <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <i data-lucide="settings" class="w-5 h-5"></i>
                            </div>
                            <span class="text-xs font-bold text-gray-700 dark:text-gray-300">Pengaturan</span>
                        </a>
                    </div>
                </div>
            </div>

            @if(isset($meetings) && count($meetings) > 0)
            <div class="mb-8">
                <div class="flex items-center gap-2 mb-4 px-1">
                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Informasi & Undangan Rapat Terbaru</h3>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    @foreach($meetings as $meeting)
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rounded-full opacity-20 {{ $meeting->type == 'rapat_pengurus' ? 'bg-blue-500' : 'bg-amber-500' }}"></div>
                        
                        @if(auth()->id() === $meeting->created_by || auth()->user()->hasRole('super_admin'))
                        <div class="absolute top-3 right-3 z-10 flex gap-2">
                            <form action="{{ route('admin.meetings.destroy', $meeting->id) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus pengingat ini?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-800/80 rounded-lg transition-colors shadow-sm" title="Hapus Pengingat">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </form>
                        </div>
                        @endif
                        
                        <div class="flex items-start gap-3 mb-3 pr-8">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 {{ $meeting->type == 'rapat_pengurus' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' }}">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    @if($meeting->type == 'rapat_pengurus')
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    @else
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                    @endif
                                </svg>
                            </div>
                            <div>
                                <span class="text-[10px] uppercase tracking-wider font-bold {{ $meeting->type == 'rapat_pengurus' ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400' }}">
                                    {{ $meeting->type == 'rapat_pengurus' ? 'Rapat Pengurus' : 'Pesan Panitia' }}
                                </span>
                                <h4 class="font-bold text-gray-800 dark:text-gray-100 line-clamp-1" title="{{ $meeting->title }}">{{ $meeting->title }}</h4>
                            </div>
                        </div>
                        
                        <div class="space-y-2 mb-4">
                            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span>{{ $meeting->event_date->format('d M Y, H:i') }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span class="truncate" title="{{ $meeting->location }}">{{ $meeting->location }}</span>
                            </div>
                        </div>
                        
                        <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 mb-3 h-20 overflow-y-auto custom-scrollbar">
                            {!! nl2br(e($meeting->description)) !!}
                        </div>
                        
                        <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <div class="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center uppercase text-[10px] font-bold text-gray-700 dark:text-gray-300">
                                {{ substr($meeting->creator->name, 0, 1) }}
                            </div>
                            <span>Dikirim oleh {{ $meeting->creator->name }} • {{ $meeting->created_at->diffForHumans() }}</span>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <!-- Kemuhammadiyahan (Kajian) -->
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border dark:border-gray-700 border-t-4 dark:border-t-emerald-500 border-t-emerald-500">
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Kajian Terkini</h3>
                        </div>
                        @if(count($kajians) > 0)
                            <div class="space-y-4">
                                @foreach($kajians as $kajian)
                                    <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                                        <div class="flex justify-between items-start mb-2">
                                            <h4 class="font-bold text-gray-800 dark:text-gray-100">{{ $kajian->tema }}</h4>
                                            <span class="px-2 py-1 text-xs font-semibold rounded-full {{ $kajian->status == 'Akan Datang' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300' }}">{{ $kajian->status }}</span>
                                        </div>
                                        <p class="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Pemateri:</strong> {{ $kajian->pemateri }}</p>
                                        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Waktu & Tempat:</strong> {{ \Carbon\Carbon::parse($kajian->tanggal)->format('d M Y') }} | {{ $kajian->lokasi }}</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400 italic">{{ \Illuminate\Support\Str::limit($kajian->deskripsi, 60) }}</p>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <p class="text-gray-500 dark:text-gray-400 text-sm">Belum ada jadwal kajian terbaru.</p>
                        @endif
                    </div>
                </div>

                <!-- Metkom (Postingan Medsos) -->
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border dark:border-gray-700 border-t-4 dark:border-t-indigo-500 border-t-indigo-500">
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7H20a2 2 0 012 2v9a2 2 0 01-2 2h-2m-6-5h4m-4 2h4m-4-6h4"></path></svg>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Postingan Medsos Terbaru</h3>
                        </div>
                        @if(count($artikels) > 0)
                            <div class="space-y-4">
                                @foreach($artikels as $artikel)
                                    <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                                        <h4 class="font-bold text-indigo-700 dark:text-indigo-400 mb-1">{{ $artikel->judul }}</h4>
                                        <div class="flex items-center gap-2 mb-2">
                                            <p class="text-xs text-gray-500 dark:text-gray-400">Platform: <strong class="text-gray-700 dark:text-gray-300">{{ $artikel->penulis }}</strong> | {{ $artikel->created_at->diffForHumans() }}</p>
                                            @if($artikel->link)
                                                <a href="{{ $artikel->link }}" target="_blank" class="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-full hover:bg-indigo-200 transition-colors flex items-center gap-1"><i data-lucide="external-link" class="w-3 h-3"></i> Buka</a>
                                            @endif
                                        </div>
                                        <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ \Illuminate\Support\Str::limit($artikel->konten, 100) }}</p>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <p class="text-gray-500 dark:text-gray-400 text-sm">Belum ada postingan medsos yang dipublikasikan.</p>
                        @endif
                    </div>
                </div>

                <!-- Litbang (Survey) -->
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border dark:border-gray-700 border-t-4 dark:border-t-amber-500 border-t-amber-500">
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Polling & Survey (Litbang)</h3>
                        </div>
                        @if(count($surveys) > 0)
                            <div class="space-y-4">
                                @foreach($surveys as $survey)
                                    <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h4 class="font-bold text-gray-800 dark:text-gray-100">{{ $survey->judul }}</h4>
                                            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ \Illuminate\Support\Str::limit($survey->deskripsi, 60) }}</p>
                                        </div>
                                        <a href="{{ $survey->link_gform }}" target="_blank" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap">
                                            Isi Form
                                        </a>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <p class="text-gray-500 dark:text-gray-400 text-sm">Tidak ada survey aktif saat ini.</p>
                        @endif
                    </div>
                </div>

                <!-- Kewirausahaan (Merchandise) -->
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border dark:border-gray-700 border-t-4 dark:border-t-rose-500 border-t-rose-500">
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <svg class="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Merchandise HIMASTI</h3>
                        </div>
                        @if(count($merchandises) > 0)
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                @foreach($merchandises as $merch)
                                    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                                        <!-- Image Preview -->
                                        @if($merch->gambar)
                                            <div class="h-40 w-full overflow-hidden">
                                                <img src="{{ asset('storage/' . $merch->gambar) }}" alt="{{ $merch->nama_barang }}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300">
                                            </div>
                                        @else
                                            <div class="h-40 w-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-slate-400 dark:text-gray-500">
                                                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            </div>
                                        @endif
                                        
                                        <div class="p-4 flex-1 flex flex-col">
                                            <h4 class="font-bold text-gray-800 dark:text-gray-100 truncate" title="{{ $merch->nama_barang }}">{{ $merch->nama_barang }}</h4>
                                            <div class="mt-2 flex justify-between items-center">
                                                <span class="text-rose-600 dark:text-rose-400 font-bold">Rp {{ number_format($merch->harga, 0, ',', '.') }}</span>
                                                <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">Stok: {{ $merch->stok }}</span>
                                            </div>
                                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 flex-1">{{ $merch->deskripsi }}</p>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <p class="text-gray-500 dark:text-gray-400 text-sm">Belum ada merchandise yang tersedia.</p>
                        @endif
                    </div>
                </div>

                <!-- Mikat (Klub) -->
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border dark:border-gray-700 border-t-4 dark:border-t-purple-500 border-t-purple-500 md:col-span-2">
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Klub & Minat Bakat</h3>
                        </div>
                        @if(count($klubs) > 0)
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                @foreach($klubs as $klub)
                                    <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                                        <h4 class="font-bold text-purple-800 dark:text-purple-400 mb-2">{{ $klub->nama_klub }}</h4>
                                        <p class="text-sm text-gray-700 dark:text-gray-300 mb-1"><span class="font-semibold text-gray-900 dark:text-gray-100">Ketua:</span> {{ $klub->ketua_klub }}</p>
                                        <p class="text-sm text-gray-700 dark:text-gray-300 mb-3"><span class="font-semibold text-gray-900 dark:text-gray-100">Jadwal:</span> {{ $klub->jadwal_latihan }}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 italic">{{ \Illuminate\Support\Str::limit($klub->deskripsi, 80) }}</p>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <p class="text-gray-500 dark:text-gray-400 text-sm">Belum ada klub yang didaftarkan.</p>
                        @endif
                    </div>
                </div>

                <!-- Galeri Kaderisasi -->
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border dark:border-gray-700 border-t-4 dark:border-t-teal-500 border-t-teal-500 md:col-span-2 mt-8">
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-6">
                            <svg class="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Galeri Kegiatan Pengkaderan</h3>
                        </div>
                        
                        @if(count($galeri_kaderisasi) > 0)
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                @foreach($galeri_kaderisasi as $foto)
                                    <div class="relative group overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 h-48">
                                        <img src="{{ asset('storage/' . $foto->gambar) }}" alt="{{ $foto->judul }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <h4 class="text-white font-bold text-sm truncate">{{ $foto->judul }}</h4>
                                            @if($foto->deskripsi)
                                                <p class="text-gray-300 text-xs mt-1 line-clamp-2">{{ $foto->deskripsi }}</p>
                                            @endif
                                            <span class="text-gray-400 text-[10px] mt-2">{{ $foto->created_at->format('d M Y') }}</span>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <div class="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                <p class="text-gray-500 dark:text-gray-400 text-sm">Belum ada foto kegiatan pengkaderan yang diunggah.</p>
                            </div>
                        @endif
                    </div>
                </div>

            </div>
        </div>
    </div>
</x-app-layout>
