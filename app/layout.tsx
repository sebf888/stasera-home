import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeaderSpacer from "@/components/HeaderSpacer";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import { CurrencyProvider } from "@/lib/currency-context";
import { getRates } from "@/lib/fx";
import { currencyForCountry, isCurrency, type Currency } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Stasera",
  description: "Stasera — All Prints",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cookieStore, headerStore, rates] = await Promise.all([
    cookies(),
    headers(),
    getRates(),
  ]);

  // An explicit choice (cookie) wins; otherwise detect from geo headers.
  // Behind Cloudflare the reliable signal is `cf-ipcountry`; Vercel's own
  // header is the fallback.
  const saved = cookieStore.get("stasera-currency")?.value;
  const country =
    headerStore.get("cf-ipcountry") ?? headerStore.get("x-vercel-ip-country");
  const currency: Currency = isCurrency(saved)
    ? saved
    : currencyForCountry(country);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CurrencyProvider initialCurrency={currency} rates={rates}>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <HeaderSpacer />
            {children}
            <Footer />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
