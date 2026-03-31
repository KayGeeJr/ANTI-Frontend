import Link from "next/link";
import mockCatalog from "../data/mockCatalog";
import FeaturedProductTile from "../components/FeaturedProductTile";
import RevealOnScroll from "../components/RevealOnScroll";
import CategoryCarousel from "../components/CategoryCarousel";
import GalleryCarousel from "../components/GalleryCarousel";
import RandomFeaturedProducts from "../components/RandomFeaturedProducts";

function formatPrice(price) {
  return `R${price}.00`;
}

const linkFocus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded-sm";

export default function HomePage() {
  const categories = mockCatalog.categories;
  const galleryImages = mockCatalog.galleryImages || [];

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section
        className="home-container pt-8 pb-12 sm:pt-12 sm:pb-16 md:pb-20"
        aria-labelledby="hero-heading"
      >
        <RevealOnScroll>
          <div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end md:gap-10">
              <div>
                <div className="home-eyebrow">ANTI GOES TO</div>
                <h1 id="hero-heading" className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                  AFRICA FASHION WEEK LONDON
                </h1>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
                  The Journey Continues - And You&apos;re Part of It
                </p>
              </div>

              <div className="md:text-right">
                <div className="text-3xl font-normal leading-tight tracking-tight text-neutral-900 md:text-4xl">
                  OVERSIZED
                  <br />
                  BOX-CUT TEES
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-start border-t border-neutral-200 pt-4 md:justify-end">
              <div className="text-2xl font-semibold tracking-tight text-neutral-900">{formatPrice(600)}</div>
            </div>
          </div>
        </RevealOnScroll>

        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-2 md:items-start md:gap-12 lg:gap-14">
          <RevealOnScroll variant="image" className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
              <div className="aspect-[4/5] bg-neutral-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/products/Athi.jpeg"
                  alt="Oversized box-cut tees from ANTI"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={80}>
            <div className="max-w-prose text-[15px] leading-7 text-neutral-600 md:text-[16px] md:leading-8">
                <p className="md:pt-2">
                  Our first campaign was a beautiful testament to the power of community. Because of your incredible
                  support, we successfully secured a coverted spot at Africa Fashion Week London - a milestone that pushed
                  our dream onto the global stage.
                </p>
                <p className="mt-8">
                  Although an unexpected setback paused the journey, it did not stop it. The organizers have officially
                  deffered our participation to next year, giving us a second chance to bring our vision to file.
                </p>
                <p className="mt-8">
                  This campaign marks the next chapter of our comeback story - a renewed opportunity to represent home,
                  celebrate creativity, and step onto an international runway with your support behind us.
                </p>
                <p className="mt-8">
                  By purchasing from this collection, you&apos;re not just buying a t-shirt. You&apos;re helping make the
                  preparation, travel, and accomodation for this long-awaited showcase possible. You&apos;re investing in a
                  dream that you helped ignite.
                </p>
                <p className="mt-8">
                  Thank you for believing. Let&apos;s finish what we&apos;ve started - together.
                  <br />
                  Love with all my heart,
                  <br />
                   Athi
                </p>
              </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* The Working Girl Drop */}
      <section
        className="border-y border-neutral-200/60 bg-white home-section-y"
        aria-labelledby="working-girl-heading"
      >
        <div className="home-container">
          <RevealOnScroll>
            <h2 id="working-girl-heading" className="home-section-title text-center">
              The Working Girl Drop
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-600 sm:text-[15px]">
              Tailored energy for every day—shop the full drop.
            </p>
          </RevealOnScroll>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-6">
              {[
                { src: "/images/products/undul3.jpeg", alt: "Look from The Working Girl Drop" },
                { src: "/images/products/undul4.jpeg", alt: "Another look from The Working Girl Drop" },
                { src: "/images/products/axis1.jpeg", alt: "Third look from The Working Girl Drop" },
              ].map((item, idx) => (
                <RevealOnScroll key={item.src} variant="image" delayMs={idx * 100} className="min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="aspect-[4/5] w-full rounded-2xl border border-neutral-200/70 object-cover shadow-sm"
                  />
                </RevealOnScroll>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link href="/category/the-working-girl-drop" className="btn-primary-solid">
                SHOP NOW
              </Link>
            </div>
        </div>
      </section>

      {/* The Next Chapter Collection */}
      <section
        className="bg-neutral-100/40 home-section-y"
        aria-labelledby="next-chapter-heading"
      >
        <div className="home-container">
          <RevealOnScroll>
            <h2 id="next-chapter-heading" className="home-section-title text-center">
              The Next Chapter Collection
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-600 sm:text-[15px]">
              Pieces that carry the AFWL story forward.
            </p>
          </RevealOnScroll>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-6">
              {[
                { src: "/images/products/sbt2.jpg", alt: "The Next Chapter Collection — look one" },
                { src: "/images/products/sbt3.jpg", alt: "The Next Chapter Collection — look two" },
                { src: "/images/products/sbt4.jpg", alt: "The Next Chapter Collection — look three" },
              ].map((item, idx) => (
                <RevealOnScroll key={item.src} variant="image" delayMs={idx * 100} className="min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="aspect-[4/5] w-full rounded-2xl border border-neutral-200/70 object-cover shadow-sm"
                  />
                </RevealOnScroll>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link href="/category/afwl-tess" className="btn-primary-solid">
                SHOP NOW
              </Link>
            </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white home-section-y" aria-labelledby="categories-heading">
        <div className="home-container">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="categories-heading" className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl">
                Categories
              </h2>
              <p className="mt-1 text-sm text-neutral-600">Browse by collection and mood.</p>
            </div>
            <Link
              href="/shop"
              className={`text-sm text-neutral-700 underline-offset-4 hover:underline ${linkFocus}`}
            >
              View Shop
            </Link>
          </div>
          <RevealOnScroll>
            <div className="mt-8">
              <CategoryCarousel categories={categories} />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Custom Orders */}
      <section className="border-t border-neutral-200/60 bg-neutral-50 home-section-y" aria-labelledby="custom-orders-heading">
        <div className="home-container">
          <RevealOnScroll>
            <h2 id="custom-orders-heading" className="home-section-title text-center">
              Custom Orders
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-600 sm:text-[15px]">
              Bespoke pieces shaped around you.
            </p>
          </RevealOnScroll>
            <div className="mt-10 grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12">
              <RevealOnScroll variant="image" className="min-w-0">
                <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-sm md:min-h-[420px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/anti_images/custom.jpeg"
                    alt="Custom orders at ANTI — bespoke garment details"
                    className="max-h-[min(520px,55vh)] w-full object-contain"
                  />
                </div>
              </RevealOnScroll>
              <RevealOnScroll delayMs={100}>
              <div className="text-sm leading-relaxed text-neutral-600 md:text-[15px] md:leading-7">
                <p>
                  At ANTI, we infuse every stitch with a touch of magic, taking immense pride in our heartfelt collaboration
                  with you—our cherished client—to create garments that are as singular and vibrant as your very soul. We
                  see fashion not just as clothing, but as a transformative journey of self-expression, where your personal
                  style, your inspiring vision of your higher self, and the elegant contours of your unique body structure
                  come together in a symphony of individuality.
                </p>
                <p className="mt-5">
                  Through a deeply personal partnership, we listen to your dreams, preferences, and aspirations, meticulously
                  tailoring each piece to mirror your essence with bespoke artistry. Whether it&apos;s the flow of a fabric
                  that complements your form, the bold hues that reflect your spirit, or the intricate details that echo your
                  personality, we craft every garment to elevate your presence and celebrate your journey.
                </p>
                <p className="mt-5">
                  Step into a world where every thread weaves your story—customized with care, radiating confidence, and
                  crafted to be utterly, authentically you!
                </p>
                <div className="mt-8 flex justify-center">
                  <Link href="/custom-orders" className="btn-primary-solid">
                    ORDER NOW
                  </Link>
                </div>
              </div>
              </RevealOnScroll>
            </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white home-section-y" aria-labelledby="gallery-heading">
        <div className="home-container">
          <h2 id="gallery-heading" className="home-section-title text-center">
            Gallery
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-600 sm:text-[15px]">
            Campaign moments, runway energy, and studio details.
          </p>
          <div className="mt-10">
            <GalleryCarousel images={galleryImages.length ? galleryImages : ["/images/placeholder.svg"]} />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-neutral-200/60 bg-neutral-100/30 home-section-y" aria-labelledby="featured-heading">
        <div className="home-container">
          <h2 id="featured-heading" className="home-section-title text-center">
            Featured Products
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-600 sm:text-[15px]">
            Hand-picked pieces from the current lineup.
          </p>
          <RandomFeaturedProducts products={mockCatalog.products} count={4} />
        </div>
      </section>

      {/* About */}
      <section className="bg-white home-section-y pb-12 md:pb-16 lg:pb-20" aria-labelledby="about-heading">
        <div className="home-container">
          <h2 id="about-heading" className="home-section-title text-center">
            About Us
          </h2>
          <div className="mt-8 grid grid-cols-1 items-center gap-10 md:mt-10 md:grid-cols-2 md:gap-12 lg:gap-14">
            <RevealOnScroll variant="image" className="min-w-0">
              <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100 shadow-sm">
                <div className="aspect-[4/5] bg-neutral-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/anti_images/about.jpg"
                    alt="Two models wearing ANTI tailoring at a padel court, editorial portrait"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={100}>
              <div className="max-w-prose space-y-4 text-sm leading-relaxed text-neutral-700 sm:text-[15px] md:space-y-5 md:text-[16px] md:leading-7">
                <p>
                  ANTI is a progressive South African fashion brand redefining luxury through bold style and timeless allure.
                  Rooted in Johannesburg, our aesthetic is eclectic, contemporary, and unapologetically distinctive.
                </p>
                <p>
                  Every design is a visual statement, crafted to embody self-expression, individuality, and creativity. We
                  believe clothing is the ultimate form of personal expression.
                </p>
                <p>
                  Founded in 2021, ANTI specialises in both fashion design and manufacturing. Our work is a seamless fusion
                  of skill, vision, and cultural relevance—pieces designed to move with you, and stand out with intention.
                </p>
                <p>
                  From ready-to-wear drops to custom orders, we create garments that honour the diverse spirit of modern
                  African identity while keeping the finish elevated and timeless.
                </p>
                <p className="font-medium text-neutral-900">
                  ANTI isn’t just a brand — it’s a movement for the creatively fearless.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-neutral-900 pb-20 pt-14 text-white md:pb-24 md:pt-16" aria-labelledby="newsletter-heading">
        <div className="home-container">
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm sm:p-10">
            <h3 id="newsletter-heading" className="text-lg font-semibold tracking-tight sm:text-xl">
              Sign up for our newsletter
            </h3>
            <p className="mt-2 text-sm text-white/75 sm:text-[15px]">
              Get updates on new drops and collections.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                className="min-h-[48px] w-full max-w-sm rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/45 outline-none transition-colors focus:border-white/40 focus:ring-2 focus:ring-white/30 sm:max-w-md sm:flex-1"
              />
              <button
                type="button"
                className="inline-flex min-h-[48px] w-full max-w-xs shrink-0 items-center justify-center rounded-full bg-white px-8 text-center text-sm font-medium uppercase tracking-[0.12em] text-neutral-900 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 sm:w-auto"
              >
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
