"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api";

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }
    api
      .verifyEmail(token)
      .then(() => {
        setStatus("success");
        setMessage("Your email has been verified. You can now log in.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed. The link may have expired.");
      });
  }, [token]);

  return (
    <div className="page-narrow">
      <h1 className="mt-6 page-title text-center">Email Verification</h1>
      <div className="mt-6 card-surface sm:mt-8 text-center space-y-4">
        {status === "verifying" && <p className="text-sm text-neutral-500">Verifying…</p>}
        {status === "success" && (
          <>
            <p className="text-sm text-emerald-700">{message}</p>
            <Link href="/account" className="btn-primary-solid rounded-full px-10 inline-block">
              Go to Account
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-sm text-red-600">{message}</p>
            <Link href="/account" className="text-sm underline text-neutral-600">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
