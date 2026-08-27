<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Regex Tester
        </h2>
    </x-slot>

    <div class="py-12" x-data="regexTester()">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <a href="{{ route('devtools.index') }}" class="text-sm text-gray-500 mb-4 inline-block">&larr; Kembali ke DevTools</a>
                    
                    <div class="mb-4">
                        <label class="block mb-2 text-sm font-medium">Regular Expression</label>
                        <div class="flex gap-2">
                            <span class="inline-flex items-center px-3 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:border-gray-600">/</span>
                            <input type="text" x-model="pattern" @input="testRegex" class="rounded-none bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="^[a-zA-Z0-9]+$">
                            <span class="inline-flex items-center px-3 bg-gray-200 border border-s-0 border-e-0 border-gray-300 dark:bg-gray-600 dark:border-gray-600">/</span>
                            <input type="text" x-model="flags" @input="testRegex" class="rounded-e-md bg-gray-50 border text-gray-900 block w-20 text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="gmi">
                        </div>
                        <p x-show="error" class="text-red-500 text-sm mt-1" x-text="error"></p>
                    </div>

                    <div class="mb-4">
                        <label class="block mb-2 text-sm font-medium">Test String</label>
                        <textarea x-model="testString" @input="testRegex" rows="5" class="block p-2.5 w-full text-sm rounded-lg border border-gray-300 dark:bg-gray-900 dark:border-gray-700"></textarea>
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium">Match Results</label>
                        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[100px]" x-html="resultHtml"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function regexTester() {
            return {
                pattern: '',
                flags: 'g',
                testString: '',
                error: '',
                resultHtml: 'No match yet.',
                
                testRegex() {
                    if (!this.pattern) {
                        this.resultHtml = 'Masukkan pola regex.';
                        this.error = '';
                        return;
                    }
                    try {
                        let regex = new RegExp(this.pattern, this.flags);
                        this.error = '';
                        if (!this.testString) {
                            this.resultHtml = 'Masukkan string percobaan.';
                            return;
                        }
                        
                        let str = this.testString;
                        let matchResult = str.replace(regex, (m) => {
                            return `<span class="bg-yellow-300 dark:bg-yellow-700 text-black px-1 rounded">${m}</span>`;
                        });
                        
                        if (matchResult === str) {
                            this.resultHtml = 'Tidak ada kecocokan.';
                        } else {
                            this.resultHtml = matchResult.replace(/\n/g, '<br>');
                        }
                    } catch (e) {
                        this.error = e.message;
                        this.resultHtml = 'Invalid Regex.';
                    }
                }
            }
        }
    </script>
</x-app-layout>