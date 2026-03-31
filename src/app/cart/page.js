"use client";

import Link from "next/link";

export default function CartPage() {
  return (
    <div className="page-container">
      <div className="text-center">
        <div className="page-kicker">Shopping Cart</div>
        <h1 className="mt-1 page-title">Cart</h1>
      </div>

      <div className="mx-auto mt-8 max-w-2xl card-surface p-8 text-center">
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

