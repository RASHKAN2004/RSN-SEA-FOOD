"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!token) {
      setError("This reset link is missing its token. Request a new link.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.resetPassword({ token, password });
      setSuccess(response.message || "Password reset successful.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => router.push("/signin"), 1500);
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[65vh] max-w-md flex-col items-center justify-center px-4 py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sea-100 text-sea-700">
        {success ? <CheckCircle2 size={22} /> : <LockKeyhole size={22} />}
      </div>
      <h1 className="section-title mt-4 text-center">Reset your password</h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        Choose a new password for your RSN Sea Food account.
      </p>
      {token ? (
        <form onSubmit={handleSubmit} className="mt-6 w-full space-y-3 rounded-2xl border border-sea-100 bg-white p-6">
          <label className="block text-xs font-semibold text-sea-900" htmlFor="new-password">New password</label>
          <input
            id="new-password"
            required
            minLength={6}
            maxLength={128}
            autoComplete="new-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sea-500 focus:outline-none"
          />
          <label className="block text-xs font-semibold text-sea-900" htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            required
            minLength={6}
            maxLength={128}
            autoComplete="new-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sea-500 focus:outline-none"
          />
          {error && <p role="alert" className="text-sm text-coral-600">{error}</p>}
          {success && <p role="status" className="text-sm text-emerald-700">{success}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      ) : (
        <p role="alert" className="mt-5 rounded-xl bg-amber-50 p-4 text-center text-sm text-amber-900">
          This reset link is missing its token. Request a new link from sign in.
        </p>
      )}
      <Link href="/signin" className="mt-5 text-sm font-semibold text-sea-700 hover:text-sea-900">
        Back to sign in
      </Link>
    </section>
  );
}

export default function CustomerResetPasswordPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-gray-500">Loading reset form...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
