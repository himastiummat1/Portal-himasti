@extends('layouts.admin')

@section('title', 'Layanan Surat')

@section('content')
<div class="max-w-7xl mx-auto space-y-6">

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Form Pengajuan -->
        <div class="md:col-span-1">
            <div class="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 class="font-heading font-semibold text-lg text-slate-800 mb-4 border-b pb-2">Buat Pengajuan Surat</h3>
                <form action="{{ route('kader.surat.store') }}" method="POST" enctype="multipart/form-data" class="space-y-4">
                    @csrf
                    <div>
                        <label class="block text-sm font-medium text-slate-600 mb-1">Jenis Surat</label>
                        <select name="jenis_surat" required class="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-sm">
                            <option value="Surat Izin">Surat Izin</option>
                            <option value="Surat Peminjaman Alat">Surat Peminjaman Alat</option>
                            <option value="Surat Peminjaman Ruangan">Surat Peminjaman Ruangan</option>
                            <option value="Lainnya">Lainnya...</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-600 mb-1">Perihal / Keterangan</label>
                        <textarea name="perihal" required rows="3" class="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-sm"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-600 mb-1">Upload File (PDF)</label>
                        <input type="file" name="file_pdf" accept="application/pdf" required class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                    </div>
                    <button type="submit" class="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Kirim Pengajuan
                    </button>
                </form>
            </div>
        </div>

        <!-- Tabel Riwayat -->
        <div class="md:col-span-2">
            <div class="glass-panel rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-full">
                <div class="bg-slate-100/80 px-6 py-4 border-b border-slate-200">
                    <h3 class="font-heading font-bold text-slate-800 text-lg">Riwayat Pengajuan Saya</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                                <th class="p-4">Surat</th>
                                <th class="p-4">File</th>
                                <th class="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            @forelse($surats as $surat)
                                <tr class="hover:bg-slate-50/50 transition-colors">
                                    <td class="p-4">
                                        <p class="font-bold text-slate-800">{{ $surat->perihal }}</p>
                                        <p class="text-xs text-slate-500">{{ $surat->jenis_surat }} • {{ $surat->created_at->format('d M, H:i') }}</p>
                                    </td>
                                    <td class="p-4">
                                        <a href="{{ asset('storage/' . $surat->file_pdf) }}" target="_blank" class="text-indigo-600 hover:underline text-sm font-medium">Lihat Dokumen</a>
                                    </td>
                                    <td class="p-4">
                                        @if($surat->status == 'pending')
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Diproses</span>
                                        @elseif($surat->status == 'approved')
                                            <span class="inline-flex flex-col items-start gap-1">
                                                <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Selesai</span>
                                                <span class="text-xs font-mono text-slate-500">No: {{ $surat->nomor_surat }}</span>
                                            </span>
                                        @else
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Ditolak</span>
                                        @endif
                                    </td>
                                </tr>
                            @empty
                                <tr><td colspan="3" class="p-8 text-center text-slate-500">Belum ada riwayat pengajuan surat.</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</div>
@endsection
