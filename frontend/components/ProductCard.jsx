'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { formatLKR } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { productOrderLink } from '@/lib/whatsapp';
import { useLanguage } from '@/context/LanguageContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { t } = useLanguage();

  return (
    <div className="card group overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-sea-50">
          <Image
            src={product.image}
            alt={`${product.name}${product.localName ? ' / ' + product.localName : ''}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-sea-700 shadow">
            {t(product.freshnessGrade || 'Daily Catch')}
          </span>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-base font-semibold text-sea-900">
            {product.name}
            {product.localName && <span className="text-gray-500"> / {product.localName}</span>}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-gray-500">{t('Minimum Quantity:')} {product.minimumQuantity}</p>
        <p className="mt-1 text-sm font-bold text-coral-600">{t('Starting from')} {formatLKR(product.price)}</p>

        <div className="mt-3 flex flex-col gap-2">
          <div className="flex gap-2">
            <Link href={`/products/${product.slug}`} className="btn-outline flex-1 !py-2 text-xs">
              {t('View Product')}
            </Link>
            <button
              onClick={() => addItem(product, product.sizes?.[0])}
              className="btn-primary flex-1 !py-2 text-xs"
              aria-label="Add to cart"
            >
              <ShoppingCart size={14} /> {t('Add')}
            </button>
          </div>
          <a
            href={productOrderLink({ name: product.name, localName: product.localName, quantity: product.minimumQuantity })}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-full border border-green-500 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-50"
          >
            <MessageCircle size={14} /> {t('WhatsApp Order')}
          </a>
        </div>
      </div>
    </div>
  );
}
