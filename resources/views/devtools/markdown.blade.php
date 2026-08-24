<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Markdown Previewer
        </h2>
    </x-slot>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100 text-center py-20">
                    <a href="{{ route('devtools.index') }}" class="text-sm text-gray-500 mb-4 inline-block">&larr; Kembali ke DevTools</a>
                    <h3 class="text-2xl font-bold mb-4">Fitur Markdown Previewer Akan Segera Hadir!</h3>
                    <p>Editor markdown real-time akan segera tersedia di sini.</p>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>