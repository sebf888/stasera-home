'use client';
import { usePathname } from 'next/navigation';

export default function HeaderSpacer() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  // Matches the announcement bar (34/36px) + initial (un-shrunk) header height
  return <div className="h-[102px] sm:h-[126px] lg:h-[166px]" />;
}
