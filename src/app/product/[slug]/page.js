"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetails from "../../../components/ProductDetails";
import RevealOnScroll from "../../../components/RevealOnScroll";
import { api } from "../../../lib/api";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!slug) return;
      try {
        setLoading(true);
        setError("");
        const data = await api.getProduct(slug);
        if (!isMounted) return;
        setProduct(data.product || null);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load product");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="page-shell">
        <h1 className="page-title text-center">Loading product...</h1>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="page-shell">
        <h1 className="page-title text-center">{error || "Product not found"}</h1>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <RevealOnScroll>
        <ProductDetails product={product} />
      </RevealOnScroll>
    </div>
  );
}

