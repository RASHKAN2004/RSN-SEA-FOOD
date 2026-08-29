'use client';

import AdminShell from '@/components/admin/AdminShell';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <AdminShell>
      <h1 className="section-title mb-6">Add New Product</h1>
      <ProductForm />
    </AdminShell>
  );
}
