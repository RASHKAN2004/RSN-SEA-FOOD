"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { api } from "@/lib/api";

const initialForm = { name: "", email: "", password: "", phone: "" };

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload =
        mode === "signin"
          ? { email: form.email, password: form.password }
          : form;
      const result =
        mode === "signin"
          ? await api.login(payload)
          : await api.register(payload);
      if (result.user?.role === "admin") {
        await api.logout().catch(() => {});
        throw new Error("Please use the admin sign-in page for this account.");
      }
      router.push("/profile");
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to continue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative overflow-hidden px-4 py-12 sm:py-20">
      <div className="pointer-events-none absolute -left-28 top-8 h-64 w-64 rounded-full bg-tide/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-coral-200/30 blur-3xl" />
      <div className="relative mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-sea-100 bg-white/80 shadow-[0_28px_80px_rgba(8,49,58,0.15)] backdrop-blur sm:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-between bg-[#0b343b] p-8 text-white sm:p-10">
          <div>
            <p className="section-kicker text-tide">RSN Sea Food</p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Your catch, saved for next time.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-sea-100">
              Sign in to keep your delivery details ready, review your account,
              and make every seafood order quicker.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 text-xs text-sea-100">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Fast checkout
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Islandwide delivery
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="flex items-center gap-2 rounded-full bg-sea-50 p-1 text-sm font-semibold text-sea-700">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              className={`flex-1 rounded-full px-4 py-2 transition ${mode === "signin" ? "bg-white text-sea-900 shadow-sm" : ""}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 rounded-full px-4 py-2 transition ${mode === "register" ? "bg-white text-sea-900 shadow-sm" : ""}`}
            >
              Create account
            </button>
          </div>

          <div className="mt-8">
            <p className="section-kicker">Customer account</p>
            <h2 className="section-title mt-2 text-3xl">
              {mode === "signin" ? "Welcome back" : "Make ordering effortless"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {mode === "signin"
                ? "Use your email and password to continue."
                : "Create your account with the details we need for delivery."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {mode === "register" && (
              <label className="block text-sm font-semibold text-sea-900">
                Full name
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={updateField}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-coral-400 focus:ring-4 focus:ring-coral-100"
                  placeholder="Your name"
                />
              </label>
            )}
            <label className="block text-sm font-semibold text-sea-900">
              Email address
              <input
                name="email"
                required
                type="email"
                value={form.email}
                onChange={updateField}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-coral-400 focus:ring-4 focus:ring-coral-100"
                placeholder="you@example.com"
              />
            </label>
            {mode === "register" && (
              <label className="block text-sm font-semibold text-sea-900">
                Phone number
                <input
                  name="phone"
                  required
                  value={form.phone}
                  onChange={updateField}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-coral-400 focus:ring-4 focus:ring-coral-100"
                  placeholder="07X XXX XXXX"
                />
              </label>
            )}
            <label className="block text-sm font-semibold text-sea-900">
              Password
              <div className="relative mt-1.5">
                <LockKeyhole
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={17}
                />
                <input
                  name="password"
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={updateField}
                  className="w-full rounded-xl border border-gray-200 bg-white px-11 py-3 pr-12 font-normal outline-none transition focus:border-coral-400 focus:ring-4 focus:ring-coral-100"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-3 text-gray-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              disabled={submitting}
              className="btn-primary w-full py-3.5"
              type="submit"
            >
              {submitting
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in to account"
                  : "Create customer account"}
              <ArrowRight size={17} />
            </button>
          </form>

          {mode === "signin" && (
            <Link
              href="/admin/forgot-password"
              className="mt-4 block text-center text-sm font-semibold text-sea-700 hover:text-coral-600"
            >
              Forgot your password?
            </Link>
          )}
          <p className="mt-7 text-center text-sm text-gray-500">
            {mode === "signin"
              ? "New to RSN Sea Food? "
              : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "register" : "signin");
                setError("");
              }}
              className="font-bold text-coral-600"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}
