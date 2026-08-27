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

  // Close dropdown when clicking outside
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
    <nav className="bg-white  shadow-sm border-b border-gray-200  sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center" ref={navRef}>
            <Link href="/admin" className="font-extrabold text-2xl text-blue-600  mr-8 tracking-tight">
              HIMASTI
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1">
              <Link href="/admin" className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${pathname === "/admin" ? "bg-blue-50 text-blue-700  " : "text-gray-600  hover:bg-gray-100 hover:text-blue-600 :bg-gray-700"}`}>Portal Informasi</Link>

              {groups.map((group) => {
                const isActive = group.links.some(link => pathname?.startsWith(link.href));
                const isOpen = openGroup === group.title;
                
                return (
                  <div key={group.title} className="relative">
                    <button 
                      onClick={() => setOpenGroup(isOpen ? null : group.title)}
                      className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${
                        isActive || isOpen
                          ? "bg-blue-50 text-blue-700  " 
                          : "text-gray-600  hover:bg-gray-100 hover:text-blue-600 :bg-gray-700"
                      }`}
                    >
                      {group.title}
                      <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-white  rounded-xl shadow-lg border border-gray-100  py-2 animate-in fade-in slide-in-from-top-2">
                        {group.links.map(link => (
                          <Link 
                            key={link.href} 
                            href={link.href}
                            onClick={() => setOpenGroup(null)}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              pathname?.startsWith(link.href)
                                ? "bg-blue-50 text-blue-700  font-bold"
                                : "text-gray-700  hover:bg-gray-50 :bg-gray-700"
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
              <div className="text-sm font-bold text-gray-900  leading-tight">{userStr}</div>
              <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider">{roleStr}</div>
            </div>
            <div className="h-8 w-px bg-gray-200 "></div>
            <div className="w-full">
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-transparent">
                Keluar
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="md:hidden border-t border-gray-200  bg-white ">
          <div className="px-4 py-3 border-b border-gray-100 ">
            <div className="font-bold text-gray-900 ">{userStr}</div>
            <div className="text-xs font-semibold text-blue-500 uppercase">{roleStr}</div>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 overflow-y-auto max-h-[70vh]">
            <div className="mb-4"><Link href="/admin" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === "/admin" ? "bg-blue-50 text-blue-700 " : "text-gray-700  hover:bg-gray-50"}`}>Portal Informasi</Link></div>
            {groups.map((group) => (
              <div key={group.title} className="mb-4">
                <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{group.title}</div>
                {group.links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname?.startsWith(link.href)
                        ? "bg-blue-50 text-blue-700 "
                        : "text-gray-700  hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="w-full">
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-red-50 rounded-md">
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
