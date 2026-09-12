"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  MessageCircle,
  Truck,
  Moon,
  Sun,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_DISPLAY, generalOrderLink } from "@/lib/whatsapp";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMood, setDarkMood] = useState(false);
  const { count } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    const savedMood = window.localStorage.getItem("rsn-dark-mood") === "true";
    setDarkMood(savedMood);
    document.body.classList.toggle("dark-mood", savedMood);
  }, []);

  function toggleDarkMood() {
    setDarkMood((current) => {
      const nextMood = !current;
      window.localStorage.setItem("rsn-dark-mood", String(nextMood));
      document.body.classList.toggle("dark-mood", nextMood);
      return nextMood;
    });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#061d22]/90 backdrop-blur-xl">
      <div className="hidden bg-[#0a2b31] text-xs text-tide sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/faq" className="transition hover:text-white">
              {t("Support")}
            </Link>
            <Link href="/faq" className="transition hover:text-white">
              {t("FAQ")}
            </Link>
            <Link
              href="/delivery-areas"
              className="transition hover:text-white"
            >
              {t("Delivery Areas")}
            </Link>
            <Link href="/#inquiry" className="transition hover:text-white">
              {t("Submit Your Inquiry")}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={generalOrderLink()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 transition hover:text-white"
            >
              <MessageCircle size={14} /> {WHATSAPP_DISPLAY}
            </a>
            <span className="flex items-center gap-1 text-sea-200">
              <Truck size={14} /> {t("Delivery Available")}
            </span>
            <LanguageSelector />
          </div>
        </div>
      </div>

      <div className="shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/15 bg-white shadow-lg">
              <Image
                src="/images/rsn_logo.jpg"
                alt="RSN Sea Food Logo"
                fill
                sizes="44px"
                className="object-contain p-1"
              />
            </div>
            <div className="leading-tight">
              <p className="font-display text-2xl font-bold leading-none text-white">
                RSN Sea Food
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-tide">
                {t("Kalpitiya, Sri Lanka")}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-white md:flex">
            <Link
              href="/"
              className="border-b border-transparent py-2 transition hover:border-coral-400 hover:text-coral-200"
            >
              {t("Home")}
            </Link>
            <Link
              href="/products"
              className="border-b border-transparent py-2 transition hover:border-coral-400 hover:text-coral-200"
            >
              {t("Products")}
            </Link>
            <Link
              href="/delivery-areas"
              className="border-b border-transparent py-2 transition hover:border-coral-400 hover:text-coral-200"
            >
              {t("Delivery Areas")}
            </Link>
            <Link
              href="/about"
              className="border-b border-transparent py-2 transition hover:border-coral-400 hover:text-coral-200"
            >
              {t("About Us")}
            </Link>
            <Link
              href="/faq"
              className="border-b border-transparent py-2 transition hover:border-coral-400 hover:text-coral-200"
            >
              {t("FAQ")}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleDarkMood}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-tide transition hover:border-coral-300 hover:text-coral-200"
              aria-label={
                darkMood ? "Switch to light mood" : "Switch to dark mood"
              }
              title={darkMood ? "Light mood" : "Dark mood"}
            >
              {darkMood ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="hidden items-center gap-1 text-sm text-white transition hover:text-coral-200 sm:flex">
              <User size={18} /> {t("Sign In")}
            </button>
            <Link
              href="/cart"
              className="relative flex items-center text-white transition hover:text-coral-200"
            >
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <button
              className="text-white md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#061d22] px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-white">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                {t("Home")}
              </Link>
              <Link href="/products" onClick={() => setMenuOpen(false)}>
                {t("Products")}
              </Link>
              <Link href="/delivery-areas" onClick={() => setMenuOpen(false)}>
                {t("Delivery Areas")}
              </Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}>
                {t("About Us")}
              </Link>
              <Link href="/faq" onClick={() => setMenuOpen(false)}>
                {t("FAQ")}
              </Link>
              <a
                href={generalOrderLink()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-coral-200"
              >
                <MessageCircle size={16} /> WhatsApp: {WHATSAPP_DISPLAY}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
