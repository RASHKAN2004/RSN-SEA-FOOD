'use client';

import { useState } from 'react';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { generalOrderLink, WHATSAPP_DISPLAY } from '@/lib/whatsapp';
import InquiryModal from './InquiryModal';

export default function FloatingButtons() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      {/* WhatsApp Quick Order & Concierge Button */}
      <a
        href={generalOrderLink()}
        target="_blank"
        rel="noreferrer"
        className="group fixed bottom-6 right-5 z-50 flex items-center gap-2.5 rounded-full bg-emerald-500 py-3 px-4 text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-105 hover:bg-emerald-600 sm:right-7"
        aria-label="Order on WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
        <MessageCircle size={22} className="shrink-0" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          Order on WhatsApp
        </span>
      </a>

      {/* Inquiry Trigger Button */}
      <button
        onClick={() => setInquiryOpen(true)}
        className="fixed bottom-6 left-5 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-coral-500 to-coral-600 py-3 px-4 text-white shadow-[0_10px_30px_rgba(247,106,43,0.35)] transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-coral-700 sm:left-7"
        aria-label="Submit your inquiry"
      >
        <Send size={18} />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          Custom Inquiry
        </span>
      </button>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}

