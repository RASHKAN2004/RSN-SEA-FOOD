'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, SlidersHorizontal, ArrowUpDown, Sparkles, Fish, ShieldCheck } from 'lucide-react';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/lib/useProducts';
import { useLanguage } from '@/context/LanguageContext';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const { products, loading } = useProducts();
  const { t } = useLanguage();

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = category ? p.category === category : true;
      const matchesSearch = search
        ? p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.localName || '').toLowerCase().includes(search.toLowerCase()) ||
          (p.category || '').toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, category, search, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Category Navigation Bar */}
      <CategoryNav activeCategory={category} />

      {/* Collection Header Banner */}
      <section className="bg-gradient-to-r from-[#062429] via-[#0b3a42] to-[#062429] py-12 text-white border-b border-white/10 shadow-inner">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-sea-300 font-semibold uppercase tracking-widest">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <span>/</span>
                <span className="text-coral-300">{category || "All Products"}</span>
              </div>

              <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                {category ? category : t('All Seafood Products')}
              </h1>

              <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-300">
                Landed daily at Kalpitiya Harbor. 100% chemical-free, cleaned, and packed in sub-zero thermal insulation.
              </p>
            </div>

            {/* Quick Guarantees Box */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-xs text-white backdrop-blur-md">
                <Fish size={14} className="text-teal-300" />
                <span>Daily Kalpitiya Catch</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-xs text-white backdrop-blur-md">
                <ShieldCheck size={14} className="text-emerald-300" />
                <span>Cold-Chain Guaranteed</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
        {/* Controls Toolbar: Search & Sort */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          {/* Search Input with Clear Button */}
          <div className="relative flex-1 max-w-md">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search seafood (e.g. Prawns, Crab, Seer Fish)...')}
              className="w-full rounded-full border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-9 text-xs sm:text-sm text-sea-950 placeholder:text-gray-400 focus:border-sea-500 focus:bg-white focus:outline-none transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Result Count & Sorting */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              {filtered.length} {filtered.length === 1 ? 'Variety' : 'Varieties'}
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown size={15} className="text-gray-400 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-sea-900 outline-none focus:border-sea-500 transition cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(category || search) && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Active filters:</span>
            {category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sea-100/80 px-3 py-1 text-xs font-semibold text-sea-800 border border-sea-200">
                Category: {category}
                <button
                  type="button"
                  onClick={() => router.push('/products')}
                  className="hover:text-coral-600"
                  aria-label="Remove category filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-100/80 px-3 py-1 text-xs font-semibold text-coral-800 border border-coral-200">
                Keyword: &ldquo;{search}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="hover:text-coral-900"
                  aria-label="Remove search filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSearch('');
                router.push('/products');
              }}
              className="text-xs text-gray-400 hover:text-coral-600 underline ml-2"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center my-8 shadow-sm">
            <Fish size={44} className="mx-auto text-sea-300 mb-3" />
            <h3 className="font-display text-2xl font-bold text-sea-950">No seafood products found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              We couldn&apos;t find any catch matching &ldquo;{search}&rdquo;. Try another name or clear your filters to see all daily harvest options.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  router.push('/products');
                }}
                className="btn-primary !rounded-full !py-2.5 text-xs"
              >
                View All Products
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sea-500 border-t-transparent" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
