import Link from 'next/link';

const shopLinks = [
  { label: 'All Prints', href: '/shop' },
  { label: 'About Us', href: '/about' },
];

const legalLinks = [
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Returns & Refunds', href: '/returns' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E5E5] mt-auto px-5 sm:px-10 lg:px-[80px] py-12 lg:py-16">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-10 lg:gap-0">

        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="text-[20px] font-medium uppercase tracking-[-0.03em] text-[#4B4C4A]"
          >
            Stasera
          </Link>
          <p className="text-[12px] font-normal tracking-[-0.03em] text-[#4B4C4A] opacity-55 max-w-[200px] leading-[1.5]">
            Prints worth framing.
          </p>
          <a
            href="mailto:info@stasera.digital"
            className="text-[12px] font-normal tracking-[-0.03em] text-[#4B4C4A] opacity-60 hover:opacity-100 transition-opacity"
          >
            info@stasera.digital
          </a>
        </div>

        {/* Nav columns */}
        <div className="flex gap-16 lg:gap-24">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-medium tracking-[-0.03em] text-[#4B4C4A] uppercase mb-1">
              Shop
            </p>
            {shopLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12px] font-normal tracking-[-0.03em] text-[#4B4C4A] opacity-60 hover:opacity-100 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-medium tracking-[-0.03em] text-[#4B4C4A] uppercase mb-1">
              Legal
            </p>
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12px] font-normal tracking-[-0.03em] text-[#4B4C4A] opacity-60 hover:opacity-100 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>

      <p className="mt-10 text-[11px] font-normal tracking-[-0.03em] text-[#4B4C4A] opacity-40">
        © {new Date().getFullYear()} Stasera. All rights reserved.
      </p>
    </footer>
  );
}
