"use client";

import { useState } from "react";
import CustomOrdersCarousel from "../../components/CustomOrdersCarousel";

export default function CustomOrdersPage() {
  const [status, setStatus] = useState("");

  const customImages = [
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.51.43.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.51.49.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.51.54.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.51.55.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.51.56.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.51.59.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.01.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.03.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.07.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.08 (1).jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.08.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.09.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.10.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.11.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.14.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.17.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.18.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.21.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.22 (1).jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.22.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.23.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.24.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.27.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.28 (1).jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.28.jpeg",
    "/images/Anti_custom/WhatsApp Image 2025-06-11 at 17.52.29.jpeg",
    "/images/Anti_custom/pjs.jpeg",
  ];

  return (
    <div className="page-container max-w-2xl">
      <div className="text-center">
        <div className="page-kicker">Bespoke</div>
        <h1 className="mt-1 page-title">Custom Orders</h1>
      </div>
      <p className="mt-4 text-center text-sm text-neutral-700 leading-relaxed">
        At ANTI, we infuse every stitch with a touch of magic, tailoring each piece to mirror your essence with
        bespoke artistry.
      </p>

      <CustomOrdersCarousel images={customImages} />

      <div className="mt-8 card-surface p-6 sm:p-8">
        <h2 className="text-center font-semibold tracking-tight text-neutral-900">Place Order</h2>

        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            setStatus("Submitted (mock). We’ll get back to you soon.");
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <div className="form-label">Name *</div>
              <input required className="form-input" />
            </label>
            <label className="block">
              <div className="form-label">Email *</div>
              <input type="email" required className="form-input" />
            </label>
            <label className="block">
              <div className="form-label">Phone Number *</div>
              <input required className="form-input" />
            </label>

            <label className="block">
              <div className="form-label">Additional Information</div>
              <textarea className="form-textarea" rows={4} />
            </label>

            <label className="block">
              <div className="form-label">Upload Reference Image</div>
              <input type="file" required className="w-full text-sm" />
            </label>

            <div className="flex justify-center pt-1">
              <button type="submit" className="btn-primary-solid">
                SUBMIT
              </button>
            </div>
          </div>

          {status ? <div className="mt-4 text-center text-sm text-neutral-700">{status}</div> : null}
        </form>
      </div>
    </div>
  );
}

