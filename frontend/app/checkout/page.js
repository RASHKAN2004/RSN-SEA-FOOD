"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import CryptoJS from "crypto-js";
import {
  MessageCircle,
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  MapPin,
  PackageCheck,
  ChevronRight,
  CircleCheck,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatLKR } from "@/data/products";
import { SRI_LANKA_DISTRICTS, DEFAULT_DISTRICT } from "@/lib/districts";
import { fullOrderLink } from "@/lib/whatsapp";
import { api } from "@/lib/api";
import { signInPath, useCustomerAuth } from "@/lib/useCustomerAuth";

const DELIVERY_FREE_THRESHOLD = 5000;
const DELIVERY_FEE = 350;

// PayHere Sandbox Credentials (ICT2142 Practical 06)
const PAYHERE_MERCHANT_ID =
  process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || "1238347";
const PAYHERE_MERCHANT_SECRET =
  process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET ||
  "MjY4NTA3MjUxNzE2NTAxOTA5NjAxNjY3Njc3NDg1MjA3OTAyNjQ0Mw==";
const PAYHERE_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_PAYHERE_CHECKOUT_URL ||
  "https://sandbox.payhere.lk/pay/checkout";

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
  paymentMethod: "payhere", // PayHere Sandbox default as required by Practical 06
};

function CheckoutContent() {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useCustomerAuth();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copiedCard, setCopiedCard] = useState("");

  // PayHere hidden submission form ref
  const payhereFormRef = useRef(null);
  const [payhereData, setPayhereData] = useState({
    merchant_id: PAYHERE_MERCHANT_ID,
    return_url: "",
    cancel_url: "",
    notify_url: "",
    order_id: "",
    items: "",
    currency: "LKR",
    amount: "0.00",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Sri Lanka",
    hash: "",
  });

  const isCancelled = searchParams.get("cancelled") === "true";

  const deliveryFee =
    items.length === 0
      ? 0
      : subtotal >= DELIVERY_FREE_THRESHOLD
        ? 0
        : DELIVERY_FEE;
  const grandTotal = subtotal + deliveryFee;

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        mobile: prev.mobile || user.phone || "",
        whatsapp: prev.whatsapp || user.phone || "",
      }));
    }
  }, [user]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function copyToClipboard(text, key) {
    navigator.clipboard.writeText(text);
    setCopiedCard(key);
    setTimeout(() => setCopiedCard(""), 2000);
  }

  // PayHere MD5 Hash generator matching Practical 06 Slide 8
  // Hash = UPPERCASE( MD5( merchant_id + order_id + amount + currency + UPPERCASE( MD5( merchant_secret ) ) ) )
  function calculatePayHereHash(merchantId, orderId, fmtAmount, currency, secret) {
    const hashedSecret = CryptoJS.MD5(secret).toString().toUpperCase();
    const hashString = merchantId + orderId + fmtAmount + currency + hashedSecret;
    return CryptoJS.MD5(hashString).toString().toUpperCase();
  }

  async function handleCheckout(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");

    try {
      const email = form.email.trim().toLowerCase();
      const nameParts = form.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "Valued";
      const lastName = nameParts.slice(1).join(" ") || "Customer";
      const fmtAmount = Number(grandTotal).toFixed(2); // Strict 2 decimal places (Slide 10)

      // Fallback order ID in case network order creation fails
      const fallbackOrderId = `RSN-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

      let createdOrder = null;
      let orderNumber = fallbackOrderId;

      try {
        const res = await api.createOrder({
          customer: {
            name: form.fullName,
            phone: form.mobile,
            whatsapp: form.whatsapp || form.mobile,
            email,
          },
          shippingAddress: {
            address: form.address,
            city: form.city,
            district: form.district,
            postalCode: form.postalCode,
            deliveryInstructions: form.instructions,
            country: "Sri Lanka",
          },
          items: items.map((item) => ({
            slug: item.slug,
            sizeLabel: item.sizeLabel,
            quantityKg: item.qty,
          })),
          paymentMethod: form.paymentMethod,
        });

        if (res?.order) {
          createdOrder = res.order;
          orderNumber = res.order.orderNumber;
        }
      } catch (err) {
        console.warn("Backend order creation warning (proceeding with gateway):", err);
      }

      // Order snapshot to save locally
      const orderSnapshot = createdOrder || {
        orderNumber,
        customer: { name: form.fullName, email, phone: form.mobile },
        shippingAddress: {
          address: form.address,
          city: form.city,
          district: form.district,
        },
        items: items.map((i) => ({
          name: i.name,
          quantityKg: i.qty,
          itemTotal: i.unitPrice * i.qty,
        })),
        totalAmount: grandTotal,
        paymentMethod: form.paymentMethod,
        paymentStatus: "pending",
        orderStatus: "Pending",
      };

      sessionStorage.setItem("rsn-pending-order", JSON.stringify(orderSnapshot));
      sessionStorage.setItem("rsn-confirmed-order", JSON.stringify(orderSnapshot));

      // 1. IF PAYHERE SANDBOX SELECTED:
      if (form.paymentMethod === "payhere") {
        const origin = window.location.origin;
        const returnUrl = `${origin}/checkout/confirmation?order_id=${encodeURIComponent(orderNumber)}&status=success`;
        const cancelUrl = `${origin}/checkout?cancelled=true`;
        const notifyUrl = `${process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:5000"}/api/orders/payhere-notify`;

        // Calculate cryptographic MD5 hash (Slide 8)
        const hash = calculatePayHereHash(
          PAYHERE_MERCHANT_ID,
          orderNumber,
          fmtAmount,
          "LKR",
          PAYHERE_MERCHANT_SECRET,
        );

        const itemsSummary =
          items
            .map((i) => `${i.name} (${i.qty}kg)`)
            .join(", ")
            .slice(0, 100) || "RSN Fresh Seafood Catch";

        const pData = {
          merchant_id: PAYHERE_MERCHANT_ID,
          return_url: returnUrl,
          cancel_url: cancelUrl,
          notify_url: notifyUrl,
          order_id: orderNumber,
          items: itemsSummary,
          currency: "LKR",
          amount: fmtAmount,
          first_name: firstName,
          last_name: lastName,
          email,
          phone: form.mobile.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          country: "Sri Lanka",
          hash,
        };

        setPayhereData(pData);

        // Immediate submission using standard HTML form POST to PayHere Sandbox (Slide 6 & 7)
        setTimeout(() => {
          if (payhereFormRef.current) {
            payhereFormRef.current.submit();
          }
        }, 80);
        return;
      }

      // 2. CASH ON DELIVERY:
      if (form.paymentMethod === "cash_on_delivery") {
        router.replace("/checkout/confirmation");
        return;
      }

      // 3. WHATSAPP ORDER:
      if (form.paymentMethod === "whatsapp_manual") {
        const waLink = fullOrderLink({
          items: items.map((i) => ({
            name: i.name,
            localName: i.localName,
            quantity: `${i.qty} x ${i.sizeLabel}`,
          })),
          district: form.district,
          customerName: form.fullName,
          address: form.address,
        });
        window.open(waLink, "_blank");
        router.replace("/checkout/confirmation");
        return;
      }
    } catch (err) {
      setError(err.message || "Failed to process checkout. Please try again.");
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(117,213,204,0.18),_transparent_30%),linear-gradient(180deg,_#f0fafa_0%,_#f8fafc_42%,_#fff_100%)] pb-20">
      {/* Top Banner */}
      <div className="border-b border-white/10 bg-[#05262b] text-white shadow-[0_8px_30px_rgba(4,29,34,0.16)]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-4 py-5 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-teal-300">
              <PackageCheck size={14} /> PayHere Secure Checkout
            </p>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              Fresh Catch, Direct Payment.
            </h1>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              Integrated with Sri Lanka&apos;s leading PayHere Sandbox Payment Gateway.
            </p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold sm:text-sm lg:pb-0">
            <Link
              href="/cart"
              className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-teal-100 transition hover:bg-white/15"
            >
              <CircleCheck size={16} className="text-teal-300" /> Cart
            </Link>
            <ChevronRight size={16} className="shrink-0 text-slate-500" />
            <span className="flex shrink-0 items-center gap-2 rounded-full bg-coral-500 px-3 py-2 text-white shadow-lg shadow-coral-950/20">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
                2
              </span>
              Payment & Delivery
            </span>
            <ChevronRight size={16} className="shrink-0 text-slate-500" />
            <span className="flex shrink-0 items-center gap-2 px-2 text-slate-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-500">
                3
              </span>
              Confirmation
            </span>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
        {/* Cancelled Banner if user returns from PayHere Cancel */}
        {isCancelled && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm">
            <AlertCircle size={22} className="shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Payment Cancelled on PayHere Sandbox</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Your payment session was cancelled. Don&apos;t worry — your seafood items are still saved in your cart. You can retry with PayHere or choose an alternative method below.
              </p>
            </div>
          </div>
        )}

        <h1 className="font-display text-3xl font-bold text-sea-950 mb-8">
          Shipping & Payment Details
        </h1>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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

            {/* Payment Method Selection Card */}
            <div className="rounded-3xl border border-white bg-white p-6 shadow-[0_14px_45px_rgba(4,39,43,0.08)] sm:p-8">
              <div className="flex items-center gap-2 font-display text-xl font-bold text-sea-950 mb-5">
                <CreditCard className="text-coral-500" size={22} />
                <span>2. Select Payment Method</span>
              </div>

              <div className="space-y-3">
                {/* 1. PAYHERE SANDBOX GATEWAY (Primary / Practical 06 Required) */}
                <label
                  className={`flex cursor-pointer items-start justify-between rounded-2xl border p-4 transition-all duration-200 ${
                    form.paymentMethod === "payhere"
                      ? "border-sky-600 bg-sky-50/80 shadow-md ring-1 ring-sky-600/30"
                      : "border-slate-200 hover:border-sky-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === "payhere"}
                      onChange={() => update("paymentMethod", "payhere")}
                      className="accent-sky-600 h-4 w-4 mt-1"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-sea-950">
                          Pay with PayHere Sandbox (Online Payment Gateway)
                        </p>
                        <span className="rounded-full bg-sky-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                          Week 07 Lab
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        Official Sri Lanka gateway. Supports Visa, MasterCard, FriMi, Genie, eZ Cash, mCash.
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                        <span className="rounded bg-slate-200/80 px-2 py-0.5 text-slate-800">VISA</span>
                        <span className="rounded bg-slate-200/80 px-2 py-0.5 text-slate-800">MasterCard</span>
                        <span className="rounded bg-slate-200/80 px-2 py-0.5 text-slate-800">FriMi</span>
                        <span className="rounded bg-slate-200/80 px-2 py-0.5 text-slate-800">Genie</span>
                        <span className="rounded bg-slate-200/80 px-2 py-0.5 text-slate-800">eZ Cash</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-md">
                      ID: {PAYHERE_MERCHANT_ID}
                    </span>
                  </div>
                </label>

                {/* 2. CASH ON DELIVERY */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
                    form.paymentMethod === "cash_on_delivery"
                      ? "border-sea-600 bg-sea-50/70 shadow-sm"
                      : "border-slate-200 hover:border-sea-300"
                  }`}
                >
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
                      <p className="text-xs text-gray-500">
                        Pay in cash when chilled seafood arrives at your doorstep.
                      </p>
                    </div>
                  </div>
                  <Truck size={22} className="text-sea-700 hidden sm:block" />
                </label>

                {/* 3. WHATSAPP MANUAL */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
                    form.paymentMethod === "whatsapp_manual"
                      ? "border-sea-600 bg-sea-50/70 shadow-sm"
                      : "border-slate-200 hover:border-sea-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === "whatsapp_manual"}
                      onChange={() => update("paymentMethod", "whatsapp_manual")}
                      className="accent-sea-600 h-4 w-4"
                    />
                    <div>
                      <p className="text-sm font-bold text-sea-950">
                        WhatsApp Order & Confirmation
                      </p>
                      <p className="text-xs text-gray-500">
                        Direct bank transfer slip submission via WhatsApp concierge.
                      </p>
                    </div>
                  </div>
                  <MessageCircle size={22} className="text-emerald-600 hidden sm:block" />
                </label>
              </div>

              {/* PAYHERE SANDBOX TEST CARDS HELPER BOX (Practical 06 Slide 9) */}
              {form.paymentMethod === "payhere" && (
                <div className="mt-5 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/90 to-blue-50/60 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
                        ✓
                      </span>
                      <h4 className="font-display text-sm font-bold text-sea-950">
                        PayHere Sandbox Test Cards (Practical 06)
                      </h4>
                    </div>
                    <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-sky-800 shadow-sm border border-sky-100">
                      Sandbox Mode
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    Use these official sandbox test credentials on the PayHere checkout popup:
                  </p>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Visa Card Box */}
                    <div className="rounded-xl border border-sky-200 bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="text-blue-700">VISA Test Card (Approved)</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("4916 2175 0161 1292", "visa")}
                          className="flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-800 font-semibold"
                        >
                          {copiedCard === "visa" ? (
                            <Check size={13} className="text-emerald-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                          <span>{copiedCard === "visa" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <p className="mt-1 font-mono text-sm font-bold tracking-wider text-sea-900">
                        4916 2175 0161 1292
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                        <span>Expiry: Any future date (e.g. 12/28)</span>
                        <span>CVV: 123</span>
                      </div>
                    </div>

                    {/* MasterCard Box */}
                    <div className="rounded-xl border border-sky-200 bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="text-coral-600">MasterCard (Approved)</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("5307 7321 2553 1191", "mc")}
                          className="flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-800 font-semibold"
                        >
                          {copiedCard === "mc" ? (
                            <Check size={13} className="text-emerald-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                          <span>{copiedCard === "mc" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <p className="mt-1 font-mono text-sm font-bold tracking-wider text-sea-900">
                        5307 7321 2553 1191
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                        <span>Expiry: Any future date (e.g. 12/28)</span>
                        <span>CVV: 123</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2.5 text-[11px] text-slate-500">
                    🔒 MD5 tamper-proof security hash is automatically calculated according to the Practical 06 specification before submission.
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
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200">
                      Your fresh selection
                    </p>
                    <h3 className="mt-1 font-display text-xl font-bold">Order review</h3>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-teal-100">
                    {items.length} item{items.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
              <div className="p-6">
                {/* Items scroll */}
                <div className="mt-2 max-h-60 space-y-3 overflow-y-auto pr-1">
                  {items.map((i) => (
                    <div
                      key={i.key}
                      className="flex justify-between items-start text-xs border-b border-slate-100 pb-2"
                    >
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
                      <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-sea-700">
                        <span>
                          Add {formatLKR(Math.max(0, DELIVERY_FREE_THRESHOLD - subtotal))} for free delivery
                        </span>
                        <span>
                          {Math.min(
                            100,
                            Math.round((subtotal / DELIVERY_FREE_THRESHOLD) * 100),
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-sea-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-coral-400"
                          style={{
                            width: `${Math.min(
                              100,
                              (subtotal / DELIVERY_FREE_THRESHOLD) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {deliveryFee === 0 && (
                    <p className="mb-3 flex items-center gap-1.5 border-b border-sea-100 pb-3 text-xs font-bold text-emerald-700">
                      <CircleCheck size={15} /> You unlocked free delivery
                    </p>
                  )}
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-sea-950">
                        {formatLKR(subtotal)}
                      </span>
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

                {/* Errors */}
                {error && (
                  <p
                    role="alert"
                    className="mt-5 rounded-xl bg-coral-50 p-3 text-center text-xs font-semibold text-coral-700"
                  >
                    {error}
                  </p>
                )}

                {/* Primary CTA button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`mt-6 w-full !rounded-full !py-3.5 text-sm font-bold text-white shadow-lg transition duration-200 disabled:opacity-60 ${
                    form.paymentMethod === "payhere"
                      ? "bg-sky-600 hover:bg-sky-700 shadow-sky-600/30"
                      : "bg-coral-500 hover:bg-coral-600 shadow-coral-500/25"
                  }`}
                >
                  {submitting
                    ? form.paymentMethod === "payhere"
                      ? "Connecting to PayHere..."
                      : "Processing..."
                    : form.paymentMethod === "payhere"
                      ? `Pay with PayHere (Sandbox) • ${formatLKR(grandTotal)}`
                      : form.paymentMethod === "cash_on_delivery"
                        ? `Place Cash on Delivery Order • ${formatLKR(grandTotal)}`
                        : `Confirm on WhatsApp • ${formatLKR(grandTotal)}`}
                </button>

                {/* Secondary WhatsApp option */}
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
                  <span>Order via WhatsApp Direct</span>
                </a>

                <div className="mt-5 rounded-2xl bg-sea-50/70 p-3.5 border border-sea-100 text-[11px] text-gray-500 flex items-center gap-2">
                  <Lock size={15} className="text-teal-600 shrink-0" />
                  <span>
                    PayHere 256-bit SSL encrypted • MD5 security hash sealed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* ========================================================
            HIDDEN PAYHERE FORM (Practical 06 Slide 6 & 7)
            POSTs directly to https://sandbox.payhere.lk/pay/checkout
        ======================================================== */}
        <form
          ref={payhereFormRef}
          id="payhere_form"
          method="POST"
          action={PAYHERE_CHECKOUT_URL}
          className="hidden"
        >
          <input type="hidden" name="merchant_id" id="merchant_id" value={payhereData.merchant_id} />
          <input type="hidden" name="return_url" id="return_url" value={payhereData.return_url} />
          <input type="hidden" name="cancel_url" id="cancel_url" value={payhereData.cancel_url} />
          <input type="hidden" name="notify_url" id="notify_url" value={payhereData.notify_url} />
          <input type="hidden" name="order_id" id="order_id" value={payhereData.order_id} />
          <input type="hidden" name="items" id="items" value={payhereData.items} />
          <input type="hidden" name="currency" id="currency" value={payhereData.currency} />
          <input type="hidden" name="amount" id="amount" value={payhereData.amount} />
          <input type="hidden" name="first_name" id="first_name" value={payhereData.first_name} />
          <input type="hidden" name="last_name" id="last_name" value={payhereData.last_name} />
          <input type="hidden" name="email" id="email" value={payhereData.email} />
          <input type="hidden" name="phone" id="phone" value={payhereData.phone} />
          <input type="hidden" name="address" id="address" value={payhereData.address} />
          <input type="hidden" name="city" id="city" value={payhereData.city} />
          <input type="hidden" name="country" id="country" value={payhereData.country} />
          <input type="hidden" name="hash" id="hash" value={payhereData.hash} />
        </form>
      </section>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sea-900 font-semibold">
          Loading PayHere Checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
