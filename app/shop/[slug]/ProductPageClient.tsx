'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Product,
  Size,
  Frame,
  FRAMES,
  SIZE_LABELS,
  getVariant,
} from '@/data/products';
import { useCart } from '@/lib/cart-context';
import { useCurrency } from '@/lib/currency-context';

const FRAME_SHORT: Record<Frame, string> = {
  none:  'No Frame',
  black: 'Black',
  white: 'White',
  wood:  'Natural Wood',
};

export default function ProductPageClient({ product }: { product: Product }) {
  const availableSizes = [...new Set(product.variants.map((v) => v.size))] as Size[];
  const [selectedSize, setSelectedSize] = useState<Size>(availableSizes[0]);
  const [selectedFrame, setSelectedFrame] = useState<Frame>('black');
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addItem } = useCart();
  const { format } = useCurrency();

  useEffect(() => {
    return () => { if (resetTimer.current) clearTimeout(resetTimer.current); };
  }, []);

  const variant = getVariant(product, selectedSize, selectedFrame);
  const price = variant ? format(variant.priceGBP) : '—';

  function handleAddToCart() {
    if (!variant) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      artist: product.artist,
      image: product.images[0],
      printFileUrl: product.printFileUrl ?? '',
      size: selectedSize,
      frame: selectedFrame,
      priceGBP: variant.priceGBP,
      gelatoProductUid: variant.gelatoProductUid,
      stripePriceId: variant.stripePriceId,
    });
    setAdded(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setAdded(false), 1400);
  }

  return (
    <main className="px-5 sm:px-10 lg:px-[130px] xl:px-[160px] py-8 lg:py-14">
      <nav className="mb-8">
        <Link
          href="/shop"
          className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] opacity-40 hover:opacity-100 transition-opacity"
        >
          ← All Prints
        </Link>
      </nav>

      <div className="lg:grid lg:grid-cols-[2fr_3fr] gap-14 xl:gap-16 items-start">

        {/* Gallery */}
        <div className="mb-12 lg:mb-0">
          <div>
            {activeImage === 0 ? (
              <div className="relative w-full" style={{ aspectRatio: '8/11' }}>
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
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    alt={product.name}
                    priority
                  />
                </div>
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
                  <Image
                    src={`/frames/frame-${product.format}-${selectedFrame === 'none' ? 'black' : selectedFrame}.webp`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    alt=""
                    priority
                  />
                </div>
              </div>
            ) : (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                width={700}
                height={980}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="w-full h-auto"
              />
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 mt-5 flex-wrap">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className="relative w-[58px] h-[81px] flex-shrink-0 overflow-hidden"
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="58px" />
                  <span
                    className="absolute inset-0 border transition-colors duration-150"
                    style={{ borderColor: activeImage === i ? '#4B4C4A' : 'transparent' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-10">
          <h1 className="text-[24px] lg:text-[28px] font-medium tracking-[-0.03em] text-[#4B4C4A] leading-tight">
            {product.name}
          </h1>
          <p className="mt-1.5 text-[13px] font-normal tracking-[-0.03em] text-[#4B4C4A] opacity-50">
            by {product.artist}
          </p>

          <p className="mt-5 text-[18px] font-medium tracking-[-0.03em] text-[#4B4C4A]">
            {price}
          </p>

          {/* Size selector */}
          <div className="mt-7">
            <p className="text-[11px] uppercase tracking-[0.1em] text-[#4B4C4A] opacity-40 mb-3">
              Size · <span className="normal-case tracking-[-0.03em]">{SIZE_LABELS[selectedSize]}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-[9px] text-[12px] tracking-[-0.03em] border transition-all ${
                    selectedSize === size
                      ? 'border-[#4B4C4A] text-[#4B4C4A]'
                      : 'border-[#D8D8D8] text-[#4B4C4A] opacity-45 hover:opacity-80 hover:border-[#B0B0B0]'
                  }`}
                >
                  {SIZE_LABELS[size]}
                </button>
              ))}
            </div>
          </div>

          {/* Frame selector */}
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.1em] text-[#4B4C4A] opacity-40 mb-3">
              Frame · <span className="normal-case tracking-[-0.03em]">{FRAME_SHORT[selectedFrame]}</span>
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              {FRAMES.map((frame) => {
                const isSelected = selectedFrame === frame;
                return (
                  <button
                    key={frame}
                    onClick={() => setSelectedFrame(frame)}
                    className="flex items-center gap-2 group"
                    aria-label={FRAME_SHORT[frame]}
                  >
                    <span
                      className="relative rounded-full overflow-hidden flex-shrink-0"
                      style={{
                        width: 30,
                        height: 30,
                        outline: isSelected ? '1.5px solid #4B4C4A' : '1.5px solid transparent',
                        outlineOffset: '2px',
                      }}
                    >
                      <Image
                        src={`/frames/swatch-${frame}.webp`}
                        fill
                        sizes="30px"
                        className="object-cover"
                        alt=""
                      />
                    </span>
                    <span
                      className={`text-[12px] tracking-[-0.03em] transition-opacity ${
                        isSelected
                          ? 'text-[#4B4C4A] opacity-100'
                          : 'text-[#4B4C4A] opacity-35 group-hover:opacity-65'
                      }`}
                    >
                      {FRAME_SHORT[frame]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!variant}
            className="mt-8 w-full bg-[#334157] text-white text-[13px] font-normal tracking-[-0.03em] py-[14px] hover:opacity-90 transition-opacity disabled:opacity-40 relative overflow-hidden"
          >
            <span className={`transition-opacity duration-200 ${added ? 'opacity-0' : 'opacity-100'}`}>
              Add to Cart
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center text-[17px] transition-opacity duration-200 ${
                added ? 'opacity-100' : 'opacity-0'
              }`}
            >
              ✓
            </span>
          </button>

          {/* Short description */}
          {product.description && (
            <p className="mt-8 text-[13px] leading-[1.75] tracking-[-0.03em] text-[#4B4C4A] opacity-60">
              {product.description}
            </p>
          )}

          {/* Accordion */}
          <div className="mt-8 border-t border-[#EBEBEB]">
            {product.descriptions?.productDetails && (
              <AccordionItem title="Product Details" body={product.descriptions.productDetails} />
            )}
            {product.descriptions?.aboutArtist && (
              <AccordionItem title="About the Artist" body={product.descriptions.aboutArtist} />
            )}
            {product.descriptions?.deliveryAndReturns && (
              <AccordionItem title="Delivery & Returns" body={product.descriptions.deliveryAndReturns} />
            )}
          </div>
        </div>

      </div>
    </main>
  );
}

function AccordionItem({ title, body }: { title: string; body: string }) {
  return (
    <details className="group border-b border-[#EBEBEB]">
      <summary className="flex items-center justify-between py-4 cursor-pointer list-none select-none">
        <span className="text-[12px] font-medium tracking-[-0.03em] text-[#4B4C4A]">{title}</span>
        <span className="text-[#4B4C4A] opacity-40 text-[18px] leading-none transition-transform duration-200 group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="pb-5 text-[12px] leading-[1.75] tracking-[-0.03em] text-[#4B4C4A] opacity-55">
        {body}
      </p>
    </details>
  );
}
