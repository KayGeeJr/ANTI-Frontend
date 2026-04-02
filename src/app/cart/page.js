"use client";

import Link from "next/link";

export default function CartPage() {
  return (
    <div className="page-shell">
      <div className="page-kicker text-center">Shopping Cart</div>
      <h1 className="mt-2 page-title text-center">Cart</h1>
      <div className="mx-auto mt-6 max-w-xl card-surface text-center sm:mt-8">
        <div className="text-sm text-neutral-700">Your cart is currently empty.</div>
        <div className="mt-6 flex justify-center">
          <Link href="/shop" className="btn-primary-solid">
            RETURN TO SHOP
          </Link>
        </div>
      </div>
    </div>
  );
}

