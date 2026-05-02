"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, getToken } from "../../lib/api";

export default function CheckoutPage() {
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("eft_manual");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  function submitPayfastForm(payfastUrl, paymentData) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = payfastUrl;
    form.style.display = "none";
    Object.entries(paymentData || {}).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value ?? "");
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div className="page-narrow">
      <div className="page-kicker text-center">Checkout</div>
      <h1 className="mt-2 page-title text-center">Checkout</h1>

      {!placed ? (
        <div className="mt-6 card-surface sm:mt-8">
          <div className="text-sm leading-snug text-neutral-700 sm:leading-normal">
            Enter your details to place your order.
          </div>

          <form
            className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setError("");
                setSubmitting(true);
                const form = new FormData(e.currentTarget);
                const shippingAddress = {
                  name: String(form.get("name") || ""),
                  street: String(form.get("street") || ""),
                  city: String(form.get("city") || ""),
                  province: String(form.get("province") || ""),
                  postalCode: String(form.get("postalCode") || ""),
                  country: "South Africa",
                  phone: String(form.get("phone") || ""),
                };
                const payload = {
                  shippingAddress,
                  paymentMethod,
                  guestEmail: String(form.get("email") || ""),
                };
                const data = await api.createOrder(payload);
                setOrderNumber(data.order?.orderNumber || "");
                if (paymentMethod === "payfast") {
                  const payfast = await api.initiatePayment({
                    orderId: data.order?._id,
                    guestEmail: payload.guestEmail,
                  });
                  submitPayfastForm(payfast.payfastUrl, payfast.paymentData);
                  return;
                }
                setPlaced(true);
              } catch (err) {
                setError(err.message || "Checkout failed");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Full Name</div>
              <input name="name" className="field-input" required />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Email</div>
              <input name="email" type="email" className="field-input" required />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Phone</div>
              <input name="phone" className="field-input" required />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Street Address</div>
              <input name="street" className="field-input" required />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="block">
                <div className="text-sm text-neutral-700 mb-1">City</div>
                <input name="city" className="field-input" required />
              </label>
              <label className="block">
                <div className="text-sm text-neutral-700 mb-1">Province</div>
                <input name="province" className="field-input" required />
              </label>
              <label className="block">
                <div className="text-sm text-neutral-700 mb-1">Postal Code</div>
                <input name="postalCode" className="field-input" required />
              </label>
            </div>
            <label className="block">
              <div className="mb-1 text-sm text-neutral-700">Payment Method</div>
              <select
                className="field-input"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="eft_manual">Manual EFT</option>
                <option value="payfast">PayFast (card / EFT)</option>
              </select>
            </label>
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
            {!isLoggedIn ? (
              <div className="text-xs text-neutral-500">
                Proceeding as guest checkout. You can still place an order.
              </div>
            ) : null}
            <div className="text-xs text-neutral-500">Choose EFT or PayFast above.</div>

            <div className="flex justify-center pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary-solid rounded-full px-10"
              >
                {submitting ? "Placing..." : paymentMethod === "payfast" ? "Continue to PayFast" : "Place Order"}
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
        <div className="mt-6 card-surface text-center sm:mt-8">
          <h2 className="text-lg font-semibold">Order placed</h2>
          <p className="mt-1.5 text-sm leading-snug text-neutral-700 sm:mt-2 sm:leading-normal">
            Thanks! Your order has been created successfully.
          </p>
          {orderNumber ? <p className="mt-1 text-sm font-medium text-neutral-900">{orderNumber}</p> : null}
        </div>
      )}
    </div>
  );
}

