'use client';

import {
  createElement,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { MAX_CART_ITEMS } from './constants';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface CartItem {
  productId: string;
  productTitle: string;
  slug: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  /** Price in paise */
  unitPrice: number;
  image: string | null;
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQuantity: (
    productId: string,
    variantId: string | null,
    quantity: number,
  ) => void;
  clearCart: () => void;
  totalItems: number;
  /** Subtotal in paise */
  subtotal: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'gift-buddy-cart';

function itemKey(productId: string, variantId: string | null): string {
  return variantId ? `${productId}::${variantId}` : productId;
}

function readCart(): CartItem[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Minimal runtime validation — keep entries that have the required shape.
    return parsed.filter(
      (entry: unknown): entry is CartItem =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as CartItem).productId === 'string' &&
        typeof (entry as CartItem).quantity === 'number',
    );
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or blocked — silently degrade.
  }
}

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

const CartContext = createContext<CartContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount.
  useEffect(() => {
    setItems(readCart());
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change (after initial hydration).
  useEffect(() => {
    if (hydrated) {
      writeCart(items);
    }
  }, [items, hydrated]);

  /* ---------- Actions ---------- */

  const addItem = useCallback(
    (incoming: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      setItems((prev) => {
        const key = itemKey(incoming.productId, incoming.variantId);
        const existing = prev.find(
          (i) => itemKey(i.productId, i.variantId) === key,
        );
        const addQty = incoming.quantity ?? 1;

        if (existing) {
          return prev.map((i) =>
            itemKey(i.productId, i.variantId) === key
              ? { ...i, quantity: i.quantity + addQty }
              : i,
          );
        }

        if (prev.length >= MAX_CART_ITEMS) return prev;

        return [
          ...prev,
          {
            productId: incoming.productId,
            productTitle: incoming.productTitle,
            slug: incoming.slug,
            variantId: incoming.variantId,
            variantName: incoming.variantName,
            unitPrice: incoming.unitPrice,
            image: incoming.image,
            quantity: addQty,
          },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback(
    (productId: string, variantId: string | null) => {
      setItems((prev) => {
        const key = itemKey(productId, variantId);
        return prev.filter((i) => itemKey(i.productId, i.variantId) !== key);
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string | null, quantity: number) => {
      if (quantity < 1) return;
      setItems((prev) => {
        const key = itemKey(productId, variantId);
        return prev.map((i) =>
          itemKey(i.productId, i.variantId) === key ? { ...i, quantity } : i,
        );
      });
    },
    [],
  );

  const clearCart = useCallback(() => setItems([]), []);

  /* ---------- Derived ---------- */

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0,
  );

  return createElement(
    CartContext,
    { value: { items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal } },
    children,
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                              */
/* ------------------------------------------------------------------ */

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
