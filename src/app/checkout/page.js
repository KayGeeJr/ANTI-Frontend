"use client";

import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [placed, setPlaced] = useState(false);

  return (
    <div className="page-container max-w-2xl">
      <div className="text-center">
        <div className="page-kicker">Checkout</div>
        <h1 className="mt-1 page-title">Checkout</h1>
      </div>

      {!placed ? (
        <div className="mx-auto mt-8 card-surface p-6 sm:p-8">
          <div className="text-sm text-neutral-700 text-center">
            This is a frontend-only checkout mock. No payment will be processed.
          </div>

          <form
            className="mt-5 grid grid-cols-1 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setPlaced(true);
            }}
          >
            <label className="block">
              <div className="form-label">Full Name</div>
              <input className="form-input" required />
            </label>
            <label className="block">
              <div className="form-label">Email</div>
              <input type="email" className="form-input" required />
            </label>
            <label className="block">
              <div className="form-label">Phone</div>
              <input className="form-input" required />
            </label>
            <label className="block">
              <div className="form-label">Address</div>
              <textarea className="form-textarea" rows={4} required />
            </label>

            <div className="flex justify-center pt-1">
              <button type="submit" className="btn-primary-solid">
                PLACE ORDER
              </button>
            </div>
          </form>
          <div className="mt-4 text-xs text-neutral-500">
            <Link href="/cart" className="hover:underline">
              Back to cart
            </Link>
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-8 card-surface p-6 sm:p-8 text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Order placed (mock)</h2>
          <p className="mt-2 text-sm text-neutral-700">
            Thanks! In the next phase, we&apos;ll connect checkout to your backend and database.
          </p>
        </div>
      )}
    </div>
  );
}

