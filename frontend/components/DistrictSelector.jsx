'use client';

import { SRI_LANKA_DISTRICTS } from '@/lib/districts';

export default function DistrictSelector({ value, onChange, label = 'District' }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sea-500 focus:outline-none"
      >
        {SRI_LANKA_DISTRICTS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
}
