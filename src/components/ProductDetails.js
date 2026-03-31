"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import VariantSelector from "./VariantSelector";

function formatPrice(price) {
  return `R${price}.00`;
}

export default function ProductDetails({ product }) {
  const router = useRouter();
  const options = product?.options || [];
  const images = product?.images?.length ? product.images : ["/images/placeholder.svg"];
  const optionSignature = useMemo(() => options.map((o) => `${o.name}:${o.values.join(",")}`).join("|"), [options]);

  const [selected, setSelected] = useState(() => {
    const initial = {};
    for (const opt of options) initial[opt.name] = "";
    return initial;
  });

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // If the user navigates to a different product, reset selections for that product.
  useEffect(() => {
    const initial = {};
    for (const opt of options) initial[opt.name] = "";
    setSelected(initial);
  }, [optionSignature]);

  // Reset image when switching products.
  useEffect(() => {
    setActiveImageIdx(0);
  }, [product?.slug]);

  const optionNames = useMemo(() => options.map((o) => o.name), [options]);
  const hasAllSelections = optionNames.every((name) => selected[name]);

  const activeSrc = images[Math.min(activeImageIdx, images.length - 1)] || images[0];

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
      <div>
        <div className="relative aspect-square rounded-2xl border border-neutral-200 bg-neutral-50 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeSrc}
            alt={`${product.title} image ${activeImageIdx + 1}`}
            className="h-full w-full object-cover"
          />

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => setActiveImageIdx((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-neutral-200 bg-white/70 backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                aria-label="Previous image"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIdx((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-neutral-200 bg-white/70 backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                aria-label="Next image"
              >
                <span aria-hidden="true">→</span>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-neutral-200 bg-white/75 px-3 py-1 text-[11px] text-neutral-700 backdrop-blur">
                {activeImageIdx + 1}/{images.length}
              </div>
            </>
          ) : null}
        </div>

        {images.length > 1 ? (
          <div
            className="mt-4 flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1"
            aria-label="Product images"
          >
            {images.map((src, idx) => {
              const active = idx === activeImageIdx;
              return (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={[
                    "flex-none snap-start h-16 w-16 rounded-xl overflow-hidden border bg-white transition",
                    active ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-2" : "border-neutral-200 hover:border-neutral-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                  ].join(" ")}
                  aria-label={`View image ${idx + 1}`}
                  aria-current={active ? "true" : "false"}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${product.title} thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div>
        <div className="page-kicker text-center md:text-left">Product</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl md:text-left text-center">
          {product.title}
        </h1>
        <div className="mt-2 text-center text-xl font-medium text-neutral-900 md:text-left">
          {formatPrice(product.price)}
        </div>

        <p className="mt-4 text-sm text-neutral-700 leading-relaxed md:text-left text-center">
          {product.description}
        </p>
        <div className="mt-4 flex justify-center md:justify-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-700">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-neutral-900" aria-hidden="true" />
            Secure checkout (mock) • Fast support
          </div>
        </div>

        <div className="mt-6">
          {options.map((opt) => (
            <VariantSelector
              key={opt.name}
              option={opt}
              value={selected[opt.name]}
              onChange={(v) => setSelected((prev) => ({ ...prev, [opt.name]: v }))}
            />
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="mt-6 hidden md:block">
          <button
            type="button"
            disabled={!hasAllSelections}
            onClick={() => router.push("/cart")}
            className={[
              "inline-flex w-full items-center justify-center rounded-full border px-6 py-3 text-center text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
              hasAllSelections
                ? "bg-neutral-900 text-white border-neutral-900 hover:opacity-90"
                : "bg-neutral-200 text-neutral-500 border-neutral-200 cursor-not-allowed",
            ].join(" ")}
          >
            Add to cart
          </button>
          <div className="mt-3 text-center text-xs text-neutral-500 md:text-left md:text-xs">
            {hasAllSelections ? "Ready. (Mock add to cart)" : "Select options to continue."}
          </div>
        </div>
      </div>

      {/* Mobile sticky add-to-cart */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-xs text-neutral-500">{product.title}</div>
            <div className="text-sm font-semibold text-neutral-900">{formatPrice(product.price)}</div>
          </div>
          <button
            type="button"
            disabled={!hasAllSelections}
            onClick={() => router.push("/cart")}
            className={[
              "inline-flex min-h-[48px] items-center justify-center rounded-full px-6 text-center text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
              hasAllSelections ? "bg-neutral-900 text-white hover:opacity-90" : "bg-neutral-200 text-neutral-500 cursor-not-allowed",
            ].join(" ")}
          >
            Add to cart
          </button>
        </div>
        <div className="pb-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}

