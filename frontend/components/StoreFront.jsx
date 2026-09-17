import React from 'react';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function StoreFront({ children }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29]">
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-[#E8E2D5] px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="text-[#2B3A29] w-6 h-6" />
          <span className="text-2xl font-bold tracking-tight font-serif text-[#2B3A29]">
            AURA<span className="text-emerald-800 font-sans text-xl font-normal ml-1">WOOD</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/orders" className="text-xs font-semibold px-3 py-2 text-stone-600 hover:text-stone-900 transition">
            Orders
          </Link>
          <Link href="/seller/dashboard" className="text-xs font-semibold px-3 py-2 bg-stone-100 rounded-xl hover:bg-stone-200 transition">
            Seller Hub
          </Link>
          <Link href="/admin" className="text-xs font-semibold px-3 py-2 bg-stone-100 rounded-xl hover:bg-stone-200 transition">
            Admin Console
          </Link>
          <Link href="/login" className="text-xs font-bold px-4 py-2 bg-[#2B3A29] text-white rounded-xl hover:bg-emerald-950 transition">
            Login
          </Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}