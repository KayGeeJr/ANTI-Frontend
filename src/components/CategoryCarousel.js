"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

export default function CategoryCarousel({ categories }) {
  const scrollerRef = useRef(null);
  const items = categories || [];

  const card = useMemo(
    () => [
      "group",
      "rounded-3xl",
      "overflow-hidden",
      "border",
      "border-neutral-200/70",
      "bg-white",
      "hover:shadow-md",
      "transition-all",
      "duration-300",
      "transform",
      "hover:-translate-y-1",
      "snap-start",
    ].join(" "),
    [],
  );

  function scrollByCards(direction) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8) * direction;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (!items.length) return null;

  return (
    <div className="mt-6">
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-5 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
          aria-label="Category carousel"
        >
          {items.map((c, idx) => (
            <div
              key={c.slug}
              className="flex-none w-[min(92vw,320px)] sm:w-[340px] md:w-[360px] lg:w-[380px] xl:w-[400px]"
            >
              <RevealOnScroll variant="image" delayMs={idx * 80} className="h-full min-w-0">
                <Link href={`/category/${c.slug}`} className={card} aria-label={c.title}>
                  <div className="relative aspect-[4/5] bg-neutral-50 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image}
                      alt={c.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-neutral-200 px-4 py-5 md:py-6">
                      <div className="text-xs md:text-[13px] font-semibold tracking-[0.16em] text-neutral-900 uppercase text-center leading-snug">
                        {c.title}
                      </div>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white/70 backdrop-blur hover:bg-white transition"
          onClick={() => scrollByCards(-1)}
          aria-label="Scroll categories left"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white/70 backdrop-blur hover:bg-white transition"
          onClick={() => scrollByCards(1)}
          aria-label="Scroll categories right"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

