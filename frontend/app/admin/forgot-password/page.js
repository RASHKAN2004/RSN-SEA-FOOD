"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.forgotPassword({ email });
      setMessage(res.message || "Reset instructions sent.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sea-100 text-sea-700">
        <Mail size={22} />
      </div>

      <h1 className="section-title mt-4">Forgot Password</h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        Enter the email linked to your admin account to receive a password reset
        link.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 w-full space-y-3 rounded-2xl border border-sea-100 bg-white p-6"
      >
        <input
          required
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sea-500 focus:outline-none"
        />

        {error && <p className="text-sm text-coral-600">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <Link
        href="/admin/login"
        className="mt-4 inline-flex items-center gap-2 text-sm text-sea-700 hover:text-sea-900"
      >
        <ArrowLeft size={14} /> Back to Login
      </Link>
    </div>
  );
}
