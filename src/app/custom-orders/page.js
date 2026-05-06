"use client";

import { useState } from "react";
import CustomOrdersCarousel from "../../components/CustomOrdersCarousel";

export default function CustomOrdersPage() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    measurements: "",
    budget: "",
  });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    setError("");
    setLoading(true);
    try {
      const body = new FormData();
      body.append("name", fields.name);
      body.append("email", fields.email);
      body.append("phone", fields.phone);
      body.append("description", fields.description);
      if (fields.measurements) body.append("measurements", fields.measurements);
      if (fields.budget) body.append("budget", fields.budget);
      for (const f of files) body.append("referenceImages", f);

      const res = await fetch("/api-proxy/custom-orders", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Submission failed");

      setStatus("Your custom order request has been received! We'll be in touch soon.");
      setFields({ name: "", email: "", phone: "", description: "", measurements: "", budget: "" });
      setFiles([]);
      e.target.reset();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-narrow">
      <div className="page-kicker text-center">Custom</div>
      <h1 className="mt-2 page-title text-center">Custom Orders</h1>
      <p className="mt-2 text-sm leading-snug text-neutral-700 sm:mt-3 sm:leading-relaxed">
        At ANTI, we infuse every stitch with a touch of magic, tailoring each piece to mirror your essence with
        bespoke artistry.
      </p>

      <CustomOrdersCarousel images={customImages} />

      <div className="mt-6 card-surface sm:mt-8">
        <h2 className="text-center font-semibold tracking-tight">Place Order</h2>

        <form className="mt-4 sm:mt-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Name *</div>
              <input
                required
                className="field-input"
                value={fields.name}
                onChange={(e) => setFields((p) => ({ ...p, name: e.target.value }))}
              />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Email *</div>
              <input
                type="email"
                required
                className="field-input"
                value={fields.email}
                onChange={(e) => setFields((p) => ({ ...p, email: e.target.value }))}
              />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Phone Number</div>
              <input
                className="field-input"
                value={fields.phone}
                onChange={(e) => setFields((p) => ({ ...p, phone: e.target.value }))}
              />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Description *</div>
              <textarea
                required
                className="field-input"
                rows={4}
                placeholder="Describe what you'd like made…"
                value={fields.description}
                onChange={(e) => setFields((p) => ({ ...p, description: e.target.value }))}
              />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Measurements</div>
              <textarea
                className="field-input"
                rows={2}
                placeholder="e.g. Bust 90cm, Waist 72cm, Hips 96cm…"
                value={fields.measurements}
                onChange={(e) => setFields((p) => ({ ...p, measurements: e.target.value }))}
              />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Budget (ZAR)</div>
              <input
                className="field-input"
                placeholder="e.g. R800 – R1200"
                value={fields.budget}
                onChange={(e) => setFields((p) => ({ ...p, budget: e.target.value }))}
              />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Upload Reference Images (up to 5)</div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="w-full text-sm"
                onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))}
              />
            </label>

            <div className="flex justify-center pt-1">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary-solid rounded-full px-10 disabled:opacity-50"
              >
                {loading ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>

          {status && <div className="mt-4 text-center text-sm text-emerald-700">{status}</div>}
          {error && <div className="mt-4 text-center text-sm text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
}
