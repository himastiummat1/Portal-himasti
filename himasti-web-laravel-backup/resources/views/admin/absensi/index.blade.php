@extends('layouts.admin')

@section('title', 'Manajemen Absensi / Kehadiran')

@section('content')
<div class="max-w-7xl mx-auto space-y-6">

    <!-- Form Input Absensi Manual -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-200">
        <h3 class="font-bold text-lg mb-4 border-b pb-2">Catat Kehadiran Kader (Manual)</h3>
        <form action="{{ route('admin.absensi.store') }}" method="POST" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            @csrf
            <div>
                <label class="block text-xs mb-1 text-slate-500">Pilih Kegiatan (Event)</label>
                <select name="event_id" required class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                    <option value="">- Pilih Event -</option>
                    @foreach($events as $event)
                        <option value="{{ $event->id }}">{{ $event->nama_event }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="block text-xs mb-1 text-slate-500">Anggota / Kader</label>
                <select name="user_id" required class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                    <option value="">- Cari Kader -</option>
                    @foreach($users as $user)
                        <option value="{{ $user->id }}">{{ $user->name }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="block text-xs mb-1 text-slate-500">Status Kehadiran</label>
                <select name="status_kehadiran" required class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                    <option value="hadir">Hadir (Present)</option>
                    <option value="izin">Izin (Permit)</option>
                    <option value="sakit">Sakit (Sick)</option>
                    <option value="alfa">Alfa (No Show)</option>
                </select>
            </div>
            <div>
                <label class="block text-xs mb-1 text-slate-500">Keterangan Tambahan</label>
                <input type="text" name="catatan" placeholder="Opsional" class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
            </div>
            <div class="md:col-span-4 flex justify-end">
                <button type="submit" class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors">Simpan Absen</button>
            </div>
        </form>
    </div>

    <!-- Tabel Data Absensi -->
    <div class="glass-panel rounded-2xl overflow-hidden border border-slate-200">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-50 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    <th class="p-4">Kegiatan</th>
                    <th class="p-4">Kader</th>
                    <th class="p-4">Waktu Hadir</th>
                    <th class="p-4">Status & Catatan</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @foreach($absensis as $absen)
                <tr class="hover:bg-slate-50/50">
                    <td class="p-4">
                        <p class="font-bold text-slate-800">{{ $absen->event->nama_event }}</p>
                    </td>
                    <td class="p-4 text-sm font-medium text-slate-700">{{ $absen->user->name }}</td>
                    <td class="p-4 text-sm text-slate-500">{{ \Carbon\Carbon::parse($absen->waktu_hadir)->format('d M Y, H:i') }}</td>
                    <td class="p-4">
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium 
                            {{ $absen->status_kehadiran == 'hadir' ? 'bg-emerald-100 text-emerald-800' : ($absen->status_kehadiran == 'alfa' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800') }}">
                            {{ strtoupper($absen->status_kehadiran) }}
                        </span>
                        @if($absen->catatan)
                            <p class="text-xs text-slate-400 mt-1">"{{ $absen->catatan }}"</p>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

</div>
@endsection
