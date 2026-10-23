const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:5000";

// Product images can be relative (/images/products/x.jpg, served by the frontend)
// or relative uploads from the backend (/uploads/products/x.jpg) — resolve the latter
// to an absolute URL so <Image> can load it from the API server.
export function resolveImageUrl(src) {
  if (!src || typeof src !== "string") return src;

  const trimmed = src.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  if (trimmed.startsWith("/uploads/")) return `${API_ORIGIN}${trimmed}`;
  if (trimmed.startsWith("uploads/") || trimmed.startsWith("images/")) {
    return `${API_ORIGIN}/${trimmed}`;
  }

  return trimmed;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data;
}

export const api = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (slug) => request(`/products/${slug}`),
  getCategories: () => request("/products/meta/categories"),
  getDistricts: () => request("/meta/districts"),
  getBusiness: () => request("/meta/business"),
  createOrder: (payload) =>
    request("/orders", { method: "POST", body: JSON.stringify(payload) }),
  getOrder: (orderNumber) => request(`/orders/${orderNumber}`),
  getMyOrders: () => request("/orders/mine"),
  getAdminDashboard: () => request("/admin/dashboard"),
  updateAdminOrderStatus: (id, orderStatus) =>
    request(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ orderStatus }),
    }),
  updateAdminInquiryStatus: (id, status) =>
    request(`/inquiries/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  requestCheckoutEmailOtp: (payload) =>
    request("/orders/email-otp/request", { method: "POST", body: JSON.stringify(payload) }),
  verifyCheckoutEmailOtp: (payload) =>
    request("/orders/email-otp/verify", { method: "POST", body: JSON.stringify(payload) }),
  createInquiry: (payload) =>
    request("/inquiries", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  forgotPassword: (payload) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  resetPassword: (payload) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),
  updateProfile: (payload) =>
    request("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  // Admin: product management
  adminCreateProduct: (payload) =>
    request("/products", { method: "POST", body: JSON.stringify(payload) }),
  adminUpdateProduct: (id, payload) =>
    request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  adminDeleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  // Admin: image upload (multipart, no JSON content-type header)
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Image upload failed");
    return data;
  },
};

export default api;
