"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  PackageCheck,
  ChevronRight,
  CircleCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatLKR } from "@/data/products";
import { SRI_LANKA_DISTRICTS, DEFAULT_DISTRICT } from "@/lib/districts";
import { fullOrderLink } from "@/lib/whatsapp";
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
  const { items, subtotal } = useCart();
  const router = useRouter();
  const { user, loading: authLoading } = useCustomerAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  async function handleContinue(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");
    try {
      const email = form.email.trim().toLowerCase();
      // Send the first code only after all required checkout fields pass the
      // browser validation and the customer explicitly continues.
      await api.requestCheckoutEmailOtp({ email });
      sessionStorage.setItem(
        "rsn-checkout-draft",
        JSON.stringify({ form: { ...form, email }, items }),
      );
      router.push("/checkout/verify");
    } catch (err) {
      setError(err.message || "Unable to send the verification code.");
    } finally {
      setSubmitting(false);
    }
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(117,213,204,0.18),_transparent_30%),linear-gradient(180deg,_#f0fafa_0%,_#f8fafc_42%,_#fff_100%)] pb-20">
      <div className="border-b border-white/10 bg-[#05262b] text-white shadow-[0_8px_30px_rgba(4,29,34,0.16)]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-4 py-5 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-teal-300">
              <PackageCheck size={14} /> Secure checkout
            </p>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Fresh catch, carefully delivered.</h1>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">Complete your details and our team will handle the cold chain.</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold sm:text-sm lg:pb-0">
            <Link href="/cart" className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-teal-100 transition hover:bg-white/15">
              <CircleCheck size={16} className="text-teal-300" /> Cart
            </Link>
            <ChevronRight size={16} className="shrink-0 text-slate-500" />
            <span className="flex shrink-0 items-center gap-2 rounded-full bg-coral-500 px-3 py-2 text-white shadow-lg shadow-coral-950/20">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">2</span> Delivery
            </span>
            <ChevronRight size={16} className="shrink-0 text-slate-500" />
            <span className="flex shrink-0 items-center gap-2 px-2 text-slate-400"><span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-500">3</span> Confirm</span>
          </div>
        </div>
      </div>
      {/* Checkout Steps Progress */}
      <div className="border-b border-sea-100 bg-white/70 py-3 backdrop-blur">
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

      <section className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
        <h1 className="font-display text-3xl font-bold text-sea-950 mb-8">
          Shipping & Payment Details
        </h1>

        <form
          onSubmit={handleContinue}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {/* ========================================================
              LEFT 2 COLUMNS: Address & Payment Info
          ======================================================== */}
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery Details Card */}
            <div className="rounded-3xl border border-white bg-white p-6 shadow-[0_14px_45px_rgba(4,39,43,0.08)] sm:p-8">
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
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="e.g. customer@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-sea-950 focus:border-sea-500 focus:bg-white focus:outline-none transition"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                  <p className="mt-1.5 text-[11px] text-gray-500">We will verify this email on the next step before confirming your order.</p>
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
            <div className="rounded-3xl border border-white bg-white p-6 shadow-[0_14px_45px_rgba(4,39,43,0.08)] sm:p-8">
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

          </div>

          {/* ========================================================
              RIGHT COLUMN: Checkout Summary Sidebar
          ======================================================== */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-sea-900/10 bg-white shadow-[0_16px_48px_rgba(4,39,43,0.13)]">
              <div className="bg-gradient-to-br from-[#06343a] via-[#07515a] to-[#06343a] px-6 py-5 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200">Your fresh selection</p>
                    <h3 className="mt-1 font-display text-xl font-bold">Order review</h3>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-teal-100">{items.length} item{items.length === 1 ? "" : "s"}</span>
                </div>
              </div>
              <div className="p-6">

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
              <div className="mt-4 rounded-2xl bg-sea-50/80 p-4 text-sm">
                {deliveryFee > 0 && (
                  <div className="mb-4 border-b border-sea-100 pb-3">
                    <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-sea-700"><span>Add {formatLKR(Math.max(0, DELIVERY_FREE_THRESHOLD - subtotal))} for free delivery</span><span>{Math.min(100, Math.round((subtotal / DELIVERY_FREE_THRESHOLD) * 100))}%</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-sea-100"><div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-coral-400" style={{ width: `${Math.min(100, (subtotal / DELIVERY_FREE_THRESHOLD) * 100)}%` }} /></div>
                  </div>
                )}
                {deliveryFee === 0 && <p className="mb-3 flex items-center gap-1.5 border-b border-sea-100 pb-3 text-xs font-bold text-emerald-700"><CircleCheck size={15} /> You unlocked free delivery</p>}
                <div className="space-y-2.5">
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
              </div>

              {/* Place Order CTA */}
              {error && (
                <p role="alert" className="mt-5 rounded-xl bg-coral-50 p-3 text-center text-xs font-semibold text-coral-700">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary mt-6 w-full !rounded-full !py-3.5 text-sm font-bold shadow-lg shadow-coral-500/25"
              >
                {submitting ? "Sending OTP..." : "Continue to Email Verification"}
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

              <div className="mt-5 rounded-2xl bg-sea-50/70 p-3.5 border border-sea-100 text-[11px] text-gray-500 flex items-center gap-2">
                <Lock size={15} className="text-teal-600 shrink-0" />
                <span>256-bit SSL encrypted • Fresh seafood guaranteed on arrival</span>
              </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
