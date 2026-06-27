'use client';

import { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Printing Process?',
    a: `We use giclée printing and archival pigment inks, so colours come out sharp and accurate and hold up over time.`,
  },
  {
    q: 'Quality?',
    a: `The print you get should look like what you saw on screen. We use heavyweight archival paper and pigment inks that resist fading for decades, and every order is checked before it ships.`,
  },
  {
    q: 'Paper or Canvas?',
    a: `Prints come on a few fine art papers (matte, satin and cotton rag), plus framed options in pine and lacquered finishes. Each has its own feel, so pick whatever suits your space.`,
  },
  {
    q: 'Lifespan?',
    a: `Our archival inks are rated to last for decades when kept out of direct sunlight and damp. Framing behind UV glass helps them last even longer.`,
  },
  {
    q: 'Shipping?',
    a: `Wherever you are, we can get a print to you. We work with production partners around the world who print close to your address and send it by tracked courier, so UK orders usually arrive in 3 to 6 business days and international orders in 7 to 14. Prints ship flat, wrapped in tissue and backed with board so they turn up in good shape.`,
  },
  {
    q: 'Returns?',
    a: `If your order turns up damaged or faulty, we'll replace or refund it. Just email info@stasera.digital with a photo within 14 days. Because each piece is produced individually for you, we can't take returns for a change of mind, but if something's wrong, get in touch and we'll sort it out.`,
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
