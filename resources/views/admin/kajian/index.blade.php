@extends('layouts.admin')
@section('title', 'Kajian & Dakwah')

@section('content')
<div class="mb-6 flex justify-between items-center">
    <h2 class="text-2xl font-bold text-slate-800"><i data-lucide="book-open" class="w-6 h-6 inline-block mr-2"></i> Kajian & Dakwah</h2>
</div>

<div class="grid md:grid-cols-3 gap-6">
    <div class="md:col-span-1">
        <div class="glass-panel p-6 rounded-2xl border border-slate-200">
            <h3 class="font-bold text-lg mb-4">Tambah Data Baru</h3>
            <form action="{{ route('admin.kajian.store') }}" method="POST">
                @csrf
                
            <div class='mb-3'><label class='text-sm font-medium'>Tema Kajian</label><input type='text' name='tema' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Pemateri / Ustadz</label><input type='text' name='pemateri' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Tanggal</label><input type='date' name='tanggal' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Lokasi</label><input type='text' name='lokasi' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Status</label><select name='status' class='w-full rounded-lg border-slate-300'><option>Akan Datang</option><option>Selesai</option></select></div>
            <div class='mb-3'><label class='text-sm font-medium'>Deskripsi Singkat</label><textarea name='deskripsi' required class='w-full rounded-lg border-slate-300'></textarea></div>
        
                <button type="submit" class="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Simpan Data</button>
            </form>
        </div>
    </div>
    <div class="md:col-span-2">
        <div class="glass-panel p-6 rounded-2xl border border-slate-200 overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b text-slate-600">
                        <th class='py-2'>Tema</th><th class='py-2'>Pemateri</th><th class='py-2'>Tanggal</th><th class='py-2'>Status</th>
                        <th class="py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    @foreach($items as $item)
                    <tr class="border-b hover:bg-slate-50">
                        <td class='py-2'>{{ $item->tema }}</td><td class='py-2'>{{ $item->pemateri }}</td><td class='py-2'>{{ $item->tanggal }}</td><td class='py-2'>{{ $item->status }}</td>
                        <td class="py-2">
                            <form action="{{ route('admin.kajian.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus?');">
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
