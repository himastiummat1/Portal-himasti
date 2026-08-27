@extends('layouts.admin')

@section('title', 'Recycle Bin')

@section('content')
<div class="max-w-7xl mx-auto space-y-8">

    <!-- Header Section -->
    <div>
        <h2 class="text-2xl font-heading font-bold text-slate-800">Recycle Bin (Tempat Sampah)</h2>
        <p class="text-slate-500 mt-1">Kelola data kader dan persuratan yang telah dihapus (Soft Deletes).</p>
    </div>

    <!-- Section: Data Kader -->
    <div class="glass-panel rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div class="bg-slate-100/80 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
            <i data-lucide="graduation-cap" class="w-5 h-5 text-indigo-600"></i>
            <h3 class="font-heading font-bold text-slate-800 text-lg">Data Kader Terhapus</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                        <th class="p-4">NIM / Nama</th>
                        <th class="p-4">Angkatan</th>
                        <th class="p-4">Tanggal Dihapus</th>
                        <th class="p-4 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($trashedKaders as $kader)
                        <tr class="hover:bg-slate-50/50 transition-colors">
                            <td class="p-4">
                                <p class="font-medium text-slate-800">{{ $kader->user->name ?? 'User Tidak Ditemukan' }}</p>
                                <p class="text-xs text-slate-500">{{ $kader->nim }}</p>
                            </td>
                            <td class="p-4 text-slate-600">{{ $kader->angkatan }}</td>
                            <td class="p-4 text-slate-500 text-sm">{{ $kader->deleted_at->format('d M Y, H:i') }}</td>
                            <td class="p-4">
                                <div class="flex items-center justify-center gap-2">
                                    <form action="{{ route('superadmin.trash.restore', ['id' => $kader->id, 'type' => 'kader']) }}" method="POST">
                                        @csrf
                                        <button type="submit" class="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors">
                                            <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Restore
                                        </button>
                                    </form>
                                    <form action="{{ route('superadmin.trash.force_delete', ['id' => $kader->id, 'type' => 'kader']) }}" method="POST" onsubmit="return confirm('Yakin hapus permanen? Data tidak bisa dikembalikan!');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Hapus Permanen
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="4" class="p-6 text-center text-slate-400">Tidak ada data kader di tempat sampah.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- Section: Surat -->
    <div class="glass-panel rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div class="bg-slate-100/80 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
            <i data-lucide="file-text" class="w-5 h-5 text-amber-600"></i>
            <h3 class="font-heading font-bold text-slate-800 text-lg">Data Surat Terhapus</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                        <th class="p-4">Perihal / Jenis</th>
                        <th class="p-4">Pengirim</th>
                        <th class="p-4">Tanggal Dihapus</th>
                        <th class="p-4 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($trashedSurats as $surat)
                        <tr class="hover:bg-slate-50/50 transition-colors">
                            <td class="p-4">
                                <p class="font-medium text-slate-800">{{ $surat->perihal }}</p>
                                <p class="text-xs text-slate-500">{{ $surat->jenis_surat }}</p>
                            </td>
                            <td class="p-4 text-slate-600">{{ $surat->user->name ?? 'User Tidak Ditemukan' }}</td>
                            <td class="p-4 text-slate-500 text-sm">{{ $surat->deleted_at->format('d M Y, H:i') }}</td>
                            <td class="p-4">
                                <div class="flex items-center justify-center gap-2">
                                    <form action="{{ route('superadmin.trash.restore', ['id' => $surat->id, 'type' => 'surat']) }}" method="POST">
                                        @csrf
                                        <button type="submit" class="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors">
                                            <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Restore
                                        </button>
                                    </form>
                                    <form action="{{ route('superadmin.trash.force_delete', ['id' => $surat->id, 'type' => 'surat']) }}" method="POST" onsubmit="return confirm('Yakin hapus permanen file PDF surat?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Hapus Permanen
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="4" class="p-6 text-center text-slate-400">Tidak ada data surat di tempat sampah.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

</div>
@endsection
