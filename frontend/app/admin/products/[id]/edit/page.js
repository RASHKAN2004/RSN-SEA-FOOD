'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import ProductForm from '@/components/admin/ProductForm';
import { api } from '@/lib/api';

function EditProductInner() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getProducts()
      .then((res) => {
        const found = res.products.find((p) => p._id === id);
        if (!found) throw new Error('Product not found');
        setProduct(found);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-sea-600" size={28} /></div>;
  }
  if (error) {
    return <p className="rounded-lg bg-coral-50 p-4 text-sm text-coral-700">{error}</p>;
  }

  return (
    <>
      <h1 className="section-title mb-6">Edit Product</h1>
      <ProductForm initialProduct={product} productId={id} />
    </>
  );
}

export default function EditProductPage() {
  return (
    <AdminShell>
      <EditProductInner />
    </AdminShell>
  );
}
