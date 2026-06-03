'use client';

import { useState, useRef, useEffect } from 'react';

type Tab = 'poster' | 'canvas';

interface MaterialItem {
  name: string;
  headline: string;
  description: string;
  popular?: boolean;
}

const POSTER_MATERIALS: MaterialItem[] = [
  {
    name: 'Matte Paper',
    headline: 'Clean. Timeless.',
    description:
      'Archival 200gsm matte stock with zero glare — your print, nothing else between you and the image.',
  },
  {
    name: 'Satin Paper',
    headline: 'Vivid. Refined.',
    description:
      'A semi-gloss finish that deepens colour and adds quiet luminosity without being brash.',
    popular: true,
  },
  {
    name: 'Fine Art Rag',
    headline: 'Museum Grade.',
    description:
      '308gsm 100% cotton rag — archival, acid-free, and built to last generations on the wall.',
  },
  {
    name: 'Velvet Cotton',
    headline: 'Soft. Tactile.',
    description:
      'A warm, velvety texture that gives every image a painterly, collectible quality.',
  },
];

const CANVAS_MATERIALS: MaterialItem[] = [
  {
    name: 'Raw Ponderosa Frame',
    headline: 'Natural. Unfinished.',
    description:
      'Sustainably sourced Ponderosa pine left in its natural state — warm, honest, and effortlessly present.',
    popular: true,
  },
  {
    name: 'Brushed Ponderosa Frame',
    headline: 'Tactile. Warm.',
    description:
      'Lightly sanded with a hand-brushed finish that reveals the grain without overpowering the print.',
  },
  {
    name: 'Black Lacquer Frame',
    headline: 'Bold. Precise.',
    description:
      'Ultra-matte black lacquer that disappears into the wall and puts the art front and centre.',
  },
  {
    name: 'White Oak Frame',
    headline: 'Cool. Contemporary.',
    description:
      'Pale hardwood with a smooth open grain — pairs with any interior without competing.',
  },
];

const CARD_WIDTH = 260;
const CARD_GAP = 24;
const SCROLL_STEP = CARD_WIDTH + CARD_GAP;

export default function MaterialsSection() {
  const [activeTab, setActiveTab] = useState<Tab>('poster');
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const materials = activeTab === 'poster' ? POSTER_MATERIALS : CANVAS_MATERIALS;

  function syncArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    setCanLeft(false);
    setCanRight(el.scrollWidth > el.clientWidth);
  }, [activeTab]);

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
  }

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
  }

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
  }

  return (
    <section className="py-16 lg:py-20 px-5 sm:px-10 lg:px-[70px]">
      <div className="flex flex-col lg:flex-row lg:gap-16">

        {/* Left sidebar */}
        <div className="lg:w-[200px] lg:flex-shrink-0 mb-8 lg:mb-0">
          <h2 className="text-[22px] lg:text-[24px] font-normal tracking-[-0.03em] text-[#4B4C4A] leading-[1.2]">
            Only the{' '}
            <span className="font-medium">highest-quality<br />materials</span>
            , period.
          </h2>

          <div className="flex items-center gap-3 mt-5">
            {(['poster', 'canvas'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`text-[13px] tracking-[-0.03em] px-4 py-[5px] transition-opacity ${
                  activeTab === tab
                    ? 'border border-[#4B4C4A] text-[#4B4C4A]'
                    : 'border border-transparent text-[#4B4C4A] opacity-40'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Right column: cards + arrows */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-none"
            onScroll={syncArrows}
          >
            <div className="flex gap-5 lg:gap-6">
              {materials.map((item) => (
                <div key={item.name} className="flex-shrink-0 w-[230px] lg:w-[260px]">

                  {/* Square placeholder image */}
                  <div className="relative aspect-square bg-[#D4D4D2] flex items-center justify-center">
                    <span className="text-[13px] tracking-[-0.03em] text-[#4B4C4A] text-center px-4 leading-snug">
                      {item.name}
                    </span>
                    {item.popular && (
                      <span className="absolute bottom-3 left-3 bg-[#4B4C4A] text-white text-[9px] tracking-[0.1em] uppercase px-[7px] py-[3px]">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Card text */}
                  <p className="mt-3 text-[13px] font-medium tracking-[-0.03em] text-[#4B4C4A]">
                    {item.headline}
                  </p>
                  <p className="mt-1 text-[12px] font-normal tracking-[-0.03em] text-[#4B4C4A] leading-[1.45]">
                    {item.description}
                  </p>
                  <a
                    href="#"
                    className="inline-block mt-3 text-[11px] font-medium tracking-[-0.03em] text-[#4B4C4A] uppercase underline underline-offset-2"
                  >
                    Shop Now
                  </a>

                </div>
              ))}
            </div>
          </div>

          {/* Arrow controls */}
          <div className="flex justify-end gap-4 mt-5">
            <button
              onClick={scrollLeft}
              disabled={!canLeft}
              aria-label="Scroll left"
              className={`text-[20px] leading-none text-[#4B4C4A] transition-opacity select-none ${
                canLeft ? 'opacity-100 cursor-pointer' : 'opacity-25 cursor-default'
              }`}
            >
              &#8249;
            </button>
            <button
              onClick={scrollRight}
              disabled={!canRight}
              aria-label="Scroll right"
              className={`text-[20px] leading-none text-[#4B4C4A] transition-opacity select-none ${
                canRight ? 'opacity-100 cursor-pointer' : 'opacity-25 cursor-default'
              }`}
            >
              &#8250;
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
