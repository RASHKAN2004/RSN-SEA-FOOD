"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MapPin, Truck } from "lucide-react";
import CategoryNav from "@/components/CategoryNav";
import ProductCard from "@/components/ProductCard";
import TrustSection from "@/components/TrustSection";
import FaqAccordion from "@/components/FaqAccordion";
import { useProducts } from "@/lib/useProducts";
import { generalOrderLink } from "@/lib/whatsapp";
import { SRI_LANKA_DISTRICTS } from "@/lib/districts";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { products } = useProducts();
  const { t } = useLanguage();
  const featured = products.slice(0, 8);

  return (
    <>
      <section className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-tide/20" />
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-24">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 border-l-2 border-coral-400 pl-3 text-xs font-bold uppercase tracking-[0.2em] text-tide">
              The Kalpitiya catch
            </span>
            <h1 className="mt-5 max-w-xl font-display text-5xl font-semibold leading-[0.92] text-white sm:text-7xl">
              {t("Fresh Seafood Delivered to Your Door")}
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-tide">
              A better kind of seafood delivery. Carefully selected from Sri
              Lanka&apos;s coast, cleaned with care, and sent to your kitchen.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
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
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-tide">
              <span className="flex items-center gap-2">
                <MapPin size={16} /> Serving Sri Lanka
              </span>
              <span className="flex items-center gap-2">
                <Truck size={16} /> Delivery in all 25 districts
              </span>
            </div>
          </div>
          <div className="relative h-[22rem] w-full overflow-hidden border-8 border-shell/10 shadow-2xl sm:h-[28rem] lg:-mr-16 lg:h-[34rem]">
            <Image
              src="/images/products/transport.jpg"
              alt="Fresh seafood catch ready for delivery"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute bottom-5 left-5 bg-shell px-4 py-3 text-ink shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]">
                From coast to table
              </p>
              <p className="mt-1 font-display text-2xl font-bold">
                Freshness, handled.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CategoryNav />

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div className="section-rule">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral-600">
              Our selection
            </p>
            <h2 className="section-title mt-2">{t("Fresh Catch This Week")}</h2>
            <p className="mt-1 text-sm text-gray-500">
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

      <section className="bg-tide py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-coral-600">
            We bring the coast closer
          </p>
          <h2 className="section-title mt-3 text-center">
            {t("Islandwide Seafood Delivery")}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-500">
            Delivery available across all 25 districts of Sri Lanka — with
            Puttalam as our home base and fastest delivery area.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {SRI_LANKA_DISTRICTS.slice(0, 10).map((d) => (
              <span
                key={d}
                className={`rounded-xl border px-3 py-2 text-center text-xs font-medium ${d === "Puttalam" ? "border-coral-400 bg-coral-50 text-coral-700" : "border-sea-100 bg-white text-sea-700"}`}
              >
                {d}
                {d === "Puttalam" ? " ★" : ""}
              </span>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/delivery-areas" className="btn-primary">
              {t("See All 25 Districts")}
            </Link>
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
