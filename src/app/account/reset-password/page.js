"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, setToken } from "../../../lib/api";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token. Please request a new reset link.");
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.resetPassword({ token, password });
      if (res.token) setToken(res.token);
      setStatus("Password reset successfully. Redirecting…");
      setTimeout(() => router.push("/account"), 2000);
    } catch (err) {
      setError(err.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-narrow">
      <h1 className="mt-6 page-title text-center">Reset Password</h1>
      <div className="mt-6 card-surface sm:mt-8">
        {!token ? (
          <p className="text-center text-sm text-red-600">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">New Password *</div>
              <input
                type="password"
                required
                minLength={8}
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 chars, upper, lower, number"
              />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Confirm Password *</div>
              <input
                type="password"
                required
                className="field-input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {status && <p className="text-sm text-emerald-700">{status}</p>}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading || !token}
                className="btn-primary-solid rounded-full px-10 disabled:opacity-50"
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
