'use client';

import { Fish, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const BENEFITS = [
  { icon: Fish, title: 'Fresh Seafood', desc: 'Carefully selected and handled from harbor to doorstep.' },
  { icon: ShieldCheck, title: 'Quality Guaranteed', desc: 'Fresh and hygienically packed for every order.' },
  { icon: Truck, title: 'Islandwide Delivery', desc: 'Delivery across all 25 districts of Sri Lanka.' },
  { icon: MessageCircle, title: 'Easy WhatsApp Ordering', desc: 'Order quickly and confirm details through WhatsApp.' },
];

export default function TrustSection() {
  const { t } = useLanguage();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {BENEFITS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-3 rounded-2xl border border-sea-100 bg-white p-6 text-center shadow-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sea-100 text-sea-700">
              <Icon size={24} />
            </span>
            <p className="font-display text-sm font-bold text-sea-900">{t(title)}</p>
            <p className="text-xs text-gray-500">{t(desc)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
