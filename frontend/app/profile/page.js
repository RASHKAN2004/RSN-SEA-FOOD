"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  LogOut,
  MessageCircle,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  ChevronRight,
  Fish,
} from "lucide-react";
import { api } from "@/lib/api";
import { DEFAULT_DISTRICT, SRI_LANKA_DISTRICTS } from "@/lib/districts";
import { WHATSAPP_DISPLAY, generalOrderLink } from "@/lib/whatsapp";

const emptyForm = {
  name: "",
  phone: "",
  whatsapp: "",
  street: "",
  city: "",
  district: DEFAULT_DISTRICT,
  postalCode: "",
};

export default function ProfilePage() {
  const [form, setForm] = useState(emptyForm);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .me()
      .then(({ user }) => {
        setUser(user);
        const address = user.addresses?.[0] || {};
        setForm({
          name: user.name || "",
          phone: user.phone || "",
          whatsapp: user.whatsapp || "",
          street: address.street || "",
          city: address.city || "",
          district: address.district || DEFAULT_DISTRICT,
          postalCode: address.postalCode || "",
        });
      })
      .catch(() => setError("Please sign in to view your profile."))
      .finally(() => setLoading(false));
  }, []);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await api.updateProfile(form);
      if (res.user) setUser(res.user);
      setMessage("Your profile & delivery address have been updated successfully!");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError(err.message || "Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await api.logout().catch(() => {});
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sea-500 border-t-transparent" />
        <p className="text-sm font-medium text-gray-500">Loading your account details...</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-coral-50 text-coral-600 mb-4 shadow-inner">
            <UserRound size={32} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-sea-950">
            Sign In Required
          </h1>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Please sign in to access your customer account, delivery addresses, and fast ordering.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/signin?next=/profile" className="btn-primary w-full !py-3">
              <span>Sign In to Account</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/" className="text-xs font-semibold text-sea-700 hover:text-sea-900 py-1">
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-slate-200/80 bg-white py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-xs font-medium text-gray-500 lg:px-8">
          <Link href="/" className="hover:text-sea-700 transition">
            Home
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="font-semibold text-sea-950">My Account & Profile</span>
        </div>
      </div>

      {/* Account Hero Banner */}
      <section className="bg-gradient-to-r from-[#04191d] via-[#083038] to-[#04191d] py-12 text-white border-b border-white/10 shadow-inner">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-coral-500 to-coral-600 text-2xl sm:text-3xl font-bold text-white shadow-xl shadow-coral-500/20 border-2 border-white/20">
                {userInitial}
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-[#051c20]" title="Verified Customer">
                  <ShieldCheck size={14} />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {user?.name || "Customer"}
                  </h1>
                  <span className="rounded-full bg-coral-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-coral-300 border border-coral-500/30">
                    VIP Member
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <Mail size={14} className="text-teal-400" />
                  <span>{user?.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/products"
                className="btn-primary !py-2.5 !px-5 text-xs font-semibold tracking-wide flex items-center gap-2 shadow-md shadow-coral-500/25"
              >
                <ShoppingBag size={15} />
                <span>Shop Fresh Catches</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Account Details Form */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Quick Cards & Concierge */}
          <div className="space-y-6">
            {/* Delivery Info Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sea-50 text-sea-700">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-sea-950">
                    Delivery Hub
                  </h3>
                  <p className="text-xs text-gray-500">
                    Dispatched from Kalpitiya
                  </p>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Current District</span>
                  <span className="font-bold text-sea-950">{form.district || DEFAULT_DISTRICT}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Cold-Chain Transit</span>
                  <span className="font-semibold text-emerald-600">Sub-Zero Thermal Box</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Delivery Guarantee</span>
                  <span className="font-semibold text-sea-800">100% Fresh or Replace</span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-sea-50/60 p-3.5 border border-sea-100/80 text-[11px] text-sea-900 leading-relaxed">
                💡 <span className="font-semibold">Pro tip:</span> Orders over Rs. 5,000 qualify for free islandwide cold-chain delivery.
              </div>
            </div>

            {/* Direct WhatsApp Concierge Card */}
            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50/70 via-white to-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-sea-950">
                    WhatsApp Concierge
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold">
                    Direct Harbor Line
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Need today&apos;s live harvest photos, custom steak cuts, or special whole fish portions? Message our harbor dispatch team directly.
              </p>

              <a
                href={generalOrderLink()}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 px-4 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-700"
              >
                <MessageCircle size={15} />
                <span>Chat with Kalpitiya Harbor</span>
              </a>
            </div>
          </div>

          {/* Right Column: Editable Profile & Address Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="font-display text-2xl font-bold text-sea-950">
                    Contact & Delivery Settings
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Keep your primary delivery information up-to-date for fast 1-click ordering.
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 border border-teal-200">
                  <Sparkles size={13} className="text-teal-600" />
                  Auto-fill enabled
                </span>
              </div>

              {/* Feedback Toasts */}
              {error && (
                <div className="mt-6 rounded-2xl bg-red-50 p-4 border border-red-200 text-xs sm:text-sm text-red-700">
                  {error}
                </div>
              )}
              {message && (
                <div className="mt-6 flex items-center gap-2.5 rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-800 animate-fade-in">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {/* Section 1: Customer Contact Details */}
              <div className="mt-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-coral-600 flex items-center gap-1.5">
                  <UserRound size={14} /> Personal Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-sea-900">
                      Full Name <span className="text-coral-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="name"
                        required
                        value={form.name}
                        onChange={updateField}
                        placeholder="e.g. Mohamed Raskhan"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-3.5 pr-4 text-xs sm:text-sm text-sea-950 outline-none transition focus:border-sea-500 focus:bg-white focus:ring-2 focus:ring-sea-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-sea-900">
                      Account Email <span className="text-xs font-normal text-gray-400">(Registered)</span>
                    </label>
                    <input
                      disabled
                      value={user?.email || ""}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-100/70 py-3 pl-3.5 pr-4 text-xs sm:text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-sea-900">
                      Phone Number <span className="text-coral-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="phone"
                        required
                        value={form.phone}
                        onChange={updateField}
                        placeholder="07X XXX XXXX"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-3.5 pr-4 text-xs sm:text-sm text-sea-950 outline-none transition focus:border-sea-500 focus:bg-white focus:ring-2 focus:ring-sea-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-sea-900">
                      WhatsApp Number <span className="text-xs font-normal text-gray-400">(For catch photos)</span>
                    </label>
                    <div className="relative">
                      <input
                        name="whatsapp"
                        value={form.whatsapp}
                        onChange={updateField}
                        placeholder="07X XXX XXXX"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-3.5 pr-4 text-xs sm:text-sm text-sea-950 outline-none transition focus:border-sea-500 focus:bg-white focus:ring-2 focus:ring-sea-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Primary Shipping Destination */}
              <div className="mt-8 space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-coral-600 flex items-center gap-1.5">
                  <MapPin size={14} /> Primary Delivery Address
                </h3>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sea-900">
                    Street Address & House Details
                  </label>
                  <input
                    name="street"
                    value={form.street}
                    onChange={updateField}
                    placeholder="House number, apartment name, street name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-3.5 pr-4 text-xs sm:text-sm text-sea-950 outline-none transition focus:border-sea-500 focus:bg-white focus:ring-2 focus:ring-sea-100"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-sea-900">
                      City / Town
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={updateField}
                      placeholder="e.g. Kalpitiya / Colombo"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-3.5 pr-4 text-xs sm:text-sm text-sea-950 outline-none transition focus:border-sea-500 focus:bg-white focus:ring-2 focus:ring-sea-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-sea-900">
                      District (Sri Lanka)
                    </label>
                    <select
                      name="district"
                      value={form.district}
                      onChange={updateField}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-3 text-xs sm:text-sm text-sea-950 outline-none transition focus:border-sea-500 focus:bg-white focus:ring-2 focus:ring-sea-100 cursor-pointer"
                    >
                      {SRI_LANKA_DISTRICTS.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-sea-900">
                      Postal Code <span className="text-xs font-normal text-gray-400">(Optional)</span>
                    </label>
                    <input
                      name="postalCode"
                      value={form.postalCode}
                      onChange={updateField}
                      placeholder="e.g. 61300"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-3.5 pr-4 text-xs sm:text-sm text-sea-950 outline-none transition focus:border-sea-500 focus:bg-white focus:ring-2 focus:ring-sea-100"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Action Button */}
              <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary !rounded-full !py-3 !px-7 text-xs sm:text-sm font-bold shadow-lg shadow-coral-500/25 flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>{saving ? "Saving Changes..." : "Save Profile Details"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
