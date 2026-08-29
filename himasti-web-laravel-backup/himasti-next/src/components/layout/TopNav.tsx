"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Search, Command, ArrowRight, User, LogOut, TerminalSquare } from "lucide-react";
import { stopImpersonating } from "@/app/admin/kader/actions";

export default function TopNav({ 
  dict, groups, userStr, roleStr, isImpersonating 
}: { 
  dict: any, groups: any[], userStr: string, roleStr: string, isImpersonating: boolean 
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCmdOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Flatten all links for command palette
  const allLinks = [
    { title: dict.menu.overview, href: "/admin", group: "General" },
    ...groups.flatMap(g => g.links.map((l: any) => ({ title: l.label, href: l.href, group: g.title })))
  ];

  const filteredLinks = allLinks.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <nav className="bg-white border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            
            <div className="flex items-center h-full" ref={navRef}>
              <Link href="/admin" className="font-bold text-lg text-slate-900 mr-8 tracking-tight flex items-center gap-2">
                <Image src="/images/logo_himasti.jpg" alt="Logo HIMASTI" width={24} height={24} className="w-6 h-6 object-contain rounded-md" />
                HIMASTI
              </Link>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex h-full space-x-1">
                <Link href="/admin" className={`inline-flex items-center px-3 text-sm transition-colors rounded-md my-2 ${pathname === "/admin" ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}>
                  {dict.menu.overview}
                </Link>

                {groups.map((group) => {
                  const isActive = group.links.some((link: any) => pathname?.startsWith(link.href));
                  const isOpen = openGroup === group.title;
                  
                  return (
                    <div key={group.title} className="relative flex items-center h-full my-2">
                      <button 
                        onClick={() => setOpenGroup(isOpen ? null : group.title)}
                        className={`inline-flex items-center px-3 py-1.5 text-sm transition-colors rounded-md gap-1 ${
                          isActive || isOpen
                            ? "bg-slate-100 text-slate-900 font-medium" 
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        {group.title}
                      </button>

                      {/* Dropdown Menu */}
                      {isOpen && (
                        <div className="absolute top-12 left-0 w-56 bg-white border border-slate-200/80 shadow-lg rounded-xl py-2 animate-in fade-in slide-in-from-top-1 z-50">
                          <div className="px-3 pb-2 mb-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {group.title}
                          </div>
                          {group.links.map((link: any) => (
                            <Link 
                              key={link.href} 
                              href={link.href}
                              onClick={() => setOpenGroup(null)}
                              className={`block px-4 py-2 text-sm transition-colors mx-1 rounded-md ${
                                pathname?.startsWith(link.href)
                                  ? "text-slate-900 bg-slate-50 font-medium"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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

            {/* Right side Profile & Search */}
            <div className="hidden md:flex items-center gap-3">
              
              {/* Command Palette Trigger */}
              <button 
                onClick={() => setIsCmdOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-sm text-slate-400 transition-colors mr-2 w-48 lg:w-64"
              >
                <Search className="w-4 h-4" />
                <span className="flex-1 text-left">Search...</span>
                <span className="flex items-center gap-0.5 text-[10px] font-mono font-medium border border-slate-200 bg-white px-1.5 py-0.5 rounded text-slate-500">
                  <Command className="w-3 h-3" />K
                </span>
              </button>

              {isImpersonating && (
                <button 
                  onClick={async () => {
                    await stopImpersonating();
                    window.location.href = "/admin";
                  }}
                  className="mr-2 text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded-md hover:bg-red-200 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  STOP IMPERSONATE
                </button>
              )}
              
              {/* Profile Dropdown / Actions */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('request-dev-mode'))} 
                  className="text-slate-400 hover:text-slate-900 transition-colors"
                  title="Dev Mode"
                >
                  <TerminalSquare className="w-4 h-4" />
                </button>
                <Link href="/admin/profil" className="text-slate-400 hover:text-slate-900 transition-colors" title="Profile">
                  <User className="w-4 h-4" />
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-slate-400 hover:text-red-600 transition-colors" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
                
                <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(userStr)}`} alt="Avatar" className="h-8 w-8 rounded-full shadow-sm ml-2 bg-slate-100" />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setIsCmdOpen(true)} className="p-2 text-slate-500">
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 p-2">
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
          <div className="md:hidden border-b border-slate-200 bg-white">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(userStr)}`} alt="Avatar" className="h-10 w-10 rounded-full shadow-sm bg-slate-100" />
              <div>
                <div className="text-sm font-bold text-slate-900">{userStr}</div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{roleStr}</div>
              </div>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="mb-2"><Link href="/admin" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 text-sm rounded-md ${pathname === "/admin" ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-600"}`}>{dict.menu.overview}</Link></div>
              {groups.map((group) => (
                <div key={group.title} className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{group.title}</div>
                  {group.links.map((link: any) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2 text-sm rounded-md ${
                        pathname?.startsWith(link.href)
                          ? "bg-slate-100 text-slate-900 font-medium"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
              
              <div className="border-t border-slate-100 mt-2 pt-2 flex items-center gap-2 px-2">
                <Link href="/admin/profil" onClick={() => setMobileMenuOpen(false)} className="flex-1 flex justify-center items-center gap-2 py-2 text-sm text-slate-600 bg-slate-50 rounded-lg">
                  <User className="w-4 h-4" /> Profil
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex-1 flex justify-center items-center gap-2 py-2 text-sm text-red-600 bg-red-50 rounded-lg">
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>

            </div>
          </div>
        )}
      </nav>

      {/* Command Palette Modal */}
      {isCmdOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCmdOpen(false)}></div>
          
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 py-4 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                type="text" 
                autoFocus
                placeholder="Search menus or modules..."
                className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-lg"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setIsCmdOpen(false)} className="text-[10px] font-mono font-medium border border-slate-200 bg-slate-50 px-2 py-1 rounded text-slate-500">
                ESC
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredLinks.length === 0 ? (
                <div className="text-center py-10 text-sm text-slate-500">
                  No modules found matching "{searchQuery}"
                </div>
              ) : (
                filteredLinks.map((link, idx) => (
                  <Link 
                    key={idx} 
                    href={link.href}
                    onClick={() => setIsCmdOpen(false)}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl group transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900">{link.title}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{link.group}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
