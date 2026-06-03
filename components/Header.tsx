import Link from 'next/link';
import CartButton from './CartButton';

const navItems = [
  { label: 'All Prints', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  return (
    <header className="flex items-center w-full bg-white py-6 sm:py-8 lg:py-12 px-5 sm:px-10 lg:px-[80px]">
      <nav className="flex items-center flex-1 gap-6 sm:gap-[60px] lg:gap-[100px]">
        <Link
          href="/"
          className="text-[20px] sm:text-[26px] lg:text-[34px] font-medium uppercase tracking-[-0.03em] text-[#4B4C4A] whitespace-nowrap"
        >
          Stasera
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-[11px] sm:text-[12px] lg:text-[13px] font-normal tracking-[-0.03em] text-[#4B4C4A] whitespace-nowrap hidden sm:block"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <CartButton />
    </header>
  );
}
