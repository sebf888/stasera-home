'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { formatPrice, SIZE_LABELS, FRAME_LABELS } from '@/data/products';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotalGBP } = useCart();
  const [loading, setLoading] = useState(false);

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

  if (items.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-5 text-center gap-5">
        <p className="text-[22px] font-medium tracking-[-0.03em] text-[#4B4C4A]">
          Your cart is empty
        </p>
        <Link
          href="/"
          className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] underline underline-offset-2"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="px-5 sm:px-10 lg:px-[70px] py-10 flex-1">
      <h1 className="text-[26px] font-medium tracking-[-0.03em] text-[#4B4C4A] mb-10">
        My Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Items */}
        <div className="flex-1 w-full divide-y divide-[#EBEBEB]">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.frame}`}
              className="flex gap-5 py-7"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={72}
                height={101}
                className="object-cover flex-shrink-0"
                style={{ filter: 'drop-shadow(-2px 1px 2px rgba(0,0,0,0.45))' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium tracking-[-0.03em] text-[#4B4C4A]">
                  {item.name}
                </p>
                <p className="text-[12px] font-normal tracking-[-0.03em] text-[#4B4C4A] opacity-55">
                  by {item.artist}
                </p>
                <p className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] mt-1">
                  {SIZE_LABELS[item.size]} · {FRAME_LABELS[item.frame]}
                </p>
                <p className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] mt-0.5">
                  {formatPrice(item.priceGBP)}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.frame, item.quantity - 1)
                    }
                    className="w-[26px] h-[26px] flex items-center justify-center border border-[#D0D0D0] text-[#4B4C4A] hover:border-[#4B4C4A] transition-colors text-[15px] leading-none"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.frame, item.quantity + 1)
                    }
                    className="w-[26px] h-[26px] flex items-center justify-center border border-[#D0D0D0] text-[#4B4C4A] hover:border-[#4B4C4A] transition-colors text-[15px] leading-none"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-between items-end flex-shrink-0">
                <button
                  onClick={() => removeItem(item.productId, item.size, item.frame)}
                  className="text-[#4B4C4A] opacity-35 hover:opacity-100 transition-opacity text-[20px] leading-none"
                  aria-label="Remove item"
                >
                  ×
                </button>
                <p className="text-[13px] font-medium tracking-[-0.03em] text-[#4B4C4A]">
                  {formatPrice(item.priceGBP * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:w-[280px] w-full flex-shrink-0">
          <div className="border border-[#EBEBEB] p-6">
            <h2 className="text-[13px] font-medium tracking-[-0.03em] text-[#4B4C4A] mb-5">
              Order Summary
            </h2>
            <div className="flex justify-between mb-2">
              <span className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] opacity-60">
                Subtotal
              </span>
              <span className="text-[12px] tracking-[-0.03em] text-[#4B4C4A]">
                {formatPrice(subtotalGBP)}
              </span>
            </div>
            <div className="flex justify-between mb-5">
              <span className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] opacity-60">
                Shipping
              </span>
              <span className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] opacity-60">
                Calculated at checkout
              </span>
            </div>
            <div className="border-t border-[#EBEBEB] pt-4 flex justify-between mb-6">
              <span className="text-[13px] font-medium tracking-[-0.03em] text-[#4B4C4A]">
                Total
              </span>
              <span className="text-[13px] font-medium tracking-[-0.03em] text-[#4B4C4A]">
                {formatPrice(subtotalGBP)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#334157] text-white text-[12px] font-normal tracking-[-0.03em] py-[11px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Redirecting…' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
