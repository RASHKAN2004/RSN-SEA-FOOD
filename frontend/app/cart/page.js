"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatLKR } from "@/data/products";
import { fullOrderLink } from "@/lib/whatsapp";
import { DEFAULT_DISTRICT } from "@/lib/districts";
import { useRouter } from "next/navigation";
import { signInPath, useCustomerAuth } from "@/lib/useCustomerAuth";

const DELIVERY_FREE_THRESHOLD = 5000;
const DELIVERY_FEE = 350;

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const router = useRouter();
  const { user, loading: authLoading } = useCustomerAuth();

  const deliveryFee =
    items.length === 0
      ? 0
      : subtotal >= DELIVERY_FREE_THRESHOLD
        ? 0
        : DELIVERY_FEE;
  const grandTotal = subtotal + deliveryFee;

  const freeDeliveryProgress = Math.min(
    100,
    Math.round((subtotal / DELIVERY_FREE_THRESHOLD) * 100),
  );
  const remainingForFreeDelivery = Math.max(0, DELIVERY_FREE_THRESHOLD - subtotal);

  function requireCustomer() {
    if (authLoading) return false;
    if (!user) {
      router.push(signInPath("/cart"));
      return false;
    }
    return true;
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center lg:px-8">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-sea-50 text-sea-400 mb-6 shadow-inner">
          <ShoppingBag size={48} />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-sea-950">
          Your Cart is Empty
        </h1>
        <p className="mt-3 text-sm text-gray-500 max-w-md mx-auto">
          You haven&apos;t added any fresh seafood yet. Browse our daily catch
          from Kalpitiya waters and get fresh seafood delivered to your door!
        </p>
        <Link href="/products" className="btn-primary mt-8 inline-flex !py-3.5 !px-8 text-sm">
          <span>Explore Fresh Catches</span>
          <ArrowRight size={17} />
        </Link>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Checkout Steps Navigation */}
      <div className="border-b border-slate-200/80 bg-white py-4">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold">
            <span className="flex items-center gap-2 text-coral-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-500 text-white text-xs">
                1
              </span>
              Review Cart
            </span>
            <span className="text-gray-300">———</span>
            <span className="flex items-center gap-2 text-gray-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs">
                2
              </span>
              Delivery Details
            </span>
            <span className="text-gray-300">———</span>
            <span className="flex items-center gap-2 text-gray-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs">
                3
              </span>
              Confirmation
            </span>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-sea-950 mb-6">
          Your Seafood Cart ({items.length} {items.length === 1 ? "item" : "items"})
        </h1>

        {/* Free Shipping Progress Indicator */}
        <div className="mb-8 rounded-2xl border border-sea-200/80 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
            <span className="flex items-center gap-2 text-sea-900">
              <Truck size={18} className="text-sea-600" />
              {remainingForFreeDelivery === 0 ? (
                <span className="text-emerald-600 font-bold">
                  🎉 Congratulations! You have unlocked FREE Islandwide Delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="text-coral-600">{formatLKR(remainingForFreeDelivery)}</strong> more for FREE Islandwide Delivery!
                </span>
              )}
            </span>
            <span className="text-xs text-gray-400 font-bold">
              {freeDeliveryProgress}%
            </span>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                remainingForFreeDelivery === 0
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                  : "bg-gradient-to-r from-coral-400 to-coral-600"
              }`}
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ========================================================
              LEFT COLUMN: Cart Items List
          ======================================================== */}
          <div className="lg:col-span-2 space-y-4">
            <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-sea-50 border border-slate-100 shadow-sm">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-display text-lg font-bold text-sea-950 hover:text-sea-600 transition"
                      >
                        {item.name}
                      </Link>
                      {item.localName && (
                        <p className="text-xs text-coral-600 font-medium">
                          {item.localName}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Pack Size: <span className="font-semibold text-gray-700">{item.sizeLabel}</span> • {formatLKR(item.unitPrice)} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 shadow-inner">
                      <button
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        aria-label="Decrease quantity"
                        className="text-sea-900 hover:text-coral-600 transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-sea-950">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.key, item.qty + 1)}
                        aria-label="Increase quantity"
                        className="text-sea-900 hover:text-coral-600 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Total for item */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-sea-950">
                        {formatLKR(item.unitPrice * item.qty)}
                      </p>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.key)}
                      aria-label="Remove item"
                      className="p-1 text-gray-400 hover:text-coral-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                href="/products"
                className="text-xs font-bold text-sea-700 hover:text-coral-600 transition flex items-center gap-1"
              >
                <span>← Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Order Summary Box
          ======================================================== */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h3 className="font-display text-xl font-bold text-sea-950">
                Order Summary
              </h3>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-sea-950">
                    {formatLKR(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Estimated Delivery</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="font-bold text-emerald-600">FREE</span>
                    ) : (
                      formatLKR(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold text-sea-950">
                  <span>Grand Total</span>
                  <span className="font-display text-2xl text-coral-600">
                    {formatLKR(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => requireCustomer() && router.push("/checkout")}
                  disabled={authLoading}
                  className="btn-primary w-full !rounded-full !py-3.5 text-sm font-bold shadow-lg shadow-coral-500/25"
                >
                  Proceed to Checkout
                </button>

                <a
                  href={
                    user
                      ? fullOrderLink({
                          items: items.map((i) => ({
                            name: i.name,
                            localName: i.localName,
                            quantity: `${i.qty} x ${i.sizeLabel}`,
                          })),
                          district: DEFAULT_DISTRICT,
                        })
                      : undefined
                  }
                  onClick={(event) => {
                    if (!requireCustomer()) event.preventDefault();
                  }}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-600 hover:text-white shadow-sm"
                >
                  <MessageCircle size={17} className="text-emerald-600 group-hover:text-white" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              {/* Security & Cold-Chain Badge */}
              <div className="mt-6 rounded-2xl bg-sea-50/70 p-4 border border-sea-100 space-y-2 text-xs text-sea-900">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck size={16} className="text-teal-600" />
                  <span>100% Quality & Freshness Guarantee</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Packed with food-grade ice insulation. Cash on delivery & online payment available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
