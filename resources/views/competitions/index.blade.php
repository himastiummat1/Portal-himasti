<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Info Lomba, Hackathon & Sertifikasi Gratis
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <form method="GET" action="{{ route('competitions.index') }}" class="mb-6 flex gap-2">
                        <input type="text" name="search" placeholder="Cari event..." value="{{ request('search') }}" class="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:border-gray-700">
                        <x-primary-button type="submit">Cari</x-primary-button>
                    </form>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        @foreach($competitions as $competition)
                            <div class="flex border dark:border-gray-700 rounded-lg overflow-hidden flex-col sm:flex-row">
                                <div class="w-full sm:w-1/3 bg-gray-200 min-h-[150px] flex items-center justify-center">
                                    @if($competition->poster)
                                        @if(Str::startsWith($competition->poster, 'http'))
                                            <img src="{{ $competition->poster }}" class="object-cover h-full w-full" alt="Poster">
                                        @else
                                            <img src="{{ asset('storage/'.$competition->poster) }}" class="object-cover h-full w-full" alt="Poster">
                                        @endif
                                    @else
                                        <img src="https://picsum.photos/seed/lomba-{{ $competition->id }}/400/300" class="object-cover h-full w-full" alt="Poster Placeholder">
                                    @endif
                                </div>
                                <div class="p-4 w-full sm:w-2/3 flex flex-col">
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">
                                            {{ strtoupper($competition->type) }}
                                        </span>
                                        @if($competition->deadline)
                                        <span class="text-xs text-red-500 font-bold whitespace-nowrap">
                                            Batas: {{ \Carbon\Carbon::parse($competition->deadline)->format('d M Y') }}
                                        </span>
                                        @endif
                                    </div>
                                    <h3 class="font-bold text-lg mb-1">{{ $competition->title }}</h3>
                                    <p class="text-sm text-gray-500 mb-2">Penyelenggara: {{ $competition->organizer }}</p>
                                    <p class="text-sm line-clamp-2 mb-4 flex-1">{{ $competition->description }}</p>
                                    <a href="{{ route('competitions.show', $competition) }}" class="text-blue-600 hover:underline text-sm font-medium">Baca Selengkapnya &rarr;</a>
                                </div>
                            </div>
                        @endforeach
                    </div>
                    <div class="mt-6">
                        {{ $competitions->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>