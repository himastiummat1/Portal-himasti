@extends('layouts.admin')

@section('title', 'Undangan Rapat & Pesan Panitia')

@section('content')
<div class="flex flex-col md:flex-row gap-6">
    <!-- List of Meetings -->
    <div class="flex-1">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
            <div class="p-5 border-b border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50">
                <h2 class="text-lg font-semibold text-slate-800 dark:text-gray-100">Daftar Undangan & Pesan Rapat</h2>
            </div>
            
            <div class="p-5">
                @if($meetings->isEmpty())
                <div class="text-center py-10">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-400 dark:text-gray-500 mb-4">
                        <i data-lucide="inbox" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-base font-medium text-slate-900 dark:text-gray-200">Belum ada undangan rapat</h3>
                    <p class="text-sm text-slate-500 dark:text-gray-400 mt-1">Buat undangan rapat atau pesan sementara untuk kepanitiaan di sini.</p>
                </div>
                @else
                <div class="space-y-4">
                    @foreach($meetings as $meeting)
                    <div class="p-4 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow relative">
                        <div class="flex items-start justify-between">
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 {{ $meeting->type == 'rapat_pengurus' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' }}">
                                    <i data-lucide="{{ $meeting->type == 'rapat_pengurus' ? 'users' : 'message-square' }}" class="w-6 h-6"></i>
                                </div>
                                <div>
                                    <h3 class="font-bold text-slate-800 dark:text-gray-100 text-lg">{{ $meeting->title }}</h3>
                                    <div class="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-gray-400">
                                        <span class="inline-flex items-center gap-1">
                                            <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                                            {{ $meeting->event_date->format('d M Y, H:i') }}
                                        </span>
                                        <span>&bull;</span>
                                        <span class="inline-flex items-center gap-1">
                                            <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                                            {{ $meeting->location }}
                                        </span>
                                    </div>
                                    <div class="mt-3 text-sm text-slate-700 dark:text-gray-300">
                                        {!! nl2br(e($meeting->description)) !!}
                                    </div>
                                    <div class="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-gray-500">
                                        <div class="w-5 h-5 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center uppercase">
                                            {{ substr($meeting->creator->name, 0, 1) }}
                                        </div>
                                        <span>Oleh: {{ $meeting->creator->name }}</span>
                                        <span class="px-2 py-0.5 rounded-full text-[10px] {{ $meeting->type == 'rapat_pengurus' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' }}">
                                            {{ $meeting->type == 'rapat_pengurus' ? 'Rapat Pengurus' : 'Pesan Panitia' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            @if($meeting->created_by === auth()->id() || auth()->user()->hasRole('super_admin'))
                            <div class="flex items-center gap-2">
                                <form action="{{ route('admin.meetings.resend', $meeting->id) }}" method="POST" onsubmit="return confirm('Kirim ulang undangan ini agar muncul di paling atas beranda?');">
                                    @csrf
                                    <button type="submit" class="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Kirim Ulang / Bump">
                                        <i data-lucide="refresh-cw" class="w-5 h-5"></i>
                                    </button>
                                </form>

                                <form action="{{ route('admin.meetings.destroy', $meeting->id) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus undangan ini?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Hapus">
                                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                                    </button>
                                </form>
                            </div>
                            @endif
                        </div>
                    </div>
                    @endforeach
                </div>
                @endif
            </div>
        </div>
    </div>

    <!-- Create Form -->
    <div class="w-full md:w-1/3">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden sticky top-24">
            <div class="p-5 border-b border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50">
                <h2 class="text-lg font-semibold text-slate-800 dark:text-gray-100">Buat Undangan Baru</h2>
            </div>
            <div class="p-5">
                <form action="{{ route('admin.meetings.store') }}" method="POST">
                    @csrf
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Judul Rapat / Pesan</label>
                            <input type="text" name="title" required class="w-full rounded-lg border-slate-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500" placeholder="Contoh: Rapat Evaluasi Bulanan">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Jenis Rapat</label>
                            <select name="type" required class="w-full rounded-lg border-slate-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500">
                                @if(Auth::user()->hasAnyRole(['super_admin', 'ketua_himpunan', 'wakil_ketua_himpunan', 'admin_sekretariat', 'bendahara', 'kabid_kemuhammadiyahan', 'kabid_keorganisasian', 'kabid_metkom', 'kabid_litbang', 'kabid_kewirausahaan', 'kabid_mikat']))
                                <option value="rapat_pengurus">Rapat Pengurus (Kabid, Kahim, dll)</option>
                                @endif
                                <option value="rapat_panitia" {{ Auth::user()->hasRole('ketua_panitia_sementara') && !Auth::user()->hasAnyRole(['super_admin', 'ketua_himpunan', 'wakil_ketua_himpunan', 'admin_sekretariat', 'bendahara', 'kabid_kemuhammadiyahan', 'kabid_keorganisasian', 'kabid_metkom', 'kabid_litbang', 'kabid_kewirausahaan', 'kabid_mikat']) ? 'selected' : '' }}>Pesan Rapat Sementara (Kepanitiaan)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Tanggal & Waktu</label>
                            <input type="datetime-local" name="event_date" required class="w-full rounded-lg border-slate-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Lokasi / Tautan Ruang Rapat</label>
                            <input type="text" name="location" required class="w-full rounded-lg border-slate-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500" placeholder="Sekretariat / Link Zoom / Google Meet">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Deskripsi / Agenda</label>
                            <textarea name="description" rows="4" required class="w-full rounded-lg border-slate-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500" placeholder="Tuliskan agenda rapat atau pesan untuk peserta..."></textarea>
                        </div>
                        
                        <button type="submit" class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <i data-lucide="send" class="w-4 h-4"></i> Kirim Undangan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
