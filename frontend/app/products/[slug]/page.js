'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { MessageCircle, ShoppingCart, Minus, Plus, ShieldCheck, Loader2 } from 'lucide-react';
import { formatLKR } from '@/data/products';
import { useProducts } from '@/lib/useProducts';
import { useCart } from '@/context/CartContext';
import { productOrderLink } from '@/lib/whatsapp';
import DistrictSelector from '@/components/DistrictSelector';
import { DEFAULT_DISTRICT } from '@/lib/districts';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();

  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [district, setDistrict] = useState(DEFAULT_DISTRICT);
  const [added, setAdded] = useState(false);

  if (loading && !product) {
    return <div className="flex justify-center py-24"><Loader2 className="animate-spin text-sea-600" size={28} /></div>;
  }
  if (!loading && !product) return notFound();
  if (!product) return null;

  const size = product.sizes?.[sizeIdx];
  const unitPrice = Math.round(product.price * (size?.priceMultiplier || 1));
  const total = unitPrice * qty;

  function handleAddToCart() {
    addItem(product, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-sea-50 sm:h-96">
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="mt-3 flex gap-2">
            {(product.gallery || [product.image]).map((img, i) => (
              <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-sea-100">
                <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="64px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <span className="rounded-full bg-sea-100 px-3 py-1 text-xs font-semibold text-sea-700">{product.freshnessGrade}</span>
          <h1 className="mt-3 font-display text-2xl font-bold text-sea-900 sm:text-3xl">
            {product.name}{product.localName && <span className="text-gray-500"> / {product.localName}</span>}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{product.description}</p>

          <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
            <ShieldCheck size={16} /> {product.availability}
          </div>

          {/* Size selector */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-sea-900">Available Sizes</p>
            <div className="flex gap-2">
              {product.sizes.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setSizeIdx(i)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    i === sizeIdx ? 'border-sea-600 bg-sea-600 text-white' : 'border-gray-300 text-gray-600 hover:border-sea-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">Minimum Order Quantity: {product.minimumQuantity}</p>
          <p className="mt-1 text-2xl font-bold text-coral-600">{formatLKR(unitPrice)} <span className="text-sm font-normal text-gray-500">/ {size?.label}</span></p>

          {/* Quantity selector */}
          <div className="mt-5 flex items-center gap-4">
            <p className="text-sm font-semibold text-sea-900">Quantity</p>
            <div className="flex items-center gap-3 rounded-full border border-gray-300 px-3 py-1.5">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={16} /></button>
              <span className="w-6 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity"><Plus size={16} /></button>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-500">Total: <span className="font-bold text-sea-900">{formatLKR(total)}</span></p>

          <div className="mt-4 max-w-xs">
            <DistrictSelector value={district} onChange={setDistrict} label="Delivery District" />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleAddToCart} className="btn-primary flex-1">
              <ShoppingCart size={18} /> {added ? 'Added!' : 'Add to Cart'}
            </button>
            <a
              href={productOrderLink({ name: product.name, localName: product.localName, quantity: `${qty} x ${size?.label}`, district })}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-green-500 py-2.5 text-sm font-semibold text-green-600 transition hover:bg-green-50"
            >
              <MessageCircle size={18} /> Order via WhatsApp
            </a>
          </div>

          <p className="mt-6 rounded-xl bg-sea-50 p-4 text-xs text-sea-700">
            Freshly sourced seafood, carefully handled and packed to maintain quality and freshness until delivery.
          </p>
        </div>
      </div>
    </section>
  );
}
