"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, CheckCircle2 } from "lucide-react";
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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(Boolean(token));
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Missing reset token. Please request a new reset link.");
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
      const res = await api.resetPassword({ token, password });
      setSuccess(res.message || "Password reset successful.");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/admin/login");
      }, 1600);
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  if (!isReady) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sea-100 text-sea-700">
          <LockKeyhole size={22} />
        </div>
        <h1 className="section-title mt-4">Reset Password</h1>
        <p className="mt-2 text-sm text-gray-500">
          Missing reset token. Please request a new password reset link.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sea-100 text-sea-700">
        {success ? <CheckCircle2 size={22} /> : <LockKeyhole size={22} />}
      </div>

      <h1 className="section-title mt-4">Set New Password</h1>
      <p className="mt-2 text-sm text-gray-500">
        Create a strong password for your admin account.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 w-full space-y-3 rounded-2xl border border-sea-100 bg-white p-6"
      >
        <input
          required
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sea-500 focus:outline-none"
        />

        <input
          required
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sea-500 focus:outline-none"
        />

        {error && <p className="text-sm text-coral-600">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-gray-500">
          Loading reset form...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
