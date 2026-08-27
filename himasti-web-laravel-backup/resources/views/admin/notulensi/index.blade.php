@extends('layouts.admin')
@section('title', 'Rapat & Notulensi')

@section('content')
<div class="mb-6 flex justify-between items-center">
    <h2 class="text-2xl font-bold text-slate-800"><i data-lucide="file-text" class="w-6 h-6 inline-block mr-2"></i> Rapat & Notulensi</h2>
</div>

<div class="grid md:grid-cols-3 gap-6">
    <div class="md:col-span-1">
        <div class="glass-panel p-6 rounded-2xl border border-slate-200">
            <h3 class="font-bold text-lg mb-4">Tambah Data Baru</h3>
            <form action="{{ route('admin.notulensi.store') }}" method="POST">
                @csrf
                
            <div class='mb-3'><label class='text-sm font-medium'>Agenda Rapat</label><input type='text' name='agenda' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Tanggal</label><input type='date' name='tanggal' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Pemimpin Rapat</label><input type='text' name='pemimpin_rapat' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Jumlah Hadir</label><input type='number' name='jumlah_hadir' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Hasil/Kesimpulan Rapat</label><textarea name='hasil_rapat' required class='w-full rounded-lg border-slate-300' rows='4'></textarea></div>
        
                <button type="submit" class="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Simpan Data</button>
            </form>
        </div>
    </div>
    <div class="md:col-span-2">
        <div class="glass-panel p-6 rounded-2xl border border-slate-200 overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b text-slate-600">
                        <th class='py-2'>Agenda</th><th class='py-2'>Tanggal</th><th class='py-2'>Hadir</th><th class='py-2'>Pemimpin</th>
                        <th class="py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    @foreach($items as $item)
                    <tr class="border-b hover:bg-slate-50">
                        <td class='py-2'>{{ $item->agenda }}</td><td class='py-2'>{{ $item->tanggal }}</td><td class='py-2'>{{ $item->jumlah_hadir }} Org</td><td class='py-2'>{{ $item->pemimpin_rapat }}</td>
                        <td class="py-2">
                            <form action="{{ route('admin.notulensi.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus?');">
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
