"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShoppingCart, Star, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatLKR } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { productOrderLink } from "@/lib/whatsapp";
import { useLanguage } from "@/context/LanguageContext";
import { signInPath, useCustomerAuth } from "@/lib/useCustomerAuth";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const router = useRouter();
  const { user, loading: authLoading } = useCustomerAuth();

  function requireCustomer(action) {
    if (authLoading) return;
    if (!user) {
      router.push(signInPath(`/products/${product.slug}`));
      return;
    }
    action();
  }

  // Determine freshness badge style
  const grade = product.freshnessGrade || "Daily Catch";
  let gradeClass = "badge-daily";
  if (grade === "Export Grade") gradeClass = "badge-export";
  else if (grade === "Lagoon Sourced") gradeClass = "badge-lagoon";

  return (
    <div className="card product-card group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white/90 shadow-[0_10px_30px_rgba(6,39,43,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-sea-300 hover:shadow-[0_20px_45px_rgba(6,39,43,0.12)]">
      {/* Product Image Frame */}
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden">
        <div className="product-image-frame relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-sea-50 to-tide/50">
          <Image
            src={product.image}
            alt={`${product.name}${product.localName ? " / " + product.localName : ""}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="product-image object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061d22]/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

          {/* Freshness Grade Badge */}
          <span
            className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${gradeClass}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            {t(grade)}
          </span>

          {/* Availability Pill */}
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#061d22]/70 px-2 py-0.5 text-[9px] font-medium text-emerald-300 backdrop-blur-md border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Kalpitiya
          </span>
        </div>
      </Link>

      {/* Card Details Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Rating and Local Name */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>4.9</span>
            <span className="text-gray-400 font-normal">(40+)</span>
          </div>

          {product.localName && (
            <span className="rounded-md bg-sea-50/80 px-2 py-0.5 text-[10px] font-medium text-sea-700 border border-sea-100/60 truncate max-w-[130px]">
              {product.localName}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`} className="mt-2 group/title">
          <h3 className="font-display text-lg sm:text-xl font-bold leading-snug text-sea-950 transition-colors group-hover/title:text-sea-600 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Minimum Quantity / Pack info */}
        <p className="mt-1 text-xs text-gray-500">
          {t("Minimum Quantity:")} <span className="font-semibold text-gray-700">{product.minimumQuantity}</span>
        </p>

        {/* Price display */}
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{t("Starting from")}</span>
          <span className="font-display text-lg sm:text-xl font-bold text-coral-600">
            {formatLKR(product.price)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col gap-2 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-sea-200 bg-white/90 py-2 px-3 text-xs font-semibold text-sea-900 shadow-sm transition hover:border-sea-400 hover:bg-sea-50 active:scale-95"
            >
              <Eye size={13} className="text-sea-600" />
              {t("View")}
            </Link>

            <button
              onClick={() =>
                requireCustomer(() => addItem(product, product.sizes?.[0]))
              }
              disabled={authLoading}
              className="btn-primary !rounded-full !py-2 !px-3 text-xs font-semibold tracking-wide"
              aria-label="Add to cart"
            >
              <ShoppingCart size={13} /> {t("Add")}
            </button>
          </div>

          <a
            href={
              user
                ? productOrderLink({
                    name: product.name,
                    localName: product.localName,
                    quantity: product.minimumQuantity,
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
            className="flex items-center justify-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-50/70 py-2 px-3 text-xs font-semibold text-emerald-800 transition duration-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-sm active:scale-95"
          >
            <MessageCircle size={14} className="text-emerald-600 group-hover:text-white" />
            <span>{t("WhatsApp Order")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

