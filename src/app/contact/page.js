"use client";

import { useState } from "react";

export default function ContactPage() {
  const [fields, setFields] = useState({ name: "", email: "", phone: "", message: "" });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      body.append("message", fields.message);
      if (file) body.append("referenceImage", file);

      const res = await fetch("/api-proxy/contact", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Submission failed");
      setStatus("Message sent! We'll get back to you within 1–2 business days.");
      setFields({ name: "", email: "", phone: "", message: "" });
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-narrow">
      <div className="page-kicker text-center">Contact</div>
      <h1 className="mt-2 page-title text-center">Contact Us</h1>

      <div className="mt-6 card-surface sm:mt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:gap-4">
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
            <div className="text-sm text-neutral-700 mb-1">Message</div>
            <textarea
              className="field-input"
              rows={4}
              value={fields.message}
              onChange={(e) => setFields((p) => ({ ...p, message: e.target.value }))}
            />
          </label>
          <label className="block">
            <div className="text-sm text-neutral-700 mb-1">Upload Reference Image</div>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <div className="flex justify-center pt-1">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary-solid rounded-full px-10 disabled:opacity-50"
            >
              {loading ? "Sending…" : "Submit"}
            </button>
          </div>

          {status && <div className="text-center text-sm text-emerald-700">{status}</div>}
          {error && <div className="text-center text-sm text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
}
