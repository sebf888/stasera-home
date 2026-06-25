// Site-wide currency presentation. Prices live in GBP pence everywhere (cart,
// checkout, Stripe). This module only handles *display* conversion for the
// catalogue. The actual charge is localised at checkout by Stripe Adaptive
// Pricing, so displayed prices are approximate — we add a small buffer and
// round up so the catalogue is never shown cheaper than the checkout total.

export const CURRENCIES = ['GBP', 'USD', 'EUR', 'CAD', 'AUD'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = 'GBP';

export const CURRENCY_COOKIE = 'stasera-currency';

// Units of <currency> per 1 GBP. GBP is always 1.
export type Rates = Record<Currency, number>;

// Used only if the live FX lookup fails. Approximate, refreshed occasionally.
export const FALLBACK_RATES: Rates = {
  GBP: 1,
  USD: 1.27,
  EUR: 1.17,
  CAD: 1.73,
  AUD: 1.92,
};

// ~3% cushion so catalogue prices sit at or above the live checkout conversion.
const FX_BUFFER = 1.03;

const CURRENCY_LOCALE: Record<Currency, string> = {
  GBP: 'en-GB',
  USD: 'en-US',
  EUR: 'de-DE',
  CAD: 'en-CA',
  AUD: 'en-AU',
};

const EUROZONE = [
  'AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE',
  'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES',
];

// Map an ISO country code to a display currency; anything unlisted shows GBP.
export function currencyForCountry(country: string | null | undefined): Currency {
  if (!country) return DEFAULT_CURRENCY;
  const c = country.toUpperCase();
  if (c === 'US') return 'USD';
  if (c === 'CA') return 'CAD';
  if (c === 'AU') return 'AUD';
  if (c === 'GB') return 'GBP';
  if (EUROZONE.includes(c)) return 'EUR';
  return DEFAULT_CURRENCY;
}

export function isCurrency(value: string | null | undefined): value is Currency {
  return !!value && (CURRENCIES as readonly string[]).includes(value);
}

// GBP pence -> formatted local-currency string.
export function formatMoney(pence: number, currency: Currency, rates: Rates): string {
  if (currency === 'GBP') {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(pence / 100);
  }

  const rate = rates[currency] ?? FALLBACK_RATES[currency] ?? 1;
  const converted = (pence / 100) * rate * FX_BUFFER;
  const rounded = Math.ceil(converted); // whole units, never below the converted value

  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(rounded);
}
