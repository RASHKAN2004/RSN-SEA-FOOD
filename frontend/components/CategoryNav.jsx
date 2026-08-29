'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/data/products';

export default function CategoryNav({ activeCategory }) {
  return (
    <div className="border-b border-sea-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <div className="no-scrollbar flex gap-4 overflow-x-auto">
          <Link
            href="/products"
            className={`flex min-w-[76px] flex-col items-center gap-2 rounded-xl px-2 py-2 text-center text-xs font-medium transition ${
              !activeCategory ? 'bg-sea-50 text-sea-700' : 'text-gray-600 hover:bg-sea-50'
            }`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sea-100 text-lg">🐟</span>
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`flex min-w-[76px] flex-col items-center gap-2 rounded-xl px-2 py-2 text-center text-xs font-medium transition ${
                activeCategory === cat.name ? 'bg-sea-50 text-sea-700' : 'text-gray-600 hover:bg-sea-50'
              }`}
            >
              <span className="relative h-14 w-14 overflow-hidden rounded-full border border-sea-100 bg-sea-50">
                <Image src={cat.image} alt={cat.name} fill sizes="56px" className="object-cover" />
              </span>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
