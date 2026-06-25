'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  Currency,
  Rates,
  CURRENCIES,
  CURRENCY_COOKIE,
  formatMoney,
} from './currency';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  currencies: readonly Currency[];
  /** GBP pence -> formatted local-currency string. */
  format: (pence: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  initialCurrency,
  rates,
  children,
}: {
  initialCurrency: Currency;
  rates: Rates;
  children: ReactNode;
}) {
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    // Persist the choice for a year so it sticks across visits and overrides geo.
    document.cookie = `${CURRENCY_COOKIE}=${c}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const format = useCallback(
    (pence: number) => formatMoney(pence, currency, rates),
    [currency, rates]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencies: CURRENCIES, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within <CurrencyProvider>');
  return ctx;
}
