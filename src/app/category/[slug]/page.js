import { notFound } from "next/navigation";
import mockCatalog from "../../../data/mockCatalog";
import ProductCard from "../../../components/ProductCard";
import RevealOnScroll from "../../../components/RevealOnScroll";

export default function CategoryPage({ params }) {
  const { slug } = params;
  const category = mockCatalog.categories.find((c) => c.slug === slug);
  if (!category) return notFound();

  const products = mockCatalog.products.filter((p) => p.categorySlugs.includes(slug));

  return (
    <div className="page-shell">
      <RevealOnScroll>
        <div className="page-kicker">Category</div>
        <h1 className="mt-2 page-title">{category.title}</h1>
      </RevealOnScroll>
      <div className="mt-2 text-sm text-neutral-600">{`Showing all ${products.length} results`}</div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {products.map((p, idx) => (
          <RevealOnScroll key={p.slug} delayMs={idx * 40}>
            <ProductCard product={p} />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return mockCatalog.categories.map((c) => ({ slug: c.slug }));
}

