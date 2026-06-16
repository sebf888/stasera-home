import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import HeaderSpacer from "@/components/HeaderSpacer";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "Stasera",
  description: "Stasera — All Prints",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CartProvider>
          <Header />
          <HeaderSpacer />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
