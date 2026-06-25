'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { useCurrency } from '@/lib/currency-context';
import { SIZE_LABELS, FRAME_LABELS } from '@/data/products';

export default function CartButton({ isTransparent = false }: { isTransparent?: boolean }) {
  const { items, totalItems, subtotalGBP, removeItem } = useCart();
  const { format } = useCurrency();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  }, []);

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setLoading(false);
    }
  }

  const label = totalItems > 0 ? `My Cart (${totalItems})` : 'My Cart';

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="/cart"
        className={`text-[11px] sm:text-[12px] lg:text-[13px] font-normal tracking-[-0.03em] whitespace-nowrap transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-[#4B4C4A]'}`}
      >
        {label}
      </Link>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-[300px] bg-white border border-[#E5E5E5] z-50">
          {items.length === 0 ? (
            <p className="p-5 text-[12px] tracking-[-0.03em] text-[#4B4C4A]">
              Your cart is empty.
            </p>
          ) : (
            <>
              <ul className="max-h-[280px] overflow-y-auto divide-y divide-[#F0F0F0]">
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size}-${item.frame}`}
                    className="flex gap-3 p-4"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={67}
                      className="object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium tracking-[-0.03em] text-[#4B4C4A] leading-snug">
                        {item.name}
                      </p>
                      <p className="text-[11px] font-normal tracking-[-0.03em] text-[#4B4C4A] opacity-60 leading-snug">
                        {SIZE_LABELS[item.size]} · {FRAME_LABELS[item.frame]}
                      </p>
                      <p className="text-[11px] tracking-[-0.03em] text-[#4B4C4A] mt-0.5">
                        {format(item.priceGBP)} × {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size, item.frame)}
                      className="text-[#4B4C4A] opacity-40 hover:opacity-100 transition-opacity text-[16px] flex-shrink-0 self-start leading-none"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              <div className="border-t border-[#E5E5E5] px-4 py-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[12px] tracking-[-0.03em] text-[#4B4C4A]">Subtotal</span>
                  <span className="text-[12px] font-medium tracking-[-0.03em] text-[#4B4C4A]">
                    {format(subtotalGBP)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/cart"
                    className="flex-1 border border-[#4B4C4A] text-center text-[11px] tracking-[-0.03em] text-[#4B4C4A] py-[9px] hover:bg-[#4B4C4A] hover:text-white transition-colors"
                  >
                    View Cart
                  </Link>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="flex-1 bg-[#334157] text-white text-[11px] tracking-[-0.03em] py-[9px] hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? 'Loading…' : 'Checkout'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
