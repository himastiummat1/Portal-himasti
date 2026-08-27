@extends('layouts.admin')
@section('title', 'Merchandise')

@section('content')
<div class="mb-6 flex justify-between items-center">
    <h2 class="text-2xl font-bold text-slate-800"><i data-lucide="shopping-bag" class="w-6 h-6 inline-block mr-2"></i> Merchandise</h2>
</div>

<div class="grid md:grid-cols-3 gap-6">
    <div class="md:col-span-1">
        <div class="glass-panel p-6 rounded-2xl border border-slate-200">
            <h3 class="font-bold text-lg mb-4">Tambah Data Baru</h3>
            <form action="{{ route('admin.merchandise.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                
            <div class='mb-3'><label class='text-sm font-medium'>Nama Barang / Produk</label><input type='text' name='nama_barang' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Foto Produk / Barang</label><input type='file' name='gambar' accept="image/*" class='w-full rounded-lg border-slate-300 p-2 border'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Harga Jual (Rp)</label><input type='number' name='harga' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Stok Tersedia</label><input type='number' name='stok' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Deskripsi Produk</label><textarea name='deskripsi' required class='w-full rounded-lg border-slate-300'></textarea></div>
        
                <button type="submit" class="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Simpan Data</button>
            </form>
        </div>
    </div>
    <div class="md:col-span-2">
        <div class="glass-panel p-6 rounded-2xl border border-slate-200 overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b text-slate-600">
                        <th class='py-2 w-16'>Foto</th>
                        <th class='py-2'>Nama Produk</th><th class='py-2'>Harga</th><th class='py-2'>Stok</th>
                        <th class="py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    @foreach($items as $item)
                    <tr class="border-b hover:bg-slate-50">
                        <td class='py-2'>
                            @if($item->gambar)
                                <img src="{{ asset('storage/' . $item->gambar) }}" class="w-12 h-12 object-cover rounded-md shadow-sm">
                            @else
                                <div class="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 text-xs shadow-sm">No img</div>
                            @endif
                        </td>
                        <td class='py-2'>{{ $item->nama_barang }}</td><td class='py-2'>Rp {{ number_format($item->harga, 0, ',', '.') }}</td><td class='py-2'>{{ $item->stok }} Pcs</td>
                        <td class="py-2">
                            <form action="{{ route('admin.merchandise.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-500 hover:text-red-700 font-medium"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            </form>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
