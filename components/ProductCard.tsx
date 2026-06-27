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
} from '@/data/products';
import { useCart } from '@/lib/cart-context';
import { useCurrency } from '@/lib/currency-context';

/* ────────────────────────────────────────────────────────────────────────
   Layout tunables — adjust these once the real (tightly-cropped, transparent,
   shadow-baked) frame assets are dropped in at /frames/frame-{format}-{frame}-v2.webp

   - canvas aspect     gradient box ratio, set on the canvas via Tailwind when
                       `tall`: aspect-[5/7] on mobile (taller canvas, poster
                       vertically centred), lg:aspect-[5/6] on desktop. Non-tall = 5/6.
   - frame box width   set responsively on the group via Tailwind (w-[78%] on
                       mobile so the poster fills more of the canvas, lg:w-[62%]
                       on desktop).
   - HOVER_SCALE       how much the frame + poster enlarge together on hover
   - FRAME_ASPECT      intrinsic ratio (width / height) of each frame image,
                       INCLUDING the baked-in shadow padding. Must match the
                       real asset or the poster will misalign with the aperture.
   - FRAME_APERTURE    where the poster sits inside the frame image, as a % of
                       the frame image box (top / left / width / height).
   ──────────────────────────────────────────────────────────────────────── */
// Shared drop shadow (Figma: x -6, y 6, blur 6.5, spread 0, #000 @ 25%).
// Cast from a solid "shadow plate" behind the art via box-shadow — box-shadow
// composites cleanly under the hover scale, whereas a drop-shadow filter gets
// re-rasterised and shows tiling seams while the group animates.
const POSTER_SHADOW = '-6px 6px 6.5px 0 rgba(0, 0, 0, 0.25)';

const HOVER_SCALE = 1.06;

const FRAME_ASPECT: Record<PosterFormat, number> = {
  'a-series':  0.7196, // 634 × 881
  'ratio-4x3': 0.7616, // 671 × 881
};

// Poster opening, measured from the frame assets (tucked ~0.5% under the moulding).
const FRAME_APERTURE: Record<PosterFormat, { top: number; left: number; width: number; height: number }> = {
  'a-series':  { top: 1.8, left: 2.6, width: 94.6, height: 96.3 },
  'ratio-4x3': { top: 1.8, left: 2.6, width: 94.8, height: 96.3 },
};

/* Gradient canvas with the centred frame + poster group. Shared by the card
   thumbnail (hover-zooms) and the mobile configurator sheet (static). */
function PosterFramePreview({
  product,
  frame,
  zoom = false,
  tall = false,
}: {
  product: Product;
  frame: Frame;
  zoom?: boolean;
  tall?: boolean;
}) {
  const aperture = FRAME_APERTURE[product.format];
  const hasFrame = frame !== 'none';

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden ${
        tall ? 'aspect-[5/7] lg:aspect-[5/6]' : 'aspect-[5/6]'
      }`}
      style={{ background: 'linear-gradient(to top right, #D4D2CC, #F1F1EF)' }}
    >
      <div
        className="relative w-[78%] lg:w-[62%]"
        style={{
          aspectRatio: `${FRAME_ASPECT[product.format]}`,
          transform: `scale(${zoom ? HOVER_SCALE : 1})`,
          transformOrigin: 'center center',
          transition: 'transform 0.4s ease',
        }}
      >
        {/* Shadow plate — solid rectangle behind the art, sized to the visible
            edge so box-shadow casts from a clean outline. */}
        <div
          className="absolute"
          style={{
            left:   hasFrame ? 0 : `${aperture.left}%`,
            top:    hasFrame ? 0 : `${aperture.top}%`,
            width:  hasFrame ? '100%' : `${aperture.width}%`,
            height: hasFrame ? '100%' : `${aperture.height}%`,
            boxShadow: POSTER_SHADOW,
          }}
        />
        {/* Poster — underlies the frame, sits within the aperture */}
        <div
          className="absolute overflow-hidden"
          style={{
            left:   `${aperture.left}%`,
            top:    `${aperture.top}%`,
            width:  `${aperture.width}%`,
            height: `${aperture.height}%`,
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

        {/* Frame overlay — transparent WebP, tightly cropped so its outer edge
            fills the group box; the shadow plate sits flush behind. */}
        {hasFrame && (
          <Image
            src={`/frames/frame-${product.format}-${frame}-v2.webp`}
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-contain pointer-events-none"
            alt=""
          />
        )}
      </div>
    </div>
  );
}

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
  const { format } = useCurrency();

  // ── Mobile configurator sheet ─────────────────────────────────────────────
  // Independent from the desktop hover flow above. Add-to-cart stays locked
  // until the shopper has actively chosen BOTH a size and a frame.
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false); // drives slide/fade
  const [sheetSize, setSheetSize] = useState<Size | null>(null);
  const [sheetFrame, setSheetFrame] = useState<Frame | null>(null);
  const [mobileAdded, setMobileAdded] = useState(false);
  const mobileAddedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      if (mobileAddedTimer.current) clearTimeout(mobileAddedTimer.current);
    };
  }, []);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [sheetOpen]);

  const variant = getVariant(product, selectedSize, selectedFrame);
  const price = variant ? format(variant.priceGBP) : '—';

  const fromPrice = format(Math.min(...product.variants.map((v) => v.priceGBP)));

  // Preview frame for the sheet image falls back to black before a choice.
  const previewFrame: Frame = sheetFrame ?? 'black';
  const sheetVariant = sheetSize ? getVariant(product, sheetSize, previewFrame) : undefined;
  const sheetReady = sheetSize !== null && sheetFrame !== null;

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

  function openSheet() {
    setSheetOpen(true);
    requestAnimationFrame(() => setSheetVisible(true));
  }

  function closeSheet() {
    setSheetVisible(false);
    setTimeout(() => setSheetOpen(false), 300); // match the transition duration
  }

  function handleSheetAdd() {
    if (!sheetSize || !sheetFrame) return;
    const v = getVariant(product, sheetSize, sheetFrame);
    if (!v) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      artist: product.artist,
      image: product.images[0],
      printFileUrl: product.printFileUrl ?? '',
      size: sheetSize,
      frame: sheetFrame,
      priceGBP: v.priceGBP,
      gelatoProductUid: v.gelatoProductUid,
      stripePriceId: v.stripePriceId,
    });
    closeSheet();
    setMobileAdded(true);
    if (mobileAddedTimer.current) clearTimeout(mobileAddedTimer.current);
    mobileAddedTimer.current = setTimeout(() => setMobileAdded(false), 1600);
  }

  return (
    <div>
      {/* Desktop: the thumbnail links to the product page. Mobile: the click is
          intercepted to open the configurator drawer instead, keeping shoppers in
          the catalogue (the drawer links out to the product page). Kept as a real
          <Link> so the product page stays crawlable and works without JS. */}
      <Link
        href={`/shop/${product.slug}`}
        className="group block"
        onClick={(e) => {
          if (window.matchMedia('(max-width: 1023px)').matches) {
            e.preventDefault();
            openSheet();
          }
        }}
      >
        <div onMouseEnter={() => setZoomed(true)} onMouseLeave={() => setZoomed(false)}>
          <PosterFramePreview product={product} frame={selectedFrame} zoom={zoomed} tall />
        </div>

        {/* Row 1 — title. Clamped to two lines with a reserved two-line height so
            the price + button align across cards regardless of title length. */}
        <p className="mt-3 min-h-[2.75em] text-[13px] leading-snug tracking-[-0.03em] text-[#4B4C4A] line-clamp-2 lg:min-h-0">
          <span className="font-medium">{product.name}</span>
          <span className="font-normal"> by {product.artist}</span>
        </p>
      </Link>

      {/* ── Desktop (lg+): price + swatches, hover-reveal size picker ───────── */}
      <div className="hidden lg:block">
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

        {/* Row 3 — Add to Cart, full card width, 3-state hover behaviour */}
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

      {/* ── Mobile (<lg): minimal card — from-price + "Select options" ──────── */}
      <div className="lg:hidden">
        <p className="mt-1.5 text-[12px] font-normal tracking-[-0.03em] text-[#4B4C4A]">
          from {fromPrice}
        </p>
        <button
          onClick={openSheet}
          className="mt-3 flex h-10 w-full items-center justify-center bg-[#334157] text-[12px] font-normal tracking-[-0.03em] text-white"
        >
          {mobileAdded ? 'Added ✓' : 'Select options'}
        </button>
      </div>

      {/* ── Mobile configurator drawer ─────────────────────────────────────── */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 transition-opacity duration-300"
            style={{ opacity: sheetVisible ? 1 : 0 }}
            onClick={closeSheet}
          />

          {/* Panel */}
          <div
            className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white px-5 pt-3 pb-6 transition-transform duration-300"
            style={{ transform: sheetVisible ? 'translateY(0)' : 'translateY(100%)' }}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#d8d1c4]" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium tracking-[-0.03em] text-[#4B4C4A]">
                  {product.name}
                </p>
                <p className="truncate text-[13px] tracking-[-0.03em] text-[#74756f]">
                  by {product.artist}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {/* Opt-in path to the full product page */}
                <Link
                  href={`/shop/${product.slug}`}
                  className="flex items-center gap-1 whitespace-nowrap text-[12px] tracking-[-0.03em] text-[#74756f] transition-colors hover:text-[#4B4C4A]"
                >
                  Product details
                  <span aria-hidden>→</span>
                </Link>
                <button
                  onClick={closeSheet}
                  aria-label="Close"
                  className="text-xl leading-none text-[#74756f]"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Live preview — reflects the chosen (or default) frame */}
            <div className="mx-auto mt-4 w-1/2 max-w-[190px]">
              <PosterFramePreview product={product} frame={previewFrame} />
            </div>

            {/* Frame selector */}
            <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.1em] text-[#74756f]">
              Framing
            </p>
            <div className="mt-2.5 flex items-start justify-between gap-2">
              {FRAMES.map((frame) => {
                const isSelected = sheetFrame === frame;
                return (
                  <button
                    key={frame}
                    onClick={() => setSheetFrame(frame)}
                    className="flex flex-1 flex-col items-center gap-1.5"
                  >
                    <span
                      className="relative overflow-hidden rounded-full"
                      style={{
                        width: 38,
                        height: 38,
                        outline: isSelected ? '1.5px solid #303030' : '1.5px solid transparent',
                        outlineOffset: '2px',
                      }}
                    >
                      <Image
                        src={`/frames/swatch-${frame}.webp`}
                        fill
                        sizes="38px"
                        className="object-cover"
                        alt=""
                      />
                    </span>
                    <span
                      className={`text-[11px] tracking-[-0.03em] ${
                        isSelected ? 'font-medium text-[#303030]' : 'text-[#74756f]'
                      }`}
                    >
                      {FRAME_LABELS[frame]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Size selector — each row shows its own price for the chosen frame */}
            <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.1em] text-[#74756f]">
              Size
            </p>
            <div className="mt-2.5 flex flex-col gap-2">
              {availableSizes.map((size) => {
                const v = getVariant(product, size, previewFrame);
                const isSelected = sheetSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSheetSize(size)}
                    className={`flex h-12 items-center justify-between border px-4 transition-colors ${
                      isSelected ? 'border-[#303030] bg-[#f6f4ef]' : 'border-[#d8d1c4]'
                    }`}
                  >
                    <span className="text-[13px] tracking-[-0.03em] text-[#4B4C4A]">
                      {SIZE_LABELS[size]}
                    </span>
                    <span className="text-[13px] tracking-[-0.03em] text-[#4B4C4A]">
                      {v ? format(v.priceGBP) : '—'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Add to Cart — locked until both size + frame are chosen */}
            <button
              onClick={handleSheetAdd}
              disabled={!sheetReady}
              className={`mt-5 flex h-12 w-full items-center justify-center text-[13px] font-normal tracking-[-0.03em] text-white transition-colors ${
                sheetReady ? 'bg-[#334157]' : 'cursor-not-allowed bg-[#334157]/40'
              }`}
            >
              {sheetReady && sheetVariant
                ? `Add to Cart · ${format(sheetVariant.priceGBP)}`
                : 'Select a size & frame'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
