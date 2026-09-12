"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Fish,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import CategoryNav from "@/components/CategoryNav";
import ProductCard from "@/components/ProductCard";
import TrustSection from "@/components/TrustSection";
import FaqAccordion from "@/components/FaqAccordion";
import { useProducts } from "@/lib/useProducts";
import { generalOrderLink } from "@/lib/whatsapp";
import { SRI_LANKA_DISTRICTS } from "@/lib/districts";
import { useLanguage } from "@/context/LanguageContext";

const benefits = [
  {
    icon: Fish,
    title: "Freshly sourced",
    text: "Selected daily from Kalpitiya waters and handled with care for maximum freshness.",
  },
  {
    icon: ShieldCheck,
    title: "Quality assured",
    text: "Cleaned, packed, and checked to keep seafood safe, fresh, and customer-ready.",
  },
  {
    icon: Truck,
    title: "Islandwide delivery",
    text: "Reliable nationwide shipping across Sri Lanka with transparent order updates.",
  },
  {
    icon: MessageCircle,
    title: "Easy ordering",
    text: "Quick WhatsApp confirmation for custom orders, bundles, and recommendations.",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose your catch",
    text: "Browse premium seafood across fish, prawns, crab, and squid.",
  },
  {
    number: "02",
    title: "Confirm by WhatsApp",
    text: "Place your order and receive instant support for quantity and delivery.",
  },
  {
    number: "03",
    title: "Receive fresh delivery",
    text: "Enjoy delicious seafood delivered to your doorstep with care.",
  },
];

export default function HomePage() {
  const { products } = useProducts();
  const { t } = useLanguage();
  const featured = products.slice(0, 8);

  return (
    <>
      <section className="relative overflow-hidden bg-[#06272b] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(117,213,204,0.28),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(247,106,43,0.18),transparent_28%)]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-0 left-8 h-40 w-40 rounded-full border border-coral-400/30" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-coral-400/40 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-tide">
              <Sparkles size={12} /> The Kalpitiya catch
            </span>
            <h1 className="mt-6 max-w-xl font-display text-5xl font-semibold leading-[0.9] text-white sm:text-6xl lg:text-7xl">
              {t("Fresh Seafood Delivered to Your Door")}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-200">
              A better kind of seafood delivery. Carefully selected from Sri
              Lanka&apos;s coast, cleaned with care, and sent to your kitchen.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">
                {t("Shop Seafood")}
              </Link>
              <a
                href={generalOrderLink()}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                <MessageCircle size={18} /> {t("Order on WhatsApp")}
              </a>
            </div>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Fresh
                </p>
                <p className="mt-2 text-2xl font-bold text-white">Daily</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  From
                </p>
                <p className="mt-2 text-2xl font-bold text-white">Kalpitiya</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm sm:col-span-1 col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Delivery
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  25 districts
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 h-[22rem] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:h-[28rem] lg:-mr-10 lg:h-[34rem]">
            <Image
              src="/images/products/transport.jpg"
              alt="Fresh seafood catch ready for delivery"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06272b] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-coral-200">
                From coast to table
              </p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <p className="font-display text-3xl font-bold text-white">
                  Freshness, handled.
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-xs text-white">
                  <MapPin size={12} /> Islandwide
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryNav />

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="section-rule">
            <p className="section-kicker">Our selection</p>
            <h2 className="section-title mt-2">{t("Fresh Catch This Week")}</h2>
            <p className="mt-2 text-sm text-gray-500">
              Hand-picked daily from Kalpitiya&apos;s coastal waters.
            </p>
          </div>
          <Link href="/products" className="btn-outline hidden sm:inline-flex">
            {t("View All")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <Link
          href="/products"
          className="btn-outline mt-6 flex w-full items-center justify-center sm:hidden"
        >
          {t("View All Products")}
        </Link>
      </section>

      <TrustSection />

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-8 text-center">
          <p className="section-kicker">Why choose us</p>
          <h2 className="section-title mt-2">
            Premium seafood, trusted service
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sea-50 text-sea-700">
                <Icon size={24} />
              </div>
              <h3 className="font-display text-2xl font-bold text-sea-900">
                {t(title)}
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-500">{t(text)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-sea-50 via-white to-coral-50 p-6 shadow-card lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <p className="section-kicker">Our seafood story</p>
            <h2 className="section-title mt-2 max-w-lg">
              Built for families who value quality and freshness.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
              RSN Sea Food brings the richness of the Sri Lankan coastline to
              your table with careful sourcing, hygienic handling, and
              consistent islandwide delivery support.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              {[
                "Fresh catches selected from trusted local sources.",
                "Tailored recommendations for families, restaurants, and gifts.",
                "Clear WhatsApp communication before and after each order.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-coral-100 text-coral-700">
                    <BadgeCheck size={13} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative h-[18rem] overflow-hidden rounded-[1.6rem] lg:h-full">
            <Image
              src="/images/products/transport.jpg"
              alt="Fresh seafood presentation"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-tide py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 text-center">
            <p className="section-kicker">How it works</p>
            <h2 className="section-title mt-2">
              Simple ordering, exceptional freshness
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(({ number, title, text }) => (
              <div
                key={number}
                className="rounded-[2rem] border border-sea-200 bg-white/80 p-6 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-coral-600">
                    {number}
                  </span>
                  <ShoppingBag size={18} className="text-sea-700" />
                </div>
                <h3 className="mt-5 font-display text-3xl font-bold text-sea-900">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a2d33] py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
          <p className="section-kicker text-coral-300">
            We bring the coast closer
          </p>
          <h2 className="section-title mt-3 text-white">
            {t("Islandwide Seafood Delivery")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-200">
            Delivery available across all 25 districts of Sri Lanka — with
            Puttalam as our home base and fastest delivery area.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {SRI_LANKA_DISTRICTS.slice(0, 10).map((d) => (
              <span
                key={d}
                className={`rounded-2xl border px-3 py-2 text-center text-xs font-medium ${d === "Puttalam" ? "border-coral-400 bg-coral-500/20 text-white" : "border-white/10 bg-white/5 text-slate-200"}`}
              >
                {d}
                {d === "Puttalam" ? " ★" : ""}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/delivery-areas" className="btn-primary">
              {t("See All 25 Districts")}
            </Link>
            <a
              href={generalOrderLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-ink"
            >
              Order now <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <h2 className="section-title text-center">
          {t("Frequently Asked Questions")}
        </h2>
        <div className="mx-auto mt-6 max-w-2xl">
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
