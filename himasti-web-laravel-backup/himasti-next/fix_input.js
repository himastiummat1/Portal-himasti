const fs = require('fs');
let content = fs.readFileSync('src/app/LandingAnimation.tsx', 'utf8');

// Replace the entire form block to use style={{}} for absolute positioning just to be safe
content = content.replace(/<form onSubmit=\{handleSend\} className="relative flex items-center">[\s\S]*?<\/form>/, `<form onSubmit={handleSend} className="relative flex items-center">
                   <input
                     type="text"
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     disabled={isLoading}
                     placeholder={t.aiPrompt}
                     style={{ paddingInlineStart: '1rem', paddingInlineEnd: '3rem' }}
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                     dir={isRTL ? 'rtl' : 'ltr'}
                   />
                   <button 
                     type="submit" 
                     disabled={!input.trim() || isLoading}
                     style={{ [isRTL ? 'left' : 'right']: '0.5rem' }}
                     className="absolute p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                   >
                     <Send className={\`w-4 h-4 \${isRTL ? 'rotate-180' : ''}\`} />
                   </button>
                 </form>`);

fs.writeFileSync('src/app/LandingAnimation.tsx', content);
