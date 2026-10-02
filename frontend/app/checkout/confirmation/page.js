"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutConfirmationPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try { setOrder(JSON.parse(sessionStorage.getItem("rsn-confirmed-order") || "null")); } catch {}
  }, []);

  if (!order) return (
    <section className="min-h-screen px-4 py-24 text-center"><h1 className="font-display text-3xl font-bold text-sea-950">No order to confirm</h1><Link href="/products" className="btn-primary mt-6 inline-flex">Shop Seafood</Link></section>
  );

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-16 text-center">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={44} /></div>
        <h1 className="mt-5 font-display text-3xl font-bold text-sea-950 sm:text-4xl">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-gray-600">Your email has been verified and your order is now confirmed.</p>
        <div className="my-5 inline-block rounded-2xl border border-sea-200 bg-sea-50 px-6 py-3 font-mono text-xl font-bold text-coral-600">{order.orderNumber}</div>
        <p className="text-sm text-gray-600">Thank you for choosing RSN Sea Food. Our Kalpitiya team will prepare your fresh catch.</p>
        <Link href="/products" className="btn-primary mt-8 inline-flex !rounded-full px-6 py-3">Continue Shopping</Link>
      </div>
    </section>
  );
}
