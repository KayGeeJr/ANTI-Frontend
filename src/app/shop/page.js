import mockCatalog from "../../data/mockCatalog";
import ProductCard from "../../components/ProductCard";
import RevealOnScroll from "../../components/RevealOnScroll";

export default function ShopPage() {
  const products = mockCatalog.products;
  return (
    <div className="page-container">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div>
          <div className="page-kicker">Shop</div>
          <h1 className="mt-1 page-title">Shop</h1>
          <div className="mt-2 text-sm text-neutral-600">{`Showing all ${products.length} results`}</div>
        </div>

        <div className="flex items-center justify-center gap-3 sm:justify-end">
          <label className="text-sm text-neutral-700">
            Sort
            <select className="ml-2 form-select">
              <option>Default sorting</option>
              <option>Sort by popularity</option>
              <option>Sort by latest</option>
              <option>Sort by price: low to high</option>
              <option>Sort by price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {products.map((p, idx) => (
          <RevealOnScroll key={p.slug} delayMs={idx * 30}>
            <ProductCard product={p} />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}

