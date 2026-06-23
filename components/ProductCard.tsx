'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  Product,
  PosterFormat,
  Size,
  Frame,
  FRAMES,
  SIZE_LABELS,
  FRAME_LABELS,
  getVariant,
  formatPrice,
} from '@/data/products';
import { useCart } from '@/lib/cart-context';

/* ────────────────────────────────────────────────────────────────────────
   Layout tunables — adjust these once the real (tightly-cropped, transparent,
   shadow-baked) frame assets are dropped in at /frames/frame-{format}-{frame}-v2.webp

   - CANVAS_ASPECT     gradient canvas box ratio (width / height)
   - FRAME_BOX_WIDTH   frame outer width as a % of the canvas width (centred)
   - HOVER_SCALE       how much the frame + poster enlarge together on hover
   - FRAME_ASPECT      intrinsic ratio (width / height) of each frame image,
                       INCLUDING the baked-in shadow padding. Must match the
                       real asset or the poster will misalign with the aperture.
   - FRAME_APERTURE    where the poster sits inside the frame image, as a % of
                       the frame image box (top / left / width / height).
   ──────────────────────────────────────────────────────────────────────── */
const CANVAS_ASPECT = '5 / 6';
const FRAME_BOX_WIDTH = 62;
const HOVER_SCALE = 1.06;

const FRAME_ASPECT: Record<PosterFormat, number> = {
  'a-series':  0.74,
  'ratio-4x3': 0.78,
};

const FRAME_APERTURE: Record<PosterFormat, { top: number; left: number; width: number; height: number }> = {
  'a-series':  { top: 5, left: 6, width: 88, height: 90 },
  'ratio-4x3': { top: 5, left: 6, width: 88, height: 90 },
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
  const [zoomed, setZoomed] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    return () => { if (resetTimer.current) clearTimeout(resetTimer.current); };
  }, []);

  const variant = getVariant(product, selectedSize, selectedFrame);
  const price = variant ? formatPrice(variant.priceGBP) : '—';

  const aperture = FRAME_APERTURE[product.format];
  const hasFrame = selectedFrame !== 'none';

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
        {/* Gradient canvas — D4D2CC (bottom-left) → F1F1EF (top-right) */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: CANVAS_ASPECT,
            background: 'linear-gradient(to top right, #D4D2CC, #F1F1EF)',
          }}
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
        >
          {/* Frame + poster group — centred, scales as one unit on hover */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: `${FRAME_BOX_WIDTH}%`,
              aspectRatio: `${FRAME_ASPECT[product.format]}`,
              transform: `translate(-50%, -50%) scale(${zoomed ? HOVER_SCALE : 1})`,
              transformOrigin: 'center center',
              transition: 'transform 0.4s ease',
            }}
          >
            {/* Poster — underlies the frame, sits within the aperture */}
            <div
              className="absolute overflow-hidden"
              style={{
                left:   `${aperture.left}%`,
                top:    `${aperture.top}%`,
                width:  `${aperture.width}%`,
                height: `${aperture.height}%`,
                // Soft shadow only when unframed — framed posters use the
                // shadow baked into the frame asset.
                boxShadow: hasFrame ? undefined : '0 8px 24px rgba(0, 0, 0, 0.16)',
              }}
            >
              <Image
                src={product.images[0]}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                alt={product.name}
              />
            </div>

            {/* Frame overlay — transparent PNG/WebP, shadows baked in */}
            {hasFrame && (
              <Image
                src={`/frames/frame-${product.format}-${selectedFrame}-v2.webp`}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover pointer-events-none"
                alt=""
              />
            )}
          </div>
        </div>

        {/* Row 1 — title */}
        <p className="mt-3 text-[13px] tracking-[-0.03em] text-[#4B4C4A] leading-snug whitespace-nowrap">
          <span className="font-medium">{product.name}</span>
          <span className="font-normal"> by {product.artist}</span>
        </p>
      </Link>

      {/* Row 2 — price (left) | framing-option images (right), vertically centred */}
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-[12px] font-normal tracking-[-0.03em] text-[#4B4C4A]">
          {price}
        </p>

        <div className="flex items-center gap-[9px]">
          {FRAMES.map((frame) => {
            const isSelected = selectedFrame === frame;
            return (
              <button
                key={frame}
                onClick={() => setSelectedFrame(frame)}
                title={FRAME_LABELS[frame]}
                aria-label={FRAME_LABELS[frame]}
                className="relative rounded-full overflow-hidden flex-shrink-0 transition-all"
                style={{
                  width: 26,
                  height: 26,
                  outline: isSelected ? '1.5px solid #303030' : '1.5px solid transparent',
                  outlineOffset: '2px',
                }}
              >
                <Image
                  src={`/frames/swatch-${frame}.webp`}
                  fill
                  sizes="26px"
                  className="object-cover"
                  alt=""
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3 — Add to Cart, full card width, same 3-state hover behaviour */}
      <div
        className="mt-3 relative overflow-hidden w-full bg-[#334157] cursor-pointer select-none"
        style={{ height: 37 }}
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
  );
}
