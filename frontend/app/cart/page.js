'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatLKR } from '@/data/products';
import { fullOrderLink } from '@/lib/whatsapp';
import { DEFAULT_DISTRICT } from '@/lib/districts';

const DELIVERY_FREE_THRESHOLD = 5000;
const DELIVERY_FEE = 350;

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const deliveryFee = items.length === 0 ? 0 : subtotal >= DELIVERY_FREE_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-8">
        <ShoppingBag size={48} className="mx-auto text-sea-300" />
        <h1 className="section-title mt-4">Your cart is empty</h1>
        <p className="mt-2 text-sm text-gray-500">Browse our fresh catch and add something delicious.</p>
        <Link href="/products" className="btn-primary mt-6 inline-flex">Shop Seafood</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <h1 className="section-title mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y divide-sea-100 rounded-2xl border border-sea-100 bg-white">
            {items.map((item) => (
              <div key={item.key} className="flex items-center gap-4 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sea-50">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sea-900">
                    {item.name}{item.localName && <span className="text-gray-500"> / {item.localName}</span>}
                  </p>
                  <p className="text-xs text-gray-500">{item.sizeLabel} • {formatLKR(item.unitPrice)} each</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-gray-300 px-2 py-1">
                  <button onClick={() => updateQty(item.key, item.qty - 1)} aria-label="Decrease quantity"><Minus size={14} /></button>
                  <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                  <button onClick={() => updateQty(item.key, item.qty + 1)} aria-label="Increase quantity"><Plus size={14} /></button>
                </div>
                <p className="w-20 text-right text-sm font-bold text-sea-900">{formatLKR(item.unitPrice * item.qty)}</p>
                <button onClick={() => removeItem(item.key)} aria-label="Remove item" className="text-gray-400 hover:text-coral-600">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-sea-100 bg-white p-5">
          <p className="font-display text-lg font-bold text-sea-900">Order Summary</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatLKR(subtotal)}</span></div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'Free' : formatLKR(deliveryFee)}</span>
            </div>
            {deliveryFee > 0 && (
              <p className="text-xs text-sea-600">Free delivery on orders over {formatLKR(DELIVERY_FREE_THRESHOLD)}</p>
            )}
            <div className="flex justify-between border-t border-sea-100 pt-2 text-base font-bold text-sea-900">
              <span>Grand Total</span><span>{formatLKR(grandTotal)}</span>
            </div>
          </div>

          <Link href="/checkout" className="btn-primary mt-5 w-full">Proceed to Checkout</Link>
          <a
            href={fullOrderLink({
              items: items.map((i) => ({ name: i.name, localName: i.localName, quantity: `${i.qty} x ${i.sizeLabel}` })),
              district: DEFAULT_DISTRICT,
            })}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-green-500 py-2.5 text-sm font-semibold text-green-600 transition hover:bg-green-50"
          >
            <MessageCircle size={18} /> Order via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
