"use client";

import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [placed, setPlaced] = useState(false);

  return (
    <div className="page-narrow">
      <div className="page-kicker text-center">Checkout</div>
      <h1 className="mt-2 page-title text-center">Checkout</h1>

      {!placed ? (
        <div className="mt-8 card-surface">
          <div className="text-sm text-neutral-700">
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
              <div className="text-sm text-neutral-700 mb-1">Full Name</div>
              <input className="field-input" required />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Email</div>
              <input type="email" className="field-input" required />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Phone</div>
              <input className="field-input" required />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Address</div>
              <textarea className="field-input" rows={4} required />
            </label>

            <div className="flex justify-center pt-1">
              <button
                type="submit"
                className="btn-primary-solid rounded-full px-10"
              >
                Place Order
              </button>
            </div>
          </form>
          <div className="mt-4 text-center text-xs text-neutral-500">
            <Link href="/cart" className="hover:underline">
              Back to cart
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 card-surface text-center">
          <h2 className="text-lg font-semibold">Order placed (mock)</h2>
          <p className="mt-2 text-sm text-neutral-700">
            Thanks! In the next phase, we&apos;ll connect checkout to your backend and database.
          </p>
        </div>
      )}
    </div>
  );
}

