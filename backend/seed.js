const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");
const Category = require("./models/Category");
const Collection = require("./models/Collection");
const Product = require("./models/Product");

dotenv.config();

function slugToTitle(slug) {
  return String(slug || "")
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

function parseMockCatalogFromFrontend() {
  const catalogPath = path.resolve(__dirname, "../src/data/mockCatalog.js");
  const source = fs.readFileSync(catalogPath, "utf8");
  const evaluator = new Function(
    `${source.replace("export default mockCatalog;", "return mockCatalog;")}`,
  );
  return evaluator();
}

function toSkuPart(value, fallback = "NA") {
  const sanitized = String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  return sanitized || fallback;
}

function mapOptionsToVariants(options = [], seedKey = "", productIndex = 0) {
  const keyPart = toSkuPart(seedKey, `ANTI${productIndex + 1}`);
  if (!Array.isArray(options) || options.length === 0) {
    return [{ stock: 20, sku: `${keyPart}-DEFAULT` }];
  }

  const sizeOpt = options.find((o) => String(o.name).toLowerCase() === "size");
  const colourOpt = options.find((o) => ["color", "colour"].includes(String(o.name).toLowerCase()));
  const sizes = sizeOpt?.values?.length ? sizeOpt.values : [undefined];
  const colours = colourOpt?.values?.length ? colourOpt.values : [undefined];

  const variants = [];
  for (const size of sizes) {
    for (const colour of colours) {
      const sizePart = toSkuPart(size, "NA");
      const colourPart = toSkuPart(colour, "NA");
      variants.push({
        size,
        colour,
        stock: 20,
        sku: `${keyPart}-${sizePart}-${colourPart}`,
      });
    }
  }

  return variants;
}

async function runSeed() {
  await connectDB();

  await Promise.all([Product.deleteMany({}), Category.deleteMany({}), Collection.deleteMany({})]);

  const catalog = parseMockCatalogFromFrontend();
  const categoriesFromCatalog = Array.isArray(catalog.categories) ? [...catalog.categories] : [];
  const productsFromCatalog = Array.isArray(catalog.products) ? [...catalog.products] : [];

  const knownCategorySlugs = new Set(categoriesFromCatalog.map((c) => c.slug));
  for (const product of productsFromCatalog) {
    for (const slug of product.categorySlugs || []) {
      if (!knownCategorySlugs.has(slug)) {
        categoriesFromCatalog.push({
          slug,
          title: slugToTitle(slug),
          image: "/images/placeholder.svg",
        });
        knownCategorySlugs.add(slug);
      }
    }
  }

  const categoryDocs = await Category.insertMany(
    categoriesFromCatalog.map((c) => ({
      name: c.title,
      slug: c.slug,
      description: c.title,
      image: c.image ? { url: c.image } : undefined,
      video: c.video || undefined,
      isActive: true,
    })),
  );

  const collectionDocs = await Collection.insertMany(
    categoriesFromCatalog.map((c) => ({
      name: c.title,
      slug: c.slug,
      description: c.title,
      image: c.image ? { url: c.image } : undefined,
      isActive: true,
    })),
  );

  const categoryBySlug = Object.fromEntries(categoryDocs.map((c) => [c.slug, c._id]));
  const collectionBySlug = Object.fromEntries(collectionDocs.map((c) => [c.slug, c._id]));

  const productsForInsert = productsFromCatalog
    .filter((p) => Array.isArray(p.categorySlugs) && p.categorySlugs.length > 0)
    .map((p, index) => {
      const primarySlug = p.categorySlugs[0];
      return {
        name: p.title,
        description: p.description,
        price: Math.round(Number(p.price || 0) * 100),
        category: categoryBySlug[primarySlug],
        collection: collectionBySlug[primarySlug],
        images: (p.images || []).map((url) => ({ url })),
        variants: mapOptionsToVariants(p.options || [], p.slug || p.title || "ANTI", index),
        tags: p.categorySlugs || [],
        isFeatured: false,
        isActive: true,
      };
    })
    .filter((p) => Boolean(p.category));

  await Product.insertMany(productsForInsert);
  console.log(
    `Seed complete: ${categoryDocs.length} categories, ${collectionDocs.length} collections, ${productsForInsert.length} products`,
  );
  process.exit(0);
}

runSeed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
