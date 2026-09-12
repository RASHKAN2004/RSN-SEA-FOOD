"use client";

import Link from "next/link";
import { MessageCircle, Facebook, Instagram } from "lucide-react";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#061d22] text-sea-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-2xl font-bold text-white">
            RSN Sea Food
          </p>
          <p className="mt-3 text-sm leading-6 text-sea-300">
            {t(
              "Fresh From Kalpitiya. Quality You Can Trust. Ocean-fresh seafood delivered islandwide across Sri Lanka.",
            )}
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://www.facebook.com/share/1ExhZj6euC/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sea-800 text-white transition hover:bg-coral-500"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://www.instagram.com/mr__.raskan.__?igsi=MWNlZTM5MnUzOWNmNg=="
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sea-800 text-white transition hover:bg-coral-500"
            >
              <Instagram size={16} />
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sea-800 text-xs font-bold text-white transition hover:bg-coral-500"
            >
              TT
            </a>
          </div>
        </div>

        <div>
          <p className="font-semibold text-white">{t("Quick Links")}</p>
          <ul className="mt-3 space-y-2 text-sm text-sea-300">
            <li>
              <Link href="/" className="transition hover:text-white">
                {t("Home")}
              </Link>
            </li>
            <li>
              <Link href="/products" className="transition hover:text-white">
                {t("Products")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition hover:text-white">
                {t("About Us")}
              </Link>
            </li>
            <li>
              <Link
                href="/delivery-areas"
                className="transition hover:text-white"
              >
                {t("Delivery Areas")}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="transition hover:text-white">
                {t("FAQ")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">{t("Customer Support")}</p>
          <ul className="mt-3 space-y-2 text-sm text-sea-300">
            <li className="flex items-center gap-2">
              <MessageCircle size={16} /> WhatsApp: {WHATSAPP_DISPLAY}
            </li>
            <li>Mon – Sun: 6:00 AM – 8:00 PM</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">{t("Location & Delivery")}</p>
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
