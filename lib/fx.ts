import { CURRENCIES, FALLBACK_RATES, type Rates } from './currency';

// Fetches GBP-based exchange rates once a day (cached by Next's data cache).
// Uses Frankfurter (ECB data, free, no API key). Falls back to static rates
// if the lookup fails so the site never breaks on an FX outage.
export async function getRates(): Promise<Rates> {
  const symbols = CURRENCIES.filter((c) => c !== 'GBP').join(',');

  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=GBP&to=${symbols}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) throw new Error(`FX lookup failed: ${res.status}`);

    const data = (await res.json()) as { rates?: Record<string, number> };
    if (!data.rates) throw new Error('FX lookup returned no rates');

    return {
      GBP: 1,
      USD: data.rates.USD ?? FALLBACK_RATES.USD,
      EUR: data.rates.EUR ?? FALLBACK_RATES.EUR,
      CAD: data.rates.CAD ?? FALLBACK_RATES.CAD,
      AUD: data.rates.AUD ?? FALLBACK_RATES.AUD,
    };
  } catch (err) {
    console.error('[FX] Falling back to static rates:', err);
    return FALLBACK_RATES;
  }
}
