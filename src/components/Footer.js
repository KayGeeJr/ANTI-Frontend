import Link from "next/link";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.6-.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"
      />
    </svg>
  );
}

function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M14 3c.4 3 2.5 5.1 5.5 5.3v3.1c-2.1.1-4-.6-5.5-1.9V16a6 6 0 1 1-6.3-6v3.3a2.8 2.8 0 1 0 3.1 2.7V3h3.2Z"
      />
    </svg>
  );
}

export default function Footer() {
  const social = [
    { href: "https://www.instagram.com/officialanti.za/", label: "Instagram", Icon: InstagramIcon },
    { href: "https://www.tiktok.com/@officialanti.za", label: "TikTok", Icon: TikTokIcon },
  ];

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold tracking-tight mb-2">ANTI</div>
            <div className="text-sm text-neutral-600">
              Progressive South African fashion brand redefining luxury through bold style and timeless allure.
            </div>
          </div>
          <div>
            <div className="font-semibold tracking-tight mb-2">Explore</div>
            <div className="flex flex-col gap-2 text-sm text-neutral-700">
              <Link href="/about" className="hover:opacity-80">
                About
              </Link>
              <Link href="/shop" className="hover:opacity-80">
                Shop
              </Link>
              <Link href="/custom-orders" className="hover:opacity-80">
                Custom Orders
              </Link>
              <Link href="/contact" className="hover:opacity-80">
                Contact
              </Link>
            </div>
          </div>
          <div>
            <div className="font-semibold tracking-tight mb-2">Contact</div>
            <div className="text-sm text-neutral-700">
              <div>Phone: 081 478 9222</div>
              <div>Email: info@shopanti.online</div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">Social</div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                {social.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-900 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  >
                    <s.Icon className="h-4 w-4" />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-xs text-neutral-500">
          Copyright © {new Date().getFullYear()} shopanti.online | Powered by shopanti.online
        </div>
      </div>
    </footer>
  );
}

