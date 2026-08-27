"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type LinkItem = { href: string; label: string };
type MenuGroup = { title: string; links: LinkItem[] };

export default function TopNav({ 
  groups, 
  userStr, 
  roleStr 
}: { 
  groups: MenuGroup[], 
  userStr: string, 
  roleStr: string 
}) {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          <div className="flex items-center h-full" ref={navRef}>
            <Link href="/admin" className="font-bold text-lg text-sky-700 mr-8 tracking-tight flex items-center gap-2">
              <img src="/images/logo_himasti.jpg" alt="Logo HIMASTI" className="w-6 h-6 object-contain rounded-md" />
              HIMASTI
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex h-full space-x-6">
              <Link href="/admin" className={`inline-flex items-center text-sm transition-colors border-b-2 ${pathname === "/admin" ? "border-sky-500 text-sky-700" : "border-transparent text-slate-500 hover:text-sky-700"}`}>
                Overview
              </Link>

              {groups.map((group) => {
                const isActive = group.links.some(link => pathname?.startsWith(link.href));
                const isOpen = openGroup === group.title;
                
                return (
                  <div key={group.title} className="relative flex items-center h-full">
                    <button 
                      onClick={() => setOpenGroup(isOpen ? null : group.title)}
                      className={`inline-flex items-center h-full text-sm transition-colors border-b-2 gap-1 ${
                        isActive || isOpen
                          ? "border-sky-500 text-sky-700" 
                          : "border-transparent text-slate-500 hover:text-sky-700"
                      }`}
                    >
                      {group.title}
                      <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div className="absolute top-14 left-0 w-56 bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-md rounded-md py-1 animate-in fade-in slide-in-from-top-1">
                        {group.links.map(link => (
                          <Link 
                            key={link.href} 
                            href={link.href}
                            onClick={() => setOpenGroup(null)}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              pathname?.startsWith(link.href)
                                ? "text-sky-700 bg-gray-50 font-medium"
                                : "text-gray-600 hover:text-sky-700 hover:bg-gray-50"
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right side Profile */}
          <div className="hidden md:flex items-center gap-4">
             <div className="text-right">
              <div className="text-sm text-slate-800 leading-none">{userStr}</div>
              <div className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">{roleStr}</div>
            </div>
            <div className="h-8 w-8 bg-gray-100 border border-slate-200/60 rounded-full flex items-center justify-center text-xs font-mono font-bold">
              {userStr.charAt(0)}
            </div>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm font-medium text-slate-500 hover:text-sky-700 ml-2 transition-colors">
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 hover:text-sky-700 p-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="text-sm font-medium text-sky-700">{userStr}</div>
            <div className="text-xs font-mono text-slate-500 uppercase">{roleStr}</div>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="mb-2"><Link href="/admin" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 text-sm ${pathname === "/admin" ? "text-sky-700 font-medium" : "text-slate-500"}`}>Overview</Link></div>
            {groups.map((group) => (
              <div key={group.title} className="mb-2">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{group.title}</div>
                {group.links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-sm ${
                      pathname?.startsWith(link.href)
                        ? "text-sky-700 font-medium"
                        : "text-slate-500"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2">
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full text-left px-3 py-2 text-sm text-slate-500">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
