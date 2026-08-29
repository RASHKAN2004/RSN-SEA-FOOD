'use client';

import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { SRI_LANKA_DISTRICTS, DEFAULT_DISTRICT } from '@/lib/districts';

export default function DeliveryAreasPage() {
  const [search, setSearch] = useState('');
  const filtered = SRI_LANKA_DISTRICTS.filter((d) => d.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <div className="text-center">
        <h1 className="section-title">Islandwide Seafood Delivery</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500">
          Delivery available across Sri Lanka. Country: Sri Lanka. Default District: {DEFAULT_DISTRICT}.
        </p>
      </div>

      <div className="relative mx-auto mt-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your district..."
          className="w-full rounded-full border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-sea-500 focus:outline-none"
        />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {filtered.map((d) => (
          <div
            key={d}
            className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium ${
              d === DEFAULT_DISTRICT ? 'border-coral-400 bg-coral-50 text-coral-700' : 'border-sea-100 bg-white text-sea-700'
            }`}
          >
            <MapPin size={16} />
            {d}
            {d === DEFAULT_DISTRICT && <span className="ml-auto text-[10px] font-bold">DEFAULT</span>}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-gray-500">No matching district found.</p>
        )}
      </div>
    </section>
  );
}
