<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Kumpulan Kode: {{ $category }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <a href="{{ route('modules.index') }}" class="text-sm text-gray-500 mb-6 inline-block">&larr; Kembali ke Daftar Bahasa</a>
                    
                    <h3 class="text-3xl font-bold mb-6">Snippet {{ $category }}</h3>
                    
                    <div class="space-y-8">
                        @foreach($modules as $module)
                            <div class="border dark:border-gray-700 p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 class="text-xl font-bold">{{ $module->title }}</h4>
                                        <p class="text-sm text-gray-500 mt-1">{{ $module->description }}</p>
                                    </div>
                                    <a href="{{ route('modules.download', $module->id) }}" class="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 text-sm rounded inline-flex items-center">
                                        <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                                        <span>Unduh</span>
                                    </a>
                                </div>
                                
                                <div class="relative group mt-4">
                                    <pre class="bg-[#1e1e1e] text-white p-4 rounded-lg overflow-x-auto text-sm shadow-inner"><code id="code-block-{{ $module->id }}" class="language-{{ strtolower($module->category) }}">{{ $module->code_snippet }}</code></pre>
                                    <button onclick="copyCode('code-block-{{ $module->id }}')" class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">Copy</button>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Highlight.js for Syntax Highlighting -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', (event) => {
            document.querySelectorAll('pre code').forEach((el) => {
                hljs.highlightElement(el);
            });
        });

        function copyCode(elementId) {
            var code = document.getElementById(elementId).innerText;
            navigator.clipboard.writeText(code).then(function() {
                alert('Kode berhasil disalin!');
            }, function(err) {
                console.error('Gagal menyalin: ', err);
            });
        }
    </script>
</x-app-layout>