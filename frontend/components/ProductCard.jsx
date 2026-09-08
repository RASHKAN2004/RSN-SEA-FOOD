"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { formatLKR } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { productOrderLink } from "@/lib/whatsapp";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { t } = useLanguage();

  return (
    <div className="card product-card group flex h-full flex-col overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="product-image-frame relative w-full overflow-hidden bg-tide">
          <Image
            src={product.image}
            alt={`${product.name}${product.localName ? " / " + product.localName : ""}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="product-image object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="product-image-shade absolute inset-0" />
          <span className="absolute left-3 top-3 bg-shell px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink shadow">
            {t(product.freshnessGrade || "Daily Catch")}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-xl font-bold leading-none text-ink">
            {product.name}
            {product.localName && (
              <span className="text-gray-500"> / {product.localName}</span>
            )}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-gray-500">
          {t("Minimum Quantity:")} {product.minimumQuantity}
        </p>
        <p className="mt-2 text-sm font-bold text-coral-600">
          {t("Starting from")} {formatLKR(product.price)}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <div className="flex gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="btn-outline flex-1 !py-2 text-xs"
            >
              {t("View Product")}
            </Link>
            <button
              onClick={() => addItem(product, product.sizes?.[0])}
              className="btn-primary flex-1 !py-2 text-xs"
              aria-label="Add to cart"
            >
              <ShoppingCart size={14} /> {t("Add")}
            </button>
          </div>
          <a
            href={productOrderLink({
              name: product.name,
              localName: product.localName,
              quantity: product.minimumQuantity,
            })}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 border border-green-500 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-50"
          >
            <MessageCircle size={14} /> {t("WhatsApp Order")}
          </a>
        </div>
      </div>
    </div>
  );
}
