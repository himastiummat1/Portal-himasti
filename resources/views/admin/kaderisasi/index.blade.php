@extends('layouts.admin')

@section('title', 'Manajemen Data Kader')

@section('content')
<div class="max-w-7xl mx-auto space-y-6">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-heading font-bold text-slate-800">Database Kader</h2>
            <p class="text-slate-500 mt-1">Kelola data keanggotaan dan rekam jejak kaderisasi.</p>
        </div>
        
        <!-- Add Button (Trigger Modal... wait we don't have JS modals so let's make it a simple form block or a card) -->
    </div>

    <!-- Pengecek Duplikasi -->
    <div class="mb-6 flex justify-end">
        <a href="{{ route('admin.kaderisasi.duplicates') }}" class="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 font-medium rounded-lg transition-colors border border-amber-200">
            <i data-lucide="search" class="w-4 h-4"></i> Cek Nama Ganda (Analitik)
        </a>
    </div>

    <!-- Form Import Massal (CSV) -->
    <div class="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200 bg-indigo-50/50">
        <h3 class="font-heading font-semibold text-lg text-slate-800 mb-2 border-b border-slate-300 pb-2 flex items-center gap-2">
            <i data-lucide="upload-cloud" class="w-5 h-5 text-indigo-600"></i> Import Data Massal (Bulk)
        </h3>
        <p class="text-sm text-slate-500 mb-4">Upload file .csv dengan urutan kolom: <b>Nama, Email, NIM, Angkatan</b> (tanpa judul kolom/header di baris pertama). Password akan otomatis dibuat dari NIM.</p>
        
        <form action="{{ route('admin.kaderisasi.import') }}" method="POST" enctype="multipart/form-data" class="flex flex-col sm:flex-row items-center gap-4">
            @csrf
            <input type="file" name="file_csv" accept=".csv,.txt" required class="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200">
            <button type="submit" class="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shrink-0">
                Mulai Import
            </button>
        </form>
    </div>

    <!-- Form Tambah Kader -->
    <div class="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 class="font-heading font-semibold text-lg text-slate-800 mb-4 border-b pb-2">Tambah Kader Baru</h3>
        <form action="{{ route('admin.kaderisasi.store') }}" method="POST" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @csrf
            <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Nama Lengkap</label>
                <input type="text" name="name" required class="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <input type="email" name="email" required class="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">NIM</label>
                <input type="text" name="nim" required class="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Angkatan</label>
                <input type="text" name="angkatan" required placeholder="Contoh: 2021" class="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Status Kaderisasi</label>
                <select name="status_kaderisasi" class="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-sm">
                    <option value="Aktif">Aktif</option>
                    <option value="Pasif">Pasif</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Demisioner">Demisioner</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">No HP</label>
                <input type="text" name="no_hp" class="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-sm">
            </div>
            <div class="md:col-span-2 lg:col-span-3">
                <label class="block text-sm font-medium text-slate-600 mb-1">Keahlian (Skills)</label>
                <input type="text" name="skills" placeholder="Web Dev, Design, Networking..." class="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-sm">
            </div>
            <div class="md:col-span-2 lg:col-span-3 text-right">
                <button type="submit" class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Simpan Kader
                </button>
                <p class="text-xs text-slate-400 mt-2">*Password default akun kader otomatis diset sama dengan NIM.</p>
            </div>
        </form>
    </div>

    <!-- Table Kader -->
    <div class="glass-panel rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-100/50 border-b border-slate-200 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                        <th class="p-4">Identitas Kader</th>
                        <th class="p-4">Angkatan</th>
                        <th class="p-4">Status</th>
                        <th class="p-4">Kontak</th>
                        <th class="p-4 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($kaders as $kader)
                        <tr class="hover:bg-slate-50/50 transition-colors">
                            <td class="p-4">
                                <p class="font-bold text-slate-800">{{ $kader->user->name }}</p>
                                <p class="text-xs text-slate-500">NIM: {{ $kader->nim }}</p>
                            </td>
                            <td class="p-4 text-slate-600">{{ $kader->angkatan }}</td>
                            <td class="p-4">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {{ $kader->status_kaderisasi }}
                                </span>
                            </td>
                            <td class="p-4">
                                <p class="text-sm text-slate-600">{{ $kader->user->email }}</p>
                                <p class="text-xs text-slate-500">{{ $kader->no_hp ?? '-' }}</p>
                            </td>
                            <td class="p-4">
                                <div class="flex items-center justify-center gap-2">
                                    <form action="{{ route('admin.kaderisasi.destroy', $kader->id) }}" method="POST" onsubmit="return confirm('Hapus kader ini ke tempat sampah?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus (Soft Delete)">
                                            <i data-lucide="trash" class="w-4 h-4"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="5" class="p-8 text-center text-slate-500">Tidak ada data kader.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
