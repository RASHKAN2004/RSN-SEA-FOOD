"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Facebook,
  Instagram,
  MapPin,
  Clock,
  Mail,
  Phone,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Fish,
} from "lucide-react";
import { WHATSAPP_DISPLAY, generalOrderLink } from "@/lib/whatsapp";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

export default function Footer() {
  const { t } = useLanguage();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  function handleSubscribe(e) {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3500);
    }
  }

  return (
    <footer className="relative bg-[#031518] text-sea-100 border-t border-white/10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-coral-500/5 blur-3xl pointer-events-none" />

      {/* Catch Alerts & Newsletter Banner */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#051c20] via-[#082a30] to-[#051c20] py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <span className="flex items-center justify-center lg:justify-start gap-1.5 text-xs font-bold uppercase tracking-widest text-coral-400">
                <Sparkles size={14} /> Never Miss a Harbor Landing
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                Get Fresh Catch Updates on WhatsApp
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-lg">
                Subscribe to receive morning harvest notifications when seasonal Lagoon Crabs, Lobsters, and Yellowfin Tuna arrive at Kalpitiya.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-md items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or WhatsApp number..."
                  className="w-full rounded-full border border-white/20 bg-white/10 py-3 pl-4 pr-4 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:border-coral-400 focus:bg-white/15 focus:outline-none transition"
                />
              </div>
              <button
                type="submit"
                className="btn-primary !rounded-full !py-3 !px-5 text-xs font-bold whitespace-nowrap shadow-md shadow-coral-500/30"
              >
                {subscribed ? "✓ Subscribed!" : "Get Alerts"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-sea-400/30 bg-white p-1 shadow">
              <Image
                src="/images/rsn_logo.jpg"
                alt="RSN Sea Food Logo"
                fill
                sizes="44px"
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white leading-tight">
                RSN Sea Food
              </p>
              <p className="text-[10px] uppercase tracking-widest text-sea-300">
                Kalpitiya, Sri Lanka
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            {t(
              "Fresh From Kalpitiya. Quality You Can Trust. Ocean-fresh seafood harvested sustainably and delivered cold across all 25 districts of Sri Lanka.",
            )}
          </p>

          {/* Social Icons */}
          <div className="flex gap-2.5 pt-2">
            <a
              href="https://www.facebook.com/share/1ExhZj6euC/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition hover:bg-coral-500 hover:border-coral-500 hover:scale-105"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://www.instagram.com/mr__.raskan.__?igsi=MWNlZTM5MnUzOWNmNg=="
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition hover:bg-coral-500 hover:border-coral-500 hover:scale-105"
            >
              <Instagram size={16} />
            </a>
            <a
              href={generalOrderLink()}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 transition hover:bg-emerald-500 hover:text-white hover:scale-105"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-display text-lg font-bold text-white tracking-wide">
            {t("Quick Links")}
          </p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li>
              <Link href="/" className="transition hover:text-coral-300 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-coral-400" />
                {t("Home")}
              </Link>
            </li>
            <li>
              <Link href="/products" className="transition hover:text-coral-300 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-coral-400" />
                {t("Products Catalog")}
              </Link>
            </li>
            <li>
              <Link href="/delivery-areas" className="transition hover:text-coral-300 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-coral-400" />
                {t("All 25 Delivery Districts")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition hover:text-coral-300 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-coral-400" />
                {t("About Us & Kalpitiya Story")}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="transition hover:text-coral-300 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-coral-400" />
                {t("FAQ & Storage Guide")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care & Direct Concierge */}
        <div>
          <p className="font-display text-lg font-bold text-white tracking-wide">
            {t("Customer Support")}
          </p>
          <ul className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <MessageCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">WhatsApp Hotline:</span>
                <p className="text-emerald-300 font-mono mt-0.5">{WHATSAPP_DISPLAY}</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={17} className="text-coral-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Harbor Operations:</span>
                <p className="text-slate-400 mt-0.5">Mon – Sun: 6:00 AM – 8:00 PM</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Truck size={17} className="text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Cold Dispatch:</span>
                <p className="text-slate-400 mt-0.5">Same-day & Next-day Chilled</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Harbor Origin & Cold Chain Assurance */}
        <div>
          <p className="font-display text-lg font-bold text-white tracking-wide">
            {t("Harbor Location")}
          </p>
          <div className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-300">
            <p className="flex items-start gap-2">
              <MapPin size={16} className="text-coral-400 shrink-0 mt-0.5" />
              <span>Kalpitiya Peninsula, Puttalam District, Sri Lanka</span>
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 mt-3 space-y-1.5">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>Cold-Chain Protection</span>
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Insulated thermal packaging with ice guarantees natural freshness from harbor dock to home kitchens.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="border-t border-white/10 bg-[#020e10] py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-400 sm:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} RSN Sea Food, Kalpitiya, Sri Lanka. All
            rights reserved.
          </p>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="rounded bg-white/10 px-2 py-0.5 text-slate-300">Cash on Delivery</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-slate-300">WhatsApp Pay</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-slate-300">Sub-Zero Packaging</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
