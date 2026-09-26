'use client';

import { Fish, ShieldCheck, Truck, MessageCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const BENEFITS = [
  {
    icon: Fish,
    tag: 'Daily Harvest',
    title: 'Harbor Freshness',
    desc: 'Landed daily by Kalpitiya artisanal fishermen, 100% chemical and formalin free.',
    accent: 'from-teal-500/20 to-sea-500/10 text-teal-700',
  },
  {
    icon: ShieldCheck,
    tag: 'Cold Chain',
    title: 'Sub-Zero Packaging',
    desc: 'Chilled in food-grade thermal insulation with ice packs to preserve ocean freshness.',
    accent: 'from-sky-500/20 to-blue-500/10 text-sky-700',
  },
  {
    icon: Truck,
    tag: 'Islandwide',
    title: '25 Districts Covered',
    desc: 'Direct dispatch across all Sri Lankan provinces. Puttalam base delivers fastest.',
    accent: 'from-amber-500/20 to-orange-500/10 text-amber-700',
  },
  {
    icon: MessageCircle,
    tag: 'Concierge',
    title: 'Direct WhatsApp',
    desc: 'Get instant catch photos, custom cuts (steaks, fillets, cleaned), and quick assistance.',
    accent: 'from-emerald-500/20 to-teal-500/10 text-emerald-700',
  },
];

export default function TrustSection() {
  const { t } = useLanguage();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map(({ icon: Icon, tag, title, desc, accent }) => (
          <div
            key={title}
            className="group relative flex flex-col items-start rounded-[1.6rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_12px_32px_rgba(6,39,43,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-sea-300 hover:shadow-[0_22px_45px_rgba(6,39,43,0.12)]"
          >
            <div className="flex w-full items-center justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} shadow-inner transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={22} />
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                {tag}
              </span>
            </div>

            <h3 className="mt-5 font-display text-xl font-bold text-sea-950">
              {t(title)}
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              {t(desc)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

