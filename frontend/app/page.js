"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Compass,
  Fish,
  Flame,
  Heart,
  HelpCircle,
  MapPin,
  MessageCircle,
  Package,
  PhoneCall,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Utensils,
} from "lucide-react";
import CategoryNav from "@/components/CategoryNav";
import ProductCard from "@/components/ProductCard";
import TrustSection from "@/components/TrustSection";
import FaqAccordion from "@/components/FaqAccordion";
import { useProducts } from "@/lib/useProducts";
import { generalOrderLink, WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { SRI_LANKA_DISTRICTS, DEFAULT_DISTRICT } from "@/lib/districts";
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
    text: "Browse premium seafood across lagoon crabs, tiger prawns, seer fish, and tuna.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Custom Cut & Packed",
    text: "Specify whole fish, steaks, or pre-cleaned. Chilled in sub-zero thermal packaging.",
    icon: Package,
  },
  {
    number: "03",
    title: "Chilled Doorstep Delivery",
    text: "Receive ocean-fresh catch at your home or restaurant anywhere across Sri Lanka.",
    icon: Truck,
  },
];

const heroSlides = [
  {
    image: "/images/products/prawn.jpg",
    label: "Kalpitiya Lagoon Specialty",
    title: "Jumbo Tiger Prawns",
    badge: "Lagoon Fresh",
    tag: "High Demand",
  },
  {
    image: "/images/products/crab.jpg",
    label: "Islandwide Favorite",
    title: "Lagoon Mud Crabs",
    badge: "Wild Caught",
    tag: "Chef's Pick",
  },
  {
    image: "/images/products/tuna.jpg",
    label: "Export Quality Grade",
    title: "Yellowfin Tuna (Kelawalla)",
    badge: "Sashimi Grade",
    tag: "Morning Landed",
  },
  {
    image: "/images/products/transport.jpg",
    label: "Coast to Kitchen Guarantee",
    title: "Islandwide Cold Chain",
    badge: "All 25 Districts",
    tag: "Within 24h",
  },
];

const testimonials = [
  {
    name: "Niluka Perera",
    location: "Colombo 07",
    role: "Verified Food Lover",
    rating: 5,
    comment:
      "The mud crabs and tiger prawns arrived ice-cold in Colombo. The natural sweetness was incredible, just like having it right on a Kalpitiya beach.",
  },
  {
    name: "Chef Rohan De Silva",
    location: "Negombo",
    role: "Boutique Hotel Chef",
    rating: 5,
    comment:
      "Freshness is non-negotiable in our restaurant. RSN Sea Food's Yellowfin Tuna and Seer Fish cuts are consistently export-grade.",
  },
  {
    name: "Fatima Mohamed",
    location: "Kandy",
    role: "Regular Customer",
    rating: 5,
    comment:
      "Ordering via WhatsApp was so effortless! They cleaned and pre-cut the seer fish into uniform steaks exactly as requested. Will order every week!",
  },
];

const culinaryInspirations = [
  {
    dish: "Traditional Sri Lankan Crab Curry",
    subtitle: "Lagoon Mud Crab • Thick Roasted Curry & Coconut Milk",
    prepTime: "35 mins",
    difficulty: "Medium",
    image: "/images/products/crab.jpg",
  },
  {
    dish: "Garlic Butter Jumbo Tiger Prawns",
    subtitle: "Lagoon Prawns • Sea Salt, Crushed Garlic & Fresh Lime",
    prepTime: "15 mins",
    difficulty: "Easy",
    image: "/images/products/prawn.jpg",
  },
  {
    dish: "Kalpitiya Seer Fish Steaks (Surumai)",
    subtitle: "Pan-Seared or Classic Ambul Thiyal with Goraka",
    prepTime: "25 mins",
    difficulty: "Easy",
    image: "/images/products/seer-fish.jpg",
  },
];

export default function HomePage() {
  const homeRef = useRef(null);
  const { products } = useProducts();
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedDistrict, setSelectedDistrict] = useState(DEFAULT_DISTRICT);
  const [activeFilterTab, setActiveFilterTab] = useState("all");

  useEffect(() => {
    const revealItems = homeRef.current?.querySelectorAll("[data-reveal]");
    if (!revealItems?.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = heroSlides[activeSlide];

  // Filter products by tab
  const filteredProducts = useMemo(() => {
    if (activeFilterTab === "all") return products.slice(0, 8);
    if (activeFilterTab === "shellfish") {
      return products.filter((p) =>
        ["Prawn", "Crab", "Lobster"].includes(p.category),
      );
    }
    if (activeFilterTab === "prime-fish") {
      return products.filter((p) =>
        ["Tuna", "Seer Fish", "Barramundi", "Sail Fish", "Skipjack Tuna"].includes(
          p.category,
        ),
      );
    }
    if (activeFilterTab === "squid") {
      return products.filter((p) =>
        ["Squid", "Cuttle Fish"].includes(p.category),
      );
    }
    return products.slice(0, 8);
  }, [products, activeFilterTab]);

  // Delivery speed info based on selected district
  const isPuttalam = selectedDistrict === "Puttalam";
  const isWesternProvince = ["Colombo", "Gampaha", "Kalutara"].includes(
    selectedDistrict,
  );

  return (
    <div ref={homeRef} className="overflow-hidden">
      {/* ========================================================
          1. HERO SECTION - PREMIUM OCEAN ATMOSPHERE
      ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#04191d] via-[#06272b] to-[#082f34] text-white">
        {/* Background ambient radial orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(117,213,204,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(247,106,43,0.18),transparent_35%)]" />
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-wave" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          {/* Left Column: Headline & Value Proposition */}
          <div className="relative z-10">
            {/* Artisanal Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-coral-400/40 bg-coral-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-coral-200 backdrop-blur-md shadow-[0_8px_20px_rgba(247,106,43,0.18)]">
              <Sparkles size={13} className="text-coral-400 animate-pulse" />
              <span>Direct from Kalpitiya Harbor, Sri Lanka</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Ocean-Fresh Seafood,{" "}
              <span className="gradient-ocean-text">Delivered Chilled</span> to
              Your Door.
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200/90 sm:text-lg">
              Experience the unmatched richness of Kalpitiya coastal waters.
              Landed daily, cleaned, and packed with sub-zero ice technology
              across all 25 districts of Sri Lanka.
            </p>

            {/* Quick Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/products"
                className="btn-primary hover-lift flex items-center gap-2 shadow-[0_12px_28px_rgba(247,106,43,0.35)]"
              >
                <span>{t("Shop Fresh Seafood")}</span>
                <ArrowRight size={17} />
              </Link>

              <a
                href={generalOrderLink()}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary hover-lift flex items-center gap-2 border-emerald-400/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-600 hover:text-white"
              >
                <MessageCircle size={18} className="text-emerald-400" />
                <span>{t("Order on WhatsApp")}</span>
              </a>
            </div>

            {/* Quick trending seafood tags */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                Trending:
              </span>
              {[
                { name: "Jumbo Prawns", cat: "Prawn" },
                { name: "Lagoon Crab", cat: "Crab" },
                { name: "Yellowfin Tuna", cat: "Tuna" },
                { name: "Seer Fish", cat: "Seer Fish" },
                { name: "Rock Lobster", cat: "Lobster" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={`/products?category=${encodeURIComponent(item.cat)}`}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200 transition hover:border-coral-400 hover:bg-white/10 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Key Metric Highlights */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="stat-card hover-lift">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                  Landings
                </p>
                <p className="mt-1 text-2xl font-bold text-white">Daily</p>
                <p className="text-[10px] text-emerald-300">0% Formalin</p>
              </div>

              <div className="stat-card hover-lift">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                  Origin
                </p>
                <p className="mt-1 text-2xl font-bold text-white">Kalpitiya</p>
                <p className="text-[10px] text-teal-300">Harbor Catch</p>
              </div>

              <div className="stat-card hover-lift">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                  Coverage
                </p>
                <p className="mt-1 text-2xl font-bold text-white">25 Districts</p>
                <p className="text-[10px] text-coral-300">Nationwide</p>
              </div>

              <div className="stat-card hover-lift">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                  Rating
                </p>
                <p className="mt-1 flex items-center gap-1 text-2xl font-bold text-white">
                  4.9 <Star size={16} className="fill-amber-400 text-amber-400" />
                </p>
                <p className="text-[10px] text-amber-300">1,200+ Reviews</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Slider & Interactive Showcase */}
          <div className="relative z-10 w-full max-w-[560px] justify-self-center lg:justify-self-end">
            <div className="hero-visual">
              <div className="hero-slide-track hero-image-shell shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/15">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.title}
                    className={`hero-slide ${index === activeSlide ? "active" : ""}`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  </div>
                ))}

                {/* Gradient shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#061e23] via-[#061e23]/30 to-transparent" />

                {/* Slide Info Overlay */}
                <div className="hero-slide-info">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-coral-300">
                      {currentSlide.label}
                    </p>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                      {currentSlide.tag}
                    </span>
                  </div>

                  <div className="mt-2 flex items-end justify-between gap-4">
                    <p className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                      {currentSlide.title}
                    </p>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur-md">
                      <MapPin size={12} className="text-coral-400" />
                      {currentSlide.badge}
                    </span>
                  </div>
                </div>

                {/* Dot Switchers */}
                <div className="hero-dots" aria-label="Hero slide switcher">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.title}
                      type="button"
                      aria-label={`View ${slide.title}`}
                      className={`hero-dot ${index === activeSlide ? "active" : ""}`}
                      onClick={() => setActiveSlide(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Live Photo Badges */}
              <div className="floating-photo floating-photo-left">
                <Image
                  src="/images/products/lobster.jpg"
                  alt="Live Spiny Lobster"
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <div className="floating-tag">
                  <span>Rock Lobster</span>
                </div>
              </div>

              <div className="floating-photo floating-photo-right">
                <Image
                  src="/images/products/crab.jpg"
                  alt="Lagoon Mud Crab"
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <div className="floating-tag">
                  <span>Mud Crab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. REAL-TIME LIVE HARVEST MARQUEE TICKER
      ======================================================== */}
      <div className="relative border-y border-sea-200/40 bg-gradient-to-r from-sea-900 via-sea-800 to-sea-900 py-3 text-white overflow-hidden shadow-inner">
        <div className="animate-marquee items-center gap-8 text-xs font-semibold uppercase tracking-wider text-sea-100">
          {[1, 2].map((group) => (
            <div key={group} className="flex items-center gap-8 shrink-0">
              <span className="flex items-center gap-2 text-coral-300">
                <Flame size={15} /> TODAY'S HARBOR LANDINGS:
              </span>
              <span className="flex items-center gap-1.5">
                🦐 Jumbo Tiger Prawns (Issa)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                🦀 Wild Lagoon Mud Crabs (Kakuluwa)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                🐟 Fresh Yellowfin Tuna (Kelawalla)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                🥩 Premium Seer Fish (Surumai)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                🦑 Ocean Squid & Cuttlefish (Della / Dallo)
              </span>
              <span>•</span>
              <span className="text-emerald-300 font-bold">
                100% Chemical & Formalin Free
              </span>
              <span>•</span>
              <span className="text-sky-300">
                Islandwide Cold-Chain Delivery across 25 Districts
              </span>
              <span>•</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          3. CATEGORY SELECTOR CAROUSEL
      ======================================================== */}
      <div data-reveal>
        <CategoryNav />
      </div>

      {/* ========================================================
          4. FEATURED CATCHES WITH INTERACTIVE FILTER TABS
      ======================================================== */}
      <section data-reveal className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        {/* Header and Filter Controls */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="section-rule">
            <span className="section-kicker">Ocean-Fresh Catch</span>
            <h2 className="section-title mt-2">
              {t("Fresh Catch This Week")}
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-lg">
              Selected by hand at Kalpitiya Harbor each dawn, custom cleaned, and
              packed with food-grade ice to your doorstep.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Catches" },
              { id: "shellfish", label: "🦐 Prawns & Crabs" },
              { id: "prime-fish", label: "🐟 Prime Fish" },
              { id: "squid", label: "🦑 Squid & Cuttlefish" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilterTab(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  activeFilterTab === tab.id
                    ? "bg-sea-900 text-white shadow-md shadow-sea-900/20"
                    : "bg-white text-gray-600 hover:bg-sea-50 hover:text-sea-900 border border-slate-200/80"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <Link
              href="/products"
              className="btn-outline hidden sm:inline-flex !py-2 text-xs hover-lift ml-2"
            >
              {t("View All (14)")}
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((p, index) => (
            <div
              key={p.slug}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="btn-outline inline-flex w-full items-center justify-center text-xs"
          >
            {t("View All 14 Seafood Products")}
          </Link>
        </div>
      </section>

      {/* ========================================================
          5. ARTISANAL 4-PILLAR QUALITY ASSURANCE
      ======================================================== */}
      <div data-reveal>
        <TrustSection />
      </div>

      {/* ========================================================
          6. INTERACTIVE DISTRICT DELIVERY & COLD-CHAIN CALCULATOR
      ======================================================== */}
      <section data-reveal className="bg-gradient-to-b from-[#eef7f6] to-[#f4f9f8] py-16 border-y border-sea-200/40">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="section-kicker">Islandwide Coverage</span>
            <h2 className="section-title mt-2">
              Check Delivery to Your District
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We dispatch nationwide with chilled cold-chain insulation. Find your
              estimated delivery schedule and shipping details below.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Left: Interactive District Selector Box */}
            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_20px_45px_rgba(6,39,43,0.06)]">
              <label className="block text-xs font-bold uppercase tracking-wider text-sea-800">
                Select Your District (Sri Lanka)
              </label>

              <div className="mt-3 relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full rounded-2xl border border-sea-200 bg-sea-50/50 px-4 py-3.5 text-base font-semibold text-sea-900 outline-none transition focus:border-sea-500 focus:bg-white"
                >
                  {SRI_LANKA_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district} {district === "Puttalam" ? "★ (Home Base)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Result Card */}
              <div className="mt-6 rounded-2xl border border-sea-100 bg-sea-50/70 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-coral-500" size={18} />
                    <span className="text-sm font-bold text-sea-900">
                      {selectedDistrict} District
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isPuttalam
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-sea-200 text-sea-800"
                    }`}
                  >
                    {isPuttalam
                      ? "⚡ Same-Day / Fastest"
                      : isWesternProvince
                        ? "🚚 Next-Day Morning"
                        : "📦 24-36h Cold Delivery"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-white p-3 border border-sea-100">
                    <p className="text-gray-400 font-medium">Delivery Fee</p>
                    <p className="mt-1 font-bold text-sea-900">
                      FREE over Rs. 5,000
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Standard: Rs. 350
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-sea-100">
                    <p className="text-gray-400 font-medium">Packaging Type</p>
                    <p className="mt-1 font-bold text-emerald-700">
                      Sub-Zero Ice Pack
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Insulated thermal box
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-sea-700">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>
                    100% money-back freshness guarantee on arrival in{" "}
                    <strong>{selectedDistrict}</strong>.
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="btn-primary flex-1 !rounded-full !py-2.5 text-xs text-center justify-center"
                >
                  Order For {selectedDistrict}
                </Link>
                <Link
                  href="/delivery-areas"
                  className="btn-outline flex-1 !rounded-full !py-2.5 text-xs text-center justify-center"
                >
                  View All 25 Districts
                </Link>
              </div>
            </div>

            {/* Right: Why Cold-Chain Matters */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-sea-200/60 bg-white/80 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sea-100 text-sea-700">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-sea-950">
                      Harvested at Dawn
                    </h4>
                    <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                      Fishermen dock at Kalpitiya between 5:00 AM – 7:00 AM.
                      Your order is selected directly from the fresh morning haul.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-sea-200/60 bg-white/80 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral-100 text-coral-600">
                    <Package size={20} />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-sea-950">
                      Sealed Sub-Zero Thermal Box
                    </h4>
                    <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                      Seafood is stored in hygienic vacuum or leak-proof pouches,
                      surrounded by food-grade ice to maintain consistent 0–2°C.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-sea-200/60 bg-white/80 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-sea-950">
                      Zero Preservatives / Formalin
                    </h4>
                    <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                      Unlike ordinary wholesale fish markets, we never use
                      chemical preservatives or prolonged warehouse storage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. THE KALPITIYA HERITAGE & TRACEABILITY STORY
      ======================================================== */}
      <section data-reveal className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="story-panel grid gap-8 overflow-hidden rounded-[2.2rem] p-6 shadow-card lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div className="flex flex-col justify-center">
            <span className="section-kicker">The Kalpitiya Difference</span>
            <h2 className="section-title mt-2 max-w-lg">
              Where the Indian Ocean Meets the Dutch Bay Lagoon.
            </h2>
            <p className="story-copy mt-4 max-w-xl text-base leading-relaxed">
              Kalpitiya's geographic peninsula is world-renowned for having some
              of the richest and cleanest marine ecosystems in South Asia. The
              interplay of calm mangrove lagoons and open deep sea creates
              unrivaled flavor, firm flesh, and nutrient density.
            </p>

            <div className="mt-6 space-y-3">
              {[
                {
                  bold: "Artisanal Line & Trap Catch:",
                  text: "Sustainably harvested without destructive industrial trawling.",
                },
                {
                  bold: "Custom Butchery on Demand:",
                  text: "Steaks, fillets, curry pieces, cleaned & gutted options.",
                },
                {
                  bold: "Direct WhatsApp Photo Confirmation:",
                  text: "See photos of today's catch before it leaves the harbor.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="story-badge mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                    <BadgeCheck size={14} />
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700">
                    <strong className="text-sea-950">{item.bold}</strong>{" "}
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/about" className="btn-primary hover-lift">
                Discover Our Story
              </Link>
              <a
                href={generalOrderLink()}
                target="_blank"
                rel="noreferrer"
                className="btn-outline hover-lift flex items-center gap-1.5"
              >
                <MessageCircle size={16} /> Chat With Sourcing Team
              </a>
            </div>
          </div>

          <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-[1.8rem] shadow-lg lg:h-full">
            <Image
              src="/images/products/transport.jpg"
              alt="RSN Seafood Kalpitiya Transportation and Chilled Storage"
              fill
              className="object-cover transition duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061d22]/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 p-4 backdrop-blur-md border border-white/40">
              <p className="text-xs font-bold uppercase tracking-wider text-coral-600">
                Harbor to Doorstep
              </p>
              <p className="text-sm font-semibold text-sea-950 mt-0.5">
                Chilled transport vehicles operating daily out of Kalpitiya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. HOW IT WORKS - 3 SIMPLE STEPS
      ======================================================== */}
      <section data-reveal className="bg-tide/60 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 text-center">
            <span className="section-kicker">Simple & Seamless</span>
            <h2 className="section-title mt-2">
              How Your Fresh Seafood Arrives
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
              From morning harbor selection to your kitchen table in three easy
              steps.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map(({ number, title, text, icon: Icon }, index) => (
              <div
                key={number}
                className="group relative rounded-[2rem] border border-sea-200/80 bg-white/90 p-8 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-sea-400 hover:shadow-2xl"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-bold text-coral-500/80">
                    {number}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sea-50 text-sea-700 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl font-bold text-sea-950">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          9. CULINARY INSPIRATIONS & RECIPE IDEAS
      ======================================================== */}
      <section data-reveal className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="section-rule">
            <span className="section-kicker">Culinary Inspiration</span>
            <h2 className="section-title mt-2">
              Cook Like a Coastal Chef
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Transform fresh Kalpitiya seafood into restaurant-quality Sri Lankan feasts.
            </p>
          </div>
          <Link href="/products" className="btn-outline hidden sm:inline-flex text-xs">
            Explore All Ingredients
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {culinaryInspirations.map((recipe) => (
            <div
              key={recipe.dish}
              className="card overflow-hidden group flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-sea-100">
                <Image
                  src={recipe.image}
                  alt={recipe.dish}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-sea-900 uppercase">
                  {recipe.prepTime}
                </span>
                <span className="absolute bottom-3 left-3 text-white text-xs font-semibold">
                  Difficulty: {recipe.difficulty}
                </span>
              </div>

              <div className="p-5 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-sea-950 group-hover:text-sea-600 transition-colors">
                    {recipe.dish}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">
                    {recipe.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link
                    href="/products"
                    className="font-bold text-coral-600 hover:text-coral-700 flex items-center gap-1"
                  >
                    <span>Get Fresh Seafood</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          10. VERIFIED CUSTOMER REVIEWS & TESTIMONIALS
      ======================================================== */}
      <section data-reveal className="bg-slate-50 py-16 border-t border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="section-kicker">Customer Trust</span>
            <h2 className="section-title mt-2">
              Loved by Foodies Across Sri Lanka
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              From family weekend feasts to boutique coastal resorts.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((tItem) => (
              <div
                key={tItem.name}
                className="rounded-[1.8rem] border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(tItem.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-700 italic">
                  &ldquo;{tItem.comment}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sea-100 text-sm font-bold text-sea-800">
                    {tItem.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-sea-950">
                      {tItem.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {tItem.role} • {tItem.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          11. ISLANDWIDE DELIVERY BANNER CTA
      ======================================================== */}
      <section data-reveal className="relative overflow-hidden bg-gradient-to-r from-[#04191d] via-[#06272b] to-[#04191d] py-16 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(117,213,204,0.15),transparent_60%)]" />

        <div className="relative mx-auto max-w-5xl px-4 text-center lg:px-8">
          <span className="rounded-full bg-coral-500/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-coral-300 border border-coral-500/30">
            Islandwide Service
          </span>

          <h2 className="section-title mt-4 text-white text-3xl sm:text-4xl lg:text-5xl">
            {t("Islandwide Seafood Delivery")}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-300">
            Delivery available across all 25 districts of Sri Lanka — with
            Puttalam as our home base and fastest delivery area. Chilled and
            dispatched within 24 hours.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {SRI_LANKA_DISTRICTS.map((d) => (
              <span
                key={d}
                className={`rounded-xl border px-3 py-1.5 text-xs font-medium ${
                  d === "Puttalam"
                    ? "border-coral-400 bg-coral-500/20 text-white font-bold"
                    : "border-white/10 bg-white/5 text-slate-300"
                }`}
              >
                {d} {d === "Puttalam" ? "★" : ""}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/delivery-areas"
              className="btn-primary hover-lift px-8"
            >
              {t("See All 25 Districts")}
            </Link>

            <a
              href={generalOrderLink()}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary hover-lift flex items-center gap-2"
            >
              <MessageCircle size={18} />
              <span>Order on WhatsApp Now</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          12. FREQUENTLY ASKED QUESTIONS
      ======================================================== */}
      <section data-reveal className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <div className="text-center mb-8">
          <span className="section-kicker">Got Questions?</span>
          <h2 className="section-title mt-2">
            {t("Frequently Asked Questions")}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Everything you need to know about our sourcing, packaging, and delivery.
          </p>
        </div>

        <div className="mt-8">
          <FaqAccordion />
        </div>

        <div className="mt-10 rounded-2xl bg-sea-50/80 p-6 text-center border border-sea-100">
          <p className="text-sm font-semibold text-sea-900">
            Have a custom requirement, restaurant supply inquiry, or bulk order?
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Our Kalpitiya team is on standby on WhatsApp to assist you immediately.
          </p>
          <a
            href={generalOrderLink()}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-4 inline-flex items-center gap-2 !py-2.5 text-xs"
          >
            <MessageCircle size={15} /> Chat with WhatsApp Support: {WHATSAPP_DISPLAY}
          </a>
        </div>
      </section>
    </div>
  );
}
