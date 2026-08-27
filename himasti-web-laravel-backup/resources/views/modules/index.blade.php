<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Bank Modul Materi Kuliah IT
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <form method="GET" action="{{ route('modules.index') }}" class="mb-6 flex gap-2">
                        <input type="text" name="search" placeholder="Cari bahasa atau teknologi..." value="{{ $search }}" class="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:border-gray-700">
                        <x-primary-button type="submit">Cari</x-primary-button>
                    </form>

                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        @forelse($categoryData as $cat)
                            <a href="{{ route('modules.show', $cat['name']) }}" class="block border dark:border-gray-700 p-6 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <h3 class="font-bold text-2xl mb-2">{{ $cat['name'] }}</h3>
                                <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                    {{ $cat['count'] }} Snippet
                                </span>
                            </a>
                        @empty
                            <div class="col-span-full text-center text-gray-500 py-8">
                                Kategori atau modul tidak ditemukan.
                            </div>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>