@extends('layouts.admin')

@section('title', 'Manajemen Keuangan & Uang Kas')

@section('content')
<div class="max-w-7xl mx-auto space-y-6">

    <!-- Dashboard Saldo -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl border-emerald-500 border-l-4">
            <p class="text-sm text-slate-500 mb-1">Total Pemasukan</p>
            <h3 class="text-2xl font-bold text-emerald-600">Rp {{ number_format($totalPemasukan, 0, ',', '.') }}</h3>
        </div>
        <div class="glass-panel p-6 rounded-2xl border-rose-500 border-l-4">
            <p class="text-sm text-slate-500 mb-1">Total Pengeluaran</p>
            <h3 class="text-2xl font-bold text-rose-600">Rp {{ number_format($totalPengeluaran, 0, ',', '.') }}</h3>
        </div>
        <div class="glass-panel p-6 rounded-2xl border-blue-500 border-l-4">
            <p class="text-sm text-slate-500 mb-1">Saldo Akhir</p>
            <h3 class="text-2xl font-bold text-blue-600">Rp {{ number_format($saldo, 0, ',', '.') }}</h3>
        </div>
    </div>

    <!-- Form Input Keuangan -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-200">
        <h3 class="font-bold text-lg mb-4 border-b pb-2">Catat Transaksi Baru</h3>
        <form action="{{ route('admin.keuangan.store') }}" method="POST" class="grid grid-cols-1 md:grid-cols-5 gap-4">
            @csrf
            <div>
                <label class="block text-xs mb-1 text-slate-500">Tipe Transaksi</label>
                <select name="tipe" class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                    <option value="pemasukan">Pemasukan (Uang Kas dll)</option>
                    <option value="pengeluaran">Pengeluaran (Beli Alat dll)</option>
                </select>
            </div>
            <div>
                <label class="block text-xs mb-1 text-slate-500">Tanggal</label>
                <input type="date" name="tanggal" required value="{{ date('Y-m-d') }}" class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
            </div>
            <div>
                <label class="block text-xs mb-1 text-slate-500">Nominal (Rp)</label>
                <input type="number" name="nominal" required min="1" class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
            </div>
            <div class="md:col-span-2">
                <label class="block text-xs mb-1 text-slate-500">Keterangan / Rincian</label>
                <input type="text" name="keterangan" required class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
            </div>
            <div class="md:col-span-4">
                <label class="block text-xs mb-1 text-slate-500">Terkait dengan Pengurus (opsional - untuk uang kas)</label>
                <select name="user_id" class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                    <option value="">- Tanpa Anggota Terkait -</option>
                    @foreach($users as $user)
                        <option value="{{ $user->id }}">{{ $user->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="md:col-span-1 flex items-end">
                <button type="submit" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">Simpan Data</button>
            </div>
        </form>
    </div>

    <!-- Tabel Data Keuangan -->
    <div class="glass-panel rounded-2xl overflow-hidden border border-slate-200">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-50 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    <th class="p-4">Tanggal</th>
                    <th class="p-4">Tipe</th>
                    <th class="p-4">Nominal</th>
                    <th class="p-4">Keterangan / Terkait</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @foreach($keuangans as $keu)
                <tr class="hover:bg-slate-50/50">
                    <td class="p-4 text-sm text-slate-600">{{ \Carbon\Carbon::parse($keu->tanggal)->format('d M Y') }}</td>
                    <td class="p-4">
                        @if($keu->tipe == 'pemasukan')
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Masuk</span>
                        @else
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">Keluar</span>
                        @endif
                    </td>
                    <td class="p-4 font-semibold text-slate-700">Rp {{ number_format($keu->nominal, 0, ',', '.') }}</td>
                    <td class="p-4">
                        <p class="text-sm font-medium text-slate-800">{{ $keu->keterangan }}</p>
                        @if($keu->user)
                            <p class="text-xs text-slate-500">Anggota: {{ $keu->user->name }}</p>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

</div>
@endsection
