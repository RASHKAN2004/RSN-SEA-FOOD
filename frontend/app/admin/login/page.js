'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await api.login(form);
      if (res.user?.role !== 'admin') {
        setError('This account does not have admin access.');
        await api.logout().catch(() => {});
        return;
      }
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sea-100 text-sea-700">
        <ShieldCheck size={24} />
      </span>
      <h1 className="section-title mt-4">Admin Login</h1>
      <p className="mt-1 text-sm text-gray-500">RSN Sea Food — Product & Content Management</p>

      <form onSubmit={handleSubmit} className="mt-6 w-full space-y-3 rounded-2xl border border-sea-100 bg-white p-6">
        <input
          required
          type="email"
          placeholder="Admin Email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sea-500 focus:outline-none"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <input
          required
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sea-500 focus:outline-none"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        {error && <p className="text-sm text-coral-600">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          <LogIn size={16} /> {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-400">
        First time? Run <code className="rounded bg-gray-100 px-1 py-0.5">npm run seed:admin</code> in the backend
        to create the first admin account.
      </p>
    </div>
  );
}
