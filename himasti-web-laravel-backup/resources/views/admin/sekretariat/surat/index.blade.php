@extends('layouts.admin')

@section('title', 'Verifikasi Surat Masuk & Keluar')

@section('content')
<div class="max-w-7xl mx-auto space-y-6">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-heading font-bold text-slate-800">Antrean Persuratan</h2>
            <p class="text-slate-500 mt-1">Verifikasi pengajuan surat dari kader, berikan nomor surat resmi, atau tolak.</p>
        </div>
    </div>

    <!-- Table Surat -->
    <div class="glass-panel rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-100/50 border-b border-slate-200 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                        <th class="p-4">Detail Surat</th>
                        <th class="p-4">Pengirim</th>
                        <th class="p-4">File</th>
                        <th class="p-4">Status & No Surat</th>
                        <th class="p-4 text-center">Aksi (Approve/Reject)</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($surats as $surat)
                        <tr class="hover:bg-slate-50/50 transition-colors">
                            <td class="p-4">
                                <p class="font-bold text-slate-800">{{ $surat->perihal }}</p>
                                <p class="text-xs text-slate-500">Jenis: {{ $surat->jenis_surat }}</p>
                                <p class="text-xs text-slate-400 mt-1">{{ $surat->created_at->format('d M Y, H:i') }}</p>
                            </td>
                            <td class="p-4">
                                <p class="text-sm font-medium text-slate-700">{{ $surat->user->name }}</p>
                            </td>
                            <td class="p-4">
                                <a href="{{ asset('storage/' . $surat->file_pdf) }}" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-medium transition-colors">
                                    <i data-lucide="file-down" class="w-4 h-4"></i> Lihat PDF
                                </a>
                            </td>
                            <td class="p-4">
                                @if($surat->status == 'pending')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Menunggu</span>
                                @elseif($surat->status == 'approved')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Disetujui</span>
                                    <p class="text-xs text-slate-600 mt-1 font-mono">{{ $surat->nomor_surat }}</p>
                                @else
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Ditolak</span>
                                @endif
                            </td>
                            <td class="p-4">
                                @if($surat->status == 'pending')
                                    <div class="flex flex-col gap-2">
                                        <!-- Approve Form -->
                                        <form action="{{ route('admin.sekretariat.surat.approve', $surat->id) }}" method="POST" class="flex gap-2">
                                            @csrf @method('PUT')
                                            <input type="text" name="nomor_surat" required placeholder="Input No. Surat" class="w-full text-xs rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 py-1 px-2">
                                            <button type="submit" class="px-2 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors" title="Setujui">
                                                <i data-lucide="check" class="w-4 h-4"></i>
                                            </button>
                                        </form>
                                        
                                        <!-- Reject Form -->
                                        <form action="{{ route('admin.sekretariat.surat.reject', $surat->id) }}" method="POST" class="w-full">
                                            @csrf @method('PUT')
                                            <button type="submit" class="w-full flex items-center justify-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-xs font-medium">
                                                <i data-lucide="x" class="w-3 h-3"></i> Tolak Surat
                                            </button>
                                        </form>
                                    </div>
                                @else
                                    <p class="text-xs text-center text-slate-400">Telah diverifikasi</p>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="5" class="p-8 text-center text-slate-500">Tidak ada pengajuan surat.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
