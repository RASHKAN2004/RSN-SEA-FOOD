"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  LogOut,
  MapPin,
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
    <main className="relative overflow-hidden px-4 py-12 sm:py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-tide/20 blur-3xl" />
      <div className="relative mx-auto max-w-4xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sea-700 hover:text-coral-600"
            >
              <ArrowLeft size={16} /> Back to storefront
            </Link>
            <p className="section-kicker mt-7">Customer account</p>
            <h1 className="section-title mt-2">Your profile</h1>
            <p className="mt-2 text-gray-500">
              Keep your contact and delivery details ready for a faster
              checkout.
            </p>
          </div>
          <button type="button" onClick={handleLogout} className="btn-outline">
            <LogOut size={16} /> Sign out
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 grid overflow-hidden rounded-[2rem] border border-sea-200 bg-[#edf8f7] p-6 shadow-[0_20px_50px_rgba(8,41,47,0.09)] sm:p-8 lg:grid-cols-[0.75fr_1.25fr]"
        >
          <aside className="rounded-[1.5rem] bg-[#0b343b] p-6 text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-tide">
              <UserRound size={24} />
            </span>
            <h2 className="mt-6 font-display text-2xl font-bold">
              Account details
            </h2>
            <p className="mt-2 break-words text-sm leading-6 text-sea-100">
              {email}
            </p>
            <div className="mt-8 flex items-start gap-3 text-sm text-sea-100">
              <MapPin className="mt-0.5 shrink-0 text-coral-300" size={17} />
              Your saved address helps us prepare delivery details accurately.
            </div>
          </aside>
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-sea-900">
                Personal information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
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
                  className="mt-1.5 w-full rounded-xl border border-sea-200 bg-[#f6fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
                />
              </label>
              <label className="text-sm font-semibold text-sea-900">
                Phone
                <input
                  name="phone"
                  required
                  value={form.phone}
                  onChange={updateField}
                  className="mt-1.5 w-full rounded-xl border border-sea-200 bg-[#f6fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
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
                className="mt-1.5 w-full rounded-xl border border-sea-200 bg-[#f6fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
              />
            </label>
            <div className="border-t border-gray-100 pt-5">
              <h2 className="text-xl font-bold text-sea-900">
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
                className="mt-1.5 w-full rounded-xl border border-sea-200 bg-[#f6fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
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
                  className="mt-1.5 w-full rounded-xl border border-sea-200 bg-[#f6fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
                />
              </label>
              <label className="text-sm font-semibold text-sea-900">
                District
                <select
                  name="district"
                  value={form.district}
                  onChange={updateField}
                  className="mt-1.5 w-full rounded-xl border border-sea-200 bg-[#f6fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
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
                className="mt-1.5 w-full rounded-xl border border-sea-200 bg-[#f6fbfb] px-4 py-3 font-normal text-sea-900 outline-none transition focus:border-coral-400 focus:bg-white focus:ring-4 focus:ring-coral-100"
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
            <button
              disabled={saving}
              type="submit"
              className="btn-primary w-full sm:w-auto"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
