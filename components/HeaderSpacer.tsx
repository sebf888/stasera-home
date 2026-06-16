'use client';
import { usePathname } from 'next/navigation';

export default function HeaderSpacer() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  // Matches the initial (un-shrunk) header height at each breakpoint
  return <div className="h-[68px] sm:h-[90px] lg:h-[130px]" />;
}
