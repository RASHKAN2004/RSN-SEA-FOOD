'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Pencil, Trash2, Loader2, RefreshCw } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { api, resolveImageUrl } from '@/lib/api';
import { formatLKR } from '@/data/products';

function AdminDashboardInner() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function loadProducts() {
    setLoading(true);
    setError('');
    try {
      const res = await api.getProducts();
      setProducts(res.products || []);
    } catch (err) {
      setError(err.message || 'Failed to load products from the server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product._id);
    try {
      await api.adminDeleteProduct(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="section-title">Products</h1>
          <p className="text-sm text-gray-500">Manage photos, prices, and details shown on the storefront.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadProducts} className="btn-outline !px-3" aria-label="Refresh">
            <RefreshCw size={16} />
          </button>
          <Link href="/admin/products/new" className="btn-primary">
            <PlusCircle size={16} /> Add Product
          </Link>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-coral-50 p-3 text-sm text-coral-700">
          {error} — make sure the backend API is running.
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-sea-600" size={28} /></div>
      ) : products.length === 0 ? (
        <p className="rounded-2xl border border-sea-100 bg-white p-10 text-center text-sm text-gray-500">
          No products yet. Click &quot;Add Product&quot; to create your first listing.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-sea-100 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-sea-100 bg-sea-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sea-50">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-sea-50">
                      {p.image && (
                        <Image src={resolveImageUrl(p.image)} alt={p.name} fill sizes="40px" className="object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sea-900">{p.name}</p>
                      {p.localName && <p className="text-xs text-gray-500">{p.localName}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 font-medium text-sea-900">{formatLKR(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.availability === 'In Stock' ? 'bg-green-100 text-green-700' :
                      p.availability === 'Seasonal Catch' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {p.availability}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${p._id}/edit`} className="rounded-lg p-2 text-sea-600 hover:bg-sea-50" aria-label="Edit">
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p)}
                        disabled={deletingId === p._id}
                        className="rounded-lg p-2 text-coral-600 hover:bg-coral-50"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <AdminDashboardInner />
    </AdminShell>
  );
}
