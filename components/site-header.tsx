'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { AuthButtons } from "@/components/auth-buttons";
import { Button } from "./ui/button";

interface SiteHeaderProps {
  currentPage?: string;
}

export function SiteHeader({ currentPage }: SiteHeaderProps = {}) {
  const pathname = usePathname();

  // Determine active page based on pathname if not provided
  const currentActive = currentPage || (() => {
    if (pathname.startsWith('/explore')) return 'explore';
    if (pathname.startsWith('/products')) return 'products';
    if (pathname.startsWith('/suppliers')) return 'suppliers';
    return 'home';
  })();

  return (
    <header className="fixed top-0 w-full z-50 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-[#2d2d2d]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-transparent bg-clip-text">
            Hi-Fella
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link 
            href="/explore" 
            className={`hover:text-[#F01457] transition-colors ${currentActive === 'explore' ? 'text-[#F01457] font-semibold' : ''}`}
          >
            Explore Companies
          </Link>
          <Link 
            href="/products" 
            className={`hover:text-[#F01457] transition-colors ${currentActive === 'products' ? 'text-[#F01457] font-semibold' : ''}`}
          >
            Products
          </Link>
          <Link 
            href="/suppliers" 
            className={`hover:text-[#F01457] transition-colors ${currentActive === 'suppliers' ? 'text-[#F01457] font-semibold' : ''}`}
          >
            For Suppliers
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
