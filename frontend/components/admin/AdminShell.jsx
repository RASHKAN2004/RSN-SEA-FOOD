'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Package, PlusCircle, LogOut, Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';
import { api } from '@/lib/api';

export default function AdminShell({ children }) {
  const { user, loading, isAdmin } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-sea-600" size={28} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="section-title">Admin access required</h1>
        <p className="mt-2 text-sm text-gray-500">Please sign in with an admin account to continue.</p>
        <Link href="/admin/login" className="btn-primary mt-6 inline-flex">Go to Admin Login</Link>
      </div>
    );
  }

  async function handleLogout() {
    await api.logout().catch(() => {});
    router.push('/admin/login');
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin', label: 'Products', icon: Package },
    { href: '/admin/products/new', label: 'Add Product', icon: PlusCircle },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:px-8">
      <aside className="shrink-0 lg:w-56">
        <div className="rounded-2xl border border-sea-100 bg-white p-4">
          <p className="mb-1 text-xs text-gray-400">Signed in as</p>
          <p className="mb-4 truncate text-sm font-semibold text-sea-900">{user.name}</p>
          <nav className="flex flex-col gap-1 text-sm">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 font-medium transition ${
                  pathname === href ? 'bg-sea-50 text-sea-700' : 'text-gray-600 hover:bg-sea-50'
                }`}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-left font-medium text-coral-600 hover:bg-coral-50"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </div>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
