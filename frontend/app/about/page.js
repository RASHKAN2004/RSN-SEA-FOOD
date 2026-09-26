import Image from 'next/image';
import Link from 'next/link';
import {
  Fish,
  Globe2,
  Users,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Truck,
  Anchor,
} from 'lucide-react';
import { generalOrderLink, WHATSAPP_DISPLAY } from '@/lib/whatsapp';

export const metadata = {
  title: 'About Us | RSN Sea Food Kalpitiya',
  description:
    'RSN Sea Food is an ocean-fresh seafood harvesting, processing, and distribution business based in the coastal peninsula of Kalpitiya, Sri Lanka.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#04191d] via-[#083038] to-[#04191d] py-16 sm:py-24 text-white border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(117,213,204,0.15),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-coral-300 border border-coral-500/30">
              <Anchor size={14} /> The Kalpitiya Peninsula Story
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              From Sri Lanka&apos;s Richest Waters Directly to Your Kitchen.
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
              RSN Sea Food was founded with a singular, unwavering mission: to deliver authentic, chemical-free, ocean-fresh seafood directly from the coastal peninsula of Kalpitiya to households, restaurants, and export partners nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Main Narrative Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="section-kicker">Our Heritage & Mission</span>
            <h2 className="section-title mt-2">
              Fresh From Kalpitiya. Quality You Can Trust.
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600">
              Located on Sri Lanka&apos;s northwest coast between the Gulf of Mannar and the Portuguese Bay lagoon, Kalpitiya possesses one of the island&apos;s most prolific and pristine marine ecosystems.
            </p>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600">
              Every morning at dawn, local artisanal fishermen return with catches of jumbo lagoon prawns, wild mud crabs, yellowfin tuna, and seer fish. Rather than sending them through prolonged wholesale market chains where freshness degrades, RSN Sea Food cleans, portions, and packs each order in sub-zero thermal insulation immediately.
            </p>

            <div className="mt-6 rounded-2xl border border-sea-200/80 bg-white p-5 shadow-sm space-y-2">
              <p className="font-display text-lg font-bold text-coral-600">
                &ldquo;Our promise is simple: zero chemicals, zero formalin, and transparent harbor-to-doorstep cold delivery.&rdquo;
              </p>
              <p className="text-xs text-gray-500">— RSN Sea Food Management Team</p>
            </div>
          </div>

          <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-[2.2rem] shadow-[0_20px_50px_rgba(6,39,43,0.12)] border border-slate-200">
            <Image
              src="/images/products/transport.jpg"
              alt="Kalpitiya Seafood distribution and harbor operations"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061d22]/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 backdrop-blur-md border border-white/50">
              <p className="text-xs font-bold uppercase tracking-wider text-coral-600">
                Daily Operations
              </p>
              <p className="text-xs sm:text-sm font-semibold text-sea-950 mt-0.5">
                Headquartered in Kalpitiya, Puttalam District, with dedicated chilled distribution across all 25 districts of Sri Lanka.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Operation */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-[1.8rem] border border-slate-200/80 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sea-50 text-sea-700 mb-4">
              <Fish size={26} />
            </div>
            <h3 className="font-display text-xl font-bold text-sea-950">
              Domestic Retail & HORECA
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-600">
              Supplying fresh, portioned seafood daily to discerning home kitchens, boutique coastal resorts, and 5-star hotel kitchens across Sri Lanka.
            </p>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200/80 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-50 text-coral-600 mb-4">
              <Globe2 size={26} />
            </div>
            <h3 className="font-display text-xl font-bold text-sea-950">
              Export-Grade Standards
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-600">
              Sashimi-grade Yellowfin Tuna, Lagoon Mud Crab, and Tiger Prawns processed according to international sanitary standards.
            </p>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200/80 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mb-4">
              <Users size={26} />
            </div>
            <h3 className="font-display text-xl font-bold text-sea-950">
              Kalpitiya Fishermen Partners
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-600">
              Fair, steady purchase agreements that empower over 50 artisanal fishing families in the Kalpitiya lagoon community.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 rounded-[2rem] bg-gradient-to-r from-sea-900 via-sea-800 to-sea-900 p-8 sm:p-12 text-white text-center shadow-lg">
          <h3 className="font-display text-2xl sm:text-3xl font-bold">
            Taste the Difference of Kalpitiya Freshness
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-sea-200 max-w-lg mx-auto">
            Order online or connect with our harbor team on WhatsApp for today&apos;s available catches and custom cuts.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/products" className="btn-primary">
              Browse Products
            </Link>
            <a
              href={generalOrderLink()}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              <MessageCircle size={18} />
              <span>WhatsApp Hotline ({WHATSAPP_DISPLAY})</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
