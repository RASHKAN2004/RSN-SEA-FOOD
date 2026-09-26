"use client";

import { useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  ShoppingCart,
  Minus,
  Plus,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  MapPin,
  Truck,
  Sparkles,
  ArrowRight,
  Fish,
  Clock,
  Package,
} from "lucide-react";
import { formatLKR } from "@/data/products";
import { useProducts } from "@/lib/useProducts";
import { useCart } from "@/context/CartContext";
import {
  generalOrderLink,
  productOrderLink,
  WHATSAPP_DISPLAY,
} from "@/lib/whatsapp";
import DistrictSelector from "@/components/DistrictSelector";
import { DEFAULT_DISTRICT } from "@/lib/districts";
import { signInPath, useCustomerAuth } from "@/lib/useCustomerAuth";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const { user, loading: authLoading } = useCustomerAuth();
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState(null);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [district, setDistrict] = useState(DEFAULT_DISTRICT);
  const [added, setAdded] = useState(false);

  if (loading && !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-sea-600" size={36} />
        <p className="text-sm font-medium text-gray-500">
          Loading fresh catch details...
        </p>
      </div>
    );
  }

  if (!loading && !product) return notFound();
  if (!product) return null;

  const currentImg = selectedImage || product.image;
  const size = product.sizes?.[sizeIdx];
  const unitPrice = Math.round(product.price * (size?.priceMultiplier || 1));
  const total = unitPrice * qty;

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  function handleAddToCart() {
    if (authLoading) return;
    if (!user) {
      router.push(signInPath(`/products/${product.slug}`));
      return;
    }
    addItem(product, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const isPuttalam = district === "Puttalam";

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-slate-200/80 bg-white py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-xs font-medium text-gray-500 lg:px-8">
          <Link href="/" className="hover:text-sea-700 transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-sea-700 transition">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-sea-700 transition"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-semibold text-sea-950 truncate max-w-[200px]">
            {product.name}
          </span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {/* ========================================================
              LEFT COLUMN: High-Resolution Gallery
          ======================================================== */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-sea-50 to-tide/40 shadow-[0_16px_40px_rgba(6,39,43,0.08)]">
              <Image
                src={currentImg}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061d22]/40 via-transparent to-transparent pointer-events-none" />

              {/* Freshness Badge Floating */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sea-900 shadow-md backdrop-blur-md border border-white/50">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {product.freshnessGrade}
                </span>
              </div>

              {/* Origin Tag */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#061d22]/75 px-3 py-1 text-xs font-medium text-emerald-300 shadow-md backdrop-blur-md border border-emerald-500/20">
                  <MapPin size={13} className="text-coral-400" />
                  Kalpitiya Waters
                </span>
              </div>
            </div>

            {/* Thumbnail Selection Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {(product.gallery || [product.image]).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                    currentImg === img
                      ? "border-coral-500 ring-2 ring-coral-400/40 scale-105"
                      : "border-slate-200/80 hover:border-sea-400 opacity-75 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} preview ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Cold Chain Guarantee Card */}
            <div className="rounded-2xl border border-sea-200/70 bg-white p-5 shadow-sm space-y-3">
              <h4 className="flex items-center gap-2 font-display text-lg font-bold text-sea-950">
                <ShieldCheck size={20} className="text-teal-600" />
                Kalpitiya Cold-Chain Promise
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>100% Chemical & Formalin Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>Sub-Zero Ice Pack Box</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>Landed within 24 Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>Custom Cleaning on Request</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Product Options & Purchase Controls
          ======================================================== */}
          <div className="flex flex-col">
            {/* Category & Grade */}
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sea-100 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-sea-800">
                {product.category}
              </span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 size={14} /> {product.availability}
              </span>
            </div>

            {/* Title & Local Name */}
            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-sea-950 leading-tight">
              {product.name}
            </h1>

            {product.localName && (
              <p className="mt-1 text-sm font-semibold text-coral-600">
                Local Name:{" "}
                <span className="font-normal text-gray-600">
                  {product.localName}
                </span>
              </p>
            )}

            {/* Description */}
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mt-6 border-t border-slate-200/80 pt-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-sea-900">
                  Select Pack Size / Weight
                </label>
                <span className="text-xs text-gray-500">
                  Minimum Order: {product.minimumQuantity}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2.5">
                {product.sizes.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setSizeIdx(i)}
                    className={`rounded-2xl border px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                      i === sizeIdx
                        ? "border-sea-700 bg-sea-900 text-white shadow-md shadow-sea-900/20"
                        : "border-slate-200 bg-white text-sea-900 hover:border-sea-400 hover:bg-sea-50"
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="ml-2 text-xs font-normal opacity-80">
                      {formatLKR(
                        Math.round(product.price * (s.priceMultiplier || 1)),
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Price Summary */}
            <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sea-900">
                  Quantity
                </span>

                <div className="flex items-center gap-3 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 shadow-inner">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-sea-900 hover:bg-white transition"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-sea-950">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-sea-900 hover:bg-white transition"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Amount:
                </span>
                <div className="text-right">
                  <span className="font-display text-3xl font-bold text-coral-600">
                    {formatLKR(total)}
                  </span>
                  <p className="text-[11px] text-gray-500">
                    {qty} × {size?.label} ({formatLKR(unitPrice)} each)
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery District Selector */}
            <div className="mt-6">
              <DistrictSelector
                value={district}
                onChange={setDistrict}
                label="Delivery District (All 25 Districts Available)"
              />
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                <Truck size={14} className="text-sea-600" />
                <span>
                  {isPuttalam
                    ? "Fastest Delivery: Puttalam (Home base — arrives same-day)"
                    : `Dispatches directly to ${district} via thermal cold-pack packaging.`}
                </span>
              </p>
            </div>

            {/* Action Buttons: Add to Cart & WhatsApp Order */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={authLoading}
                className="btn-primary flex-1 !rounded-full !py-3.5 text-sm font-bold shadow-lg shadow-coral-500/25"
              >
                <ShoppingCart size={18} />
                <span>{added ? "✓ Added to Cart!" : "Add to Cart"}</span>
              </button>

              <a
                href={
                  user
                    ? productOrderLink({
                        name: product.name,
                        localName: product.localName,
                        quantity: `${qty} x ${size?.label}`,
                        district,
                      })
                    : undefined
                }
                onClick={(event) => {
                  if (!user) {
                    event.preventDefault();
                    router.push(signInPath(`/products/${product.slug}`));
                  }
                }}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 px-6 py-3.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-600 hover:text-white shadow-sm"
              >
                <MessageCircle
                  size={18}
                  className="text-emerald-600 group-hover:text-white"
                />
                <span>Order via WhatsApp</span>
              </a>
            </div>

            {/* WhatsApp Direct Help */}
            <p className="mt-3 text-center text-xs text-gray-500">
              Need custom cleaning, whole fish, or slices?{" "}
              <a
                href={generalOrderLink()}
                target="_blank"
                rel="noreferrer"
                className="text-coral-600 underline font-semibold"
              >
                Chat with Kalpitiya Team on WhatsApp
              </a>
            </p>
          </div>
        </div>

        {/* ========================================================
            RECOMMENDED SEAFOOD CATCHES
        ======================================================== */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-slate-200/80 pt-12">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="section-kicker">
                  Recommended Fresh Catches
                </span>
                <h3 className="section-title mt-1 text-2xl sm:text-3xl">
                  You May Also Like
                </h3>
              </div>
              <Link
                href="/products"
                className="btn-outline hidden sm:inline-flex text-xs"
              >
                View All Seafood
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
