<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            JSON Formatter & Validator
        </h2>
    </x-slot>

    <div class="py-12" x-data="{ input: '', output: '', error: '' }">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <a href="{{ route('devtools.index') }}" class="text-sm text-gray-500 mb-4 inline-block">&larr; Kembali ke DevTools</a>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block mb-2 text-sm font-medium">Input JSON:</label>
                            <textarea x-model="input" rows="15" class="block p-2.5 w-full text-sm rounded-lg border border-gray-300 dark:bg-gray-900 dark:border-gray-700 font-mono"></textarea>
                            <button @click="
                                try {
                                    output = JSON.stringify(JSON.parse(input), null, 4);
                                    error = '';
                                } catch (e) {
                                    error = e.message;
                                    output = '';
                                }
                            " class="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Format & Validasi</button>
                        </div>
                        <div>
                            <label class="block mb-2 text-sm font-medium">Output JSON:</label>
                            <textarea x-model="output" readonly rows="15" class="block p-2.5 w-full text-sm rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 font-mono"></textarea>
                            <div x-show="error" class="mt-2 text-red-500 text-sm font-bold" x-text="error"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>