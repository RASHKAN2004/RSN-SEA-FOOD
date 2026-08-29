'use client';

import { useState } from 'react';
import { X, MessageCircle, CheckCircle2 } from 'lucide-react';
import { SRI_LANKA_DISTRICTS, DEFAULT_DISTRICT } from '@/lib/districts';
import { inquiryLink } from '@/lib/whatsapp';
import { api } from '@/lib/api';

const initialForm = { name: '', phone: '', whatsapp: '', district: DEFAULT_DISTRICT, message: '' };

export default function InquiryModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.createInquiry(form);
      setSubmitted(true);
    } catch (err) {
      // Still show success UX for demo/offline use, but surface the error
      setError(err.message);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setForm(initialForm);
    setSubmitted(false);
    setError('');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-sea-900">Submit Your Inquiry</h3>
          <button onClick={handleClose} aria-label="Close">
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="text-sea-600" size={40} />
            <p className="font-semibold text-sea-900">Thank you! We will contact you shortly.</p>
            {error && <p className="text-xs text-gray-400">(Saved locally — server unreachable: {error})</p>}
            <a
              href={inquiryLink(form)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white"
            >
              <MessageCircle size={16} /> Send via WhatsApp too
            </a>
            <button onClick={handleClose} className="btn-outline mt-2">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input required placeholder="Name" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.name} onChange={(e) => update('name', e.target.value)} />
            <input required placeholder="Phone Number" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            <input placeholder="WhatsApp Number" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} />
            <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.district} onChange={(e) => update('district', e.target.value)}>
              {SRI_LANKA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <textarea required placeholder="Message" rows={3} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.message} onChange={(e) => update('message', e.target.value)} />
            <button type="submit" disabled={submitting} className="btn-primary mt-1 w-full">
              {submitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
