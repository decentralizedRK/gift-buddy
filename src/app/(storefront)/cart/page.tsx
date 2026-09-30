'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-store';
import { formatPrice } from '@/lib/format';
import { imagePath } from '@/lib/image-path';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, subtotal } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-10 w-10 text-muted-foreground"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Your cart is empty
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse our curated collection of corporate gift hampers and add items
          to get started.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Your Cart
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-destructive hover:text-destructive/80 transition-colors"
          aria-label="Remove all items from cart"
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-border rounded-xl border border-border bg-background">
        {items.map((item) => {
          const key = item.variantId
            ? `${item.productId}::${item.variantId}`
            : item.productId;

          return (
            <div
              key={key}
              className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6"
            >
              <div className="flex-shrink-0 h-24 w-24 rounded-lg bg-muted relative overflow-hidden">
                {item.image ? (
                  <Image
                    src={imagePath(item.image)}
                    alt={item.productTitle}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-muted-foreground/40" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Item details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.productTitle}
                    </Link>
                    {item.variantName && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Variant: {item.variantName}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {formatPrice(item.unitPrice)} each
                    </p>
                  </div>
                  <p className="text-base font-bold text-foreground whitespace-nowrap">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <label className="sr-only" htmlFor={`qty-${key}`}>
                      Quantity for {item.productTitle}
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity - 1,
                            )
                          : removeItem(item.productId, item.variantId)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground/70 hover:bg-muted transition-colors"
                      aria-label={`Decrease quantity of ${item.productTitle}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                    </button>
                    <input
                      id={`qty-${key}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!Number.isNaN(val) && val >= 1) {
                          updateQuantity(item.productId, item.variantId, val);
                        }
                      }}
                      className="h-8 w-14 rounded-md border border-border bg-background text-center text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity + 1,
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground/70 hover:bg-muted transition-colors"
                      aria-label={`Increase quantity of ${item.productTitle}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.productId, item.variantId)
                    }
                    className="text-sm text-destructive hover:text-destructive/80 transition-colors"
                    aria-label={`Remove ${item.productTitle} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-xl border border-border bg-background p-6">
        <div className="flex items-center justify-between text-base">
          <span className="text-muted-foreground">
            Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
          <span className="text-xl font-bold text-foreground">
            {formatPrice(subtotal)}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Final corporate pricing is subject to confirmation after inquiry
          review.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <Link
            href="/inquiry"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Proceed to Inquiry
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
