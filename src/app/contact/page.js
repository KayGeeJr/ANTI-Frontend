"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  return (
    <div className="page-container max-w-2xl">
      <div className="text-center">
        <div className="page-kicker">Contact</div>
        <h1 className="mt-1 page-title">Contact Us</h1>
      </div>

      <div className="mx-auto mt-8 card-surface p-6 sm:p-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStatus("Submitted (mock). We’ll get back to you soon.");
          }}
          className="grid grid-cols-1 gap-4"
        >
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
            <input type="file" className="w-full text-sm" />
          </label>

          <div className="flex justify-center pt-1">
            <button type="submit" className="btn-primary-solid">
              SUBMIT
            </button>
          </div>

          {status ? <div className="text-center text-sm text-neutral-700">{status}</div> : null}
        </form>
      </div>
    </div>
  );
}

