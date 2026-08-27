<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Katalog Karya Mahasiswa (Student Project Showcase)
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <form method="GET" action="{{ route('projects.index') }}" class="mb-6 flex gap-2">
                        <input type="text" name="search" placeholder="Cari karya atau pembuat..." value="{{ request('search') }}" class="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:border-gray-700">
                        <x-primary-button type="submit">Cari</x-primary-button>
                    </form>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        @foreach($projects as $project)
                            <div class="border dark:border-gray-700 rounded-lg overflow-hidden flex flex-col">
                                <div class="bg-gray-200 h-48 w-full flex items-center justify-center">
                                    @if($project->screenshot)
                                        <img src="{{ asset('storage/'.$project->screenshot) }}" class="object-cover h-full w-full" alt="Screenshot">
                                    @else
                                        <span class="text-gray-400">No Screenshot</span>
                                    @endif
                                </div>
                                <div class="p-4 flex-1 flex flex-col">
                                    <h3 class="font-bold text-lg">{{ $project->title }}</h3>
                                    <p class="text-sm text-gray-500 mb-2">Oleh: {{ $project->student_name }}</p>
                                    <span class="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-purple-200 dark:text-purple-800 w-max mb-3">
                                        {{ $project->category }}
                                    </span>
                                    <p class="text-sm mb-4 line-clamp-3">{{ $project->description }}</p>
                                    <div class="mt-auto pt-4 border-t dark:border-gray-700 flex justify-between">
                                        @if($project->github_link)
                                        <a href="{{ $project->github_link }}" target="_blank" class="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm">GitHub</a>
                                        @endif
                                        @if($project->demo_link)
                                        <a href="{{ $project->demo_link }}" target="_blank" class="text-blue-600 hover:underline text-sm font-bold">Live Demo</a>
                                        @endif
                                    </div>
                                    <a href="{{ route('projects.show', $project) }}" class="mt-3 text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 py-2 rounded-md text-sm transition">Detail Lengkap</a>
                                </div>
                            </div>
                        @endforeach
                    </div>
                    <div class="mt-6">
                        {{ $projects->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>