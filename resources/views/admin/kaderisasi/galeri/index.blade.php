@extends('layouts.admin')
@section('title', 'Galeri Kegiatan Pengkaderan')

@section('content')
<div class="mb-6 flex justify-between items-center">
    <h2 class="text-2xl font-bold text-slate-800"><i data-lucide="image" class="w-6 h-6 inline-block mr-2"></i> Galeri Kegiatan Pengkaderan</h2>
</div>

<div class="grid md:grid-cols-3 gap-6">
    <div class="md:col-span-1">
        <div class="glass-panel p-6 rounded-2xl border border-slate-200">
            <h3 class="font-bold text-lg mb-4">Unggah Foto Baru</h3>
            <form action="{{ route('admin.kaderisasi.galeri.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                
                <div class='mb-3'>
                    <label class='text-sm font-medium text-slate-700'>Judul Kegiatan</label>
                    <input type='text' name='judul' required class='w-full mt-1 rounded-lg border-slate-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow' placeholder='Misal: MABIM 2026'>
                </div>
                
                <div class='mb-3'>
                    <label class='text-sm font-medium text-slate-700'>Foto / Dokumentasi</label>
                    <input type='file' name='gambar' required accept="image/*" class='w-full mt-1 rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow'>
                </div>
                
                <div class='mb-4'>
                    <label class='text-sm font-medium text-slate-700'>Deskripsi (Opsional)</label>
                    <textarea name='deskripsi' class='w-full mt-1 rounded-lg border-slate-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow' rows="3" placeholder='Tambahkan keterangan singkat...'></textarea>
                </div>
        
                <button type="submit" class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-colors flex justify-center items-center gap-2">
                    <i data-lucide="upload" class="w-4 h-4"></i> Unggah Foto
                </button>
            </form>
        </div>
    </div>
    
    <div class="md:col-span-2">
        <div class="glass-panel p-6 rounded-2xl border border-slate-200">
            <h3 class="font-bold text-lg mb-4">Galeri Dokumentasi</h3>
            
            @if(count($items) > 0)
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    @foreach($items as $item)
                        <div class="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200">
                            <img src="{{ asset('storage/' . $item->gambar) }}" alt="{{ $item->judul }}" class="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300">
                            
                            <!-- Overlay with title -->
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                <h4 class="text-white font-bold text-sm truncate" title="{{ $item->judul }}">{{ $item->judul }}</h4>
                                @if($item->deskripsi)
                                    <p class="text-slate-200 text-xs mt-1 line-clamp-2">{{ $item->deskripsi }}</p>
                                @endif
                                
                                <form action="{{ route('admin.kaderisasi.galeri.destroy', $item->id) }}" method="POST" class="absolute top-2 right-2" onsubmit="return confirm('Hapus foto ini dari galeri?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 shadow-sm transition-colors">
                                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    @endforeach
                </div>
            @else
                <div class="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <i data-lucide="image" class="w-12 h-12 mx-auto mb-2 text-slate-300"></i>
                    <p>Belum ada foto kegiatan.</p>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
