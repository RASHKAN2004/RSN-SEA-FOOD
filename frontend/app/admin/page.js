"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Banknote,
  Loader2,
  Mail,
  Package,
  PlusCircle,
  RefreshCw,
  ShoppingBag,
  Trash2,
  Users,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { api, resolveImageUrl } from "@/lib/api";
import { formatLKR } from "@/data/products";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Cold Packing",
  "Dispatched",
  "Delivered",
  "Cancelled",
];

function MetricCard({ label, value, detail, icon: Icon, accent = "sea" }) {
  const accents = {
    sea: "bg-sea-50 text-sea-700",
    coral: "bg-coral-50 text-coral-600",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-2xl border border-sea-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-sea-950">
            {value}
          </p>
          <p className="mt-1 text-xs text-gray-500">{detail}</p>
        </div>
        <span className={`rounded-xl p-3 ${accents[accent]}`}>
          <Icon size={20} />
        </span>
      </div>
    </div>
  );
}

function SectionHeading({ title, description, href, linkLabel }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="font-display text-lg font-bold text-sea-950">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="text-xs font-bold text-sea-700 hover:text-coral-600">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

function statusTone(status) {
  if (["Delivered", "Confirmed", "paid", "Contacted", "Closed", "In Stock"].includes(status)) {
    return "bg-emerald-50 text-emerald-700";
  }
  if (["Pending", "New", "Cold Packing", "Seasonal Catch"].includes(status)) {
    return "bg-amber-50 text-amber-700";
  }
  if (["Cancelled", "failed", "Out of Stock"].includes(status)) {
    return "bg-rose-50 text-rose-700";
  }
  return "bg-slate-100 text-slate-600";
}

function formatDate(value) {
  return value
    ? new Date(value).toLocaleDateString("en-LK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function moveStatusCount(statuses, fromStatus, toStatus) {
  if (!fromStatus || fromStatus === toStatus) return safeArray(statuses);
  const counts = new Map(safeArray(statuses).map(({ _id, count }) => [_id, count]));
  counts.set(fromStatus, Math.max(0, (counts.get(fromStatus) || 0) - 1));
  if (toStatus) counts.set(toStatus, (counts.get(toStatus) || 0) + 1);
  return Array.from(counts, ([_id, count]) => ({ _id, count })).filter(({ count }) => count > 0);
}

function AdminDashboardInner() {
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [updatingInquiryId, setUpdatingInquiryId] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    const [dashboardResult, productResult] = await Promise.allSettled([
      api.getAdminDashboard(),
      api.getProducts({ limit: 50, page: 1 }),
    ]);

    const errors = [];
    if (dashboardResult.status === "fulfilled") {
      setDashboard(dashboardResult.value?.dashboard || null);
    } else {
      errors.push(dashboardResult.reason?.message || "Failed to load store analytics.");
    }
    if (productResult.status === "fulfilled") {
      setProducts(Array.isArray(productResult.value?.products) ? productResult.value.products : []);
    } else {
      errors.push(productResult.reason?.message || "Failed to load products.");
    }
    if (errors.length) setError(errors.join(" "));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function handleDelete(product) {
    const productId = product?._id || product?.id || product?.slug;
    if (!productId) {
      setError("This product is missing an id and cannot be removed.");
      return;
    }
    if (!confirm(`Delete "${product.name || "this product"}"? This cannot be undone.`)) return;
    setDeletingId(productId);
    setError("");
    try {
      await api.adminDeleteProduct(productId);
      setProducts((previous) => previous.filter((item) => (item._id || item.id || item.slug) !== productId));
      const removedProduct = products.find((item) => (item._id || item.id || item.slug) === productId);
      setDashboard((previous) => previous
        ? {
            ...previous,
            products: {
              ...previous.products,
              total: Math.max(0, (previous.products?.total || 0) - 1),
              availability: moveStatusCount(
                previous.products?.availability,
                removedProduct?.availability,
                null,
              ),
              lowStock: safeArray(previous.products?.lowStock).filter((item) => item._id !== productId),
            },
          }
        : previous);
    } catch (err) {
      setError(err.message || "Product could not be deleted.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleOrderStatusChange(orderId, orderStatus) {
    setUpdatingOrderId(orderId);
    setError("");
    try {
      const response = await api.updateAdminOrderStatus(orderId, orderStatus);
      setDashboard((previous) => previous
        ? {
            ...previous,
            orders: {
              ...previous.orders,
              statuses: moveStatusCount(
                previous.orders?.statuses,
                safeArray(previous.orders?.recent).find((order) => order._id === orderId)?.orderStatus,
                orderStatus,
              ),
              recent: safeArray(previous.orders?.recent).map((order) =>
                order._id === orderId ? response.order : order,
              ),
            },
          }
        : previous);
    } catch (err) {
      setError(err.message || "Order status could not be updated.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function handleInquiryStatusChange(inquiryId, status) {
    setUpdatingInquiryId(inquiryId);
    setError("");
    try {
      const response = await api.updateAdminInquiryStatus(inquiryId, status);
      setDashboard((previous) => previous
        ? {
            ...previous,
            inquiries: {
              ...previous.inquiries,
              statuses: moveStatusCount(
                previous.inquiries?.statuses,
                safeArray(previous.inquiries?.recent).find((inquiry) => inquiry._id === inquiryId)?.status,
                status,
              ),
              recent: safeArray(previous.inquiries?.recent).map((inquiry) =>
                inquiry._id === inquiryId ? response.inquiry : inquiry,
              ),
            },
          }
        : previous);
    } catch (err) {
      setError(err.message || "Inquiry status could not be updated.");
    } finally {
      setUpdatingInquiryId(null);
    }
  }

  const data = dashboard;
  const ordersData = data?.orders ?? {};
  const productsData = data?.products ?? {};
  const customersData = data?.customers ?? {};
  const inquiriesData = data?.inquiries ?? {};
  const recentOrders = safeArray(ordersData.recent);
  const recentCustomers = safeArray(customersData.recent);
  const recentInquiries = safeArray(inquiriesData.recent);
  const topProducts = safeArray(ordersData.topProducts);
  const maxTopProductQuantity = Math.max(
    1,
    ...topProducts.map((product) => Number(product.quantityKg) || 0),
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral-600">
            Store overview
          </p>
          <h1 className="section-title mt-1">E-commerce Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sales, orders, customers, products, inventory, and customer inquiries in one place.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="btn-outline !px-3 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Refresh dashboard"
            title="Refresh dashboard"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <Link href="/admin/products/new" className="btn-primary">
            <PlusCircle size={16} /> Add Product
          </Link>
        </div>
      </header>

      {error && (
        <p role="alert" className="rounded-xl bg-coral-50 p-3 text-sm text-coral-700">
          {error}
        </p>
      )}

      {loading && !data ? (
        <div className="flex justify-center rounded-2xl border border-sea-100 bg-white py-16">
          <Loader2 className="animate-spin text-sea-600" size={28} />
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Paid revenue"
              value={formatLKR(ordersData.paidRevenue || 0)}
              detail={`${formatLKR(ordersData.monthRevenue || 0)} this month · AOV ${formatLKR(ordersData.averageOrderValue || 0)}`}
              icon={Banknote}
              accent="green"
            />
            <MetricCard
              label="Orders"
              value={ordersData.total ?? "—"}
              detail={`${ordersData.paidCount || 0} paid orders`}
              icon={ShoppingBag}
              accent="coral"
            />
            <MetricCard
              label="Customers"
              value={customersData.total ?? "—"}
              detail="Registered customer accounts"
              icon={Users}
            />
            <MetricCard
              label="Product catalogue"
              value={productsData.total ?? "—"}
              detail={`${safeArray(productsData.lowStock).length} low-stock alerts`}
              icon={Package}
              accent={safeArray(productsData.lowStock).length ? "amber" : "sea"}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div id="orders" className="min-w-0 rounded-2xl border border-sea-100 bg-white p-5 shadow-sm">
              <SectionHeading
                title="Recent orders"
                description="Review customer, payment, delivery area, and fulfillment status."
              />
              {recentOrders.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-xs">
                    <thead className="border-b border-sea-100 text-[10px] uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="py-3 pr-3">Order / Date / Items</th>
                        <th className="py-3 pr-3">Customer</th>
                        <th className="py-3 pr-3">District</th>
                        <th className="py-3 pr-3">Total / Payment</th>
                        <th className="py-3">Fulfillment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sea-50">
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td className="py-3 pr-3">
                            <p className="font-bold text-sea-900">{order.orderNumber}</p>
                            <p className="mt-1 text-gray-500">{formatDate(order.createdAt)}</p>
                            <p className="mt-1 max-w-[190px] text-gray-600">
                              {(order.items || []).map((item) => `${item.name} × ${item.quantityKg}kg`).join(", ") || "No item details"}
                            </p>
                          </td>
                          <td className="py-3 pr-3">
                            <p className="font-semibold text-gray-800">{order.customer?.name || "Guest"}</p>
                            <p className="mt-1 text-gray-500">{order.customer?.phone || order.customer?.email}</p>
                          </td>
                          <td className="py-3 pr-3 text-gray-600">{order.shippingAddress?.district || "—"}</td>
                          <td className="py-3 pr-3">
                            <p className="font-bold text-sea-900">{formatLKR(order.totalAmount)}</p>
                            <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 ${statusTone(order.paymentStatus)}`}>
                              {order.paymentStatus || "pending"}
                            </span>
                          </td>
                          <td className="py-3">
                            <select
                              value={order.orderStatus}
                              onChange={(event) => handleOrderStatusChange(order._id, event.target.value)}
                              disabled={updatingOrderId === order._id}
                              aria-label={`Update order ${order.orderNumber} status`}
                              className="max-w-[150px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-sea-900 disabled:opacity-60"
                            >
                              {ORDER_STATUSES.map((status) => <option key={status}>{status}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-gray-500">No orders have been placed yet.</p>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-sea-100 bg-white p-5 shadow-sm">
                <SectionHeading title="Order status" description="Current fulfillment workload" />
                <div className="space-y-3">
                  {safeArray(data?.orders?.statuses).length ? safeArray(data?.orders?.statuses).map(({ _id, count }) => (
                    <div key={_id} className="flex items-center justify-between gap-3 text-xs">
                      <span className={`rounded-full px-2.5 py-1 font-semibold ${statusTone(_id)}`}>{_id}</span>
                      <span className="font-bold text-sea-950">{count}</span>
                    </div>
                  )) : <p className="text-sm text-gray-500">No order status data available.</p>}
                </div>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-gray-500">Payment status</p>
                  <div className="flex flex-wrap gap-2">
                    {safeArray(data?.orders?.paymentStatuses).map(({ _id, count }) => (
                      <span key={_id} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(_id)}`}>
                        {_id}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-sea-100 bg-white p-5 shadow-sm">
                <SectionHeading title="Best-selling seafood" description="Ranked by ordered weight" />
                <div className="space-y-4">
                  {topProducts.length ? topProducts.map((product) => (
                    <div key={product._id}>
                      <div className="mb-1 flex justify-between gap-3 text-xs">
                        <span className="truncate font-semibold text-sea-900">{product._id}</span>
                        <span className="shrink-0 text-gray-500">{product.quantityKg} kg</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-sea-50">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sea-600 to-teal-400"
                          style={{ width: `${Math.max(6, ((Number(product.quantityKg) || 0) / maxTopProductQuantity) * 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-right text-[10px] text-gray-500">
                        Paid sales {formatLKR(product.revenue)}
                      </p>
                    </div>
                  )) : <p className="text-sm text-gray-500">Sales data will appear after orders arrive.</p>}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-sea-100 bg-white p-5 shadow-sm">
              <SectionHeading
                title="Inventory & products"
                description={`Showing ${products.length} of ${productsData.total || 0} products`}
                href="#products"
                linkLabel="Manage products ↓"
              />
              <div className="mb-4 flex flex-wrap gap-2">
                {safeArray(data?.products?.availability).map(({ _id, count }) => (
                  <span key={_id} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(_id)}`}>
                    {_id}: {count}
                  </span>
                ))}
              </div>
              {safeArray(productsData.lowStock).length ? (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="flex items-center gap-2 text-xs font-bold text-amber-800">
                    <AlertTriangle size={15} /> Low stock — 10 kg or less
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {safeArray(productsData.lowStock).map((product) => (
                      <span key={product._id} className="rounded-lg bg-white px-2.5 py-1.5 text-xs text-amber-900">
                        {product.name}: <strong>{product.stockKg} kg</strong>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                  No low-stock products need attention.
                </p>
              )}
              <div id="products" className="overflow-x-auto">
                {products.length ? (
                  <table className="w-full min-w-[500px] text-left text-xs">
                    <thead className="border-b border-sea-100 text-[10px] uppercase text-gray-500">
                      <tr>
                        <th className="py-2 pr-3">Product</th>
                        <th className="py-2 pr-3">Category</th>
                        <th className="py-2 pr-3">Price</th>
                        <th className="py-2 pr-3">Stock</th>
                        <th className="py-2">Availability</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sea-50">
                      {products.map((product) => {
                        const productId = product._id || product.id || product.slug;
                        return (
                          <tr key={productId}>
                            <td className="py-2.5 pr-3">
                              <div className="flex items-center gap-2">
                                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-sea-50">
                                  {product.image && (
                                    <Image
                                      src={resolveImageUrl(product.image)}
                                      alt={product.name || "Product image"}
                                      fill
                                      sizes="36px"
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <span className="font-semibold text-sea-900">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-2.5 pr-3 text-gray-600">{product.category}</td>
                            <td className="py-2.5 pr-3 font-semibold text-gray-700">{formatLKR(product.price)}</td>
                            <td className="py-2.5 pr-3 text-gray-600">{product.stockKg ?? 0} kg</td>
                            <td className="py-2.5">
                              <span className={`rounded-full px-2 py-1 ${statusTone(product.availability)}`}>
                                {product.availability}
                              </span>
                            </td>
                            <td className="py-2.5">
                              <div className="flex justify-end gap-1">
                                <Link
                                  href={`/admin/products/${productId}/edit`}
                                  className="rounded-lg px-2 py-1.5 font-semibold text-sea-700 hover:bg-sea-50"
                                  aria-label={`Edit ${product.name}`}
                                >
                                  Edit
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(product)}
                                  disabled={deletingId === productId}
                                  className="rounded-lg p-2 text-coral-600 hover:bg-coral-50 disabled:opacity-50"
                                  aria-label={`Delete ${product.name}`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-gray-500">
                    {loading ? "Loading products…" : "No products found."}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-sea-100 bg-white p-5 shadow-sm">
                <SectionHeading
                  title="Customers"
                  description={`${customersData.total || 0} registered accounts · newest sign-ups`}
                />
                {recentCustomers.length ? (
                  <div className="divide-y divide-sea-50">
                    {recentCustomers.map((customer) => (
                      <div key={customer._id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-sea-900">{customer.name}</p>
                          <p className="truncate text-xs text-gray-500">{customer.email} · {customer.phone}</p>
                        </div>
                        <span className="shrink-0 text-[10px] text-gray-400">{formatDate(customer.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-500">No customer accounts yet.</p>}
              </div>

              <div id="inquiries" className="rounded-2xl border border-sea-100 bg-white p-5 shadow-sm">
                <SectionHeading
                  title="Customer inquiries"
                  description={`${inquiriesData.total || 0} total messages`}
                />
                <div className="mb-4 flex flex-wrap gap-2">
                  {safeArray(inquiriesData.statuses).map(({ _id, count }) => (
                    <span key={_id} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(_id)}`}>
                      {_id}: {count}
                    </span>
                  ))}
                </div>
                {recentInquiries.length ? (
                  <div className="space-y-3">
                    {recentInquiries.map((inquiry) => (
                      <article key={inquiry._id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-sea-900">{inquiry.name}</p>
                            <p className="text-xs text-gray-500">{inquiry.phone} · {inquiry.district}</p>
                          </div>
                          <select
                            value={inquiry.status}
                            onChange={(event) => handleInquiryStatusChange(inquiry._id, event.target.value)}
                            disabled={updatingInquiryId === inquiry._id}
                            aria-label={`Update inquiry from ${inquiry.name}`}
                            className={`shrink-0 rounded-full border-0 px-2 py-1 text-[10px] font-semibold ${statusTone(inquiry.status)}`}
                          >
                            {["New", "Contacted", "Closed"].map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">{inquiry.message}</p>
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-sea-700 hover:text-coral-600"
                        >
                          <Mail size={12} /> Contact customer
                        </a>
                      </article>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-500">No inquiries to show.</p>}
              </div>
            </div>
          </section>
        </>
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
