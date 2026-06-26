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
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  // Close the mobile menu on navigation, or when the header auto-hides on scroll.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!visible) setMenuOpen(false);
  }, [visible]);

  // Close the menu when the user clicks/taps anywhere outside the header.
  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [menuOpen]);

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

  // While the mobile menu is open, render the solid (scrolled) treatment so the
  // open panel reads as one white surface; closing it reverts to transparent.
  const transparent = isHomepage && !heroGone && !menuOpen;

  return (
    <header
      ref={headerRef}
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
        {/* Mobile menu toggle — only shown below the sm breakpoint, where the
            inline nav links are hidden. */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className={[
            'sm:hidden flex items-center justify-center -mr-1 p-1 transition-colors duration-300',
            transparent && !menuOpen ? 'text-white' : 'text-[#4B4C4A]',
          ].join(' ')}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="sm:hidden absolute left-0 right-0 top-full bg-white border-t border-black/5 shadow-sm px-5 py-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-[14px] tracking-[-0.03em] text-[#4B4C4A] border-b border-black/5 last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
