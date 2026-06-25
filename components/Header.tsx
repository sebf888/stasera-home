'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import CartButton from './CartButton';
import CurrencySwitcher from './CurrencySwitcher';

const navItems = [
  { label: 'All Prints', href: '/shop' },
  { label: 'About Us', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  // heroGone: true once the user has scrolled past the hero
  const [heroGone, setHeroGone] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // On non-homepage pages the header is never transparent
    const heroThreshold = isHomepage ? window.innerHeight * 0.85 : -1;

    const handleScroll = () => {
      const y = window.scrollY;

      setHeroGone(y > heroThreshold);
      setShrunk(y > 50);

      if (y < 80) {
        setVisible(true);
      } else if (y > lastScrollY.current + 5) {
        setVisible(false);
      } else if (y < lastScrollY.current - 5) {
        setVisible(true);
      }

      lastScrollY.current = y;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  const transparent = isHomepage && !heroGone;

  return (
    <header
      className={[
        'fixed top-[34px] sm:top-[36px] left-0 right-0 z-50 flex items-center w-full px-5 sm:px-10 lg:px-[80px]',
        'transition-all duration-300 ease-in-out',
        transparent
          ? 'bg-transparent py-6 sm:py-8 lg:py-12'
          : 'bg-white py-4 sm:py-6 lg:py-9',
        visible ? 'translate-y-0' : '-translate-y-full',
      ].join(' ')}
    >
      <nav className="flex items-center flex-1 gap-6 sm:gap-[60px] lg:gap-[100px]">
        <Link
          href="/"
          className={[
            'text-[20px] sm:text-[26px] lg:text-[34px] font-medium uppercase tracking-[-0.03em] whitespace-nowrap transition-colors duration-300',
            transparent ? 'text-white' : 'text-[#4B4C4A]',
          ].join(' ')}
        >
          Stasera
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={[
              'text-[11px] sm:text-[12px] lg:text-[13px] font-normal tracking-[-0.03em] whitespace-nowrap hidden sm:block transition-colors duration-300',
              transparent ? 'text-white' : 'text-[#4B4C4A]',
            ].join(' ')}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3 sm:gap-5">
        <CurrencySwitcher transparent={transparent} />
        <CartButton isTransparent={transparent} />
      </div>
    </header>
  );
}
