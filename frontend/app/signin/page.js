"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Truck,
  Fish,
  Sparkles,
  MessageCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";
import { WHATSAPP_DISPLAY, generalOrderLink } from "@/lib/whatsapp";

const initialForm = { name: "", email: "", password: "", phone: "" };

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [nextPath, setNextPath] = useState("");

  // Forgot password modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");

  useEffect(() => {
    setNextPath(new URLSearchParams(window.location.search).get("next") || "");
  }, []);

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
        throw new Error("Admin accounts must sign in via the admin login portal.");
      }
      router.push(nextPath || "/profile");
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to proceed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccess("");
    try {
      const res = await api.forgotPassword({ email: forgotEmail });
      setForgotSuccess(res.message || "Password reset instructions sent to your email.");
      setForgotEmail("");
    } catch (err) {
      setForgotError(err.message || "Could not find an account with that email.");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:py-14 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(6,39,43,0.08)] grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Editorial Ocean & Value Proposition Banner (5 cols) */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#04191d] via-[#06292f] to-[#04191d] p-8 sm:p-10 text-white lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(117,213,204,0.18),transparent_45%)]" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-coral-300 border border-coral-500/30">
              <Fish size={14} /> RSN Sea Food Member
            </span>

            <h1 className="mt-5 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {mode === "signin"
                ? "Welcome Back to Fresh Seafood Delivery."
                : "Join Kalpitiya's Ocean-To-Door Club."}
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sign in to track orders, save delivery locations, and receive morning harvest alerts for seasonal catches.
            </p>

            {/* Benefit Highlights */}
            <div className="mt-8 space-y-3.5 text-xs text-slate-200">
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
                  <Truck size={16} />
                </span>
                <div>
                  <p className="font-semibold text-white">Saved Delivery Addresses</p>
                  <p className="text-[11px] text-slate-400">1-click ordering across all 25 districts</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-coral-500/20 text-coral-300">
                  <Sparkles size={16} />
                </span>
                <div>
                  <p className="font-semibold text-white">Daily Catch Notifications</p>
                  <p className="text-[11px] text-slate-400">First pick of wild mud crabs & jumbo prawns</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <p className="font-semibold text-white">Cold-Chain Guarantee</p>
                  <p className="text-[11px] text-slate-400">Sub-zero thermal packaging to your kitchen</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Kalpitiya, Sri Lanka</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Direct Harbor Support
            </span>
          </div>
        </section>

        {/* Right Side: Clean Form Container (7 cols) */}
        <section className="p-8 sm:p-12 lg:col-span-7 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            {/* Mode Switcher Buttons */}
            <div className="flex items-center rounded-full bg-slate-100 p-1.5 text-xs font-semibold text-slate-600 mb-8 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError("");
                }}
                className={`flex-1 rounded-full py-2.5 transition-all duration-200 ${
                  mode === "signin"
                    ? "bg-sea-900 text-white shadow-md font-bold"
                    : "hover:text-sea-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={`flex-1 rounded-full py-2.5 transition-all duration-200 ${
                  mode === "register"
                    ? "bg-sea-900 text-white shadow-md font-bold"
                    : "hover:text-sea-900"
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-sea-950">
                {mode === "signin" ? "Sign In to Your Account" : "Create Customer Account"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {mode === "signin"
                  ? "Enter your email and password to access your cart and account."
                  : "Fill in your contact details for smooth seafood deliveries."}
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 rounded-2xl bg-red-50 p-4 border border-red-200 text-xs sm:text-sm text-red-700 animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sea-900">
                    Full Name <span className="text-coral-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="name"
                      required
                      value={form.name}
                      onChange={updateField}
                      placeholder="e.g. Mohamed Raskhan"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-xs sm:text-sm text-sea-950 outline-none transition focus:border-sea-500 focus:bg-white focus:ring-2 focus:ring-sea-100"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-sea-900">
                  Email Address <span className="text-coral-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="email"
                    required
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-xs sm:text-sm text-sea-950 outline-none transition focus:border-sea-500 focus:bg-white focus:ring-2 focus:ring-sea-100"
                  />
                </div>
              </div>

              {mode === "register" && (
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-sea-900">
                    Mobile Phone <span className="text-coral-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="phone"
                      required
                      value={form.phone}
                      onChange={updateField}
                      placeholder="07X XXX XXXX"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-xs sm:text-sm text-sea-950 outline-none transition focus:border-sea-500 focus:bg-white focus:ring-2 focus:ring-sea-100"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-sea-900">
                    Password <span className="text-coral-500">*</span>
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setForgotOpen(true)}
                      className="text-xs font-semibold text-sea-700 hover:text-coral-600 transition"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="password"
                    required
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={updateField}
                    placeholder="At least 6 characters"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-11 text-xs sm:text-sm text-sea-950 outline-none transition focus:border-sea-500 focus:bg-white focus:ring-2 focus:ring-sea-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sea-800"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                disabled={submitting}
                type="submit"
                className="btn-primary w-full !rounded-full !py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-coral-500/25 mt-2 flex items-center justify-center gap-2"
              >
                <span>{submitting ? "Processing..." : mode === "signin" ? "Sign In to Account" : "Create Customer Account"}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-gray-500">
              <span>Need instant help with an order? </span>
              <a
                href={generalOrderLink()}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                <MessageCircle size={13} />
                <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => {
                setForgotOpen(false);
                setForgotSuccess("");
                setForgotError("");
              }}
              className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 p-1"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-50 text-coral-600 mb-4">
              <Lock size={22} />
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-sea-950">
              Reset Your Password
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-relaxed">
              Enter your account email to receive a password reset link, or contact our customer concierge on WhatsApp.
            </p>

            {forgotSuccess ? (
              <div className="mt-6 rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-5 space-y-3">
                {forgotError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    {forgotError}
                  </p>
                )}
                <div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter registered email"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs sm:text-sm text-sea-950 outline-none focus:border-sea-500 focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="btn-primary w-full !rounded-full !py-3 text-xs font-bold"
                >
                  {forgotLoading ? "Sending Instructions..." : "Send Reset Email"}
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Need immediate help?</span>
              <a
                href={generalOrderLink()}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <MessageCircle size={13} />
                <span>Chat with Support</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
