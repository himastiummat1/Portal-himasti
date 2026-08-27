<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ $competition->title }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <a href="{{ route('competitions.index') }}" class="text-sm text-gray-500 mb-6 inline-block">&larr; Kembali ke Info Event</a>
                    
                    <div class="flex flex-col md:flex-row gap-8">
                        <div class="w-full md:w-1/3">
                            @if($competition->poster)
                                @if(Str::startsWith($competition->poster, 'http'))
                                    <img src="{{ $competition->poster }}" class="w-full rounded-lg shadow-sm" alt="Poster {{ $competition->title }}">
                                @else
                                    <img src="{{ asset('storage/'.$competition->poster) }}" class="w-full rounded-lg shadow-sm" alt="Poster {{ $competition->title }}">
                                @endif
                            @else
                                <img src="https://picsum.photos/seed/lomba-{{ $competition->id }}/800/600" class="w-full rounded-lg shadow-sm" alt="Poster Placeholder">
                            @endif
                            
                            <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <h4 class="font-bold mb-2">Ringkasan</h4>
                                <ul class="space-y-2 text-sm">
                                    <li><strong>Jenis:</strong> <span class="capitalize">{{ $competition->type }}</span></li>
                                    <li><strong>Penyelenggara:</strong> {{ $competition->organizer }}</li>
                                    <li><strong>Deadline:</strong> {{ $competition->deadline ? \Carbon\Carbon::parse($competition->deadline)->format('d M Y') : 'Tidak ditentukan' }}</li>
                                </ul>
                                @if($competition->link)
                                    <a href="{{ $competition->link }}" target="_blank" class="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded transition">
                                        Kunjungi Link Daftar
                                    </a>
                                @endif
                            </div>
                        </div>
                        
                        <div class="w-full md:w-2/3">
                            <h3 class="text-3xl font-bold mb-6">{{ $competition->title }}</h3>
                            <div class="prose dark:prose-invert max-w-none">
                                <h4 class="text-xl font-semibold mb-2">Deskripsi</h4>
                                <p class="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">{{ $competition->description ?: 'Tidak ada deskripsi yang tersedia.' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>