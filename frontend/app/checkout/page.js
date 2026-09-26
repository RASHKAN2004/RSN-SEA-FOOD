"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatLKR } from "@/data/products";
import { SRI_LANKA_DISTRICTS, DEFAULT_DISTRICT } from "@/lib/districts";
import { fullOrderLink, WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { api } from "@/lib/api";
import { signInPath, useCustomerAuth } from "@/lib/useCustomerAuth";

const DELIVERY_FREE_THRESHOLD = 5000;
const DELIVERY_FEE = 350;

const initialForm = {
  fullName: "",
  mobile: "",
  whatsapp: "",
  email: "",
  address: "",
  district: DEFAULT_DISTRICT,
  city: "",
  postalCode: "",
  instructions: "",
  paymentMethod: "cash_on_delivery",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const { user, loading: authLoading } = useCustomerAuth();
  const [form, setForm] = useState(initialForm);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState(null);

  const deliveryFee =
    items.length === 0
      ? 0
      : subtotal >= DELIVERY_FREE_THRESHOLD
        ? 0
        : DELIVERY_FEE;
  const grandTotal = subtotal + deliveryFee;

  useEffect(() => {
    if (!authLoading && !user) router.replace(signInPath("/checkout"));
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        mobile: prev.mobile || user.phone || "",
        whatsapp: prev.whatsapp || user.phone || "",
      }));
    }
  }, [authLoading, user, router]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setPlacing(true);
    setError("");
    try {
      const payload = {
        customer: {
          name: form.fullName,
          phone: form.mobile,
          whatsapp: form.whatsapp || form.mobile,
          email: form.email,
        },
        shippingAddress: {
          address: form.address,
          city: form.city,
          district: form.district,
          postalCode: form.postalCode,
          deliveryInstructions: form.instructions,
          country: "Sri Lanka",
        },
        items: items.map((i) => ({
          slug: i.slug,
          sizeLabel: i.sizeLabel,
          price: i.unitPrice,
          quantityKg: i.qty,
          itemTotal: i.unitPrice * i.qty,
        })),
        paymentMethod: form.paymentMethod,
        card:
          form.paymentMethod === "card_simulation"
            ? {
                cardNumber: form.cardNumber,
                expiry: form.expiry,
                cvv: form.cvv,
              }
            : undefined,
      };
      const res = await api.createOrder(payload);
      setOrderResult(res.order);
      clearCart();
    } catch (err) {
      setError(err.message || "Something went wrong placing your order.");
    } finally {
      setPlacing(false);
    }
  }

  if (orderResult) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-16 px-4">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 text-center shadow-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
            <CheckCircle2 size={44} />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-sea-950">
            Order Placed Successfully!
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Thank you for ordering with RSN Sea Food. Your order number is:
          </p>

          <div className="my-4 inline-block rounded-2xl bg-sea-50 px-6 py-2.5 border border-sea-200/60">
            <span className="font-mono text-xl font-bold text-coral-600">
              {orderResult.orderNumber}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Our Kalpitiya team is preparing your fresh catch with cold-chain
            insulation. You can confirm your order immediately on WhatsApp.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={fullOrderLink({
                items: orderResult.items.map((i) => ({
                  name: i.name,
                  quantity: `${i.quantityKg}kg`,
                })),
                district: orderResult.shippingAddress.district,
                customerName: orderResult.customer.name,
                address: orderResult.shippingAddress.address,
              })}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-emerald-500 bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition"
            >
              <MessageCircle size={18} />
              <span>Confirm via WhatsApp ({WHATSAPP_DISPLAY})</span>
            </a>

            <button
              onClick={() => router.push("/products")}
              className="btn-outline !rounded-full !py-3 px-6 text-sm font-bold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center lg:px-8">
        <h1 className="font-display text-3xl font-bold text-sea-950">
          Your Cart is Empty
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Add fresh seafood to your cart before proceeding to checkout.
        </p>
        <Link href="/products" className="btn-primary mt-6 inline-flex">
          Shop Seafood
        </Link>
      </section>
    );
  }

  if (authLoading || !user) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center lg:px-8">
        <h1 className="font-display text-3xl font-bold text-sea-950">
          Checking Account...
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Please sign in to complete your seafood order.
        </p>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Checkout Steps Progress */}
      <div className="border-b border-slate-200/80 bg-white py-4">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold">
            <Link href="/cart" className="flex items-center gap-2 text-sea-700 hover:text-coral-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sea-100 text-sea-700 text-xs font-bold">
                ✓
              </span>
              Review Cart
            </Link>
            <span className="text-coral-500">———</span>
            <span className="flex items-center gap-2 text-coral-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-500 text-white text-xs">
                2
              </span>
              Delivery & Payment
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
        <h1 className="font-display text-3xl font-bold text-sea-950 mb-8">
          Shipping & Payment Details
        </h1>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {/* ========================================================
              LEFT 2 COLUMNS: Address & Payment Info
          ======================================================== */}
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery Details Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 font-display text-xl font-bold text-sea-950 mb-5">
                <MapPin className="text-coral-500" size={22} />
                <span>1. Delivery Address</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    placeholder="e.g. Priyantha Silva"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-sea-950 focus:border-sea-500 focus:bg-white focus:outline-none transition"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    required
                    placeholder="e.g. 077 123 4567"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-sea-950 focus:border-sea-500 focus:bg-white focus:outline-none transition"
                    value={form.mobile}
                    onChange={(e) => update("mobile", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    placeholder="e.g. 077 123 4567"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-sea-950 focus:border-sea-500 focus:bg-white focus:outline-none transition"
                    value={form.whatsapp}
                    onChange={(e) => update("whatsapp", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. customer@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-sea-950 focus:border-sea-500 focus:bg-white focus:outline-none transition"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Street Address *
                  </label>
                  <input
                    required
                    placeholder="House/Apartment number, street name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-sea-950 focus:border-sea-500 focus:bg-white focus:outline-none transition"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    District *
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold text-sea-950 focus:border-sea-500 focus:bg-white focus:outline-none transition"
                    value={form.district}
                    onChange={(e) => update("district", e.target.value)}
                  >
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d} {d === DEFAULT_DISTRICT ? "★ (Fastest / Home base)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    City / Town *
                  </label>
                  <input
                    required
                    placeholder="e.g. Negombo, Colombo 03, Kandy"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-sea-950 focus:border-sea-500 focus:bg-white focus:outline-none transition"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Postal Code
                  </label>
                  <input
                    placeholder="e.g. 10100"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-sea-950 focus:border-sea-500 focus:bg-white focus:outline-none transition"
                    value={form.postalCode}
                    onChange={(e) => update("postalCode", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Country
                  </label>
                  <input
                    disabled
                    value="Sri Lanka (Islandwide)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-gray-500 font-semibold cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Special Cutting or Delivery Instructions
                  </label>
                  <textarea
                    placeholder="e.g. Please cut Seer Fish into 1-inch steaks, clean prawns, delivery before 12 PM"
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-sea-950 focus:border-sea-500 focus:bg-white focus:outline-none transition"
                    value={form.instructions}
                    onChange={(e) => update("instructions", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 font-display text-xl font-bold text-sea-950 mb-5">
                <CreditCard className="text-coral-500" size={22} />
                <span>2. Select Payment Method</span>
              </div>

              <div className="space-y-3">
                <label className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
                  form.paymentMethod === "cash_on_delivery"
                    ? "border-sea-600 bg-sea-50/70 shadow-sm"
                    : "border-slate-200 hover:border-sea-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === "cash_on_delivery"}
                      onChange={() => update("paymentMethod", "cash_on_delivery")}
                      className="accent-sea-600 h-4 w-4"
                    />
                    <div>
                      <p className="text-sm font-bold text-sea-950">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay in cash when your chilled seafood arrives at your door.</p>
                    </div>
                  </div>
                  <Truck size={22} className="text-sea-700 hidden sm:block" />
                </label>

                <label className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
                  form.paymentMethod === "whatsapp_manual"
                    ? "border-sea-600 bg-sea-50/70 shadow-sm"
                    : "border-slate-200 hover:border-sea-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === "whatsapp_manual"}
                      onChange={() => update("paymentMethod", "whatsapp_manual")}
                      className="accent-sea-600 h-4 w-4"
                    />
                    <div>
                      <p className="text-sm font-bold text-sea-950">WhatsApp Order & Confirmation</p>
                      <p className="text-xs text-gray-500">Bank transfer or quick confirmation with our Kalpitiya concierge.</p>
                    </div>
                  </div>
                  <MessageCircle size={22} className="text-emerald-600 hidden sm:block" />
                </label>

                <label className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
                  form.paymentMethod === "card_simulation"
                    ? "border-sea-600 bg-sea-50/70 shadow-sm"
                    : "border-slate-200 hover:border-sea-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === "card_simulation"}
                      onChange={() => update("paymentMethod", "card_simulation")}
                      className="accent-sea-600 h-4 w-4"
                    />
                    <div>
                      <p className="text-sm font-bold text-sea-950">Online Card Payment (Simulated)</p>
                      <p className="text-xs text-gray-500">Visa / Mastercard test gateway for instant order demo.</p>
                    </div>
                  </div>
                  <CreditCard size={22} className="text-sea-700 hidden sm:block" />
                </label>
              </div>

              {/* Simulated Card Inputs */}
              {form.paymentMethod === "card_simulation" && (
                <div className="mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Card Number
                    </label>
                    <input
                      required
                      placeholder="4000 1234 5678 9010"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-sea-950"
                      value={form.cardNumber}
                      onChange={(e) => update("cardNumber", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Expiry
                    </label>
                    <input
                      required
                      placeholder="MM/YY"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-sea-950"
                      value={form.expiry}
                      onChange={(e) => update("expiry", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      CVV
                    </label>
                    <input
                      required
                      placeholder="123"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-sea-950"
                      value={form.cvv}
                      onChange={(e) => update("cvv", e.target.value)}
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 sm:col-span-3">
                    🔒 Demo payment simulation — no real card charge will be made.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-2xl bg-coral-50 border border-coral-200 p-4 text-xs font-semibold text-coral-700">
                {error}
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT COLUMN: Checkout Summary Sidebar
          ======================================================== */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h3 className="font-display text-xl font-bold text-sea-950">
                Order Review
              </h3>

              {/* Items scroll */}
              <div className="mt-4 max-h-60 space-y-3 overflow-y-auto pr-1">
                {items.map((i) => (
                  <div key={i.key} className="flex justify-between items-start text-xs border-b border-slate-100 pb-2">
                    <div>
                      <p className="font-bold text-sea-950">{i.name}</p>
                      <p className="text-gray-500">
                        {i.qty} × {i.sizeLabel} ({formatLKR(i.unitPrice)})
                      </p>
                    </div>
                    <span className="font-bold text-sea-950">
                      {formatLKR(i.unitPrice * i.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financials */}
              <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-sea-950">{formatLKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery ({form.district})</span>
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

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={placing}
                className="btn-primary mt-6 w-full !rounded-full !py-3.5 text-sm font-bold shadow-lg shadow-coral-500/25"
              >
                {placing ? "Confirming Order..." : "Confirm & Place Order"}
              </button>

              <a
                href={fullOrderLink({
                  items: items.map((i) => ({
                    name: i.name,
                    localName: i.localName,
                    quantity: `${i.qty} x ${i.sizeLabel}`,
                  })),
                  district: form.district,
                  customerName: form.fullName,
                  address: form.address,
                })}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 py-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-600 hover:text-white"
              >
                <MessageCircle size={16} />
                <span>Confirm on WhatsApp Instead</span>
              </a>

              <div className="mt-6 rounded-2xl bg-sea-50/70 p-3.5 border border-sea-100 text-[11px] text-gray-500 flex items-center gap-2">
                <Lock size={15} className="text-teal-600 shrink-0" />
                <span>256-bit SSL encrypted • Fresh seafood guaranteed on arrival</span>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
