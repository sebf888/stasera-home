'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  Product,
  Size,
  Frame,
  FRAMES,
  SIZE_LABELS,
  FRAME_LABELS,
  getVariant,
  formatPrice,
} from '@/data/products';
import { useCart } from '@/lib/cart-context';

const FRAME_SWATCHES: Record<Frame, { bg: string; noFrame?: boolean }> = {
  none:  { bg: '#FFFFFF', noFrame: true },
  black: { bg: '#303030' },
  white: { bg: '#EEEEEE' },
  wood:  { bg: '#C49B58' },
};

type ButtonState = 'idle' | 'picking' | 'added';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const availableSizes = [...new Set(product.variants.map((v) => v.size))] as Size[];
  const [selectedSize, setSelectedSize] = useState<Size>(availableSizes[0] ?? 'A4');
  const [selectedFrame, setSelectedFrame] = useState<Frame>('black');
  const [btnState, setBtnState] = useState<ButtonState>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    return () => { if (resetTimer.current) clearTimeout(resetTimer.current); };
  }, []);

  const variant = getVariant(product, selectedSize, selectedFrame);
  const price = variant ? formatPrice(variant.priceGBP) : '—';

  function handleMouseEnter() {
    if (btnState !== 'added') setBtnState('picking');
  }

  function handleMouseLeave() {
    if (btnState !== 'added') setBtnState('idle');
  }

  function handleSizeClick(size: Size, e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedSize(size);
    const v = getVariant(product, size, selectedFrame);
    if (v) {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        artist: product.artist,
        image: product.images[0],
        printFileUrl: product.printFileUrl ?? '',
        size,
        frame: selectedFrame,
        priceGBP: v.priceGBP,
        gelatoProductUid: v.gelatoProductUid,
        stripePriceId: v.stripePriceId,
      });
    }
    setBtnState('added');
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setBtnState('idle'), 1400);
  }

  return (
    <div>
      <Link href={`/shop/${product.slug}`} className="block group">
        <div
          className="relative w-[calc(100%+1rem)] -ml-[0.5rem] lg:w-[calc(100%+5vw)] lg:-ml-[2.5vw]"
          style={{ aspectRatio: '8/11' }}
        >
          {/* Poster image positioned inside aperture (with bleed) */}
          <div
            className="absolute overflow-hidden"
            style={{
              left:   product.format === 'a-series' ? '10.625%' : '8.594%',
              top:    '9.659%',
              width:  product.format === 'a-series' ? '78.75%'  : '82.813%',
              height: '80.682%',
            }}
          >
            <Image
              src={product.images[0]}
              fill
              sizes="(max-width: 1024px) 50vw, 20vw"
              className="object-cover"
              alt={product.name}
            />
          </div>
          {/* Frame overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
            <Image
              src={`/frames/frame-${product.format}-${selectedFrame === 'none' ? 'black' : selectedFrame}.webp`}
              fill
              sizes="(max-width: 1024px) 50vw, 20vw"
              className="object-cover"
              alt=""
            />
          </div>
        </div>

        {/* Title — full card width, single line */}
        <p className="-mt-3 relative z-[11] text-[13px] tracking-[-0.03em] text-[#4B4C4A] leading-snug whitespace-nowrap">
          <span className="font-medium">{product.name}</span>
          <span className="font-normal"> by {product.artist}</span>
        </p>
      </Link>

      {/* Price + swatches (left) | Button (right, top at price midpoint) */}
      <div className="mt-[1px] relative z-[11] flex items-start justify-between gap-3">

        {/* Left column — height matches button bottom (mt 8px + height 37px) */}
        <div className="min-w-0 flex flex-col justify-between h-[45px]">
          {/* Price */}
          <p className="text-[12px] font-normal tracking-[-0.03em] text-[#4B4C4A]">
            {price}
          </p>

          {/* Frame swatches */}
          <div className="flex items-center gap-[7px]">
            {FRAMES.map((frame) => {
              const { bg, noFrame } = FRAME_SWATCHES[frame];
              const isSelected = selectedFrame === frame;
              return (
                <button
                  key={frame}
                  onClick={() => setSelectedFrame(frame)}
                  title={FRAME_LABELS[frame]}
                  className="relative rounded-full flex-shrink-0 transition-all"
                  style={{
                    width: 11,
                    height: 11,
                    backgroundColor: bg,
                    outline: isSelected ? '1.5px solid #303030' : '1.5px solid transparent',
                    outlineOffset: '1.5px',
                  }}
                >
                  {noFrame && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to bottom right, transparent calc(50% - 0.7px), #ef4444 calc(50% - 0.7px), #ef4444 calc(50% + 0.7px), transparent calc(50% + 0.7px))',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column — button top at price midpoint (~8px down from price top) */}
        <div className="flex-shrink-0 mt-[8px]">
          {/* Add to Cart — 3-state hover button */}
          <div
            className="relative overflow-hidden bg-[#334157] cursor-pointer select-none"
            style={{ width: 162, height: 37 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Idle: "Add to Cart" */}
            <span
              className={`absolute inset-0 flex items-center justify-center text-[12px] font-normal tracking-[-0.03em] text-white transition-opacity duration-200 ${
                btnState === 'idle' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              Add to Cart
            </span>

            {/* Picking: size options */}
            <span
              className={`absolute inset-0 flex items-center justify-evenly px-2 transition-opacity duration-150 ${
                btnState === 'picking' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleSizeClick(size, e)}
                  className={`text-[11px] tracking-[-0.03em] text-white py-1 transition-opacity hover:opacity-100 ${
                    selectedSize === size ? 'font-medium opacity-100' : 'font-normal opacity-50'
                  }`}
                >
                  {SIZE_LABELS[size]}
                </button>
              ))}
            </span>

            {/* Added: ✓ confirmation */}
            <span
              className={`absolute inset-0 flex items-center justify-center text-[15px] text-white transition-all duration-250 ${
                btnState === 'added' ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
              }`}
            >
              ✓
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
