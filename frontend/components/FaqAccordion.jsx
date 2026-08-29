'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ_ITEMS = [
  { q: 'What areas do you deliver to?', a: 'We deliver islandwide across all 25 districts of Sri Lanka, from our base in Kalpitiya, Puttalam District.' },
  { q: 'Do you deliver to Puttalam?', a: 'Yes — Puttalam is our default and fastest delivery district since we are based in Kalpitiya, within Puttalam District.' },
  { q: 'What is the minimum order quantity?', a: 'Most items have a minimum order of 500g. This is shown on every product card and product page.' },
  { q: 'How can I place an order?', a: 'You can add items to your cart and checkout online, or order directly via our WhatsApp button for a quick manual order.' },
  { q: 'Can I order through WhatsApp?', a: 'Yes, every product has a "WhatsApp Order" button that opens a pre-filled message with the product and quantity.' },
  { q: 'What payment methods are available?', a: 'We currently support Cash on Delivery and WhatsApp Order / Manual Confirmation. A simulated card payment option is also available at checkout.' },
  { q: 'How is the seafood packed?', a: 'All seafood is cleaned, chilled, and packed in insulated, leak-proof packaging to preserve freshness during transit.' },
  { q: 'How do you maintain freshness?', a: 'We use a cold-chain process from harbor to doorstep, with ice packs and temperature-controlled handling throughout.' },
  { q: 'How long does delivery take?', a: 'Puttalam district deliveries typically arrive same-day or next-day. Other districts usually take 1–2 days depending on distance.' },
  { q: 'Can I request a specific fish cut?', a: 'Yes — whole fish, steaks, or fillets can be requested. Just mention your preference when ordering via WhatsApp or in the order notes.' },
];

export default function FaqAccordion({ items = FAQ_ITEMS }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-sea-100 rounded-2xl border border-sea-100 bg-white">
      {items.map((item, idx) => (
        <div key={item.q}>
          <button
            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-sea-900"
          >
            {item.q}
            <ChevronDown
              size={18}
              className={`shrink-0 text-sea-500 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
            />
          </button>
          {openIndex === idx && (
            <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
