import Image from 'next/image';
import { Fish, Globe2, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us | RSN Sea Food',
  description: 'RSN Sea Food is an ocean-fresh seafood harvesting, processing, and distribution business based in Kalpitiya, Sri Lanka.',
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="section-title">About RSN Sea Food</h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            RSN Sea Food is an ocean-fresh seafood harvesting, processing, and distribution business located in
            the strategic coastal peninsula of Kalpitiya, Sri Lanka. We source daily from local artisanal
            fishermen and deliver islandwide — from home kitchens to hotels, restaurants, and international
            export partners.
          </p>
          <p className="mt-3 font-display text-lg font-semibold text-coral-600">
            &ldquo;Fresh From Kalpitiya. Quality You Can Trust.&rdquo;
          </p>
        </div>
        <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-card sm:h-80">
          <Image
            src="https://images.unsplash.com/photo-1544943910-4c1dc44aab44?q=80&w=1200&auto=format&fit=crop"
            alt="Fishing boats at Kalpitiya harbor"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-sea-100 bg-white p-6 text-center">
          <Fish className="mx-auto text-sea-600" size={28} />
          <p className="mt-3 font-display font-bold text-sea-900">Domestic Retail & HORECA</p>
          <p className="mt-1 text-xs text-gray-500">Daily supply to households, hotels, and restaurants across Sri Lanka.</p>
        </div>
        <div className="rounded-2xl border border-sea-100 bg-white p-6 text-center">
          <Globe2 className="mx-auto text-sea-600" size={28} />
          <p className="mt-3 font-display font-bold text-sea-900">International Export</p>
          <p className="mt-1 text-xs text-gray-500">Export-grade seafood processed and air-freighted globally via Colombo Airport.</p>
        </div>
        <div className="rounded-2xl border border-sea-100 bg-white p-6 text-center">
          <Users className="mx-auto text-sea-600" size={28} />
          <p className="mt-3 font-display font-bold text-sea-900">Kalpitiya Fishermen Partners</p>
          <p className="mt-1 text-xs text-gray-500">Fair, steady purchase agreements that support the local fishing community.</p>
        </div>
      </div>
    </section>
  );
}
