'use client';

import { useCurrency } from '@/lib/currency-context';
import { Currency } from '@/lib/currency';

export default function CurrencySwitcher({ transparent = false }: { transparent?: boolean }) {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <select
      aria-label="Currency"
      value={currency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
      className={[
        'bg-transparent text-[11px] sm:text-[12px] lg:text-[13px] font-normal tracking-[-0.03em]',
        'cursor-pointer outline-none transition-colors duration-300',
        transparent ? 'text-white' : 'text-[#4B4C4A]',
      ].join(' ')}
    >
      {currencies.map((c) => (
        <option key={c} value={c} className="text-[#4B4C4A]">
          {c}
        </option>
      ))}
    </select>
  );
}
