'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';

export default function CategoryNav({ activeCategory }) {
  const { t } = useLanguage();

  return (
    <div className="sticky top-[69px] z-30 border-b border-sea-200/60 bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(6,39,43,0.04)]">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
        <div className="relative">
          {/* Scrollable track */}
          <div className="no-scrollbar flex items-center gap-3 overflow-x-auto py-1 scroll-smooth">
            {/* All Catches Pill */}
            <Link
              href="/products"
              className={`group flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all duration-200 ${
                !activeCategory
                  ? 'bg-sea-900 text-white shadow-md shadow-sea-900/20 ring-2 ring-sea-700/50'
                  : 'bg-sea-50/80 text-sea-800 hover:bg-sea-100 border border-sea-100 hover:border-sea-200'
              }`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                !activeCategory ? 'bg-sea-800 text-coral-400' : 'bg-sea-200/70 text-sea-700'
              }`}>
                <Sparkles size={14} />
              </span>
              <span>{t('All Catches')}</span>
            </Link>

            {/* Category Items */}
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <Link
                  key={cat.name}
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className={`group flex shrink-0 items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-sea-900 text-white shadow-md shadow-sea-900/20 ring-2 ring-sea-700/50'
                      : 'bg-white text-gray-700 hover:bg-sea-50 hover:text-sea-900 border border-slate-200/80 hover:border-sea-300'
                  }`}
                >
                  <span className={`relative h-7 w-7 overflow-hidden rounded-full ring-2 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'ring-coral-400' : 'ring-sea-100'
                  }`}>
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </span>
                  <span className="whitespace-nowrap">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

