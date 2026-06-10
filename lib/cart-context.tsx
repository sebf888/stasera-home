'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Size, Frame } from '@/data/products';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  artist: string;
  image: string;
  printFileUrl: string;
  size: Size;
  frame: Frame;
  priceGBP: number;
  gelatoProductUid: string;
  stripePriceId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, size: Size, frame: Frame) => void;
  updateQuantity: (productId: string, size: Size, frame: Frame, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalGBP: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'stasera-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((incoming: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const idx = prev.findIndex(
        i =>
          i.productId === incoming.productId &&
          i.size === incoming.size &&
          i.frame === incoming.frame
      );
      if (idx >= 0) {
        return prev.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...incoming, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string, size: Size, frame: Frame) => {
    setItems(prev =>
      prev.filter(
        i => !(i.productId === productId && i.size === size && i.frame === frame)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: Size, frame: Frame, qty: number) => {
      if (qty <= 0) {
        removeItem(productId, size, frame);
        return;
      }
      setItems(prev =>
        prev.map(i =>
          i.productId === productId && i.size === size && i.frame === frame
            ? { ...i, quantity: qty }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalGBP = items.reduce((sum, i) => sum + i.priceGBP * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotalGBP }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
