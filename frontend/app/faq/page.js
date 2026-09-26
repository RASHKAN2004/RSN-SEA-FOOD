import FaqAccordion from '@/components/FaqAccordion';
import Link from 'next/link';
import { HelpCircle, MessageCircle, PhoneCall, ShieldCheck, Truck } from 'lucide-react';
import { generalOrderLink, WHATSAPP_DISPLAY } from '@/lib/whatsapp';

export const metadata = {
  title: 'FAQ & Storage Guide | RSN Sea Food Kalpitiya',
  description: 'Frequently asked questions about seafood harvesting, packaging, islandwide delivery, and WhatsApp ordering at RSN Sea Food.',
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#062429] via-[#09343c] to-[#062429] py-14 text-white border-b border-white/10 shadow-inner">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-coral-300 border border-coral-500/30">
            <HelpCircle size={14} /> Help & Sourcing Guide
          </span>
          <h1 className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            Find answers regarding our morning Kalpitiya harvests, sub-zero packaging technology, and islandwide delivery.
          </p>
        </div>
      </section>

      {/* Main Accordion Section */}
      <section className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
          <FaqAccordion />
        </div>

        {/* Support Concierge Card */}
        <div className="mt-10 rounded-3xl bg-gradient-to-r from-sea-900 to-sea-800 p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-coral-300">
              Direct Concierge
            </span>
            <h3 className="font-display text-2xl font-bold mt-1">
              Still have questions about today&apos;s catch?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
              Our team at Kalpitiya Harbor is available on WhatsApp daily from 6:00 AM – 8:00 PM for custom cuts and wholesale pricing.
            </p>
          </div>

          <a
            href={generalOrderLink()}
            target="_blank"
            rel="noreferrer"
            className="btn-primary !rounded-full !py-3 !px-6 text-xs font-bold whitespace-nowrap shadow-md shadow-coral-500/30 flex items-center gap-2"
          >
            <MessageCircle size={17} />
            <span>Chat on WhatsApp: {WHATSAPP_DISPLAY}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
