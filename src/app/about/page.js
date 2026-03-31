export default function AboutPage() {
  return (
    <div className="page-container">
      <div className="text-center">
        <div className="page-kicker">About</div>
        <h1 className="mt-1 page-title">About Us</h1>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/anti_images/about1.jpeg"
            alt="ANTI about image 1"
            className="h-full w-full aspect-[4/5] object-cover"
          />
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/anti_images/about2.jpeg"
            alt="ANTI about image 2"
            className="h-full w-full aspect-[4/5] object-cover"
          />
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
        <p>
          Founded in 2021, ANTI specialises in both fashion design and manufacturing. Our work is a seamless fusion of
          skill, vision, and cultural relevance—each piece intentionally created to inspire boldness and reflect the
          diverse spirit of modern African identity.
        </p>
        <p>
          Rooted in Johannesburg, our aesthetic is eclectic, contemporary, and unapologetically distinctive. We believe
          clothing is the ultimate form of personal expression: a visual statement that carries confidence, craft, and
          character.
        </p>
        <p>
          From ready-to-wear drops to custom orders, we collaborate with you to create garments that feel personal and
          look elevated—made to be worn, remembered, and revisited.
        </p>
        <p className="font-medium text-neutral-900">
          ANTI isn’t just a brand — it’s a movement for the creatively fearless.
        </p>
      </div>
    </div>
  );
}

