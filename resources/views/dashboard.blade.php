<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard Kader HIMASTI') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
                <div class="p-6 text-gray-900 border-b border-gray-200 bg-blue-50">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 class="text-2xl font-bold text-blue-800 mb-2">Selamat Datang, {{ Auth::user()->name }}! 👋</h3>
                            <p class="text-blue-600">Ini adalah portal utama informasi kader HIMASTI. Jelajahi berbagai informasi terbaru dari divisi-divisi himpunan di bawah ini.</p>
                        </div>
                        
                        @if(auth()->user()->roles->where('name', '!=', 'kader')->count() > 0)
                            <a href="{{ route('admin.redirect') }}" class="inline-flex items-center justify-center px-4 py-2 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-900 transition-colors shadow whitespace-nowrap">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                Kembali ke Panel Pengurus
                            </a>
                        @endif
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <!-- Kemuhammadiyahan (Kajian) -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-emerald-500">
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            <h3 class="text-xl font-bold text-gray-800">Kajian Terkini</h3>
                        </div>
                        @if(count($kajians) > 0)
                            <div class="space-y-4">
                                @foreach($kajians as $kajian)
                                    <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div class="flex justify-between items-start mb-2">
                                            <h4 class="font-bold text-gray-800">{{ $kajian->tema }}</h4>
                                            <span class="px-2 py-1 text-xs font-semibold rounded-full {{ $kajian->status == 'Akan Datang' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600' }}">{{ $kajian->status }}</span>
                                        </div>
                                        <p class="text-sm text-gray-600 mb-1"><strong>Pemateri:</strong> {{ $kajian->pemateri }}</p>
                                        <p class="text-sm text-gray-600 mb-2"><strong>Waktu & Tempat:</strong> {{ \Carbon\Carbon::parse($kajian->tanggal)->format('d M Y') }} | {{ $kajian->lokasi }}</p>
                                        <p class="text-sm text-gray-500 italic">{{ \Illuminate\Support\Str::limit($kajian->deskripsi, 60) }}</p>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <p class="text-gray-500 text-sm">Belum ada jadwal kajian terbaru.</p>
                        @endif
                    </div>
                </div>

                <!-- Metkom (Postingan Medsos) -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-indigo-500">
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7H20a2 2 0 012 2v9a2 2 0 01-2 2h-2m-6-5h4m-4 2h4m-4-6h4"></path></svg>
                            <h3 class="text-xl font-bold text-gray-800">Postingan Medsos Terbaru</h3>
                        </div>
                        @if(count($artikels) > 0)
                            <div class="space-y-4">
                                @foreach($artikels as $artikel)
                                    <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <h4 class="font-bold text-indigo-700 mb-1">{{ $artikel->judul }}</h4>
                                        <p class="text-xs text-gray-500 mb-2">Platform: <strong>{{ $artikel->penulis }}</strong> | {{ $artikel->created_at->diffForHumans() }}</p>
                                        <p class="text-sm text-gray-700 whitespace-pre-line">{{ \Illuminate\Support\Str::limit($artikel->konten, 100) }}</p>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <p class="text-gray-500 text-sm">Belum ada postingan medsos yang dipublikasikan.</p>
                        @endif
                    </div>
                </div>

                <!-- Litbang (Survey) -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-amber-500">
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            <h3 class="text-xl font-bold text-gray-800">Polling & Survey (Litbang)</h3>
                        </div>
                        @if(count($surveys) > 0)
                            <div class="space-y-4">
                                @foreach($surveys as $survey)
                                    <div class="p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h4 class="font-bold text-gray-800">{{ $survey->judul }}</h4>
                                            <p class="text-sm text-gray-600 mt-1">{{ \Illuminate\Support\Str::limit($survey->deskripsi, 60) }}</p>
                                        </div>
                                        <a href="{{ $survey->link_gform }}" target="_blank" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap">
                                            Isi Form
                                        </a>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <p class="text-gray-500 text-sm">Tidak ada survey aktif saat ini.</p>
                        @endif
                    </div>
                </div>

                <!-- Kewirausahaan (Merchandise) -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-rose-500">
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <svg class="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <h3 class="text-xl font-bold text-gray-800">Merchandise HIMASTI</h3>
                        </div>
                        @if(count($merchandises) > 0)
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                @foreach($merchandises as $merch)
                                    <div class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                                        <!-- Image Preview -->
                                        @if($merch->gambar)
                                            <div class="h-40 w-full overflow-hidden">
                                                <img src="{{ asset('storage/' . $merch->gambar) }}" alt="{{ $merch->nama_barang }}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300">
                                            </div>
                                        @else
                                            <div class="h-40 w-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            </div>
                                        @endif
                                        
                                        <div class="p-4 flex-1 flex flex-col">
                                            <h4 class="font-bold text-gray-800 truncate" title="{{ $merch->nama_barang }}">{{ $merch->nama_barang }}</h4>
                                            <div class="mt-2 flex justify-between items-center">
                                                <span class="text-rose-600 font-bold">Rp {{ number_format($merch->harga, 0, ',', '.') }}</span>
                                                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Stok: {{ $merch->stok }}</span>
                                            </div>
                                            <p class="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{{ $merch->deskripsi }}</p>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <p class="text-gray-500 text-sm">Belum ada merchandise yang tersedia.</p>
                        @endif
                    </div>
                </div>

                <!-- Mikat (Klub) -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-purple-500 md:col-span-2">
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                            <h3 class="text-xl font-bold text-gray-800">Klub & Minat Bakat</h3>
                        </div>
                        @if(count($klubs) > 0)
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                @foreach($klubs as $klub)
                                    <div class="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                        <h4 class="font-bold text-purple-800 mb-2">{{ $klub->nama_klub }}</h4>
                                        <p class="text-sm text-gray-700 mb-1"><span class="font-semibold">Ketua:</span> {{ $klub->ketua_klub }}</p>
                                        <p class="text-sm text-gray-700 mb-3"><span class="font-semibold">Jadwal:</span> {{ $klub->jadwal_latihan }}</p>
                                        <p class="text-xs text-gray-500 italic">{{ \Illuminate\Support\Str::limit($klub->deskripsi, 80) }}</p>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <p class="text-gray-500 text-sm">Belum ada klub yang didaftarkan.</p>
                        @endif
                    </div>
                </div>

                <!-- Galeri Kaderisasi -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-teal-500 md:col-span-2 mt-8">
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-6">
                            <svg class="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <h3 class="text-xl font-bold text-gray-800">Galeri Kegiatan Pengkaderan</h3>
                        </div>
                        
                        @if(count($galeri_kaderisasi) > 0)
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                @foreach($galeri_kaderisasi as $foto)
                                    <div class="relative group overflow-hidden rounded-xl shadow-sm border border-gray-100 bg-gray-50 h-48">
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
                            <div class="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p class="text-gray-500 text-sm">Belum ada foto kegiatan pengkaderan yang diunggah.</p>
                            </div>
                        @endif
                    </div>
                </div>

            </div>
        </div>
    </div>
</x-app-layout>
