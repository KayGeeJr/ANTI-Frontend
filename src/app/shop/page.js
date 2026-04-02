import mockCatalog from "../../data/mockCatalog";
import ProductCard from "../../components/ProductCard";
import RevealOnScroll from "../../components/RevealOnScroll";

export default function ShopPage() {
  const products = mockCatalog.products;
  return (
    <div className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div>
          <div className="page-kicker">Shop</div>
          <h1 className="mt-2 page-title">Shop</h1>
          <div className="mt-1.5 text-sm leading-snug text-neutral-600 sm:mt-2 sm:leading-normal">{`Showing all ${products.length} results`}</div>
        </div>
        <div className="flex items-center justify-center gap-3 sm:justify-end">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <span className="font-medium">Sort</span>
            <select className="field-select">
              <option>Default sorting</option>
              <option>Sort by popularity</option>
              <option>Sort by latest</option>
              <option>Sort by price: low to high</option>
              <option>Sort by price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 lg:grid-cols-3">
        {products.map((p, idx) => (
          <RevealOnScroll key={p.slug} delayMs={idx * 30}>
            <ProductCard product={p} />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}

