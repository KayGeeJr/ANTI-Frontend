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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <div
          className="relative aspect-square rounded-2xl border border-neutral-200 bg-neutral-50 overflow-hidden"
          tabIndex={images.length > 1 ? 0 : -1}
          role={images.length > 1 ? "group" : undefined}
          aria-label={images.length > 1 ? "Product images" : undefined}
          onKeyDown={(e) => {
            if (images.length <= 1) return;
            if (e.key === "ArrowLeft") setActiveImageIdx((i) => (i - 1 + images.length) % images.length);
            if (e.key === "ArrowRight") setActiveImageIdx((i) => (i + 1) % images.length);
          }}
        >
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
        <div className="text-xs text-neutral-600">Shopping Cart</div>
        <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">{product.title}</h1>
        <div className="mt-2 text-xl font-medium text-neutral-900">{formatPrice(product.price)}</div>

        <p className="mt-4 text-sm text-neutral-700 leading-relaxed">{product.description}</p>

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

        <div className="mt-6">
          <button
            type="button"
            disabled={!hasAllSelections}
            onClick={() => router.push("/cart")}
            className={[
              "inline-flex w-full items-center justify-center rounded-full border px-6 py-3 text-center text-sm font-medium transition",
              hasAllSelections ? "bg-neutral-900 text-white border-neutral-900 hover:opacity-90" : "bg-neutral-200 text-neutral-500 border-neutral-200 cursor-not-allowed",
            ].join(" ")}
          >
            Add to cart
          </button>
          <div className="mt-3 text-center text-xs text-neutral-500">
            {hasAllSelections ? "Ready. (Mock add to cart)" : "Select options to continue."}
          </div>
        </div>
      </div>
    </div>
  );
}

