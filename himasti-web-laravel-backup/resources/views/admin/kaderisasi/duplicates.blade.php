@extends('layouts.admin')
@section('title', 'Analisis Nama Ganda')

@section('content')
<div class="mb-6 flex items-center justify-between">
    <div>
        <h2 class="text-2xl font-bold text-slate-800">Analisis Data Kader Ganda</h2>
        <p class="text-slate-500 text-sm mt-1">Mendeteksi potensi nama kader yang terinput lebih dari satu kali.</p>
    </div>
    <a href="{{ route('admin.kaderisasi.index') }}" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors">
        <i data-lucide="arrow-left" class="w-4 h-4 inline-block mr-1"></i> Kembali ke Data Kader
    </a>
</div>

<div class="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200">
    @if(count($duplicates) > 0)
        <div class="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 mt-0.5"></i>
            <div>
                <h4 class="font-bold text-amber-800">Ditemukan Duplikasi</h4>
                <p class="text-sm text-amber-700 mt-1">Sistem mendeteksi ada {{ count($duplicates) }} nama kader yang memiliki lebih dari satu akun/data. Silakan periksa tabel di bawah dan hapus data yang tidak relevan di menu Data Kader.</p>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-slate-200 bg-slate-50/50">
                        <th class="py-3 px-4 font-semibold text-sm text-slate-600">Nama Lengkap</th>
                        <th class="py-3 px-4 font-semibold text-sm text-slate-600">Jumlah Kemunculan</th>
                        <th class="py-3 px-4 font-semibold text-sm text-slate-600">Tindakan Rekomendasi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                    @foreach($duplicates as $dup)
                        <tr class="hover:bg-slate-50/50 transition-colors">
                            <td class="py-3 px-4 text-sm font-medium text-slate-800">{{ $dup->name }}</td>
                            <td class="py-3 px-4 text-sm text-slate-600">
                                <span class="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-bold">{{ $dup->count }} Data</span>
                            </td>
                            <td class="py-3 px-4 text-sm text-slate-500">
                                Cari nama "{{ $dup->name }}" di halaman Data Kader lalu hapus salah satunya.
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @else
        <div class="text-center py-12">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <i data-lucide="check-circle" class="w-8 h-8"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-800">Data Bersih!</h3>
            <p class="text-slate-500 mt-2">Tidak ditemukan adanya nama kader yang ganda (terduplikasi) di dalam sistem.</p>
        </div>
    @endif
</div>
@endsection
