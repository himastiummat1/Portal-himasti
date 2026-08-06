@extends('layouts.admin')

@section('title', 'Manajemen Pengurus & Akun')

@section('content')
<div class="max-w-7xl mx-auto space-y-6">

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-heading font-bold text-slate-800">Daftar Pengguna Sistem</h2>
            <p class="text-slate-500 mt-1">Kelola seluruh akun pengurus, kader, dan penetapan role (hak akses).</p>
        </div>
        
        <form action="{{ route('superadmin.users') }}" method="GET" class="flex items-center gap-2">
            <div class="relative flex items-center">
                <i data-lucide="search" class="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none"></i>
                <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari nama atau email..." class="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 w-full sm:w-80 text-sm text-slate-700 leading-normal">
            </div>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Cari</button>
            @if(request()->has('search') && request('search') != '')
                <a href="{{ route('superadmin.users') }}" class="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300 transition-colors">Reset</a>
            @endif
        </form>
    </div>

    <!-- Table Section -->
    <div class="glass-panel rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-100/50 border-b border-slate-200 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                        <th class="p-4">Info Pengguna</th>
                        <th class="p-4">Email</th>
                        <th class="p-4">Role Sistem</th>
                        <th class="p-4">Status Kader</th>
                        <th class="p-4 text-center">Ubah Akses & Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($users as $user)
                        <tr class="hover:bg-slate-50/50 transition-colors">
                            <td class="p-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                        {{ substr($user->name, 0, 1) }}
                                    </div>
                                    <div>
                                        <p class="font-medium text-slate-800">{{ $user->name }}</p>
                                        <p class="text-xs text-slate-400">ID: {{ $user->id }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="p-4 text-slate-600">{{ $user->email }}</td>
                            <td class="p-4">
                                @foreach($user->roles as $role)
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {{ str_replace('_', ' ', Str::title($role->name)) }}
                                    </span>
                                @endforeach
                                @if($user->roles->isEmpty())
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">Belum ada role</span>
                                @endif
                            </td>
                            <td class="p-4">
                                @php
                                    $status = $user->dataKader->status_kaderisasi ?? 'Belum Diisi';
                                    $statusColor = match($status) {
                                        'Kader Aktif', 'Kader' => 'bg-emerald-100 text-emerald-800',
                                        'Tidak Aktif' => 'bg-amber-100 text-amber-800',
                                        'Demisioner', 'Alumni' => 'bg-purple-100 text-purple-800',
                                        default => 'bg-slate-100 text-slate-600'
                                    };
                                @endphp
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $statusColor }}">
                                    {{ $status }}
                                </span>
                            </td>
                            <td class="p-4">
                                <div class="flex items-center justify-center gap-3">
                                    
                                    <!-- Form Ubah Role & Status -->
                                    <form action="{{ route('superadmin.users.assign_role', $user->id) }}" method="POST" class="flex flex-col xl:flex-row items-center gap-2">
                                        @csrf
                                        @method('PUT')
                                        <select name="role" class="text-sm border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-600 py-1.5 pl-3 pr-8 w-32">
                                            @foreach($roles as $role)
                                                <option value="{{ $role->name }}" {{ $user->hasRole($role->name) ? 'selected' : '' }}>
                                                    {{ str_replace('_', ' ', Str::title($role->name)) }}
                                                </option>
                                            @endforeach
                                        </select>
                                        <select name="status_kaderisasi" class="text-sm border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-600 py-1.5 pl-3 pr-8 w-32">
                                            @php $currentStatus = $user->dataKader->status_kaderisasi ?? ''; @endphp
                                            <option value="Kader" {{ $currentStatus == 'Kader' || $currentStatus == 'Kader Aktif' ? 'selected' : '' }}>Kader Aktif</option>
                                            <option value="Tidak Aktif" {{ $currentStatus == 'Tidak Aktif' ? 'selected' : '' }}>Tidak Aktif</option>
                                            <option value="Demisioner" {{ $currentStatus == 'Demisioner' ? 'selected' : '' }}>Demisioner</option>
                                        </select>
                                        <button type="submit" class="px-3 py-1.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                                            Save
                                        </button>
                                    </form>

                                    <!-- Tombol Impersonate -->
                                    @if(Auth::id() !== $user->id)
                                        <a href="{{ route('superadmin.impersonate', $user->id) }}" class="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="Login sebagai user ini">
                                            <i data-lucide="log-in" class="w-5 h-5"></i>
                                        </a>
                                    @endif

                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="p-8 text-center text-slate-500">
                                Tidak ada data pengguna.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        @if($users->hasPages())
        <div class="p-4 border-t border-slate-200 bg-slate-50/50">
            {{ $users->links() }}
        </div>
        @endif
    </div>
</div>
@endsection
