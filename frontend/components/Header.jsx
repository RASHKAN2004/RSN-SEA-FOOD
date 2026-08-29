'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart, User, MessageCircle, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { WHATSAPP_DISPLAY, generalOrderLink } from '@/lib/whatsapp';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top info bar */}
      <div className="hidden bg-sea-900 text-xs text-sea-100 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/faq" className="hover:text-white">Support</Link>
            <Link href="/faq" className="hover:text-white">FAQ</Link>
            <Link href="/delivery-areas" className="hover:text-white">Delivery Areas</Link>
            <Link href="/#inquiry" className="hover:text-white">Submit Your Inquiry</Link>
          </div>
          <div className="flex items-center gap-4">
            <a href={generalOrderLink()} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
              <MessageCircle size={14} /> {WHATSAPP_DISPLAY}
            </a>
            <span className="flex items-center gap-1 text-sea-200">
              <Truck size={14} /> Delivery Available
            </span>
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-gradient-to-r from-sea-700 to-sea-600 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-display text-lg font-bold text-sea-700">
              RS
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold text-white">RSN Sea Food</p>
              <p className="text-[11px] text-sea-100">Kalpitiya, Sri Lanka</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-white md:flex">
            <Link href="/" className="hover:text-coral-200">Home</Link>
            <Link href="/products" className="hover:text-coral-200">Products</Link>
            <Link href="/delivery-areas" className="hover:text-coral-200">Delivery Areas</Link>
            <Link href="/about" className="hover:text-coral-200">About Us</Link>
            <Link href="/faq" className="hover:text-coral-200">FAQ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-1 text-sm text-white hover:text-coral-200 sm:flex">
              <User size={18} /> Sign In
            </button>
            <Link href="/cart" className="relative flex items-center text-white hover:text-coral-200">
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <button className="text-white md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-sea-500/40 bg-sea-700 px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-white">
              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/products" onClick={() => setMenuOpen(false)}>Products</Link>
              <Link href="/delivery-areas" onClick={() => setMenuOpen(false)}>Delivery Areas</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
              <Link href="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
              <a href={generalOrderLink()} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-coral-200">
                <MessageCircle size={16} /> WhatsApp: {WHATSAPP_DISPLAY}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
