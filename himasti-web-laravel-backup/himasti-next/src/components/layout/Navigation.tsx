"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide global navigation on admin and login pages
  if (pathname === "/" || pathname?.startsWith("/register") || pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  const navLinks = [
    { name: "Presensi & Scanner", href: "/absen" },
    { name: "Portal Admin", href: "/admin/kader" },
    { name: "Beranda Publik", href: "/" },
  ];

  return (
    <nav className="bg-white  border-b border-gray-100 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl ">
                HIMASTI (Publik)
              </Link>
            </div>
            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out border-transparent text-gray-500  hover:text-gray-700 hover:border-gray-300`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
