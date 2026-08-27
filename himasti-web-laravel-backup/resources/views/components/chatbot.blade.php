        <!-- Chatbot Groq UI -->
        <div id="ai-chat-widget" class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <!-- Chat Box (Hidden by default) -->
            <div id="ai-chat-box" class="hidden w-80 sm:w-96 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden mb-4 transition-all duration-300">
                <!-- Header -->
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md z-10">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                            <h3 class="font-bold text-sm">HIMASTI AI</h3>
                            <p class="text-[10px] text-blue-100">Powered by Groq & LLaMA 3</p>
                        </div>
                    </div>
                    <button onclick="toggleChat()" class="text-white/70 hover:text-white transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <!-- Messages Area -->
                <div id="ai-chat-messages" class="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 flex flex-col gap-3 text-sm">
                    <div class="flex justify-start">
                        <div class="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                            Halo! Saya asisten AI HIMASTI. Ada yang bisa saya bantu soal IT, koding, atau info himpunan? 👋
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                    <form id="ai-chat-form" class="flex items-center gap-2" onsubmit="sendChatMessage(event)">
                        <input type="text" id="ai-chat-input" class="flex-1 bg-gray-100 dark:bg-gray-700 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0 rounded-full px-4 py-2 text-sm text-gray-800 dark:text-gray-100 transition-all" placeholder="Tanya sesuatu..." autocomplete="off">
                        <button type="submit" class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 shadow-md transition-colors shrink-0 disabled:opacity-50" id="ai-chat-submit">
                            <svg class="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </form>
                </div>
            </div>

            <!-- Floating Button -->
            <button onclick="toggleChat()" class="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 group">
                <svg class="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            </button>
        </div>

        <script>
            function toggleChat() {
                const box = document.getElementById('ai-chat-box');
                if(box.classList.contains('hidden')) {
                    box.classList.remove('hidden');
                    document.getElementById('ai-chat-input').focus();
                } else {
                    box.classList.add('hidden');
                }
            }

            async function sendChatMessage(e) {
                e.preventDefault();
                const input = document.getElementById('ai-chat-input');
                const message = input.value.trim();
                const submitBtn = document.getElementById('ai-chat-submit');
                const messagesArea = document.getElementById('ai-chat-messages');
                
                if(!message) return;
                
                // Add user message
                messagesArea.innerHTML += `
                    <div class="flex justify-end animate-fade-in-up">
                        <div class="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-none shadow-sm max-w-[85%]">
                            ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                        </div>
                    </div>
                `;
                
                input.value = '';
                submitBtn.disabled = true;
                messagesArea.scrollTop = messagesArea.scrollHeight;

                // Add loading bubble
                const loadingId = 'loading-' + Date.now();
                messagesArea.innerHTML += `
                    <div id="${loadingId}" class="flex justify-start animate-fade-in-up">
                        <div class="bg-white dark:bg-gray-700 text-gray-500 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        </div>
                    </div>
                `;
                messagesArea.scrollTop = messagesArea.scrollHeight;

                try {
                    const response = await fetch('{{ route("chat.ask") }}', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({ message: message })
                    });
                    
                    const data = await response.json();
                    document.getElementById(loadingId).remove();
                    
                    // Add AI response
                    let replyText = data.reply ? data.reply.replace(/\n/g, '<br>') : 'Tidak ada respon.';
                    
                    messagesArea.innerHTML += `
                        <div class="flex justify-start animate-fade-in-up">
                            <div class="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                                ${replyText}
                            </div>
                        </div>
                    `;
                } catch(err) {
                    document.getElementById(loadingId).remove();
                    messagesArea.innerHTML += `
                        <div class="flex justify-start animate-fade-in-up">
                            <div class="bg-red-100 text-red-700 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-xs">
                                Koneksi terputus. Pastikan GROQ_API_KEY sudah diset di .env.
                            </div>
                        </div>
                    `;
                }
                
                submitBtn.disabled = false;
                messagesArea.scrollTop = messagesArea.scrollHeight;
            }
        </script>
        
        <style>
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
        </style>
