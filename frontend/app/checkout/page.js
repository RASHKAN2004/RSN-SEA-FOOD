'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatLKR } from '@/data/products';
import { SRI_LANKA_DISTRICTS, DEFAULT_DISTRICT } from '@/lib/districts';
import { fullOrderLink } from '@/lib/whatsapp';
import { api } from '@/lib/api';

const DELIVERY_FREE_THRESHOLD = 5000;
const DELIVERY_FEE = 350;

const initialForm = {
  fullName: '', mobile: '', whatsapp: '', email: '', address: '',
  district: DEFAULT_DISTRICT, city: '', postalCode: '', instructions: '',
  paymentMethod: 'cash_on_delivery',
  cardNumber: '', expiry: '', cvv: '',
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  const deliveryFee = items.length === 0 ? 0 : subtotal >= DELIVERY_FREE_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal = subtotal + deliveryFee;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setPlacing(true);
    setError('');
    try {
      const payload = {
        customer: { name: form.fullName, phone: form.mobile, whatsapp: form.whatsapp || form.mobile, email: form.email },
        shippingAddress: {
          address: form.address, city: form.city, district: form.district,
          postalCode: form.postalCode, deliveryInstructions: form.instructions, country: 'Sri Lanka',
        },
        items: items.map((i) => ({
          name: i.name, localName: i.localName, image: i.image,
          price: i.unitPrice, quantityKg: i.qty, itemTotal: i.unitPrice * i.qty,
        })),
        paymentMethod: form.paymentMethod,
        card: form.paymentMethod === 'card_simulation'
          ? { cardNumber: form.cardNumber, expiry: form.expiry, cvv: form.cvv }
          : undefined,
      };
      const res = await api.createOrder(payload);
      setOrderResult(res.order);
      clearCart();
    } catch (err) {
      setError(err.message || 'Something went wrong placing your order.');
    } finally {
      setPlacing(false);
    }
  }

  if (orderResult) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center lg:px-8">
        <CheckCircle2 size={48} className="mx-auto text-sea-600" />
        <h1 className="section-title mt-4">Order Placed!</h1>
        <p className="mt-2 text-sm text-gray-500">Your order number is</p>
        <p className="mt-1 text-xl font-bold text-coral-600">{orderResult.orderNumber}</p>
        <p className="mt-4 text-sm text-gray-500">We'll confirm availability and delivery timing shortly.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={fullOrderLink({
              items: orderResult.items.map((i) => ({ name: i.name, quantity: `${i.quantityKg}kg` })),
              district: orderResult.shippingAddress.district,
              customerName: orderResult.customer.name,
              address: orderResult.shippingAddress.address,
            })}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-green-500 px-5 py-2.5 text-sm font-semibold text-green-600 hover:bg-green-50"
          >
            <MessageCircle size={18} /> Confirm via WhatsApp
          </a>
          <button onClick={() => router.push('/products')} className="btn-primary">Continue Shopping</button>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center lg:px-8">
        <h1 className="section-title">Your cart is empty</h1>
        <p className="mt-2 text-sm text-gray-500">Add some fresh seafood before checking out.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <h1 className="section-title mb-6">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-sea-100 bg-white p-5">
            <p className="mb-4 font-display font-bold text-sea-900">Delivery Details</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input required placeholder="Full Name" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
              <input required placeholder="Mobile Number" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.mobile} onChange={(e) => update('mobile', e.target.value)} />
              <input placeholder="WhatsApp Number" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} />
              <input type="email" placeholder="Email" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.email} onChange={(e) => update('email', e.target.value)} />
              <input required placeholder="Address" className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-2" value={form.address} onChange={(e) => update('address', e.target.value)} />
              <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.district} onChange={(e) => update('district', e.target.value)}>
                {SRI_LANKA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <input required placeholder="City / Town" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.city} onChange={(e) => update('city', e.target.value)} />
              <input placeholder="Postal Code" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} />
              <input placeholder="Country" disabled value="Sri Lanka" className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500" />
              <textarea placeholder="Delivery Instructions" rows={2} className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-2" value={form.instructions} onChange={(e) => update('instructions', e.target.value)} />
            </div>
          </div>

          <div className="rounded-2xl border border-sea-100 bg-white p-5">
            <p className="mb-4 font-display font-bold text-sea-900">Payment Method</p>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-3 text-sm has-[:checked]:border-sea-500 has-[:checked]:bg-sea-50">
                <input type="radio" name="payment" checked={form.paymentMethod === 'cash_on_delivery'} onChange={() => update('paymentMethod', 'cash_on_delivery')} />
                <Truck size={18} /> Cash on Delivery
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-3 text-sm has-[:checked]:border-sea-500 has-[:checked]:bg-sea-50">
                <input type="radio" name="payment" checked={form.paymentMethod === 'card_simulation'} onChange={() => update('paymentMethod', 'card_simulation')} />
                <CreditCard size={18} /> Card Payment (simulated)
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-3 text-sm has-[:checked]:border-sea-500 has-[:checked]:bg-sea-50">
                <input type="radio" name="payment" checked={form.paymentMethod === 'whatsapp_manual'} onChange={() => update('paymentMethod', 'whatsapp_manual')} />
                <MessageCircle size={18} /> WhatsApp Order / Manual Confirmation
              </label>
            </div>

            {form.paymentMethod === 'card_simulation' && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input required placeholder="Card Number" className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-3" value={form.cardNumber} onChange={(e) => update('cardNumber', e.target.value)} />
                <input required placeholder="MM/YY" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.expiry} onChange={(e) => update('expiry', e.target.value)} />
                <input required placeholder="CVV" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.cvv} onChange={(e) => update('cvv', e.target.value)} />
                <p className="text-xs text-gray-400 sm:col-span-3">Simulated gateway — no real payment is processed.</p>
              </div>
            )}
          </div>
          {error && <p className="text-sm text-coral-600">{error}</p>}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-sea-100 bg-white p-5">
          <p className="font-display text-lg font-bold text-sea-900">Order Summary</p>
          <div className="mt-4 max-h-52 space-y-2 overflow-y-auto text-sm">
            {items.map((i) => (
              <div key={i.key} className="flex justify-between">
                <span className="text-gray-600">{i.name} × {i.qty} ({i.sizeLabel})</span>
                <span>{formatLKR(i.unitPrice * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-2 border-t border-sea-100 pt-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatLKR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Delivery Fee</span><span>{deliveryFee === 0 ? 'Free' : formatLKR(deliveryFee)}</span></div>
            <div className="flex justify-between text-base font-bold text-sea-900"><span>Grand Total</span><span>{formatLKR(grandTotal)}</span></div>
          </div>
          <button type="submit" disabled={placing} className="btn-primary mt-5 w-full">
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
          <a
            href={fullOrderLink({
              items: items.map((i) => ({ name: i.name, localName: i.localName, quantity: `${i.qty} x ${i.sizeLabel}` })),
              district: form.district, customerName: form.fullName, address: form.address,
            })}
            target="_blank" rel="noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-green-500 py-2.5 text-sm font-semibold text-green-600 transition hover:bg-green-50"
          >
            <MessageCircle size={18} /> Order via WhatsApp
          </a>
        </div>
      </form>
    </section>
  );
}
