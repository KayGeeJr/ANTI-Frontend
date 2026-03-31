import mockCatalog from "../../../data/mockCatalog";
import ProductDetails from "../../../components/ProductDetails";
import RevealOnScroll from "../../../components/RevealOnScroll";

export default function ProductPage({ params }) {
  const { slug } = params;
  const product = mockCatalog.products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="page-shell">
        <h1 className="page-title text-center">Product not found</h1>
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

export function generateStaticParams() {
  return mockCatalog.products.map((p) => ({ slug: p.slug }));
}

