'use client';

import { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Printing Process?',
    a: 'Every print is produced through Gelato\'s network of certified print partners across the UK and Europe. We use giclée technology — archival-grade inks deposited at high resolution onto carefully selected substrates — ensuring faithful colour reproduction and prints built to last.',
  },
  {
    q: 'Quality?',
    a: 'We hold ourselves to one standard: the print you receive should look exactly as it does on screen. We use only museum-grade papers and pH-neutral pigment inks rated to resist fading for over 100 years under normal display conditions. Every order is inspected before dispatch.',
  },
  {
    q: 'Paper or Canvas?',
    a: 'Our prints are available on a range of premium fine art papers — matte, satin, and fine art cotton rag — as well as framed options with Ponderosa pine and lacquered finishes. Each material has its own character; explore our materials section to find the right fit for your space.',
  },
  {
    q: 'Lifespan?',
    a: 'All prints are produced with archival pigment inks rated to last in excess of 100 years when displayed away from direct sunlight and high humidity. For maximum longevity we recommend framing with UV-protective glass, which can extend the rated lifespan considerably.',
  },
  {
    q: 'Shipping?',
    a: 'Every print is made to order, then shipped via tracked courier. As a general guide, UK orders arrive within 3–6 business days and international orders within 7–14 business days from the order date. All prints are flat-packed in acid-free tissue and rigid board-backed packaging to arrive in perfect condition.',
  },
  {
    q: 'Returns?',
    a: 'We stand behind every print. If your order arrives damaged or defective we will replace it or refund it at no cost — just email info@stasera.digital with a photo within 14 days of delivery. As all prints are made to order we are unable to accept returns for change of mind, but please reach out and we will always do our best to find a resolution.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <section className="py-16 lg:py-20 px-5 sm:px-10 lg:px-[70px]">

      {/* Heading */}
      <div className="text-center mb-4 lg:mb-5">
        <h2 className="text-[36px] lg:text-[44px] font-medium tracking-[-0.03em] text-[#4B4C4A] leading-none">
          FAQs
        </h2>
        <p className="mt-1 text-[13px] font-normal tracking-[-0.03em] text-[#4B4C4A]">
          Learn more about <span className="font-medium">STASERA</span>home
        </p>
      </div>

      {/* Accordion */}
      <div className="max-w-4xl mx-auto border-t border-[#4B4C4A]">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="border-b border-[#4B4C4A]">

              {/* Row button */}
              <button
                onClick={() => toggle(i)}
                className={`group w-full flex items-center justify-between py-[4px] pr-6 transition-all duration-300 ease-in-out ${
                  isOpen ? 'bg-[#F8F8F8] pl-7' : 'bg-white pl-3 hover:bg-[#F8F8F8] hover:pl-7'
                }`}
              >
                <span
                  className={`text-[26px] lg:text-[28px] font-normal tracking-[-0.03em] text-[#303030] transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-2' : 'group-hover:translate-x-2'
                  }`}
                >
                  {item.q}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-9 w-7 flex-shrink-0 transition-transform duration-500 ease-in-out origin-center ${
                    isOpen ? 'rotate-90' : 'group-hover:rotate-90'
                  }`}
                  fill="none"
                  stroke="#4B4C4A"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 4l8 8-8 8" />
                </svg>
              </button>

              {/* Expanded answer */}
              {isOpen && (
                <div className="bg-[#F8F8F8] pl-9 pr-10 lg:pr-24 pb-6">
                  <p className="text-[13px] font-normal tracking-[-0.03em] text-[#4B4C4A] leading-[1.6] max-w-2xl">
                    {item.a}
                  </p>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </section>
  );
}
