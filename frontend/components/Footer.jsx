"use client";

import Link from "next/link";
import { MessageCircle, Facebook, Instagram } from "lucide-react";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-sea-950 text-sea-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-xl font-bold text-white">
            RSN Sea Food
          </p>
          <p className="mt-2 text-sm text-sea-300">
            {t('Fresh From Kalpitiya. Quality You Can Trust. Ocean-fresh seafood delivered islandwide across Sri Lanka.')}
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://www.facebook.com/share/1ExhZj6euC/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-full bg-sea-800 p-2 hover:bg-sea-700"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://www.instagram.com/mr__.raskan.__?igsi=MWNlZTM5MnUzOWNmNg=="
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full bg-sea-800 p-2 hover:bg-sea-700"
            >
              <Instagram size={16} />
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="rounded-full bg-sea-800 p-2 hover:bg-sea-700 text-xs font-bold w-8 h-8 flex items-center justify-center"
            >
              TT
            </a>
          </div>
        </div>

        <div>
          <p className="font-semibold text-white">{t('Quick Links')}</p>
          <ul className="mt-3 space-y-2 text-sm text-sea-300">
            <li>
              <Link href="/" className="hover:text-white">
                {t('Home')}
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white">
                {t('Products')}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                {t('About Us')}
              </Link>
            </li>
            <li>
              <Link href="/delivery-areas" className="hover:text-white">
                {t('Delivery Areas')}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white">
                {t('FAQ')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">{t('Customer Support')}</p>
          <ul className="mt-3 space-y-2 text-sm text-sea-300">
            <li className="flex items-center gap-2">
              <MessageCircle size={16} /> WhatsApp: {WHATSAPP_DISPLAY}
            </li>
            <li>Mon – Sun: 6:00 AM – 8:00 PM</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">{t('Location & Delivery')}</p>
          <ul className="mt-3 space-y-2 text-sm text-sea-300">
            <li>Kalpitiya, Puttalam District, Sri Lanka</li>
            <li>Default District: Puttalam</li>
            <li>Islandwide delivery — all 25 districts</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sea-800 py-4 text-center text-xs text-sea-400">
        © {new Date().getFullYear()} RSN Sea Food, Kalpitiya, Sri Lanka. All
        rights reserved.
      </div>
    </footer>
  );
}
