"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  MapPin,
  Calendar,
  Printer,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatLKR } from "@/data/products";
import { api } from "@/lib/api";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("order_id");
  const isPayHereSuccess =
    searchParams.get("status") === "success" || Boolean(orderIdFromUrl);

  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let orderData = null;
    try {
      orderData = JSON.parse(
        sessionStorage.getItem("rsn-confirmed-order") ||
          sessionStorage.getItem("rsn-pending-order") ||
          "null",
      );
    } catch {}

    const orderNumber = orderIdFromUrl || orderData?.orderNumber;

    if (orderNumber) {
      // Clear cart once payment or order is confirmed
      clearCart();

      // If redirected from PayHere with success, notify backend to mark paid
      if (isPayHereSuccess) {
        api
          .confirmPayHereSuccess(orderNumber)
          .then((res) => {
            if (res?.order) {
              setOrder(res.order);
              sessionStorage.setItem("rsn-confirmed-order", JSON.stringify(res.order));
            }
          })
          .catch(() => {
            // If API call fails (e.g. offline), use locally stored snapshot
            if (orderData) {
              setOrder({
                ...orderData,
                paymentStatus: "paid",
                orderStatus: "Confirmed",
              });
            }
          });
      }

      // If we don't have order details yet, try fetching from backend
      if (!orderData) {
        api
          .getOrder(orderNumber)
          .then((res) => {
            if (res?.order) setOrder(res.order);
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      } else {
        setOrder(
          isPayHereSuccess
            ? { ...orderData, paymentStatus: "paid", orderStatus: "Confirmed" }
            : orderData,
        );
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [orderIdFromUrl, isPayHereSuccess, clearCart]);

  if (loading) {
    return (
      <section className="min-h-screen px-4 py-24 text-center">
        <p className="font-display text-2xl font-bold text-sea-950">
          Loading order confirmation...
        </p>
      </section>
    );
  }

  const displayOrderNumber = order?.orderNumber || orderIdFromUrl;

  if (!displayOrderNumber && !order) {
    return (
      <section className="min-h-screen px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-sea-950">
          No order to display
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Browse our freshest catch and place an order.
        </p>
        <Link href="/products" className="btn-primary mt-6 inline-flex">
          Shop Seafood
        </Link>
      </section>
    );
  }

  const isPayHere =
    order?.paymentMethod === "payhere" || isPayHereSuccess || !order?.paymentMethod;

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#04282e] via-[#074751] to-[#04282e] px-6 py-8 text-center text-white sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
              {isPayHere
                ? "Payment Successful via PayHere!"
                : "Order Confirmed!"}
            </h1>
            <p className="mt-1 text-sm text-teal-100">
              {isPayHere
                ? "Your payment was approved by PayHere Sandbox. Our Kalpitiya team is preparing your fresh catch."
                : "Thank you for your order with RSN Sea Food."}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-teal-200 backdrop-blur">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Merchant ID: 1238347 • Sandbox Verified</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Order Reference Box */}
            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-sea-100 bg-sea-50/70 p-4 sm:flex-row">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-sea-700">
                  Order Reference Number
                </p>
                <p className="font-mono text-xl font-bold text-coral-600 sm:text-2xl">
                  {displayOrderNumber}
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                {isPayHere ? "PAID (Sandbox)" : "CONFIRMED"}
              </span>
            </div>

            {/* Payment & Delivery Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 font-bold text-sea-950 mb-2">
                  <CreditCard size={16} className="text-sky-600" />
                  <span>Payment Gateway</span>
                </div>
                <p className="text-slate-700 font-semibold">
                  {isPayHere
                    ? "PayHere Sandbox (Online Card / Wallet)"
                    : order?.paymentMethod === "cash_on_delivery"
                      ? "Cash on Delivery"
                      : "WhatsApp Order"}
                </p>
                <p className="text-slate-400 mt-1">
                  Status: <span className="text-emerald-600 font-bold">Approved / Paid</span>
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 font-bold text-sea-950 mb-2">
                  <Calendar size={16} className="text-coral-500" />
                  <span>Order Date</span>
                </div>
                <p className="text-slate-700 font-semibold">
                  {new Date().toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-slate-400 mt-1">Cold chain packaging underway</p>
              </div>

              {order?.customer && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center gap-2 font-bold text-sea-950 mb-2">
                    <Package size={16} className="text-teal-600" />
                    <span>Customer</span>
                  </div>
                  <p className="text-slate-700 font-semibold">{order.customer.name}</p>
                  <p className="text-slate-500">{order.customer.phone}</p>
                  <p className="text-slate-500">{order.customer.email}</p>
                </div>
              )}

              {order?.shippingAddress && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center gap-2 font-bold text-sea-950 mb-2">
                    <MapPin size={16} className="text-coral-500" />
                    <span>Shipping Address</span>
                  </div>
                  <p className="text-slate-700">{order.shippingAddress.address}</p>
                  <p className="text-slate-500">
                    {order.shippingAddress.city}, {order.shippingAddress.district}
                  </p>
                </div>
              )}
            </div>

            {/* Items Summary if available */}
            {order?.items?.length > 0 && (
              <div className="rounded-2xl border border-slate-100 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Ordered Seafood
                </p>
                <div className="space-y-2 text-xs divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between pt-2">
                      <span className="text-slate-700">
                        {item.name} <span className="text-slate-400">× {item.quantityKg} kg</span>
                      </span>
                      <span className="font-semibold text-slate-900">
                        {formatLKR(item.itemTotal || item.price * item.quantityKg)}
                      </span>
                    </div>
                  ))}
                </div>
                {order?.totalAmount && (
                  <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-sm font-bold text-sea-950">
                    <span>Total Paid</span>
                    <span className="font-display text-lg text-coral-600">
                      {formatLKR(order.totalAmount)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:flex-1"
              >
                <Printer size={15} />
                <span>Print Receipt</span>
              </button>
              <Link
                href="/products"
                className="btn-primary flex items-center justify-center gap-2 !rounded-full !py-3 text-xs font-bold sm:flex-1"
              >
                <ShoppingBag size={15} />
                <span>Shop More Seafood</span>
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-full border border-sea-200 bg-white px-5 py-3 text-xs font-bold text-sea-900 transition hover:bg-sea-50 sm:flex-1"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sea-900 font-semibold">
          Loading Confirmation...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
