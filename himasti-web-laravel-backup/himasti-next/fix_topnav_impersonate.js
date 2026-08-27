const fs = require('fs');
let content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');

// Update Props Type
content = content.replace(
  'roleStr: string \n}) {',
  'roleStr: string,\n  isImpersonating?: boolean\n}) {'
);

// Add Stop Impersonating action
const searchUserMenu = '<div className="text-right hidden sm:block">';
const replaceUserMenu = `{isImpersonating && (
              <button 
                onClick={() => {
                  document.cookie = "impersonated_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  window.location.href = "/admin";
                }}
                className="mr-4 text-xs font-bold bg-red-100 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-200 transition-colors flex items-center gap-1"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                STOP IMPERSONATING
              </button>
            )}
            <div className="text-right hidden sm:block">`;

content = content.replace(searchUserMenu, replaceUserMenu);

fs.writeFileSync('src/components/layout/TopNav.tsx', content);
