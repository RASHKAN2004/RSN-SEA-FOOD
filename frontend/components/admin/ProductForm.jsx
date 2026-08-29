'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UploadCloud, Loader2, Save } from 'lucide-react';
import { api, resolveImageUrl } from '@/lib/api';

const CATEGORY_OPTIONS = [
  'Tuna', 'Indian Mackerel', 'Sail Fish', 'Crab', 'Prawn', 'Cuttle Fish',
  'Barramundi', 'Skipjack Tuna', 'Mullet', 'Seer Fish', 'Sardine',
  'Anchovy', 'Squid', 'Lobster',
];

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProductForm({ initialProduct, productId }) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [form, setForm] = useState({
    name: initialProduct?.name || '',
    localName: initialProduct?.localName || '',
    category: initialProduct?.category || CATEGORY_OPTIONS[0],
    description: initialProduct?.description || '',
    price: initialProduct?.price || '',
    minimumQuantity: initialProduct?.minimumQuantity || '500g',
    freshnessGrade: initialProduct?.freshnessGrade || 'Daily Catch',
    availability: initialProduct?.availability || 'In Stock',
    featured: initialProduct?.featured || false,
    image: initialProduct?.image || '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await api.uploadImage(file);
      update('image', res.url);
    } catch (err) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (!form.image) throw new Error('Please upload a product photo.');
      const payload = {
        name: form.name,
        localName: form.localName,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        minimumQuantity: form.minimumQuantity,
        freshnessGrade: form.freshnessGrade,
        availability: form.availability,
        featured: form.featured,
        image: form.image,
        gallery: [form.image],
        unit: 'kg',
        sizes: [
          { label: form.minimumQuantity, priceMultiplier: 1 },
          { label: '1kg', priceMultiplier: 1.9 },
        ],
      };
      if (!isEdit) {
        payload.slug = `${slugify(form.name)}${form.localName ? '-' + slugify(form.localName) : ''}` || slugify(form.name) + '-' + Date.now();
      }

      if (isEdit) {
        await api.adminUpdateProduct(productId, payload);
        setSuccess('Product updated successfully.');
      } else {
        await api.adminCreateProduct(payload);
        setSuccess('Product created successfully.');
        setTimeout(() => router.push('/admin'), 900);
      }
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 rounded-2xl border border-sea-100 bg-white p-5 lg:col-span-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Product Name (English)</label>
            <input required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Barramundi" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Local Name (Sinhala/Tamil)</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.localName} onChange={(e) => update('localName', e.target.value)} placeholder="e.g. Modha" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Category</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Minimum Quantity</label>
            <input required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.minimumQuantity} onChange={(e) => update('minimumQuantity', e.target.value)} placeholder="e.g. 500g" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Starting Price (Rs.)</label>
            <input required type="number" min="0" step="1" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="e.g. 2380" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Freshness Grade</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.freshnessGrade} onChange={(e) => update('freshnessGrade', e.target.value)}>
              <option>Daily Catch</option>
              <option>Lagoon Sourced</option>
              <option>Export Grade</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Availability</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.availability} onChange={(e) => update('availability', e.target.value)}>
              <option>In Stock</option>
              <option>Seasonal Catch</option>
              <option>Out of Stock</option>
            </select>
          </div>
          <label className="flex items-center gap-2 self-end text-sm text-gray-600">
            <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
            Feature on homepage
          </label>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
          <textarea required rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Freshly sourced seafood, carefully handled and packed to maintain quality and freshness until delivery." />
        </div>
      </div>

      {/* Photo + save panel */}
      <div className="h-fit space-y-4 rounded-2xl border border-sea-100 bg-white p-5">
        <p className="font-display font-bold text-sea-900">Product Photo</p>
        <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-sea-200 bg-sea-50">
          {form.image ? (
            <Image src={resolveImageUrl(form.image)} alt="Product" fill sizes="300px" className="object-cover" />
          ) : (
            <span className="text-xs text-gray-400">No photo uploaded</span>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="animate-spin text-sea-600" size={24} />
            </div>
          )}
        </div>
        <label className="btn-outline flex w-full cursor-pointer items-center justify-center gap-2">
          <UploadCloud size={16} /> {form.image ? 'Replace Photo' : 'Upload Photo'}
          <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleImageChange} />
        </label>
        <p className="text-[11px] text-gray-400">JPG, PNG or WEBP. Max 5MB.</p>

        {error && <p className="text-sm text-coral-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button type="submit" disabled={saving || uploading} className="btn-primary w-full">
          <Save size={16} /> {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
