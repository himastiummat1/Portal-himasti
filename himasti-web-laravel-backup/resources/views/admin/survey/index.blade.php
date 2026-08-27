@extends('layouts.admin')
@section('title', 'Survey & Polling')

@section('content')
<div class="mb-6 flex justify-between items-center">
    <h2 class="text-2xl font-bold text-slate-800"><i data-lucide="bar-chart-2" class="w-6 h-6 inline-block mr-2"></i> Survey & Polling</h2>
</div>

<div class="grid md:grid-cols-3 gap-6">
    <div class="md:col-span-1">
        <div class="glass-panel p-6 rounded-2xl border border-slate-200">
            <h3 class="font-bold text-lg mb-4">Tambah Data Baru</h3>
            <form action="{{ route('admin.survey.store') }}" method="POST">
                @csrf
                
            <div class='mb-3'><label class='text-sm font-medium'>Judul Survey/Polling</label><input type='text' name='judul' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Link Google Form</label><input type='url' name='link_gform' required placeholder='https://forms.gle/...' class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Target Responden (Jumlah)</label><input type='number' name='target_responden' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Status</label><select name='status' class='w-full rounded-lg border-slate-300'><option>Aktif</option><option>Ditutup</option></select></div>
            <div class='mb-3'><label class='text-sm font-medium'>Deskripsi Tujuan</label><textarea name='deskripsi' class='w-full rounded-lg border-slate-300'></textarea></div>
        
                <button type="submit" class="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Simpan Data</button>
            </form>
        </div>
    </div>
    <div class="md:col-span-2">
        <div class="glass-panel p-6 rounded-2xl border border-slate-200 overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b text-slate-600">
                        <th class='py-2'>Judul Survey</th><th class='py-2'>Link</th><th class='py-2'>Target</th><th class='py-2'>Status</th>
                        <th class="py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    @foreach($items as $item)
                    <tr class="border-b hover:bg-slate-50">
                        <td class='py-2'>{{ $item->judul }}</td><td class='py-2'><a href='{{ $item->link_gform }}' target='_blank' class='text-blue-500 underline'>Buka Form</a></td><td class='py-2'>{{ $item->target_responden }}</td><td class='py-2'>{{ $item->status }}</td>
                        <td class="py-2">
                            <form action="{{ route('admin.survey.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus?');">
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
