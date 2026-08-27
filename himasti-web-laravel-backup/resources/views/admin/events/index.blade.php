@extends('layouts.admin')

@section('title', 'Manajemen Event & Kepanitiaan')

@section('content')
<div class="max-w-7xl mx-auto space-y-6">

    <!-- Form Input Event -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-200">
        <h3 class="font-bold text-lg mb-4 border-b pb-2">Buat Event Baru</h3>
        <form action="{{ route('admin.events.store') }}" method="POST" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            @csrf
            <div class="md:col-span-2">
                <label class="block text-xs mb-1 text-slate-500">Nama Event</label>
                <input type="text" name="nama_event" required class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
            </div>
            <div>
                <label class="block text-xs mb-1 text-slate-500">Status Awal</label>
                <select name="status" class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                    <option value="draft">Draft (Belum Dibuka)</option>
                    <option value="published">Published (Buka Pendaftaran)</option>
                    <option value="completed">Completed (Selesai)</option>
                </select>
            </div>
            <div class="md:col-span-3">
                <label class="block text-xs mb-1 text-slate-500">Deskripsi / Detail Event</label>
                <textarea name="deskripsi" required rows="2" class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"></textarea>
            </div>
            <div>
                <label class="block text-xs mb-1 text-slate-500">Tanggal Mulai</label>
                <input type="datetime-local" name="tanggal_mulai" required class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
            </div>
            <div>
                <label class="block text-xs mb-1 text-slate-500">Tanggal Selesai</label>
                <input type="datetime-local" name="tanggal_selesai" required class="w-full text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
            </div>
            <div class="md:col-span-4 flex justify-end">
                <button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">Buat Event</button>
            </div>
        </form>
    </div>

    <!-- Tabel Data Event -->
    <div class="glass-panel rounded-2xl overflow-hidden border border-slate-200">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-50 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    <th class="p-4">Event</th>
                    <th class="p-4">Jadwal</th>
                    <th class="p-4">Status & Pendaftar</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @foreach($events as $event)
                <tr class="hover:bg-slate-50/50">
                    <td class="p-4">
                        <p class="font-bold text-slate-800">{{ $event->nama_event }}</p>
                        <p class="text-xs text-slate-500 truncate max-w-md">{{ $event->deskripsi }}</p>
                    </td>
                    <td class="p-4 text-sm text-slate-600">
                        <p>Mulai: {{ \Carbon\Carbon::parse($event->tanggal_mulai)->format('d M Y H:i') }}</p>
                        <p>Selesai: {{ \Carbon\Carbon::parse($event->tanggal_selesai)->format('d M Y H:i') }}</p>
                    </td>
                    <td class="p-4">
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium 
                            {{ $event->status == 'published' ? 'bg-blue-100 text-blue-800' : ($event->status == 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600') }}">
                            {{ strtoupper($event->status) }}
                        </span>
                        <p class="text-xs font-semibold text-slate-500 mt-2"><i data-lucide="users" class="w-3 h-3 inline"></i> {{ $event->registrations_count }} Terdaftar</p>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

</div>
@endsection
