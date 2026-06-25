'use client';

import { useCart } from '@/lib/cart-context';
import { useCurrency } from '@/lib/currency-context';
import { FREE_SHIPPING_THRESHOLD_PENCE } from '@/lib/shipping';

export default function AnnouncementBar() {
  const { subtotalGBP } = useCart();
  const { format } = useCurrency();

  const threshold = FREE_SHIPPING_THRESHOLD_PENCE;
  const remaining = Math.max(0, threshold - subtotalGBP);
  const progress = Math.min(1, Math.max(0, subtotalGBP / threshold));
  const unlocked = subtotalGBP >= threshold;

  let message: React.ReactNode;
  if (subtotalGBP <= 0) {
    message = <>Free shipping on orders over {format(threshold)}</>;
  } else if (unlocked) {
    message = <>You&apos;ve unlocked free shipping</>;
  } else {
    message = <>You&apos;re {format(remaining)} away from free shipping</>;
  }

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[34px] sm:h-[36px] bg-[#4B4C4A] text-white flex items-center justify-center overflow-hidden">
      <p className="px-5 text-center text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.1em] whitespace-nowrap">
        {message}
      </p>
      {/* Slim progress hairline along the bottom edge */}
      <span
        className="absolute bottom-0 left-0 h-[2px] bg-white/70 transition-[width] duration-500 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
