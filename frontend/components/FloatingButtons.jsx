'use client';

import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { generalOrderLink } from '@/lib/whatsapp';
import InquiryModal from './InquiryModal';

export default function FloatingButtons() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <a
        href={generalOrderLink()}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-floating transition hover:scale-105 sm:right-6"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle size={26} />
      </a>

      <button
        onClick={() => setInquiryOpen(true)}
        className="fixed bottom-6 left-5 z-50 flex h-14 items-center gap-2 rounded-full bg-coral-500 px-4 text-white shadow-floating transition hover:scale-105 sm:left-6"
        aria-label="Submit your inquiry"
      >
        <Send size={20} />
        <span className="hidden text-sm font-semibold sm:inline">Submit Your Inquiry</span>
      </button>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}
