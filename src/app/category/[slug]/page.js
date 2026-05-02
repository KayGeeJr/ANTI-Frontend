"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "../../../components/ProductCard";
import RevealOnScroll from "../../../components/RevealOnScroll";
import { api } from "../../../lib/api";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug;
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await api.getCategoryBySlug(slug);
        if (!isMounted) return;
        setCategory(data.category || null);
        setProducts(data.products || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load category");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="page-shell">
        <h1 className="page-title">{error || "Category not found"}</h1>
      </div>
    );
  }

  const heroImage = category.image?.url || category.image;

  return (
    <div>
      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <div className="relative h-[52vw] max-h-[560px] min-h-[280px] w-full overflow-hidden bg-neutral-100">
        {heroImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroImage}
            alt={category.name}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-neutral-200" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Text over image */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 sm:px-10 sm:pb-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Collection
            </p>
            <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Products grid ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
          <Link href="/shop" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            View all →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-neutral-400">No products in this collection yet.</p>
            <Link href="/shop" className="mt-4 text-sm font-medium text-neutral-900 underline underline-offset-2">
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, idx) => (
              <RevealOnScroll key={p.slug} delayMs={idx * 40}>
                <ProductCard product={p} />
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
