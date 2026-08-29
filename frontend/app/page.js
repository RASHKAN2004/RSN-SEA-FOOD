'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, MapPin, Truck } from 'lucide-react';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import TrustSection from '@/components/TrustSection';
import FaqAccordion from '@/components/FaqAccordion';
import { useProducts } from '@/lib/useProducts';
import { generalOrderLink } from '@/lib/whatsapp';
import { SRI_LANKA_DISTRICTS } from '@/lib/districts';

export default function HomePage() {
  const { products } = useProducts();
  const featured = products.slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sea-800 via-sea-700 to-sea-600">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-sea-100">
              Fresh Seafood • Islandwide Delivery
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              Fresh Seafood Delivered to Your Door
            </h1>
            <p className="mt-4 max-w-md text-sea-100">
              Convenient fresh choice from Sri Lanka&apos;s trusted seafood delivery service, based in Kalpitiya, Puttalam District.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">Shop Seafood</Link>
              <a href={generalOrderLink()} target="_blank" rel="noreferrer" className="btn-secondary">
                <MessageCircle size={18} /> Order on WhatsApp
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-sea-100">
              <span className="flex items-center gap-2"><MapPin size={16} /> Serving Sri Lanka</span>
              <span className="flex items-center gap-2"><Truck size={16} /> Delivery in all 25 districts</span>
            </div>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-2xl sm:h-80 lg:h-96">
            <Image
              src="https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?q=80&w=1600&auto=format&fit=crop"
              alt="Fresh seafood catch ready for delivery"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <CategoryNav />

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="section-title">Fresh Catch This Week</h2>
            <p className="mt-1 text-sm text-gray-500">Hand-picked daily from Kalpitiya&apos;s coastal waters.</p>
          </div>
          <Link href="/products" className="btn-outline hidden sm:inline-flex">View All</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <Link href="/products" className="btn-outline mt-6 flex w-full items-center justify-center sm:hidden">View All Products</Link>
      </section>

      <TrustSection />

      {/* Delivery areas preview */}
      <section className="bg-sea-50 py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="section-title text-center">Islandwide Seafood Delivery</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-500">
            Delivery available across all 25 districts of Sri Lanka — with Puttalam as our home base and fastest delivery area.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {SRI_LANKA_DISTRICTS.slice(0, 10).map((d) => (
              <span
                key={d}
                className={`rounded-xl border px-3 py-2 text-center text-xs font-medium ${
                  d === 'Puttalam' ? 'border-coral-400 bg-coral-50 text-coral-700' : 'border-sea-100 bg-white text-sea-700'
                }`}
              >
                {d}{d === 'Puttalam' ? ' ★' : ''}
              </span>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/delivery-areas" className="btn-primary">See All 25 Districts</Link>
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <h2 className="section-title text-center">Frequently Asked Questions</h2>
        <div className="mx-auto mt-6 max-w-2xl">
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
