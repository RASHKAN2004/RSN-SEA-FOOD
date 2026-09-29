'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Search, Truck, CheckCircle2, ShieldCheck, Clock, MessageCircle, X } from 'lucide-react';
import { SRI_LANKA_DISTRICTS, DEFAULT_DISTRICT } from '@/lib/districts';
import { generalOrderLink, WHATSAPP_DISPLAY } from '@/lib/whatsapp';

const PROVINCES = [
  { label: 'All Districts', value: 'all' },
  { label: 'Western Province', value: 'western', districts: ['Colombo', 'Gampaha', 'Kalutara'] },
  { label: 'North Western (Home Hub)', value: 'north-western', districts: ['Puttalam', 'Kurunegala'] },
  { label: 'Central Province', value: 'central', districts: ['Kandy', 'Matale', 'Nuwara Eliya'] },
  { label: 'Southern Province', value: 'southern', districts: ['Galle', 'Matara', 'Hambantota'] },
  { label: 'Northern & Eastern', value: 'north-east', districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Trincomalee', 'Batticaloa', 'Ampara'] },
];

export default function DeliveryAreasPage() {
  const [search, setSearch] = useState('');
  const [activeProvince, setActiveProvince] = useState('all');

  const filtered = SRI_LANKA_DISTRICTS.filter((d) => {
    const matchesSearch = d.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (activeProvince === 'all') return true;
    const prov = PROVINCES.find((p) => p.value === activeProvince);
    return prov ? prov.districts.includes(d) : true;
  });

  function getDeliverySpeed(district) {
    if (district === 'Puttalam') return { badge: '⚡ Same-Day / Home Base', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (['Colombo', 'Gampaha', 'Kalutara'].includes(district)) return { badge: '🚚 Next-Day Morning (12-24h)', color: 'bg-sea-100 text-sea-800 border-sea-200' };
    if (['Kandy', 'Kurunegala', 'Galle', 'Matara'].includes(district)) return { badge: '📦 Chilled Dispatch (24h)', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { badge: '📦 Nationwide Cold Chain (24-36h)', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#062429] via-[#09343c] to-[#062429] py-14 text-white border-b border-white/10 shadow-inner">
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-coral-300 border border-coral-500/30">
            <Truck size={14} /> Islandwide Sri Lanka Coverage
          </span>
          <h1 className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Delivery Across All 25 Districts
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            From our primary coastal base in Kalpitiya (Puttalam District), we safely chill and dispatch fresh seafood to all provinces in Sri Lanka.
          </p>

          {/* Quick Search */}
          <div className="relative mx-auto mt-8 max-w-md">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your district (e.g. Colombo, Kandy, Galle)..."
              className="w-full rounded-full border border-white/20 bg-white/10 py-3.5 pl-11 pr-10 text-sm text-white placeholder:text-slate-400 focus:border-coral-400 focus:bg-white/15 focus:outline-none transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Clear district search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Districts Grid */}
      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-sea-950">
            Sri Lanka Districts ({filtered.length} of 25)
          </h2>
          <span className="text-xs font-bold text-coral-600 bg-coral-50 px-3 py-1 rounded-full border border-coral-200">
            FREE Delivery over Rs. 5,000
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => {
            const speed = getDeliverySpeed(d);
            const isHome = d === DEFAULT_DISTRICT;
            return (
              <div
                key={d}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 shadow-sm ${
                  isHome
                    ? 'border-coral-300 bg-gradient-to-br from-coral-50/60 to-white shadow-md'
                    : 'border-slate-200/80 bg-white hover:border-sea-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-display text-lg font-bold text-sea-950">
                      <MapPin size={18} className={isHome ? 'text-coral-500' : 'text-sea-600'} />
                      {d}
                    </span>
                    {isHome && (
                      <span className="rounded-full bg-coral-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        Primary Base
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    {isHome
                      ? 'Local hub in Kalpitiya peninsula. Same-day harvest and immediate dispatch.'
                      : `Cold-chain transit to ${d} in sealed thermal boxes.`}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${speed.color}`}>
                    {speed.badge}
                  </span>
                  <Link
                    href={`/products`}
                    className="font-bold text-sea-700 hover:text-coral-600 transition"
                  >
                    Order Catch →
                  </Link>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <MapPin size={36} className="mx-auto text-gray-400 mb-2" />
              <p className="text-base font-bold text-sea-950">No district found matching &ldquo;{search}&rdquo;</p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="btn-primary mt-4 !rounded-full !py-2 text-xs"
              >
                Show All 25 Districts
              </button>
            </div>
          )}
        </div>

        {/* Cold-Chain Assurance Panel */}
        <div className="mt-14 rounded-3xl border border-sea-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="font-display text-xl font-bold text-sea-950 flex items-center gap-2">
            <ShieldCheck size={22} className="text-teal-600" />
            How We Guarantee Freshness Across Every District
          </h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs sm:text-sm text-gray-600">
            <div className="rounded-xl bg-sea-50/50 p-4 border border-sea-100">
              <h4 className="font-bold text-sea-900 text-sm mb-1">Sub-Zero Cold Packs</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Food-grade frozen ice gel blocks are placed alongside sealed seafood packets to ensure temperatures remain below 3°C throughout transit.
              </p>
            </div>
            <div className="rounded-xl bg-sea-50/50 p-4 border border-sea-100">
              <h4 className="font-bold text-sea-900 text-sm mb-1">Insulated Styrofoam Shipping</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                High-density thermal packaging locks in cold air and prevents external heat exposure on long-distance islandwide routes.
              </p>
            </div>
            <div className="rounded-xl bg-sea-50/50 p-4 border border-sea-100">
              <h4 className="font-bold text-sea-900 text-sm mb-1">Direct WhatsApp Tracking</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Receive real-time harvest photos and courier updates directly on WhatsApp as your delivery progresses.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
