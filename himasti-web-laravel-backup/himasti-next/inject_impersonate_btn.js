const fs = require('fs');
let content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');

const search = '{/* Right side Profile */}';
const replace = `{/* Right side Profile */}
          {isImpersonating && (
            <button 
              onClick={() => {
                document.cookie = "impersonated_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/admin";
              }}
              className="mr-4 text-xs font-bold bg-red-100 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-200 transition-colors flex items-center gap-1 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              STOP IMPERSONATING
            </button>
          )}`;

content = content.replace(search, replace);
fs.writeFileSync('src/components/layout/TopNav.tsx', content);
