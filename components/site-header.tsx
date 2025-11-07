import Link from "next/link";
import { AuthButtons } from "@/components/auth-buttons";
import { Button } from "./ui/button";

export function SiteHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-[#2d2d2d]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-transparent bg-clip-text">
            B2B Directory
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="#" className="hover:text-[#F01457] transition-colors">Explore Companies</Link>
          <Link href="#" className="hover:text-[#F01457] transition-colors">Products</Link>
          <Link href="#" className="hover:text-[#F01457] transition-colors">For Suppliers</Link>
        </nav>
        <div className="flex items-center gap-2">
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
