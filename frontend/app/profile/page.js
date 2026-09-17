"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  LogOut,
  MapPin,
  MessageCircle,
  Save,
  UserRound,
} from "lucide-react";
import { api } from "@/lib/api";
import { DEFAULT_DISTRICT, SRI_LANKA_DISTRICTS } from "@/lib/districts";

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
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .me()
      .then(({ user }) => {
        const address = user.addresses?.[0] || {};
        setEmail(user.email);
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
      await api.updateProfile(form);
      setMessage("Your profile has been updated.");
    } catch (err) {
      setError(err.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await api.logout().catch(() => {});
    window.location.href = "/";
  }

  if (loading)
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-500">
        Loading your profile...
      </main>
    );
  if (error && !email)
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <UserRound className="mx-auto text-coral-500" size={38} />
        <h1 className="section-title mt-4 text-3xl">Sign in required</h1>
        <p className="mt-2 text-gray-500">{error}</p>
        <Link href="/signin" className="btn-primary mt-6">
          Go to sign in
        </Link>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#f2efe8] text-[#0f2d35]">
      <div className="bg-[#021d23] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[11px] text-slate-200 sm:px-6">
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-white/90">
              Support
            </Link>
            <Link href="/faq" className="hover:text-white/90">
              FAQ
            </Link>
            <Link href="/delivery-areas" className="hover:text-white/90">
              Delivery Areas
            </Link>
            <Link href="/about" className="hover:text-white/90">
              Submit Your Inquiry
            </Link>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <span>0750519450</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-200">
              Delivery Available
            </span>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-bold text-white shadow-[0_0_18px_rgba(117,213,204,0.25)]">
              R
            </div>
            <div>
              <div className="font-display text-3xl font-bold leading-none">
                RSN Sea Food
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
                KALPITIYA, SRI LANKA
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-100 lg:flex">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/products" className="hover:text-white">
              Products
            </Link>
            <Link href="/delivery-areas" className="hover:text-white">
              Delivery Areas
            </Link>
            <Link href="/about" className="hover:text-white">
              About Us
            </Link>
            <Link href="/faq" className="hover:text-white">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3 text-white">
            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/10"
              aria-label="Toggle theme"
            >
              <UserRound size={18} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <div className="grid overflow-hidden rounded-[1.75rem] border border-[#dfe9e3] bg-[#edf8f7] shadow-[0_16px_40px_rgba(7,39,42,0.08)] lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="bg-[#0a343b] p-6 text-white sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-cyan-200">
              <UserRound size={28} />
            </div>
            <h2 className="mt-6 font-display text-4xl font-bold leading-none">
              Account details
            </h2>
            <p className="mt-4 break-words text-base text-sea-100">{email}</p>

            <div className="mt-8 flex items-start gap-3 text-sm leading-6 text-sea-100">
              <MapPin className="mt-1 shrink-0 text-coral-300" size={17} />
              <span>
                Your saved address helps us prepare delivery details accurately.
              </span>
            </div>
          </aside>

          <div className="bg-[#edf8f7] p-6 sm:p-8">
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">
                  These details are used when we contact you about an order.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-sea-900">
                  Full name
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={updateField}
                    className="mt-1.5 w-full rounded-xl border border-[#cfe5e2] bg-[#f7fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
                  />
                </label>
                <label className="text-sm font-semibold text-sea-900">
                  Phone
                  <input
                    name="phone"
                    required
                    value={form.phone}
                    onChange={updateField}
                    className="mt-1.5 w-full rounded-xl border border-[#cfe5e2] bg-[#f7fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold text-sea-900">
                WhatsApp number{" "}
                <span className="font-normal text-gray-400">(optional)</span>
                <input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={updateField}
                  className="mt-1.5 w-full rounded-xl border border-[#cfe5e2] bg-[#f7fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
                />
              </label>

              <div className="border-t border-[#d5e4e1] pt-6">
                <h2 className="text-2xl font-bold text-sea-900">
                  Delivery address
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Save one primary address for convenient ordering.
                </p>
              </div>

              <label className="block text-sm font-semibold text-sea-900">
                Street / house details
                <input
                  name="street"
                  value={form.street}
                  onChange={updateField}
                  className="mt-1.5 w-full rounded-xl border border-[#cfe5e2] bg-[#f7fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
                  placeholder="House number, street"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-sea-900">
                  City
                  <input
                    name="city"
                    value={form.city}
                    onChange={updateField}
                    className="mt-1.5 w-full rounded-xl border border-[#cfe5e2] bg-[#f7fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
                  />
                </label>
                <label className="text-sm font-semibold text-sea-900">
                  District
                  <select
                    name="district"
                    value={form.district}
                    onChange={updateField}
                    className="mt-1.5 w-full rounded-xl border border-[#cfe5e2] bg-[#f7fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
                  >
                    {SRI_LANKA_DISTRICTS.map((district) => (
                      <option key={district}>{district}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm font-semibold text-sea-900">
                Postal code{" "}
                <span className="font-normal text-gray-400">(optional)</span>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={updateField}
                  className="mt-1.5 w-full rounded-xl border border-[#cfe5e2] bg-[#f7fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
                />
              </label>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}
              {message && (
                <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <Check size={16} />
                  {message}
                </p>
              )}

              <div className="pt-2">
                <button
                  disabled={saving}
                  type="submit"
                  className="btn-primary inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#3fc894] text-white shadow-[0_14px_30px_rgba(63,200,148,0.4)] transition hover:scale-105"
        aria-label="Chat with us"
      >
        <MessageCircle size={28} />
      </button>
    </main>
  );
}
