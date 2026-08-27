<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ $project->title }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <a href="{{ route('projects.index') }}" class="text-sm text-gray-500 mb-6 inline-block">&larr; Kembali ke Katalog Karya</a>
                    
                    <h3 class="text-3xl font-bold mb-2">{{ $project->title }}</h3>
                    <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">Karya dari: <strong>{{ $project->student_name }}</strong></p>
                    
                    <div class="mb-6">
                        <span class="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded dark:bg-purple-200 dark:text-purple-800">
                            Kategori: {{ $project->category }}
                        </span>
                    </div>

                    @if($project->screenshot)
                        <div class="mb-8 rounded-lg overflow-hidden border dark:border-gray-700 shadow-sm">
                            <img src="{{ asset('storage/'.$project->screenshot) }}" class="w-full h-auto" alt="Screenshot {{ $project->title }}">
                        </div>
                    @else
                        <div class="mb-8 bg-gray-200 dark:bg-gray-700 h-64 flex items-center justify-center rounded-lg">
                            <span class="text-gray-500">Tidak ada tangkapan layar tersedia</span>
                        </div>
                    @endif

                    <div class="prose dark:prose-invert max-w-none mb-8">
                        <h4 class="text-xl font-semibold mb-2">Deskripsi Proyek</h4>
                        <p class="whitespace-pre-line text-gray-700 dark:text-gray-300">{{ $project->description ?: 'Tidak ada deskripsi.' }}</p>
                    </div>

                    <div class="flex gap-4 border-t dark:border-gray-700 pt-6">
                        @if($project->demo_link)
                            <a href="{{ $project->demo_link }}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-center flex-1 transition">
                                Buka Live Demo
                            </a>
                        @endif
                        @if($project->github_link)
                            <a href="{{ $project->github_link }}" target="_blank" class="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg text-center flex-1 transition">
                                Source Code (GitHub)
                            </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>