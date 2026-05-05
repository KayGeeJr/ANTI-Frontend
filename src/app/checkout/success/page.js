"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderNumber = searchParams.get("custom_str1") || searchParams.get("order_number") || "";
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!orderNumber) { setLoading(false); return; }
    let alive = true;
    api.getOrder(orderNumber, email)
      .then(data => { if (alive) setOrder(data.order || null); })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [orderNumber, email]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/anti_images/logo1.jpeg" alt="ANTI" className="h-36 w-28 animate-pulse object-contain opacity-90" />
      </div>
    );
  }

  return (
    <div className="page-narrow py-16 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900">
        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
        Order confirmed!
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
        Thank you for your purchase. We&apos;ll email you when your order is on its way.
      </p>

      {(order?.orderNumber || orderNumber) && (
        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-neutral-100 bg-neutral-50 px-6 py-5 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Order number</span>
            <span className="font-mono font-semibold text-neutral-900">{order?.orderNumber || orderNumber}</span>
          </div>
          {order?.total && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Total</span>
              <span className="font-semibold text-neutral-900">
                R{(order.total / 100).toFixed(2)}
              </span>
            </div>
          )}
          {order?.orderStatus && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Status</span>
              <span className="capitalize font-medium text-neutral-900">{order.orderStatus}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/shop" className="btn-primary-solid rounded-full px-8">
          Continue shopping
        </Link>
        <Link href="/account" className="rounded-full border border-neutral-200 px-8 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
          View my orders
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/anti_images/logo1.jpeg" alt="ANTI" className="h-36 w-28 animate-pulse object-contain opacity-90" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
