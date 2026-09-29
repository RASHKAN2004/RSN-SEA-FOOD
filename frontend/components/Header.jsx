"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  MessageCircle,
  Truck,
  Moon,
  Sun,
  LogOut,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  Fish,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_DISPLAY, generalOrderLink } from "@/lib/whatsapp";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMood, setDarkMood] = useState(false);
  const [user, setUser] = useState(null);
  const { count } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    const savedMood = window.localStorage.getItem("rsn-dark-mood") === "true";
    setDarkMood(savedMood);
    document.body.classList.toggle("dark-mood", savedMood);
  }, []);

  useEffect(() => {
    api
      .me()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    await api.logout().catch(() => {});
    setUser(null);
    window.location.href = "/";
  }

  function toggleDarkMood() {
    setDarkMood((current) => {
      const nextMood = !current;
      window.localStorage.setItem("rsn-dark-mood", String(nextMood));
      document.body.classList.toggle("dark-mood", nextMood);
      return nextMood;
    });
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/delivery-areas", label: "Delivery Areas" },
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#051c20]/95 backdrop-blur-xl shadow-lg shadow-black/10">
      {/* Top Announcement & Concierge Ribbon */}
      <div className="bg-gradient-to-r from-[#072429] via-[#09323a] to-[#072429] text-xs text-tide/90 border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE HARVEST
            </span>
            <span className="hidden sm:inline text-[11px] text-slate-300">
              Landed today at Kalpitiya Harbor • Islandwide Cold-Chain Delivery
              across Sri Lanka
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={generalOrderLink()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-medium transition hover:text-white text-emerald-300"
            >
              <MessageCircle size={13} className="text-emerald-400" />
              <span className="hidden md:inline">Concierge:</span>{" "}
              {WHATSAPP_DISPLAY}
            </a>

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-300">
              <Truck size={13} className="text-coral-400" />
              <span>25 Districts</span>
            </div>

            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5 sm:gap-3">
          <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full border-2 border-sea-400/40 bg-gradient-to-br from-white via-sea-50 to-coral-50 shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-105 group-hover:border-coral-400">
            <Image
              src="/images/rsn_logo.jpg"
              alt="RSN Sea Food Logo"
              fill
              priority
              sizes="48px"
              className="object-contain"
              style={{ objectPosition: "center" }}
            />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-sea-200 transition-colors">
                RSN Sea Food
              </span>
              <span className="rounded bg-coral-500/20 px-1.5 py-0.2 text-[9px] font-bold text-coral-300 uppercase tracking-widest border border-coral-500/30 hidden sm:inline-block">
                FRESH
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-sea-300/80">
              {t("Kalpitiya, Sri Lanka")}
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 lg:gap-2 text-sm font-medium text-white md:flex">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-coral-300 font-semibold shadow-inner"
                    : "text-slate-200 hover:text-white hover:bg-white/5"
                }`}
              >
                {t(label)}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-coral-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button (Desktop & Mobile) */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-sea-400 hover:text-white active:scale-95"
            title="Search fresh seafood"
            aria-label="Search seafood"
          >
            <Search size={16} />
          </button>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={toggleDarkMood}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-tide transition hover:border-coral-300 hover:text-coral-200 active:scale-95"
            aria-label={
              darkMood ? "Switch to light mood" : "Switch to dark mood"
            }
            title={darkMood ? "Light mood" : "Dark mood"}
          >
            {darkMood ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 px-3 text-xs font-medium text-white transition hover:bg-white/10 hover:border-coral-300"
                title="Open customer profile"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-coral-500/80 text-[10px] font-bold text-white uppercase">
                  {user.name?.[0] || "U"}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:text-coral-400 hover:bg-white/5"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 hover:border-coral-400 sm:flex"
            >
              <User size={15} className="text-coral-400" />
              <span>{t("Sign In")}</span>
            </Link>
          )}

          {/* Shopping Cart Pill */}
          <Link
            href="/cart"
            className="group relative flex h-10 items-center gap-2 rounded-full border border-sea-400/40 bg-gradient-to-r from-sea-600 to-sea-700 px-3.5 text-white shadow-md shadow-sea-900/30 transition hover:from-coral-500 hover:to-coral-600 hover:border-coral-400 active:scale-95"
            aria-label="View shopping cart"
          >
            <ShoppingCart size={18} />
            <span className="text-xs font-bold">{count}</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden active:scale-95"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#051c20] px-5 py-4 md:hidden shadow-2xl animate-fade-up">
          <nav className="flex flex-col gap-2.5 text-sm font-medium text-white">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${
                    isActive
                      ? "bg-white/10 text-coral-300 font-semibold"
                      : "text-slate-200 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{t(label)}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-coral-400" />
                  )}
                </Link>
              );
            })}

            <div className="my-2 border-t border-white/10 pt-2 flex flex-col gap-2">
              <Link
                href={user ? "/profile" : "/signin"}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-coral-200"
              >
                <User size={18} />
                <span>
                  {user ? `Account: ${user.name}` : t("Sign In / Register")}
                </span>
              </Link>

              <a
                href={generalOrderLink()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-3 py-2.5 text-emerald-300 font-semibold"
              >
                <MessageCircle size={18} className="text-emerald-400" />
                <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* Quick Search Spotlight Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-20 px-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-[#062024] p-5 text-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Search size={20} className="text-teal-400 shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    setSearchOpen(false);
                    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                placeholder="Search fresh catch (e.g. Mud Crab, Tiger Prawn, Tuna)..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-slate-400 outline-none"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Popular Kalpitiya Catches
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {[
                  { label: "Jumbo Tiger Prawns", cat: "Prawn" },
                  { label: "Lagoon Mud Crabs", cat: "Crab" },
                  { label: "Yellowfin Tuna", cat: "Tuna" },
                  { label: "Seer Fish Steaks", cat: "Seer Fish" },
                  { label: "Rock Lobster", cat: "Lobster" },
                  { label: "Squid & Cuttlefish", cat: "Squid" },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      router.push(`/products?category=${encodeURIComponent(item.cat)}`);
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 py-1.5 px-3 text-xs text-slate-200 transition hover:border-coral-400 hover:bg-white/10 hover:text-white"
                  >
                    <Fish size={12} className="text-teal-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
