'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/lib/useProducts';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [search, setSearch] = useState('');
  const { products } = useProducts();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category ? p.category === category : true;
      const matchesSearch = search
        ? p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.localName || '').toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  return (
    <>
      <CategoryNav activeCategory={category} />
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="section-title">{category ? category : 'All Seafood Products'}</h1>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search seafood..."
              className="w-full rounded-full border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-sea-500 focus:outline-none"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-gray-500">No products found. Try a different category or search term.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
