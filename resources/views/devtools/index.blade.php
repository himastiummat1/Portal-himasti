<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Developer Utilities Hub
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <a href="{{ route('devtools.json') }}" class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">JSON Formatter & Validator</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400">Format JSON yang berantakan menjadi rapi dan validasi struktur JSON Anda.</p>
                    </a>
                    <a href="{{ route('devtools.regex') }}" class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Regex Tester</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400">Uji regular expression Anda terhadap teks percobaan langsung di browser.</p>
                    </a>
                    <a href="{{ route('devtools.subnet') }}" class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Subnet / IP Calculator</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400">Hitung network, broadcast, host range dari IP dan subnet mask.</p>
                    </a>
                    <a href="{{ route('devtools.markdown') }}" class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Markdown Previewer</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400">Tulis dan lihat pratinjau syntax markdown secara real-time.</p>
                    </a>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>