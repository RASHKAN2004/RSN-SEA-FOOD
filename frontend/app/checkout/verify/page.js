"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { signInPath, useCustomerAuth } from "@/lib/useCustomerAuth";

const DRAFT_KEY = "rsn-checkout-draft";

export default function CheckoutVerifyPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { user, loading: authLoading } = useCustomerAuth();
  const [draft, setDraft] = useState(null);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.replace(signInPath("/checkout"));
  }, [authLoading, user, router]);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null");
      if (!saved?.form?.email || !saved?.items?.length) {
        router.replace("/checkout");
        return;
      }
      setDraft(saved);
      setStatus("A verification code was sent to your email. Check your inbox or spam folder.");
    } catch {
      router.replace("/checkout");
    }
  }, [router]);

  async function sendOtp() {
    if (!draft) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.requestCheckoutEmailOtp({ email: draft.form.email });
      setSent(true);
      setStatus(res.message || "Verification code sent. Check your inbox.");
    } catch (err) {
      setError(err.message || "Unable to send the verification code.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    if (!draft || otp.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.verifyCheckoutEmailOtp({
        email: draft.form.email,
        code: otp,
      });
      setVerificationToken(response.verificationToken);
      setVerified(true);
      setStatus("Email verified. You can now confirm your order.");
    } catch (err) {
      setError(err.message || "Unable to verify the code.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmOrder() {
    if (!draft || !verificationToken) return;
    setLoading(true);
    setError("");
    try {
      const { form, items } = draft;
      const res = await api.createOrder({
        customer: { name: form.fullName, phone: form.mobile, whatsapp: form.whatsapp || form.mobile, email: form.email },
        shippingAddress: { address: form.address, city: form.city, district: form.district, postalCode: form.postalCode, deliveryInstructions: form.instructions, country: "Sri Lanka" },
        items: items.map((item) => ({ slug: item.slug, sizeLabel: item.sizeLabel, quantityKg: item.qty })),
        paymentMethod: form.paymentMethod,
        emailVerificationToken: verificationToken,
        card: form.paymentMethod === "card_simulation" ? { cardNumber: form.cardNumber, expiry: form.expiry, cvv: form.cvv } : undefined,
      });
      sessionStorage.removeItem(DRAFT_KEY);
      sessionStorage.setItem("rsn-confirmed-order", JSON.stringify(res.order));
      clearCart();
      router.replace("/checkout/confirmation");
    } catch (err) {
      setError(err.message || "Unable to confirm your order.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || !user || !draft) return null;
  const email = draft.form.email.trim().toLowerCase();

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-sea-100 bg-white p-7 shadow-lg sm:p-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sea-50 text-sea-700"><ShieldCheck size={30} /></div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral-600">Step 3 of 3</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-sea-950">Verify your email</h1>
        <p className="mt-2 text-sm text-gray-600">Enter the 6-digit code sent to <span className="font-semibold text-sea-900">{email}</span>. Your order will be confirmed after verification.</p>

        {!verified && (
          <button type="button" onClick={sendOtp} disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-sea-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-sea-800 disabled:opacity-60">
            <Mail size={17} /> {loading ? "Sending..." : "Resend OTP"}
          </button>
        )}

        <form onSubmit={verifyOtp} className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">6-digit OTP</label>
          <input autoFocus required inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="000000" className="mt-2 w-full rounded-xl border border-sea-200 px-4 py-3 text-center font-mono text-xl tracking-[0.4em] text-sea-950 outline-none focus:border-sea-600" />
          <button type="submit" disabled={loading || verified || otp.length !== 6} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-coral-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-coral-600 disabled:opacity-60">
            <CheckCircle2 size={17} /> {loading ? "Verifying..." : verified ? "Email Verified" : "Verify OTP"}
          </button>
        </form>

        {verified && (
          <button type="button" onClick={confirmOrder} disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60">
            <CheckCircle2 size={17} /> {loading ? "Confirming Order..." : "Confirm Order"}
          </button>
        )}

        {status && <p className="mt-4 text-center text-sm font-semibold text-emerald-700">{status}</p>}
        {error && <p className="mt-4 rounded-xl bg-coral-50 p-3 text-sm font-semibold text-coral-700">{error}</p>}
        <Link href="/checkout" className="mt-6 block text-center text-sm font-semibold text-sea-700 hover:text-coral-600">← Back to delivery details</Link>
      </div>
    </section>
  );
}
