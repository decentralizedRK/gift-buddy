'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/lib/cart-store';

interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  description: string;
}

interface ProductDetailClientProps {
  productId: string;
  productTitle: string;
  slug: string;
  image: string | null;
  variants: Variant[];
  stockStatus: string;
  moq: number;
}

export function ProductDetailClient({
  productId,
  productTitle,
  slug,
  image,
  variants,
  stockStatus,
  moq,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(moq);
  const [added, setAdded] = useState(false);

  const currentVariant = variants.find((v) => v.id === selectedVariant) ?? variants[0];
  const isOutOfStock = stockStatus === 'out_of_stock';

  function handleAddToCart() {
    addItem({
      productId,
      productTitle,
      slug,
      variantId: currentVariant?.id ?? null,
      variantName: currentVariant?.name ?? null,
      unitPrice: currentVariant?.price ?? 0,
      image,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleRequestQuote() {
    handleAddToCart();
    router.push('/inquiry');
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Variant Selector */}
      {variants.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Variant
          </label>
          <div className="flex flex-wrap gap-3">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariant(variant.id)}
                className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  selectedVariant === variant.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-foreground hover:border-primary/50'
                }`}
              >
                <span className="block">{variant.name}</span>
                <span className="block text-xs mt-0.5 opacity-75">
                  {formatPrice(variant.price)}
                </span>
              </button>
            ))}
          </div>
          {currentVariant && (
            <p className="mt-2 text-xs text-muted-foreground">
              {currentVariant.description}
            </p>
          )}
        </div>
      )}

      {/* Quantity Input */}
      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Quantity (min. {moq})
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(moq, q - 1))}
            disabled={quantity <= moq}
            className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <input
            id="quantity"
            type="number"
            min={moq}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val >= moq) setQuantity(val);
            }}
            className="w-20 h-10 text-center border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart / Inquiry Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="flex-1 px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Out of Stock' : added ? 'Added!' : 'Add to Cart'}
        </button>
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleRequestQuote}
          className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Request Quote
        </button>
      </div>
    </div>
  );
}
