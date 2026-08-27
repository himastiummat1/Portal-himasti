const fs = require('fs');
let content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');

const anchor = `            <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm font-medium text-slate-500 hover:text-sky-700 ml-2 transition-colors">
              Logout
            </button>`;

const newButtons = `            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('request-dev-mode'))} 
              className="text-[10px] font-mono font-bold text-slate-400 hover:text-emerald-500 ml-4 border border-slate-200 hover:border-emerald-500 px-2 py-1 rounded transition-colors"
              title="Dev Mode (Locked)"
            >
              🔒 TOP SECRET
            </button>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm font-medium text-slate-500 hover:text-sky-700 ml-4 transition-colors">
              Logout
            </button>`;

content = content.replace(anchor, newButtons);

fs.writeFileSync('src/components/layout/TopNav.tsx', content);
