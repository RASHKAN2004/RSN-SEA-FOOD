"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [nextPath, setNextPath] = useState("");

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
        throw new Error("Please use the admin sign-in page for this account.");
      }
      router.push(nextPath || "/profile");
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to continue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-shell min-h-screen px-3 py-4 sm:px-5 sm:py-8 lg:px-8 lg:py-12">
      <div className="auth-card mx-auto grid max-w-[1460px] overflow-hidden rounded-[38px] border border-[#dfe7ea] bg-[#f3f3f0] shadow-[0_35px_90px_rgba(6,39,43,0.16)] lg:grid-cols-[1.04fr_1.12fr]">
        <section className="auth-hero flex min-h-[560px] flex-col justify-between bg-[#052f35] p-6 sm:p-8 lg:p-10">
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[#b7d8d4]">
              RSN SEA FOOD
            </p>
            <h1 className="mt-6 max-w-[420px] font-display text-[3.1rem] font-bold leading-[0.88] tracking-[-0.05em] text-[#f3f2ee] sm:text-[4.2rem] lg:text-[5.2rem]">
              Your catch, saved for next time.
            </h1>
            <p className="mt-6 max-w-[460px] text-[1.06rem] leading-8 text-[#dfe8e8]">
              Sign in to keep your delivery details ready, review your account,
              and make every seafood order quicker.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-5 py-4 text-center text-[1.05rem] font-medium text-[#f4f7f7] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/8">
              Fast checkout
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-5 py-4 text-center text-[1.05rem] font-medium text-[#f4f7f7] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/8">
              Islandwide delivery
            </div>
          </div>
        </section>

        <section className="auth-form-panel relative bg-[#eef2f3] p-5 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-[560px] pt-2">
            <div className="auth-toggle flex items-center gap-2 rounded-full bg-[#dfe9ee] p-1.5 text-[1.05rem] font-semibold text-[#245d68] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_20px_rgba(27,88,100,0.08)]">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError("");
                }}
                className={`auth-toggle-btn flex-1 rounded-full px-5 py-3.5 transition ${mode === "signin" ? "bg-[#f5f7f9] text-[#0c3037] shadow-[0_6px_18px_rgba(11,52,59,0.08)]" : "text-[#1b5f6b]"}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={`auth-toggle-btn flex-1 rounded-full px-5 py-3.5 transition ${mode === "register" ? "bg-[#f5f7f9] text-[#0c3037] shadow-[0_6px_18px_rgba(11,52,59,0.08)]" : "text-[#1b5f6b]"}`}
              >
                Create account
              </button>
            </div>

            <div className="mt-9">
              <p className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-[#f26d39]">
                Customer account
              </p>
              <h2 className="mt-3 font-display text-[3.1rem] font-bold leading-[0.96] tracking-[-0.06em] text-[#123b45] sm:text-[3.6rem]">
                {mode === "signin"
                  ? "Welcome back"
                  : "Make ordering effortless"}
              </h2>
              <p className="mt-4 text-[1.05rem] text-[#627b82]">
                {mode === "signin"
                  ? "Use your email and password to continue."
                  : "Create your account with the details we need for delivery."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {mode === "register" && (
                <label className="auth-field-label block text-[1.02rem] font-medium text-[#173e47]">
                  Full name
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={updateField}
                    className="auth-input mt-2 w-full rounded-[1.2rem] border border-[#dfeaf0] bg-[#eaf1f4] px-4 py-3.5 text-base text-[#112f36] outline-none transition placeholder:text-[#7b8e95] focus:border-[#a7dfe3] focus:bg-[#edf7f9]"
                    placeholder="Your name"
                  />
                </label>
              )}

              <label className="auth-field-label block text-[1.02rem] font-medium text-[#173e47]">
                Email address
                <input
                  name="email"
                  required
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  className="auth-input mt-2 w-full rounded-[1.2rem] border border-[#dfeaf0] bg-[#eaf1f4] px-4 py-3.5 text-base text-[#112f36] outline-none transition placeholder:text-[#7b8e95] focus:border-[#a7dfe3] focus:bg-[#edf7f9]"
                  placeholder="mmohamedraskhan@gmail.com"
                />
              </label>

              {mode === "register" && (
                <label className="auth-field-label block text-[1.02rem] font-medium text-[#173e47]">
                  Phone number
                  <input
                    name="phone"
                    required
                    value={form.phone}
                    onChange={updateField}
                    className="auth-input mt-2 w-full rounded-[1.2rem] border border-[#dfeaf0] bg-[#eaf1f4] px-4 py-3.5 text-base text-[#112f36] outline-none transition placeholder:text-[#7b8e95] focus:border-[#a7dfe3] focus:bg-[#edf7f9]"
                    placeholder="07X XXX XXXX"
                  />
                </label>
              )}

              <label className="auth-field-label block text-[1.02rem] font-medium text-[#173e47]">
                Password
                <div className="relative mt-2">
                  <input
                    name="password"
                    required
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={updateField}
                    className="auth-input w-full rounded-[1.2rem] border border-[#dfeaf0] bg-[#eaf1f4] px-4 py-3.5 pr-12 text-base text-[#112f36] outline-none transition placeholder:text-[#7b8e95] focus:border-[#a7dfe3] focus:bg-[#edf7f9]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6a8188] transition hover:text-[#1b5f6b]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {error && (
                <p className="rounded-[1rem] bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                disabled={submitting}
                type="submit"
                className="auth-submit mt-2 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#f76a2d] to-[#f15b22] px-6 py-4 text-[1.05rem] font-semibold text-white shadow-[0_20px_38px_rgba(241,91,34,0.32)] transition hover:brightness-110 hover:shadow-[0_24px_40px_rgba(241,91,34,0.38)] disabled:cursor-not-allowed disabled:opacity-80"
              >
                {submitting
                  ? "Please wait..."
                  : mode === "signin"
                    ? "Sign in to account"
                    : "Create customer account"}
                <ArrowRight size={19} />
              </button>
            </form>

            {mode === "signin" && (
              <Link
                href="/admin/forgot-password"
                className="auth-link mt-5 block text-center text-[1.02rem] font-semibold text-[#1d6977] hover:text-[#f26d39]"
              >
                Forgot your password?
              </Link>
            )}

            <p className="mt-8 text-center text-[1.02rem] text-[#4d6770]">
              {mode === "signin"
                ? "New to RSN Sea Food? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "register" : "signin");
                  setError("");
                }}
                className="auth-link font-semibold text-[#1d6977] hover:text-[#f26d39]"
              >
                {mode === "signin" ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
