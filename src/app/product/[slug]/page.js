import mockCatalog from "../../../data/mockCatalog";
import ProductDetails from "../../../components/ProductDetails";
import RevealOnScroll from "../../../components/RevealOnScroll";
import Link from "next/link";

export default function ProductPage({ params }) {
  const { slug } = params;
  const product = mockCatalog.products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="page-container">
        <h1 className="page-title text-center">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6 flex items-center justify-center md:justify-start">
        <Link href="/shop" className="btn-ghost min-h-[40px] px-5 text-xs">
          ← Back to shop
        </Link>
      </div>
      <RevealOnScroll>
        <ProductDetails product={product} />
      </RevealOnScroll>
      <div className="h-20 md:h-0" />
    </div>
  );
}

export function generateStaticParams() {
  return mockCatalog.products.map((p) => ({ slug: p.slug }));
}

